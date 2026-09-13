# CAE-001 — Source Pattern Census — 2026-09-13

## Purpose

This file records **observed question schemas**, not copied question banks. It is used to decide what CAE-001 must be able to render before QL/content freeze.

The chapter architecture remains graph-first. Source discovery may add/split renderer profiles or provisional learner-task families without reopening the canonical causal-world model.

## Evidence ledger

### 1. Project library — `Reasoning for Competitions`, Chapter 22: Cause and Effect

Observed chapter material includes:

- explicit distinction between cause and effect;
- immediate/principal cause discussion;
- classic two-statement relationship questions;
- historical Bank PO-labelled examples;
- repeated five-way direction sets distinguishing independent causes, effects of independent causes and effects of a common cause;
- a separate four-option KVS-labelled direction set.

Observed classic five-way schema:

1. Statement I causes Statement II.
2. Statement II causes Statement I.
3. Both statements are independent causes.
4. Both statements are effects of independent causes.
5. Both statements are effects of a common cause.

This is a **core source pattern** and is now directly represented by `CLASSIC_BANK_FIVE_RELATION`.

The same source also shows a four-option variant where the relationship categories are not identical to the classic five-way set. Therefore option-count alone is not enough to define an exam profile.

### 2. IBPS PO Mains 2024 memory-based paper

Source: CareerPower memory-based paper, Q25.

Observed form:

- two real-world/current-affairs-style statements;
- learner decides whether one causes the other or whether another broad relationship applies;
- five answer choices, but the category set differs from the classic five-way textbook schema and includes `None of these`.

Implication:

A count-only `FIVE_WAY` label is not a sufficient source-profile definition. The implemented source-profile layer now records named relationship sets separately from the legacy low-level option-count renderer.

Status: memory-based rather than SSC/IBPS official-host PDF; retain as secondary pattern evidence, not sole authority for freeze.

Reference discovered 2026-09-13:
`https://www.careerpower.in/blog/wp-content/uploads/2025/01/07172141/IBPS-PO-Mains-2024-Memory-Based-Paper-1st-shift.pdf`

### 3. SBI/IBPS-era banking practice / previous-paper style

Public banking preparation archives continue to show the classic paired-statement direction format with five relationship categories. This agrees with the project-library reference and older Bank PO examples inside it.

Representative references:

- IBPSGuide — IBPS PO Mains 2018 reasoning cause/effect set;
- SBI PO 2016 reasoning paper reproductions;
- other bank-exam archives using the same five-way direction wording.

Use these as corroboration only; prefer named/dated paper sources when available.

### 4. Punjab Police SI 2016 official paper — four-option relationship schema

Testbook identifies a Cause & Effect question as coming from the **Punjab Police SI 2016 Official Paper**.

Observed answer schema:

1. Statement I is the cause and Statement II is its effect.
2. Statement II is the cause and Statement I is its effect.
3. Both statements are effects of independent causes.
4. Both statements are effects of some common cause.

Notably, this four-option set does **not** contain a generic merged `independent` option and does not contain `both statements are independent causes`.

Reference discovered 2026-09-13:
`https://testbook.com/question-answer/directions-to-solvein-each-of-the-following-que--607abbe5704cf93c32d89f8b`

Implementation status:

- represented exactly by `PUNJAB_POLICE_SI_2016_FOUR_RELATION`;
- generated on top of the same canonical causal state;
- unsupported relationship states are rejected for this source profile rather than silently collapsed.

### 5. SSC Selection Post 2025 — direct recognition form

Testbook identifies a question as:

`SSC Selection Post 2025 (Higher Secondary Level) Official Paper (24 Jul 2025 Shift 2)`

Observed learner operation:

- four complete sentence/options are shown;
- choose the one that demonstrates a valid cause-and-effect relationship.

This is **not** the normal paired-statement relationship renderer. It is a direct-recognition MCQ.

Reference discovered 2026-09-13:
`https://testbook.com/question-answer/which-of-the-following-is-an-example-of-cause-and--69ccc950353b7d6dd14c07a7`

Implementation status:

- represented by `SSC_SELECTION_POST_DIRECT_RECOGNITION` under CP-001;
- one option is built from a direct canonical edge;
- three distractors are graph-derived reverse-causation, common-cause-confusion and independent-event false-causation claims;
- EN/HI/PA use the same semantic option IDs and answer order.

### 6. Oliveboard 2026 Cause and Effect guide / live quiz

Published 4 Aug 2026.

Observed coverage claims and practice forms include:

- paired-statement direct relationship;
- independent causes/effects;
- common cause;
- direct and indirect causes;
- immediate and remote effects;
- four-option paired-statement live-quiz rendering.

Important observation: the visible four-option relationship set is not identical across all sources. This is now handled by the named source-profile layer rather than assuming one universal four-option schema.

Reference:
`https://www.oliveboard.in/blog/cause-and-effect-reasoning/`

Implication:

Treat public practice evidence as evidence of expected learner operations and wording conventions, but do not claim official-paper parity from a prep article alone.

### 7. Testbook current Cause and Effect MCQ collection — multiple learner operations

Current Testbook Cause & Effect material, updated in 2026, exposes more than paired-statement relationship questions.

Observed forms include:

#### A. One observation + two possible causes

The learner receives a statement/phenomenon and two possible causes I and II, then chooses among combination outcomes such as:

- only I;
- only II;
- neither;
- both.

#### B. One statement/cause + two possible effects

The learner decides whether Effect I, Effect II, both or neither can follow.

#### C. One cause + three possible effects

The learner evaluates Effect I/II/III and chooses the valid combination.

#### D. Paired statements with source-specific four-option relationship sets

Current examples again demonstrate that four-option relationship rendering is not a single stable category set.

Reference:
`https://testbook.com/objective-questions/mcq-on-cause-and-effect--5eea6a1539140f30f369f43e`

Status: current practice/discovery evidence, not by itself proof of a specific official exam paper.

Implication:

CP-003/004 should eventually support **combination-answer probable-cause/effect renderings** in addition to the current one-correct-option form. The canonical graph already knows which candidate causes/effects are valid, so this remains a renderer/selection extension.

## Pattern census

| Pattern | Evidence strength | Current CAE coverage | Decision |
| --- | --- | --- | --- |
| Paired statements: I causes II | Strong / classic + bank + Punjab | Yes | Core |
| Paired statements: II causes I | Strong / classic + bank + Punjab | Yes | Core |
| Both independent causes | Strong / classic + bank | Exact in `CLASSIC_BANK_FIVE_RELATION` | Core/source-profile review |
| Effects of independent causes | Strong / classic + bank + Punjab | Exact in Bank + Punjab profiles | Core/source-profile review |
| Effects of common cause | Strong / classic + bank + Punjab | Exact in Bank + Punjab profiles | Core |
| Punjab Police SI 2016 exact four-way relationship set | Strong official-paper-labelled evidence | **Implemented exact** | Human-review profile |
| Other four-option paired-statement schemas | Strong as observed variants | Partly mapped | Add only when source-specific set is verified |
| Classic five-option paired-statement schema | Strong | **Implemented exact** | Human-review profile |
| `None of these` relationship outcome | Secondary recent bank memory evidence | No explicit profile | Discovery candidate; verify with stronger source before freeze |
| Choose the sentence/pair showing valid cause-effect | Strong recent SSC-labelled source | **Implemented CP-001 renderer** | Human-review profile |
| Observation + two possible causes, combination answer | Current practice/discovery evidence | No | Add CP-003 renderer after source validation |
| Cause/statement + two possible effects, combination answer | Current practice/discovery evidence | No | Add CP-004 renderer after source validation |
| Cause + three possible effects, combination answer | Current practice/discovery evidence | No | Add CP-004 advanced renderer after source validation |
| Probable cause from an observed effect, one-of-four | Practice/concept evidence | Yes CP-003 | Retain |
| Probable effect from a cause, one-of-four | Practice/concept evidence | Yes CP-004 | Retain |
| Immediate vs remote/principal cause/effect | Concept/reference support | Partial CP-006 | Expand |
| Common-cause vs direct-cause discrimination | Strong | Yes CP-002 | Expand medium difficulty |
| Correlation/false causation | Strong concept support; less direct paper evidence located so far | Weak CP-007 content | Keep but rebuild scenarios |
| Multi-event ordering | Novel/depth evidence; not yet established as common SSC/Bank CAE paper form | CP-008 sequence only | Keep as Examtree edge; do not call core exam pattern |
| Missing causal link | Novel/depth evidence; not yet established as common SSC/Bank CAE paper form | Yes CP-009 | Keep as Examtree edge; do not call core exam pattern |
| Competing explanations by timing/scope/magnitude | General causal-reasoning depth | Yes CP-005 | Keep as advanced/edge and strengthen |

## Profile-model implementation finding

Source parity is now represented by `source-profiles.ts` rather than by option count alone.

The legacy core generator still uses its existing `FOUR_WAY` / `FIVE_WAY` low-level profile values to preserve the frozen architecture. The source layer declares:

- exact source profile ID;
- source label;
- learner operation;
- legacy base rendering shape where required;
- exact relationship IDs for paired-statement profiles;
- compatible QL ownership.

This keeps source evidence auditable without forcing a causal-graph redesign.

## Source-driven gap decisions

### Gap 1 — recent SSC direct-recognition MCQ — IMPLEMENTED

Implemented under CP-001 as `SSC_SELECTION_POST_DIRECT_RECOGNITION`.

### Gap 2 — classic banking five-way review — IMPLEMENTED AT RENDERER LEVEL

`CLASSIC_BANK_FIVE_RELATION` now carries the exact five relationship IDs. `source-profile-review-pack.ts` is designed to expose all five answer relationships before filling its ten-question quota.

### Gap 3 — Punjab exact four-way profile — IMPLEMENTED

`PUNJAB_POLICE_SI_2016_FOUR_RELATION` matches the four source categories exactly and does not merge independent causes/effects into a generic answer.

### Gap 4 — exact profile authority rather than option-count authority — IMPLEMENTED

The source-profile layer now provides the source-auditable authority while preserving legacy renderer compatibility under the frozen core.

### Gap 5 — combined possible-cause/effect renderings — PENDING SOURCE-VALIDATED WAVE

The current graph/candidate engine can support multi-cause/effect evaluation without redesign:

- generate 2–3 candidate events against one observation/cause;
- independently solve whether each is causally valid under the canonical world;
- render combination answers (`only I`, `only II`, `both`, `neither`, etc.);
- validator must prove the truth vector before rendering the combination answer.

Add these only with clear source/profile metadata and separate them from the current one-of-four probable cause/effect form.

### Gap 6 — advanced Examtree edge versus exam-core labelling — OPEN

CP-005 to CP-009 contain useful deeper causal reasoning. Until stronger paper evidence is collected, classify sequence/missing-link/integrated forms as **Examtree advanced/novel coverage**, not as proven high-frequency SSC/Bank/Punjab paper formats.

This distinction lets the product gain an edge without misrepresenting source prevalence.

## Next source-discovery targets

Before final CP-010 freeze, collect additional dated examples from:

- SSC CGL/CHSL/Selection Post official or reliably indexed papers;
- SBI PO / SBI Clerk mains papers;
- IBPS PO / Clerk mains papers;
- additional Punjab Police, PSSSB and PPSC reasoning papers where Cause & Effect appears;
- RRB/insurance exams only as secondary breadth evidence.

For each located question, record only:

- exam + year/shift if known;
- learner operation;
- answer-schema shape;
- difficulty/ambiguity characteristics;
- which CAE projection/profile covers it;
- gap yes/no.

Do not copy whole proprietary question sets into runtime authorities.

## Freeze gate

CAE-001 source coverage can be frozen only when:

- every core observed exam pattern maps to an implemented renderer/profile;
- the 10-question-per-CP human review pack samples distinct causal states;
- paired-statement review includes every supported source profile;
- CP-003/004 source review decides which multi-cause/effect combination renderers become core versus advanced;
- CP-007 has genuine false-causation/correlation cases rather than obvious unrelated pairs;
- advanced CP-008/009 content is clearly labelled as sourced core vs Examtree edge;
- scenario saturation and human ambiguity review are complete.
