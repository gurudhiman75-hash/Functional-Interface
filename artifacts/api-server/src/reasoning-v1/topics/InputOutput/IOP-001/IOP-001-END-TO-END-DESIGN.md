# IOP-001 — End-to-End Design Authority

Status: **design authority + Checkpoint A executable foundation**.

## 1. Product boundary

`IOP-001 — Machine Input–Output & Sequential Rearrangement` implements the student-facing Reasoning chapter `REAS-INP`.

The core learner task is:

```text
study an illustrated machine trace
  -> infer the deterministic rule
  -> apply the same rule to a new input
  -> answer questions about intermediate/final states
```

A static sorting/rearrangement question without stepwise machine inference is not automatically Input–Output.

## 2. Governing design principles

1. Build a valid machine rule first; never reverse-engineer a rule from an answer.
2. Every visible step must be generated from the canonical rule and token state.
3. A materially separate oracle must reconstruct the complete trace.
4. Every illustrated rule must pass an adversarial identifiability audit.
5. Equivalent simultaneous action orders collapse into one semantic rule.
6. No permanent QL count is predetermined.
7. Query/stem variants do not automatically become separate QLs.
8. Difficulty comes from the generated machine state and query burden.
9. Latin logic-bearing tokens are preserved during later Hindi/Punjabi localization unless a native-script machine is independently authorized.
10. Question Studio remains off until whole-chapter closure.

## 3. Planned checkpoint architecture

### IOP-CP-001 — Basic One-Sided Rearrangement

Foundation forms:

- words in alphabetical/reverse-alphabetical selection;
- numbers in ascending/descending selection;
- one item fixed per visible step;
- left-fixed and right-fixed placement semantics;
- stable token identity across movement.

### IOP-CP-002 — Mixed Word–Number Rearrangement

Owns machines where words and numbers coexist and one category is completed before another.

Discovery dimensions:

- numbers then words;
- words then numbers;
- ascending/descending combinations;
- left/right fixed regions;
- category-transition semantics.

### IOP-CP-003 — Double-Ended & Simultaneous Rearrangement

Owns machines where two placements occur in one visible step.

The two actions are semantically simultaneous. Internal execution order must not create false distinct rules.

### IOP-CP-004 — Alternating & Interleaved Machines

Owns repeating action cycles such as:

```text
number action -> word action -> number action -> word action
```

or:

```text
left action -> right action -> left action -> right action
```

This differs from CP003 because only one action occurs in a visible step.

### IOP-CP-005 — Attribute-Based Selection & Rearrangement

Future discovery only. Candidate source-backed selectors may include word length, first/last letter, digit sum, digit position and other visible attributes. A property enters permanent production only after source evidence; generator possibility alone is insufficient.

### IOP-CP-006 — Numeric Operation Machines

Future discovery for machines that transform numbers as well as rearrange them. Pure Number-System calculation without machine inference remains outside IOP ownership.

### IOP-CP-007 — Word & Alphanumeric Transformation Machines

Future discovery for stepwise word/alphanumeric transformations. Static word-to-code mapping remains Coding–Decoding ownership.

### IOP-CP-008 — Multi-Stage Transformation Machines

Future Banking-Mains-style pipeline authority:

```text
transform -> rearrange -> derive -> transform/reduce
```

Complexity must remain exam-readable and must not become a programming puzzle.

### IOP-CP-009 — Box / Table / Cell Input–Output

Future structured representation authority. Box/table state must be stored semantically and rendered from structure; textual alignment hacks are prohibited.

### IOP-CP-010 — Reverse, Missing-State & Machine Synthesis

Future advanced queries:

- missing step;
- predecessor state;
- missing token/value;
- step-number inference;
- valid/invalid state;
- same-rule transfer;
- incomplete-trace synthesis.

Reverse tasks are allowed only when the displayed evidence uniquely determines the predecessor.

## 4. Canonical machine model

The foundation uses:

```text
IopMachineRule
  schedule
  phases[]
    eligible token kind
    selection key
    selection direction
    placement side
```

Current Checkpoint-A selection keys:

```text
ALPHABETICAL
NUMERIC_VALUE
```

Current schedules:

```text
SINGLE_PHASE
BLOCKED_PHASES
ALTERNATING_PHASES
SIMULTANEOUS_PHASES
```

Future CP005–CP010 work may extend the typed rule model rather than bypass it.

## 5. Stable token identity

Every token has a stable ID independent of display position:

```text
id
kind
visibleValue
originalPosition
```

Movement and later transformation must operate on IDs, not only on strings. This prevents loss of provenance when a token moves repeatedly or when future operation machines change its displayed value.

## 6. Trace authority

A generated machine produces:

```text
input
step 1
step 2
...
final
```

Every step stores the actions that produced it.

Required invariants:

- no token loss or creation;
- no duplicate visible states;
- no empty visible step;
- every moved token is eligible for the active phase;
- fixed regions remain fixed under the rule;
- final state is reached deterministically;
- demonstration and target input use the same semantic rule fingerprint.

## 7. Independent oracle

The production executor selects and moves tokens using the live transition engine.

The oracle independently:

- scans the eligible pool;
- selects the next token from declared ordering semantics;
- reconstructs placement positions;
- advances schedule state independently;
- rebuilds the complete trace.

Every generated demonstration and target trace must match the oracle state-for-state.

## 8. Rule-identifiability gate

This is the chapter's defining correctness gate.

For every demonstration:

1. build a competing grammar from the visible token domain;
2. execute plausible single, blocked, alternating and simultaneous rules;
3. compare the complete visible trace, not just the final output;
4. collapse semantically equivalent rule representations;
5. require exactly one matching semantic fingerprint;
6. require that fingerprint to equal the intended rule.

If a different rule also explains the displayed example, reject the input and regenerate.

## 9. Current competing-rule grammar

Checkpoint A tests combinations of:

- word/number eligibility;
- ascending/descending selection;
- left/right placement;
- phase ordering;
- single phase;
- blocked categories;
- alternating phases;
- simultaneous phases.

The grammar intentionally includes rules that are not permanent prototypes so ambiguity is measured adversarially rather than only against the 12 current candidates.

## 10. Input generation

Checkpoint A uses curated neutral English words and non-patterned two-digit numbers.

Generation must avoid:

- already-solved input;
- visible no-op steps;
- repeated token values;
- too-shallow traces;
- ambiguous demonstrations;
- deterministic visible collisions in the audited corpus.

Later source audits may introduce context-specific token pools.

## 11. Query architecture

A machine authority is separate from its child query representation.

Current discovery queries:

```text
STEP_OUTPUT
ELEMENT_AT_POSITION
POSITION_OF_ELEMENT
FINAL_OUTPUT
```

Future queries may include:

```text
STEP_NUMBER
NTH_FROM_RIGHT
BETWEEN_ELEMENTS
RELATIVE_POSITION
MISSING_STEP
PREVIOUS_STEP
VALID_STEP
INVALID_STEP
REMAINING_STEP_COUNT
SAME_RULE_OUTPUT
```

These are query contracts over a machine trace; they do not automatically justify new permanent QLs.

## 12. Caselet model

Input–Output is natively caselet-capable.

Current foundation produces:

```text
one illustrated machine
one new input
four child questions
```

Later Banking profiles may expose three-to-five child questions per machine with query diversity controls.

## 13. Distractor authority

Wrong options must correspond to plausible machine mistakes.

Current misconception classes include:

- previous step;
- next step;
- input mistaken for a step;
- wrong element at a position;
- wrong position of an element;
- wrong final state.

Future operation-machine distractors should include wrong transform order, missing transformation, doubled transformation, wrong side placement and wrong phase application.

Random untraceable distractors are not production authority.

## 14. Difficulty

Difficulty is derived from generated properties including:

- schedule type;
- mixed token domains;
- number of visible steps;
- simultaneous versus alternating burden;
- transformation depth;
- query depth;
- reverse or missing-state inference.

Large numbers alone must not create Hard difficulty.

## 15. Multilingual design

English is the only Checkpoint-A runtime.

Future Hindi/Punjabi localization will default to `LOGIC_TOKEN_PRESERVATION`:

- translate directions, question text and explanation;
- preserve Latin words/numbers when those tokens determine alphabetical machine logic;
- preserve token IDs, trace and answer index exactly.

Native Devanagari/Gurmukhi sorting machines require their own source and ordering authority and must not be produced by literal translation.

## 16. Ownership boundaries

### Alphabet Test

Static alphabet/sequence rearrangement remains Alphabet Test. Stepwise hidden-machine inference belongs to IOP.

### Coding–Decoding

Static mapping/code inference remains Coding–Decoding. Sequential state transformation belongs to IOP.

### Series

Series predicts the next member of a sequence. IOP transforms a complete finite state through visible steps.

### Mathematical Operations

Operator meaning/substitution remains Mathematical Operations. IOP may later use arithmetic as one phase only when machine inference dominates.

### Number System / Simplification

The mathematical property remains owned by its Quant chapter when it is the actual target. IOP owns only source-backed machine use of that property inside a sequential transformation.

### Seating / General Puzzles

Those infer a hidden arrangement from constraints. IOP applies a deterministic machine transformation to a supplied state.

## 17. Source-saturation protocol

Permanent allocation is prohibited until:

```text
source collection
-> temporary prototypes
-> executable waves
-> direct/inverse/representation gap audit
-> cross-chapter ownership audit
-> merge/split review
-> no-known-gap/source-saturation decision
-> permanent-count proposal
```

Current 12 prototype IDs are temporary and carry:

```text
DISCOVERY_HYPOTHESIS_PENDING_SOURCE_SATURATION
```

## 18. Question Studio policy

Do not integrate CPs individually.

After chapter closure, Question Studio should support:

- package/checkpoint/QL;
- exam profile;
- difficulty;
- machine type;
- token type;
- query type;
- step depth;
- seed;
- single-question or full-caselet generation.

Admin-only metadata should expose rule fingerprint, oracle evidence, identifiability evidence, source authority and misconception ownership.

## 19. Lifecycle

Current state:

```text
maturity:                    EXECUTABLE_DISCOVERY_PROOF
permanentQlCount:            0
questionStudioDiscoverable:  false
questionBankWritable:        false
testEligible:                false
publiclyPublishable:         false
Hindi/Punjabi:               NOT_STARTED
```

## 20. Implementation sequence

### Checkpoint A — current

- chapter authority;
- shared engine;
- independent oracle;
- identifiability grammar;
- CP001–CP004 executable discovery;
- proof and English review pack.

### Checkpoint B

- CP005–CP010 executable discovery;
- operation/transform AST extensions;
- box/table semantics;
- reverse/missing-state oracle extensions;
- advanced caselet queries.

### Checkpoint C

- source saturation;
- merge/split;
- permanent QL allocation;
- English exam-readiness review/freeze;
- Hindi/Punjabi parity;
- whole-chapter Question Studio integration;
- normal Question Bank/test/public lifecycle.
