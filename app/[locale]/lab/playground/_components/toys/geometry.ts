import * as THREE from "three";
import { toCreasedNormals } from "three/examples/jsm/utils/BufferGeometryUtils.js";

/**
 * Procedural geometry for the toys that are not plain rounded boxes.
 *
 * Each outline is a 2D `THREE.Shape` that gets extruded with a deep, rounded
 * bevel so the result reads as an inflated candy rather than a flat cut-out.
 * Builders are memoized per key: every toy shares one geometry for the whole
 * lifetime of the page.
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

/** Faces meeting at less than this angle share smooth normals. */
const CREASE_ANGLE = Math.PI / 2.4;

export type ShapedToyPart = "cursor" | "sparkle" | "shield" | "check" | "arrow";

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

/**
 * Corner points of a star with `tips` arms: tips at radius 1, notches at
 * `waist`. The first tip points up.
 */
function starPoints(tips: number, waist: number): Point[] {
  const points: Point[] = [];
  for (let i = 0; i < tips * 2; i++) {
    const angle = Math.PI / 2 + (i * Math.PI) / tips;
    const r = i % 2 === 0 ? 1 : waist;
    points.push([Math.cos(angle) * r, Math.sin(angle) * r]);
  }
  return points;
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

const CURSOR_POINTS: readonly Point[] = [
  [0, 0],
  [0, -1.25],
  [0.32, -0.95],
  [0.55, -1.42],
  [0.74, -1.33],
  [0.52, -0.88],
  [0.95, -0.88],
];

const SHIELD_POINTS: readonly Point[] = [
  [-0.58, 0.56],
  [-0.3, 0.66],
  [0, 0.7],
  [0.3, 0.66],
  [0.58, 0.56],
  [0.58, 0.1],
  [0.5, -0.22],
  [0.3, -0.52],
  [0, -0.8],
  [-0.3, -0.52],
  [-0.5, -0.22],
  [-0.58, 0.1],
];

const ARROW_POINTS: readonly Point[] = [
  [0, 0.74],
  [0.6, 0.06],
  [0.27, 0.06],
  [0.27, -0.72],
  [-0.27, -0.72],
  [-0.27, 0.06],
  [-0.6, 0.06],
];

const CHECK_POINTS: readonly Point[] = [
  [-0.24, 0.0],
  [-0.07, -0.19],
  [0.27, 0.22],
];

/* -------------------------------------------------------------------------- */
/* Extrusion                                                                  */
/* -------------------------------------------------------------------------- */

function inflate(shape: THREE.Shape, options: Partial<Extrusion> = {}): THREE.BufferGeometry {
  const extruded = new THREE.ExtrudeGeometry(shape, {
    ...EXTRUSION,
    ...options,
    bevelEnabled: true,
  });
  extruded.center();
  const smooth = toCreasedNormals(extruded, CREASE_ANGLE);
  extruded.dispose();
  return smooth;
}

const BUILDERS: Record<ShapedToyPart, () => THREE.BufferGeometry> = {
  cursor: () => inflate(roundedPolygon(CURSOR_POINTS, 0.06)),
  // Fat shapes can take a deeper roundover; thin ones (the cursor) cannot.
  sparkle: () =>
    inflate(roundedPolygon(starPoints(4, 0.3), 0.14), {
      depth: 0.16,
      bevelThickness: 0.2,
      bevelSize: 0.1,
    }),
  shield: () =>
    inflate(roundedPolygon(SHIELD_POINTS, 0.14), {
      depth: 0.2,
      bevelThickness: 0.24,
      bevelSize: 0.16,
    }),
  arrow: () =>
    inflate(roundedPolygon(ARROW_POINTS, 0.1), {
      depth: 0.22,
      bevelThickness: 0.22,
      bevelSize: 0.14,
    }),
  /** Thin and small: it sits on the face of the shield. */
  check: () =>
    inflate(strokeShape(CHECK_POINTS, 0.075), {
      depth: 0.04,
      bevelThickness: 0.05,
      bevelSize: 0.03,
      bevelSegments: 5,
      curveSegments: 12,
    }),
};

const cache = new Map<ShapedToyPart, THREE.BufferGeometry>();

/** Shared geometry for one toy part. Built on first use, then reused forever. */
export function getToyGeometry(part: ShapedToyPart): THREE.BufferGeometry {
  let geometry = cache.get(part);
  if (!geometry) {
    geometry = BUILDERS[part]();
    cache.set(part, geometry);
  }
  return geometry;
}
