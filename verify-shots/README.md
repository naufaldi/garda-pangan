# Homepage mobile verification (390×844)

Captured on branch `cursor/fix-homepage-mobile-hero-logos-4ea1` after `npm run build && npm run preview` (port 4321).

Updated 2026-08-27: mobile layout aligned to live reference — volunteer bottom-left, fact right-aligned, stats in single-column rows with comma formatting.

| File | Description |
|------|-------------|
| `01-live-reference-390.png` | Production reference — https://gardapangan.org/id/ after GSAP pin settled |
| `02-branch-hero-settled-390.png` | Local branch hero facts overlay settled (opacity ≥ 0.98, stats at 825,002) |
| `03-branch-diliput-390.png` | Local branch Diliput oleh marquee — loadable logos only, no blank tiles |
| `04-branch-reduced-motion-390.png` | Local branch with `prefers-reduced-motion: reduce` |

## Vitest (2026-08-27)

```
 RUN  v3.2.4 /workspace

 ✓ src/lib/logo-media.test.ts (2 tests) 2ms
 ✓ src/components/featured-by-section.test.tsx (4 tests) 166ms
 ✓ src/components/hero-scroll-sequence.test.tsx (4 tests) 240ms

 Test Files  3 passed (3)
      Tests  10 passed (10)
   Duration  1.31s
```

## Build

```
npm run build — Complete (223 pages)
```
