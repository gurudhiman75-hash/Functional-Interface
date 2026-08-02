# ExamTree Quant V4 — TSD Runtime, QA, Localisation and Freeze Contract

**Chapter:** Time, Speed & Distance  
**Packages:** `TSD-001`, `TSD-002`  
**Applies to:** every discovery candidate, permanent QL, locale and representation  
**Release default:** review-only and non-publishable

This document is binding alongside the chapter blueprint and exhaustive solve-mode inventory.

---

## 1. State generation and feasibility contracts

Every generator must construct a valid canonical state before rendering language.

Required generation rules:

1. Choose exact rational/integer hidden state first.
2. Derive all displayed givens from that state.
3. Solve the requested target independently before building options.
4. Reject zero/negative durations, distances and body lengths unless zero is explicitly meaningful.
5. Reject same-direction catch-up with non-positive closing speed.
6. Reject medium states with non-positive required upstream/headwind ground speed.
7. Reject ambiguous train-event wording.
8. Reject circular states where “meeting count” conventions are not explicit.
9. Reject early/late states that admit multiple positive roots unless classification is the target.
10. Reject schedules that finish during an unstated stop or partial interval.
11. Avoid unrealistic speeds, train lengths, platform lengths, stream speeds, escalator rates and race margins.
12. Preserve exact values internally; round only under an explicit answer contract.
13. Every inverse candidate must be re-simulated forward.
14. Every displayed table/diagram must be generated from the same hidden state, never independently authored.

Suggested realism bands are context-specific and must be source-audited rather than globally hard-coded.

---

## 2. Solver and independent verifier architecture

Each retained QL requires:

- a canonical solver;
- a materially independent verifier;
- deterministic replay by seed;
- forward simulation of the solved state;
- unit and dimensional validation;
- answer-option-explanation parity.

Verifier routes include:

```text
direct formula ↔ exact segment simulation
relative-speed equation ↔ position equality
train crossing formula ↔ front/rear event simulation
closed-track equation ↔ modular timeline simulation
boat/stream equation ↔ signed ground-speed simulation
race lead algebra ↔ finish-time reconstruction
escalator equation ↔ ground-step timeline
inverse algebra ↔ bounded exact enumeration
```

A verifier may not call the same helper chain as the canonical solver for the decisive step.

---

## 3. Difficulty model

Difficulty is computed from live state, not assigned by QL name.

Dimensions:

- number of independent motion segments;
- number of moving bodies;
- direct versus inverse target;
- hidden start/stop/turnaround event;
- finite-length crossing semantics;
- unit-conversion burden;
- closed-track modular reasoning;
- number of equations/constraints;
- periodic cycle and terminal remainder;
- candidate-domain size;
- uniqueness proof;
- representation switching;
- essential engine count;
- distractor closeness.

Review bands:

```text
CORE_EXAM_PATTERN
UPPER_EXAM_PRACTICE
ADVANCED_ENRICHMENT
```

No band receives a quota before executable evidence.

---

## 4. Option and distractor design

Every MCQ has exactly four unique options and exactly one correct answer.

Distractors must be generated from live misconceptions, including:

- using \(s=d\times t\) or \(t=d\times s\);
- failing km/h ↔ m/s conversion;
- arithmetic mean instead of total-distance/total-time average;
- omitting return distance;
- excluding or double-counting stops;
- adding speeds for same-direction motion;
- subtracting speeds for opposite-direction motion;
- using initial gap rather than effective train length;
- using one train length instead of sum of lengths;
- confusing front reaches with rear clears;
- counting the start as a meeting when the stem excludes it;
- counting meetings rather than distinct meeting points;
- reversing upstream/downstream signs;
- using still-water speed as ground speed;
- converting a distance lead as a time lead directly;
- subtracting moving-surface speed in the wrong direction;
- treating a final partial cycle as a full cycle;
- selecting the extraneous algebraic root.

Generic `answer ± 1`, random nearby numbers and unlabelled symbolic fallbacks are prohibited unless the live misconception genuinely produces them.

The explanation must identify the trap corresponding to each retained wrong option when practical.

---

## 5. Explanation architecture

Every generated explanation uses structured evidence and natural teacher-like prose.

Required sections:

1. **Core Concept** — the governing motion invariant in plain language.
2. **Given Data and Motion Plan** — bodies, segments, directions, lengths, starts/stops and target.
3. **Complete Step-by-Step Solution** — exact substitutions and intermediate values.
4. **Event Check** — meeting/crossing/arrival/turnaround semantics verified against the hidden state.
5. **Exam Speed Method** — a valid shortcut only when it is safe for that topology.
6. **Common Traps** — tied to displayed distractors.
7. **Final Answer** — contextual answer with correct unit.

Medium and hard explanations should normally contain 6–9 meaningful steps, but line count is not a quality target. Repeated generic shells, catalogue language and solution-text translation are prohibited.

Explanation strategies must vary by solve topology: ratio table, relative-speed line, distance-time reconstruction, train effective-length strip, modular lap table, stream-speed decomposition, race calibration and escalator ground-rate model.

---

## 6. Language and localisation

English is the mathematical and editorial authority.

Release order:

```text
English discovery
→ English automated QA
→ English manual review
→ English freeze
→ Hindi authoring and review
→ Punjabi authoring and review
→ mathematical and option parity proof
→ multilingual freeze
```

Hindi and Punjabi must be rendered from structured state, not by translating a finished English paragraph.

Locale rules:

- preserve exact hidden state, answer, options, correct index and MathJax;
- use natural SSC/banking/Punjab exam wording;
- avoid needlessly technical Punjabi/Hindi vocabulary;
- preserve train-event and early/late semantics exactly;
- localise units consistently while retaining standard symbols;
- reject Latin fallback in Hindi/Punjabi prose except accepted symbols/names;
- maintain context-appropriate gender and agreement;
- do not release unsupported language requests through English fallback.

Gemini or another language model may propose explanation wording during authoring, but deterministic structured state, canonical math, independent verification and human approval remain authoritative. Runtime free-form LLM generation is prohibited.

---

## 7. Visual and representation design

Required renderers:

```text
motion timeline
linear route strip
meeting/pursuit number line
train + object effective-length diagram
station-to-station line
closed-track circle with start points and directions
race finish strip
boat/stream signed-speed diagram
escalator/moving-walkway ground-rate diagram
segment table
shared caselet panel
```

Visuals must expose only learner-visible facts. Hidden answers, coordinates or internal IDs must not leak.

Every diagram receives automated structural checks and a rendered artifact/contact-sheet review. Text-only equivalents must remain mathematically complete for accessibility.

---

## 8. Permanent audit suite

Each CP must ship dedicated and chapter-wide gates.

### 8.1 Mathematical gates

```text
canonical answer parity
independent verifier agreement
forward simulation agreement
unit and dimension consistency
exact rational equality
unique correct option
inverse-state uniqueness/classification
crossing-event correctness
closed-track modulo correctness
medium-sign correctness
terminal partial-cycle correctness
```

### 8.2 Generation gates

```text
deterministic replay
seed diversity
parameter fingerprint diversity
topology diversity
answer-position distribution
context realism
invalid-state rejection
boundary-state coverage
merge/split collision audit
cross-CP ownership collision audit
legacy-family disposition audit
```

### 8.3 Editorial gates

```text
natural exam-like stem
no catalogue wording
no unresolved placeholders
no duplicated normalized stems
no duplicated explanation shells
complete question mark/punctuation
four unique meaningful options
option-specific misconception labels
teacher-like explanation
correct and natural unit wording
```

### 8.4 Localisation gates

```text
state/answer/option-index parity
script purity
MathJax preservation
terminology consistency
grammar and agreement
naturalness
no English paragraph fallback
locale-specific duplicate audit
```

### 8.5 Visual gates

```text
valid SVG/HTML
all labels derived from state
no clipping/overlap
direction arrows correct
train/object lengths semantically correct
closed-track positions correct
text and diagram evidence parity
accessibility fallback present
```

---

## 9. Review artifacts and freeze protocol

For each candidate QL, export deterministic reviewer evidence containing:

```text
packageId
cpId
candidateAuthorityId
candidateTemplateId
taskKind
solveMode
difficulty
representation
questionId
seed
parameterFingerprint
topologyFingerprint
stem
diagram reference
options
correctIndex
correctAnswer
explanation
misconception labels
solver result
verifier result
reviewStatus
defectCategory
reviewNotes
reviewer
reviewedAt
```

Required freeze sequence per CP:

1. source-family audit;
2. legacy-family disposition audit;
3. executable solve-authority discovery;
4. forward/reverse/inverse gap audit;
5. edge/boundary/invalid-state audit;
6. representation audit;
7. merge/split and cross-CP collision proposal;
8. human review of rendered English samples;
9. explicit approval of retained solve-mode and QL counts;
10. permanent `TSD-QL-*` allocation;
11. English runtime proof;
12. English editorial freeze record.

No candidate becomes permanent merely because tests pass.

---

## 10. Lifecycle and publication safety

Default discovery state:

```text
reviewStatus: UNREVIEWED_DISCOVERY_CANDIDATE
questionStudioDiscoverable: false
questionBankStatus: NOT_STORED
testEligibility: INELIGIBLE
publiclyPublishable: false
```

Release path:

```text
design complete
→ CP executable discovery
→ count approval and permanent allocation
→ English freeze
→ Hindi/Punjabi authoring and freeze
→ guarded Question Studio review routing
→ human approval
→ Question Bank storage
→ mock-test eligibility
→ public publication
```

Question Studio generates review candidates. Only approved questions are stored in the Question Bank. Tests are assembled from approved bank questions. Students never see raw generation output.

Every transition requires an explicit release record; no earlier stage implies a later one.

---

## 11. Dependency-aware implementation order

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

CP-001 and CP-007 may begin in parallel only after the shared event/unit foundation is stable. CP-004 and CP-009 may begin in parallel after CP-001. CP-012 begins only after all authorities it composes are frozen.

---

## 12. Advanced-enrichment hold

The following remain outside routine CP allocation until recurring target-exam evidence, bounded manual solvability and clear ownership are proven:

```text
two-dimensional swimmer shortest-time crossing
shortest-path river crossing with heading angle
crosswind aircraft navigation
vector interception
continuous uniform acceleration
non-uniform calculus-based motion
sound and echo
Doppler/whistle propagation
missile or projectile interception
arbitrary polygon motion with geometric optimisation
general graph-route optimisation
gear and pulley dynamics
```

A hold item is not a hidden implementation promise.

---

## 13. Design-completion and CP-freeze acceptance

This chapter design is complete when:

- package and CP architecture is stable;
- ownership and exclusions are explicit;
- canonical exact state and event semantics are defined;
- the universal discovery matrix is defined;
- solver-verifier routes are defined;
- option, explanation, localisation, visual and lifecycle contracts are defined;
- legacy disposition is explicit;
- implementation order and release safety are explicit.

A CP is freeze-ready only when:

- no meaningful source-backed solve family remains uncovered;
- no forward/reverse/inverse or boundary gap remains;
- no same-authority duplicate remains;
- cross-CP collisions are closed;
- every retained QL has independent proof;
- review artifacts show natural, varied, exam-realistic output;
- the user explicitly approves final retained counts.

---

## 14. Final lifecycle statement

`TSD-001` and `TSD-002` are authorised for checkpoint-by-checkpoint executable discovery under this blueprint.

Current truth:

```text
Permanent TSD QLs: 0
Frozen TSD CPs: 0
Frozen TSD solve modes: 0
Discovery candidates: 417
Question Studio exposure: disabled
Question Bank storage: disabled
Test eligibility: disabled
Public publication: disabled
```

The next implementation step is the shared exact motion/unit/event foundation followed by `TSD-CP-001` executable discovery. No permanent QL count should be proposed before its source, inverse, edge, representation and merge/split audits pass.
