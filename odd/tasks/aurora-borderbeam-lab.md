# Effects lab — Plasma glass + BorderBeam (formerly Aurora)

## Objective
Build a private showcase route (`/[locale]/lab`) to evaluate the visual effects for the Bit-A redesign before restyling the real site: a "plasma glass" material (backgrounds, surfaces, text fill with per-character reveal) and BorderBeam.

## Problem / Why
The site is moving to a light redesign (Bit Blue `#0B40FF`, tinted whites — never `#FFFFFF`), with sections that change background so the page is not flat (storytelling structure comes later). The first lab used a blurred-blob Aurora; the user rejected it (2026-10-06: "terrible no me gusta"). The approved direction is a plasma effect with subtle glow modeled on a glass "A" reference: blacks, blues and whites, orange only as moving dispersion fringes, also applied to text with a per-character reveal.

## Scope
- BorderBeam ported from Hacknoid (`~/WORK/Hacknoid/workspaces/hacknoid-current/web_react/src/reactComponents/components/BorderBeam`), plus a `plasma` palette.
- Plasma glass: WebGL1 fragment shader (approved prototype), a shared renderer, `PlasmaCanvas` and `PlasmaText`.
- Remove the rejected Aurora component.
- Lab page rebuilt around plasma.

Out of scope: changing existing pages, global tokens, navbar, storytelling structure.

## Constraints
- Next 16.3 / React 19.2 / Tailwind v4. No new dependencies (raw WebGL, no three.js for this).
- Light palette: Ice `#F4F6FD` (ground), Paper `#FCFDFF` (raised), Mist `#E8ECFA` (cards), Bit Blue `#0B40FF`, navy `#06134A`. No pure white backgrounds.
- `prefers-reduced-motion` respected (static frame, no reveal animation). Lab route is `noindex`.
- One WebGL context for all plasma instances (browsers cap contexts at ~16).
- PlasmaText uses blend modes: no ancestor between it and the element painting its background may create a stacking context (z-index, transform, opacity < 1, filter, will-change, isolation, mix-blend-mode).

## Tasks
- [x] T1 Port BorderBeam to `app/components/effects/BorderBeam/` (`'use client'`, React 19 ref types, Bit Blue palette preset).
- [ ] T2 Aurora component — reopened: look rejected by the user; delete `app/components/effects/Aurora/` and its usages.
- [ ] T3 Lab page — reopened: rebuild `app/[locale]/lab/page.tsx` around plasma (hero with PlasmaText reveal, dark plasma stage, plasma surfaces, typography/replay, dark closing).
- [x] T4 Checks for lab v1 (tsc, eslint, dev 200) — historical.
- [ ] T5 Plasma shader + presets module from the approved prototype (`bg`, `textLight`, `textDark`).
- [ ] T6 Shared plasma engine: one WebGL context on a detached canvas, `drawImage` into each target, IntersectionObserver/ResizeObserver, reduced motion, context loss, CSS fallback when WebGL is missing.
- [ ] T7 `PlasmaCanvas` + `PlasmaText` (blend-mode text fill, per-character reveal on mount / in view, sr-only text, glow via text-shadow).
- [ ] T8 BorderBeam `plasma` palette (blues + white, a single orange blob as motion accent).
- [ ] T9 Checks: tsc, eslint, `/es/lab` 200, headless Chromium screenshots reviewed against the reference.

## Acceptance criteria
- `/es/lab` renders: Ice hero whose headline is filled with plasma and reveals per character; dark plasma section; plasma surfaces; no white/black boxes around PlasmaText; no console errors.
- Plasma look matches the approved prototype (glass ribbons on black, blue/silver faces, white bevel glints, orange/blue dispersion fringes, no cyan/pink).
- Typecheck and lint pass on new files.

## Checks
- TDD: Strict TDD configured globally, but the project has no test runner (no `test` script) → ordinary functional checks only.
- `./node_modules/.bin/tsc --noEmit`, `./node_modules/.bin/eslint app/components/effects 'app/[locale]/lab'`, `next dev` + fetch `/es/lab`, headless Chromium screenshot (`--use-angle=swiftshader --enable-unsafe-swiftshader`).

## Progress
- Exploration done (2026-10-06).
- Lab v1 (T1–T4) done 2026-10-06: tsc/eslint exit 0, `/es/lab` 200. Visual review by the user: Aurora rejected.
- Plasma prototype iterated with headless screenshots (v1 soft blobs → v2 glass ribbons → v3 brand-angle flow → v4 orange/blue dispersion without cyan/pink → v6 strip light limited to bevels). Approved shader: session scratchpad `plasma/plasma.frag.glsl` (to be copied into T5). Default speed 0.6.
- Decision: text fill via blend modes (light: group `multiply` + ink layer white bg/black text `screen`; dark: group `screen` + ink black bg/white text `multiply`). Verified in Chromium with chars mid-reveal (opacity/translate/blur).
- Next: T2, T3, T5–T9 via one delegated writer; then visual review by the parent.
- 2026-10-06 pivot: user stopped the plasma integration — "lo único que me gustó fue el border beam plasma, todo lo demás está feo... busco algo más minimalista". Plasma shader/stage/text fill DROPPED (T5–T7, T9 cancelled; `app/components/effects/Plasma/` and lab `_components/` deleted; Aurora already gone → T2 done). T8 kept (BorderBeam `plasma` palette).
- Minimal hero test (T3 replaced): `app/[locale]/lab/page.tsx` + `lab.css` — Ice ground, navy Manrope headline with CSS-only per-character reveal, subtitle, CTA wrapped in BorderBeam `plasma`/light. Evidence: tsc exit 0, eslint exit 0, `/es/lab` 200 on the running dev server (:3000), headless screenshot reviewed (final state via reduced motion). Note: the existing `[locale]` layout frames pages in a rounded card over black — out of scope.
- Next: user visual feedback on the minimal hero.
