# BLR-CP-006 — Coded Relation Decoding

Status: **English discovery frozen at `BLR-QL-026..BLR-QL-030`; English option-explanation Editorial V2 remediated; Hindi/Punjabi Editorial V2 reviewed and frozen under `BLR_CP006_MULTILINGUAL_FROZEN`; product delivery remains locked**.

## Permanent QLs

```text
BLR-QL-026  RESOLVE_CODED_RELATION
BLR-QL-027  IDENTIFY_PERSON_FROM_CODED_GRAPH
BLR-QL-028  DETERMINE_GENDER_FROM_CODED_GRAPH
BLR-QL-029  SELECT_CODED_RELATION_PAIR
BLR-QL-030  RESOLVE_CODED_FAMILY_SET_RELATION
```

Next available Blood Relations identity: `BLR-QL-031`.

## Frozen multilingual inventory

```text
152 canonical English frozen questions
152 Hindi frozen questions
152 Punjabi frozen questions
304 localized frozen questions
456 total multilingual questions
19 source prototypes
17 source topologies
5 permanent solve authorities
5 permanent QLs
440 decoded statement instances
152 / 152 unique canonical learner-item signatures
```

QL distribution per localized language:

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

## English Editorial V2 remediation

The frozen English semantic corpus is unchanged. English Editorial V2 changes only learner-facing option explanations.

The remediation removes internal diagnostic tags from learner-facing prose, stops using position-assigned relation-distractor labels as learner explanations, makes relation distractor feedback state the actual decoded answer and rejected relation, retains legacy `errorLabel` values as internal metadata, and preserves item IDs, semantic fingerprints, QLs, options, option order, correct indexes, answers, code keys, coded statements, graphs and family-tree structures.

`cp006-runtime.test.ts` fails closed if a diagnostic tag/name leaks into English learner text or if relation distractor feedback does not identify both the decoded answer and rejected option.

Merged English remediation authority: PR `#757`, merge commit `d1de35383e9c9fb5bfcf61941f49e07f103006ba`.

## Hindi/Punjabi localization contract

The localized runtime is generated from the frozen English semantic record rather than by translating coded logic. For every Hindi and Punjabi record it preserves permanent QL and solve authority, source prototype/scenario/topology/seed, code-key tokens and relation IDs, all 440 coded assertions, structured query object, decoded family graph, option semantic keys/order/correctness, correct index, family-tree structure/query path, canonical semantic fingerprint and UNKNOWN-gender evidence.

Only learner-facing language is localized: code-key meanings, stems, relation/gender/pair labels, decoded statements, graph audit, option explanations, conclusion, shortcuts, trap guidance and family-tree accessibility text.

The language audit is fail-closed for residual English after protected tokens are removed, target-script coverage, cross-script leakage and unresolved placeholders.

## Hindi/Punjabi Editorial V2

Editorial V2 replaced runtime-like literal wording with exam-natural family-relation wording, corrected generic singular kinship labels, removed learner-visible diagnostic tags, made relation-question distractor feedback relation-specific, polished Hindi/Punjabi answer grammar, used natural Punjabi pair stems such as `ਕਿਹੜੀ ਜੋੜੀ ਵਿੱਚ ...`, and replaced technical graph/edge accessibility wording with learner-facing relationship-chart language.

`localization/cp006-editorial-quality-audit.ts` scans all 304 localized records for forbidden runtime-style wording, diagnostic leakage, relation-feedback mismatch, generic kinship-label regression and complete `BLR-QL-026..030` coverage. It also emits a rendered Hindi and Punjabi sample from every QL.

Final review on 2026-08-13 accepted representative Hindi and Punjabi samples from every permanent CP-006 QL. The exhaustive audits reported zero residual-English records, target-script gaps, cross-script records, placeholders, forbidden editorial phrases, internal diagnostic leaks, raw error-label leaks, relation-feedback failures, generic kinship-label failures and missing QL coverage.

## Multilingual freeze

Freeze authority: `BLR_CP006_MULTILINGUAL_FROZEN`  
Approval date: `2026-08-13`

The freeze wrapper changes approval metadata only. It proves:

- Hindi learner corpus changed: `false`;
- Punjabi learner corpus changed: `false`;
- Hindi semantic parity: `true`;
- Punjabi semantic parity: `true`;
- localization-review-pending count: `0`;
- human-review-required count: `0`;
- multilingual frozen localized count: `304`;
- product-delivery-enabled count: `0`.

The original review-candidate parity proof remains executable alongside the frozen-corpus proof, so the transition from candidate to frozen authority is explicitly regression-checked.

Merged multilingual freeze authority: PR `#758`, merge commit `d54dbcf07265630a7e45e1b296d586bf7396390e`.

## Gender-evidence rule

A person's letter label or name is never gender evidence. Fixed gender enters the graph only through a decoded gender-bearing relation:

```text
father, mother, son, daughter,
brother, sister, husband or wife
```

All other people remain `UNKNOWN` unless another decoded statement establishes their gender.

## Files

- `cp006-model.ts` — permanent contracts, code-key domain, question and diagram types;
- `cp006-prototypes.ts` — token palettes and 19 discovered source prototypes;
- `cp006-graph.ts` — token decoder, graph closure and relation solver;
- `cp006-presentation.ts` — English options, learner-safe explanations and family-tree diagrams;
- `cp006-runtime.ts` — frozen English permanent generator and telemetry;
- `cp006-independent-verifier.ts` — independent graph reconstruction and answer proof;
- `cp006-runtime.test.ts` — complete 152-question runtime, evidence, learner-feedback and replay regression;
- `cp006-final-freeze.test.ts` — source, boundary, inverse, merge/split and CP-007 ownership audit;
- `localization/cp006-language-pack.ts` — Hindi/Punjabi relation vocabulary and learner-language helpers;
- `localization/cp006-localizer.ts` — semantic-preserving localized candidate runtime;
- `localization/cp006-localizer.review-candidate.test.ts` — original 304-record candidate semantic-parity and release-lock proof;
- `localization/cp006-localizer.test.ts` — CI entry that runs candidate parity plus multilingual-freeze proof;
- `localization/cp006-language-leak-audit.ts` — fail-closed learner-language audit;
- `localization/cp006-editorial-quality-audit.ts` — fail-closed Hindi/Punjabi Editorial V2 audit;
- `localization/cp006-localized-review-runtime.ts` — localized candidate telemetry;
- `cp006-multilingual-frozen.ts` — approved frozen Hindi/Punjabi wrapper and freeze invariants;
- `cp006-multilingual-frozen.test.ts` — frozen-corpus, semantic-parity and release-lock proof;
- `BLR-CP-006-MULTILINGUAL-FREEZE.md` — authoritative multilingual freeze record;
- `export-cp006-final-freeze.ts` — English freeze exporter;
- `BLR-CP-006-FINAL-DISCOVERY-FREEZE.md` — authoritative English checkpoint record.

## Boundary

CP-006 owns decoding and solving a supplied relation key. CP-007 owns inverse coded tasks such as selecting expressions, completing code tokens/persons, and validating coded statements.

Localization and multilingual freeze do not change checkpoint ownership and allocate no new QL.

## Release lock

Hindi/Punjabi human-language review is complete and the 304 localized records are frozen. **Multilingual freeze is not product-release approval.**

Question Studio visibility, Question Bank eligibility, mock-test eligibility, public publication, production staging and automatic student delivery remain disabled for CP-006. A later explicit Question Studio/product-release integration must be separately reviewed and approved.
