# ExamTree Quant V4 — Time, Speed & Distance
## End-to-End Chapter Design Blueprint

**Design status:** `COMPLETE_FOR_CHECKPOINT_EXECUTABLE_DISCOVERY`  
**Student-facing chapter:** **Time, Speed & Distance**  
**Runtime packages:** `TSD-001`, `TSD-002`  
**Canonical checkpoint range:** `TSD-CP-001..TSD-CP-012`  
**Permanent QL allocation:** none  
**Frozen solve modes:** none  
**Design date:** 31 July 2026  
**Primary exams:** SSC CGL/CHSL/MTS/GD, Banking (IBPS/SBI/RRB), Railway, PSSSB, PPSC, Punjab Police and other state competitive examinations  
**Runtime languages:** English (`en-IN`), Hindi (`hi-IN`), Punjabi (`pa-IN`)  
**Question Studio / Question Bank / tests / public routing:** disabled until separately released

---

## 1. Executive decision

Time, Speed & Distance will be one learner-facing chapter backed by two implementation packages:

```text
Time, Speed & Distance
├── TSD-001 — Core Motion and Relative Motion
│   ├── TSD-CP-001 — Uniform Motion, Units and Proportionality
│   ├── TSD-CP-002 — Segmented Journeys and Average-Speed Reconstruction
│   ├── TSD-CP-003 — Speed Changes, Schedules, Early-Late Arrival and Stops
│   ├── TSD-CP-004 — Straight-Line Relative Motion, Meeting and Pursuit
│   ├── TSD-CP-005 — Return, Turnaround, Repeated Linear Meetings and Post-Meeting Systems
│   └── TSD-CP-006 — Circular and Closed-Track Motion
└── TSD-002 — Applied Motion Systems
    ├── TSD-CP-007 — Train Crossing Fixed Objects, Platforms, Bridges and Tunnels
    ├── TSD-CP-008 — Train-Train Relative Motion and Station Systems
    ├── TSD-CP-009 — Motion in a Medium: Boats, Streams and One-Dimensional Wind
    ├── TSD-CP-010 — Races, Leads, Handicaps and Comparative Finishes
    ├── TSD-CP-011 — Escalators, Moving Walkways, Conveyors and Rotational Translation
    └── TSD-CP-012 — Variable, Periodic, Multi-Stage and Essential Motion Synthesis
```

The package split is only an implementation boundary. The learner sees one chapter and may filter by concept family.

A QL is a materially distinct learner task contract, not a wording template. A solve mode is a candidate mathematical authority, not a quota. Permanent QL and solve-mode counts remain open until executable discovery, gap audits, merge/split review, independent proof and explicit approval.

The companion inventory records **417 open solve-mode candidates** across the 12 CPs. This number is an exhaustive discovery baseline, not a promised implementation count. Discovery may merge equivalent candidates, split candidates whose hidden-state or answer contracts differ materially, add source-backed gaps, or reject inauthentic candidates.

---

## 2. Authority order

Where legacy TSD code or earlier notes disagree, authority is:

1. approved permanent CP allocation and freeze record;
2. this end-to-end chapter blueprint;
3. the exhaustive solve-mode inventory;
4. the runtime, QA, localisation and freeze contract;
5. future package-specific implementation records;
6. legacy Quant V2 types, motifs, audits and exports;
7. uploaded reference books and exploratory notes.

Legacy implementation is evidence, not automatic authority.

---

## 3. Source and legacy basis

The design was checked against:

- uploaded quantitative-aptitude notes containing core distance-speed-time, unit conversion, proportionality and average-speed examples;
- uploaded Arun Sharma TSD theory covering straight-line motion, relative motion, circular motion, trains, boats, clocks and races;
- uploaded SSC chapterwise and previous-year-style material containing circular-track meetings, variable segment speeds, trains, pursuits, stops and scheduled journeys;
- the repository's Quant V2 TSD family type, motif, reasoning graph, independent solver, admin adapter and large-audit outputs;
- mature Quant V4 chapter conventions from Time & Work and Number System;
- ExamTree's deterministic generation, independent verification, human-review and guarded publication workflow.

The Quant V2 inventory is broad and useful, but it mixed core aptitude TSD with clocks, sound/echo, unrestricted acceleration, vector drift and interception. This blueprint retains only families with correct ExamTree ownership.

### 3.1 Legacy disposition

**Migrate after redesign**

- uniform motion and proportionality;
- average-speed reconstruction;
- early/late arrival and stops;
- relative motion, meetings and pursuit;
- trains;
- boats and streams;
- races;
- circular tracks;
- escalators and moving walkways;
- discrete variable-speed schedules;
- wheel-to-linear translation.

**Shared authority, no duplicate learner QL**

- direct equal-distance/equal-time average-speed templates already owned by Average;
- circumference primitives from Mensuration;
- gcd/lcm helpers for closed tracks;
- percentage and ratio helpers.

**Reassign**

- clock-hand families to the Clocks chapter;
- compass-direction endpoint tasks to Reasoning Direction & Distance.

**Advanced hold**

- two-dimensional swimmer/river crossing;
- crosswind drift and aircraft headings;
- vector interception;
- polygon-side motion lacking recurring exam evidence.

**Reject from Quant TSD**

- sound/echo propagation;
- Doppler-like whistle questions;
- missile interception;
- projectile motion;
- free fall;
- unrestricted continuous-acceleration problems.

No legacy motif ID, QL ID, audit PASS or production export becomes a Quant V4 release claim.

---

## 4. Scope and ownership boundaries

### 4.1 Included

The chapter owns:

- exact distance-speed-time mapping and unit conversion;
- direct and inverse proportionality under constant distance, time or speed;
- pace and speed conversion;
- segmented journeys and total-distance/total-time average speed;
- round trips and hidden-segment reconstruction;
- speed changes, time saved/lost, early/late arrival, scheduled arrival and stoppages;
- first meeting, crossing, separation, pursuit, delayed starts and head starts on a line;
- post-meeting arrival, turnaround, shuttle and repeated linear meetings;
- laps, overtakes, modular position and repeated meetings on closed tracks;
- finite-length train crossing against points, platforms, bridges, tunnels, people and other trains;
- train departure, meeting and station systems;
- scalar boats/streams and one-dimensional tailwind/headwind;
- races, leads, handicaps and dead heats;
- escalators, moving walkways, conveyors and wheel translation;
- discrete variable-speed, periodic and multi-stage motion;
- tables, timelines, diagrams, statement sets, claims, data sufficiency and shared caselets after an ordinary authority is proven.

### 4.2 Excluded or delegated

The chapter does not own:

- pure arithmetic mean questions with no journey reconstruction;
- pure ratio or percentage questions where no motion consequence is tested;
- compass turns, bearings and endpoint direction;
- trigonometric river crossing, vector navigation and crosswind headings;
- clock hands and calendar reasoning;
- sound/echo, Doppler effect, projectile motion, free fall or force/acceleration physics;
- open-ended route optimisation requiring graph algorithms;
- large chart/table interpretation whose central skill is Data Interpretation;
- pure circumference/diameter questions without a motion target;
- real-world live schedules or legal transport claims;
- questions relying on an unstated convention about when a body has crossed an object.

### 4.3 Cross-chapter authority rules

| Boundary | TSD owns | Other chapter owns |
|---|---|---|
| Average | full journey reconstruction, hidden segments, route totals | direct equal-distance/equal-time average-speed learner templates |
| Percentage | effect of speed change on arrival/time/distance | pure percentage calculation |
| Ratio & Proportion | motion consequence and event state | pure ratio transformation |
| Time & Work | path motion and meeting/crossing | work completed by rates |
| Direction & Distance | scalar position/time on a declared line/track | turns, compass direction, endpoint direction |
| Mensuration | distance/time/revolutions after circumference is known | pure circumference, radius and area |
| Trigonometry | one-dimensional medium motion | angled river crossing, headings, vector drift |
| Number System | periodic motion context | abstract gcd/lcm |
| Clocks | none | clock-hand angle/coincidence |
| Physics | discrete aptitude motion only | sound, projectile, free fall, continuous acceleration |
| Data Interpretation | compact motion table/caselet after authority exists | large chart/table interpretation |

### 4.4 Semantic rules

1. Distance means path length unless displacement is explicitly requested.
2. Direction is signed only in one-dimensional models.
3. Average speed equals total path distance divided by total elapsed journey time.
4. Stopping time is included only when the stem explicitly makes it part of elapsed time.
5. Front reaches, engine passes, rear clears and complete crossing are distinct events.
6. A train is a finite-length body in CP-007 and CP-008.
7. Closed-track positions are interpreted modulo track length.
8. “Meet anywhere”, “meet at the start” and “distinct meeting points” are distinct tasks.
9. Medium speed is signed: downstream/tailwind adds; upstream/headwind subtracts.
10. Catch-up requires positive closing speed.
11. A synthesis QL requires at least two independently essential authorities.
12. Context and representation alone do not create a new QL.

---

## 5. Canonical exact model

```ts
interface Rational {
  numerator: bigint;
  denominator: bigint;
}

type DistanceUnit = "MM" | "CM" | "M" | "KM" | "STEP" | "LAP" | "CUSTOM";
type TimeUnit = "SECOND" | "MINUTE" | "HOUR" | "DAY";
type Direction1D = -1 | 1;
type TrackKind = "LINE" | "CLOSED_LOOP";

type BodyKind =
  | "POINT_BODY"
  | "TRAIN"
  | "BOAT"
  | "AIRCRAFT"
  | "RUNNER"
  | "ESCALATOR"
  | "WALKWAY"
  | "CONVEYOR"
  | "WHEEL"
  | "GENERIC";

interface MotionBody {
  bodyId: string;
  bodyKind: BodyKind;
  length?: Rational;
  intrinsicSpeed: Rational;
  direction: Direction1D;
  startPosition: Rational;
  startTime: Rational;
  localeLabelKey: string;
}

interface MotionSegment {
  bodyId: string;
  startTime: Rational;
  duration: Rational;
  intrinsicSpeed: Rational;
  direction: Direction1D;
  mediumSpeed?: Rational;
  stopDurationAfter?: Rational;
  routeSegmentId?: string;
}

interface MotionEvent {
  eventKind:
    | "START"
    | "FRONT_REACHES"
    | "REAR_CLEARS"
    | "MEET"
    | "CATCH"
    | "OVERTAKE_COMPLETE"
    | "REACH_ENDPOINT"
    | "TURNAROUND"
    | "STOP"
    | "RESUME";
  time: Rational;
  bodyIds: string[];
  position?: Rational;
}

interface MotionState {
  trackKind: TrackKind;
  trackLength?: Rational;
  bodies: MotionBody[];
  segments: MotionSegment[];
  events: MotionEvent[];
}
```

All canonical mathematics uses reduced rational arithmetic or safe integers. Floating point is presentation-only after exact validation.

Required primitives:

```text
rational arithmetic and comparison
distance/time/speed/pace conversion
signed one-dimensional velocity
exact linear-equation solving
bounded quadratic solving only when source-backed
total path and elapsed-time calculation
piecewise event simulation
first contact/catch/clear event solving
closed-track modulo normalisation
gcd/lcm periodic-return helper
train occupancy interval
scalar medium-relative speed
bounded exact enumeration
fraction/mixed-number/decimal/ratio/clock-time formatting
```

Core invariants:

```text
distance = speed × time
average speed = total distance ÷ total elapsed time
opposite closing speed = speed1 + speed2
same-direction closing speed = |speed1 - speed2|
event time = effective gap ÷ positive closing speed
closed-track position = (start + signed speed × time) mod track length
train crossing time = effective length ÷ relative speed
ground speed in medium = intrinsic speed + signed medium speed
ground speed on moving surface = person speed relative surface + surface speed
wheel distance = revolutions × circumference
```

---

## 6. Final checkpoint ownership

| CP | Package | Governing authority | Does not own |
|---|---|---|---|
| TSD-CP-001 | TSD-001 | one uniform body; exact distance-speed-time and units | segmented averages, meetings, schedules |
| TSD-CP-002 | TSD-001 | total-distance/total-time journey reconstruction | direct Average-owned duplicate QLs, stops |
| TSD-CP-003 | TSD-001 | speed/departure/stop change creates arrival gain/loss | another moving body as essential actor |
| TSD-CP-004 | TSD-001 | first meeting, separation, crossing or catch-up on a line | train lengths, repeated endpoint turnarounds |
| TSD-CP-005 | TSD-001 | motion continues after first meeting or endpoint reversal | closed-loop modular motion |
| TSD-CP-006 | TSD-001 | closed-track modular position, laps and repeated meetings | straight race leads |
| TSD-CP-007 | TSD-002 | finite train crosses fixed point/length object | moving observer or second train |
| TSD-CP-008 | TSD-002 | train interacts with moving body/train/station system | single fixed-object crossing |
| TSD-CP-009 | TSD-002 | signed scalar speed relative to moving medium | 2D vector/trigonometric crossing |
| TSD-CP-010 | TSD-002 | declared race distance, lead, handicap or dead heat | general circular meeting |
| TSD-CP-011 | TSD-002 | moving surface or rotational-to-linear translation | gear/pulley dynamics, pure geometry |
| TSD-CP-012 | TSD-002 | explicit variable/periodic rate or essential multi-engine synthesis | decorative hybrid, unrestricted acceleration |

Detailed candidate authorities are recorded in `TSD-EXHAUSTIVE-SOLVE-MODE-DISCOVERY-INVENTORY.md`.

---

## 7. Universal discovery matrix

Every CP must test all relevant cells before counts freeze.

### Target direction

```text
direct distance / speed / time
reverse missing input
ratio or percentage consequence
unknown segment
unknown start delay or stop
unknown length or track size
unknown medium/surface speed
least or greatest feasible value
count of valid states
complete valid set
possible / impossible / indeterminate
claim verification
statement combination
data sufficiency
shared-caselet sibling
```

### Motion topology

```text
one body, one segment
one body, multiple segments
two bodies, one event
two bodies, multiple events
three or more bodies
finite-length body
open line
bounded line with endpoints
closed loop
moving medium
moving surface
periodic schedule
piecewise rate
mixed-engine synthesis
```

### Timing topology

```text
simultaneous starts
staggered starts
clock-time departure/arrival
one stop
multiple regular stops
rest after distance
rest after time
turnaround at endpoint
speed change at time
speed change at distance
event inside final partial interval
exact boundary event
```

### Edge states

```text
zero separation
equal same-direction speeds
zero closing speed
impossible catch-up
meeting exactly at endpoint/start
cycle remainder zero
one full lap but zero net position
one/many/no inverse solutions
train length equals object length
front reaches versus rear clears
upstream speed zero or negative
surface speed cancels walking speed
final event during stop
mixed units
fractional seconds/minutes/hours
integral/fractional/decimal answers
rounding boundary
terminal partial cycle
```

### Representation

```text
plain prose
timeline
number line
route strip
distance-time table
speed-time table
train crossing diagram
station map
closed-track diagram
race finish strip
boat/stream signed-speed diagram
escalator/walkway diagram
statement set
claim verification
data sufficiency
mini caselet
diagram-plus-text hybrid
```

A representation is a new QL only when it changes evidence topology, learner inference or answer contract.

---

## 8. QL merge and split rules

Merge when candidates share:

- canonical hidden state;
- requested semantic;
- governing invariant;
- solver path;
- misconception map;
- answer kind;
- interchangeable contexts.

Split when at least one materially differs:

- direct versus inverse;
- first contact versus complete crossing;
- point body versus finite-length body;
- open line versus closed track;
- first meeting versus post-meeting reconstruction;
- unique value versus count/set/classification;
- running time versus elapsed time including stops;
- scalar medium motion versus ordinary ground motion;
- single-engine versus genuinely essential synthesis;
- answer kind/unit or required representation.

Wording, names, vehicle labels, cities and superficial number shape never justify a split.

---

## 9. Dependency-aware implementation order

```text
Foundation
1. shared exact motion/unit/event library
2. TSD-CP-001
3. TSD-CP-002
4. TSD-CP-003

Relative-motion lane
5. TSD-CP-004
6. TSD-CP-005
7. TSD-CP-006

Applied systems
8. TSD-CP-007
9. TSD-CP-008
10. TSD-CP-009
11. TSD-CP-010
12. TSD-CP-011

Synthesis and closure
13. TSD-CP-012
14. chapter-wide source and semantic gap audit
15. chapter-wide duplicate/collision audit
16. English manual freeze
17. Hindi/Punjabi localisation and parity proof
18. multilingual manual freeze
19. guarded Question Studio integration
```

CP-001 and CP-007 may run in parallel only after the shared unit/event foundation is stable. CP-004 and CP-009 may run in parallel after CP-001. CP-012 begins only after every authority it composes is frozen.

---

## 10. Design-completion authority

This design is complete because package and CP architecture, ownership, exclusions, canonical state, event semantics, discovery dimensions, exact-engine requirements, legacy disposition, implementation order and publication safety are defined.

It does not mean permanent counts are known.

Current truth:

```text
Permanent TSD QLs: 0
Frozen TSD CPs: 0
Frozen TSD solve modes: 0
Open discovery candidates: 417
Question Studio exposure: disabled
Question Bank storage: disabled
Test eligibility: disabled
Public publication: disabled
```

The next implementation step is the shared exact motion/unit/event foundation followed by `TSD-CP-001` executable discovery. No permanent QL count may be proposed before source, inverse, edge, representation and merge/split audits pass.
