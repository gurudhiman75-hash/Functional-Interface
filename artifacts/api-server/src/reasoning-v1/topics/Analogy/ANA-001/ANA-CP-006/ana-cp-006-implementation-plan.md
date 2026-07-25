# ANA-CP-006 Implementation Plan

Status: **design frozen; implementation starting**.

## 1. Canonical scope

- Checkpoint: `ANA-CP-006`
- QL range: `ANA-QL-161..ANA-QL-208`
- Total QLs: 48
- Rule families: 24
- Presentation modes: `DIRECT_COMPLETION`, `PAIR_SELECTION`
- Task kind: `letterClusterTransform`
- Solve mode: `CLUSTER_RULE`
- Renderer: `STRUCTURED_TEXT`
- Locale mode: `TRANSLATABLE`
- Languages: `en-IN`, `hi-IN`, `pa-IN`
- Figure content: excluded
- Meaningful-word semantics: excluded

The QL count is governed by `ANA-001-MANIFEST-AMENDMENT-CP006.md`, which supersedes the old unimplemented range from QL 161 onward.

## 2. Exact QL allocation

| QLs | Rule ID | Direct / pair title |
|---|---|---|
| 161/162 | `CLUSTER_UNIFORM_SHIFT_FORWARD` | uniform forward shift |
| 163/164 | `CLUSTER_UNIFORM_SHIFT_BACKWARD` | uniform backward shift |
| 165/166 | `CLUSTER_POSITIONAL_FIXED_SHIFTS` | fixed position-dependent vector |
| 167/168 | `CLUSTER_ALTERNATING_SIGN_SHIFT` | alternating plus/minus shift |
| 169/170 | `CLUSTER_INCREASING_SHIFT` | increasing positional movement |
| 171/172 | `CLUSTER_DECREASING_SHIFT` | decreasing positional movement |
| 173/174 | `CLUSTER_REVERSE` | reverse complete order |
| 175/176 | `CLUSTER_ADJACENT_PAIR_SWAP` | exchange adjacent pairs |
| 177/178 | `CLUSTER_FIRST_LAST_SWAP` | exchange first and last |
| 179/180 | `CLUSTER_ROTATE_LEFT` | rotate left |
| 181/182 | `CLUSTER_ROTATE_RIGHT` | rotate right |
| 183/184 | `CLUSTER_OPPOSITE_SUBSTITUTION` | opposite alphabet letters |
| 185/186 | `CLUSTER_ODD_POSITION_TRANSFORM` | transform odd positions |
| 187/188 | `CLUSTER_EVEN_POSITION_TRANSFORM` | transform even positions |
| 189/190 | `CLUSTER_REVERSE_THEN_SHIFT` | reverse then positional shift |
| 191/192 | `CLUSTER_SHIFT_THEN_REVERSE` | positional shift then reverse |
| 193/194 | `CLUSTER_DELETE_POSITION` | delete named position |
| 195/196 | `CLUSTER_INSERT_DERIVED_LETTER` | insert derived letter |
| 197/198 | `CLUSTER_NEIGHBOUR_EXPANSION` | expand to alphabet neighbours |
| 199/200 | `CLUSTER_TWO_STAGE_MIXED` | whitelisted two-stage transform |
| 201/202 | `CLUSTER_HALF_BLOCK_SWAP` | exchange equal outer blocks |
| 203/204 | `CLUSTER_REVERSE_EACH_BLOCK` | reverse each half/outer block |
| 205/206 | `CLUSTER_PARITY_REGROUP` | regroup odd/even positions |
| 207/208 | `CLUSTER_ALPHABETICAL_SORT` | alphabetic ascending/descending sort |

Odd IDs use direct completion; even IDs use pair selection.

## 3. Runtime file set

```text
ANA-CP-006/
  ana-cp-006-coverage-audit.md
  ana-cp-006-implementation-plan.md
  question-language.en.ts
  rule-definitions.ts
  independent-solver.ts
  ambiguity-checker.ts
  option-validator.ts
  generator.ts
  task-registry.ts
  localized-runtime.ts
  ana-cp-006.test.ts
  ana-cp-006-localized.test.ts
  export-review.ts
  export-localized-review.ts
  ana-cp-006-implementation-report.md
```

## 4. Typed rule context

The checkpoint uses one discriminated context union. Each context stores the complete hidden operation; no answer-producing parameter is recovered from rendered text.

Conceptual shape:

```ts
type ClusterRuleContext =
  | { kind: "UNIFORM_SHIFT"; shift: number }
  | { kind: "POSITION_VECTOR"; shifts: readonly number[] }
  | { kind: "ALTERNATING_SIGN"; magnitude: number; firstSign: 1 | -1 }
  | { kind: "PROGRESSIVE_SHIFT"; direction: 1 | -1; start: number; delta: 1 | -1 }
  | { kind: "ROTATION"; count: number }
  | { kind: "POSITION_CLASS_SHIFT"; shift: number }
  | { kind: "ORDERED_POSITION_VECTOR"; shifts: readonly number[] }
  | { kind: "DELETE_POSITION"; positionRule: DeletePositionRule }
  | { kind: "INSERT_DERIVED"; derivation: InsertDerivation; insertionRule: InsertionRule }
  | { kind: "NEIGHBOUR_EXPANSION"; order: "PREV_NEXT" | "NEXT_PREV" }
  | { kind: "TWO_STAGE"; profile: TwoStageProfile; params: ... }
  | { kind: "PARITY_REGROUP"; profile: ParityProfile }
  | { kind: "ALPHABETICAL_SORT"; direction: "ASC" | "DESC" }
  | { kind: "FIXED" };
```

A stable canonical serializer supplies context fingerprints and exact equality checks.

## 5. Rule-definition contract

Every registered rule exposes:

```ts
interface ClusterRuleDefinition {
  id: ClusterRuleId;
  label: string;
  priority: number;
  supportedLengths: readonly number[];
  contextsForLength(length: number): readonly ClusterRuleContext[];
  apply(cluster: string, context: ClusterRuleContext): string | null;
  explain(cluster: string, output: string, context: ClusterRuleContext): ClusterExplanationStep;
  deriveTraps(cluster: string, context: ClusterRuleContext): readonly TrapCandidate[];
}
```

`apply` is total. Invalid length, context or domain returns `null`; ambiguity discovery must never throw because another rule is ineligible.

## 6. Independent solver

The independent solver owns:

- cluster validation;
- context equality;
- rule lookup;
- independent application of every primitive;
- matching all eligible rule/context pairs against evidence;
- exact transfer verification;
- inverse-safe option validation where applicable.

The solver must not call the generator’s answer-construction helper. Shared low-level alphabet utilities are allowed; high-level rule execution is independently implemented.

## 7. Ambiguity model

Generation evidence consists of both source and target pairs, not one pair alone.

Acceptance requires:

1. intended rule and exact context explain all displayed evidence;
2. no different rule/context with equal or lower priority explains all evidence;
3. no simpler structural schema explains the same order mapping;
4. no candidate option creates a valid alternative relation with the source pair;
5. exactly one option satisfies the intended rule;
6. pair-selection distractors fail both intended and competing eligible rules.

Editorial priorities:

- priority 1: uniform shift, whole reverse, opposite substitution;
- priority 2: simple rotations, adjacent/first-last exchange, alphabetical sort;
- priority 3: named position/parity/block rules;
- priority 4: general fixed position vectors and length changes;
- priority 5: ordered composite families;
- priority 6: two-stage mixed profiles.

The general positional-vector rule never outranks a named simple pattern.

## 8. Generator design

### Candidate construction

For every QL and seed:

1. select difficulty target;
2. select cluster length allowed by the rule;
3. select a deterministic context;
4. generate a source cluster and output;
5. generate a distinct target cluster and output;
6. reject identity or degenerate results;
7. reject rule collisions;
8. enforce requested instance difficulty;
9. build four independently checked options;
10. place the correct option deterministically and evenly;
11. render stem and explanation.

All retries are deterministic and bounded.

### Cluster generation

Use a seeded PRNG and controlled cluster profiles:

- distinct-letter clusters;
- limited duplicate clusters where safe;
- edge-letter clusters to exercise wrapping;
- central-letter clusters for easier instances;
- odd/even lengths required by block and middle-position rules.

Generated clusters are not required to form words. Accidental offensive or confusing letter sequences must be filtered by a small denylist.

### Correct-answer placement

Use `seed + QL identity` to schedule correct indices so every QL reaches exact or near-exact balance over the audit seed range.

## 9. Distractor construction

Distractors are generated from diagnosed wrong operations before any generic mutation is considered.

Preferred order:

1. selected rule’s explicit trap candidates;
2. simpler neighbouring rule output;
3. operation-order reversal;
4. off-by-one parameter;
5. bounded one-character correction;
6. deterministic fallback cluster rejected against the full rule pool.

Every distractor stores a specific error label. The explanation’s trap note is derived from the selected closest distractor, not a checkpoint-wide generic sentence.

## 10. Renderer and stem style

The renderer remains structured text. Candidate-facing wording must resemble competitive-exam questions.

English examples:

```text
ABCD : BCDE :: WXYZ : ?

Select the letter-cluster pair that follows the same relationship as ABCD : BCDE.
```

Avoid authoring-framework language such as “branch”, “hidden fingerprint”, “structured transform”, or “runtime rule”.

Layouts:

- `INLINE`;
- `ARROW`;
- `TWO_ROW_TABLE`;
- `BOXED_PAIRS`.

## 11. Explanation strategy

Explanation traces contain:

- natural rule statement;
- concise source demonstration;
- target application;
- conclusion;
- one selected-trap rejection.

For position-vector questions, show a compact indexed row rather than prose for every character when that is clearer.

For structural questions, show grouping marks:

```text
GLI | D | ERS → ERS | D | GLI
```

For two-stage questions, show Stage 1 and Stage 2 separately.

## 12. Localization

Hindi and Punjabi preserve the Latin cluster values and option order exactly.

Localized runtime translates:

- task instruction;
- rule statement;
- source demonstration;
- target application;
- conclusion;
- selected trap note;
- table headings.

No English explanation sentence may leak into localized output. Internal IDs must never appear.

## 13. Difficulty computation

Use a five-factor score:

- rule complexity;
- transformation count;
- information density;
- distractor proximity;
- inference depth.

Suggested mapping:

- score 1–2: Easy;
- score 3: Medium;
- score 4–5: Hard.

The final audit should approximate 35/45/20 across the generated corpus. QL baseline difficulty is not a permanent runtime label.

## 14. Test plan

### Registry and schema

- 48 unique continuous QLs `161..208`;
- exact 24-rule order;
- two presentation modes per rule;
- canonical task, solve, renderer and locale contracts;
- no stale old `201..220` CP-007 ownership inside repository design docs.

### Rule unit tests

- known fixture for every context family;
- cyclic boundary cases;
- odd/even length block behavior;
- identity rejection;
- output-length contracts;
- context serialization and equality;
- reverse/shift operation-order distinction.

### Collision audit

- symbolic collision assertions for known algebraic relationships;
- fingerprint comparison over representative clusters, lengths and contexts;
- explicit priority rejection tests;
- general position vectors cannot duplicate simpler named vectors;
- structural permutations reject accidental duplicates.

### English exhaustive audit

Initial target:

- 48 QLs × 100 seeds = 4,800 generated questions.

Checks:

- deterministic repeat generation;
- exactly four unique options;
- exactly one correct answer;
- independent solver parity;
- ambiguity acceptance;
- full layout coverage;
- all difficulty bands;
- answer-position balance;
- minimum stem variety per QL;
- no unresolved placeholders or internal IDs;
- no generic trap note disconnected from selected errors.

### Localized audit

Initial target:

- 48 QLs × 50 seeds × 2 locales = 4,800 localized questions.

Checks:

- English/localized structural parity;
- identical options and correct index;
- Hindi/Punjabi script presence;
- no English instruction leakage;
- no prohibited Punjabi terminology;
- localized trap-note parity;
- all 24 families represented in both languages.

## 15. Review exports

English review:

- six samples per QL;
- 288 questions;
- selected seeds cover lengths, wrap, difficulty and layout variation.

Localized reviews:

- four samples per QL per locale;
- 192 Hindi and 192 Punjabi questions.

Each sample includes stem, options, answer, rule, source, target, conclusion and selected trap note.

## 16. Integration and publication

CP-006 remains isolated from chapter discovery until:

1. both audits pass;
2. review exports are inspected;
3. source-backed fixture patterns pass;
4. no high-severity language or ambiguity issue remains;
5. user explicitly approves merge/integration.

Implementation may be merged as non-public runtime proof without enabling Question Studio publication.

## 17. Implementation sequence

1. QL registry and typed contexts.
2. Primitive and structural rule definitions.
3. Independent solver and context matcher.
4. Ambiguity checker and collision fixtures.
5. Deterministic English generator.
6. Option validator and trap-driven distractors.
7. English exhaustive audit and exporter.
8. Hindi/Punjabi runtime.
9. Localized audit and exporter.
10. Implementation report and merge-readiness review.