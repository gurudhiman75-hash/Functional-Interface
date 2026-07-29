# NUM-CP-003 — Provisional Runtime Authority Plan

**Status:** architecture proposal after independent 17-template boundary review  
**Permanent QLs:** 0  
**Frozen authorities:** 0

This plan describes how the 17 learner templates can be implemented without duplicating mathematical engines.

---

## 1. Seven numerical authorities

### A. `applyDivisibilityRule`

Owns:

- direct divisor/non-divisor selection;
- truth-claim validation adapter;
- rule-family selection for explanations and diagnostics.

Rule-name and divisor-from-rule tasks remain study-mode checks, not retained learner QLs.

```ts
type DivisibilityRuleState = {
  number: bigint;
  divisorOptions: readonly bigint[];
  polarity: "DIVISIBLE" | "NOT_DIVISIBLE";
  ruleEvidence: readonly DivisibilityRuleEvidence[];
};
```

### B. `resolveSingleDigitCandidateSet`

Owns QLT2-02 through QLT2-07.

```ts
type SingleDigitCandidateState = {
  template: string;
  divisors: readonly bigint[];
  domain: readonly number[];
  validDigits: readonly number[];
};
```

Target projections are pure functions over `validDigits` and completed numerals:

```text
UNIQUE_DIGIT
EXTREMUM_DIGIT
COUNT
SUM
SET
EXTREMUM_COMPLETED_NUMBER
```

Extremum direction is a parameter.

### C. `resolveOrderedDigitPairSet`

Owns QLT2-08 through QLT2-11.

```ts
type OrderedPairState = {
  template: string;
  divisors: readonly bigint[];
  auxiliaryRelation?: DigitRelation;
  validPairs: readonly (readonly [number, number])[];
};
```

The independent verifier enumerates all 100 ordered pairs.

### D. `findDigitBoundMultiple`

Owns QLT2-12.

```ts
type DigitBoundMultipleState = {
  digits: number;
  divisor: bigint;
  extremumDirection: "LEAST" | "GREATEST";
};
```

### E. `countOneDivisorInRange`

Owns QLT2-13.

```ts
type OneDivisorRangeState = {
  lower: bigint;
  upper: bigint;
  divisor: bigint;
};
```

### F. `testImplicitRepeatedNumeral`

Owns QLT2-14.

```ts
type RepeatedNumeralState = {
  block: string;
  repeats: number;
  completedValue: bigint;
};
```

The learner-visible state must require construction from block and repeat count. If the complete numeral is already shown, use Authority A instead.

### G. `resolveLinkedArithmeticDivisibility`

Owns QLT2-15.

```ts
type LinkedArithmeticState = {
  equation: DigitEquation;
  divisors: readonly bigint[];
  arithmeticPairs: readonly (readonly [number, number])[];
  validPairs: readonly (readonly [number, number])[];
  targetDigit: "A" | "B";
  extremumDirection: "LARGEST" | "SMALLEST";
};
```

The validator rejects any state where divisibility does not reduce the arithmetic candidate set.

---

## 2. Representation adapters

### `renderMissingDigitDataSufficiency`

Consumes a single-digit candidate-state evaluator for each statement and maps the resulting sets to one of five sufficiency classes.

### `renderDivisibilityClaimVerification`

Consumes direct divisibility checks and emits positive/negative statement options.

Table and mini-caselet adapters may later consume the same states without creating new QLs.

---

## 3. Shared exact utilities

The retained runtime should use one shared Number System library for:

- non-negative modulo;
- exact divisibility;
- numeral construction;
- candidate-domain enumeration;
- deterministic PRNG;
- exact option normalisation;
- semantic set comparison;
- reasoning-graph construction;
- source and prototype ancestry recording.

GCD/LCM overlap logic must remain behind the owning checkpoint rather than leak into this retained CP-003 runtime.

No retained runtime may depend on fixed V3 templates.

---

## 4. Temporary registry shape

Create a temporary registry with 17 rows:

```ts
type NumCp003TemplateRegistryEntry = {
  temporaryTemplateLabel: string;
  authorityId: string;
  taskDirection: string;
  answerSemantic: string;
  targetProjection?: string;
  extremumDirectionParameter?: boolean;
  representation: "STANDARD" | "DATA_SUFFICIENCY" | "CLAIM";
  sourceEvidence: readonly string[];
  prototypeAncestry: readonly string[];
  permanentQlId: null;
  publiclyPublishable: false;
  questionStudioDiscoverable: false;
};
```

The registry must not use `NUM-QL-*` IDs before allocation approval.

---

## 5. Next implementation sequence

1. create the temporary 17-row registry;
2. prove registry uniqueness and complete ancestry disposition;
3. map retained prototypes to registry rows;
4. build one consolidated exact runtime rather than five wave runtimes;
5. generate an adversarial review corpus per template;
6. close merge/split gaps again against the consolidated runtime;
7. present the final count-bearing allocation proposal to the product owner;
8. allocate permanent IDs only after explicit approval.

No localisation or Question Studio integration should begin before permanent allocation.
