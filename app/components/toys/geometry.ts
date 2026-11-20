import * as THREE from "three";
import { mergeGeometries, toCreasedNormals } from "three/examples/jsm/utils/BufferGeometryUtils.js";

/**
 * Procedural geometry for the audio toys.
 *
 * Each outline is a 2D `THREE.Shape` extruded with a deep, rounded bevel so it
 * reads as an inflated candy rather than a flat cut-out. Every extrusion faces
 * the camera (+z). Builders are memoized per key: every toy shares one
 * geometry for the whole lifetime of the page.
 */

type Point = readonly [x: number, y: number];

interface Extrusion {
  depth: number;
  bevelThickness: number;
  bevelSize: number;
  bevelSegments: number;
  curveSegments: number;
}

/** Puffiness of the extrusion: a deep, rounded bevel around a short straight wall. */
const EXTRUSION: Extrusion = {
  depth: 0.32,
  bevelThickness: 0.14,
  bevelSize: 0.1,
  bevelSegments: 8,
  curveSegments: 24,
};

/** Small parts that sit on a body's face: thin, with a tight roundover. */
const DETAIL: Partial<Extrusion> = {
  depth: 0.04,
  bevelThickness: 0.05,
  bevelSize: 0.03,
  bevelSegments: 5,
  curveSegments: 12,
};

/** Faces meeting at less than this angle share smooth normals. */
const CREASE_ANGLE = Math.PI / 2.4;

export type AudioToyPart =
  | "knobSkirt"
  | "knobCap"
  | "knobBar"
  | "note"
  | "metronomeBody"
  | "metronomeArm"
  | "pick";

/* -------------------------------------------------------------------------- */
/* 2D outlines                                                                */
/* -------------------------------------------------------------------------- */

/**
 * Closed polygon with every corner replaced by a quadratic fillet. A corner is
 * never rounded by more than half of either neighbouring edge, so dense
 * polylines stay untouched and only real corners soften.
 */
function roundedPolygon(points: readonly Point[], radius: number): THREE.Shape {
  const shape = new THREE.Shape();
  const count = points.length;

  for (let i = 0; i < count; i++) {
    const prev = points[(i + count - 1) % count];
    const cur = points[i];
    const next = points[(i + 1) % count];

    const lenPrev = Math.hypot(prev[0] - cur[0], prev[1] - cur[1]);
    const lenNext = Math.hypot(next[0] - cur[0], next[1] - cur[1]);
    const r = Math.min(radius, lenPrev / 2, lenNext / 2);

    const startX = cur[0] + ((prev[0] - cur[0]) / lenPrev) * r;
    const startY = cur[1] + ((prev[1] - cur[1]) / lenPrev) * r;
    const endX = cur[0] + ((next[0] - cur[0]) / lenNext) * r;
    const endY = cur[1] + ((next[1] - cur[1]) / lenNext) * r;

    if (i === 0) shape.moveTo(startX, startY);
    else shape.lineTo(startX, startY);
    shape.quadraticCurveTo(cur[0], cur[1], endX, endY);
  }

  shape.closePath();
  return shape;
}

/** A polyline stroke turned into a filled outline with miter joins and round caps. */
function strokeShape(points: readonly Point[], halfWidth: number, capSteps = 8): THREE.Shape {
  const last = points.length - 1;
  const dirs: Point[] = [];
  for (let i = 0; i < last; i++) {
    const dx = points[i + 1][0] - points[i][0];
    const dy = points[i + 1][1] - points[i][1];
    const len = Math.hypot(dx, dy);
    dirs.push([dx / len, dy / len]);
  }

  /** Offset of vertex `i` to the left (+1) or right (-1) of the stroke. */
  const offsetPoint = (i: number, side: 1 | -1): Point => {
    const [px, py] = points[i];
    if (i === 0 || i === last) {
      const [dx, dy] = dirs[i === 0 ? 0 : last - 1];
      return [px - dy * halfWidth * side, py + dx * halfWidth * side];
    }
    const [ax, ay] = dirs[i - 1];
    const [bx, by] = dirs[i];
    const nx = -ay + -by;
    const ny = ax + bx;
    const nlen = Math.hypot(nx, ny);
    const mx = nx / nlen;
    const my = ny / nlen;
    const cos = mx * -ay + my * ax;
    const miter = halfWidth / cos;
    return [px + mx * miter * side, py + my * miter * side];
  };

  const outline: Point[] = [];
  for (let i = 0; i <= last; i++) outline.push(offsetPoint(i, 1));

  const cap = (center: Point, from: Point, sweep: number) => {
    const startAngle = Math.atan2(from[1] - center[1], from[0] - center[0]);
    for (let s = 1; s < capSteps; s++) {
      const angle = startAngle + (sweep * s) / capSteps;
      outline.push([center[0] + Math.cos(angle) * halfWidth, center[1] + Math.sin(angle) * halfWidth]);
    }
  };
  cap(points[last], offsetPoint(last, 1), -Math.PI);
  for (let i = last; i >= 0; i--) outline.push(offsetPoint(i, -1));
  cap(points[0], offsetPoint(0, -1), -Math.PI);

  const shape = new THREE.Shape();
  outline.forEach(([x, y], i) => {
    if (i === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  });
  shape.closePath();
  return shape;
}

function circleShape(radius: number): THREE.Shape {
  const shape = new THREE.Shape();
  shape.absarc(0, 0, radius, 0, Math.PI * 2, false);
  return shape;
}

/** An ellipse centered on (x, y), its major axis turned by `rotation` radians. */
function ellipseShape(x: number, y: number, rx: number, ry: number, rotation: number): THREE.Shape {
  const shape = new THREE.Shape();
  shape.absellipse(x, y, rx, ry, 0, Math.PI * 2, false, rotation);
  return shape;
}

/** Point at `radius` along a clock hand; 12 o'clock is up, 3 o'clock is right. */
function clockPoint(hour: number, radius: number): Point {
  const angle = Math.PI / 2 - (hour / 12) * Math.PI * 2;
  return [Math.cos(angle) * radius, Math.sin(angle) * radius];
}

/* Two beamed eighth notes: heads low, stems on the right of each head, the beam rising to the right. */
const NOTE_HEADS = [
  { x: -0.44, y: -0.52 },
  { x: 0.36, y: -0.38 },
] as const;
const NOTE_HEAD_RX = 0.27;
const NOTE_HEAD_RY = 0.19;
const NOTE_HEAD_TILT = 0.42;
const NOTE_STEM_DX = 0.22;
const NOTE_BEAM_RISE = 0.14;
const NOTE_BEAM_BOTTOM = 0.36;
const NOTE_BEAM_HEIGHT = 0.26;
const NOTE_STEM_HALF = 0.06;

/** A truncated pyramid seen from the front: wide foot, narrow top. */
const METRONOME_POINTS: readonly Point[] = [
  [-0.58, -0.62],
  [0.58, -0.62],
  [0.25, 0.7],
  [-0.25, 0.7],
];

/** Pendulum arm, from its pivot low on the face to past the top of the body. */
export const METRONOME_PIVOT: Point = [0, -0.36];
export const METRONOME_ARM_TIP: Point = [0.3, 0.86];

/** A guitar pick, point down: a fat top that curves into rounded shoulders. */
const PICK_POINTS: readonly Point[] = [
  [-0.7, 0.42],
  [-0.42, 0.64],
  [0, 0.7],
  [0.42, 0.64],
  [0.7, 0.42],
  [0, -0.78],
];

/* -------------------------------------------------------------------------- */
/* Extrusion                                                                  */
/* -------------------------------------------------------------------------- */

/**
 * Extrudes one shape and moves its mid-plane to z = 0, without touching x or y,
 * so several parts can be merged in their drawn positions.
 */
function extrudePart(shape: THREE.Shape, options: Partial<Extrusion> = {}): THREE.BufferGeometry {
  const settings = { ...EXTRUSION, ...options };
  const extruded = new THREE.ExtrudeGeometry(shape, { ...settings, bevelEnabled: true });
  extruded.translate(0, 0, -settings.depth / 2);
  const smooth = toCreasedNormals(extruded, CREASE_ANGLE);
  extruded.dispose();
  return smooth;
}

/** One inflated shape, centered on the origin. */
function inflate(shape: THREE.Shape, options: Partial<Extrusion> = {}): THREE.BufferGeometry {
  const geometry = extrudePart(shape, options);
  geometry.center();
  return geometry;
}

/** Several inflated parts fused into one geometry, centered as a whole. */
function inflateMany(parts: readonly [THREE.Shape, Partial<Extrusion>][]): THREE.BufferGeometry {
  const pieces = parts.map(([shape, options]) => extrudePart(shape, options));
  const merged = mergeGeometries(pieces) ?? pieces[0];
  for (const piece of pieces) if (piece !== merged) piece.dispose();
  merged.center();
  return merged;
}

function buildNote(): THREE.BufferGeometry {
  const [left, right] = NOTE_HEADS;
  const stemLeftX = left.x + NOTE_STEM_DX;
  const stemRightX = right.x + NOTE_STEM_DX;
  const beamLeft = stemLeftX - NOTE_STEM_HALF;
  const beamRight = stemRightX + NOTE_STEM_HALF;
  const rise = NOTE_BEAM_RISE;
  // The beam's underside, at a given x, so each stem ends inside the beam.
  const beamY = (x: number) => NOTE_BEAM_BOTTOM + ((x - beamLeft) / (beamRight - beamLeft)) * rise;

  const beam = roundedPolygon(
    [
      [beamLeft, NOTE_BEAM_BOTTOM],
      [beamRight, NOTE_BEAM_BOTTOM + rise],
      [beamRight, NOTE_BEAM_BOTTOM + rise + NOTE_BEAM_HEIGHT],
      [beamLeft, NOTE_BEAM_BOTTOM + NOTE_BEAM_HEIGHT],
    ],
    0.06,
  );
  const stem = (x: number, headY: number) =>
    strokeShape(
      [
        [x, headY + 0.04],
        [x, beamY(x) + NOTE_BEAM_HEIGHT * 0.5],
      ],
      NOTE_STEM_HALF,
    );
  const stemOptions: Partial<Extrusion> = {
    depth: 0.14,
    bevelThickness: 0.08,
    bevelSize: 0.04,
    bevelSegments: 6,
  };
  const beamOptions: Partial<Extrusion> = { depth: 0.16, bevelThickness: 0.1, bevelSize: 0.05 };
  const headOptions: Partial<Extrusion> = { depth: 0.16, bevelThickness: 0.16, bevelSize: 0.08 };

  return inflateMany([
    [ellipseShape(left.x, left.y, NOTE_HEAD_RX, NOTE_HEAD_RY, NOTE_HEAD_TILT), headOptions],
    [ellipseShape(right.x, right.y, NOTE_HEAD_RX, NOTE_HEAD_RY, NOTE_HEAD_TILT), headOptions],
    [stem(stemLeftX, left.y), stemOptions],
    [stem(stemRightX, right.y), stemOptions],
    [beam, beamOptions],
  ]);
}

/** Radius of the knob's flat front face, where the tick dots sit. */
export const KNOB_SKIRT_RADIUS = 0.76;
const KNOB_CAP_RADIUS = 0.5;
/** The indicator points to about one o'clock. */
const KNOB_INDICATOR_HOUR = 1;

const BUILDERS: Record<AudioToyPart, () => THREE.BufferGeometry> = {
  knobSkirt: () =>
    inflate(circleShape(KNOB_SKIRT_RADIUS), {
      depth: 0.12,
      bevelThickness: 0.1,
      bevelSize: 0.06,
      curveSegments: 48,
    }),
  knobCap: () =>
    inflate(circleShape(KNOB_CAP_RADIUS), {
      depth: 0.28,
      bevelThickness: 0.16,
      bevelSize: 0.09,
      curveSegments: 48,
    }),
  knobBar: () =>
    extrudePart(
      strokeShape(
        [clockPoint(KNOB_INDICATOR_HOUR, 0.1), clockPoint(KNOB_INDICATOR_HOUR, 0.4)],
        0.075,
      ),
      DETAIL,
    ),
  note: buildNote,
  metronomeBody: () =>
    inflate(roundedPolygon(METRONOME_POINTS, 0.14), {
      depth: 0.28,
      bevelThickness: 0.16,
      bevelSize: 0.1,
    }),
  metronomeArm: () => extrudePart(strokeShape([METRONOME_PIVOT, METRONOME_ARM_TIP], 0.06), DETAIL),
  pick: () =>
    inflate(roundedPolygon(PICK_POINTS, 0.32), {
      depth: 0.1,
      bevelThickness: 0.16,
      bevelSize: 0.1,
    }),
};

const cache = new Map<AudioToyPart, THREE.BufferGeometry>();

/** Shared geometry for one toy part. Built on first use, then reused forever. */
export function getToyGeometry(part: AudioToyPart): THREE.BufferGeometry {
  let geometry = cache.get(part);
  if (!geometry) {
    geometry = BUILDERS[part]();
    cache.set(part, geometry);
  }
  return geometry;
}

/** Tick dot positions around the knob: eleven steps from seven to five o'clock. */
export const KNOB_TICKS: readonly Point[] = Array.from({ length: 11 }, (_, i) =>
  clockPoint(7 + i, KNOB_SKIRT_RADIUS - 0.1),
);
