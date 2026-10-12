# Product Requirements Document (PRD)

## Equation of Straight Lines — Slope, Intercepts & Linear Models | Grade 8 Math

### Intellia SG | Global Grade 8 Mathematics Curriculum

---

## 1. Executive Summary

This document defines the product requirements for **"Global Line Riders — Equation of Straight Lines"**, an interactive, gamified, simulation-based lesson module for **Grade 8 students (age 13–14)**. It teaches the concept of **the equation of a straight line**: slope (gradient), intercepts, `y = mx + c`, writing equations from graphs / a point and a slope / two points, standard form, horizontal and vertical lines, parallel and perpendicular lines, and linear models of real situations.

The module is a standalone **React (Vite + JSX)** web application. It is designed to **strictly mirror the structure, visual language and UX patterns** of the reference product:

- Reference site: **<https://grade5-time-intervals.vercel.app/>**
- Reference repository: **<https://github.com/p1pachare-cloud/Grade5-Time-Intervals>**

The module is intended to be hosted inside the Intellia SG course catalogue, following the same URL family as `https://intelliasg.com/courses/grade-3-math`, restructured for Grade 8:

```
https://intelliasg.com/courses/grade-8-math/lessons/equation-of-straight-lines/
```

> **Assumption to confirm:** the course page could not be opened by automated tooling, so the exact Grade 8 slug above follows the Grade 3 / Grade 5 pattern and must be confirmed by the Intellia team before deployment.

Audio narration follows the **ElevenLabs pipeline** documented in `audio_generation_pipeline.md` (Voice **Alice**, Voice ID `Xb7hH8MSUJpSbSDYk0k2`, Model `eleven_multilingual_v2`), using the same hybrid *pre-generation + dynamic fallback* architecture, the same per-style voice-settings table, and the same strict rule that **only paragraph text and questions are narrated, never titles or headings**.

The lesson follows a **learning-first** approach: students *learn* each idea through a story and guided, hands-on simulations **before** they are asked to practise. Practice is then a fully **randomized** question run in which **every question is generated fresh, with new numbers, new names and new contexts, every session**.

The lesson is built around a global, multicultural story featuring friends from around the world (John, Mike, Sarah, Emma, Liam, Sofia, Noah, Aisha, Carlos, Yuki, Priya, Fatima, Diego) who form the **Straight Line Squad** and use lines to rescue a lost weather drone.

The module follows Intellia's proven **6-phase learner journey**: INTRO → WONDER → STORY → SIMULATE → PLAY → REFLECT.

---

## 2. Product Vision & Goals

**Vision.** To make straight lines feel like a real adventure. Students should see slope as *steepness you can feel*, the y-intercept as *where the journey starts*, and `y = mx + c` as *a rule that predicts the future*, through a simulation-first, story-driven, randomized and gamified experience.

**Goals**

| Goal | Metric |
| --- | --- |
| Learning Completion | ≥ 85% of students complete all 6 phases |
| Learning-First Compliance | 100% of students complete all 4 simulation stations before Play unlocks |
| Practice Engagement | ≥ 90% attempt at least 20 practice questions |
| Score Achievement | Average first-attempt Play score ≥ 70% |
| Session Duration | Average engagement ≥ 25 minutes per full run |
| Curriculum Alignment | 100% of Learning Objectives (Section 4.3) mapped to ≥ 1 station and ≥ 1 question type |
| Phase Progression | ≥ 80% reach Play in a single session |
| Simulation Interaction Rate | ≥ 95% attempt all 4 stations |
| Randomization Integrity | 0 repeated question signatures within a session; < 5% overlap with the student's previous 3 sessions |
| Answer Correctness | 0 incorrect answer keys across 10,000 auto-generated test sessions |

---

## 3. Target Users

**Primary: Grade 8 students (age 13–14)**

- Comfortable with integers, fractions, ratios and basic algebra (solving one- and two-step equations, substitution)
- Have seen the Cartesian plane (plotting points in four quadrants)
- Benefit from visual and kinaesthetic exploration before symbolic work
- Motivated by streaks, badges, a world map and a strong story arc, but at this age expect a *less childish* tone than Grade 5 (see Section 12.1)
- International classroom context; familiar with ramps, roads, trains, taxis, phone plans and drones

**Secondary: Parents & Teachers**

- Assign as classwork, homework, revision or enrichment
- Expect alignment to recognized global standards (Section 4)
- Monitor completion through in-lesson phase indicators and the end-of-lesson summary

**Prerequisite knowledge (assumed, not taught):** plotting `(x, y)` points; operations with integers and fractions; substituting values into an expression; solving `ax + b = c`.

---

## 4. Curriculum Alignment — Global Grade 8 Mathematics

**Topic:** Equation of Straight Lines
**Programme:** Intellia Grade 8 Math — Algebra & Functions: Linear Relationships
**Lesson URL (to confirm):** `https://intelliasg.com/courses/grade-8-math/lessons/equation-of-straight-lines/`

### 4.1 Source frameworks (only the topic-relevant strands were used)

| Framework | Relevant strand |
| --- | --- |
| U.S. Common Core, Grade 8 | **8.EE.B.5** (graph proportional relationships, interpret unit rate as slope), **8.EE.B.6** (similar triangles and slope; derive `y = mx` and `y = mx + b`), **8.F.A.3** (linear functions, `y = mx + b`), **8.F.B.4** (construct a linear function; interpret rate of change and initial value) |
| UK National Curriculum, KS3 (Years 8–9) | Plot and interpret graphs of linear functions; gradient as rate of change; `y = mx + c`; parallel lines have equal gradients; perpendicular gradients multiply to −1 |
| Singapore MOE Lower Secondary Mathematics | Linear graphs: gradient, y-intercept, equation of a straight line, parallel lines |
| CBSE / NCERT (Classes 8–10) | Linear equations in two variables and their graphs; coordinate geometry; slope and intercept form |
| Australian Curriculum, Years 8–9 | Linear relationships; gradient and intercepts; graph and solve linear equations; parallel and perpendicular lines |
| Cambridge Lower Secondary (Stages 8–9) | Straight-line graphs; gradient and y-intercept; equation of a line from two points |

> **Core vs. extension.** Everything in the Common Core strands above is **core** (LO1–LO9, LO11, LO12). Parallel / perpendicular lines and standard-form manipulation (LO8, LO10) appear in several international syllabi at Grade 8–9 and are included as **extension content**, taught in Station D and Worlds 8–9. They are clearly labelled "Challenge" in the UI so they never block core mastery.

### 4.2 Terminology and notation

| Term | Used in this module |
| --- | --- |
| Slope | "slope" with **"gradient"** shown alongside on first use (UK / AU / SG / IN usage) |
| Rate of change | Introduced in context; "slope = rate of change" |
| y-intercept | "y-intercept"; the constant is written **`c`** (`y = mx + c`). A vocabulary note states that some countries write `b`. |
| Rise / run | Used for the visual (CPA) definition of slope |
| Standard form | `Ax + By = C` with integer coefficients |
| Point-slope form | `y − y₁ = m(x − x₁)`, shown as a *bridge* to `y = mx + c` |
| Parallel / perpendicular | Equal slopes / slopes whose product is −1 |
| Undefined slope | Vertical lines (`x = h`) |
| Zero slope | Horizontal lines (`y = k`) |

### 4.3 Learning objectives

| LO | Description | Station | Question type |
| --- | --- | --- | --- |
| LO1 | Describe slope as steepness / rate of change; read rise and run from a graph | A | Q2 |
| LO2 | Calculate slope from two points using `m = (y₂ − y₁) / (x₂ − x₁)`; interpret positive, negative, zero and undefined slope | A | Q1 |
| LO3 | Identify the y-intercept from a graph, table or equation | B | Q3 |
| LO4 | Use `y = mx + c` to read slope and intercept and to sketch the graph | B | Q3, Q4 |
| LO5 | Write the equation of a line from its graph | C | Q4 |
| LO6 | Write the equation of a line given a point and the slope | C | Q5 |
| LO7 | Write the equation of a line through two points | C | Q6 |
| LO8 | Convert between `y = mx + c` and `Ax + By = C`; find x- and y-intercepts *(extension)* | C | Q8 |
| LO9 | Recognise and write horizontal (`y = k`) and vertical (`x = h`) lines | A, C | Q3, Q4 |
| LO10 | Use slopes to decide whether lines are parallel or perpendicular, and write the equation of a parallel/perpendicular line through a point *(extension)* | D | Q9 |
| LO11 | Decide whether a point lies on a line; find a missing coordinate | B | Q7 |
| LO12 | Model a real situation with `y = mx + c`; interpret the slope (rate) and y-intercept (starting value) in context | B, C | Q10 |

### 4.4 Concrete → Pictorial → Abstract (CPA) progression

- **Concrete:** drag two points on a grid and watch a rise/run staircase and the slope update live (Station A)
- **Pictorial:** move `m` and `c` sliders and watch a line tilt and shift to match a ghost target line (Station B)
- **Abstract:** assemble and type equations; use the slope formula and substitution (Stations C and D, then Play)

### 4.5 Number ranges (generation constraints, enforced by the question engine)

| Tier | Coordinates / constants | Slopes | Notes |
| --- | --- | --- | --- |
| **Easy** | Integers in [−10, 10]; `c` in [−10, 10] | Integer, `|m| ≤ 5`, mostly positive | Graph reading with grid-aligned points; no fractions in answers |
| **Medium** | Integers in [−10, 10] | Negative integers; simple fractions with denominator 2, 3 or 4 | Answers may be fractions; includes zero slope |
| **Hard** | Integers in [−12, 12]; decimals (one place) allowed in contexts only | Fractional, negative, zero and undefined | Standard form, perpendicular reciprocals, multi-step models, vertical lines |

All questions are generated so that the correct answer is a **clean value** (an integer, or a fraction with denominator ≤ 6). No question requires a calculator.

---

## 5. Learning-First Pedagogy

The module deliberately separates **learning** from **practice**:

```
LEARN (Wonder + Story)  →  EXPLORE (Simulate: Learn card → Guided try → Challenge)  →  PRACTISE (Play)  →  REFLECT
```

| Principle | How it is enforced in the product |
| --- | --- |
| **Learn before you are tested** | Play is **locked** until all 4 stations are complete. The lock is visible on the phase tracker with a tooltip: "Finish the simulations to unlock the game!" |
| **Concept first, procedure second** | Each station opens with a short narrated **Learn card** (concept + worked example) before any challenge round |
| **Guided → independent** | Each station has a *Guided try* (step prompts, always-on hints) followed by *Challenge rounds* (hints on request) |
| **Productive struggle with safety nets** | 3-tier hints; no negative scoring; the full worked explanation is shown after a third miss |
| **Spaced re-exposure** | Concepts from Stations A–D reappear in worlds in an interleaved order (Section 9.3) |
| **Reflect** | The Reflect phase asks students to explain slope and intercept in their own words |

---

## 6. The 6-Phase Learner Journey (Intellia Model)

```
┌────────────────────────────────────────────────────────────────────────────┐
│ INTRO SCREEN → Progress Map (6-step visual tracker, top bar)               │
│ Welcome: "Hello, Explorer! Ready to master Straight Lines? 📈🌍"          │
│ Lesson badge shown (locked). 6 glowing phase dots visible.                 │
└────────────────────────────────────────────────────────────────────────────┘
                                     │
                                     ▼
┌────────────────────────────────────────────────────────────────────────────┐
│ PHASE 1 — WONDER (≈ 1–2 min)                                               │
│ Hook: a drone takes off from a London rooftop and climbs at a steady rate. │
│ Interactive: student drags a time slider; the drone moves and a graph dot  │
│ appears for each second, revealing a straight line of dots.                │
│ Question: "How high will it be after ten seconds?"                         │
│ Mascot "Grady" appears, puzzled → "Let's discover how the equation of a    │
│ straight line can answer this!"                                            │
└────────────────────────────────────────────────────────────────────────────┘
                                     │
                                     ▼
┌────────────────────────────────────────────────────────────────────────────┐
│ PHASE 2 — STORY (≈ 3–4 min) — "The Straight Line Squad"                    │
│ 6 illustrated, animated panels (Section 7). Key vocabulary is highlighted: │
│ slope, rise, run, y-intercept, parallel, perpendicular.                    │
│ World-map background with pins on each character's city.                   │
└────────────────────────────────────────────────────────────────────────────┘
                                     │
                                     ▼
┌────────────────────────────────────────────────────────────────────────────┐
│ PHASE 3 — SIMULATE (≈ 10–14 min)  ← THE LEARNING PHASE                     │
│ 4 interactive stations; all must be completed to unlock Play.              │
│  A  Slope Explorer     (Concrete)  — rise/run on a grid                    │
│  B  Line Lab           (Pictorial) — m and c sliders vs. a ghost line      │
│  C  Equation Builder   (Abstract)  — build y = mx + c from clues           │
│  D  Street Planner     (Extension) — parallel & perpendicular lines        │
│ Each station: Learn card → Guided try → 3 Challenge rounds.                │
└────────────────────────────────────────────────────────────────────────────┘
                                     │
                                     ▼
┌────────────────────────────────────────────────────────────────────────────┐
│ PHASE 4 — PLAY (≈ 15–20 min)                                               │
│ IntelliPlay™ Level: 100 procedurally generated questions across 10 worlds  │
│ (each world = a real-world global landmark), 10 questions per world.       │
│ A world unlocks at ≥ 6/10 correct. Stars (1–3), XP, badges and a streak    │
│ fire counter are active. Replaying a world generates NEW questions.        │
└────────────────────────────────────────────────────────────────────────────┘
                                     │
                                     ▼
┌────────────────────────────────────────────────────────────────────────────┐
│ PHASE 5 — REFLECT (≈ 2–3 min)                                              │
│ Journal prompt + 3-item confidence check. Lesson-complete badge unlocks.   │
│ Summary of XP, stars, badges and the concepts mastered per world.          │
│ "Share with your teacher" button (summary export).                         │
└────────────────────────────────────────────────────────────────────────────┘
```

The tracker shows 6 dots (Intro, Wonder, Story, Simulate, Play, Reflect), consistent with the reference product.

---

## 7. Story & Characters — "The Straight Line Squad"

### 7.1 Characters (global cast)

| Name | City | Role in the story / concept they own |
| --- | --- | --- |
| **Mike** | New York, USA | Skatepark builder → slope as rise over run |
| **Sarah** | London, UK | Drone pilot and taxi rider → y-intercept and rate (`y = mx + c`) |
| **Yuki** | Tokyo, Japan | Train spotter → parallel lines (same slope) |
| **Priya** | Mumbai, India | City planner → perpendicular streets |
| **Aisha** | Cairo, Egypt | Navigator → equation from two points |
| **Carlos** | Mexico City, Mexico | Bike-rental entrepreneur → real-world models |
| **John** | Toronto, Canada | Team captain / narrator voice in the intro |
| **Emma** | Sydney, Australia | Harbour-ferry engineer → negative slope (going down) |
| **Liam** | Dublin, Ireland | Coder → checks if a point is on the line |
| **Sofia** | Madrid, Spain | Cable-car designer → fractional slopes |
| **Noah** | Nairobi, Kenya | Trail guide → standard form and intercepts |
| **Fatima** | Dubai, UAE | Architect → horizontal and vertical lines |
| **Diego** | Buenos Aires, Argentina | Mountain biker → mixed challenges |

**Mascot: Grady**, the friendly Gradient Bot: a compass-faced robot whose antenna tilts to show the slope of whatever line is on screen. (Replaces the "Chrono" mascot of the Grade 5 module; same mood system.)

**Plot.** Ten friends from ten countries meet online as the **Straight Line Squad**. A small weather drone named **Skylark** has lost its way and can send only a few coordinates before its battery dies. Skylark always flies in perfectly straight lines. If the squad can write the **equation of its path**, they can predict exactly where it will be, and rescue it. Each world in Play is a "Skylark Signal" received from a different city.

### 7.2 Wonder hook (Phase 1)

> "Sarah's drone takes off from a rooftop in London that is two metres high. Every second, it climbs three metres."
> "How high will it be after ten seconds?"
> "Let's discover how the equation of a straight line can answer this!"

*(Answer: `y = 3x + 2` → at x = 10, y = 32 metres. The Wonder phase does not reveal the answer; it is revisited in the Reflect phase.)*

### 7.3 Story panels (Phase 2)

| Panel | Narrated text (paragraphs only, titles are never narrated) | Visual |
| --- | --- | --- |
| 1 | "John, Mike, Sarah, Emma, Liam, Sofia, Noah, Aisha, Carlos, and Yuki are friends from ten different countries. They call themselves the Straight Line Squad, and they meet online to solve puzzles about lines." | World map; 10 pins pop in; avatars appear in a video-call grid |
| 2 | "One night, a signal arrives from Skylark, a little weather drone that has lost its way. It can only send a few numbers, so the squad must work out its flight path before the battery runs out!" | Dark sky, blinking drone, battery bar at 30% |
| 3 | "Mike builds a skateboard ramp in New York. The ramp rises three metres over a run of six metres. How steep is it? Mike calls this steepness the slope." | Animated ramp; rise (vertical) and run (horizontal) arrows; slope triangle appears. Slope = 3/6 = 1/2 |
| 4 | "Sarah takes a taxi in London. It costs three pounds just to start, plus two pounds for every kilometre. She notices the cost grows along a perfectly straight line, and the starting cost is where the line crosses the y-axis." | Taxi moves along a graph; y-intercept (0, 3) pulses; slope triangle shows +2 per km |
| 5 | "Yuki sees two bullet-train tracks running side by side in Tokyo. They never meet, because they have the same slope. Priya notices that the streets in Mumbai cross at right angles, and their slopes are flipped and negative, like two and negative one half." | Parallel tracks animation; perpendicular street grid; slope labels `2` and `−1/2` |
| 6 | "Aisha in Cairo has the final clue. Skylark flew from the point zero, two to the point four, ten. If we can find the equation of its path, we can find exactly where it will be next. Are you ready to help the squad?" | Map trail with two glowing points; line is hinted but not drawn; "Open the Simulation Lab" button |

> *Check of story maths:* Panel 3: 3 ÷ 6 = 1/2. Panel 4: `y = 2x + 3`, intercept (0, 3). Panel 5: 2 × (−1/2) = −1. Panel 6: slope = (10 − 2) / (4 − 0) = 2, `c = 2`, so Skylark's path is `y = 2x + 2`.

Illustrations are cartoon-style, globally inclusive, with landmark backdrops (Big Ben, Empire State Building, Eiffel Tower, Tokyo skyline, Pyramids, Sydney Opera House, Table Mountain, etc.).

---

## 8. Phase 3 — Simulation Design (Detailed)

All four stations share the same shell: **Learn card → Guided try → 3 Challenge rounds**. Round parameters are **randomly generated** within the constraints below (never hard-coded), so repeat visits differ.

All stations use a common **Coordinate Plane** component: an SVG grid (x and y from −10 to 10), labelled axes, draggable points that snap to integer coordinates, optional rise/run staircase, optional intercept markers, and "ghost" (target) lines.

### 8.1 Station A — "Slope Explorer" (Concrete)

**Learn card (narrated):** Mike's ramp. "Slope tells us how steep a line is. Count how far you go up, that is the rise. Count how far you go across, that is the run. Slope is rise divided by run." Then: uphill is positive, downhill is negative, flat is zero, a wall has no slope at all (undefined).

**Guided try:** Two points are pre-placed. A rise/run staircase draws itself step by step with prompts: "What is the rise?" → "What is the run?" → "So the slope is…".

**Challenge rounds (3 per visit, drawn from the 5 round types below, always including at least one negative-slope round):**

| Round type | Task | Generation rule |
| --- | --- | --- |
| A1 — Build the ramp | "Drag the points to make a line with slope 2." | Target `m` integer in [1, 4]; student moves point B; accepted if the exact slope matches |
| A2 — Downhill | "Make a line that goes downhill with slope −3." | Target `m` in [−4, −1] |
| A3 — Fractional | "Make a line with slope 1/2." | Target `m` in {1/2, 1/3, 2/3, 3/4, −1/2, −2/3} |
| A4 — Flat or wall? | Given a line (horizontal or vertical), classify slope as zero or undefined | Random orientation, random position |
| A5 — Read the slope | A line is drawn through two grid points; student enters rise, run and slope | Points chosen so that slope is a clean value |

**Interaction:** drag points (mouse/touch/pen) or use arrow keys to nudge a focused point; "tap + tap" fallback (tap a point, then tap its destination). A live label shows `rise = …, run = …, slope = …`.

**Feedback:** correct → Grady spins, short celebration line; incorrect → gentle shake, the staircase highlights the miscounted rise or run.

### 8.2 Station B — "Line Lab" (Pictorial)

**Learn card (narrated):** Sarah's taxi. "In y equals m x plus c, m is the slope and c is the y-intercept, the place where the line crosses the y-axis. Change c and the line slides up or down. Change m and the line tilts."

**Guided try:** Student first moves only `c` (line translates, slope unchanged), then only `m` (line pivots around the y-intercept), with a live equation readout.

**Interface:** two controls: a **slope slider** (−5 to 5 in steps of 0.5, with snap marks at common fractions) and an **intercept slider** (−8 to 8 in steps of 1). The student's line is drawn in blue; the **ghost target line** is drawn dashed in gold.

**Challenge rounds (3 per visit):**

| Round type | Task |
| --- | --- |
| B1 — Slide it | The ghost line has the same slope as yours. Match it using `c` only |
| B2 — Tilt it | The ghost line passes through your y-intercept. Match it using `m` only |
| B3 — Match both | Match a random ghost line with both sliders |
| B4 — Predict first | The ghost line is shown; student picks the matching equation from 4 cards *before* the sliders appear, then verifies with the sliders |
| B5 — Is it on the line? | A random point is shown; student decides whether it lies on the drawn line, then checks by substitution |

**Feedback:** the ghost line flashes green when matched (tolerance: exact values, since sliders snap to the allowed grid).

### 8.3 Station C — "Equation Builder" (Abstract)

**Learn card (narrated):** Aisha's navigation. "To write an equation, we need two things: the slope, and the y-intercept. Find the slope first. Then use any point on the line to find c."

**Guided try (two-point line, step-by-step scaffold):**

1. "Find the slope" → fill `m = (y₂ − y₁) / (x₂ − x₁)`
2. "Substitute a point" → fill `y = m x + c` with a known point
3. "Solve for c"
4. "Write the equation"

**Interface:** a tile tray (`y`, `=`, `x`, numbers, `+`, `−`, fractions) and an on-screen **MathPad** for typed entry. Entry is checked by **mathematical equivalence**, not text equality (so `y = 2x + 3`, `2x − y = −3` and `y = 3 + 2x` are all accepted; see TRD §7).

**Challenge rounds (3 per visit):**

| Round type | Task |
| --- | --- |
| C1 — From the graph | A line with a clearly marked y-intercept and one more grid point is drawn; write its equation |
| C2 — From a point and a slope | "A line has slope −2 and passes through (3, 1)." Write the equation (point-slope shown as a hint bridge) |
| C3 — From two points | Two points are given; use the guided scaffold (fades to independent on later rounds) |
| C4 — Standard form *(extension)* | Convert `y = mx + c` to `Ax + By = C` (and back) |
| C5 — Vertical & horizontal | "Write the equation of the line through (4, −2) and (4, 5)" → `x = 4` |

### 8.4 Station D — "Street Planner" (Extension: Parallel & Perpendicular)

**Learn card (narrated):** Yuki and Priya. "Parallel lines never meet, because they have the same slope. Perpendicular lines cross at a right angle. Their slopes multiply to give negative one."

**Interface:** A street (line) is shown on a city-map-styled grid, plus a marked building (point). The student sets a slope with the slope slider to draw a new street through the building; the app shows the angle between the two streets with a live right-angle marker when perpendicular.

**Challenge rounds (3 per visit):**

| Round type | Task |
| --- | --- |
| D1 — Build a parallel street | Draw a street through the building that never meets the existing street |
| D2 — Build a perpendicular street | Draw a street through the building that crosses at a right angle |
| D3 — Which pair is it? | Four pairs of equations are shown; classify each as parallel, perpendicular or neither (drag into 3 bins) |

### 8.5 Station completion and gating

- A station is complete when the student finishes its **3 Challenge rounds** (a round completes once solved; 3 attempts maximum per round, with the worked solution revealed on the third miss; no round can be skipped).
- Stations may be done in any order, but are recommended A → B → C → D (a pulsing arrow marks the next one).
- When all 4 are complete: **Grady** celebrates, the "Line Builder" badge unlocks, and **Play** unlocks.

---

## 9. Phase 4 — Question Bank (100 Procedurally Generated Questions)

> **Key requirement:** there is **no fixed bank of 100 hard-coded questions**. A **question generator engine** produces 100 questions per session, **every one with random parameters**. Names, cities, objects, numbers and distractors are all drawn at random from curated pools. The 10 question *types* and the world blueprint are fixed; the *instances* never are.

### 9.1 Question types (10 types)

| Type | Description | Example (one possible random instance) |
| --- | --- | --- |
| **Q1** | Slope from two points | "Liam plots the points (1, 2) and (5, 10). What is the slope of the line through them?" → **2** |
| **Q2** | Slope from a graph (rise ÷ run) | A line is drawn on the grid through two highlighted points; "What is the slope?" |
| **Q3** | Read slope and y-intercept from an equation or graph | "For `y = −3x + 4`, what are the slope and the y-intercept?" → **m = −3, c = 4** |
| **Q4** | Write the equation from a slope and y-intercept (or from a graph; includes horizontal/vertical lines) | "Write the equation of the line with slope 2 and y-intercept −5." → **`y = 2x − 5`** |
| **Q5** | Equation from a point and a slope | "A line has slope 3 and passes through (2, 5). What is its equation?" → **`y = 3x − 1`** |
| **Q6** | Equation from two points | "A line passes through (−2, 1) and (4, 4). Write its equation." → **`y = ½x + 2`** |
| **Q7** | Point on a line / missing coordinate | "Does (3, 7) lie on `y = 2x + 1`?" → **Yes** · or · "The point (4, k) lies on `y = 2x + 1`. Find k." → **9** |
| **Q8** | Standard form and intercepts *(extension)* | "Write `y = −2x + 5` in the form `Ax + By = C`." → **`2x + y = 5`** · or · "Find the x-intercept" → **5/2** |
| **Q9** | Parallel and perpendicular lines *(extension)* | "Find the equation of the line perpendicular to `y = 2x + 1` through (4, 3)." → **`y = −½x + 5`** |
| **Q10** | Real-world linear models | "Carlos rents a bicycle in Mexico City for a fee of 30 pesos plus 15 pesos per hour. Write the cost `y` after `x` hours and find the cost for 4 hours." → **`y = 15x + 30`; 90 pesos** |

Every type has **2–4 template variants** (different phrasing and different visual), and several have **format variants** (Section 9.4), so students seldom see the same *shape* of question twice in a row.

### 9.2 World blueprint (fixed type mix per world; random instances)

| World | Landmark (name) | Difficulty | Q1 | Q2 | Q3 | Q4 | Q5 | Q6 | Q7 | Q8 | Q9 | Q10 | Σ |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | **London** — Big Ben Plaza | Easy | 3 | 4 | 3 | | | | | | | | 10 |
| 2 | **New York** — Skyline Skatepark | Easy → Medium | 4 | 3 | 3 | | | | | | | | 10 |
| 3 | **Paris** — Eiffel Elevator | Easy → Medium | | 1 | 4 | 3 | | | 2 | | | | 10 |
| 4 | **Tokyo** — Bullet Train Tracks | Medium | | | 3 | 4 | | | 3 | | | | 10 |
| 5 | **Sydney** — Harbour Bridge Ramp | Medium | | | 1 | 3 | | | 2 | | | 4 | 10 |
| 6 | **Cairo** — Pyramid Slope | Medium | 1 | | | 2 | 5 | | 2 | | | | 10 |
| 7 | **Rio de Janeiro** — Carnival Cable Car | Medium → Hard | 2 | | | | 2 | 5 | 1 | | | | 10 |
| 8 | **Cape Town** — Table Mountain Trail | Hard | | | 1 | | | 1 | 2 | 6 | | | 10 |
| 9 | **Mumbai** — Metro Grid | Hard | 1 | | | 1 | | 2 | | | 6 | | 10 |
| 10 | **Reykjavik** — Aurora Rescue | Hard | | | | 1 | 1 | 2 | | 1 | 2 | 3 | 10 |
| | **Totals** | | **11** | **8** | **15** | **14** | **8** | **10** | **12** | **7** | **8** | **7** | **100** |

- Within each world the 10 questions are **shuffled** (the type order is random); the **Reykjavik** finale also contains one horizontal/vertical-line Q4 variant.
- The final world, **Aurora Rescue**, concludes the Skylark storyline: the last question asks the student to use Skylark's equation to predict its position.

**Difficulty distribution (target across all 100):** ≈ 30% Easy, 40% Medium, 30% Hard (per-world tier in the table above governs the actual draw).

### 9.3 Randomization requirements (hard requirements)

1. **Seeded generation.** Each session has a random 32-bit seed. Every question is generated from `(seed, world, attempt, slot)`, which makes sessions reproducible for resume and debugging, but unique per student per session.
2. **Random parameters.** Slopes, intercepts, points, line positions, names, cities, currencies, objects and distractors are sampled from constrained ranges (Section 4.5).
3. **No duplicates in a session.** A question *signature* (type + normalised parameters) must be unique within the session.
4. **Low repetition across sessions.** The last 300 signatures are kept in local storage; the generator avoids them (best effort, up to 20 retries per slot).
5. **Retry = new questions.** Replaying a world to earn more stars generates **new** questions with the same blueprint.
6. **Randomized option order and distractors.** Correct-answer position is uniformly random. Distractors are *misconception-driven* (Section 9.5), not random numbers.
7. **Random visual variants.** Graph questions pick random orientation, quadrant placement and highlighted points.
8. **Verified answers.** Every generated question passes an automated *independent-solver* validation before being shown (TRD §6.6). A question that fails is discarded and regenerated.

### 9.4 Interaction formats

| Format | Used by |
| --- | --- |
| Multiple choice (4 options) | Q1–Q10 |
| Numeric / fraction entry (on-screen pad, accepts `1/2`, `0.5`, `−3`) | Q1, Q2, Q7, Q10 |
| Equation entry (MathPad; equivalence-checked) | Q4, Q5, Q6, Q8, Q9, Q10 |
| Graph-plot (tap two grid points to draw the line; check against the target) | Q4, Q5, Q6 (variant: "Plot the line `y = …`") |
| True / False | Q7, Q9 |
| Fill-in-the-blanks (worked solution steps) | Q6, Q8 (scaffolded in World 7–8) |
| Drag-to-sort (parallel / perpendicular / neither) | Q9 variant |

### 9.5 Misconception-driven distractors (examples)

| Skill | Common error → distractor |
| --- | --- |
| Slope | Run ÷ rise (inverted) · wrong sign · `(x₂ − x₁)/(y₂ − y₁)` · subtracting in inconsistent order |
| y-intercept | Using the x-intercept · swapping `m` and `c` · sign error on `c` |
| Point-slope → `y = mx + c` | Forgetting to distribute · using `y₁` as `c` |
| Two-point equation | Correct `m`, wrong `c` · `c = y₁ + m x₁` (sign) |
| Standard form | Sign slip moving `x` across the equals sign · not clearing fractions |
| Parallel / perpendicular | Using the *same* slope for perpendicular · using the reciprocal without the negative sign · negative without the reciprocal |

### 9.6 Global context pools

- **Names:** John, Mike, Sarah, Emma, Liam, Sofia, Noah, Aisha, Carlos, Yuki, Priya, Fatima, Diego, Chloe, Ravi, Amara, Mateo, Hana, Omar, Lucas
- **Cities and landmarks:** London, New York, Paris, Tokyo, Sydney, Cairo, Rio de Janeiro, Cape Town, Mumbai, Reykjavik, Toronto, Mexico City, Dubai, Nairobi, Buenos Aires, Madrid, Dublin
- **Currencies:** £, $, €, ¥, ₹, pesos, rand, AED (each paired with a plausible city)
- **Contexts:** drone flights, taxi and ride fares, bicycle / scooter rentals, phone plans, ramps and skateparks, cable cars and trails, water tanks filling or draining, savings plans, running / cycling at constant speed, train tracks, city street grids
- Context values are always plausible (e.g. taxi base fare 2–6 currency units; per-km rate 1–4).

### 9.7 Language & notation

- Slope vocabulary: "slope" (with "gradient" shown in the vocabulary card)
- Equations are written `y = mx + c` with proper typography (`−` minus sign, superscript-free); fractions shown as stacked fractions on screen
- Coordinates are written `(x, y)`
- Line names are written in the form "the line `y = 2x + 3`"
- Every math expression has a **speakable form** used for audio (e.g. "y equals two x plus three")

---

## 10. Gamification Design

### 10.1 Reward system

- **Stars (⭐):** earned per world: 6–7 correct = 1★, 8–9 = 2★, 10 = 3★ (max 30★)
- **XP:** 10 XP correct on the first try · 7 XP on the second try · 5 XP when a hint was used or on the third try
- **Streak 🔥:** consecutive correct (first-try) answers; resets on a miss
- **Streak bonus:** +5 XP per correct answer while streak ≥ 5
- **World unlock gate:** ≥ 6/10 correct. A 3★ world unlocks a hidden **Bonus Challenge** (3 extra questions: random Hard generators)
- Simulation stations award a flat **20 XP** per completed round (no negative scoring anywhere)

### 10.2 Badges

| Badge | How to earn |
| --- | --- |
| 🏅 **Line Starter** | Complete Wonder + Story |
| 🥈 **Line Builder** | Complete all 4 simulation stations |
| 🥇 **Line Legend** | Score ≥ 80/100 (best score per world counted) |
| 💎 **Perfect Path** | Score 10/10 in any world |
| 🔥 **Streak Star** | Reach a streak of 10 |
| 🌍 **Global Explorer** | Complete all 6 phases (lesson-complete badge) |
| 🎯 **Pinpoint** | Complete Station A with no wrong submissions |
| ⛰️ **Slope Master** | Correctly answer 10 questions involving negative or fractional slopes |

### 10.3 Feedback mechanics

**✅ Correct:** bounce animation, Grady happy, celebration audio line (random from a pool), XP floats up, streak increments.

**❌ Incorrect, attempt 1:** gentle shake + encouragement line; **Hint 1** (a nudge: which concept to use).

**❌ Incorrect, attempt 2:** stronger shake; **Hint 2** (an animated worked step: e.g. the rise/run staircase draws itself, or the substitution step appears).

**❌ Incorrect, attempt 3:** the answer and a full animated explanation are shown and read aloud. **No score penalty. Encouragement only.** The question still counts as *incorrect* for the world score (so the pass gate stays meaningful) but the student keeps their streak-free XP floor of 0 for that question.

### 10.4 World map (IntelliPlay™ progression)

A horizontal-scrolling map with 10 landmark nodes (lock / unlocked / starred). Each node shows the world's concept tag (e.g. "Slope from points"). Locked worlds are visible so students can see what lies ahead.

### 10.5 Mascot — Grady

- **Mood states:** idle · curious · happy · thinking · celebrating · encouraging
- **Appearances:** Wonder, Story, Simulation (Learn cards and feedback), Play (feedback), Reflect
- **Slope antenna:** during graph questions the antenna tilts to match the line on screen (a small delight, and a visual cue for slope)
- **Audio:** all mascot speech through the ElevenLabs Alice voice

---

## 11. Audio & Narration Design

Fully aligned with `audio_generation_pipeline.md`.

### 11.1 Pipeline summary

- **Voice provider:** ElevenLabs only (no browser Web Speech fallback)
- **Voice:** Alice (Clear, Engaging Educator) — `Xb7hH8MSUJpSbSDYk0k2` — model `eleven_multilingual_v2`
- **Pre-generation:** `scripts/generate_audio.js` → static `.mp3` in `public/assets/audio/` for all **fixed** narration (Wonder, Story, Learn cards, station instructions, feedback pools, badges, Reflect)
- **Dynamic generation:** because Play questions are randomized, question text is narrated through the **dynamic fallback**: `getAudioUrl()` → static map → memory cache → persistent cache → ElevenLabs (via the `/api/elevenlabs` proxy)
- **Mapping:** auto-generated `src/utils/audioMap.js` (exact text → file path)
- **Cleanup:** `scripts/clean_audio.js` removes orphaned files
- **Queue + preload:** `narrate(segments)` plays sequentially with a `currentQueue` symbol to prevent overlap; while segment *i* plays, segment *i + 1* is preloaded

### 11.2 Content policy — paragraphs & questions ONLY

> **IMPORTANT:** Audio is generated ONLY for paragraph/story text, instructions and question text. **Titles, headings, world names, station names and section labels are never narrated.**
> Answer options are not narrated. Hints and explanations (paragraph text) are narrated *on demand* (the explanation is read after the third miss).

### 11.3 Speech styles → ElevenLabs settings

| Style | Stability | Similarity Boost | Style | Speaker Boost | Use case |
| --- | --- | --- | --- | --- | --- |
| `celebration` | 0.12 | 0.45 | 0.75 | ✅ | Badge unlock, world complete, correct answers |
| `encouragement` | 0.16 | 0.50 | 0.65 | ✅ | Wrong-answer feedback, nudges |
| `question` | 0.20 | 0.55 | 0.55 | ✅ | Every question (Wonder, stations, Play) |
| `emphasis` | 0.16 | 0.50 | 0.60 | ✅ | Key vocabulary moments |
| `thinking` | 0.24 | 0.60 | 0.35 | ✅ | Mascot thinking, Reflect |
| `statement` / `instruction` | 0.20 | 0.55 | 0.50 | ✅ | Story narration, Learn cards, instructions |

### 11.4 Narration script examples

**Wonder (thinking → question)**
> "Sarah's drone takes off from a rooftop in London that is two metres high. Every second, it climbs three metres."
> "How high will it be after ten seconds?"

**Story panel 3 (statement)**
> "Mike builds a skateboard ramp in New York. The ramp rises three metres over a run of six metres. How steep is it? Mike calls this steepness the slope."

**Station A Learn card (instruction)**
> "Slope tells us how steep a line is. Count how far you go up, that is the rise. Count how far you go across, that is the run. Slope is rise divided by run."

**Station B round (question)**
> "Move the sliders until your line covers the gold line. Which slope and which y-intercept do you need?"

**Play question (question, dynamic)**
> "Liam plots the points one, two and five, ten. What is the slope of the line through them?"

**Feedback (celebration pool, pre-generated)**
> "Amazing! You found the slope perfectly!"
> "Brilliant work! That line is exactly right!"

**Reflect (thinking)**
> "What an adventure! Can you explain, in your own words, what the slope and the y-intercept tell us about a line?"

### 11.5 Speakable maths

Math notation is converted by a single **`speakMath()`** function so that displayed text and spoken text can never drift apart. Examples:

| Displayed | Spoken |
| --- | --- |
| `y = 2x + 3` | "y equals two x plus three" |
| `y = −x/2 + 4` | "y equals negative x over two, plus four" |
| `(−2, 1)` | "the point negative two, one" |
| `m = 3/4` | "m equals three quarters" |
| `2x − y = −3` | "two x minus y equals negative three" |

### 11.6 Strict parity rule

- **Static content:** every narrated string in `narration.js` must match the UI text **exactly** (same words, punctuation and capitalization). Any UI text change requires updating `generate_audio.js` `phrases` and `narration.js`.
- **Dynamic content (Play):** the on-screen question and the narrated question are produced from the **same template object** `{ display, spoken }`, where `spoken = speakMath(display)`. A parity test enforces this across thousands of generated questions.

---

## 12. UX & Visual Design Requirements

### 12.1 Visual theme

- **Brand:** Intellia SG — *Think. Explore. Become.*
- **Reference UI (strict match):** `https://grade5-time-intervals.vercel.app/` and the repo `https://github.com/p1pachare-cloud/Grade5-Time-Intervals`. Reuse the same page shell, phase components, card styles, progress map, gamification bars and animation language.
- **Colours:** same palette as the reference (primary brand blue, gold for rewards, soft coral for wrong-answer states, white cards, soft shadows, distinct phase-band colours). A new accent pair is added for graphs: **blue** = student's line, **gold dashed** = target / ghost line, **teal** = helper overlays (rise/run).
- **Typography:** rounded and friendly: Nunito (body) with Fredoka for headings. Math is rendered in a clean numeric font with true minus signs.
- **Tone for age 13–14:** same warmth and gamification as Grade 5, but with less cartoon-childish copy, more "mission / squad" language, and slightly more mature illustration style.
- **Illustrations:** globally inclusive character designs with landmark backdrops.

### 12.2 Layout structure (mirrors the reference)

- **Top bar:** Intellia logo | Lesson title "Equation of Straight Lines" | 6-phase dot tracker (Play shows a lock until Simulate is complete)
- **Main area:** phase content (responsive; smooth phase transitions)
- **Bottom bar:** XP counter | Star count | Streak fire | Phase navigation arrows | 🔊 audio toggle
- **Sidebar:** hidden on mobile; vertical phase map on tablet and up

### 12.3 Primary visual component — the Coordinate Plane

Used in Wonder, Story, every station, and many Play questions:

- Grid from −10 to 10 (zooms to −12…12 for hard worlds), bold axes with tick labels
- Line drawn with a smooth animated "draw-on" effect
- Optional rise/run staircase (teal), y-intercept marker (gold dot, pulsing), x-intercept marker
- Points: large touch targets (≥ 44 × 44 px hit area), draggable, snapping to integers, labelled `(x, y)` on hover/focus
- Missing values shown as `?` markers or a dashed outline
- Every graph has a **text alternative** (e.g. "A line passing through (0, 2) and (4, 10); slope 2") for screen readers

### 12.4 Accessibility

- Touch targets ≥ 44 × 44 px; WCAG AA contrast
- Fully keyboard operable (Tab/Enter; arrow keys nudge a focused point by 1 unit; Shift+arrows by 5)
- Drag interactions always have a tap-tap fallback
- Graph colours are not the only signal (line styles also differ: solid vs dashed; labels present)
- `prefers-reduced-motion` respected (animations replaced by instant state changes)
- No mandatory time pressure (optional timer in the Bonus Challenge only)
- Narration can be turned off; all content remains fully readable

### 12.5 Responsive design

- Primary: desktop (1024 px+) and tablet (768 px+): classroom context
- Tertiary: mobile (375 px+): graph occupies full width; controls stack below the graph

---

## 13. Content Requirements

### 13.1 Simulation visuals

- Coordinate plane (SVG) with all overlays above
- Slider controls with fraction snap marks; MathPad (on-screen keypad with `x`, `y`, `=`, `+`, `−`, fraction, digits)
- City-map skin for Station D; taxi/drone/train illustrations for Story panels

### 13.2 Question generation coverage

- All 10 question types implemented as generator modules with 2–4 template variants each
- 100 questions per session produced by the world blueprint (Section 9.2)
- Automated validation of every generated question (Section 9.3, item 8)

### 13.3 Word-problem formats

**Rate + start value:**
> "[Name] in [City] [pays/saves/climbs…] [initial value] plus [rate] per [unit]. Write the cost/amount `y` after `x` [units]."

**Interpret the model:**
> "The line `y = 4x + 12` models [Name]'s [phone plan]. What does 4 mean? What does 12 mean?"

**Prediction:**
> "Using [Name]'s equation, what will `y` be when `x = [value]`?"

### 13.4 Audio script parity

See Section 11.6.

---

## 14. Success Criteria (v1.0)

| Criterion | Target |
| --- | --- |
| 100 Play questions generated randomly per session; all answer keys verified | ✅ Required |
| No duplicate question signatures within a session | ✅ Required |
| All 4 simulation stations functional (Learn card, Guided try, 3 rounds) | ✅ Required |
| Play locked until all stations are complete | ✅ Required |
| All 6 phases navigable end-to-end | ✅ Required |
| Gamification (XP, stars, streak, 8 badges) working | ✅ Required |
| 10-world progression logic correct (≥ 6/10 gate; replay → new questions) | ✅ Required |
| ElevenLabs audio plays for all fixed narration; dynamic question audio works with silent fallback | ✅ Required |
| Audio parity test passes (static and dynamic) | ✅ Required |
| Equation answers accepted by equivalence (not string match) | ✅ Required |
| Mobile / tablet / desktop responsive layout | ✅ Required |
| Curriculum coverage matrix (LO × station × question type) complete | ✅ Required |
| Loads in < 3 s on a mid-range device (Vite production build) | ✅ Required |
| WCAG AA accessible, keyboard operable | ✅ Required |
| UI matches the Grade 5 reference structure | ✅ Required |
| Hosted at the Intellia Grade 8 lesson URL | ✅ Required |

---

## 15. Out of Scope (v1.0)

- Teacher dashboard / backend analytics
- Student accounts and cross-device progress
- Multiplayer or class competition
- Parent report emails
- Printable worksheets
- Non-linear functions (quadratics, exponentials) and systems of equations
- Regional notation toggle (`b` instead of `c`), planned for v1.1 (it doubles the pre-generated audio lines that mention the intercept letter)
- Localization into other languages (the audio model is multilingual, but all copy is English in v1.0)

---

## 16. Risks & Open Questions

| # | Item | Mitigation / Owner |
| --- | --- | --- |
| 1 | **Dynamic audio cost and latency.** Randomized questions cannot be pre-generated; ≈ 100 question stems × ~110 characters ≈ 11,000 characters per full session | Shared server-side audio cache keyed by `hash(text, style)` (repeated phrasings are free); prefetch per world; per-session character cap with on-demand 🔊 button beyond it; silent fallback so audio never blocks play |
| 2 | **API-key exposure.** The pipeline document uses `VITE_ELEVENLABS_API_KEY`, but any `VITE_` variable is bundled into the browser | Use the `/api/elevenlabs` proxy with a server-only key in production; the `VITE_` key is allowed for local development only |
| 3 | **Exact course URL** for Grade 8 | Intellia team to confirm slug; trivial to change |
| 4 | **Extension content** (standard form, perpendicular) varies by syllabus | Labelled "Challenge"; mastery of core LOs does not depend on it |
| 5 | **Reference UI fidelity.** The live reference app renders client-side | Dev team to verify pixel-level details against the running reference and the repo's `App.css` / Tailwind config during M2 |
| 6 | **Embedding / progress events.** Whether the course page wants `postMessage` completion events | Optional hook defined in the TRD; confirm with Intellia |

---

**Document Version:** 1.0 | **Product:** Intellia SG — Grade 8 Math, Equation of Straight Lines
**Lesson Title:** Global Line Riders — Equation of Straight Lines
**Curriculum:** Global Grade 8 Mathematics (Common Core, UK NC, Singapore MOE, CBSE/NCERT, Australian Curriculum, Cambridge Lower Secondary cross-aligned)
**Reference UI:** <https://grade5-time-intervals.vercel.app/>
**Reference Repo:** <https://github.com/p1pachare-cloud/Grade5-Time-Intervals>
**Audio Pipeline:** ElevenLabs (Alice, `Xb7hH8MSUJpSbSDYk0k2`, `eleven_multilingual_v2`) — per `audio_generation_pipeline.md`
**Lesson URL (to confirm):** <https://intelliasg.com/courses/grade-8-math/lessons/equation-of-straight-lines/>
