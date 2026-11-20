"use client";

import { RoundedBox } from "@react-three/drei";
import type { ThreeEvent } from "@react-three/fiber";
import { type Ref, useMemo } from "react";
import * as THREE from "three";

import { PALETTE } from "@/content/palette";

import {
  KNOB_TICKS,
  METRONOME_ARM_TIP,
  METRONOME_PIVOT,
  getToyGeometry,
} from "./geometry";
import type { ToyKind } from "./types";

/**
 * Glossy "inflatable candy" surface: low roughness under a full clearcoat, with
 * a soft white sheen that lifts the grazing edges.
 */
const CANDY = {
  roughness: 0.2,
  metalness: 0,
  clearcoat: 1,
  clearcoatRoughness: 0.1,
  sheen: 0.5,
  sheenColor: "#ffffff",
  sheenRoughness: 0.4,
} as const;

/** Polished nickel for the jack's shaft and tip. */
const METAL = {
  color: "#D7DCE8",
  roughness: 0.24,
  metalness: 1,
  clearcoat: 0.6,
  clearcoatRoughness: 0.15,
} as const;

/** Every toy is about this many world units across before the layout scale. */
export const TOY_SPAN = 1.4;

/** Uniform scale that brings each toy to roughly TOY_SPAN across. */
const FIT: Record<ToyKind, number> = {
  knob: 0.86,
  speaker: 0.92,
  note: 0.92,
  metronome: 0.86,
  pick: 0.9,
  jack: 0.98,
};

/** Wall behind the toys, in world units on the z axis. */
export const WALL_Z = -3;
/** The shadow falls this far to the right and down, measured at the toy. */
export const SHADOW_OFFSET = { x: 0.35, y: -0.55 } as const;
/** Width of the shadow plane before the layout scale is applied. */
export const SHADOW_SIZE = 2.2;

export interface ToyHandlers {
  onPointerOver: (event: ThreeEvent<PointerEvent>) => void;
  onPointerOut: (event: ThreeEvent<PointerEvent>) => void;
  onPointerDown: (event: ThreeEvent<PointerEvent>) => void;
}

export interface ToyProps extends ToyHandlers {
  kind: ToyKind;
  hex: string;
  detailHex: string;
  shadowTexture: THREE.Texture;
  groupRef: Ref<THREE.Group>;
  shadowRef: Ref<THREE.Mesh>;
}

interface BodyProps {
  hex: string;
  detailHex: string;
  /** A deeper shade of `hex` for secondary parts of the body. */
  deepHex: string;
}

/** Multiplies a color in linear space, which keeps its hue and deepens it. */
function shade(hex: string, factor: number): string {
  return `#${new THREE.Color(hex).multiplyScalar(factor).getHexString()}`;
}

/** A single toy: its meshes, plus the soft shadow it casts on the wall behind. */
export function Toy({
  kind,
  hex,
  detailHex,
  shadowTexture,
  groupRef,
  shadowRef,
  onPointerOver,
  onPointerOut,
  onPointerDown,
}: ToyProps) {
  // A darker, more saturated cousin of the toy color reads as colored shade.
  const shadowTint = useMemo(() => new THREE.Color(hex).multiplyScalar(0.55), [hex]);
  const deepHex = useMemo(() => shade(hex, 0.62), [hex]);

  return (
    <>
      <mesh ref={shadowRef} position={[0, 0, WALL_Z]} renderOrder={-1}>
        <planeGeometry args={[SHADOW_SIZE, SHADOW_SIZE]} />
        <meshBasicMaterial
          map={shadowTexture}
          color={shadowTint}
          transparent
          opacity={0.2}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      <group
        ref={groupRef}
        onPointerOver={onPointerOver}
        onPointerOut={onPointerOut}
        onPointerDown={onPointerDown}
      >
        <group scale={FIT[kind]}>
          <ToyBody kind={kind} hex={hex} detailHex={detailHex} deepHex={deepHex} />
        </group>
      </group>
    </>
  );
}

function ToyBody({ kind, ...colors }: BodyProps & { kind: ToyKind }) {
  switch (kind) {
    case "knob":
      return <Knob {...colors} />;
    case "speaker":
      return <Speaker {...colors} />;
    case "note":
      return <Note {...colors} />;
    case "metronome":
      return <Metronome {...colors} />;
    case "pick":
      return <Pick {...colors} />;
    case "jack":
      return <Jack {...colors} />;
  }
}

function Candy({ color }: { color: string }) {
  return <meshPhysicalMaterial color={color} {...CANDY} />;
}

function Metal() {
  return <meshPhysicalMaterial {...METAL} />;
}

/* Front faces of the extruded parts, from their extrusion settings in geometry.ts. */
const KNOB_SKIRT_FACE = 0.06 + 0.1;
const KNOB_CAP_HALF = 0.14 + 0.16;
const KNOB_CAP_Z = KNOB_SKIRT_FACE + KNOB_CAP_HALF - 0.12;
const KNOB_CAP_FACE = KNOB_CAP_Z + KNOB_CAP_HALF;

/** A rotary knob seen from the front: a skirt with tick dots, a cap, and its indicator. */
function Knob({ hex, detailHex, deepHex }: BodyProps) {
  return (
    <group>
      <mesh geometry={getToyGeometry("knobSkirt")}>
        <Candy color={deepHex} />
      </mesh>
      {KNOB_TICKS.map(([x, y]) => (
        <mesh key={`${x.toFixed(3)}:${y.toFixed(3)}`} position={[x, y, KNOB_SKIRT_FACE]} scale={[1, 1, 0.6]}>
          <sphereGeometry args={[0.055, 20, 12]} />
          <Candy color={detailHex} />
        </mesh>
      ))}
      <mesh geometry={getToyGeometry("knobCap")} position={[0, 0, KNOB_CAP_Z]}>
        <Candy color={hex} />
      </mesh>
      <mesh geometry={getToyGeometry("knobBar")} position={[0, 0, KNOB_CAP_FACE]}>
        <Candy color={detailHex} />
      </mesh>
    </group>
  );
}

const SPEAKER_DEPTH = 0.62;
const SPEAKER_FACE = SPEAKER_DEPTH / 2;
const SPEAKER_CONE_Y = -0.04;

/** A speaker cabinet with one big cone: a dark surround, the cone, and a dust-cap dome. */
function Speaker({ hex, detailHex, deepHex }: BodyProps) {
  return (
    <group>
      <RoundedBox args={[1.3, 1.5, SPEAKER_DEPTH]} radius={0.26} smoothness={6}>
        <Candy color={hex} />
      </RoundedBox>

      <mesh position={[0, SPEAKER_CONE_Y, SPEAKER_FACE + 0.01]}>
        <torusGeometry args={[0.44, 0.1, 24, 64]} />
        <Candy color={detailHex} />
      </mesh>
      <mesh position={[0, SPEAKER_CONE_Y, SPEAKER_FACE]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.39, 0.39, 0.06, 48]} />
        <Candy color={deepHex} />
      </mesh>
      {/* A hemisphere turned to face the camera, flattened into a dome. */}
      <mesh position={[0, SPEAKER_CONE_Y, SPEAKER_FACE + 0.02]} rotation={[Math.PI / 2, 0, 0]} scale={[1, 0.65, 1]}>
        <sphereGeometry args={[0.19, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <Candy color={detailHex} />
      </mesh>
    </group>
  );
}

/** Two beamed eighth notes, inflated as one piece. */
function Note({ hex }: BodyProps) {
  return (
    <mesh geometry={getToyGeometry("note")}>
      <Candy color={hex} />
    </mesh>
  );
}

const METRONOME_FACE = 0.14 + 0.16;
/** The body geometry is centered; this puts it back in the coordinates the arm is drawn in. */
const METRONOME_BODY_Y = 0.04;
const ARM_ANGLE = Math.atan2(
  METRONOME_ARM_TIP[1] - METRONOME_PIVOT[1],
  METRONOME_ARM_TIP[0] - METRONOME_PIVOT[0],
);
/** The sliding weight sits this far along the arm. */
const WEIGHT_AT = 0.62;

/** A metronome: a truncated pyramid on a foot, a tilted pendulum arm and its weight. */
function Metronome({ hex, detailHex, deepHex }: BodyProps) {
  const weightX = METRONOME_PIVOT[0] + (METRONOME_ARM_TIP[0] - METRONOME_PIVOT[0]) * WEIGHT_AT;
  const weightY = METRONOME_PIVOT[1] + (METRONOME_ARM_TIP[1] - METRONOME_PIVOT[1]) * WEIGHT_AT;

  return (
    <group position={[0, -0.04, 0]}>
      <mesh geometry={getToyGeometry("metronomeBody")} position={[0, METRONOME_BODY_Y, 0]}>
        <Candy color={hex} />
      </mesh>
      <RoundedBox args={[1.42, 0.24, 0.74]} radius={0.1} smoothness={5} position={[0, -0.72, 0]}>
        <Candy color={deepHex} />
      </RoundedBox>

      <mesh geometry={getToyGeometry("metronomeArm")} position={[0, 0, METRONOME_FACE]}>
        <Candy color={detailHex} />
      </mesh>
      <mesh position={[METRONOME_PIVOT[0], METRONOME_PIVOT[1], METRONOME_FACE]} scale={[1, 1, 0.6]}>
        <sphereGeometry args={[0.1, 24, 16]} />
        <Candy color={detailHex} />
      </mesh>
      <RoundedBox
        args={[0.3, 0.2, 0.14]}
        radius={0.06}
        smoothness={4}
        position={[weightX, weightY, METRONOME_FACE + 0.04]}
        rotation={[0, 0, ARM_ANGLE - Math.PI / 2]}
      >
        <Candy color={detailHex} />
      </RoundedBox>
    </group>
  );
}

/** A guitar pick, point down. */
function Pick({ hex }: BodyProps) {
  return (
    <mesh geometry={getToyGeometry("pick")}>
      <Candy color={hex} />
    </mesh>
  );
}

/* The jack is drawn along +y (cable at the bottom, tip at the top), then laid diagonally. */
const JACK_TILT = -Math.PI / 4;
const JACK_CENTER_Y = -0.04;

/** A 1/4 inch plug: cable, barrel, metal shaft with one ring groove, and a rounded tip. */
function Jack({ hex, deepHex }: BodyProps) {
  return (
    <group rotation={[0, 0, JACK_TILT]}>
      <group position={[0, -JACK_CENTER_Y, 0]}>
        <mesh position={[0, -0.86, 0]}>
          <cylinderGeometry args={[0.085, 0.085, 0.3, 24]} />
          <Candy color={PALETTE.ink} />
        </mesh>

        <mesh position={[0, -0.3, 0]}>
          <capsuleGeometry args={[0.22, 0.44, 12, 32]} />
          <Candy color={hex} />
        </mesh>
        {[-0.46, -0.36].map((y) => (
          <mesh key={y} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.205, 0.03, 12, 40]} />
            <Candy color={deepHex} />
          </mesh>
        ))}

        <mesh position={[0, 0.17, 0]}>
          <cylinderGeometry args={[0.15, 0.15, 0.08, 32]} />
          <Metal />
        </mesh>
        <mesh position={[0, 0.42, 0]}>
          <cylinderGeometry args={[0.09, 0.09, 0.5, 24]} />
          <Metal />
        </mesh>
        <mesh position={[0, 0.69, 0]}>
          <cylinderGeometry args={[0.058, 0.058, 0.06, 24]} />
          <Candy color={PALETTE.ink} />
        </mesh>
        <mesh position={[0, 0.81, 0]}>
          <capsuleGeometry args={[0.092, 0.06, 10, 24]} />
          <Metal />
        </mesh>
      </group>
    </group>
  );
}
