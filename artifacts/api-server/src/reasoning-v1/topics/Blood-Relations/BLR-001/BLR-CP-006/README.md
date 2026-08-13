# BLR-CP-006 — Coded Relation Decoding

Status: **English discovery frozen at `BLR-QL-026..BLR-QL-030`; Hindi/Punjabi editorial-V2 machine-proved review candidates implemented; localized product delivery remains locked pending human language review**.

## Permanent QLs

```text
BLR-QL-026  RESOLVE_CODED_RELATION
BLR-QL-027  IDENTIFY_PERSON_FROM_CODED_GRAPH
BLR-QL-028  DETERMINE_GENDER_FROM_CODED_GRAPH
BLR-QL-029  SELECT_CODED_RELATION_PAIR
BLR-QL-030  RESOLVE_CODED_FAMILY_SET_RELATION
```

Next available Blood Relations identity: `BLR-QL-031`.

## Frozen and localized inventory

```text
152 canonical English review questions
152 Hindi machine review candidates
152 Punjabi machine review candidates
304 total localized review candidates
19 source prototypes
17 source topologies
5 permanent solve authorities
5 permanent QLs
440 decoded statement instances
152 / 152 unique canonical learner-item signatures
```

QL distribution per language:

```text
BLR-QL-026   72
BLR-QL-027   16
BLR-QL-028   16
BLR-QL-029   24
BLR-QL-030   24
```

## Runtime contract

Every question supplies an explicit code key. The canonical runtime:

1. replaces each token with its directed relation meaning;
2. treats every adjacent coded pair as a separate assertion;
3. constructs one connected family graph;
4. propagates full-sibling parent constraints;
5. solves the requested relation, person, gender or pair;
6. independently re-solves the exported graph;
7. renders a family-tree diagram and ASCII fallback.

Symbols are never evaluated with arithmetic precedence.

## Hindi/Punjabi localization contract

The localized review runtime is generated from the frozen English semantic record rather than by translating coded logic. For every Hindi and Punjabi record it preserves exactly:

- permanent QL and solve authority;
- source prototype, scenario, topology and seed;
- code-key tokens and their directed relation IDs;
- all 440 canonical coded statement assertions;
- structured query object;
- decoded family graph;
- option semantic keys, correctness flags and internal diagnostic codes;
- correct option index;
- family-tree nodes, edges and query path;
- canonical semantic fingerprint;
- UNKNOWN-gender evidence.

Only learner-facing language is localized: code-key meanings, stems, relation/gender/pair labels, decoded statements, graph audit, option explanations, conclusion, shortcuts, trap guidance and family-tree accessibility text.

The learner-language audit is fail-closed for residual ASCII prose after protected code tokens are removed, target-script coverage, cross-script leakage and unresolved placeholders.

## Editorial V2 remediation

A manual rendered-sample audit across all five permanent QLs found machine-invisible learner-surface issues in the first localization pass. Editorial V2 corrects them without changing the frozen English solver, graph, query objects, answer semantics or option positions.

Corrections include:

- replacing literal runtime-style wording such as `परिवार-ग्राफ`, `खुला हुआ संबंध` and Punjabi equivalents with exam-natural family-relation wording;
- changing generic singular relation labels such as `PARENT`, `GRANDPARENT` and `GRANDCHILD` so they no longer read as plural pairs;
- removing internal diagnostics such as `[QUERY_DIRECTION_REVERSAL]` and `[CORRECT_DECODED_GRAPH]` from learner-facing explanations while retaining `errorLabel` as internal metadata;
- making relation-question distractor explanations contrast the actual decoded relation with the offered distractor instead of exposing an inherited generic diagnostic classification that can be editorially misleading;
- improving pair-question and correct-answer grammar in both Hindi and Punjabi;
- replacing technical graph/edge vocabulary in accessibility text with learner-facing relationship-chart language.

The new editorial audit checks all 304 localized records and fails closed on:

```text
forbidden runtime-style learner phrases
internal diagnostic markers
raw option error-label markers
relation-distractor feedback that omits the correct relation or offered distractor
generic singular kinship-label regressions
missing BLR-QL-026..030 coverage
```

It also emits one representative rendered Hindi and Punjabi sample from each of the five QLs for direct editorial inspection in CI logs.

## Gender-evidence rule

A person's letter label or name is never gender evidence. Fixed gender enters the graph only through a decoded gender-bearing relation:

```text
father, mother, son, daughter,
brother, sister, husband or wife
```

All other people remain `UNKNOWN` unless another decoded statement establishes their gender. Localization does not change this evidence boundary.

## Files

- `cp006-model.ts` — permanent contracts, code-key domain, question and diagram types;
- `cp006-prototypes.ts` — token palettes and 19 discovered source prototypes;
- `cp006-graph.ts` — token decoder, graph closure and relation solver;
- `cp006-presentation.ts` — frozen English options, explanations and family-tree diagrams;
- `cp006-runtime.ts` — frozen English permanent generator and telemetry;
- `cp006-independent-verifier.ts` — independent graph reconstruction and answer proof;
- `cp006-runtime.test.ts` — complete 152-question runtime, evidence and replay regression;
- `cp006-final-freeze.test.ts` — source, boundary, inverse, merge/split and CP-007 ownership audit;
- `localization/cp006-language-pack.ts` — Hindi/Punjabi relation vocabulary and learner-language helpers;
- `localization/cp006-localizer.ts` — semantic-preserving localized review runtime;
- `localization/cp006-localizer.test.ts` — 304-record semantic-parity and release-lock proof;
- `localization/cp006-language-leak-audit.ts` — fail-closed learner-language/script audit;
- `localization/cp006-editorial-quality-audit.ts` — fail-closed editorial wording, diagnostics and rendered-sample audit;
- `localization/cp006-localized-review-runtime.ts` — localized review telemetry;
- `export-cp006-final-freeze.ts` — English JSONL, CSV, HTML, contracts, summary and freeze exporter;
- `BLR-CP-006-FINAL-DISCOVERY-FREEZE.md` — authoritative English checkpoint record.

## Boundary

CP-006 owns decoding and solving a supplied relation key.

CP-007 owns inverse coded tasks:

- choose an expression for a target relation;
- fill a missing token;
- choose a token that makes a relation true;
- identify a correct or incorrect coded statement;
- compare coded expressions;
- infer a token where kinship composition remains the tested skill.

Localization does not change checkpoint ownership and allocates no new QL.

## Release lock

The Hindi/Punjabi records are **review candidates only**. `humanLanguageReviewRequired` remains true and the blocker `HINDI_PUNJABI_HUMAN_REVIEW_PENDING` remains active.

Question Studio visibility, Question Bank eligibility, mock-test eligibility, public publication, production staging and automatic student delivery remain disabled for these localized candidates until a later explicit human-language review and approval/freeze gate.
