# COD-CP-007 — Digit, Symbol and Alphanumeric Coding

Status: **end-to-end discovery design; no permanent QLs; English runtime not implemented**.

This checkpoint is governed by `../cod-001-open-ql-discovery-amendment.md`. No fixed QL count, permanent ID range or difficulty quota is created here.

---

## 1. Product objective

Generate competitive-exam coding questions in which the meaningful source or code domain contains digits, symbols or mixed alphanumeric tokens and the student must infer, apply or invert a deterministic coding rule.

A valid CP-007 question must require a material digit/symbol/alphanumeric operation. Merely replacing the letters in an already implemented CP-001–CP-006 question with digits is not enough.

The target exams are SSC, Banking, Railways and Punjab state examinations.

---

## 2. Core representation decision

All digit and mixed codes are represented as **ordered token strings**, never as arithmetic numbers unless the rule explicitly performs arithmetic.

Therefore:

- `0472` is a four-token code and its leading zero is meaningful;
- `7-2-0-4` and `7204` may share token values but use different rendering contracts;
- digit-wise `+2 mod 10` is different from adding `2222` to the whole number;
- symbols are atomic tokens, not operators;
- a minus sign, decimal point or arithmetic operator is excluded from symbol pools to prevent OPS ownership leakage.

---

## 3. Included scope

Candidate scope includes:

- position-preserving digit transformations;
- invertible decimal wrap-around transformations;
- fixed substitution among digits when source evidence supports it;
- digit-to-symbol and symbol-to-digit maps when source evidence supports them;
- position-dependent digit transformations when materially distinct;
- mixed alphanumeric transformations with independent letter and digit channels when directly source-backed;
- encode, inverse decode, missing-token and infer-and-apply tasks;
- code strings with repeated digits, leading zeroes and wrap boundaries;
- English-first explanations followed later by Hindi and Punjabi localisation of prose only.

---

## 4. Excluded scope

- word/letter → digit or symbol direct mapping already owned by CP-001;
- alphabet-rank and word-aggregate number coding owned by CP-002;
- letter shifts and class-dependent letter rules owned by CP-003/004;
- pure letter permutation owned by CP-005;
- composite word transforms owned by CP-006;
- renaming, sentence coding and conditional coding owned by CP-008/009/010;
- mathematical operators, equation balancing and coded inequalities;
- counting how many codes can be formed;
- number series or missing-number questions without an explicit coding relation;
- input-output machine sequences;
- visual figure or SVG symbol reasoning;
- cryptographic keys, security ciphers or external factual codes.

---

## 5. Domain model

The runtime should expose concepts equivalent to:

```ts
type CodeToken =
  | { kind: "DIGIT"; value: "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" }
  | { kind: "LETTER"; value: string }
  | { kind: "SYMBOL"; value: string };

type CodeSequence = readonly CodeToken[];

type Cp007TaskKind =
  | "ENCODE_TARGET"
  | "DECODE_TARGET"
  | "RECOVER_MISSING_TOKEN"
  | "INFER_AND_ENCODE"
  | "CHOOSE_MATCHING_CODE";

interface Cp007Example {
  source: CodeSequence;
  code: CodeSequence;
}

interface Cp007Prompt {
  examples: readonly Cp007Example[];
  target: CodeSequence;
  displayedTargetCode?: CodeSequence;
  missingIndex?: number;
}

interface Cp007GeneratedQuestion {
  checkpointId: "COD-CP-007";
  prototypeId: string;
  permanentQlId: null;
  prototypeOnly: true;
  publiclyPublishable: false;
  locale: "en-IN";
  taskKind: Cp007TaskKind;
  stem: string;
  structuredPrompt: Cp007Prompt;
  options: readonly unknown[];
  correctIndex: number;
  explanation: unknown;
  metadata: Readonly<Record<string, unknown>>;
}
```

Every rule operates over token arrays. Rendering and parsing must never silently coerce a code sequence into a JavaScript number.

---

## 6. Candidate rule architecture

These are prototype families, not frozen QLs.

### 6.1 `UNIFORM_MODULAR_DIGIT_TRANSLATION`

For each digit `d`:

```text
encode(d) = (d + k) mod 10
```

where `k ∈ {1,…,9}` and `k ≠ 0`.

The inverse is:

```text
decode(c) = (c - k) mod 10
```

This is the first source-proven family.

Required evidence must include enough digits to distinguish the chosen shift from arbitrary direct substitution and, where possible, must include at least one wrap case.

### 6.2 `DIRECT_DIGIT_SUBSTITUTION`

A fixed bijection maps source digits to code digits.

This candidate is retained only if direct recurring source evidence is found. It must not be inferred from a single uniform-shift example because a simpler modular rule explains that evidence.

### 6.3 `DIGIT_SYMBOL_BIJECTION`

A fixed bijection maps digits to non-operator symbols. The inverse maps symbols back to digits.

Required safeguards:

- symbol tokens are visually distinct;
- symbols cannot be interpreted as arithmetic or relation operators;
- repeated source digits preserve repeated symbols;
- inverse decode is generated only when the active mapping is one-to-one and fully evidenced.

This remains source-pending.

### 6.4 `POSITION_DEPENDENT_DIGIT_TRANSLATION`

Different positions use different modular shifts, such as:

- odd/even shifts;
- alternating signed shifts;
- indexed shifts.

A candidate survives only if source evidence and executable comparison show a materially different solve contract from the existing letter-domain CP-004 QLs.

### 6.5 `DIGIT_POSITION_PERMUTATION`

The output reorders source digit positions.

This is a collision candidate with CP-005. Pure permutation should normally merge with or be excluded in favour of CP-005 unless decimal-string semantics, leading-zero handling or a source-specific explanation obligation proves material distinctness.

### 6.6 `ALPHANUMERIC_DUAL_CHANNEL_TRANSFORM`

Letters and digits in one mixed source string follow separate deterministic channels, for example:

```text
letters: alphabet shift
numbers: decimal modular shift
```

The candidate is valid only when both channels are active and direct exam evidence supports the mixed format. A mere concatenation of a CP-003 rule and a CP-007 rule is not automatically a new QL.

### 6.7 `MIXED_TOKEN_SUBSTITUTION`

Mixed letters, digits or approved symbols receive fixed arbitrary substitutes.

This has strong collision risk with CP-001 direct mapping. It survives only if mixed-domain parsing, answer type or inverse semantics materially change the student task.

---

## 7. Rule registry contract

Every candidate rule must expose:

```ts
interface Cp007Rule<P> {
  ruleId: string;
  parameterDomain: readonly P[];
  encode(source: CodeSequence, parameters: P): CodeSequence;
  decode?(code: CodeSequence, parameters: P): CodeSequence;
  isInvertible(parameters: P): boolean;
  validateSource(source: CodeSequence, parameters: P): ValidationResult;
  fingerprint(parameters: P): string;
  explain(parameters: P, source: CodeSequence, code: CodeSequence): RuleTrace;
}
```

The production generator may not accept its own hidden rule as proof. It must run every eligible rule family over the displayed examples and prove that exactly one allowed rule fingerprint survives, unless the task intentionally asks about ambiguity.

---

## 8. Eligibility and ambiguity solving

For displayed examples `E`, let `R` be every eligible rule/parameter pair that supports the source and code token domains.

```text
Survivors(E) = { r ∈ R | r explains every displayed example exactly }
```

A normal infer-and-apply question is valid only when:

```text
|canonicalFingerprint(Survivors(E))| = 1
```

The audit must reject:

- a complex position-dependent rule when a uniform shift also explains the evidence;
- arbitrary substitution when a simpler uniform translation explains all examples;
- a digit-wise rule indistinguishable from whole-number arithmetic on the displayed data;
- an alphanumeric composite with one inactive channel;
- an inverse task with more than one valid preimage;
- a permutation that is equivalent to an existing CP-005 solve mode.

---

## 9. Task-direction audit

Every retained rule is tested against all materially valid directions:

### Encode target

Infer or apply the rule and produce the target code.

### Decode target

Invert the rule. Allowed only when the rule and active parameterisation are bijective over the displayed domain.

### Recover missing token

One code token is replaced by `?` or a blank. The missing token must be unique.

### Infer and encode

Multiple examples are shown because one example would admit competing rules.

### Choose matching code

All options are complete sequences; exactly one follows the inferred rule.

Task directions are not automatically separate QLs. Prototype audits decide whether their solver, answer and explanation obligations require splitting.

---

## 10. Inverse contract

A decode prototype is admitted only when:

1. the rule is mathematically invertible;
2. the active token mapping is injective;
3. the displayed evidence identifies the same rule and parameters uniquely;
4. the target code has exactly one valid source sequence;
5. distractors are valid same-type source sequences rather than malformed codes.

For modular translation, inverse proof is exact subtraction modulo 10.

For direct maps, inverse proof requires complete active mapping coverage.

---

## 11. Edge-case matrix

Executable prototypes must cover:

- source beginning with zero;
- output beginning with zero;
- one and multiple decimal wraps;
- repeated source digits;
- repeated output digits only when the rule permits them;
- all digits identical;
- target length 3 through 8;
- short evidence that is ambiguous and must be rejected;
- competing shift values;
- uniform versus position-dependent collision;
- digit-wise addition versus whole-number addition collision;
- leading-zero preservation during encode and decode;
- missing token at first, middle and final position;
- inverse target containing zero;
- visually similar symbols;
- banned operator symbols;
- alphanumeric strings with both channels active;
- class-boundary positions in mixed strings;
- source/code length mismatch;
- non-invertible arbitrary map;
- identity transformation;
- a stage hidden by repeated digits;
- duplicate examples adding no information.

---

## 12. Option architecture

Every question has four semantically unique options of one answer type.

Digit-sequence distractors may include:

- wrong shift direction;
- off-by-one shift;
- missed wrap;
- whole-number arithmetic instead of digit-wise arithmetic;
- one unchanged position;
- wrong position phase;
- reversed output;
- adjacent source-position token;
- leading zero dropped;
- missing-token neighbour.

Symbol and mixed-code distractors may include:

- one mapping inconsistency;
- position swap;
- reverse order;
- wrong channel applied to one token;
- operator-looking symbol rejection;
- duplicated symbol violating injectivity.

A distractor is generated from a named misconception and independently verified false.

---

## 13. Explanation contract

Every explanation contains:

1. **Reference Aid** — the smallest concept needed, such as decimal wrap;
2. **Rule discovery** — one representative example, plus extra evidence only when needed;
3. **Target application** — a complete token-by-token trace;
4. **Conclusion** — the exact answer;
5. **Common Trap Alert** — one actual offered distractor and why it fails.

For `35674 → 57896`, a suitable trace is:

```text
3→5, 5→7, 6→8, 7→9, 4→6
```

Therefore every digit moves forward by 2. The target is transformed digit by digit; no carrying is performed between positions.

Explanations must avoid internal terms such as registry, branch, parameter domain or solver fingerprint.

---

## 14. Difficulty model

Difficulty is an instance property driven mainly by:

- whether the rule is given or inferred;
- number of plausible eligible rules before evidence filtering;
- encode versus inverse decode;
- one channel versus two active channels;
- uniform versus position-dependent operation;
- number of evidence examples required;
- number and location of wrap cases;
- missing-token reconstruction;
- collision elimination against whole-number arithmetic or permutation.

Shift magnitude alone does not make a question hard.

---

## 15. Renderer policy

Candidate renderers:

- `INLINE_CODE_PAIR`;
- `EXAMPLE_TARGET_BLOCK`;
- `MAPPING_TABLE` for unconditional maps only;
- a checkpoint-local token-row renderer if mixed token spacing requires it.

Rules:

- leading zeroes must remain visible;
- spaced and unspaced codes may be presentation variants only when token boundaries remain unambiguous;
- symbols must be font-safe in English, Hindi and Punjabi interfaces;
- no symbol may render as a mathematical operator whose meaning could be mistaken for OPS.

Renderer variation is not a QL by itself.

---

## 16. Localisation policy

CP-007 is `TRANSLATABLE`:

- Latin letters, digits and approved symbols remain logic-neutral;
- instructions and explanations are authored naturally in each locale;
- code strings are not transliterated;
- Hindi and Punjabi begin only after English contracts freeze;
- symbol font and line-break safety must be tested separately in all three scripts.

---

## 17. Question Studio contract

Before permanent allocation, CP-007 remains hidden from production discovery.

Prototype review metadata should expose:

- prototype ID;
- candidate family and parameter fingerprint;
- task direction;
- source/code token domains;
- leading-zero flag;
- wrap count;
- eligible-rule count before and after filtering;
- inverse uniqueness;
- collision candidates rejected;
- distractor misconception labels;
- explanation fingerprint;
- source-evidence status.

---

## 18. Validation gates

A candidate contract cannot freeze until it passes:

- deterministic seed reproduction;
- production solver and independent verifier agreement;
- exact eligible-rule uniqueness;
- inverse uniqueness where applicable;
- four unique options and one correct answer;
- leading-zero preservation;
- repeated-token consistency;
- all required edge cases;
- bounded generation yield;
- answer-position balance;
- scenario and length coverage;
- exact and normalised stem duplication audit;
- exact and normalised explanation duplication audit;
- chapter ownership collision audit;
- source-format recurrence audit;
- English editorial review.

---

## 19. Current discovery decision

The first executable milestone is limited to the directly source-proven `UNIFORM_MODULAR_DIGIT_TRANSLATION` family.

All other candidate families remain source-pending or collision-pending. No permanent QL identity will be assigned until the full checkpoint discovery and merge/split audit proves the final inventory.
