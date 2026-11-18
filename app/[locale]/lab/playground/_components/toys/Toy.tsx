"use client";

import { RoundedBox } from "@react-three/drei";
import type { ThreeEvent } from "@react-three/fiber";
import { type Ref, useMemo } from "react";
import * as THREE from "three";

import type { ToyKind } from "../../_content/copy";
import { TOKENS } from "../../_content/tokens";
import { getToyGeometry } from "./geometry";

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

/** Uniform scale that brings each toy to roughly 1.4 world units across. */
const FIT: Record<ToyKind, number> = {
  browser: 0.84,
  bag: 0.92,
  cursor: 0.88,
  sparkle: 0.62,
  shield: 0.82,
  arrow: 0.82,
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
  onClick: (event: ThreeEvent<MouseEvent>) => void;
}

export interface ToyProps extends ToyHandlers {
  kind: ToyKind;
  hex: string;
  shadowTexture: THREE.Texture;
  groupRef: Ref<THREE.Group>;
  shadowRef: Ref<THREE.Mesh>;
}

/** A single toy: its meshes, plus the soft shadow it casts on the wall behind. */
export function Toy({
  kind,
  hex,
  shadowTexture,
  groupRef,
  shadowRef,
  onPointerOver,
  onPointerOut,
  onPointerDown,
  onClick,
}: ToyProps) {
  // A darker, more saturated cousin of the toy color reads as colored shade.
  const shadowTint = useMemo(() => new THREE.Color(hex).multiplyScalar(0.55), [hex]);

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
        onClick={onClick}
      >
        <group scale={FIT[kind]}>
          <ToyBody kind={kind} hex={hex} />
        </group>
      </group>
    </>
  );
}

function ToyBody({ kind, hex }: { kind: ToyKind; hex: string }) {
  switch (kind) {
    case "browser":
      return <Browser hex={hex} />;
    case "bag":
      return <Bag hex={hex} />;
    case "cursor":
      return <Shaped part="cursor" hex={hex} />;
    case "sparkle":
      return <Sparkle hex={hex} />;
    case "shield":
      return <Shield hex={hex} />;
    case "arrow":
      return <Shaped part="arrow" hex={hex} />;
  }
}

function Candy({ color }: { color: string }) {
  return <meshPhysicalMaterial color={color} {...CANDY} />;
}

const BROWSER_DOTS = [
  { x: -0.66, color: TOKENS.pink },
  { x: -0.5, color: TOKENS.sun },
  { x: -0.34, color: TOKENS.lime },
] as const;

function Browser({ hex }: { hex: string }) {
  return (
    <group>
      <RoundedBox args={[1.7, 1.25, 0.36]} radius={0.16} smoothness={6}>
        <Candy color={hex} />
      </RoundedBox>

      {/* Title bar, a touch deeper than the body so it stands proud. */}
      <RoundedBox args={[1.7, 0.3, 0.38]} radius={0.14} smoothness={6} position={[0, 0.475, 0]}>
        <Candy color={TOKENS.blueDeep} />
      </RoundedBox>
      {BROWSER_DOTS.map((dot) => (
        <mesh key={dot.x} position={[dot.x, 0.475, 0.19]}>
          <sphereGeometry args={[0.06, 24, 16]} />
          <Candy color={dot.color} />
        </mesh>
      ))}

      {/* Page content, floating just in front of the face. */}
      <RoundedBox args={[1.34, 0.46, 0.08]} radius={0.04} smoothness={4} position={[0, -0.04, 0.2]}>
        <Candy color={TOKENS.paper} />
      </RoundedBox>
      <RoundedBox args={[0.86, 0.16, 0.08]} radius={0.04} smoothness={4} position={[-0.24, -0.4, 0.2]}>
        <Candy color={TOKENS.paper} />
      </RoundedBox>
    </group>
  );
}

function Bag({ hex }: { hex: string }) {
  return (
    <group position={[0, -0.08, 0]}>
      <RoundedBox args={[1.15, 1.2, 0.55]} radius={0.14} smoothness={6} position={[0, -0.12, 0]}>
        <Candy color={hex} />
      </RoundedBox>

      {/* Folded-over top, a shade deeper than the body. */}
      <RoundedBox args={[1.19, 0.22, 0.59]} radius={0.1} smoothness={5} position={[0, 0.38, 0]}>
        <Candy color={TOKENS.orangeDeep} />
      </RoundedBox>

      {/* Wide, thin handle: a half torus squashed a little so it reads as a strap. */}
      <mesh position={[0, 0.49, 0]} scale={[1, 0.78, 1]}>
        <torusGeometry args={[0.34, 0.05, 20, 48, Math.PI]} />
        <Candy color={TOKENS.orangeDeep} />
      </mesh>

      {/* Paper label, slightly crooked as if it were stuck on by hand. */}
      <RoundedBox
        args={[0.5, 0.2, 0.05]}
        radius={0.025}
        smoothness={4}
        position={[0, -0.22, 0.285]}
        rotation={[0, 0, -0.07]}
      >
        <Candy color={TOKENS.paper} />
      </RoundedBox>
    </group>
  );
}

function Shaped({ part, hex }: { part: "cursor" | "arrow"; hex: string }) {
  return (
    <mesh geometry={getToyGeometry(part)}>
      <Candy color={hex} />
    </mesh>
  );
}

function Sparkle({ hex }: { hex: string }) {
  const star = getToyGeometry("sparkle");
  return (
    <group>
      <mesh geometry={star}>
        <Candy color={hex} />
      </mesh>
      <mesh geometry={star} scale={0.35} position={[0.98, 0.9, 0]}>
        <Candy color={hex} />
      </mesh>
    </group>
  );
}

function Shield({ hex }: { hex: string }) {
  return (
    <group>
      <mesh geometry={getToyGeometry("shield")}>
        <Candy color={hex} />
      </mesh>
      <mesh geometry={getToyGeometry("check")} position={[0, 0.02, 0.37]}>
        <Candy color={TOKENS.paper} />
      </mesh>
    </group>
  );
}
