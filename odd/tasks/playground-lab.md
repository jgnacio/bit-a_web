# Playground lab — vivid, playful Bit-A home prototype

## Objective
Prototype the approved "Playground" direction for the Bit-A restyle in a private lab route (`/[locale]/lab/playground`). The page should be a youthful, vivid, alive home where each service is a 3D toy you can play with, and the interactions explain what each service is.

## Problem / Why
The current site is dark, static and generic, and its services taxonomy is inconsistent (home 3, `/services` 7, navbar 6). The user asked for a restyle that is "más juvenil, creativo, moderno, colores vívidos, interacciones en tiempo real, micro interacción, animaciones en loop, que la página se sienta viva", with 3D elements and interactions that help visitors understand the services.

Rejected so far: Aurora blobs, the plasma glass shader, and the isotype/bits concept. The approved accent is BorderBeam with the `plasma` palette. The user approved "Playground" on 2026-10-06 ("dale, armalo en el lab").

## Concept
- **Hero:** 6 inflatable, glossy 3D toys, one per service, float around a big headline.
  - They loop (bob/sway).
  - They react to the cursor in real time (lean, repel, squash on hover).
  - They can be dragged and thrown with spring physics.
  - A click or tap jumps to that service.
- **Color = service:**

  | Service | Color | Toy |
  |---|---|---|
  | Webs | Bit Blue `#0B40FF` | browser |
  | E-commerce | Tangerine `#FF7A1A` | bag |
  | UX/UI & brand | Bubblegum `#FF5FAE` | cursor |
  | AI & automation | Acid Lime `#C6FF3D` | sparkle |
  | Security & CTO | Lilac `#A98BFF` | shield |
  | Growth | Sun `#FFD23F` | arrow up |

- **Alive layer:**
  - two crossed marquee bands driven by scroll velocity
  - a custom cursor with contextual labels
  - magnetic, squishy buttons
  - a headline word jiggle and a color-cycling period dot
  - a rotating "Diagnóstico gratis" sticker
  - CTAs use BorderBeam `plasma`
- **Services:** a bento of 6 colored cards, each with a looping mini animation that shows the service. Cards tilt and speed up on hover and expand into an accessible detail dialog.

## Scope
- New route `app/[locale]/lab/playground/` (page, CSS, copy module, components).
- The global navbar is hidden on that route only.

Out of scope: production pages, the global navbar/footer, `messages/*.json`, the existing `/lab` minimal hero, and BorderBeam internals.

## Constraints
- **Stack:** Next 16.3, React 19.2, Tailwind v4, R3F 9, drei 10, three 0.178, framer-motion 12, lenis (all already installed).
  - No new npm dependencies. A Google font through `next/font` is allowed.
  - Read `node_modules/next/dist/docs/` before using next/font, next/dynamic or metadata.
- **Palette:** ground Ice `#F4F6FD`, never pure `#FFFFFF`. Ink `#0B0B1F`, Paper `#FCFDFF`.
- **Copy:** es (site voice, voseo) and en, kept in a lab-local copy module. Services follow the 6 areas of `../BIT-A.md`. No invented metrics.
- **Accessibility:**
  - All content lives in the DOM; the canvas is `aria-hidden`.
  - Cards and dialog are keyboard-operable, with visible focus.
  - Contrast: ink text on the light colors, paper text on blue.
- **Motion and performance:**
  - `prefers-reduced-motion` shows a static composition with no loops.
  - No WebGL falls back to 2D stickers.
  - Pause offscreen; dpr ≤ 2.
  - Touch devices: tap only, no drag, and page scroll must keep working.
- **Indexing:** the route is `noindex`.

## Tasks
- [x] T1 Scaffold:
  - route + noindex metadata
  - copy module (es/en, 6 services)
  - CSS tokens and display font
  - lab nav (light pill, ink isotype)
  - hero text layer
  - static sections (marquee, services, closing)
  - global navbar hidden on this route
- [x] T2 Toy stage:
  - `next/dynamic` canvas with `ssr:false`
  - WebGL detection with a sticker fallback
  - 6 procedural toys with candy materials
  - Lightformer environment and soft wall shadows
  - responsive home layout
  - reduced-motion static frame, offscreen pause
- [ ] T3 Toy interactions:
  - pure physics module (spring home, idle bob, cursor lean/repel, drag/throw, collisions, bounds)
  - hover/press squash, cursor label events
  - click/tap scrolls to the service
  - coarse pointer is tap-only
- [ ] T4 Alive layer:
  - scroll-velocity crossed marquees
  - custom cursor (fine pointer only)
  - magnetic + squish CTAs with BorderBeam plasma
  - headline jiggle and color-cycling dot
- [ ] T5 Services bento:
  - 6 colored cards with looping mini animations
  - tilt/press, speed-up on hover via WAAPI `playbackRate`
  - accessible expand dialog (framer-motion `layoutId`, focus, Esc, Lenis stop)
  - offscreen pause
- [ ] T6 Closing + polish:
  - rotating sticker, closing CTA, reveal springs
  - reduced-motion and mobile pass
  - final checks

## Acceptance criteria
- `/es/lab/playground` and `/en/lab/playground` return 200 and render the full page with no console errors.
- The toys float in a loop and react to the cursor. They can be dragged and thrown, and a click goes to their service. Touch scrolling works on mobile.
- Each service is identifiable by color, toy and card loop, and its detail dialog explains what it includes.
- Reduced motion: no autonomous motion. Without WebGL, the sticker fallback is shown.
- tsc passes, and eslint passes on new and touched files.

## Checks
- **TDD:** Strict TDD is enabled globally (user CLAUDE.md), but the project has no test runner (no `test` script). Following the repo precedent (`odd/tasks/aurora-borderbeam-lab.md`), only ordinary functional checks run. This was disclosed to the user.
- **Typecheck:** `node_modules/.bin/tsc --noEmit -p tsconfig.json`
- **Lint:** `node_modules/.bin/eslint 'app/[locale]/lab/playground'` plus any touched file. Baseline `eslint .` already fails at `app/components/RevealImage.tsx:44`.
- **Routes:** dev server on :3000; fetch `/es/lab/playground` and `/en/lab/playground`.
- **Screenshots:** headless Chromium through playwright-core (`~/WORK/Bit-A/mtkdv/bita-promo/node_modules`, `/usr/bin/chromium --use-angle=swiftshader --enable-unsafe-swiftshader`). Capture:
  - desktop 1440×900 viewport
  - mobile 390×844 viewport
  - reduced motion
  - no WebGL
- **Smoke tests:** pointer drag on a toy, and dialog keyboard open/close.

## Progress
- 2026-10-06:
  - Exploration done (codebase map in Engram `bit-a_web/restyle-codebase-map`).
  - Card layout removed site-wide (Engram `bit-a_web/layout-shell`).
  - "Playground" approved.
- Next: T1–T3 through one delegated writer, then a visual checkpoint by the parent before T4–T6.
- 2026-10-06 (later): the delegated writer was interrupted by the user mid-T3, after creating the full tree (~3.6k lines). Parent verified: tsc exit 0, eslint on `app/[locale]/lab` clean, `/es/lab`, `/en/lab`, `/es/lab/minimal`, `/es/lab/playground` all 200, zero page errors. Screenshots (scratchpad `playground/desk.hero.png`, `mob.hero.png`) show the 6 toys in 3D at desktop and mobile with no overlap on the text. T1 and T2 checked off.
- Route change requested by the user: the preview is now `/[locale]/lab` (re-export of `playground/page`); the earlier minimal hero moved to `/[locale]/lab/minimal`.
- T3 stays open: physics, drag/throw and click-to-service code exists but the Playwright drag/click smoke test has not been run. Reduced-motion and no-WebGL screenshots are also pending. Note: with swiftshader the 3D takes ~8 s to appear, so the sticker fallback shows first.
- Next: T3 smoke test, then T4–T6.
