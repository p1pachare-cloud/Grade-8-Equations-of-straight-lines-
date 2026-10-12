# Technical Requirements Document (TRD)

## Equation of Straight Lines — Slope, Intercepts & Linear Models | Grade 8 Math

### Intellia SG | Global Grade 8 Mathematics Curriculum

---

## 1. Technical Overview

This document specifies the architecture, component design, state management, data models, **procedural question engine**, simulation logic, gamification, audio pipeline and quality standards for the **"Global Line Riders — Equation of Straight Lines"** interactive lesson module (Grade 8 Math).

The module is a **React 18 application (Vite + JSX)**, structured to mirror the reference repository **<https://github.com/p1pachare-cloud/Grade5-Time-Intervals>** and styled to match **<https://grade5-time-intervals.vercel.app/>**. It will be embedded at:

```
https://intelliasg.com/courses/grade-8-math/lessons/equation-of-straight-lines/   (slug to be confirmed)
```

Three engineering themes distinguish this module from the Grade 5 reference:

1. **Exact arithmetic.** All maths uses rational numbers (`Frac`) rather than floating point, so slopes such as 1/3 are exact and answer-checking is never subject to rounding errors.
2. **Procedural, seeded question generation.** There is no static question bank. 100 questions per session are *generated* from a seed, validated by an independent solver, and are reproducible for session resume.
3. **Equivalence-based answer checking.** Equations are parsed and normalised, so `y = 2x + 3`, `2x − y = −3` and `y = 3 + 2x` are all accepted where appropriate.

Audio narration uses **ElevenLabs exclusively** (no Web Speech fallback), implementing the pipeline in `audio_generation_pipeline.md`, extended with a **server-side audio cache** to support dynamic (randomized) question narration.

---

## 2. Technology Stack

| Layer | Technology | Rationale |
| --- | --- | --- |
| UI framework | React 18 (JSX) + Vite | Matches reference repo (`vite.config.js`, `index.html`) |
| State management | `useReducer` + context | Single-module complexity; deterministic and testable |
| Styling | Tailwind CSS + a global `App.css` for tokens/animations | Matches reference repo (`tailwind.config.js`, `postcss.config.js`) |
| Icons | Lucide React | Lightweight, tree-shakeable |
| Graphs / diagrams | Custom inline SVG (`CoordinatePlane`) | Full control of drag, snapping, overlays and a11y; no heavy chart lib |
| Math | In-house `Frac` rational class + line utilities | Exactness; zero dependencies |
| Randomness | Seeded PRNG (`mulberry32`) | Reproducible sessions; resume without storing questions |
| Animation | CSS keyframes + a small `useTween` rAF hook | Smooth line morphing without a library |
| Persistence | `localStorage` (progress, seed, recent signatures) + `IndexedDB` (audio cache) | No backend needed |
| Audio | ElevenLabs (Alice) via static `.mp3` + `/api/elevenlabs` proxy; HTML5 `Audio` for playback | Per pipeline doc |
| Serverless | Vercel Functions (`api/elevenlabs.js`) | Hides API key; shared audio cache |
| Testing | Vitest + React Testing Library + Playwright (e2e) + `axe-core` | Unit, component, e2e, accessibility |
| Build / deploy | Vite production build → Vercel | Matches reference deployment |

**Bundle strategy:** phases are code-split with `React.lazy`; the question engine loads only when Play starts.

---

## 3. Project Structure (mirrors the Grade 5 reference repo)

```
grade8-equation-of-straight-lines/
├── public/
│   └── assets/
│       ├── audio/                          # Pre-generated .mp3 (fixed narration only)
│       │   ├── audio_wonder_hook_0.mp3
│       │   ├── audio_story_panel1_0.mp3 … audio_story_panel6_0.mp3
│       │   ├── audio_station_a_learn_0.mp3 … audio_station_d_learn_0.mp3
│       │   ├── audio_feedback_correct_0.mp3 … (pools)
│       │   └── …
│       └── images/
│           ├── mascot-grady-idle.svg  mascot-grady-happy.svg  mascot-grady-thinking.svg
│           ├── mascot-grady-celebrate.svg  mascot-grady-curious.svg  mascot-grady-encourage.svg
│           ├── world-map-bg.svg
│           └── landmarks/ (london.svg, newyork.svg, paris.svg, tokyo.svg, sydney.svg, cairo.svg,
│                           rio.svg, capetown.svg, mumbai.svg, reykjavik.svg)
├── src/
│   ├── main.jsx
│   ├── App.jsx                             # Root: providers, phase router
│   ├── App.css                             # Tokens + animations (mirrors reference)
│   ├── components/
│   │   ├── IntroScreen.jsx
│   │   ├── ProgressMap.jsx                 # 6-dot tracker (Play shows lock until stations done)
│   │   ├── phases/
│   │   │   ├── WonderPhase.jsx
│   │   │   ├── StoryPhase.jsx
│   │   │   ├── SimulatePhase.jsx           # Station hub + gating
│   │   │   ├── PlayPhase.jsx               # IntelliPlay™ engine host
│   │   │   └── ReflectPhase.jsx
│   │   ├── simulations/
│   │   │   ├── StationShell.jsx            # Learn card → Guided try → Challenge rounds
│   │   │   ├── SlopeExplorerStation.jsx    # Station A
│   │   │   ├── LineLabStation.jsx          # Station B
│   │   │   ├── EquationBuilderStation.jsx  # Station C
│   │   │   └── StreetPlannerStation.jsx    # Station D
│   │   ├── quiz/
│   │   │   ├── QuestionRenderer.jsx        # Dispatch by question.format
│   │   │   ├── McqQuestion.jsx
│   │   │   ├── NumericQuestion.jsx
│   │   │   ├── EquationQuestion.jsx
│   │   │   ├── GraphPlotQuestion.jsx
│   │   │   ├── TrueFalseQuestion.jsx
│   │   │   ├── FillBlanksQuestion.jsx
│   │   │   ├── SortQuestion.jsx
│   │   │   └── HintOverlay.jsx
│   │   ├── gamification/
│   │   │   ├── XPTracker.jsx  StarRating.jsx  BadgePanel.jsx
│   │   │   ├── StreakCounter.jsx  WorldMap.jsx
│   │   └── shared/
│   │       ├── Mascot.jsx                  # Grady, mood states, slope-tilting antenna
│   │       ├── CoordinatePlane.jsx         # Core SVG graph
│   │       ├── SlopeTriangle.jsx           # Rise/run overlay
│   │       ├── SliderControl.jsx           # Slope / intercept sliders with snap marks
│   │       ├── MathPad.jsx                 # On-screen keypad for equations & fractions
│   │       ├── MathText.jsx                # Renders Rich → stacked fractions, true minus
│   │       ├── LearnCard.jsx
│   │       └── FeedbackOverlay.jsx
│   ├── engine/                             # Pure JS, no React — fully unit-tested
│   │   ├── fraction.js                     # Frac class
│   │   ├── line.js                         # Line model, from points, standard form, etc.
│   │   ├── parseLinear.js                  # Equation parser + normaliser
│   │   ├── rng.js                          # mulberry32, pick, int, shuffle, seed hashing
│   │   ├── rich.js                         # Rich text tokens: display + spoken twin
│   │   ├── speak.js                        # numToWords, fraction/equation/point speech
│   │   ├── blueprint.js                    # World blueprint (type mix, difficulty)
│   │   ├── contexts.js                     # Names, cities, currencies, objects
│   │   ├── generators/
│   │   │   ├── q1_slopeFromPoints.js
│   │   │   ├── q2_slopeFromGraph.js
│   │   │   ├── q3_readSlopeIntercept.js
│   │   │   ├── q4_writeEquation.js
│   │   │   ├── q5_pointSlope.js
│   │   │   ├── q6_twoPoints.js
│   │   │   ├── q7_pointOnLine.js
│   │   │   ├── q8_standardForm.js
│   │   │   ├── q9_parallelPerpendicular.js
│   │   │   ├── q10_wordModel.js
│   │   │   └── index.js                    # registry
│   │   ├── distractors.js                  # Misconception-driven distractors
│   │   ├── validate.js                     # Independent-solver verification
│   │   ├── generateWorld.js                # Orchestrates 10 questions for a world
│   │   └── checkAnswer.js
│   ├── data/
│   │   ├── storyContent.js                 # Panels (text + visuals)
│   │   ├── stationContent.js               # Learn cards, guided steps
│   │   └── badges.js
│   ├── hooks/
│   │   ├── useAudio.js
│   │   ├── useGameState.js
│   │   ├── useLocalStorage.js
│   │   ├── useTween.js
│   │   └── usePointerDrag.js
│   └── utils/
│       ├── audio.js                        # getAudioUrl, narrate, stopNarration, segment helpers
│       ├── audioMap.js                     # AUTO-GENERATED: text → .mp3 path
│       ├── narration.js                    # Phase narration scripts (paragraphs & questions only)
│       ├── scoring.js                      # XP, stars
│       └── badgeEngine.js
├── scripts/
│   ├── generate_audio.js                   # Offline ElevenLabs pre-generation (+ writes audioMap.js)
│   ├── clean_audio.js                      # Removes orphaned .mp3
│   └── check_parity.js                     # Narration ↔ phrases ↔ UI parity test
├── api/
│   └── elevenlabs.js                       # Proxy + shared audio cache
├── tests/                                  # unit/ component/ e2e/
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vite.config.js
├── vercel.json
└── .gitignore
```

---

## 4. Application State Architecture

### 4.1 Phases

```js
export const PHASES = ['intro', 'wonder', 'story', 'simulate', 'play', 'reflect']; // 6 tracker dots
export const CONTENT_PHASES = ['wonder', 'story', 'simulate', 'play', 'reflect'];   // have completion flags
```

### 4.2 Global state (`App.jsx`, `useReducer`)

```js
const initialState = {
  // Navigation
  phase: 'intro',
  storyPanel: 0,                         // 0–5

  // Simulation
  stations: {                            // per-station progress
    A: { learned: false, guidedDone: false, roundsDone: 0, wrongSubmits: 0, complete: false },
    B: { learned: false, guidedDone: false, roundsDone: 0, wrongSubmits: 0, complete: false },
    C: { learned: false, guidedDone: false, roundsDone: 0, wrongSubmits: 0, complete: false },
    D: { learned: false, guidedDone: false, roundsDone: 0, wrongSubmits: 0, complete: false },
  },

  // Play
  seed: null,                            // 32-bit session seed (set once; persisted)
  worldAttempts: Array(10).fill(0),      // replay counter → part of world seed
  currentWorld: 0,                       // 0–9
  currentSlot: 0,                        // 0–9 within the world
  worldQuestions: null,                  // Question[10] for the active world (regenerated, not persisted)
  worldCorrect: Array(10).fill(null),    // correct count of the *current* attempt
  worldBest: Array(10).fill(null),       // best correct count per world
  attemptCount: 0,                       // attempts on the current question (max 3)
  hintsUsed: 0,
  recentSignatures: [],                  // last 300 signatures (cross-session dedupe)
  sessionSignatures: [],                 // signatures seen this session

  // Gamification
  xp: 0, streak: 0, maxStreak: 0,
  badges: [],
  slopeMasterCount: 0,                   // negative/fractional-slope questions answered correctly

  // Completion
  phaseComplete: { wonder: false, story: false, simulate: false, play: false, reflect: false },

  // Settings
  audioEnabled: true,
  reducedMotion: false,                  // initialised from prefers-reduced-motion
  sessionId: crypto.randomUUID(),
};
```

### 4.3 Derived selectors (never stored)

```js
export const playUnlocked   = (s) => Object.values(s.stations).every((st) => st.complete);
export const totalStars     = (s) => s.worldBest.reduce((n, c) => n + (c == null ? 0 : calcStars(c)), 0);
export const totalBestScore = (s) => s.worldBest.reduce((n, c) => n + (c ?? 0), 0);
export const worldUnlocked  = (s, w) => w === 0 || (s.worldBest[w - 1] ?? 0) >= 6;
```

### 4.4 Action types

```js
export const ACTIONS = {
  SET_PHASE, NEXT_STORY_PANEL, COMPLETE_PHASE,
  STATION_LEARNED, STATION_GUIDED_DONE, STATION_ROUND_DONE, STATION_WRONG_SUBMIT,
  START_SESSION, START_WORLD, ANSWER_CORRECT, ANSWER_INCORRECT, USE_HINT, NEXT_QUESTION, FINISH_WORLD,
  UNLOCK_BADGES, TOGGLE_AUDIO, RESTORE_SESSION, RESET_SESSION,
};
```

### 4.5 Key reducer logic

```js
case ACTIONS.ANSWER_CORRECT: {
  const { attemptNumber, hintsUsed, tags } = action.payload;      // attemptNumber is 1-based
  const xpEarned = calcXP(attemptNumber, hintsUsed, state.streak);
  // The streak counts only first-try, hint-free correct answers.
  const firstTry = attemptNumber === 1 && hintsUsed === 0;
  const streak = firstTry ? state.streak + 1 : 0;
  const correct = [...state.worldCorrect];
  correct[state.currentWorld] = (correct[state.currentWorld] ?? 0) + 1;
  const isSlopeMaster = tags.includes('negativeSlope') || tags.includes('fractionSlope');
  return {
    ...state,
    xp: state.xp + xpEarned,
    streak,
    maxStreak: Math.max(state.maxStreak, streak),
    worldCorrect: correct,
    slopeMasterCount: state.slopeMasterCount + (isSlopeMaster ? 1 : 0),
    attemptCount: 0, hintsUsed: 0,
  };
}

case ACTIONS.ANSWER_INCORRECT:
  return { ...state, streak: 0, attemptCount: state.attemptCount + 1 };

case ACTIONS.FINISH_WORLD: {
  const best = [...state.worldBest];
  const score = state.worldCorrect[state.currentWorld] ?? 0;
  best[state.currentWorld] = Math.max(best[state.currentWorld] ?? 0, score);
  return { ...state, worldBest: best };
}
```

> **Design note (corrects a reference-repo inconsistency):** the star function, the unlock gate and the badge conditions all read the same selectors (`worldBest`, ≥ 6 gate), so the three can never disagree.

---

## 5. Math Engine (`src/engine/`)

All geometry and algebra uses **exact rationals**. Floating point is permitted *only* at the final rendering step (SVG coordinates).

### 5.1 `fraction.js`

```js
const gcd = (a, b) => (b === 0 ? Math.abs(a) : gcd(b, a % b));
export const lcm = (a, b) => (a === 0 || b === 0 ? 0 : Math.abs(a * b) / gcd(a, b));
export { gcd };

export class Frac {
  constructor(n, d = 1) {
    if (!Number.isInteger(n) || !Number.isInteger(d)) throw new TypeError('Frac needs integers');
    if (d === 0) throw new RangeError('Zero denominator');
    if (d < 0) { n = -n; d = -d; }
    const g = gcd(n, d) || 1;
    this.n = n / g;
    this.d = d / g;
  }
  static of(x)       { return x instanceof Frac ? x : new Frac(x, 1); }
  static parse(str)  {                           // "3", "-2", "1/2", "0.25"
    if (str.includes('/')) { const [a, b] = str.split('/'); return new Frac(parseInt(a, 10), parseInt(b, 10)); }
    const [i, f = ''] = str.split('.');
    const den = 10 ** f.length;
    return new Frac(parseInt(i + f, 10), den);
  }
  add(o) { o = Frac.of(o); return new Frac(this.n * o.d + o.n * this.d, this.d * o.d); }
  sub(o) { o = Frac.of(o); return new Frac(this.n * o.d - o.n * this.d, this.d * o.d); }
  mul(o) { o = Frac.of(o); return new Frac(this.n * o.n, this.d * o.d); }
  div(o) { o = Frac.of(o); return new Frac(this.n * o.d, this.d * o.n); }
  neg()  { return new Frac(-this.n, this.d); }
  recip(){ return new Frac(this.d, this.n); }
  eq(o)  { o = Frac.of(o); return this.n === o.n && this.d === o.d; }
  lt(o)  { o = Frac.of(o); return this.n * o.d < o.n * this.d; }
  isInt(){ return this.d === 1; }
  isZero(){ return this.n === 0; }
  sign() { return Math.sign(this.n); }
  abs()  { return new Frac(Math.abs(this.n), this.d); }
  toNumber() { return this.n / this.d; }
  key()  { return `${this.n}/${this.d}`; }
}
export const F = (n, d = 1) => new Frac(n, d);
```

### 5.2 `line.js`

```js
// Line = { kind: 'oblique', m: Frac, c: Frac }   y = m x + c        (m ≠ 0)
//      | { kind: 'horizontal', m: Frac(0), c: Frac }  y = c
//      | { kind: 'vertical', x: Frac }                x = h          (slope undefined)

export const pt = (x, y) => ({ x: Frac.of(x), y: Frac.of(y) });

export function lineFromPoints(p1, p2) {
  if (p1.x.eq(p2.x)) {
    if (p1.y.eq(p2.y)) throw new Error('Points must be distinct');
    return { kind: 'vertical', x: p1.x };
  }
  const m = p2.y.sub(p1.y).div(p2.x.sub(p1.x));
  const c = p1.y.sub(m.mul(p1.x));                      // c = y1 − m·x1
  return { kind: m.isZero() ? 'horizontal' : 'oblique', m, c };
}

export function lineFromSlopeIntercept(m, c) {
  m = Frac.of(m); c = Frac.of(c);
  return { kind: m.isZero() ? 'horizontal' : 'oblique', m, c };
}

export function lineFromPointSlope(p, m) {
  m = Frac.of(m);
  return lineFromSlopeIntercept(m, p.y.sub(m.mul(p.x)));
}

export const slopeOf = (L) => (L.kind === 'vertical' ? null : L.m);          // null = undefined slope
export const yAt     = (L, x) => Frac.of(x).mul(L.m).add(L.c);              // not for vertical
export const contains = (L, p) =>
  L.kind === 'vertical' ? p.x.eq(L.x) : p.y.eq(yAt(L, p.x));
export const yIntercept = (L) => (L.kind === 'vertical' ? null : L.c);
export const xIntercept = (L) =>
  L.kind === 'vertical' ? L.x : L.kind === 'horizontal' ? null : L.c.neg().div(L.m);

export const areParallel = (a, b) =>
  a.kind === 'vertical' ? b.kind === 'vertical' && !a.x.eq(b.x)
  : b.kind !== 'vertical' && a.m.eq(b.m) && !a.c.eq(b.c);

export const arePerpendicular = (a, b) => {
  if (a.kind === 'vertical') return b.kind === 'horizontal';
  if (a.kind === 'horizontal') return b.kind === 'vertical';
  return b.kind !== 'vertical' && a.m.mul(b.m).eq(-1);
};

export function perpendicularThrough(L, p) {
  if (L.kind === 'vertical')   return lineFromSlopeIntercept(0, p.y);
  if (L.kind === 'horizontal') return { kind: 'vertical', x: p.x };
  return lineFromPointSlope(p, L.m.recip().neg());
}
export const parallelThrough = (L, p) =>
  L.kind === 'vertical' ? { kind: 'vertical', x: p.x } : lineFromPointSlope(p, L.m);

// Standard form  A x + B y = C  (integers, gcd 1, leading non-zero coefficient positive)
export function toStandard(L) {
  if (L.kind === 'vertical') return normalise(1, 0, L.x);
  const A = L.m.neg(), B = F(1), C = L.c;               // −m x + y = c
  return normalise(A, B, C);
}
export function normalise(A, B, C) {
  A = Frac.of(A); B = Frac.of(B); C = Frac.of(C);
  if (A.isZero() && B.isZero()) return null;
  const L = lcm(lcm(A.d, B.d), C.d);
  let a = A.n * (L / A.d), b = B.n * (L / B.d), c = C.n * (L / C.d);
  const g = gcd(gcd(a, b), c) || 1;
  a /= g; b /= g; c /= g;
  if ((a !== 0 ? a : b) < 0) { a = -a; b = -b; c = -c; }
  return { A: a, B: b, C: c };
}
export const sameLine = (L1, L2) => {
  const s1 = toStandard(L1), s2 = toStandard(L2);
  return s1.A === s2.A && s1.B === s2.B && s1.C === s2.C;
};
```

**Worked check:** `y = 2x + 3` → `A = −2, B = 1, C = 3` → leading coefficient negative → `(2, −1, −3)` = `2x − y = −3`. ✅

### 5.3 Rendering helper — `clipLine`

```js
// Returns two [x, y] numeric endpoints where the line meets the viewport, or null if it never does.
export function clipLine(L, vp) {
  const { xMin, xMax, yMin, yMax } = vp;
  if (L.kind === 'vertical') {
    const x = L.x.toNumber();
    return x < xMin || x > xMax ? null : [[x, yMin], [x, yMax]];
  }
  const m = L.m.toNumber(), c = L.c.toNumber();
  if (m === 0) return c < yMin || c > yMax ? null : [[xMin, c], [xMax, c]];
  const eps = 1e-9;
  const cand = [[xMin, m * xMin + c], [xMax, m * xMax + c], [(yMin - c) / m, yMin], [(yMax - c) / m, yMax]]
    .filter(([x, y]) => x >= xMin - eps && x <= xMax + eps && y >= yMin - eps && y <= yMax + eps)
    .sort((a, b) => a[0] - b[0]);
  return cand.length < 2 ? null : [cand[0], cand[cand.length - 1]];
}
```

---

## 6. Procedural Question Engine

### 6.1 Seeded randomness (`rng.js`)

```js
export function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
export const newSeed   = () => crypto.getRandomValues(new Uint32Array(1))[0];
export const mixSeed   = (...nums) => nums.reduce((h, n) => Math.imul(h ^ (n + 0x9e3779b9), 0x85ebca6b) >>> 0, 0x811c9dc5);
export const int       = (r, lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
export const pick      = (r, arr) => arr[Math.floor(r() * arr.length)];
export const chance    = (r, p) => r() < p;
export function shuffle(r, arr) {                           // Fisher–Yates
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}
```

**Seed derivation:** `slotSeed = mixSeed(sessionSeed, world, worldAttempt, slot, retry)`. The same inputs always regenerate the same question, so resume needs only `(seed, world, attempt, slot)`, not the questions.

### 6.2 World blueprint (`blueprint.js`)

```js
export const BLUEPRINT = [
  { world: 0, name: 'London',        mix: { Q1: 3, Q2: 4, Q3: 3 },                          diff: { 1: 1.0 } },
  { world: 1, name: 'New York',      mix: { Q1: 4, Q2: 3, Q3: 3 },                          diff: { 1: 0.5, 2: 0.5 } },
  { world: 2, name: 'Paris',         mix: { Q2: 1, Q3: 4, Q4: 3, Q7: 2 },                   diff: { 1: 0.5, 2: 0.5 } },
  { world: 3, name: 'Tokyo',         mix: { Q3: 3, Q4: 4, Q7: 3 },                          diff: { 2: 1.0 } },
  { world: 4, name: 'Sydney',        mix: { Q3: 1, Q4: 3, Q7: 2, Q10: 4 },                  diff: { 2: 1.0 } },
  { world: 5, name: 'Cairo',         mix: { Q1: 1, Q4: 2, Q5: 5, Q7: 2 },                   diff: { 2: 1.0 } },
  { world: 6, name: 'Rio',           mix: { Q1: 2, Q5: 2, Q6: 5, Q7: 1 },                   diff: { 2: 0.5, 3: 0.5 } },
  { world: 7, name: 'Cape Town',     mix: { Q3: 1, Q6: 1, Q7: 2, Q8: 6 },                   diff: { 3: 1.0 } },
  { world: 8, name: 'Mumbai',        mix: { Q1: 1, Q4: 1, Q6: 2, Q9: 6 },                   diff: { 3: 1.0 } },
  { world: 9, name: 'Reykjavik',     mix: { Q4: 1, Q5: 1, Q6: 2, Q8: 1, Q9: 2, Q10: 3 },    diff: { 3: 1.0 } },
];
// Σ per world = 10; Σ per type: Q1 11, Q2 8, Q3 15, Q4 14, Q5 8, Q6 10, Q7 12, Q8 7, Q9 8, Q10 7 = 100.
// A unit test asserts both sums.
```

### 6.3 Question schema

```ts
interface Rich { display: string; spoken: string; }              // display text + speakable twin

interface Question {
  id: string;                         // `${seed}:${world}:${attempt}:${slot}`
  world: number; slot: number;
  type: 'Q1'|'Q2'|'Q3'|'Q4'|'Q5'|'Q6'|'Q7'|'Q8'|'Q9'|'Q10';
  variant: string;                    // template variant id, e.g. 'Q4.fromSlopeIntercept'
  difficulty: 1 | 2 | 3;
  format: 'mcq'|'numeric'|'equation'|'graph-plot'|'true-false'|'fill-blanks'|'sort';
  signature: string;                  // type + variant + normalised params (dedupe key)
  tags: string[];                     // 'negativeSlope','fractionSlope','vertical','horizontal','word','extension',…

  stem: Rich;                         // narrated question text (the ONLY narrated field + optional hints)
  visual?: {                          // what the CoordinatePlane should show
    viewport?: { xMin: number; xMax: number; yMin: number; yMax: number };
    lines?: { line: Line; style: 'solid' | 'ghost' }[];
    points?: { p: Point; label?: string; draggable?: boolean }[];
    showRiseRun?: boolean; showIntercepts?: boolean;
  };

  answer: Answer;                     // canonical, exact (see 6.4)
  options?: { id: string; label: Rich; value: Answer }[];   // mcq / true-false
  requireForm?: 'slope-intercept' | 'standard' | 'any';     // equation questions

  hint1: Rich;                        // concept nudge (after 1st miss)
  hint2: Rich;                        // worked step; triggers animation (after 2nd miss)
  explanation: Rich;                  // full worked solution (after 3rd miss; narrated)

  context?: { name: string; city: string; currency?: string; object?: string };
  params: Record<string, unknown>;    // raw generation params (debug, validation, signature)
}

type Answer =
  | { kind: 'frac';  value: Frac }
  | { kind: 'line';  line: Line }
  | { kind: 'pair';  m: Frac | null; c: Frac | null }      // slope & intercept
  | { kind: 'bool';  value: boolean }
  | { kind: 'point'; p: Point }
  | { kind: 'class'; value: 'parallel' | 'perpendicular' | 'neither' }
  | { kind: 'multi'; parts: Answer[] };                    // e.g. word problems with two outputs
```

### 6.4 Rich text with built-in speech parity (`rich.js`)

Every stem, hint and explanation is composed from **tokens** that each know both their *display* and *spoken* form. Because both come from the same token, display and audio **cannot drift**.

```js
export const M = {
  text: (s)        => ({ d: s, s }),
  name: (s)        => ({ d: s, s }),
  num:  (n)        => ({ d: fmtFrac(Frac.of(n)), s: sayFrac(Frac.of(n)) }),
  frac: (f)        => ({ d: fmtFrac(f),          s: sayFrac(f) }),
  pt:   (p)        => ({ d: `(${fmtFrac(p.x)}, ${fmtFrac(p.y)})`, s: `${sayFrac(p.x)}, ${sayFrac(p.y)}` }),
  eq:   (L, form='si') => ({ d: eqDisplay(L, form), s: eqSpoken(L, form) }),
  money:(v, cur)   => ({ d: `${cur.symbol}${v}`,   s: `${sayFrac(Frac.of(v))} ${cur.spoken}` }),
  unit: (n, u)     => ({ d: `${fmtFrac(Frac.of(n))} ${u}`, s: `${sayFrac(Frac.of(n))} ${u}` }),
};

// Tagged template: rich`${M.name('Liam')} plots point A at ${M.pt(A)} and point B at ${M.pt(B)}.`
export function rich(strings, ...tokens) {
  let d = '', s = '';
  strings.forEach((str, i) => {
    d += str; s += str;
    if (tokens[i]) { d += tokens[i].d; s += tokens[i].s; }
  });
  return { display: d, spoken: s };
}
```

Static prose may also use `rich` with `M.text`, so every narrated string in the app flows through one type.

### 6.5 Speech utilities (`speak.js`)

```js
const ONES = ['zero','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve',
  'thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen'];
const TENS = ['', '', 'twenty','thirty','forty','fifty','sixty','seventy','eighty','ninety'];

export function numToWords(n) {                                   // integer 0 … 9999
  if (n < 20) return ONES[n];
  if (n < 100) return TENS[Math.floor(n / 10)] + (n % 10 ? '-' + ONES[n % 10] : '');
  if (n < 1000) return ONES[Math.floor(n / 100)] + ' hundred' + (n % 100 ? ' ' + numToWords(n % 100) : '');
  return numToWords(Math.floor(n / 1000)) + ' thousand' + (n % 1000 ? ' ' + numToWords(n % 1000) : '');
}

export function sayFrac(f) {
  const neg = f.n < 0 ? 'negative ' : '';
  const n = Math.abs(f.n);
  if (f.isInt()) return neg + numToWords(n);
  const d = f.d;
  const denom = d === 2 ? (n === 1 ? 'half' : 'halves') : d === 4 ? (n === 1 ? 'quarter' : 'quarters') : null;
  return neg + (denom ? `${numToWords(n)} ${denom}` : `${numToWords(n)} over ${numToWords(d)}`);
}

// Spoken equation: "y equals two x plus three"
export function eqSpoken(L, form = 'si') {
  if (L.kind === 'vertical')   return `x equals ${sayFrac(L.x)}`;
  if (L.kind === 'horizontal') return `y equals ${sayFrac(L.c)}`;
  if (form === 'std') {
    const { A, B, C } = toStandard(L);
    const term = (k, v, first) => k === 0 ? '' :
      `${first ? (k < 0 ? 'negative ' : '') : (k < 0 ? ' minus ' : ' plus ')}${Math.abs(k) === 1 ? '' : numToWords(Math.abs(k)) + ' '}${v}`;
    return `${term(A, 'x', true)}${term(B, 'y', A === 0)} equals ${sayFrac(F(C))}`.trim();
  }
  const m = L.m, c = L.c;
  const mWord = m.eq(1) ? 'x' : m.eq(-1) ? 'negative x' : m.isInt() ? `${sayFrac(m)} x` : `${sayFrac(m)} x`;
  const cWord = c.isZero() ? '' : c.sign() > 0 ? ` plus ${sayFrac(c)}` : ` minus ${sayFrac(c.abs())}`;
  return `y equals ${mWord}${cWord}`;
}
```

*Reference test vectors* (also in the unit tests): `y = 2x + 3` → "y equals two x plus three" · `y = −x + 4` → "y equals negative x plus four" · `y = (1/2)x − 3` → "y equals one half x minus three" · `x = 4` → "x equals four" · `2x − y = −3` → "two x minus y equals negative three".

### 6.6 Generator contract and registry

```js
// A generator receives a seeded rng and returns a *draft* question (no id/world/slot).
// type Generator = (rng, { difficulty, ctx, world }) => QuestionDraft | null   (null = reject, engine retries)
export const GENERATORS = {
  Q1: genSlopeFromPoints, Q2: genSlopeFromGraph, Q3: genReadSlopeIntercept, Q4: genWriteEquation,
  Q5: genPointSlope, Q6: genTwoPoints, Q7: genPointOnLine, Q8: genStandardForm,
  Q9: genParallelPerpendicular, Q10: genWordModel,
};
```

#### Example — Q1 `genSlopeFromPoints` (clean answers by construction)

```js
export function genSlopeFromPoints(rng, { difficulty, ctx }) {
  // 1. Choose m = n/d first, then build integer points that realise it exactly.
  const m = difficulty === 1 ? F(int(rng, 1, 5))
          : difficulty === 2 ? pick(rng, [F(int(rng, -5, -1)), F(int(rng, 1, 5)), F(1, 2), F(-1, 2), F(1, 3), F(2, 3), F(-3, 4)])
          :                    pick(rng, [F(-1, 2), F(-2, 3), F(3, 4), F(-3, 2), F(5, 3), F(0), F(int(rng, -6, 6))]);
  const k  = int(rng, 1, 3);
  const dx = (chance(rng, 0.5) ? 1 : -1) * m.d * k;                // run (may be negative → points listed right-to-left)
  const dy = m.n * k * Math.sign(dx);                              // = m * dx, integer
  const x1 = int(rng, -10, 10), y1 = int(rng, -10, 10);
  const p1 = pt(x1, y1), p2 = pt(x1 + dx, y1 + dy);
  if (![p1, p2].every((p) => Math.abs(p.x.n) <= 10 && Math.abs(p.y.n) <= 10)) return null;   // reject → retry

  const L = lineFromPoints(p1, p2);
  const A = ctx.pointNames;                                         // e.g. ['A','B']
  return {
    type: 'Q1', variant: 'Q1.twoPoints', format: difficulty === 1 ? 'mcq' : 'numeric',
    tags: [m.sign() < 0 && 'negativeSlope', !m.isInt() && 'fractionSlope', m.isZero() && 'zeroSlope'].filter(Boolean),
    stem: rich`${M.name(ctx.name)} plots point ${M.text(A[0])} at ${M.pt(p1)} and point ${M.text(A[1])} at ${M.pt(p2)}. What is the slope of the line through them?`,
    visual: { points: [{ p: p1, label: A[0] }, { p: p2, label: A[1] }], showRiseRun: false },
    answer: { kind: 'frac', value: L.m },
    options: slopeDistractors(L.m, p1, p2, rng),                    // 4 options incl. the answer
    hint1: rich`Slope is rise divided by run. How far up (or down) do you go from ${M.text(A[0])} to ${M.text(A[1])}?`,
    hint2: rich`The rise is ${M.num(p2.y.sub(p1.y))} and the run is ${M.num(p2.x.sub(p1.x))}. Divide the rise by the run.`,
    explanation: rich`Rise is ${M.num(p2.y.sub(p1.y))}. Run is ${M.num(p2.x.sub(p1.x))}. Slope equals rise over run, which is ${M.frac(L.m)}.`,
    params: { p1: [x1, y1], p2: [p2.x.n, p2.y.n] },
    signature: `Q1|${p1.x.n},${p1.y.n}|${p2.x.n},${p2.y.n}`,
  };
}
```

#### Example — Q6 `genTwoPoints`

```js
export function genTwoPoints(rng, { difficulty, ctx }) {
  const m = difficulty < 3 ? pick(rng, [F(int(rng, 1, 4)), F(int(rng, -4, -1)), F(1, 2), F(-1, 2)])
                           : pick(rng, [F(-2, 3), F(3, 4), F(-3, 2), F(1, 3), F(5, 2)]);
  const c  = F(int(rng, -8, 8));
  const x1 = m.d * int(rng, -3, 2);                                // m·x1 integer ⇒ y1 integer
  const x2 = x1 + m.d * int(rng, 1, 3);
  const p1 = pt(x1, m.mul(x1).add(c)), p2 = pt(x2, m.mul(x2).add(c));
  if (![p1, p2].every((p) => Math.abs(p.x.n) <= 12 && Math.abs(p.y.n) <= 12)) return null;
  const L = lineFromSlopeIntercept(m, c);
  return {
    type: 'Q6', variant: 'Q6.twoPoints', format: 'equation', requireForm: 'slope-intercept',
    tags: ['equation', m.sign() < 0 && 'negativeSlope', !m.isInt() && 'fractionSlope'].filter(Boolean),
    stem: rich`A line passes through ${M.pt(p1)} and ${M.pt(p2)}. Write its equation in the form y equals m x plus c.`,
    visual: { points: [{ p: p1 }, { p: p2 }] },
    answer: { kind: 'line', line: L },
    hint1: rich`First find the slope: rise divided by run between the two points.`,
    hint2: rich`The slope is ${M.frac(m)}. Now substitute one point into y equals m x plus c and solve for c.`,
    explanation: rich`The slope is ${M.frac(m)}. Using the point ${M.pt(p1)}, c equals ${M.frac(c)}. So the equation is ${M.eq(L)}.`,
    params: { m: m.key(), c: c.key(), x1, x2 },
    signature: `Q6|${p1.x.n},${p1.y.n}|${p2.x.n},${p2.y.n}`,
  };
}
```

Each of the other eight generators follows the same pattern (choose the *answer* parameters first so values stay clean, then derive the givens).

### 6.7 Misconception-driven distractors (`distractors.js`)

```js
export function slopeDistractors(m, p1, p2, rng) {
  const rise = p2.y.sub(p1.y), run = p2.x.sub(p1.x);
  const cands = [
    m.isZero() ? null : m.recip(),                 // inverted (run ÷ rise)
    m.neg(),                                       // sign error
    run.isZero() ? null : rise.div(run.neg()),     // inconsistent subtraction order
    p2.y.add(p1.y).div(p2.x.add(p1.x).isZero() ? F(1) : p2.x.add(p1.x)),   // added instead of subtracted
    m.add(1), m.sub(1),                            // off-by-one fallbacks
  ].filter(Boolean).filter((f) => !f.eq(m));
  return buildOptions(m, cands, rng);              // dedupes, ensures exactly 4 unique, shuffles
}
```

`buildOptions(answer, candidates, rng)` guarantees: the correct answer appears **exactly once**; all labels are distinct *as displayed*; the position of the correct answer is uniformly random.

### 6.8 World generation (`generateWorld.js`)

```js
export function generateWorld({ seed, world, attempt, recent = new Set(), session = new Set() }) {
  const bp = BLUEPRINT[world];
  const slots = shuffle(mixRng(seed, world, attempt, 'order'),
    Object.entries(bp.mix).flatMap(([type, n]) => Array(n).fill(type)));       // random order of types
  const diffs = pickDifficulties(bp.diff, slots.length, mixRng(seed, world, attempt, 'diff'));

  const out = [];
  slots.forEach((type, slot) => {
    for (let retry = 0; retry < 40; retry++) {
      const rng = mulberry32(mixSeed(seed, world, attempt, slot, retry));
      const ctx = makeContext(rng, world);                                      // name, city, currency, pointNames
      const draft = GENERATORS[type](rng, { difficulty: diffs[slot], ctx, world });
      if (!draft) continue;
      if (session.has(draft.signature)) continue;                               // never repeat within session
      if (retry < 20 && recent.has(draft.signature)) continue;                  // best-effort across sessions
      const q = finalise(draft, { seed, world, attempt, slot, difficulty: diffs[slot], ctx });
      if (!verify(q).ok) continue;                                              // independent solver (6.9)
      session.add(q.signature); out.push(q); return;
    }
    throw new Error(`Generator exhausted for ${type} in world ${world}`);       // must never happen (tests)
  });
  return out;
}
```

### 6.9 Independent-solver validation (`validate.js`)

Every generated question is re-checked by logic that **does not reuse the generator's own derivation**:

| Check | How |
| --- | --- |
| Answer satisfies the givens | e.g. Q6: the answer line must contain **both** given points (via `contains`) |
| Slope questions | Recompute slope by an alternative route: `(y₂ − y₁)/(x₂ − x₁)` with integer arithmetic and by the equation of the line through the points |
| Word models | Evaluate the answer equation at the stated `x`; compare with the stated result |
| Options | Exactly one option equals the answer; all labels distinct; no option is equivalent to the answer under `checkAnswer` |
| Range | All plotted points within the viewport |
| Non-degenerate | Distinct points; no division by zero |
| Narration | `stem.spoken` contains no digits or symbols (`+`, `−`, `=`, `/`, `(`, `)`) — i.e., everything is speakable |
| Signature | Non-empty; unique within the session |

A failed validation discards the question and regenerates it with `retry + 1`.

### 6.10 Answer checking (`checkAnswer.js`)

```js
export function checkAnswer(q, response) {
  switch (q.answer.kind) {
    case 'frac':  { const f = parseFracInput(response); return f != null && f.eq(q.answer.value); }
    case 'bool':  return response === q.answer.value;
    case 'class': return response === q.answer.value;
    case 'point': return response.x.eq(q.answer.p.x) && response.y.eq(q.answer.p.y);
    case 'pair':  return eqOrNull(response.m, q.answer.m) && eqOrNull(response.c, q.answer.c);
    case 'line': {
      const user = typeof response === 'string' ? parseLinear(response) : toStandard(response);   // graph-plot passes a Line
      if (!user) return false;
      const target = toStandard(q.answer.line);
      const sameGeometry = user.A === target.A && user.B === target.B && user.C === target.C;
      return sameGeometry && formOk(q.requireForm, response);                                     // see 7.3
    }
    case 'multi': return q.answer.parts.every((part, i) => checkAnswer({ ...q, answer: part }, response[i]));
  }
}
```

`parseFracInput` accepts `"3"`, `"-2"`, `"−2"` (U+2212), `"1/2"`, `"0.5"`, `".5"`, and `"-3/4"`; it rejects empty strings, `"1/0"` and anything else.

---

## 7. Equation Parser (`parseLinear.js`)

### 7.1 Requirements

Accept natural student input and map it to the canonical `{A, B, C}` of `A x + B y = C`:

`y=2x+3` · `y = 2x + 3` · `y = 3 + 2x` · `2x - y = -3` · `-2x + y - 3 = 0` · `y = 0.5x + 2` · `y = 1/2x + 2` · `y = (1/2)x + 2` · `y = x/2 + 2` · `y = -x` · `x = 4` · `y = 3` · `2*x + 3 = y` (and the Unicode minus `−`).

### 7.2 Implementation

```js
const TERM = /^([+-])?(?:\((-?\d+(?:\.\d+)?)\/(\d+)\)|(\d+(?:\.\d+)?)(?:\/(\d+))?)?\*?([xy])?(?:\/(\d+))?$/;

export function parseLinear(input) {
  const s = input.toLowerCase().replace(/\s+/g, '').replace(/[−–—]/g, '-').replace(/[×·]/g, '*');
  const sides = s.split('=');
  if (sides.length !== 2 || !sides[0] || !sides[1]) return null;
  const L = parseSide(sides[0]), R = parseSide(sides[1]);
  if (!L || !R) return null;
  return normalise(L.x.sub(R.x), L.y.sub(R.y), R.k.sub(L.k));     // A x + B y = C
}

function parseSide(str) {
  const acc = { x: F(0), y: F(0), k: F(0) };
  for (const term of splitTerms(str)) {
    const m = TERM.exec(term);
    if (!m) return null;
    const [, sign, pn, pd, num, nd, v, vd] = m;
    if (!pn && !num && !v) return null;                              // empty / sign only
    let coef = pn ? new Frac(parseInt(pn.replace('.', ''), 10), pd ? parseInt(pd, 10) * 10 ** (pn.split('.')[1]?.length ?? 0) : 1)
             : num ? Frac.parse(num).div(nd ? F(parseInt(nd, 10)) : F(1))
             : F(1);
    if (vd) { if (!v) return null; coef = coef.div(F(parseInt(vd, 10))); }
    if (sign === '-') coef = coef.neg();
    acc[v ?? 'k'] = acc[v ?? 'k'].add(coef);
  }
  return acc;
}

// Split on top-level + / − (not inside parentheses); the sign stays attached to its term.
function splitTerms(str) {
  const terms = []; let depth = 0, cur = '';
  for (let i = 0; i < str.length; i++) {
    const ch = str[i];
    if (ch === '(') depth++; if (ch === ')') depth--;
    if (depth === 0 && (ch === '+' || ch === '-') && cur !== '' && !'*/'.includes(cur.at(-1))) { terms.push(cur); cur = ''; }
    cur += ch;
  }
  if (cur) terms.push(cur);
  return terms;
}
```

> **Note:** a term such as `1/2x` is interpreted as `(1/2)x`, never `1/(2x)`, which matches how students write it.

### 7.3 Form requirements (`formOk`)

| `requireForm` | Rule |
| --- | --- |
| `slope-intercept` | After whitespace/Unicode normalisation the input must start with `y=` or end with `=y` (and `x=h` / `y=k` are accepted for vertical/horizontal lines) |
| `standard` | Input must have the shape `Ax+By=C` with the constant alone on the right side; the integers must equal the canonical normalised form (so `2x + y = 5` passes and `4x + 2y = 10` is shown the hint "Make the numbers as small as possible") |
| `any` | Any equivalent equation |

Graph-plot responses (two tapped points → `Line`) always pass `formOk`.

### 7.4 Required parser test vectors

| Input | Canonical `{A, B, C}` |
| --- | --- |
| `y = 2x + 3` | `{2, −1, −3}` |
| `2x − y = −3` | `{2, −1, −3}` |
| `y = 3 + 2x` | `{2, −1, −3}` |
| `−2x + y − 3 = 0` | `{2, −1, −3}` |
| `y = x/2 + 2` | `{1, −2, −4}` |
| `y = 1/2x + 2` | `{1, −2, −4}` |
| `x = 4` | `{1, 0, 4}` |
| `y = 3` | `{0, 1, 3}` |
| `y = 2x + ` | `null` |
| `x = y = 3` | `null` |

---

## 8. Coordinate Plane Component (`CoordinatePlane.jsx`)

### 8.1 Props

```ts
{
  viewport = { xMin: -10, xMax: 10, yMin: -10, yMax: 10 },
  lines = [],                    // [{ line, style: 'solid'|'ghost'|'helper', color? }]
  points = [],                   // [{ id, p, label?, draggable?, snap?, color? }]
  onPointMove?: (id, p) => void, // called with integer-snapped Points
  showRiseRun?: boolean,         // SlopeTriangle between the first two points / on the first line
  showIntercepts?: boolean,
  animateDraw?: boolean,         // stroke-dashoffset "draw-on"
  ariaLabel: string,             // REQUIRED text alternative
  size?: 'sm'|'md'|'lg',
}
```

### 8.2 Behaviour

- **Coordinate mapping:** `sx(x) = pad + (x − xMin)/(xMax − xMin) · W`, `sy(y) = pad + (yMax − y)/(yMax − yMin) · H`.
- **Rendering:** grid lines every 1 unit (lighter) and every 5 units (bolder); axis labels every 1 (or 2 at ≥ ±12); lines are drawn with `clipLine`.
- **Dragging:** `usePointerDrag` uses pointer events with `setPointerCapture` (mouse, touch, pen). Positions are inverse-mapped and **snapped to the nearest integer**, clamped to the viewport. Hit area radius ≥ 22 px regardless of the visual radius.
- **Keyboard:** a focused point is nudged by arrow keys (1 unit) / Shift+arrow (5 units); `Enter` confirms; `Esc` reverts.
- **Tap-tap fallback:** when `pointer: coarse` or when the user toggles "Tap mode", tapping a point selects it and tapping a grid cell moves it there.
- **Line morph:** when `lines[i].line` changes, `useTween` interpolates `m` and `c` over 450 ms (ease-in-out) so lines slide and pivot smoothly; disabled under `prefers-reduced-motion`.
- **Accessibility:** the `<svg>` has `role="img"` and `aria-label={ariaLabel}`; draggable points are focusable `role="slider"` elements with `aria-valuetext="x 3, y −2"`. A visually-hidden live region announces the current slope while dragging.
- **Slope antenna:** the shared `Mascot` reads the active line's slope and tilts its antenna accordingly.

---

## 9. Simulation Station Specs

### 9.1 Shared shell — `StationShell.jsx`

```
LearnCard (narrated, ≈ 25–40 s, skippable after first listen)
   ↓ "Let's try it!"
Guided try (scaffolded; hints always visible; no scoring)
   ↓
Challenge round 1 → 2 → 3   (params generated by a station-specific round generator; 3 attempts max/round)
   ↓
Station complete → dispatch(STATION_ROUND_DONE ×3) → Grady celebrates → return to hub
```

Round params come from the **same seeded rng family** (`mixSeed(seed, 'station', stationId, visit, round)`), so each visit differs, and a station can be "replayed for fun" after completion without affecting gating.

### 9.2 Station A — Slope Explorer (`SlopeExplorerStation.jsx`)

```js
// Round generator (excerpt)
const ROUND_TYPES = ['A1_buildUp', 'A2_downhill', 'A3_fraction', 'A4_flatOrWall', 'A5_readSlope'];
function genRoundA(rng, i) {
  // Always include ≥ 1 negative-slope round per visit: rounds = [random, A2_downhill, random] shuffled
  ...
}
```

- **State:** `pointA` (fixed), `pointB` (draggable), `target`, `attempts`.
- **Completion check:** `slopeOf(lineFromPoints(A, B)).eq(target)` (exact `Frac` equality). For `A4`, the answer is a classification (`zero` or `undefined`).
- **Live label:** `rise = Δy, run = Δx, slope = Δy/Δx`; if `Δx = 0` it reads "undefined".
- **Wrong submit:** `STATION_WRONG_SUBMIT` (feeds the 🎯 Pinpoint badge), the staircase highlights the miscounted segment.

### 9.3 Station B — Line Lab (`LineLabStation.jsx`)

- **Controls:** `SliderControl` for `m ∈ {−5, −4.5, …, 5}` (snap marks at ±1/2, ±1/3? — fractional marks are shown only when the round's target is fractional; the slider then switches to step 1/6 so ±1/2, ±1/3, ±2/3 are reachable exactly) and `c ∈ {−8, …, 8}`.
- **State:** `mSel`, `cSel` (both `Frac`), `target` (a `Line`), `mode`.
- **Match rule:** `mSel.eq(target.m) && cSel.eq(target.c)`.
- **B4 Predict-first:** shows the ghost line and 4 equation cards (one correct, three misconception distractors); on correct choice the sliders unlock "to verify".
- **B5 On-the-line:** a random point is shown; the student answers Yes/No, then the app animates substitution `y ?= m·x + c`.

### 9.4 Station C — Equation Builder (`EquationBuilderStation.jsx`)

- **Guided try** is a 4-step state machine (`slope → substitute → solveC → write`); each step uses `MathPad` fields and the exact `Frac` checker.
- **Tile mode** (default on touch) and **type mode** share the same `parseLinear` checker.
- **Rounds:** `C1_fromGraph`, `C2_pointSlope`, `C3_twoPoints` (scaffold fades: round 1 steps visible → round 3 hidden), `C4_standard`, `C5_vertHoriz`; the visit draws 3 of 5, always including one of C1/C3.

### 9.5 Station D — Street Planner (`StreetPlannerStation.jsx`)

- **D1/D2:** a street `L` and a building point `P` are generated; the student sets slope `m'` via the slider; the new street is `lineFromPointSlope(P, m')`. Pass if `areParallel` / `arePerpendicular`. A right-angle marker appears at the intersection when perpendicular (intersection computed exactly by solving the two line equations).
- **D3:** four equation pairs; the student drags each into **Parallel / Perpendicular / Neither** bins. Pairs are generated with exactly one of each class plus one extra (random), with misconception-based "neither" cases (same-sign reciprocal, equal magnitude opposite sign).

---

## 10. Audio Pipeline (ElevenLabs — per `audio_generation_pipeline.md`)

### 10.1 Voice configuration

- **Voice:** Alice — `Xb7hH8MSUJpSbSDYk0k2` — **Model:** `eleven_multilingual_v2`
- **Local dev key:** `VITE_ELEVENLABS_API_KEY` in `.env.local` (used by `scripts/generate_audio.js`; permitted client-side *in development only*)
- **Production key:** `ELEVENLABS_API_KEY` (**no `VITE_` prefix**) as a server-only environment variable for `api/elevenlabs.js`

> **Security note:** any `VITE_`-prefixed variable is embedded in the browser bundle and visible to every visitor. In production the browser must never hold the ElevenLabs key; all dynamic generation goes through the proxy (§10.5).

### 10.2 Style settings

```js
export const STYLE_SETTINGS = {
  celebration:   { stability: 0.12, similarity_boost: 0.45, style: 0.75, use_speaker_boost: true },
  encouragement: { stability: 0.16, similarity_boost: 0.50, style: 0.65, use_speaker_boost: true },
  question:      { stability: 0.20, similarity_boost: 0.55, style: 0.55, use_speaker_boost: true },
  emphasis:      { stability: 0.16, similarity_boost: 0.50, style: 0.60, use_speaker_boost: true },
  thinking:      { stability: 0.24, similarity_boost: 0.60, style: 0.35, use_speaker_boost: true },
  statement:     { stability: 0.20, similarity_boost: 0.55, style: 0.50, use_speaker_boost: true },
  instruction:   { stability: 0.20, similarity_boost: 0.55, style: 0.50, use_speaker_boost: true },
};
```

### 10.3 Offline pre-generation (`scripts/generate_audio.js`)

Reads `phrases`, applies per-style settings, calls ElevenLabs, saves slugified `.mp3` into `public/assets/audio/`, writes `src/utils/audioMap.js`, and rate-limits at **500 ms** between calls (as specified in the pipeline doc). **Only paragraph and question text is added; never titles.**

```js
const phrases = [
  // Phase 1 — Wonder
  { text: "Sarah's drone takes off from a rooftop in London that is two metres high. Every second, it climbs three metres.", style: 'thinking' },
  { text: "How high will it be after ten seconds?", style: 'question' },
  { text: "Let's discover how the equation of a straight line can answer this!", style: 'encouragement' },

  // Phase 2 — Story panels 1–6
  { text: "John, Mike, Sarah, Emma, Liam, Sofia, Noah, Aisha, Carlos, and Yuki are friends from ten different countries. They call themselves the Straight Line Squad, and they meet online to solve puzzles about lines.", style: 'statement' },
  { text: "One night, a signal arrives from Skylark, a little weather drone that has lost its way. It can only send a few numbers, so the squad must work out its flight path before the battery runs out!", style: 'statement' },
  { text: "Mike builds a skateboard ramp in New York. The ramp rises three metres over a run of six metres. How steep is it? Mike calls this steepness the slope.", style: 'statement' },
  { text: "Sarah takes a taxi in London. It costs three pounds just to start, plus two pounds for every kilometre. She notices the cost grows along a perfectly straight line, and the starting cost is where the line crosses the y-axis.", style: 'statement' },
  { text: "Yuki sees two bullet-train tracks running side by side in Tokyo. They never meet, because they have the same slope. Priya notices that the streets in Mumbai cross at right angles, and their slopes are flipped and negative, like two and negative one half.", style: 'emphasis' },
  { text: "Aisha in Cairo has the final clue. Skylark flew from the point zero, two to the point four, ten. If we can find the equation of its path, we can find exactly where it will be next. Are you ready to help the squad?", style: 'question' },

  // Phase 3 — Learn cards (A–D) and station instructions
  { text: "Slope tells us how steep a line is. Count how far you go up, that is the rise. Count how far you go across, that is the run. Slope is rise divided by run.", style: 'instruction' },
  { text: "In y equals m x plus c, m is the slope and c is the y-intercept, the place where the line crosses the y-axis. Change c and the line slides up or down. Change m and the line tilts.", style: 'instruction' },
  { text: "To write an equation, we need two things: the slope, and the y-intercept. Find the slope first. Then use any point on the line to find c.", style: 'instruction' },
  { text: "Parallel lines never meet, because they have the same slope. Perpendicular lines cross at a right angle. Their slopes multiply to give negative one.", style: 'instruction' },
  { text: "Drag the points to build a line with the slope you are asked for.", style: 'instruction' },
  { text: "Move the sliders until your line covers the gold line. Which slope and which y-intercept do you need?", style: 'question' },
  { text: "Build the equation of the line. What is the slope, and what is the y-intercept?", style: 'question' },
  { text: "Draw a new street through the building. Can you make it parallel, or perpendicular?", style: 'question' },

  // Phase 4 — Feedback POOLS (pre-generated; picked at random)
  { text: "Amazing! You found it perfectly!", style: 'celebration' },
  { text: "Brilliant work! That line is exactly right!", style: 'celebration' },
  { text: "Superstar! The squad is proud of you!", style: 'celebration' },
  { text: "Yes! You are a true Line Rider!", style: 'celebration' },
  { text: "Not quite! Let's look at the line again.", style: 'encouragement' },
  { text: "Good try! Check the rise and the run once more.", style: 'encouragement' },
  { text: "Almost there! Think about where the line crosses the y-axis.", style: 'encouragement' },
  { text: "Watch the line carefully. Can you count the steps with me?", style: 'thinking' },

  // Phase 5 — Reflect + badges
  { text: "What an adventure! Can you explain, in your own words, what the slope and the y-intercept tell us about a line?", style: 'thinking' },
  { text: "Lesson complete! You are a Global Line Rider champion!", style: 'celebration' },
  { text: "Badge unlocked! You are a Line Starter!", style: 'celebration' },
  { text: "Badge unlocked! Line Builder! You completed all four stations!", style: 'celebration' },
  { text: "Badge unlocked! Line Legend! You scored over eighty percent!", style: 'celebration' },
];
```

Filename pattern follows the pipeline doc: `audio_<slugified_start_of_text>_<index>.mp3`.

### 10.4 Frontend audio engine (`src/utils/audio.js`)

Implements the pipeline's five responsibilities: segment helpers, cache check, dynamic request, queue management, and preloading.

```js
export const say = (t) => ({ text: t, style: 'statement' });
export const ask = (t) => ({ text: t, style: 'question' });
export const cheer = (t) => ({ text: t, style: 'encouragement' });
export const emphasize = (t) => ({ text: t, style: 'emphasis' });
export const think = (t) => ({ text: t, style: 'thinking' });
export const celebrate = (t) => ({ text: t, style: 'celebration' });
export const instruct = (t) => ({ text: t, style: 'instruction' });

const memCache = new Map();            // key → blob URL
let currentQueue = null;               // Symbol identifying the active narration
let currentAudio = null;

export async function getAudioUrl(text, style = 'statement') {
  if (audioMap[text]) return audioMap[text];                                  // 1. static asset (0 ms)
  const key = `${style}::${text}`;
  if (memCache.has(key)) return memCache.get(key);                            // 2. memory
  const stored = await idbGet(await hash(key));                               // 3. IndexedDB (persists across sessions)
  if (stored) return remember(key, URL.createObjectURL(stored));
  if (!dynamicBudget.allow(text)) return null;                                // 4. per-session character cap
  const res = await fetch('/api/elevenlabs', {                                // 5. proxy → shared server cache → ElevenLabs
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, style }),
  }).catch(() => null);
  if (!res || !res.ok) return null;                                           // silent skip — never block UX
  const blob = await res.blob();
  await idbPut(await hash(key), blob);
  return remember(key, URL.createObjectURL(blob));
}

export async function narrate(segments, interrupt = true) {
  if (interrupt) stopNarration();
  const queue = Symbol('narration');
  currentQueue = queue;
  for (let i = 0; i < segments.length; i++) {
    if (currentQueue !== queue) return;                                       // superseded → stop
    const url = await getAudioUrl(segments[i].text, segments[i].style);
    if (segments[i + 1]) getAudioUrl(segments[i + 1].text, segments[i + 1].style);   // eager preload i+1
    if (!url || currentQueue !== queue) continue;
    await play(url);
  }
}

export function stopNarration() { currentQueue = null; currentAudio?.pause(); currentAudio = null; }

function play(url) {
  return new Promise((resolve) => {
    const a = new Audio(url); currentAudio = a;
    a.onended = a.onerror = () => resolve();
    a.play().catch(resolve);                                                  // autoplay policy → resolve silently
  });
}
```

**Usage in a component (as in the pipeline doc):**

```js
useEffect(() => {
  if (audioEnabled) narrate(stationALearnNarration(), true);
  return () => stopNarration();
}, [audioEnabled]);
```

**Narrating a Play question:**

```js
narrate([ask(question.stem.spoken)]);        // spoken twin — digits/symbols already converted to words
```

### 10.5 Server proxy and shared cache (`api/elevenlabs.js`)

```js
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  if (!ORIGIN_ALLOWLIST.has(req.headers.origin)) return res.status(403).end();       // intelliasg.com + deployment domain
  const { text, style } = req.body ?? {};
  if (typeof text !== 'string' || text.length === 0 || text.length > 400) return res.status(400).end();
  if (!STYLE_SETTINGS[style]) return res.status(400).end();
  if (!rateLimiter.allow(clientKey(req))) return res.status(429).end();              // e.g. 60 req/min/IP

  const key = sha256(`${VOICE_ID}|${MODEL}|${style}|${text}`);
  const cached = await audioCache.get(key);                                          // adapter: Vercel Blob / S3 / KV
  if (cached) return sendAudio(res, cached, 'HIT');

  const r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
    method: 'POST',
    headers: { 'xi-api-key': process.env.ELEVENLABS_API_KEY, 'Content-Type': 'application/json', Accept: 'audio/mpeg' },
    body: JSON.stringify({ text, model_id: MODEL, voice_settings: STYLE_SETTINGS[style] }),
  });
  if (!r.ok) return res.status(502).end();
  const buf = Buffer.from(await r.arrayBuffer());
  await audioCache.put(key, buf);                                                    // future requests (any student) are free
  return sendAudio(res, buf, 'MISS');
}
```

### 10.6 Dynamic audio strategy for randomized questions

| Concern | Approach |
| --- | --- |
| **Latency** | On world start, `prefetchWorld(questions)` requests the 10 stems with concurrency 2, in play order. While the student works on question *i*, *i + 1* is already cached. The first question of a world is prefetched while the world-intro screen is shown. |
| **Cost** | Shared server cache keyed by `hash(text, style)`: repeated phrasings across students cost nothing. Because generators draw from bounded pools (names, cities, parameter ranges), the cache hit-rate rises over time. Estimated worst case without cache ≈ 11,000 characters per full 100-question session. |
| **Budget guard** | `dynamicBudget` limits dynamic characters per session (default 15,000, env-configurable). Beyond the cap, auto-play stops and each question shows a 🔊 button that fetches on demand. |
| **Failure** | Any network/API failure → silent skip; text is always visible; the 🔊 button retries. |
| **What is narrated** | Question stems (always), explanations after the third miss, and hints on demand (🔊 inside the hint overlay). Answer options and all titles/headings are never narrated. |

### 10.7 Parity and cleanup

- **Static parity:** `scripts/check_parity.js` extracts every string passed to the segment helpers in `narration.js`, every `phrases[].text`, and every UI string flagged `data-narrated`, and fails CI on any mismatch (missing audio, orphan phrase, or text drift). It also fails if a *title* string (from a `titles.js` registry) appears in narration.
- **Dynamic parity:** by construction (`Rich` tokens), plus a test (§16) that asserts for 5,000 generated questions that `speak(display)` and `spoken` agree on all digits and operators.
- **Cleanup:** `scripts/clean_audio.js` imports `audioMap.js` and deletes any `.mp3` in `public/assets/audio/` not referenced.

### 10.8 Workflow to add/update narration (from the pipeline doc, unchanged)

1. Add `{ text, style }` to `phrases` in `scripts/generate_audio.js` (paragraphs/questions only)
2. `node scripts/generate_audio.js`
3. (Optional) `node scripts/clean_audio.js`
4. Add the **identical** text to the phase function in `src/utils/narration.js` with the matching helper
5. Wire the component with `narrate()` / `stopNarration()`
6. `node scripts/check_parity.js`

---

## 11. Gamification Implementation

### 11.1 XP & stars (`utils/scoring.js`)

```js
export function calcXP(attemptNumber, hintsUsed, streak) {
  const base = attemptNumber === 1 && hintsUsed === 0 ? 10
             : attemptNumber === 2 ? 7
             : 5;
  const streakBonus = streak >= 5 && attemptNumber === 1 && hintsUsed === 0 ? 5 : 0;
  return base + streakBonus;
}
export const STATION_ROUND_XP = 20;

export function calcStars(correct) {                  // per world of 10
  if (correct >= 10) return 3;
  if (correct >= 8)  return 2;
  if (correct >= 6)  return 1;                        // also the unlock gate
  return 0;
}
export const canUnlockNext = (correct) => correct >= 6;
```

### 11.2 Badges (`data/badges.js`, `utils/badgeEngine.js`)

```js
export const BADGES = [
  { id: 'line_starter',   label: '🏅 Line Starter',   cond: (s) => s.phaseComplete.wonder && s.phaseComplete.story },
  { id: 'line_builder',   label: '🥈 Line Builder',   cond: (s) => Object.values(s.stations).every((x) => x.complete) },
  { id: 'line_legend',    label: '🥇 Line Legend',    cond: (s) => totalBestScore(s) >= 80 },
  { id: 'perfect_path',   label: '💎 Perfect Path',   cond: (s) => s.worldBest.some((c) => c === 10) },
  { id: 'streak_star',    label: '🔥 Streak Star',    cond: (s) => s.maxStreak >= 10 },
  { id: 'global_explorer',label: '🌍 Global Explorer',cond: (s) => CONTENT_PHASES.every((p) => s.phaseComplete[p]) },
  { id: 'pinpoint',       label: '🎯 Pinpoint',       cond: (s) => s.stations.A.complete && s.stations.A.wrongSubmits === 0 },
  { id: 'slope_master',   label: '⛰️ Slope Master',   cond: (s) => s.slopeMasterCount >= 10 },
];
export const checkBadges = (s) => BADGES.filter((b) => !s.badges.includes(b.id) && b.cond(s)).map((b) => b.id);
```

A `useEffect` on relevant state slices dispatches `UNLOCK_BADGES` with newly earned ids and narrates the matching pre-generated badge line (celebration style).

### 11.3 Bonus Challenge

A 3★ world unlocks 3 extra questions generated with `difficulty: 3` from that world's types, using seed slot indices 10–12. Bonus questions do not affect the world score or the 100-question totals; they award XP only.

---

## 12. Persistence & Resume

```js
const SESSION_KEY = 'intellia_g8_straight_lines_v1';
// Saved (debounced 300 ms): everything needed to *regenerate* the session
{
  seed, worldAttempts, currentWorld, currentSlot, worldCorrect, worldBest,
  phase, storyPanel, stations, phaseComplete, xp, streak, maxStreak, badges, slopeMasterCount,
  recentSignatures,                // trimmed to the last 300
  timestamp: Date.now(),
}
```

- On mount: if a saved session is < 24 h old → `RESTORE_SESSION`. `worldQuestions` is **regenerated** from `(seed, currentWorld, worldAttempts[currentWorld])`, which is deterministic. The student resumes on the same question.
- "Start over" clears the key and creates a new seed.
- All `localStorage` access is wrapped in try/catch (private mode / quota). Failure degrades to in-memory state with no user-visible error.
- No personal data is stored. There is no login, no name entry and no analytics identifier.

---

## 13. Theming, Tokens & Animations

### 13.1 Design tokens (`App.css` — aligned to the reference palette)

```css
:root {
  --brand-blue:   #4A90D9;   /* primary; student's line */
  --brand-gold:   #F5B93A;   /* rewards; ghost/target line */
  --coral:        #F2766B;   /* wrong-answer states */
  --teal:         #2BB5A6;   /* helper overlays: rise/run, intercept markers */
  --green:        #3BB273;   /* correct */
  --ink:          #243447;
  --card:         #FFFFFF;
  --shadow:       0 6px 18px rgba(36, 52, 71, .10);
  --radius:       16px;
  --font-body:    'Nunito', system-ui, sans-serif;
  --font-head:    'Fredoka', 'Nunito', system-ui, sans-serif;
}
/* Verify exact values against the reference repo's App.css / tailwind.config.js in Milestone M2 */
```

### 13.2 Keyframes

```css
@keyframes bounceIn   { 0%{transform:scale(.3);opacity:0} 50%{transform:scale(1.05);opacity:1} 70%{transform:scale(.9)} 100%{transform:scale(1)} }
@keyframes shake      { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-8px)} 40%{transform:translateX(8px)} 60%{transform:translateX(-6px)} 80%{transform:translateX(6px)} }
@keyframes floatUp    { 0%{transform:translateY(0) scale(1);opacity:1} 100%{transform:translateY(-60px) scale(1.5);opacity:0} }
@keyframes pulseGlow  { 0%,100%{box-shadow:0 0 0 0 rgba(74,144,217,.4)} 50%{box-shadow:0 0 0 12px rgba(74,144,217,0)} }
@keyframes celebrate  { 0%{transform:rotate(-5deg) scale(1)} 25%{transform:rotate(5deg) scale(1.1)} 50%{transform:rotate(-3deg) scale(1.05)} 75%{transform:rotate(3deg) scale(1.1)} 100%{transform:rotate(0) scale(1)} }
@keyframes slideInUp  { from{transform:translateY(30px);opacity:0} to{transform:translateY(0);opacity:1} }
@keyframes drawLine   { from{stroke-dashoffset:var(--len)} to{stroke-dashoffset:0} }          /* graph line draw-on */
@keyframes ghostPulse { 0%,100%{opacity:.55} 50%{opacity:1} }                               /* target line */
@keyframes antennaTilt{ from{transform:rotate(var(--from))} to{transform:rotate(var(--to))} } /* Grady */
@media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration: .01ms !important; transition-duration: .01ms !important; } }
```

---

## 14. Component Prop Contracts

| Component | Props | Notes |
| --- | --- | --- |
| `CoordinatePlane` | see §8.1 | Core visual; pure/controlled |
| `SlopeTriangle` | `{ p1, p2, viewport, showLabels? }` | Rise (vertical) and run (horizontal) legs in `--teal`, labelled `rise = …`, `run = …` |
| `SliderControl` | `{ label, value: Frac, min, max, step: Frac, snapMarks?, onChange }` | Emits exact `Frac`; ≥ 44 px thumb; keyboard arrow support |
| `MathPad` | `{ value, onChange, onSubmit, allowKeys: ('x'\|'y'\|'='\|'frac'\|…)[] }` | On-screen keys + physical keyboard; shows a live pretty-printed preview |
| `MathText` | `{ rich: Rich }` | Renders `display` with stacked fractions and U+2212 minus |
| `LearnCard` | `{ title, paragraphs: Rich[], visual, narration, onContinue }` | Title shown, **never narrated** |
| `QuestionRenderer` | `{ question, attempt, onAnswer(response), hintLevel }` | Dispatch by `question.format` |
| `HintOverlay` | `{ level: 0\|1\|2\|3, question, onReplayAudio }` | Level 3 shows the explanation + animated worked steps |
| `FeedbackOverlay` | `{ isCorrect, xpEarned, message, onContinue }` | `bounceIn` / `shake` |
| `Mascot` | `{ mood, slope? }` | `slope` (Frac \| null) drives the antenna tilt |
| `WorldMap` | `{ worldBest, currentWorld, unlocked(i), onSelectWorld(i) }` | Horizontal scroll, stars, locks, concept tags |
| `BadgePanel` | `{ badges, newBadgeId? }` | Toast + grid |
| `ProgressMap` | `{ phase, phaseComplete, playUnlocked }` | 6 dots; Play shows lock + tooltip |

---

## 15. Performance, Browser Support, Security & Privacy

### 15.1 Performance targets

| Metric | Target |
| --- | --- |
| Initial load (production, mid-range device, 4G) | < 3 s (target < 2 s) |
| First meaningful paint | < 1.2 s |
| Drag / line-morph frame rate | 60 fps (graph re-render < 4 ms) |
| JS bundle (gzipped), initial route | < 250 KB; total with all lazy chunks < 450 KB |
| World generation (10 questions incl. validation) | < 30 ms |
| Memory | < 80 MB |
| Lighthouse Performance / Accessibility | ≥ 90 / ≥ 95 |
| Pre-generated audio TTFB | 0 ms perceived (static, `immutable` caching; lazily fetched per phase) |
| Dynamic audio (cache miss) | < 2.5 s; (cache hit) < 400 ms |

### 15.2 Browser & device support

| Environment | Level |
| --- | --- |
| Chrome 110+ / Edge 110+ (desktop, Android) | Full |
| Safari 15+ (macOS, iPadOS, iOS) | Full |
| Firefox 110+ | Full |
| IE 11 | Not supported |

Primary test devices: Desktop Chrome (1280 px+), iPad Safari (768 px, touch), low-end Android Chrome (375 px).

### 15.3 Security

- **Secrets:** `ELEVENLABS_API_KEY` server-only. The repo's `.gitignore` excludes `.env*`. No key in the bundle in production builds (CI check greps `dist/` for `xi-api-key` and for the key value).
- **Proxy hardening:** origin allow-list, 400-character limit, style whitelist, per-IP rate limit, no pass-through of arbitrary ElevenLabs parameters.
- **Headers (`vercel.json`):**

```json
{
  "headers": [
    { "source": "/(.*)", "headers": [
      { "key": "Content-Security-Policy",
        "value": "default-src 'self'; img-src 'self' data:; media-src 'self' blob:; connect-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; frame-ancestors 'self' https://intelliasg.com https://*.intelliasg.com" },
      { "key": "X-Content-Type-Options", "value": "nosniff" },
      { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" }
    ]},
    { "source": "/assets/audio/(.*)", "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }] }
  ]
}
```

- **Input handling:** student equation input is only ever parsed by `parseLinear` (no `eval`, no `Function`).

### 15.4 Privacy (users are 13–14 years old)

- No accounts, no names collected, no cookies, no third-party trackers, no analytics identifiers in v1.0
- All progress is local to the browser; "Share with your teacher" produces a client-side summary (printable view / image) with no network call
- If Intellia later adds analytics or a dashboard, it must follow applicable child-privacy rules (e.g. COPPA, GDPR-K) and be consent-based

### 15.5 Embedding and optional parent integration

- Hosted on Vercel; embedded in the course page via `<iframe>` (allowed by `frame-ancestors` above)
- **Optional** `postMessage` events to the host page (target origin pinned to `https://intelliasg.com`): `{ type: 'lesson-progress', phase, xp, stars }` on phase change and `{ type: 'lesson-complete', xp, stars, badges }` on completion. Disabled unless the host opts in via `?embed=1`. *(Confirm with the Intellia team.)*

---

## 16. Quality & Testing Standards

### 16.1 Unit tests (Vitest) — engine

| Area | Tests |
| --- | --- |
| `Frac` | Normalisation, sign handling, `0`, equality, `parse` for ints / fractions / decimals |
| `line.js` | `lineFromPoints` (oblique, horizontal, vertical, reversed point order); `toStandard` for 50+ lines incl. fractions; `perpendicularThrough` and `parallelThrough` satisfy `contains`; `sameLine` symmetry |
| `parseLinear` | All vectors in §7.4 plus 200 equivalence pairs (generated: render a line in 6 different forms → all parse to the same triple) |
| `speak` | All test vectors in §6.5; numbers 0–9999; negatives; fractions with denominators 2, 3, 4, 5, 6 |
| `clipLine` | Lines through each quadrant, steep/shallow, outside viewport → `null` |
| `blueprint` | Per-world sums = 10; per-type totals = (11, 8, 15, 14, 8, 10, 12, 7, 8, 7); total = 100 |

### 16.2 Generator property tests

For **seeds 1…2,000** × all 10 worlds:

1. `generateWorld` completes without throwing (no generator exhaustion)
2. Every question passes `verify` (§6.9)
3. Exactly one option is correct (for MCQ), and **no distractor passes `checkAnswer`**
4. Signatures are unique within the session; across two sessions with different seeds, expected overlap < 5%
5. `checkAnswer(q, canonicalResponse(q)) === true` for every question; and `false` for each distractor
6. **Determinism:** the same `(seed, world, attempt)` yields byte-identical questions
7. **Randomization integrity:** across 1,000 seeds no two sessions have the same ordered signature list
8. **Range:** all points/coefficients fall within the tier constraints in PRD §4.5
9. **Speakability:** `stem.spoken`, `hint*.spoken`, `explanation.spoken` contain no digits and none of `+ − = / ( )`
10. **Replay:** `attempt = 1` yields a *different* set of questions to `attempt = 0` for the same world

### 16.3 Component & interaction tests (React Testing Library)

- `CoordinatePlane`: drag snapping, clamp to viewport, keyboard nudging, tap-tap fallback, `aria-label` present
- `MathPad` + `EquationQuestion`: `y=2x+3` accepted for `2x − y = −3`; wrong form rejected when `requireForm: 'slope-intercept'`
- Reducer: streak resets, XP table, world gate (≥ 6), star thresholds (6/8/10), badge conditions, `playUnlocked` gating
- Resume: persist → reload → same question displayed (deterministic regeneration)

### 16.4 End-to-end (Playwright)

- Full run with an audio-disabled profile: Intro → Wonder → Story → 4 stations → Play (answering via a test hook that reads the correct answer) → Reflect → badges present
- Play is **not reachable** (URL/state tampering included) until all stations complete
- Mobile viewport (375 px) and tablet viewport (768 px) smoke runs
- Audio network failure: all `/api/elevenlabs` requests fail → app fully playable; no console errors

### 16.5 Accessibility

- `axe-core` in CI on every phase (zero critical/serious violations)
- Manual keyboard-only pass: every interaction (including dragging points) completable without a pointer
- Manual screen-reader pass (NVDA/VoiceOver) on graph questions: text alternative conveys the same information as the visual
- Contrast check on all token pairs (WCAG AA)
- `prefers-reduced-motion` honoured

### 16.6 Audio

- `check_parity.js` in CI (static parity, orphan/missing audio, no titles narrated)
- Proxy tests: oversized text → 400; unknown style → 400; wrong origin → 403; cache HIT/MISS headers
- Manual listening pass on all pre-generated clips and 50 random dynamic stems (check number/equation pronunciation)

---

## 17. Build, Deployment & Delivery Milestones

### 17.1 Scripts (`package.json`)

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:e2e": "playwright test",
    "audio:generate": "node scripts/generate_audio.js",
    "audio:clean": "node scripts/clean_audio.js",
    "audio:parity": "node scripts/check_parity.js",
    "lint": "eslint src"
  }
}
```

### 17.2 CI

`lint` → `test` (unit + property) → `audio:parity` → `build` → bundle-size budget check → secret scan of `dist/` → Playwright e2e → Vercel preview deploy.

### 17.3 Environment variables

| Variable | Where | Purpose |
| --- | --- | --- |
| `VITE_ELEVENLABS_API_KEY` | `.env.local` (dev only) | Offline generation script; local dev |
| `ELEVENLABS_API_KEY` | Vercel (server) | Production proxy |
| `AUDIO_CACHE_*` | Vercel (server) | Storage adapter credentials (Blob / S3 / KV) |
| `DYNAMIC_AUDIO_CHAR_CAP` | Vercel / build | Per-session dynamic audio budget (default 15000) |

### 17.4 Milestones

| # | Milestone | Exit criteria |
| --- | --- | --- |
| M0 | Repo scaffold cloned from the Grade 5 structure; Tailwind + tokens; phase router; 6-dot tracker | App shell matches the reference layout (top bar, bottom bar, sidebar) |
| M1 | **Engine**: `Frac`, `line`, `parseLinear`, `rng`, `speak`, `rich` + tests | All §16.1 tests green |
| M2 | Intro, Wonder, Story phases; `CoordinatePlane`; Grady; theme fidelity review vs. the reference | Visual review sign-off against the reference site |
| M3 | Stations A–D with Learn cards and gating | Play locked until all complete; station rounds randomized |
| M4 | Generators Q1–Q10, blueprint, validator, `checkAnswer`; Play UI, hints, feedback, world map | §16.2 property tests green (2,000 seeds) |
| M5 | Gamification (XP, stars, streak, badges), persistence/resume, Reflect | Reducer + resume tests green |
| M6 | Audio: phrases, pre-generation, proxy + cache, prefetch, parity script | `audio:parity` green; dynamic audio verified end-to-end |
| M7 | Accessibility, performance, cross-browser/device QA, content review (maths + language) by a Grade 8 teacher | Lighthouse and axe targets met; teacher sign-off |
| M8 | Deployment to Vercel; embed on the Intellia course page; production smoke test | Live at the confirmed Grade 8 lesson URL |

---

## 18. Appendices

### Appendix A — Sample generated questions (hand-verified)

| Type | Stem (display) | Answer | Check |
| --- | --- | --- | --- |
| Q1 | Liam plots point A at (1, 2) and point B at (5, 10). What is the slope? | **2** | (10 − 2) / (5 − 1) = 8/4 = 2 ✅ |
| Q3 | For `y = −3x + 4`, give the slope and the y-intercept. | **m = −3, c = 4** | Read directly ✅ |
| Q5 | A line has slope 3 and passes through (2, 5). Write its equation. | **`y = 3x − 1`** | c = 5 − 3·2 = −1 ✅ |
| Q6 | A line passes through (−2, 1) and (4, 4). Write its equation. | **`y = ½x + 2`** | m = 3/6 = ½; c = 1 − ½·(−2) = 2; at x = 4: 2 + 2 = 4 ✅ |
| Q7 | Does (3, 7) lie on `y = 2x + 1`? | **Yes** | 2·3 + 1 = 7 ✅ |
| Q7 | The point (4, k) lies on `y = 2x + 1`. Find k. | **9** | 2·4 + 1 = 9 ✅ |
| Q8 | Write `y = −2x + 5` in the form `Ax + By = C`. | **`2x + y = 5`** | 2x + y = 5; x-intercept 5/2, y-intercept 5 ✅ |
| Q9 | Find the line perpendicular to `y = 2x + 1` through (4, 3). | **`y = −½x + 5`** | m = −½; c = 3 − (−½)(4) = 5; 2·(−½) = −1 ✅ |
| Q10 | Carlos rents a bicycle in Mexico City: 30 pesos plus 15 pesos per hour. Write the cost y after x hours and find the cost for 4 hours. | **`y = 15x + 30`; 90 pesos** | 15·4 + 30 = 90 ✅ |

### Appendix B — Curriculum coverage matrix

| LO | Story panel | Station | Question types | Worlds |
| --- | --- | --- | --- | --- |
| LO1 Slope as steepness, rise/run | 3 | A | Q2 | 1–3 |
| LO2 Slope from two points | 3 | A | Q1 | 1–2, 6–7, 9 |
| LO3 y-intercept | 4 | B | Q3 | 1–5, 8 |
| LO4 `y = mx + c` read & graph | 4 | B | Q3, Q4 | 3–5, 9–10 |
| LO5 Equation from a graph | 4, 6 | C | Q4 | 3–5 |
| LO6 Point + slope | 6 | C | Q5 | 6, 7, 10 |
| LO7 Two points | 6 | C | Q6 | 7–10 |
| LO8 Standard form, intercepts *(ext.)* | — | C | Q8 | 8, 10 |
| LO9 Horizontal / vertical | 6 | A, C | Q3, Q4 (variant) | 3, 10 |
| LO10 Parallel / perpendicular *(ext.)* | 5 | D | Q9 | 9, 10 |
| LO11 Point on a line | — | B | Q7 | 3–8 |
| LO12 Real-world models | 4 | B, C | Q10 | 5, 10 |

### Appendix C — Reference differences from the Grade 5 module (for the dev team)

| Topic | Grade 5 reference | Grade 8 module |
| --- | --- | --- |
| Mascot | Chrono (clock robot) | Grady (gradient bot with a slope-tilting antenna) |
| Core visual | `ClockFace` + `TimelineBar` | `CoordinatePlane` + `SlopeTriangle` |
| Simulation stations | 3 | 4 (A–D) + explicit Learn cards and a guided try |
| Question bank | Static objects shuffled per session | Procedurally generated, seeded, validated; none hard-coded |
| Math core | Integer minutes since midnight | Exact rationals (`Frac`) |
| Answer checking | MCQ equality | Equivalence (parsed and normalised equations) + MCQ |
| Audio for questions | Mostly pre-generated | Dynamic through a proxy with a shared cache; fixed lines pre-generated |
| Pass gate / stars / badges | Slightly inconsistent between PRD and code samples | Single source of truth (selectors in §4.3, thresholds 6 / 8 / 10) |

---

**Document Version:** 1.0 | **Product:** Intellia SG — Grade 8 Math, Equation of Straight Lines
**Reference UI:** <https://grade5-time-intervals.vercel.app/> | **Reference Repo:** <https://github.com/p1pachare-cloud/Grade5-Time-Intervals>
**Audio Pipeline:** ElevenLabs (Alice, `Xb7hH8MSUJpSbSDYk0k2`, `eleven_multilingual_v2`) — per `audio_generation_pipeline.md`
