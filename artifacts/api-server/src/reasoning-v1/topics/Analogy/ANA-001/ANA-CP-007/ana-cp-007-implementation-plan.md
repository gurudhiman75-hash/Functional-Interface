# ANA-CP-007 — Staged Implementation Plan

Status: **DESIGN-TO-PILOT PLAN — QL AND SOLVE-MODE COUNTS OPEN**

ANA-CP-007 must be implemented in two distinct phases:

1. rule and dataset proof without permanent QL allocation;
2. runtime QL implementation only after source saturation and generation-yield evidence.

This prevents the inherited 20-QL list from becoming a quota.

---

## 1. Scope

The checkpoint covers meaningful English-word structure analogies whose relation requires one or more of:

- vowel/consonant classification;
- source-position extraction;
- complete alphabet-position representation;
- complete alphabet-position sum;
- word length;
- repeated-letter equality pattern;
- vowel/consonant differential transformation;
- class regrouping if source recurrence is confirmed.

Generic A–Z cluster transformations are delegated to ANA-CP-006.

---

## 2. Phase A — lexical foundation

Create:

```text
ANA-CP-007/
  foundation/
    word-structure.ts
    word-pattern.ts
    word-registry.ts
    word-registry.audit.ts
```

### `word-structure.ts`

Independent utilities:

- normalize A–Z word;
- classify vowels and consonants;
- return source positions;
- odd/even extraction;
- alphabet-position sequence;
- alphabet-position sum;
- word-length facts;
- full repeated-letter equality pattern.

### `word-pattern.ts`

- canonical equality-pattern key;
- pattern comparison;
- coarse repeated-count diagnostics;
- near-pattern classification for distractors.

### `word-registry.ts`

- reviewed pilot word records;
- no runtime network or dictionary dependency;
- stable IDs;
- editorial metadata.

### `word-registry.audit.ts`

- recompute every derived field;
- report structural bucket coverage;
- reject duplicate words and IDs;
- report family-specific eligible counts.

No QL registry is created in Phase A.

---

## 3. Phase B — provisional rule authority

Create:

```text
ANA-CP-007/
  provisional-rule-definitions.ts
  provisional-independent-solver.ts
  provisional-collision-audit.ts
  provisional-yield-simulation.ts
```

The provisional rule IDs are design labels, not permanent QL ownership.

Initial authorities:

- `WORD_REMOVE_VOWELS`;
- `WORD_REMOVE_CONSONANTS`;
- `WORD_POSITION_EXTRACTION`;
- `WORD_ALPHABET_POSITION_SEQUENCE`;
- `WORD_ALPHABET_POSITION_SUM`;
- `WORD_LENGTH_RULE`;
- `WORD_EQUALITY_PATTERN`;
- `WORD_VOWEL_CONSONANT_DIFFERENTIAL_SHIFT`;
- `WORD_CLASS_REGROUP` only as a disabled experimental authority.

Each production-style `apply()` must have a separate independently implemented solver.

---

## 4. Phase C — full collision bridge

The provisional ambiguity checker must evaluate:

1. every admitted CP-007 authority;
2. relevant CP-006 independent rule matches;
3. uniform shifts;
4. opposite letters;
5. parity extraction versus class filtering;
6. all whitelisted length profiles;
7. position sequence versus numeric aggregate rules;
8. repeated-pattern versus coarse repeat-count rules.

The bridge should expose a normalized match record:

```ts
interface WordRuleMatch {
  authorityId: string;
  contextKey: string;
  priority: number;
  evidence: readonly {
    input: string;
    expected: string | number | readonly number[];
  }[];
}
```

A proposed instance is accepted only when the intended match is unique among all equal-or-simpler authorities.

---

## 5. Phase D — generation-yield simulation

For every provisional authority and context:

- enumerate or deterministically sample source/target word pairs;
- require full branch activation;
- independently solve both pairs;
- run the complete ambiguity bridge;
- attempt four plausible options;
- reject options that create any registered alternative relation;
- record successful and rejected cases with reasons.

Required report fields:

```text
authority
context
candidate pairs
valid pairs
identity rejects
insufficient-class rejects
CP-006 collision rejects
CP-007 collision rejects
option-construction rejects
usable generation yield
word-pool bottlenecks
```

A rule is not frozen when it works only for a few hand-picked words.

Provisional readiness target:

- at least 200 valid source-target combinations per frozen authority;
- no single word contributes more than 5% of accepted combinations;
- at least 20 plausible distractor sets per authority/context;
- deterministic replay parity.

These are proof thresholds, not QL quotas.

---

## 6. Phase E — source and ownership freeze

Use the yield report and source audit to classify every candidate:

- `NATIVE_FROZEN`;
- `NATIVE_CONTEXT_ONLY`;
- `DELEGATED_CP006`;
- `RESERVED_CP009`;
- `DEFERRED_CODING_DECODING`;
- `EXCLUDED_INSUFFICIENT_EVIDENCE`;
- `EXCLUDED_LOW_YIELD`.

Only then decide:

- how many materially distinct solve contracts exist;
- which presentation modes are required;
- the continuous permanent QL range;
- whether later CP ranges need amendment.

Existing merged IDs through `ANA-QL-208` must not change.

---

## 7. Phase F — permanent QL registry

After freeze, create:

```text
question-language.en.ts
question-language.hi.ts or localized runtime adapter
question-language.pa.ts or localized runtime adapter
task-registry.ts
```

QL allocation principles:

- one QL per materially distinct rule-plus-requested-inference contract;
- presentation modes receive separate QLs when the requested task changes;
- rule contexts such as shift magnitude remain generation parameters unless they change solver evidence;
- renderer changes alone do not create QLs;
- noun/word substitutions do not create QLs;
- counts are regression snapshots, never future quotas.

---

## 8. Phase G — deterministic runtime

Create:

```text
generator.ts
independent-solver.ts
ambiguity-checker.ts
option-validator.ts
student-explanations.en.ts
localized-runtime.ts
```

Runtime output:

```ts
interface GeneratedWordStructureAnalogy {
  checkpointId: "ANA-CP-007";
  qlId: string;
  authorityId: string;
  presentationMode: string;
  seed: number;
  sourceEvidence: unknown;
  targetEvidence: unknown;
  stem: string;
  options: readonly unknown[];
  correctIndex: number;
  explanation: {
    ruleStatement: string;
    sourceDemonstration: string;
    targetApplication: string;
    conclusion: string;
    closestTrapRejection: string;
  };
  metadata: {
    publiclyPublishable: false;
    maturity: "RUNTIME_PROOF";
  };
}
```

---

## 9. Explanation authorship

Use the approved CP-006 editorial standard.

Every explanation must:

1. state the relation in ordinary language;
2. identify the relevant vowels, consonants, positions, values, lengths or repeated groups;
3. show the complete source transformation;
4. apply the same rule to the target;
5. state the answer;
6. explain the nearest displayed trap.

Examples of required detail:

### Vowel/consonant shift

- list source vowels and consonants;
- show each changed letter and movement;
- show wrap arithmetic when used;
- verify the target letter by letter.

### Alphabet-position sum

- show every letter value;
- include every repeated occurrence;
- write the complete addition and result.

### Equality pattern

- assign pattern numbers from left to right;
- show why the answer has the same complete pattern;
- show where the closest distractor first breaks the pattern.

Prohibited student-facing language:

- vector;
- context key;
- authority ID;
- registered matcher;
- parameter domain;
- collision fingerprint.

---

## 10. Localization plan

First runtime:

- Latin English word tokens remain unchanged;
- English/Hindi/Punjabi instructions and explanations are natural and independently reviewed;
- `vowel` and `consonant` terminology follows standard exam usage;
- alphabet positions remain A=1 through Z=26;
- localized trap explanations name the same misconception as English.

Native-script transformations are excluded.

---

## 11. Test plan

### Dataset proof

- registry derivation parity;
- structural bucket coverage;
- pattern-group coverage;
- no duplicate or disabled leakage.

### Rule proof

- production/independent solver agreement;
- invalid-domain total returns;
- class activation;
- wrap behavior;
- repeated-letter occurrence handling.

### Collision proof

- CP-007 full native pool;
- CP-006 delegated matcher;
- length-profile collisions;
- parity/class-filter collisions;
- all distractors rejected against the full pool.

### Runtime proof

- deterministic replay;
- continuous QL IDs after freeze;
- four unique options;
- exactly one correct answer;
- balanced answer positions;
- all layouts and difficulty bands;
- sufficient stem variety;
- no unresolved placeholders.

### Editorial proof

- no prohibited technical wording;
- complete source and target transformations;
- question-specific arithmetic or letter trace;
- misconception-specific trap rejection;
- English/Hindi/Punjabi structural parity.

---

## 12. Review exports

Generate:

- one readable Markdown sample per QL;
- multi-seed JSONL corpus;
- English/Hindi/Punjabi review files;
- source/yield/collision summary;
- answer-position and difficulty summary.

No Question Studio or production registration occurs before human review and package freeze.

---

## 13. Merge strategy

- merge the design branch independently after design review;
- build the pilot foundation on a new branch from the merged design;
- do not stack unverified runtime work onto unrelated feature branches;
- refresh onto the latest `New-main` before each merge;
- preserve all parallel work outside ANA-CP-007.

---

## Current state

```text
Source audit: in progress
Ownership boundary: designed
Rule domains: designed
Word registry: designed
Pilot foundation: not started
Yield simulation: not started
QL count: open
Solve-mode count: open
Runtime: not started
```
