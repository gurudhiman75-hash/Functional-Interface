# NUM-CP-003 — Provisional Runtime Authority Plan

**Status:** architecture proposal after the 22-template review  
**Permanent QLs:** 0  
**Frozen authorities:** 0

This plan describes how the 22 learner templates can be implemented without duplicating mathematical engines.

---

## 1. Seven numerical authorities

### A. `applyOrRecogniseDivisibilityRule`

Owns:

- direct divisor/non-divisor selection;
- divisor from rule;
- rule from divisor;
- truth-claim validation adapter.

State:

```ts
type DivisibilityRuleState = {
  number?: bigint;
  divisor?: bigint;
  ruleId?: string;
  polarity?: "DIVISIBLE" | "NOT_DIVISIBLE";
};
```

### B. `resolveSingleDigitCandidateSet`

Owns the exact valid set for QLT-04..11.

```ts
type SingleDigitCandidateState = {
  template: string;
  divisor: bigint;
  domain: readonly number[];
  validDigits: readonly number[];
};
```

Target projections are pure functions over `validDigits` and completed numerals.

### C. `resolveOrderedDigitPairSet`

Owns QLT-12..15.

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

Owns QLT-16..17.

```ts
type DigitBoundMultipleState = {
  digits: number;
  divisor: bigint;
  direction: "LEAST" | "GREATEST";
};
```

### E. `countOneDivisorInRange`

Owns QLT-18.

```ts
type OneDivisorRangeState = {
  lower: bigint;
  upper: bigint;
  divisor: bigint;
};
```

### F. `testConcreteRepeatedNumeral`

Owns QLT-19.

```ts
type RepeatedNumeralState = {
  block: string;
  repeats: number;
  completedValue: bigint;
};
```

### G. `resolveLinkedArithmeticDivisibility`

Owns QLT-20.

```ts
type LinkedArithmeticState = {
  equation: DigitEquation;
  divisor: bigint;
  arithmeticPairs: readonly (readonly [number, number])[];
  validPairs: readonly (readonly [number, number])[];
  targetDigit: "A" | "B";
  extremum: "LARGEST" | "SMALLEST";
};
```

The validator must reject any state where divisibility does not reduce the arithmetic candidate set.

---

## 2. Representation adapters

### `renderMissingDigitDataSufficiency`

Consumes a single-digit candidate-state evaluator for each statement and maps the resulting candidate sets to one of five sufficiency classes.

### `renderDivisibilityClaimVerification`

Consumes direct rule checks and emits positive/negative statement options.

Table and mini-caselet adapters may later consume the same states.

---

## 3. Shared exact utilities

The retained runtime should use one shared Number System library for:

- non-negative modulo;
- exact divisibility;
- numeral construction;
- candidate-domain enumeration;
- gcd/lcm adapters where another checkpoint owns them;
- deterministic PRNG;
- exact option normalisation;
- semantic set comparison;
- reasoning-graph construction.

No retained runtime may depend on fixed V3 templates.

---

## 4. Registry shape

After approval, create a temporary registry with 22 rows:

```ts
type NumCp003TemplateRegistryEntry = {
  temporaryTemplateLabel: string;
  authorityId: string;
  taskDirection: string;
  answerSemantic: string;
  targetProjection?: string;
  representation: "STANDARD" | "DATA_SUFFICIENCY" | "CLAIM";
  sourceEvidence: readonly string[];
  permanentQlId: null;
  publiclyPublishable: false;
  questionStudioDiscoverable: false;
};
```

The registry must not use `NUM-QL-*` IDs before allocation approval.

---

## 5. Next implementation sequence after approval

1. freeze the seven authority interfaces;
2. create the temporary 22-row registry;
3. map retained prototypes to registry rows;
4. build one consolidated exact runtime rather than five wave runtimes;
5. generate an adversarial review corpus per template;
6. close merge/split gaps again against the consolidated runtime;
7. allocate permanent IDs only after the consolidated review passes.

No localisation or Question Studio integration should begin before step 7.
