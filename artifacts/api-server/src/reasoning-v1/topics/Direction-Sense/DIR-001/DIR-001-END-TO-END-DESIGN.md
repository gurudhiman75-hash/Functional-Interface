# ExamTree Reasoning V1 — Direction and Distance End-to-End Design

**Student-facing chapter:** Direction and Distance  
**Product code:** `REAS-DIR`  
**Runtime package:** `DIR-001`  
**Package title:** Direction and Distance — Orientation, Paths and Relative Position  
**Taxonomy:** Reasoning → Relational and Positional Reasoning → Direction and Distance  
**Target examinations:** SSC, Banking, Railways, Punjab state examinations and comparable objective examinations  
**Primary locales:** English (`en-IN`), Hindi (`hi-IN`) and Punjabi (`pa-IN`)  
**Locale mode:** `TRANSLATABLE`  
**Primary renderers:** `TEXT`, `STRUCTURED_TEXT`, `DIRECTION_DIAGRAM`  
**Final planned QLs:** `240`  
**Checkpoint count:** `8`  
**Stable QL range:** `DIR-QL-001` through `DIR-QL-240`  
**Document status:** Audited chapter design and implementation manifest; no runtime implementation is claimed by this document  

---

# 1. Governing decision

Direction and Distance will be implemented as one student-facing chapter and one runtime package:

```text
DIR-001
```

The chapter must not be reduced to arithmetic templates. Its authoritative hidden state is geometric and relational:

```text
initial orientation
+ ordered turns
+ ordered movement vectors
+ entity positions
+ reference frame
= final orientation and spatial state
```

Every instance will be constructed from a valid hidden state, independently solved from structured operations, checked for referential and answer ambiguity, and only then rendered into natural examination language.

The chapter owns standard competitive-exam direction sense involving:

- the four cardinal directions;
- the four primary intercardinal directions;
- clockwise and anticlockwise rotation;
- left, right and about turns;
- ordered movement paths;
- final facing direction;
- endpoint direction from a reference point;
- total distance and displacement;
- shortest return distance and direction;
- relative-position chains;
- two-mover and multi-entity comparisons;
- coded direction relations;
- morning/evening sun and shadow orientation;
- advanced inverse and shared-caselet forms.

---

# 2. Source and architecture alignment

This design is governed by:

```text
REASONING-V1-MASTER-BLUEPRINT.md
REASONING-V1-ARCHITECTURE.md
```

It follows the Reasoning V1 requirements that:

1. Direction and Distance belongs to the relational and positional family.
2. The chapter requires a coordinate and direction engine.
3. A path is constructed first and the answer is derived from coordinates and orientation.
4. Every generated question has an independent solver.
5. Distractors represent likely mistakes and carry machine-readable error labels.
6. Direction paths are language-neutral and therefore suitable for `TRANSLATABLE` localization.
7. Question Studio receives structured rule, solver, renderer, difficulty and audit metadata.

Reference-book review confirms the recurring examination families:

```text
rotation and facing
movement and displacement
relative face or final orientation
relative position among points or people
sun and shadow
coded directions
multi-step mixed paths
```

The checkpoint partition below refines those book-level categories into implementation and QA boundaries.

---

# 3. Chapter learning and assessment model

The chapter tests whether the learner can maintain a stable reference frame while transforming orientation and position.

## 3.1 Orientation state

The learner must distinguish:

```text
where an entity is located
where an entity is facing
where an entity moves next
which point is used as the reference
```

These are separate concepts and must remain separate in the runtime metadata.

## 3.2 Rotation state

The learner must correctly interpret:

```text
left turn       = anticlockwise relative rotation
right turn      = clockwise relative rotation
about turn      = 180-degree rotation
absolute turn   = a stated clockwise or anticlockwise angle
```

All standard V1 rotations are multiples of `45°`.

## 3.3 Coordinate state

For movement and relative position, the learner must combine signed horizontal and vertical components:

```text
East  -> positive x
West  -> negative x
North -> positive y
South -> negative y
```

## 3.4 Distance state

The learner must distinguish:

```text
total distance travelled
shortest distance between two positions
horizontal displacement
vertical displacement
resultant displacement
```

## 3.5 Reference reversal

The learner must correctly answer both:

```text
Where is A with respect to B?
Where is B with respect to A?
```

These have opposite answers unless both positions coincide.

---

# 4. Scope boundaries

## 4.1 Included in `DIR-001`

```text
8-direction compass orientation
turns in multiples of 45 degrees
left/right/about-turn sequences
single-person paths
final facing and final-leg direction
endpoint direction from starting point
axis-aligned and Pythagorean displacement
shortest return path
unknown path segment with a unique solution
relative-position chains
point, house, village, office and person layouts
two-mover endpoint comparison
coded direction operators and symbols
morning/evening sun-shadow questions
text, structured-text and direction-diagram presentation
shared-stimulus direction caselets
inverse reconstruction with a unique result
```

## 4.2 Excluded from `DIR-001`

The following belong elsewhere or require a future extension:

```text
clock-hand orientation as a Clock chapter skill
calendar reasoning
map scale and cartographic ratio
latitude, longitude and GPS navigation
real-road route optimization
speed-time-distance meeting calculations
train, boat and race arithmetic
bearings expressed as arbitrary survey angles
three-dimensional navigation
seating arrangement
floor or flat arrangement
data-sufficiency option logic
large logic puzzles
arbitrary 60-degree or polygon-path geometry
non-verbal figure rotation unrelated to a compass path
```

A vehicle, boat or runner may appear as a movement context, but speed, time and relative-speed arithmetic must not become the assessed skill.

## 4.3 Boundary with Data Sufficiency

A question asking whether statements are sufficient belongs to `REAS-DSF`, even when its underlying facts concern directions.

## 4.4 Boundary with Clock

A clock may not be used as a disguised direction engine in `DIR-001`. Questions about hour-hand or minute-hand orientation belong to the Clock chapter.

## 4.5 Boundary with Puzzles and Arrangement

A compact relation chain belongs here when the only hidden state is spatial position. Once several non-spatial attributes or general constraint solving are required, ownership moves to Puzzle or Arrangement.

---

# 5. Package location and repository layout

Canonical package root:

```text
artifacts/api-server/src/reasoning-v1/topics/Direction-Sense/DIR-001/
```

Planned package layout:

```text
DIR-001/
  DIR-001-END-TO-END-DESIGN.md
  DIR-001-CHAPTER-MANIFEST.ts
  chapter-registry.ts
  runtime.ts
  index.ts

  foundation/
    types.ts
    fractions.ts
    directions.ts
    turns.ts
    coordinates.ts
    exact-distance.ts
    path-state.ts
    path-builder.ts
    entity-position-graph.ts
    coded-direction.ts
    sun-shadow.ts
    answer-classifier.ts
    option-validator.ts
    ambiguity-validator.ts
    render-spec.ts
    fingerprint.ts
    foundation.test.ts

  localization/
    types.ts
    runtime.ts
    direction-lexicon.en.ts
    direction-lexicon.hi.ts
    direction-lexicon.pa.ts
    movement-phrases.en.ts
    movement-phrases.hi.ts
    movement-phrases.pa.ts
    explanation-phrases.en.ts
    explanation-phrases.hi.ts
    explanation-phrases.pa.ts
    entity-lexicon.ts
    localization-parity.test.ts

  DIR-CP-001/
  DIR-CP-002/
  DIR-CP-003/
  DIR-CP-004/
  DIR-CP-005/
  DIR-CP-006/
  DIR-CP-007/
  DIR-CP-008/

  dir-001-chapter.test.ts
  dir-001-localized.test.ts
  dir-001-duplicate-audit.test.ts
  dir-001-diversity-audit.test.ts
  dir-001-review-export.ts
  dir-001-localized-review-export.ts
```

Each checkpoint should own equivalent responsibilities to:

```text
question-language.en.ts
rule-definitions.ts
task-registry.ts
generator.ts
independent-solver.ts
ambiguity-checker.ts
option-validator.ts
localized-runtime.ts
checkpoint tests
review-export scripts
implementation plan and report
```

Shared foundation code must contain only genuinely chapter-wide behavior. CP-specific generation policy remains within the owning checkpoint.

---

# 6. Final checkpoint and QL allocation

| Checkpoint | QL range | Count | Primary ownership |
|---|---:|---:|---|
| `DIR-CP-001` | `DIR-QL-001`–`032` | 32 | Compass orientation, rotation and facing |
| `DIR-CP-002` | `DIR-QL-033`–`072` | 40 | Single-path endpoint and final facing |
| `DIR-CP-003` | `DIR-QL-073`–`112` | 40 | Distance, displacement and shortest return |
| `DIR-CP-004` | `DIR-QL-113`–`148` | 36 | Relative-position graphs and point relations |
| `DIR-CP-005` | `DIR-QL-149`–`176` | 28 | Multiple movers and endpoint comparison |
| `DIR-CP-006` | `DIR-QL-177`–`200` | 24 | Coded direction language |
| `DIR-CP-007` | `DIR-QL-201`–`216` | 16 | Sun, shadow and environmental orientation |
| `DIR-CP-008` | `DIR-QL-217`–`240` | 24 | Advanced mixed, inverse and caselet synthesis |
| **Total** | `DIR-QL-001`–`240` | **240** | Complete chapter |

These ranges are permanent once implementation begins. A checkpoint may not consume IDs reserved for another checkpoint.

The QL count is a production allocation, not a target that justifies near-duplicates. A QL is valid only when it adds a material difference in at least one of:

```text
hidden-state topology
answer demand
solve direction
presentation mode
renderer requirement
misconception profile
inverse/reconstruction burden
caselet role
localization requirement
```

Changing only a name, place, unit or surface context does not justify a separate QL.

---

# 7. `DIR-CP-001` — Compass Orientation, Rotation and Facing

## 7.1 Purpose

Own questions in which orientation changes are sufficient to answer the question and coordinate movement is absent or incidental.

## 7.2 Stable QL blocks

| QL range | Count | Ownership |
|---|---:|---|
| `001`–`004` | 4 | One stated rotation from a known direction |
| `005`–`008` | 4 | Sequential left/right turns on cardinal directions |
| `009`–`012` | 4 | Sequential 45-degree turns on eight directions |
| `013`–`016` | 4 | Mixed clockwise/anticlockwise angle sequences |
| `017`–`020` | 4 | About-turn and reversal sequences |
| `021`–`024` | 4 | Transformed or relabelled compass frame |
| `025`–`028` | 4 | Reconstruct the initial facing direction |
| `029`–`032` | 4 | Find a missing turn, angle or turn direction |

## 7.3 Named solve modes

```text
rotateFacingBySingleTurn
rotateFacingByMultipleTurns
resolveRelativeLeftRightSequence
resolveAbsoluteAngleSequence
resolveAboutTurnSequence
transformCompassReferenceFrame
reconstructInitialFacing
reconstructMissingTurn
```

## 7.4 Rules

```text
DIR_ROTATE_SINGLE
DIR_ROTATE_SEQUENCE
DIR_LEFT_RIGHT_SEQUENCE
DIR_ABOUT_TURN
DIR_FRAME_TRANSFORM
DIR_INITIAL_FACING_INVERSE
DIR_MISSING_TURN_INVERSE
```

## 7.5 Invariants

```text
initial orientation is explicit or uniquely inferable
all turns are multiples of 45 degrees
left/right is interpreted relative to current facing
rotation sum is normalized modulo 360 degrees
missing-turn questions have exactly one eligible answer
frame transformation is applied consistently to all compass labels
```

## 7.6 Primary distractors

```text
clockwise and anticlockwise reversed
left and right reversed
one turn omitted
about turn treated as 90 degrees
net angle magnitude calculated incorrectly
initial direction ignored
compass frame transformed in the wrong direction
```

---

# 8. `DIR-CP-002` — Single-Path Endpoint and Final Facing

## 8.1 Purpose

Own one-entity movement paths where the main answer is final facing, final-leg direction, endpoint direction, return direction or path closure.

## 8.2 Stable QL blocks

| QL range | Count | Ownership |
|---|---:|---|
| `033`–`036` | 4 | Final facing after a short path |
| `037`–`040` | 4 | Direction of the final movement segment |
| `041`–`046` | 6 | Endpoint direction after cardinal movements |
| `047`–`052` | 6 | Endpoint direction with diagonal movements |
| `053`–`058` | 6 | Direction required to return to start |
| `059`–`064` | 6 | Closed path, cancellation and starting-point recognition |
| `065`–`068` | 4 | Required final move to reach a stated relative position |
| `069`–`072` | 4 | Mixed absolute and relative movement wording |

## 8.3 Named solve modes

```text
finalFacingAfterPath
finalMovementDirection
endpointDirectionFromStart
endpointDirectionWithDiagonalLegs
returnDirectionToStart
recognizeClosedPath
inferRequiredFinalMove
resolveMixedAbsoluteRelativePath
```

## 8.4 Invariants

```text
movement order is explicit
turns are applied before the movement that follows them
final facing and endpoint direction are stored separately
zero displacement appears only when the answer format permits STARTING_POINT
return direction is the opposite of the final displacement vector
pronouns have one clear antecedent
```

## 8.5 Editorial policy

The stem must not reveal the solution method through classroom phrasing such as:

```text
Draw the path on coordinate axes.
Use the direction formula.
Apply the left-right rule.
```

The wording should resemble an actual exam question.

---

# 9. `DIR-CP-003` — Distance, Displacement and Shortest Return

## 9.1 Purpose

Own questions where a numeric distance or a direction-distance pair is the main answer.

## 9.2 Stable QL blocks

| QL range | Count | Ownership |
|---|---:|---|
| `073`–`078` | 6 | Axis-aligned net displacement |
| `079`–`086` | 8 | Exact Pythagorean displacement |
| `087`–`092` | 6 | Combined direction and distance answer |
| `093`–`098` | 6 | Shortest return distance and direction |
| `099`–`102` | 4 | Total distance versus displacement |
| `103`–`106` | 4 | Unknown orthogonal movement segment |
| `107`–`110` | 4 | Controlled radical or decimal displacement |
| `111`–`112` | 2 | Missing distance required to reach or return |

## 9.3 Named solve modes

```text
axisAlignedDisplacement
exactPythagoreanDisplacement
directionAndDisplacement
shortestReturnDistance
shortestReturnDirectionAndDistance
compareTravelDistanceAndDisplacement
solveUnknownOrthogonalSegment
controlledApproximateDisplacement
solveMissingDistanceForTarget
```

## 9.4 Numeric generation policy

Easy and Medium questions should normally use:

```text
axis cancellation
3-4-5 families
5-12-13 families
7-24-25 families
8-15-17 families
9-40-41 families
other reviewed Pythagorean triples and bounded multiples
```

Hard questions may use a controlled irrational displacement only when:

```text
the answer format explicitly permits a radical or approximation
the required decimal precision is stated
the exact internal value is preserved until display
all options follow the same display policy
```

## 9.5 Diagonal movement policy

Direction-only questions may use all eight movement directions.

Numeric-distance questions should default to cardinal movement segments. A physical movement stated as `d` units toward a diagonal direction has horizontal and vertical components of `d/sqrt(2)` and must never be treated as `(d, d)` merely for implementation convenience.

A numeric-distance QL may use diagonal movement only when:

```text
the exact-vector engine represents it correctly
or diagonal components cancel by construction
or the task asks only for final direction/facing rather than distance
```

## 9.6 Invariants

```text
total distance equals the sum of segment lengths
displacement derives from final minus reference coordinate
Pythagoras is applied to net horizontal and vertical components
unit remains consistent unless conversion is explicitly owned
unknown segment has one positive feasible solution
rounding occurs only at final display
```

---

# 10. `DIR-CP-004` — Relative-Position Graphs and Point Relations

## 10.1 Purpose

Own static spatial-relation questions involving people, houses, towns, offices, points or other labelled entities.

## 10.2 Stable QL blocks

| QL range | Count | Ownership |
|---|---:|---|
| `113`–`118` | 6 | Direct pair relation |
| `119`–`126` | 8 | Chained relations among three or four entities |
| `127`–`132` | 6 | Reversed-reference query |
| `133`–`138` | 6 | Relative direction and distance |
| `139`–`142` | 4 | Collinearity, order and same-axis relation |
| `143`–`146` | 4 | Identify the entity at a requested position |
| `147`–`148` | 2 | Compact diagram-based relation |

## 10.3 Named solve modes

```text
directRelativeDirection
chainedRelativeDirection
reverseReferenceRelation
relativeDirectionAndDistance
identifyCollinearEntities
resolveSameAxisOrder
identifyEntityAtDirection
resolveDiagramRelativePosition
```

## 10.4 Entity-position graph

The checkpoint builds a graph whose directed edges represent spatial vectors:

```text
A is north of B  -> position(A) = position(B) + NORTH_VECTOR
A is west of B   -> position(A) = position(B) + WEST_VECTOR
```

The graph must:

```text
reject contradictory cycles
reject disconnected query entities
preserve reference direction
allow coordinate normalization without altering relations
identify coincident entities only when intentionally permitted
```

## 10.5 Ambiguity policy

Reject a candidate when:

```text
two entities satisfy the requested location
relative distance is missing where it is needed for a unique layout
one phrase permits both adjacency and general direction interpretations
a query reverses grammatical reference unexpectedly
a diagram and text imply different coordinates
```

---

# 11. `DIR-CP-005` — Multiple Movers and Endpoint Comparison

## 11.1 Purpose

Own questions requiring two or more movement states to be solved and compared.

## 11.2 Stable QL blocks

| QL range | Count | Ownership |
|---|---:|---|
| `149`–`154` | 6 | Two movers from the same origin |
| `155`–`160` | 6 | Two movers from different known origins |
| `161`–`166` | 6 | Final separation distance |
| `167`–`172` | 6 | Final relative direction |
| `173`–`176` | 4 | Meeting, coincidence and endpoint comparison |

## 11.3 Named solve modes

```text
twoMoversSameOrigin
twoMoversDifferentOrigins
finalSeparationDistance
finalRelativeDirection
compareEndpointCoordinates
recognizeMeetingOrCoincidence
```

## 11.4 Invariants

```text
each mover has an independent ordered path
starting separation is represented explicitly
one mover's turns do not alter another mover's orientation
final comparison uses endpoint coordinates, not path length
meeting means coordinate equality at the stated comparison time or stage
speed/time arithmetic is not introduced
```

## 11.5 Main risks

```text
ignoring the second path
ignoring starting separation
comparing total distances rather than endpoints
using A relative to B when B relative to A is asked
assuming paths occur in a shared facing frame when they do not
```

---

# 12. `DIR-CP-006` — Coded Direction Language

## 12.1 Purpose

Own symbol, operator or token systems whose meanings are spatial directions or position relations.

## 12.2 Stable QL blocks

| QL range | Count | Ownership |
|---|---:|---|
| `177`–`182` | 6 | Evaluate a relation using a stated code map |
| `183`–`188` | 6 | Chained coded relations |
| `189`–`194` | 6 | Recover a direction-code mapping from evidence |
| `195`–`198` | 4 | Select equivalent coded statement or valid conclusion |
| `199`–`200` | 2 | Coded movement path endpoint |

## 12.3 Named solve modes

```text
decodeFixedDirectionMap
evaluateCodedRelationChain
recoverDirectionCodeMapping
selectEquivalentCodedStatement
validateCodedConclusion
resolveCodedMovementPath
```

## 12.4 Code-map generation model

```text
construct a one-to-one mapping
-> generate sufficient evidence
-> verify mapping uniqueness
-> generate target statement
-> independently decode
-> reject if a second mapping remains possible
```

## 12.5 Invariants

```text
all active codes are visually distinguishable
mapping is one-to-one within the question
recovery evidence uniquely identifies every required code
symbol direction is not changed between premises
token order has one documented grammar
student-facing text does not expose internal mapping IDs
```

## 12.6 Exclusion

General coding-decoding operations that do not encode spatial relations belong to the Coding-Decoding chapter.

---

# 13. `DIR-CP-007` — Sun, Shadow and Environmental Orientation

## 13.1 Purpose

Own standard examination questions that infer direction from sunrise, sunset and shadow position.

## 13.2 Stable QL blocks

| QL range | Count | Ownership |
|---|---:|---|
| `201`–`204` | 4 | Morning sun and shadow |
| `205`–`208` | 4 | Evening sun and shadow |
| `209`–`212` | 4 | Shadow on left, right, front or back |
| `213`–`216` | 4 | Mutual or compound shadow relationships |

## 13.3 Named solve modes

```text
morningShadowFacing
eveningShadowFacing
walkingDirectionFromShadowSide
facingFromFrontBackShadow
mutualFacingFromShadow
compoundSunTurnSequence
```

## 13.4 Authoritative assumptions

The stem must explicitly establish the conventional setting:

```text
morning -> sun in the east -> shadow toward west
evening -> sun in the west -> shadow toward east
```

The runtime must not infer morning or evening from an unspecified clock time unless the QL explicitly owns and validates that interpretation.

## 13.5 Invariants

```text
time period is explicit
sun direction is unambiguous
left/right is relative to a known facing direction
shadow direction is opposite the sun
compound questions preserve each person's frame
```

## 13.6 Rejection rules

Reject:

```text
midday shadow questions
season-dependent or latitude-dependent sun paths
ambiguous phrases such as early or late without a fixed convention
questions requiring scientific shadow length
```

---

# 14. `DIR-CP-008` — Advanced Mixed, Inverse and Caselet Synthesis

## 14.1 Purpose

Own advanced questions that combine previously implemented foundations without becoming a general puzzle or Data Sufficiency task.

## 14.2 Stable QL blocks

| QL range | Count | Ownership |
|---|---:|---|
| `217`–`222` | 6 | Long single-person mixed paths |
| `223`–`226` | 4 | Missing movement segment |
| `227`–`230` | 4 | Missing turn or initial-facing reconstruction |
| `231`–`234` | 4 | Relative-position graph combined with movement |
| `235`–`238` | 4 | Shared-stimulus path caselets |
| `239`–`240` | 2 | Diagram-text hybrid synthesis |

## 14.3 Named solve modes

```text
longPathSynthesis
inverseMissingMovement
inverseMissingTurn
inverseInitialFacingFromEndpoint
mixedGraphAndMovement
sharedPathCaselet
diagramTextHybridSynthesis
```

## 14.4 Caselet policy

A caselet may share one hidden path or position graph across several questions, but each generated item must retain:

```text
its own QL ID
its own answer demand
its own four validated options
its own explanation trace
its own deterministic seed metadata
```

Question Studio may group related generated items through a `caseletId`, but mock assembly must be able to use them independently only when the stem remains self-contained.

## 14.5 Complexity ceiling

A candidate belongs outside `DIR-001` when solving it requires:

```text
a general constraint search
several non-spatial attributes
speed-time synchronization
probability or counting
statement-sufficiency option logic
```

---

# 15. Core direction and coordinate model

## 15.1 Direction enum

```ts
type CompassDirection =
  | "N"
  | "NE"
  | "E"
  | "SE"
  | "S"
  | "SW"
  | "W"
  | "NW";
```

Canonical clockwise indexing:

```text
N  = 0
NE = 1
E  = 2
SE = 3
S  = 4
SW = 5
W  = 6
NW = 7
```

One index step equals `45°` clockwise.

## 15.2 Direction vectors

For relational-grid and sign-classification purposes:

```text
N  -> ( 0,  1)
NE -> ( 1,  1)
E  -> ( 1,  0)
SE -> ( 1, -1)
S  -> ( 0, -1)
SW -> (-1, -1)
W  -> (-1,  0)
NW -> (-1,  1)
```

These sign vectors classify direction. They must not automatically be treated as physical unit vectors for diagonal distance.

## 15.3 Rotation

```ts
interface TurnOperation {
  kind: "LEFT" | "RIGHT" | "ABOUT" | "CLOCKWISE" | "ANTICLOCKWISE";
  degrees: 45 | 90 | 135 | 180 | 225 | 270 | 315;
}
```

`LEFT`, `RIGHT` and `ABOUT` may use normalized degrees internally, but their student wording remains natural.

## 15.4 Coordinate convention

```ts
interface Rational {
  numerator: bigint;
  denominator: bigint;
}

interface Coordinate2D {
  x: Rational;
  y: Rational;
}
```

Cardinal physical movement uses exact rational coordinates.

If diagonal physical movement is enabled, use a reviewed exact algebraic representation rather than floating-point accumulation. A suitable extension is:

```ts
interface Surd2Scalar {
  rational: Rational;
  sqrt2: Rational;
}
```

The foundation implementation may initially restrict numeric-distance tasks to cardinal legs while still supporting all eight directions for orientation and relative-position tasks.

## 15.5 Path state

```ts
interface DirectionPathState {
  start: Coordinate2D;
  initialFacing: CompassDirection;
  operations: readonly DirectionOperation[];
  points: readonly PathPoint[];
  finalPosition: Coordinate2D;
  finalFacing: CompassDirection;
  totalDistance?: ExactDistance;
  displacement?: ExactDistance;
}

type DirectionOperation =
  | { kind: "TURN"; turn: TurnOperation }
  | {
      kind: "MOVE";
      directionMode: "CURRENT_FACING" | "ABSOLUTE";
      direction?: CompassDirection;
      distance: ExactDistance;
    };
```

## 15.6 Static entity graph

```ts
interface SpatialRelationEdge {
  fromEntityId: string;
  toEntityId: string;
  direction: CompassDirection;
  distance?: ExactDistance;
}

interface EntityPositionGraph {
  entities: readonly SpatialEntity[];
  relations: readonly SpatialRelationEdge[];
}
```

## 15.7 Distance representation

```ts
type ExactDistance =
  | { kind: "INTEGER"; value: bigint }
  | { kind: "RATIONAL"; value: Rational }
  | { kind: "RADICAL"; radicand: bigint; coefficient: Rational };
```

Display metadata must separately record:

```text
unit
exact answer
rendered answer
rounding mode
number of decimal places
```

---

# 16. Standard QL contract

```ts
interface Dir001QuestionLogic {
  qlId: `DIR-QL-${string}`;
  checkpointId: `DIR-CP-${string}`;
  ruleId: string;
  taskKind: Dir001TaskKind;
  solveMode: Dir001SolveMode;
  presentationMode: Dir001PresentationMode;
  answerType: Dir001AnswerType;
  renderer: "TEXT" | "STRUCTURED_TEXT" | "DIRECTION_DIAGRAM";
  localeMode: "TRANSLATABLE";
  difficultyProfile: Dir001DifficultyProfile;
  explanationStrategyId: string;
  distractorStrategyIds: readonly string[];
  requiredStateFeatures: readonly string[];
  allowedUnits: readonly Dir001Unit[];
  status: "DRAFT" | "IMPLEMENTED" | "REVIEWED" | "FROZEN";
}
```

A QL describes an exam pattern, not one sentence shell.

## 16.1 Task kinds

```text
ORIENTATION_ROTATION
PATH_FACING
PATH_ENDPOINT_DIRECTION
PATH_DISTANCE
RETURN_PATH
RELATIVE_POSITION
MULTI_MOVER
CODED_DIRECTION
SUN_SHADOW
INVERSE_RECONSTRUCTION
CASELET_SYNTHESIS
```

## 16.2 Answer types

```ts
type Dir001AnswerType =
  | "DIRECTION"
  | "FACING_DIRECTION"
  | "DISTANCE"
  | "DIRECTION_AND_DISTANCE"
  | "TURN"
  | "TURN_ANGLE"
  | "ENTITY"
  | "POINT"
  | "STARTING_POINT";
```

`STARTING_POINT` should normally be one value within a direction-like answer family rather than a fifth option.

## 16.3 Presentation modes

```text
DIRECT_TEXT_PATH
TURN_SEQUENCE
ABSOLUTE_DIRECTION_PATH
RELATIVE_TURN_PATH
RELATIVE_POSITION_STATEMENTS
CODE_TABLE_AND_STATEMENT
SHARED_STIMULUS
POINT_DIAGRAM
PATH_DIAGRAM
TEXT_WITH_EXPLANATION_DIAGRAM
```

---

# 17. Runtime output contract

```ts
interface GeneratedDir001Question {
  packageId: "DIR-001";
  qlId: string;
  checkpointId: string;
  ruleId: string;
  seed: number | string;
  locale: "en-IN" | "hi-IN" | "pa-IN";
  difficulty: "EASY" | "MEDIUM" | "HARD";
  renderer: string;
  stem: string;
  structuredPrompt: Dir001StructuredPrompt;
  questionDiagram?: DirectionDiagramSpec;
  options: readonly GeneratedDirectionOption[];
  correctIndex: number;
  explanation: Dir001ExplanationTrace;
  explanationDiagram?: DirectionDiagramSpec;
  metadata: Dir001GenerationMetadata;
}
```

Required contracts:

```text
exactly four options
four unique normalized option values
exactly one correct answer
deterministic output for QL + locale + seed + runtime version
no unresolved placeholders
no internal IDs in student-facing text
solver agreement
renderer-data validity
question-specific explanation
```

---

# 18. Generation pipeline

The authoritative pipeline is:

```text
QL lookup
-> initialize deterministic PRNG
-> construct valid hidden orientation/path/graph state
-> derive structured question operations
-> independently solve structured state
-> run referential and degeneracy ambiguity checks
-> generate misconception-driven distractors
-> validate each option independently
-> deterministically shuffle options
-> render question or diagram
-> build question-specific explanation and trace
-> localize labels and prose
-> verify locale parity
-> emit Question Studio metadata
-> final contract validation
```

The generator must never infer the intended answer from rendered prose after generation.

## 18.1 Hidden-state-first construction

Preferred direction:

```text
choose valid endpoint/path/graph
-> derive movements or relation statements
-> choose answer demand
-> verify uniqueness
```

For inverse questions:

```text
choose a valid complete state
-> hide one operation or parameter
-> independently recover it
-> reject if more than one recovery is possible
```

## 18.2 Bounded retry

All candidate rejection loops must be deterministic and bounded. Exhaustion must throw a clear implementation error identifying the QL, seed and rejection causes.

---

# 19. Independent solver architecture

The independent solver must consume structured operations, not the generator's answer-producing helper.

Required independent solvers:

```text
solveOrientationSequence
solveMovementPath
solveDisplacement
solveEntityPositionGraph
solveMultipleMovers
solveCodedDirection
solveSunShadow
solveInverseDirectionState
```

## 19.1 Non-circularity rule

Generator and solver may share primitive definitions such as direction vectors and exact arithmetic, but they must not share the function that selects or derives the canonical answer.

## 19.2 Solver trace

The solver should emit an internal trace containing:

```text
normalized initial state
operation-by-operation orientation
operation-by-operation coordinate
final vector
reference entity or point
answer classification
exact numeric calculation
```

Question Studio may expose this trace to administrators. It must not appear in student-facing output as internal metadata.

## 19.3 Render fidelity validation

The final validator must confirm that every structured movement or relation intended for the student is represented in the rendered stem or diagram in the correct order.

This prevents a valid hidden state from being paired with an incomplete or misleading question.

---

# 20. Ambiguity and degeneracy architecture

Direction questions are usually deterministic once their state is clear. Their principal risks are missing references, contradictory relations, degenerate endpoints and underdetermined inverse states.

A candidate must be rejected when any of the following applies:

```text
initial facing is neither stated nor uniquely inferable
left/right is used without a current facing direction
query reference is grammatically unclear
movement order is unclear
coded mapping has more than one valid interpretation
inverse reconstruction has multiple solutions
static relation graph is contradictory or disconnected
endpoint direction is requested when displacement is zero
axis direction and diagonal direction both appear plausible due to malformed coordinates
diagram and text disagree
numeric display rounds two options to the same value
more than one option satisfies the requested relation
```

## 20.1 Zero-displacement policy

Zero displacement is allowed only for QLs whose answer format explicitly supports:

```text
at the starting point
same position
coincident point
```

It must not silently enter a normal eight-direction answer set.

## 20.2 Direction classification

From a non-zero displacement `(dx, dy)`:

```text
dx = 0, dy > 0 -> North
dx = 0, dy < 0 -> South
dx > 0, dy = 0 -> East
dx < 0, dy = 0 -> West
dx > 0, dy > 0 -> North-East
dx < 0, dy > 0 -> North-West
dx > 0, dy < 0 -> South-East
dx < 0, dy < 0 -> South-West
```

The chapter tests compass quadrant, not exact bearing, unless the QL explicitly asks for an angle.

## 20.3 Visual plausibility

For a diagram question, reject extremely skewed coordinate states that make the intended quadrant visually misleading after normalization. The renderer remains explicitly not to scale unless exact scale is a tested feature.

---

# 21. Distractor architecture

Every distractor must carry one or more error labels.

Canonical error-label inventory:

```text
TOTAL_DISTANCE_NOT_DISPLACEMENT
LEFT_RIGHT_REVERSED
OPPOSITE_DIRECTION
FINAL_MOVEMENT_OMITTED
INITIAL_FACING_IGNORED
CLOCKWISE_ANTICLOCKWISE_REVERSED
ANGLE_MAGNITUDE_ERROR
ABOUT_TURN_AS_RIGHT_ANGLE
X_SIGN_REVERSED
Y_SIGN_REVERSED
DIAGONAL_QUADRANT_CONFUSION
QUERY_RELATION_REVERSED
WRONG_REFERENCE_ENTITY
MANHATTAN_DISTANCE_USED
ONE_AXIS_ONLY
PYTHAGORAS_ARITHMETIC_ERROR
RETURN_VECTOR_NOT_REVERSED
SECOND_MOVER_PATH_IGNORED
STARTING_SEPARATION_IGNORED
CODE_MAPPING_SWAPPED
CODE_TOKEN_ORDER_REVERSED
SHADOW_DIRECTION_REVERSED
MORNING_EVENING_CONFUSED
SUN_DIRECTION_USED_AS_SHADOW
MISSING_SEGMENT_WRONG_AXIS
PATH_CLOSED_TOO_EARLY
```

## 21.1 Direction distractors

Preferred sources:

```text
reverse the asked relation
reverse left/right
choose the opposite direction
flip only x sign
flip only y sign
omit the final movement
use final facing instead of endpoint direction
```

## 21.2 Distance distractors

Preferred sources:

```text
total path length
Manhattan distance |dx| + |dy|
one-axis displacement
incorrect Pythagorean addition
correct vector with one omitted segment
wrong starting separation
```

## 21.3 Combined answer distractors

For `DIRECTION_AND_DISTANCE`, distractors should mix independently plausible errors:

```text
correct distance + wrong direction
wrong distance + correct direction
same misconception applied to both
```

Exactly one complete pair may be correct.

## 21.4 Option validation

```text
all options use the same answer type
all numeric options use the same unit and display precision
all normalized values are unique
correct answer appears exactly once
each distractor independently fails the solver query
no distractor duplicates another error state after rendering
```

Random nearby values are a fallback only after misconception-derived values are exhausted.

---

# 22. Explanation architecture

Each explanation must be generated from the actual instance and should read as human-authored examination guidance rather than a repeated mechanical shell.

Recommended trace:

```ts
interface Dir001ExplanationTrace {
  conceptStatement: string;
  referenceFrame: string;
  steps: readonly Dir001ExplanationStep[];
  coordinateSummary?: string;
  distanceCalculation?: string;
  conclusion: string;
  closestTrapRejection?: string;
}
```

## 22.1 Orientation explanation

A good explanation should show:

```text
initial facing
meaning of each turn
normalized net rotation or sequential facing changes
final direction
```

## 22.2 Path explanation

A good explanation should show:

```text
ordered path or point sequence
net east-west component
net north-south component
final reference vector
final direction and/or distance
```

## 22.3 Static relation explanation

A good explanation should show:

```text
one anchor entity
placement of each relevant entity
requested direction from the correct reference
conclusion
```

## 22.4 Shadow explanation

A good explanation should explicitly connect:

```text
time period
sun direction
opposite shadow direction
left/right/front/back relation
inferred facing
```

## 22.5 Anti-repetition policy

The explanation system must vary sentence structure and reasoning order while preserving correctness. It must not emit one generic shell for every QL.

Required audits:

```text
genericExplanationCount
formulaOnlyExplanationCount
missingReferenceFrameCount
missingOperationTraceCount
missingCoordinateSummaryCount
missingDistanceCalculationCount
missingFinalContextCount
repeatedExplanationShellCount
explanationStemMismatchCount
explanationAnswerMismatchCount
internalIdLeakCount
```

All blocker counters must be zero.

---

# 23. Renderer and diagram architecture

## 23.1 Renderer families

```text
TEXT
STRUCTURED_TEXT
DIRECTION_DIAGRAM
```

`DIRECTION_DIAGRAM` is a structured SVG-ready renderer, not a stored image.

## 23.2 Diagram spec

```ts
interface DirectionDiagramSpec {
  kind:
    | "COMPASS_ROSE"
    | "PATH_POLYLINE"
    | "RELATIVE_POSITION_GRAPH"
    | "MULTI_MOVER_PATH"
    | "SUN_SHADOW_LAYOUT";
  points: readonly DirectionDiagramPoint[];
  segments: readonly DirectionDiagramSegment[];
  compass?: DirectionCompassSpec;
  labels: readonly DirectionDiagramLabel[];
  highlight?: DirectionDiagramHighlight;
  notToScale: true;
  accessibleText: string;
}
```

## 23.3 Renderer invariants

```text
all labelled points correspond to structured-state points
segment order is preserved
arrows show movement direction rather than merely connection
question diagrams do not reveal hidden answers
explanation diagrams may show resolved vectors
labels do not overlap at supported viewport sizes
accessible text describes the visible spatial relationship
```

## 23.4 Presentation distribution

Chapter-wide generated-instance target:

| Presentation | Target share |
|---|---:|
| Text-only movement or rotation | 50% |
| Structured relation statements | 20% |
| Question diagram | 15% |
| Text question with explanation diagram | 10% |
| Shared-stimulus/caselet | 5% |

These are review targets, not rigid per-QL quotas.

---

# 24. Context and entity architecture

Use a controlled entity library rather than unrestricted runtime names.

Allowed context families include:

```text
person walking
vehicle route without speed arithmetic
courier or post office route
school, market, office and home
villages and towns
field, gate and checkpoint
ship or boat route without speed/time arithmetic
security patrol
warehouse or campus points
abstract labelled points
```

Entity controls:

```text
unique names within one item
locale-safe pronunciation and rendering
clear pronoun gender where pronouns are used
no accidental duplicate initials in dense diagrams
no culturally awkward role assignment
no location fact claims about real places
```

Chapter-wide context target:

| Context family | Target share |
|---|---:|
| Person walking or running | 25% |
| Home, school, office, market and campus | 20% |
| Vehicle, patrol, courier and route | 15% |
| Villages, towns, houses and static entities | 15% |
| Abstract points or diagrams | 15% |
| Coded direction and sun-shadow contexts | 10% |

No context-only variation may be counted as mathematical diversity.

---

# 25. Multilingual architecture

The hidden path, coordinate state, answer and diagram are language-neutral.

For the same QL and seed, English, Hindi and Punjabi must preserve:

```text
rule
operations and order
entity IDs
numeric values and units
correct answer
correct option index where practical
difficulty
renderer
question diagram
answer demand
ambiguity status
solver result
```

## 25.1 English direction lexicon

```text
North
North-East
East
South-East
South
South-West
West
North-West
clockwise
anticlockwise
left
right
about turn
```

## 25.2 Hindi direction lexicon

Use consistent natural examination terminology, including:

```text
उत्तर
उत्तर-पूर्व
पूर्व
दक्षिण-पूर्व
दक्षिण
दक्षिण-पश्चिम
पश्चिम
उत्तर-पश्चिम
दक्षिणावर्त
वामावर्त
बायाँ
दायाँ
पीछे की ओर / 180° का मोड़, according to context
```

Final wording must be reviewed for naturalness; internal transliteration is not acceptable.

## 25.3 Punjabi direction lexicon

Use consistent natural examination terminology, including:

```text
ਉੱਤਰ
ਉੱਤਰ-ਪੂਰਬ
ਪੂਰਬ
ਦੱਖਣ-ਪੂਰਬ
ਦੱਖਣ
ਦੱਖਣ-ਪੱਛਮ
ਪੱਛਮ
ਉੱਤਰ-ਪੱਛਮ
ਘੜੀ ਦੀ ਦਿਸ਼ਾ ਵਿੱਚ
ਘੜੀ ਦੀ ਉਲਟੀ ਦਿਸ਼ਾ ਵਿੱਚ
ਖੱਬੇ
ਸੱਜੇ
ਪਿੱਛੇ ਮੁੜਨਾ / 180° ਦਾ ਮੋੜ, according to context
```

Final terminology must be approved through Punjabi editorial review.

## 25.4 Localization tests

```text
expected Unicode script present
no unresolved English instruction fragments
approved abbreviations only
answer parity
option parity
difficulty parity
unit parity
operation-order parity
diagram-label parity
no banned or deprecated terminology
no gender or agreement mismatch
```

English must be editorially approved before localized content is frozen.

---

# 26. Difficulty model

The public distribution target is:

```text
Easy   35% -> approximately 84 of 240 primary review instances
Medium 45% -> approximately 108 of 240
Hard   20% -> approximately 48 of 240
```

Difficulty is generated-instance metadata, not a permanent property inferred only from the QL.

Use the Reasoning V1 five-factor model:

```text
rule complexity
number of transformations
information density
distractor proximity
required inference depth
```

Chapter-specific levers include:

```text
number of turns
45-degree versus 90-degree turns
number of path segments
absolute versus relative movement wording
number of reference reversals
number of entities or movers
presence of diagonal directions
numeric displacement calculation
unknown or hidden operation
coded-language interpretation
sun-shadow interpretation
caselet dependence
renderer density
```

Larger distances alone do not make a question harder.

## 26.1 Easy profile

Typical properties:

```text
one to three turns or movements
one entity
cardinal directions
no inverse reconstruction
axis-aligned displacement or familiar triple
clearly separated distractors
```

## 26.2 Medium profile

Typical properties:

```text
four to six operations
one reference reversal
cardinal plus intercardinal orientation
Pythagorean displacement
three-entity relation chain
coded relation with stated map
```

## 26.3 Hard profile

Typical properties:

```text
long or mixed path
multiple movers
inverse reconstruction
close misconception distractors
coded-map recovery
compound shadow relation
shared-stimulus synthesis
controlled exact or rounded distance
```

---

# 27. Mathematical and structural fingerprints

Each generated instance must emit a canonical fingerprint that ignores superficial names and prose.

Suggested shape:

```text
checkpoint
solveMode
initialFacing
normalized operation sequence
normalized start coordinates
normalized relation graph
answer demand
final vector class
exact answer class
renderer mode
```

Example:

```text
DIR-CP-003|exactPythagoreanDisplacement|
start=N|moves=N:12,E:5,S:0|
net=(5,12)|ask=DISTANCE|answer=13|renderer=TEXT
```

Uses:

```text
same-QL mathematical diversity audit
cross-QL topology collision audit
review export comparison
regression tracking
Question Studio duplicate inspection
```

Names, grammatical variants and option order must not create a new mathematical fingerprint.

---

# 28. Question Studio integration

Question Studio must expose:

```text
family: Relational and Positional Reasoning
chapter: Direction and Distance
package: DIR-001
checkpoint
QL
rule
solve mode
presentation mode
renderer
locale mode
difficulty
seed
answer type
error labels
ambiguity status
independent-solver status
runtime version
editorial status
mathematical fingerprint
```

## 28.1 Direction path debugger

Administrator preview should include:

```text
initial coordinate and facing
ordered turns
ordered movement vectors
point coordinates
final coordinate and facing
total distance
displacement vector
displacement magnitude
query reference
solver conclusion
```

## 28.2 Review controls

Reviewers should be able to:

```text
generate by QL and seed
regenerate deterministically
compare all three locales
switch rendered text and structured state
show or hide question and explanation diagrams
inspect distractor error labels
inspect generator and independent-solver traces
flag reference ambiguity
flag diagram mismatch
reject a generated instance
export checkpoint and chapter review batches
view freeze-readiness counters
```

Internal rule names may be visible to administrators but must never appear in student output.

---

# 29. Test architecture

## 29.1 Foundation exhaustive tests

At minimum, exhaustively verify:

```text
8 initial directions x all 8 normalized 45-degree rotations
left and right from every direction
about turn from every direction
rotation composition modulo 360 degrees
opposite-direction lookup
vector classification for every sign combination
coordinate addition and cancellation
exact Pythagorean triples
```

## 29.2 Registry tests

```text
exactly 240 QLs
continuous DIR-QL-001 through DIR-QL-240
unique QL IDs
exact CP counts and ranges
unique rule IDs
all QLs registered
all QLs reachable
all explanation and distractor strategies registered
no registry-level rule or topology collision
```

## 29.3 Runtime sampling

Minimum pre-freeze target:

```text
100 English seeds per QL
40 Hindi seeds per QL
40 Punjabi seeds per QL
500 or more combined cases for every inverse, coded-map-recovery and multi-mover solve mode
```

This produces at least:

```text
24,000 English generated cases
9,600 Hindi generated cases
9,600 Punjabi generated cases
```

Every sampled case should be generated twice to prove determinism.

## 29.4 Required assertions

```text
deterministic repeatability
independent-solver agreement
four unique options
exactly one correct answer
correct option/index parity
valid direction and coordinate state
no contradictory relation graph
no invalid zero-displacement query
safe exact or rounded distance
unit consistency
question-render fidelity
question/explanation diagram fidelity
complete explanation
answer-position balance
layout coverage
difficulty coverage
context coverage
same-QL mathematical diversity
cross-QL topology uniqueness
no unresolved placeholders
no internal IDs in student-facing text
locale script and parity
```

## 29.5 Answer-position balance

Over the whole checkpoint sample, maximum correct-position frequency divided by minimum frequency should remain below approximately `1.35`, with stricter balance preferred at larger sample sizes.

## 29.6 Diversity gates

For a standard 12-seed same-QL audit:

```text
no exact repeated complete question
no fixed answer-position pattern
at least 8 distinct mathematical fingerprints where the QL domain permits it
no seed variation caused only by names or option shuffle
no hidden-variable-only variation
```

A QL with a deliberately finite state space must document that limitation and provide sufficient presentation or query diversity without claiming false mathematical variety.

---

# 30. Required QA counters

```text
questionCount
cpDistribution
qlDistribution
solveModeDistribution
difficultyDistribution
answerTypeDistribution
rendererDistribution
contextDistribution
localeDistribution

unusedQlCount
unusedRuleCount
unusedSolveModeCount
unreachableRegistryEntryCount

exactDuplicateStemGroupCount
normalizedDuplicateQlGroupCount
sameQlExactRepeatCount
sameQlFingerprintRepeatCount
crossQlTopologyCollisionCount
contextOnlyVariationCount

unresolvedPlaceholderCount
ambiguousReferenceCount
contradictoryGraphCount
disconnectedQueryCount
invalidZeroDisplacementCount
invalidTurnAngleCount
invalidDirectionCount
operationRenderMismatchCount
diagramStateMismatchCount

invalidCorrectIndexCount
duplicateNormalizedOptionCount
correctAnswerMultiplicityFailureCount
weakOptionCount
optionTypeMismatchCount
optionUnitMismatchCount
roundedOptionCollisionCount

solverUnsupportedQlCount
independentAnswerMismatchCount
independentFacingMismatchCount
independentCoordinateMismatchCount
independentDistanceMismatchCount

invalidTotalDistanceCount
invalidDisplacementCount
invalidPythagoreanStateCount
invalidUnknownSegmentCount
intermediateRoundingCount
unitConversionLeakCount
invalidDiagonalDistanceTreatmentCount

missingConceptStatementCount
missingReferenceFrameCount
missingOperationTraceCount
missingCoordinateSummaryCount
missingDistanceCalculationCount
missingConclusionCount
genericExplanationCount
formulaOnlyExplanationCount
repeatedExplanationShellCount
explanationStemMismatchCount
explanationAnswerMismatchCount

answerPositionImbalanceCount
insufficientDifficultyCoverageCount
insufficientRendererCoverageCount
insufficientContextCoverageCount
insufficientSameQlDiversityCount
parameterPoolExhaustionCount
rejectionExhaustionCount
fixedFallbackUseCount

localeAnswerParityFailureCount
localeOptionParityFailureCount
localeOperationParityFailureCount
localeDiagramParityFailureCount
localeScriptFailureCount
bannedTerminologyCount
unsupportedLanguageExposureCount
internalIdLeakCount
```

All correctness, solver, ambiguity, option, rendering, localization and explanation blockers must be zero before freeze.

---

# 31. Review-export workflow

## 31.1 Primary English review

Generate one deterministic primary instance per QL:

```text
240 rows
```

Required fields:

```text
packageId
checkpointId
qlId
ruleId
taskKind
solveMode
difficulty
seed
mathematicalFingerprint
presentationMode
renderer
contextDomain
structuredState
stem
questionDiagram
four options
correctIndex
correctAnswer
explanation
explanationDiagram
solverTrace
validation
```

Human-review fields:

```text
stemRealism
spatialValidity
solverCorrect
referenceClarity
optionQuality
explanationQuality
difficultyAccuracy
examRelevance
diagramQuality
editorialStatus
defectCategory
reviewNotes
reviewer
reviewedAt
```

All human-review fields begin as `PENDING`.

## 31.2 Three-seed English stress review

```text
240 QLs x 3 seeds = 720 rows
```

## 31.3 Paired diversity export

Include:

```text
primarySeed
variantSeed
primaryFingerprint
variantFingerprint
primaryStructuredState
variantStructuredState
primaryStem
variantStem
primaryAnswer
variantAnswer
sameStem
sameFingerprint
samePathState
nameOnlyDifference
optionOrderOnlyDifference
```

## 31.4 Localized review

After English approval, generate side-by-side English/Hindi and English/Punjabi exports preserving structured-state parity.

Human publication approval requires native-language review; automated script and parity tests are not sufficient.

---

# 32. Implementation sequence

## Stage 0 — Design baseline

```text
commit this end-to-end design
review CP ownership and QL allocation
freeze DIR-001 package identity and ranges
```

## Stage 1 — Foundation proof

Implement and test:

```text
direction enum and rotation
coordinate arithmetic
path operations
exact-distance policy
entity-position graph
answer classification
option contract
render specs
fingerprints
```

No production QL expansion should begin until the foundation proof passes.

## Stage 2 — `DIR-CP-001`

Establish orientation, rotation, inverse-facing and frame-transformation behavior.

## Stage 3 — `DIR-CP-002` and `DIR-CP-003`

After the shared path foundation is stable, endpoint/facing and displacement checkpoints may proceed in parallel on separate branches.

## Stage 4 — `DIR-CP-004`

Implement the static position graph and relation query engine.

## Stage 5 — `DIR-CP-005`

Extend stable path operations to multiple movers without adding speed/time arithmetic.

## Stage 6 — `DIR-CP-006`

Implement unique coded-direction maps and mapping-recovery validation.

## Stage 7 — `DIR-CP-007`

Implement governed sun-shadow assumptions and localization.

## Stage 8 — `DIR-CP-008`

Combine only already-proven foundations into inverse and caselet forms.

## Stage 9 — English editorial correction

```text
generate exact review exports
collect checkpoint-level defect batches
repair generators and QLs by defect family
rerun all audits
approve English before localization freeze
```

## Stage 10 — Hindi and Punjabi

```text
implement natural localized phrasing
run parity and script audits
export side-by-side reviews
complete native-language editorial review
```

## Stage 11 — Integration and freeze

```text
wire Question Studio discovery
run chapter-wide tests
run duplicate and topology audits
verify QL continuity
record actual test execution
merge through reviewed PRs
freeze only verified checkpoints
```

---

# 33. Branch and checkpoint workflow

Recommended branch sequence:

```text
feat/reasoning-dir-001-design
feat/dir-001-foundation
feat/dir-cp-001-orientation
feat/dir-cp-002-path-facing
feat/dir-cp-003-displacement
feat/dir-cp-004-relative-position
feat/dir-cp-005-multiple-movers
feat/dir-cp-006-coded-directions
feat/dir-cp-007-sun-shadow
feat/dir-cp-008-advanced-synthesis
feat/dir-001-localization
feat/dir-001-freeze-audit
```

Each checkpoint PR should contain:

```text
exact reserved QLs
runtime and independent solver
tests and audit output
review-export script
implementation report
honest executed-test status
no unrelated chapter changes
```

---

# 34. Freeze-readiness criteria

A checkpoint is freeze-ready only when:

```text
scope matches this manifest
reserved QL count and range pass
all runtime responsibilities are present
all registered QLs are reachable
all tests have actually executed successfully
independent solving passes
ambiguity and degeneracy audits pass
no topology collision exists
four-option and one-answer contracts pass
answer-position balance is acceptable
same-QL mathematical diversity is demonstrated
renderer and diagram validation pass
English review is approved
Hindi and Punjabi parity and human review pass where exposed
no placeholders or internal IDs remain
Question Studio discovery and seed replay work
implementation report states the actual verified status
```

Automated-clean does not mean human-approved. Structural localization does not mean publication-ready localization.

---

# 35. Package definition of done

`DIR-001` is complete only when all of the following are true:

```text
240 permanent QLs implemented
8 checkpoint ranges preserved
all chapter tests pass
all sampled instances are deterministic
independent solver covers every QL
no unresolved ambiguity or degenerate endpoint
no cross-QL topology collision
no exact or normalized duplicate blocker
all options are unique and misconception-driven
explanations are instance-specific and editorially mature
question and explanation diagrams match structured state
English review complete
Hindi review complete
Punjabi review complete
Question Studio integration complete
chapter-wide freeze report approved
```

Until then, the official status remains:

```text
Design complete: Yes
Runtime implemented: No
English complete: No
Multilingual complete: No
Freeze-ready: No
```
