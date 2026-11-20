/**
 * Toy physics. Pure TypeScript: no React, no three.js, no DOM.
 *
 * Everything lives in a 2D world measured in the same units as the R3F
 * viewport at z = 0, centered on the hero (+x right, +y up). The stage calls
 * `step()` once per frame and copies the resulting body state onto the meshes.
 *
 * The module can be run under plain Node, which is how the constants below
 * were tuned (see the Progress notes in odd/tasks/playground-lab.md).
 */

export interface Body {
  /** Position of the body center. */
  x: number;
  y: number;
  vx: number;
  vy: number;
  /** Where the body rests when nothing is touching it. */
  homeX: number;
  homeY: number;
  /** Layout scale (1 on desktop, smaller in the portrait layout). */
  scale: number;
  /** Collision radius, 0.75 x scale. */
  radius: number;
  /** Per-body offset so the idle loops do not move in lockstep. */
  phase: number;
  /** Rotation angles in radians. */
  rotX: number;
  rotY: number;
  rotZ: number;
  /** Angular velocity around z. */
  angVelZ: number;
  /** Per-axis squash scale (a spring around the target) and its velocity. */
  squashX: number;
  squashY: number;
  squashVX: number;
  squashVY: number;
  squashTargetX: number;
  squashTargetY: number;
  dragging: boolean;
  /** Body position minus pointer position at the moment of the grab. */
  grabX: number;
  grabY: number;
  /** False until the first layout pass, so the body starts at its home. */
  placed: boolean;
}

export interface PointerState {
  x: number;
  y: number;
  /** True while a mouse or pen is over the hero. Always false for touch. */
  inside: boolean;
}

export interface StepInput {
  dt: number;
  /** Monotonic simulation time in seconds, drives the idle loops. */
  time: number;
  pointer: PointerState;
  bounds: { halfW: number; halfH: number };
  reducedMotion: boolean;
}

export type SquashMode = "idle" | "hover" | "press";

/** Tuned constants. Distances are world units, times are seconds. */
export const PHYSICS = {
  maxDt: 1 / 30,

  /* Home spring: underdamped, so toys overshoot and settle. */
  springK: 20,
  springC: 4.8,

  /* Idle loops. */
  bobAmp: 0.12,
  bobHz: 0.9,
  swayZ: 0.08,
  swayY: 0.35,
  swayZHz: 0.55,
  swayYHz: 0.4,

  /*
   * Cursor repulsion: force falls off with (1 - d/R)^2. It is switched off
   * while the cursor is on the body itself (a dead zone, then a smooth ramp),
   * so toys shy away from a passing cursor but hold still once it lands on
   * them, which keeps hover and grab stable.
   */
  repelRadius: 1.8,
  repelForce: 16,
  repelDeadZone: 0.55,
  repelRamp: 0.7,
  leanMax: 0.35,
  leanRange: 6,

  /* Collisions and bounds. */
  bodyRestitution: 0.55,
  wallRestitution: 0.5,
  maxSpeed: 22,

  /* Dragging. */
  dragFollow: 26,
  velocityEmaTau: 0.05,
  throwSpin: 0.3,
  maxThrowSpin: 9,

  /* Rotation response. */
  rotSmoothing: 9,
  spinFromVelocity: 0.045,
  maxSpinTilt: 0.5,
  angularK: 70,
  angularC: 7,

  /* Per-axis squash spring. */
  squashK: 280,
  squashC: 12,
  hoverSquash: 1.08,
  pressSquashX: 1.14,
  pressSquashY: 0.86,

  /** Collision radius as a fraction of the layout scale. */
  radiusPerScale: 0.75,
} as const;

const TAU = Math.PI * 2;

const clamp = (value: number, min: number, max: number) =>
  value < min ? min : value > max ? max : value;

/** 0 below `from`, 1 above `to`, smooth in between. */
function smoothstep(from: number, to: number, value: number): number {
  const t = clamp((value - from) / (to - from), 0, 1);
  return t * t * (3 - 2 * t);
}

export function createBody(phase: number): Body {
  return {
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    homeX: 0,
    homeY: 0,
    scale: 1,
    radius: PHYSICS.radiusPerScale,
    phase,
    rotX: 0,
    rotY: 0,
    rotZ: 0,
    angVelZ: 0,
    squashX: 1,
    squashY: 1,
    squashVX: 0,
    squashVY: 0,
    squashTargetX: 1,
    squashTargetY: 1,
    dragging: false,
    grabX: 0,
    grabY: 0,
    placed: false,
  };
}

/**
 * Sets where a body rests and how big it is. The first call also places the
 * body there; later calls (a resize) only move the target, and the spring
 * carries the body over.
 */
export function setLayout(body: Body, homeX: number, homeY: number, scale: number): void {
  body.homeX = homeX;
  body.homeY = homeY;
  body.scale = scale;
  body.radius = PHYSICS.radiusPerScale * scale;
  if (!body.placed) {
    body.x = homeX;
    body.y = homeY;
    body.placed = true;
  }
}

export function setSquashMode(body: Body, mode: SquashMode): void {
  if (mode === "hover") {
    body.squashTargetX = PHYSICS.hoverSquash;
    body.squashTargetY = PHYSICS.hoverSquash;
  } else if (mode === "press") {
    body.squashTargetX = PHYSICS.pressSquashX;
    body.squashTargetY = PHYSICS.pressSquashY;
  } else {
    body.squashTargetX = 1;
    body.squashTargetY = 1;
  }
}

/** Picks the body up. The body keeps its offset from the pointer. */
export function grab(body: Body, pointerX: number, pointerY: number): void {
  body.dragging = true;
  body.grabX = body.x - pointerX;
  body.grabY = body.y - pointerY;
  body.vx = 0;
  body.vy = 0;
}

/** Lets go. The body keeps the velocity it was dragged with: a throw. */
export function release(body: Body): void {
  body.dragging = false;
  capSpeed(body);
  body.angVelZ += clamp(
    -body.vx * PHYSICS.throwSpin,
    -PHYSICS.maxThrowSpin,
    PHYSICS.maxThrowSpin,
  );
}

/** True when a world point is inside the body's collision circle. */
export function containsPoint(body: Body, x: number, y: number): boolean {
  return Math.hypot(x - body.x, y - body.y) <= body.radius;
}

/**
 * Puts every body at rest on its home, with no motion at all. The pose is the
 * idle sway frozen at time zero: a gentle fixed tilt per body, so the still
 * frame keeps its depth instead of looking pasted flat.
 */
function settle(body: Body): void {
  body.x = body.homeX;
  body.y = body.homeY;
  body.vx = 0;
  body.vy = 0;
  body.rotX = -0.06;
  body.rotY = PHYSICS.swayY * Math.sin(body.phase * 1.3);
  body.rotZ = PHYSICS.swayZ * Math.sin(body.phase * 0.7);
  body.angVelZ = 0;
  body.squashX = 1;
  body.squashY = 1;
  body.squashVX = 0;
  body.squashVY = 0;
  body.squashTargetX = 1;
  body.squashTargetY = 1;
  body.dragging = false;
}

function capSpeed(body: Body): void {
  const speed = Math.hypot(body.vx, body.vy);
  if (speed > PHYSICS.maxSpeed) {
    const k = PHYSICS.maxSpeed / speed;
    body.vx *= k;
    body.vy *= k;
  }
}

/** Advances every body by one frame. */
export function step(bodies: Body[], input: StepInput): void {
  if (input.reducedMotion) {
    for (const body of bodies) settle(body);
    return;
  }

  const dt = clamp(input.dt, 0, PHYSICS.maxDt);
  if (dt <= 0) return;

  for (const body of bodies) {
    if (body.dragging) drag(body, input, dt);
    else integrate(body, input, dt);
  }

  collide(bodies);

  for (const body of bodies) {
    keepInBounds(body, input.bounds);
    capSpeed(body);
    updateRotation(body, input, dt);
    updateSquash(body, dt);
  }
}

/** Free body: home spring with the idle bob, plus the cursor's push. */
function integrate(body: Body, input: StepInput, dt: number): void {
  const bob = PHYSICS.bobAmp * body.scale * Math.sin(TAU * PHYSICS.bobHz * input.time + body.phase);
  const targetX = body.homeX;
  const targetY = body.homeY + bob;

  let ax = -PHYSICS.springK * (body.x - targetX) - PHYSICS.springC * body.vx;
  let ay = -PHYSICS.springK * (body.y - targetY) - PHYSICS.springC * body.vy;

  const { pointer } = input;
  if (pointer.inside) {
    const dx = body.x - pointer.x;
    const dy = body.y - pointer.y;
    const distance = Math.hypot(dx, dy);
    if (distance < PHYSICS.repelRadius && distance > 1e-4) {
      const falloff = 1 - distance / PHYSICS.repelRadius;
      const dead = body.radius * PHYSICS.repelDeadZone;
      const ramp = smoothstep(dead, dead + body.radius * PHYSICS.repelRamp, distance);
      const push = PHYSICS.repelForce * falloff * falloff * ramp;
      ax += (dx / distance) * push;
      ay += (dy / distance) * push;
    }
  }

  body.vx += ax * dt;
  body.vy += ay * dt;
  body.x += body.vx * dt;
  body.y += body.vy * dt;
}

/**
 * Dragged body: follows the pointer through a stiff low-pass, and its velocity
 * is an exponential moving average of how it actually moved, which is what a
 * throw inherits on release.
 */
function drag(body: Body, input: StepInput, dt: number): void {
  const { halfW, halfH } = input.bounds;
  const limitX = Math.max(halfW - body.radius, 0);
  const limitY = Math.max(halfH - body.radius, 0);
  const targetX = clamp(input.pointer.x + body.grabX, -limitX, limitX);
  const targetY = clamp(input.pointer.y + body.grabY, -limitY, limitY);

  const follow = 1 - Math.exp(-PHYSICS.dragFollow * dt);
  const nextX = body.x + (targetX - body.x) * follow;
  const nextY = body.y + (targetY - body.y) * follow;

  const ema = 1 - Math.exp(-dt / PHYSICS.velocityEmaTau);
  body.vx += ((nextX - body.x) / dt - body.vx) * ema;
  body.vy += ((nextY - body.y) / dt - body.vy) * ema;
  body.x = nextX;
  body.y = nextY;
}

/**
 * Circle against circle. Overlap is split between the two bodies (a dragged
 * body is immovable, so the other one takes all of it) and the approaching
 * velocity along the contact normal is reflected with restitution.
 */
function collide(bodies: Body[]): void {
  for (let i = 0; i < bodies.length; i++) {
    for (let j = i + 1; j < bodies.length; j++) {
      const a = bodies[i];
      const b = bodies[j];
      let nx = b.x - a.x;
      let ny = b.y - a.y;
      let distance = Math.hypot(nx, ny);
      const minDistance = a.radius + b.radius;
      if (distance >= minDistance) continue;

      if (distance < 1e-6) {
        nx = 1;
        ny = 0;
        distance = 0;
      } else {
        nx /= distance;
        ny /= distance;
      }

      const invA = a.dragging ? 0 : 1;
      const invB = b.dragging ? 0 : 1;
      const invSum = invA + invB;
      if (invSum === 0) continue;

      const overlap = minDistance - distance;
      a.x -= nx * overlap * (invA / invSum);
      a.y -= ny * overlap * (invA / invSum);
      b.x += nx * overlap * (invB / invSum);
      b.y += ny * overlap * (invB / invSum);

      const approach = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny;
      if (approach < 0) {
        const impulse = (-(1 + PHYSICS.bodyRestitution) * approach) / invSum;
        a.vx -= impulse * invA * nx;
        a.vy -= impulse * invA * ny;
        b.vx += impulse * invB * nx;
        b.vy += impulse * invB * ny;
      }
    }
  }
}

/** The hero minus the body's radius is a box; bounce off its walls. */
function keepInBounds(body: Body, bounds: StepInput["bounds"]): void {
  const limitX = Math.max(bounds.halfW - body.radius, 0);
  const limitY = Math.max(bounds.halfH - body.radius, 0);

  if (body.x > limitX) {
    body.x = limitX;
    if (body.vx > 0) body.vx = -body.vx * PHYSICS.wallRestitution;
  } else if (body.x < -limitX) {
    body.x = -limitX;
    if (body.vx < 0) body.vx = -body.vx * PHYSICS.wallRestitution;
  }

  if (body.y > limitY) {
    body.y = limitY;
    if (body.vy > 0) body.vy = -body.vy * PHYSICS.wallRestitution;
  } else if (body.y < -limitY) {
    body.y = -limitY;
    if (body.vy < 0) body.vy = -body.vy * PHYSICS.wallRestitution;
  }
}

/**
 * Rotation: x/y lean toward the cursor on top of the idle sway, and z is a
 * damped angular spring whose rest angle tilts with horizontal velocity, so a
 * body thrown sideways banks into the throw and wobbles back.
 */
function updateRotation(body: Body, input: StepInput, dt: number): void {
  const { pointer, time } = input;

  let leanX = 0;
  let leanY = 0;
  if (pointer.inside) {
    const dx = pointer.x - body.x;
    const dy = pointer.y - body.y;
    const influence = clamp(1 - Math.hypot(dx, dy) / PHYSICS.leanRange, 0, 1);
    leanY = PHYSICS.leanMax * Math.tanh(dx / 2.5) * influence;
    leanX = -PHYSICS.leanMax * Math.tanh(dy / 2.5) * influence;
  }

  const swayY = PHYSICS.swayY * Math.sin(TAU * PHYSICS.swayYHz * time + body.phase * 1.3);
  const swayZ = PHYSICS.swayZ * Math.sin(TAU * PHYSICS.swayZHz * time + body.phase * 0.7);

  const smooth = 1 - Math.exp(-PHYSICS.rotSmoothing * dt);
  body.rotX += (leanX - body.rotX) * smooth;
  body.rotY += (swayY + leanY - body.rotY) * smooth;

  const bank = clamp(-body.vx * PHYSICS.spinFromVelocity, -PHYSICS.maxSpinTilt, PHYSICS.maxSpinTilt);
  const accel =
    -PHYSICS.angularK * (body.rotZ - (swayZ + bank)) - PHYSICS.angularC * body.angVelZ;
  body.angVelZ += accel * dt;
  body.rotZ += body.angVelZ * dt;
}

function updateSquash(body: Body, dt: number): void {
  const ax =
    -PHYSICS.squashK * (body.squashX - body.squashTargetX) - PHYSICS.squashC * body.squashVX;
  const ay =
    -PHYSICS.squashK * (body.squashY - body.squashTargetY) - PHYSICS.squashC * body.squashVY;
  body.squashVX += ax * dt;
  body.squashVY += ay * dt;
  body.squashX += body.squashVX * dt;
  body.squashY += body.squashVY * dt;
}
