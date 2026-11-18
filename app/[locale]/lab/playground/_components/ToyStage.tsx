"use client";

import { Environment, Lightformer } from "@react-three/drei";
import { Canvas, type ThreeEvent, useFrame, useThree } from "@react-three/fiber";
import { type RefObject, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

import type { LocalizedService, ServiceId } from "../_content/copy";
import {
  HOME_LANDSCAPE,
  HOME_PORTRAIT,
  PORTRAIT_MAX_ASPECT,
  PORTRAIT_SCALE,
} from "../_content/layout";
import { emitCursor } from "./cursorEvents";
import {
  type Body,
  PHYSICS,
  containsPoint,
  createBody,
  grab,
  release,
  setLayout,
  setSquashMode,
  step,
} from "./physics";
import { SHADOW_OFFSET, Toy, type ToyHandlers, WALL_Z } from "./toys/Toy";

/** A press that ends within this time and travel counts as a click. */
const CLICK_MAX_MS = 250;
const CLICK_MAX_PX = 6;

/** Re-raycast against a resting pointer every few frames so hover tracks moving toys. */
const HOVER_REFRESH_FRAMES = 3;
/**
 * A toy only counts as un-hovered once the pointer has been off it this long.
 * R3F reports a brief miss whenever a moving toy's edge slips past a resting
 * pointer, and without this grace the cursor label and squash would flicker.
 */
const HOVER_OUT_DELAY_MS = 120;

export interface ToyStageProps {
  services: readonly LocalizedService[];
  /** Cursor label verb, e.g. "Grab me". */
  grabLabel: string;
  reduced: boolean;
  coarse: boolean;
  onSelect: (id: ServiceId) => void;
  /** Called once, after the canvas has painted its first frame. */
  onReady: () => void;
}

/** What R3F hands back as `event.target`: a thin wrapper over pointer capture. */
interface CaptureTarget {
  setPointerCapture: (pointerId: number) => void;
}

interface PressState {
  index: number;
  pointerId: number;
  /** The press picked the toy up (fine pointer, motion allowed). */
  drag: boolean;
  startedAt: number;
  startX: number;
  startY: number;
}

interface PointerTrack {
  clientX: number;
  clientY: number;
  type: string;
  /** False until the pointer first moves, and again once it leaves the window. */
  seen: boolean;
}

/** Development-only handle used by the smoke tests. */
interface PgDebugToy {
  id: ServiceId;
  x: number;
  y: number;
  homeX: number;
  homeY: number;
  screenX: number;
  screenY: number;
  homeScreenX: number;
  homeScreenY: number;
  dragging: boolean;
  scale: number;
}

declare global {
  interface Window {
    __pgDebug?: { toys: () => PgDebugToy[]; frames: () => number };
  }
}

/** The page cursor is global state, so it is set from a plain function. */
function setBodyCursor(value: string): void {
  document.body.style.cursor = value;
}

/* Reusable scratch values: nothing is allocated per frame or per event. */
const scratchVector = new THREE.Vector3();
const scratchDirection = new THREE.Vector3();

/**
 * Maps a client position onto the z = 0 plane of the scene by unprojecting
 * through the camera and walking the ray down to the plane.
 */
function clientToWorld(
  clientX: number,
  clientY: number,
  rect: DOMRect,
  camera: THREE.Camera,
  out: { x: number; y: number },
): void {
  const ndcX = ((clientX - rect.left) / rect.width) * 2 - 1;
  const ndcY = -(((clientY - rect.top) / rect.height) * 2 - 1);
  scratchVector.set(ndcX, ndcY, 0.5).unproject(camera);
  scratchDirection.copy(scratchVector).sub(camera.position).normalize();
  const distance = -camera.position.z / scratchDirection.z;
  out.x = camera.position.x + scratchDirection.x * distance;
  out.y = camera.position.y + scratchDirection.y * distance;
}

/**
 * Soft white blob; the toy color is applied by the material. The alpha carries
 * a little noise (about one output step) so the faint gradient dithers instead
 * of banding into rings once it is blended at 20% opacity.
 */
function createShadowTexture(): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext("2d");
  if (context) {
    const gradient = context.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    gradient.addColorStop(0, "rgba(255,255,255,1)");
    gradient.addColorStop(0.3, "rgba(255,255,255,0.7)");
    gradient.addColorStop(0.62, "rgba(255,255,255,0.16)");
    gradient.addColorStop(1, "rgba(255,255,255,0)");
    context.fillStyle = gradient;
    context.fillRect(0, 0, size, size);

    const image = context.getImageData(0, 0, size, size);
    let seed = 1;
    for (let i = 3; i < image.data.length; i += 4) {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      const noise = (seed / 0xffffffff - 0.5) * 12;
      image.data[i] = Math.max(0, Math.min(255, image.data[i] + noise));
    }
    context.putImageData(image, 0, 0);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/** Tracks whether an element is on screen, without setting state in an effect body. */
function useIsIntersecting(ref: RefObject<HTMLElement | null>): boolean {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref]);
  return visible;
}

/**
 * The WebGL half of the hero: six toys on a transparent canvas, lit by an
 * environment built only from Lightformers (nothing is fetched from a CDN).
 */
export default function ToyStage(props: ToyStageProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const onScreen = useIsIntersecting(wrapperRef);
  const frameloop = props.reduced ? "demand" : onScreen ? "always" : "never";

  return (
    <div ref={wrapperRef} className="pg-stage__canvas">
      <Canvas
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        camera={{ fov: 30, position: [0, 0, 14] }}
        frameloop={frameloop}
        onCreated={({ gl }) => {
          // Neutral keeps the saturated service colors honest where ACES dulls them.
          gl.toneMapping = THREE.NeutralToneMapping;
          gl.toneMappingExposure = 1;
        }}
      >
        <Scene {...props} />
      </Canvas>
    </div>
  );
}

function Scene({ services, grabLabel, reduced, coarse, onSelect, onReady }: ToyStageProps) {
  const getState = useThree((state) => state.get);

  const shadowTexture = useMemo(() => createShadowTexture(), []);
  useEffect(() => () => shadowTexture.dispose(), [shadowTexture]);

  /* Simulation state lives in refs: it changes every frame and never renders. */
  const bodiesRef = useRef<Body[] | null>(null);
  if (bodiesRef.current === null) {
    bodiesRef.current = services.map((_, index) => createBody(index * 1.7 + 0.4));
  }
  const groupRefs = useRef<(THREE.Group | null)[]>([]);
  const shadowRefs = useRef<(THREE.Mesh | null)[]>([]);
  const pointerRef = useRef<PointerTrack>({ clientX: 0, clientY: 0, type: "mouse", seen: false });
  const worldPointerRef = useRef({ x: 0, y: 0, inside: false });
  const pressRef = useRef<PressState | null>(null);
  const hoverRef = useRef(-1);
  const hoverOutTimer = useRef<number | undefined>(undefined);
  const timeRef = useRef(0);
  const framesRef = useRef(0);
  const readyRef = useRef(false);

  /** Fine pointers can pick a toy up and throw it; the rest can only tap. */
  const dragEnabled = !reduced && !coarse;

  /* Global pointer tracking, press release, and the development debug handle. */
  useEffect(() => {
    const bodies = bodiesRef.current;
    if (!bodies) return;
    const track = pointerRef.current;
    const scratch = { x: 0, y: 0 };

    const onMove = (event: PointerEvent) => {
      track.clientX = event.clientX;
      track.clientY = event.clientY;
      track.type = event.pointerType;
      track.seen = true;
    };
    const onLeave = () => {
      track.seen = false;
    };

    const onRelease = (event: PointerEvent) => {
      const press = pressRef.current;
      if (!press || event.pointerId !== press.pointerId) return;
      pressRef.current = null;

      const body = bodies[press.index];
      if (!press.drag) {
        setSquashMode(body, hoverRef.current === press.index ? "hover" : "idle");
        return;
      }

      release(body);
      const quick = performance.now() - press.startedAt <= CLICK_MAX_MS;
      const still = Math.hypot(event.clientX - press.startX, event.clientY - press.startY) < CLICK_MAX_PX;
      if (event.type === "pointerup" && quick && still) onSelect(services[press.index].id);

      // Decide hover straight away; R3F drops its own hover state on release.
      const { camera, gl } = getState();
      clientToWorld(event.clientX, event.clientY, gl.domElement.getBoundingClientRect(), camera, scratch);
      const over = event.pointerType !== "touch" && containsPoint(body, scratch.x, scratch.y);
      hoverRef.current = over ? press.index : -1;
      setSquashMode(body, over ? "hover" : "idle");
      setBodyCursor(over ? "grab" : "");
      if (!over) emitCursor(null);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerup", onRelease);
    window.addEventListener("pointercancel", onRelease);
    window.addEventListener("blur", onLeave);
    document.documentElement.addEventListener("pointerleave", onLeave);

    if (process.env.NODE_ENV !== "production") {
      const project = (x: number, y: number) => {
        const { camera, gl } = getState();
        const rect = gl.domElement.getBoundingClientRect();
        scratchVector.set(x, y, 0).project(camera);
        return {
          x: rect.left + ((scratchVector.x + 1) / 2) * rect.width,
          y: rect.top + ((1 - scratchVector.y) / 2) * rect.height,
        };
      };
      window.__pgDebug = {
        frames: () => framesRef.current,
        toys: () =>
          bodies.map((body, index) => {
            const at = project(body.x, body.y);
            const home = project(body.homeX, body.homeY);
            return {
              id: services[index].id,
              x: body.x,
              y: body.y,
              homeX: body.homeX,
              homeY: body.homeY,
              screenX: at.x,
              screenY: at.y,
              homeScreenX: home.x,
              homeScreenY: home.y,
              dragging: body.dragging,
              scale: body.scale,
            };
          }),
      };
    }

    return () => {
      window.clearTimeout(hoverOutTimer.current);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onRelease);
      window.removeEventListener("pointercancel", onRelease);
      window.removeEventListener("blur", onLeave);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      setBodyCursor("");
      emitCursor(null);
      delete window.__pgDebug;
    };
  }, [getState, onSelect, services]);

  useFrame((state, delta) => {
    const bodies = bodiesRef.current;
    if (!bodies) return;
    const { viewport, camera, gl } = state;

    /* Layout: homes are fractions of the viewport, so a resize just re-targets them. */
    const portrait = viewport.width / viewport.height <= PORTRAIT_MAX_ASPECT;
    const homes = portrait ? HOME_PORTRAIT : HOME_LANDSCAPE;
    // Keep neighbouring toys from touching on narrow screens.
    const scale = portrait ? Math.min(PORTRAIT_SCALE, 0.18 * viewport.width) : 1;
    services.forEach((service, index) => {
      const [fx, fy] = homes[service.id];
      setLayout(bodies[index], fx * viewport.width, fy * viewport.height, scale);
    });

    /* Pointer in world space, and whether it is over the hero. */
    const track = pointerRef.current;
    const world = worldPointerRef.current;
    const rect = gl.domElement.getBoundingClientRect();
    if (track.seen) clientToWorld(track.clientX, track.clientY, rect, camera, world);
    world.inside =
      !reduced &&
      track.seen &&
      track.type !== "touch" &&
      track.clientX >= rect.left &&
      track.clientX <= rect.right &&
      track.clientY >= rect.top &&
      track.clientY <= rect.bottom;

    timeRef.current += Math.min(delta, PHYSICS.maxDt);
    step(bodies, {
      dt: delta,
      time: timeRef.current,
      pointer: world,
      bounds: { halfW: viewport.width / 2, halfH: viewport.height / 2 },
      reducedMotion: reduced,
    });

    /* Copy the simulation onto the meshes. */
    const depthScale = (camera.position.z - WALL_Z) / camera.position.z;
    bodies.forEach((body, index) => {
      const group = groupRefs.current[index];
      if (group) {
        group.position.set(body.x, body.y, 0);
        group.rotation.set(body.rotX, body.rotY, body.rotZ);
        group.scale.set(
          body.scale * body.squashX,
          body.scale * body.squashY,
          body.scale * ((body.squashX + body.squashY) / 2),
        );
      }
      const shadow = shadowRefs.current[index];
      if (shadow) {
        // The wall is farther than the toy, so everything shrinks toward the
        // center by the perspective ratio; compensate to keep the offset true.
        shadow.position.set(
          (body.x + SHADOW_OFFSET.x * body.scale) * depthScale,
          (body.y + SHADOW_OFFSET.y * body.scale) * depthScale,
          WALL_Z,
        );
        shadow.scale.setScalar(body.scale * depthScale);
      }
    });

    framesRef.current += 1;
    if (world.inside && !pressRef.current && framesRef.current % HOVER_REFRESH_FRAMES === 0) {
      state.events.update?.();
    }

    if (!readyRef.current) {
      readyRef.current = true;
      // Two animation frames: the first lets this frame reach the screen.
      requestAnimationFrame(() => requestAnimationFrame(onReady));
    }
  });

  /** Drops a toy's hover look: squash back to rest, cursor reset, label cleared. */
  const endHover = (index: number) => {
    hoverRef.current = -1;
    const body = bodiesRef.current?.[index];
    if (body) setSquashMode(body, "idle");
    setBodyCursor("");
    emitCursor(null);
  };

  const handlersFor = (index: number): ToyHandlers => {
    const service = services[index];
    const bodyAt = () => bodiesRef.current?.[index];
    return {
      onPointerOver: (event) => {
        event.stopPropagation();
        if (event.pointerType === "touch") return;
        window.clearTimeout(hoverOutTimer.current);
        if (hoverRef.current === index) return;
        if (hoverRef.current !== -1) endHover(hoverRef.current);
        hoverRef.current = index;
        const body = bodyAt();
        if (body && !reduced && !pressRef.current) setSquashMode(body, "hover");
        setBodyCursor(dragEnabled ? "grab" : "pointer");
        emitCursor({ label: `${grabLabel} · ${service.name}`, color: service.hex });
      },
      onPointerOut: () => {
        // A held toy stays pressed and keeps its cursor until it is released.
        if (pressRef.current?.index === index) return;
        window.clearTimeout(hoverOutTimer.current);
        hoverOutTimer.current = window.setTimeout(() => {
          if (hoverRef.current === index) endHover(index);
        }, HOVER_OUT_DELAY_MS);
      },
      onPointerDown: (event: ThreeEvent<PointerEvent>) => {
        event.stopPropagation();
        const body = bodyAt();
        if (!body) return;

        const press: PressState = {
          index,
          pointerId: event.pointerId,
          drag: false,
          startedAt: performance.now(),
          startX: event.clientX,
          startY: event.clientY,
        };

        if (dragEnabled && event.pointerType !== "touch") {
          (event.target as unknown as CaptureTarget).setPointerCapture(event.pointerId);
          const { camera, gl } = getState();
          const pointer = { x: 0, y: 0 };
          clientToWorld(event.clientX, event.clientY, gl.domElement.getBoundingClientRect(), camera, pointer);
          grab(body, pointer.x, pointer.y);
          press.drag = true;
          setBodyCursor("grabbing");
        }

        pressRef.current = press;
        if (!reduced) setSquashMode(body, "press");
      },
      onClick: (event) => {
        // With drag enabled the release handler decides what counts as a click.
        if (dragEnabled) return;
        event.stopPropagation();
        onSelect(service.id);
      },
    };
  };

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[3, 5, 6]} intensity={1.2} color="#fff4ea" />

      {/* Studio light built from soft boxes only: a strong top, cool left, warm right. */}
      <Environment resolution={256} frames={1}>
        <Lightformer
          form="rect"
          intensity={4}
          color="#ffffff"
          position={[0, 5, 3]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={[12, 5, 1]}
        />
        <Lightformer
          form="rect"
          intensity={2.2}
          color="#dfe6ff"
          position={[-6, 1, 3]}
          rotation={[0, Math.PI / 2, 0]}
          scale={[7, 6, 1]}
        />
        <Lightformer
          form="rect"
          intensity={2.2}
          color="#ffe9d6"
          position={[6, 0.5, 3]}
          rotation={[0, -Math.PI / 2, 0]}
          scale={[7, 6, 1]}
        />
        <Lightformer
          form="rect"
          intensity={1.1}
          color="#ffffff"
          position={[0, 0.5, 8]}
          rotation={[0, Math.PI, 0]}
          scale={[10, 5, 1]}
        />
      </Environment>

      {services.map((service, index) => (
        <Toy
          key={service.id}
          kind={service.toy}
          hex={service.hex}
          shadowTexture={shadowTexture}
          groupRef={(node) => {
            groupRefs.current[index] = node;
          }}
          shadowRef={(node) => {
            shadowRefs.current[index] = node;
          }}
          {...handlersFor(index)}
        />
      ))}
    </>
  );
}
