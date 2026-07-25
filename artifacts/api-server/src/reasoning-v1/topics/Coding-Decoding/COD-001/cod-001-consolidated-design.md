# ExamTree Reasoning V1 — COD-001 Consolidated Design

Document status: final end-to-end chapter design. Runtime implementation is not claimed.

## 1. Product objective

COD-001 must generate competitive-exam coding-decoding questions that feel authored for SSC, Banking, Railways and Punjab state examinations. It must not behave like a toy cipher generator.

A valid Coding–Decoding question contains five logical parts:

```text
hidden code system
displayed evidence
query direction
candidate answers
proof of uniqueness
```

The hidden system is authoritative. Stems, options and explanations are derived from it.

## 2. Core domain model

The implementation should expose concepts equivalent to:

```ts
type CodingLocaleMode =
  | "TRANSLATABLE"
  | "LANGUAGE_ADAPTED"
  | "LANGUAGE_SPECIFIC";

type CodingAnswerType =
  | "LETTER_CLUSTER"
  | "DIGIT_SEQUENCE"
  | "SYMBOL_SEQUENCE"
  | "MIXED_CODE_SEQUENCE"
  | "NUMBER"
  | "WORD_OR_LABEL"
  | "SINGLE_CODE_TOKEN"
  | "CODE_TOKEN_SET";

interface CodingQuestionLogic {
  qlId: string;
  checkpointId: string;
  ruleId: string;
  taskKind: string;
  solveMode: string;
  presentationMode: string;
  answerType: CodingAnswerType;
  renderer: string;
  localeMode: CodingLocaleMode;
  difficultyProfile: string;
  eligibleCompetingRuleIds: readonly string[];
  status: "DRAFT" | "IMPLEMENTED" | "REVIEWED" | "FROZEN";
}

interface HiddenCodeSystem {
  family: string;
  parameters: Readonly<Record<string, unknown>>;
  encode(input: CodeValue): CodeValue;
  decode?(input: CodeValue): readonly CodeValue[];
  fingerprint: string;
}

interface CodingEvidence {
  source: CodeValue;
  encoded: CodeValue;
  displayRole: "EXAMPLE" | "TARGET" | "CONDITION";
}

interface CodingQuery {
  direction: "ENCODE" | "DECODE" | "INFER_TOKEN" | "POSSIBLE_TOKEN";
  target: CodeValue;
  expectedAnswerType: CodingAnswerType;
}
```

The independent solver must reconstruct the answer from the structured hidden system and displayed evidence without calling the generator's answer helper.

## 3. Standard generation pipeline

```text
QL lookup
  -> seeded PRNG
  -> hidden code-system construction
  -> safe source-data selection
  -> evidence construction
  -> evidence sufficiency audit
  -> query construction
  -> independent solve
  -> eligible-rule ambiguity audit
  -> distractor construction
  -> independent option validation
  -> deterministic shuffle
  -> renderer payload construction
  -> explanation trace
  -> localization
  -> final contract validation
```

Candidate rejection must be deterministic and bounded. Every checkpoint defines its own maximum attempts and failure diagnostics.

## 4. Shared COD-001 foundation

The chapter foundation should be local to COD-001 until reuse is proven.

### 4.1 Alphabet utilities

Required operations:

- forward alphabet rank `A=1` to `Z=26`;
- reverse rank `Z=1` to `A=26`;
- cyclic forward and backward shifts;
- opposite-letter mapping;
- vowel/consonant classification;
- odd/even and endpoint/interior positions;
- stable character normalization;
- repeated-character tracking;
- position permutations and inverse permutations.

### 4.2 Code-value utilities

The runtime must distinguish structured values rather than treating every result as an untyped string.

```ts
type CodeValue =
  | { kind: "WORD"; value: string }
  | { kind: "LETTER_CLUSTER"; value: string }
  | { kind: "DIGIT_SEQUENCE"; value: readonly number[] }
  | { kind: "SYMBOL_SEQUENCE"; value: readonly string[] }
  | { kind: "MIXED_SEQUENCE"; value: readonly string[] }
  | { kind: "NUMBER"; value: number }
  | { kind: "TOKEN"; value: string }
  | { kind: "TOKEN_SET"; value: readonly string[] };
```

Canonical serialization is required for option uniqueness and fingerprints.

### 4.3 Mapping utilities

Direct mappings must support:

- injective and bijective mapping creation;
- partial visible mappings;
- overlap-based inference;
- repeated-input consistency;
- inverse lookup;
- unmapped-token rejection;
- stable symbol-pool allocation.

### 4.4 Constraint utilities

Sentence coding and conditional coding require:

- bipartite word-token candidate sets;
- intersection and exclusion propagation;
- enumeration of all remaining valid mappings;
- proof of unique answer or proof that an option is merely possible;
- condition applicability calculation;
- explicit precedence evaluation.

## 5. Checkpoint designs

## 5.1 COD-CP-001 — Direct substitution mapping

Purpose: infer or apply a stable one-to-one code mapping.

Supported outputs:

- letter to letter;
- letter to digit;
- letter to symbol;
- partial mapping inferred from overlapping examples.

Safe-domain requirements:

- source words normally contain 4–8 letters;
- repeated letters are deliberately sampled in part of the corpus;
- the visible examples cover every target character needed for a unique answer;
- direct maps are injective over the active alphabet subset;
- symbol options have equal visual complexity.

Independent solver:

1. derive character mappings from every example;
2. reject inconsistent mappings;
3. verify repeated-character consistency;
4. encode or decode the target;
5. reject a decode query if more than one inverse remains.

Primary ambiguity risk: a displayed example accidentally also fits a simple shift or rearrangement. The eligible pool includes CP-003 and CP-005 simple rules when the output type permits them.

Preferred distractors:

- one character mapped using a neighboring example;
- two positions exchanged;
- correct mapping with one repeated character mishandled;
- inverse mapping applied in the wrong direction.

## 5.2 COD-CP-002 — Alphabet-rank and aggregate number coding

Purpose: encode words using alphabet positions or bounded aggregate functions.

Sequence-output rules and single-number aggregate rules must be treated separately.

Safe-domain requirements:

- word length 3–8;
- aggregate answers remain positive and exam-appropriate;
- weighted rules use bounded weights;
- multiple examples are mandatory for aggregate rules with plausible competitors;
- target words differ in length when length-sensitive rules must be distinguished.

Ambiguity pool includes all nine CP-002 rules. A question is rejected when the same evidence fits an equal-or-simpler aggregate.

Special collision policy:

- reverse-rank sum may equal a simple affine transform of forward-rank sum for fixed word length; evidence must vary length or the rule is rejected;
- plus-length and minus-length rules need evidence that distinguishes the sign;
- odd-even and weighted aggregates require words that activate both subsets.

Preferred distractors:

- forward ranks instead of reverse ranks;
- omitted constant;
- constant applied once instead of per character;
- sum used instead of sequence;
- length adjustment with the wrong sign;
- odd and even groups reversed.

## 5.3 COD-CP-003 — Uniform alphabet transformations

Purpose: encode or decode every character by one cyclic shift or by opposite-alphabet mapping.

Canonical rules:

- `UNIFORM_CYCLIC_SHIFT` with signed parameter;
- `OPPOSITE_ALPHABET_MAP`.

Forward and backward shifts are one parameterized rule. Fixed special cases such as ROT13 must not be separately registered because they collide with the general rule.

Evidence policy:

- a shift must be inferable from at least two non-identical character correspondences;
- wrap-around must appear in audited coverage but not every question;
- opposite mapping must not be mistaken for a shift over the displayed subset;
- decode queries use the independently derived inverse.

Distractors:

- wrong direction;
- off-by-one shift;
- no cyclic wrap;
- opposite mapping;
- correct rule applied to the wrong target position.

## 5.4 COD-CP-004 — Position- and class-dependent transformations

Purpose: apply a shift that changes by position or character class.

Rules:

- incremental forward;
- incremental backward;
- alternating signed;
- odd/even position;
- vowel/consonant class;
- endpoint/interior class.

Safe-domain requirements:

- source length activates every branch of the rule;
- vowel/consonant words contain both classes;
- endpoint/interior questions have at least one interior character;
- alternating rules use lengths that reveal more than one cycle;
- wrap behavior is explicit in the solver.

Ambiguity checker matches the evidence against the full CP-003 and CP-004 pool. Simpler uniform shifts take priority over position-dependent rules.

Distractors encode one diagnosed error:

- start index zero versus one;
- alternating phase reversed;
- odd/even classes swapped;
- vowel/consonant classes swapped;
- first-position shift applied to all positions;
- final position skipped.

## 5.5 COD-CP-005 — Rearrangement and transposition

Purpose: change positions without changing character identities.

Rules:

- full reversal;
- cyclic rotation;
- half swap;
- odd-then-even extraction;
- even-then-odd extraction;
- outer-inner interleaving.

Every rule must expose an inverse permutation. Decode questions are accepted only when inversion is unique.

Degeneracy rejection:

- palindromes are not used for reversal inference;
- repeated letters may not hide a moved position;
- identical halves are rejected for half swap;
- a rotation that reproduces the original word is rejected;
- odd/even extraction must visibly differ from unchanged order.

Distractors:

- reverse instead of rotate;
- rotate in the opposite direction;
- swap the wrong halves;
- even-first instead of odd-first;
- one endpoint omitted from interleaving.

## 5.6 COD-CP-006 — Composite multi-stage word coding

Purpose: combine two active stages that cannot be reduced to a registered simpler rule over the displayed evidence.

The hidden system stores an ordered normalized stage list.

```ts
interface CodingStage {
  stageId: string;
  parameters: Readonly<Record<string, number | string | boolean>>;
  positionReference: "SOURCE" | "AFTER_PREVIOUS_STAGE";
}
```

Non-negotiable checks:

- both stages alter the selected input;
- the final output does not match any single-stage rule in CP-003, CP-004 or CP-005;
- equivalent commuting orders are canonicalized to one rule;
- the explanation names both stages in the order actually used;
- options include partial-stage traps but none may accidentally satisfy the complete rule.

Difficulty is driven by stage interaction, not word length alone.

Preferred distractors:

- stop after stage one;
- apply only stage two to the source;
- reverse stage order when order matters;
- use the right operations with the wrong position reference;
- use an off-by-one shift in stage two.

## 5.7 COD-CP-007 — Digit, symbol and alphanumeric coding

Purpose: encode numeric strings or mixed tokens without becoming an arithmetic-operator chapter.

Included:

- direct digit substitution;
- digit-to-symbol tables;
- modular digit shifts;
- digit permutations;
- position-wise digit transforms;
- mixed letter-digit token mappings.

Excluded:

- evaluating equations after operator substitution;
- inequalities;
- long arithmetic calculations unrelated to encoding.

Safe-domain requirements:

- leading-zero behavior is explicit;
- modular operations use base 10 unless the stem explicitly states another bounded base;
- fixed-width codes preserve width when required;
- digit mappings are injective for decode tasks;
- mixed tokens have canonical separators to avoid parsing ambiguity.

Distractors:

- ordinary addition instead of digit-wise modular change;
- dropped leading zero;
- reversed digit order;
- wrong table direction;
- transformation applied to only one digit class.

## 5.8 COD-CP-008 — Renaming and substitution coding

Purpose: reason about entities whose displayed names have been reassigned.

This checkpoint is not a letter cipher. It uses a directed referent graph.

Example conceptual model:

```text
actual entity -> displayed substitute name
```

The solver first resolves the actual entity required by the question, then returns the name assigned to that entity under the hidden substitution map.

Datasets must contain stable, culturally neutral categories such as:

- professions and functions;
- common objects and uses;
- colours;
- days and months;
- animals and habitats;
- institutions and roles.

Questions must not depend on disputed facts, stereotypes or culturally sensitive assumptions.

Ambiguity risks:

- answering with the actual entity rather than its renamed label;
- following the chain in the wrong direction;
- stopping one edge too early;
- confusing the name of a function with the performer.

Hindi and Punjabi use separately authored natural datasets, not literal replacement of English labels.

## 5.9 COD-CP-009 — Sentence and artificial-language coding

Purpose: infer arbitrary word-token mappings from several coded statements.

Generation model:

1. select a locale-specific vocabulary set;
2. generate a hidden bijection between words and arbitrary code tokens;
3. compose statements from the words;
4. render each statement and its shuffled token set;
5. run a constraint solver over only the displayed evidence;
6. construct a query with exactly one correct option, or a formally defined possible-code answer.

The order of code tokens should normally be irrelevant unless a QL explicitly defines positional coding. The structured prompt must preserve statement-token membership as sets.

Solver requirements:

- derive candidate tokens by set intersection;
- propagate exclusions;
- enumerate all consistent bijections when necessary;
- prove uniqueness for `IDENTIFY_*` tasks;
- prove membership in at least one but not all solutions for `POSSIBLE_CODE` tasks;
- reject a puzzle when an unlisted alternative would also be reasonable.

Dataset policy:

- statements should be short, natural and semantically coherent;
- repeated boilerplate sentence skeletons are capped;
- words within one puzzle are unique after locale normalization;
- tokens are short pronounceable or neutral strings without unintended meaning;
- Hindi and Punjabi grammar is authored natively.

Distractors:

- token belonging to another common word;
- token excluded by one statement but retained by a shallow intersection;
- token valid only when statement order is wrongly treated as significant;
- code of a related phrase rather than the requested word.

## 5.10 COD-CP-010 — Conditional table and mixed-symbol coding

Purpose: apply a lookup table and one or more explicit override conditions.

Structured prompt:

```ts
interface ConditionalCodingPrompt {
  mappingRows: readonly MappingRow[];
  conditions: readonly CodingCondition[];
  precedence: "FIRST_MATCH" | "LAST_MATCH" | "COMPOSE_ALL";
  source: CodeValue;
}
```

Condition families:

- endpoint classes;
- vowel/consonant combinations;
- repeated-character behavior;
- positional overrides;
- ordered multi-condition systems.

The generator should prefer mutually exclusive conditions. When overlap is intentional, precedence must be student-visible and independently tested.

Option validation must re-evaluate the complete table and condition system. A distractor may represent one missed condition, but it cannot be correct under another valid precedence interpretation.

## 6. Evidence sufficiency and ambiguity architecture

Every checkpoint exposes:

```ts
matchingCodingRules(evidence, eligibleRuleIds): readonly CodingRuleMatch[]
```

A candidate is rejected when:

- a lower-priority rule fits all examples;
- an equal-priority rule produces the same target answer;
- the displayed examples do not determine a unique parameter;
- a decode query has multiple valid inverses;
- a composite rule collapses to one active stage;
- sentence constraints admit multiple answers for a uniqueness task;
- conditions permit more than one precedence interpretation.

Rule priority follows likely student interpretation:

1. direct substitution or single lookup;
2. one-stage uniform rule;
3. one-stage positional or permutation rule;
4. aggregate or conditional rule;
5. multi-stage composite;
6. open constraint deduction.

The priority model does not prevent a complex rule from being correct; it ensures the displayed evidence genuinely requires it.

## 7. Distractor contract

Each wrong option stores a machine-readable error label.

Recommended labels:

- `WRONG_DIRECTION`
- `OFF_BY_ONE_SHIFT`
- `NO_WRAP_APPLIED`
- `REPEATED_CHARACTER_MISMATCH`
- `INVERSE_MAPPING_ERROR`
- `WRONG_POSITION_CLASS`
- `ALTERNATION_PHASE_ERROR`
- `WRONG_PERMUTATION_DIRECTION`
- `PARTIAL_STAGE_ONLY`
- `STAGE_ORDER_ERROR`
- `FORWARD_RANK_INSTEAD_OF_REVERSE`
- `OMITTED_LENGTH_ADJUSTMENT`
- `DIGIT_WISE_VS_WHOLE_VALUE_ERROR`
- `LEADING_ZERO_DROPPED`
- `RENAMING_DIRECTION_ERROR`
- `COMMON_WORD_INTERSECTION_ERROR`
- `INSUFFICIENT_EXCLUSION`
- `MISSED_CONDITION`
- `WRONG_CONDITION_PRECEDENCE`

Every distractor must be independently evaluated and must fail the intended hidden system.

## 8. Explanation design

A Coding–Decoding explanation trace should contain:

```ts
interface CodingExplanationTrace {
  observedEvidence: readonly string[];
  inferredRule: string;
  sourceDemonstration: readonly string[];
  targetApplication: readonly string[];
  conclusion: string;
  closestTrapRejection?: string;
}
```

Requirements:

- use actual generated letters, numbers, tokens and conditions;
- explain how the evidence identifies the rule;
- show each active stage once and in order;
- state cyclic wrapping when it occurs;
- show intersection and exclusion steps for sentence coding;
- show condition selection and precedence for CP-010;
- never expose enum IDs;
- avoid generic explanations that merely restate the answer.

## 9. Word, token and symbol datasets

### 9.1 English transformation word pool

Metadata per word:

```ts
interface CodingWordEntry {
  id: string;
  value: string;
  length: number;
  repeatedLetterCount: number;
  vowelCount: number;
  hasWrapSensitiveLetters: boolean;
  symmetryFlags: readonly string[];
  suitability: readonly string[];
  status: "DRAFT" | "REVIEWED" | "APPROVED";
}
```

Pool rules:

- common, neutral words;
- no offensive, political or time-sensitive terms;
- sufficient repeated-letter and no-repetition subsets;
- no accidental palindromes where reversal must be visible;
- no words whose repeated characters hide required movement;
- stable uppercase normalization.

### 9.2 Code token pool

Artificial-language tokens should be 2–4 letters or similarly short neutral forms. Tokens must be unique within a puzzle and screened against accidental offensive or meaningful words in each locale.

### 9.3 Symbol pool

Symbols must render reliably in the web stack and review exports. Similar-looking symbols are not used together in one option set.

## 10. Difficulty model

Difficulty score uses:

- rule complexity;
- transformations required;
- evidence density;
- inference depth;
- distractor proximity;
- query direction;
- renderer complexity.

Examples:

- Easy: one direct map, one uniform shift, or simple reversal with clear evidence.
- Medium: parameter inference, alternating rules, inverse decoding, partial map completion, or three-statement token deduction.
- Hard: active composite stages, close competing rules, five-statement exclusion, or overlapping conditional rules with explicit precedence.

Increasing word length alone does not justify a higher difficulty label.

## 11. Localization design

### 11.1 CP-001 to CP-007 and CP-010

Latin letters, digit strings and arbitrary symbols remain unchanged across locales. Translate only:

- instructions;
- table labels;
- condition text;
- explanation prose;
- option labels where applicable.

This preserves exact answer and layout parity.

### 11.2 CP-008 and CP-009

Use locale-adapted datasets.

Hindi and Punjabi versions preserve:

- hidden graph or mapping structure;
- statement count;
- overlap pattern;
- query type;
- solution multiplicity;
- difficulty;
- correct option index where practical.

They do not need literal word-for-word parity.

Punjabi terminology should prefer natural exam language such as `ਸ਼ਬਦ`, `ਕੋਡ`, `ਅੱਖਰ` and `ਚਿੰਨ੍ਹ`.

### 11.3 Locale audits

- Unicode script presence;
- no unexplained English prose fragments;
- answer parity;
- hidden-system fingerprint parity for translatable CPs;
- equivalent constraint count for adapted CPs;
- natural grammar and agreement;
- no banned terminology;
- no unresolved placeholders.

## 12. Renderer design

### `INLINE_CODE_PAIR`

For short transformations:

```text
MOBILE -> OQDKNG
FACEBOOK -> ?
```

### `EXAMPLE_TARGET_BLOCK`

For two or more evidence examples followed by one target.

### `MAPPING_TABLE`

For direct lookup and symbol mappings.

### `STATEMENT_CODE_GRID`

For artificial-language sentences and token sets. Structured rows must preserve statement membership independently of visual order.

### `CONDITION_TABLE`

For lookup tables plus numbered conditions and precedence.

All renderer payloads require schema validation.

## 13. Question Studio integration

Question Studio must expose:

- package and CP selector;
- exact QL selector;
- locale;
- seed;
- requested difficulty;
- hidden-system fingerprint for reviewers only;
- structured evidence;
- rule-match audit result;
- option error labels;
- explanation trace;
- checkpoint maturity status;
- review export action.

Student-facing previews must never display hidden maps or internal rule IDs unless the QL intentionally includes a mapping table.

## 14. Proposed repository layout

```text
COD-001/
  README.md
  cod-001-source-audit.md
  cod-001-chapter-manifest.md
  cod-001-consolidated-design.md
  cod-001-implementation-plan.md
  chapter-manifest.ts
  index.ts
  generation-engine.ts
  chapter-audit.ts
  export-review.ts
  foundation/
    types.ts
    code-value.ts
    alphabet.ts
    mapping.ts
    permutation.ts
    constraint-solver.ts
    seeded-rng.ts
    option-validator.ts
    renderer-contracts.ts
    explanation.ts
  datasets/
    words.en.ts
    symbols.ts
    code-tokens.ts
  localization/
    instructions.en.ts
    instructions.hi.ts
    instructions.pa.ts
    terminology.ts
  COD-CP-001/
  COD-CP-002/
  COD-CP-003/
  COD-CP-004/
  COD-CP-005/
  COD-CP-006/
  COD-CP-007/
  COD-CP-008/
  COD-CP-009/
  COD-CP-010/
```

Each runtime checkpoint follows the standard Reasoning V1 checkpoint responsibilities: question language, rules, generator, independent solver, ambiguity checker, option validator, tests, localized runtime and review exporters.

## 15. Chapter-wide freeze conditions

COD-001 is freeze-ready only when:

- all 260 QLs match the manifest;
- all 54 named rule families are registered exactly once;
- registry-level collision audits pass;
- every QL passes deterministic stress generation;
- independent solving and option validation pass;
- no evidence-insufficient questions survive;
- composite stages remain active;
- sentence-code answers are formally proven;
- conditional precedence is unique;
- answer-position and renderer distributions pass;
- English review is complete;
- Hindi and Punjabi parity and native-language review are complete;
- Question Studio discovery and preview work;
- implementation reports accurately distinguish written, executed and reviewed gates.

Until those conditions are met, the package remains non-publishable.