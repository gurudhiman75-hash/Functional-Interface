# SEA-001 — Hindi/Punjabi Localization Readiness Evidence

Authority: **SEA Seating Arrangement Master End-to-End Family Design V3 (merged)**.

Status: **NATIVE HINDI/PUNJABI REVIEW CANDIDATE READY; HUMAN LANGUAGE REVIEW PENDING; INACTIVE**.

## Why this gate exists

SEA-001 English is already permanently frozen. Multilingual work must therefore localize learner-facing text without changing solve identity, query identity, answer semantics, option correctness, misconception semantics or the approved English corpus.

The localization foundation first established that semantic contract. The current checkpoint now adds deterministic, native-sentence Hindi and Punjabi review candidates while keeping human approval and product activation separate.

## Target locales

- canonical authority: `en-IN`;
- review candidate: `hi-IN`;
- review candidate: `pa-IN`.

Hindi and Punjabi are **review-ready, not approved or frozen**.

Active blocker:

`HINDI_PUNJABI_HUMAN_REVIEW_PENDING`

## Protected semantic layer

Localization preserves, among other fields:

- checkpoint and PBA authority;
- permanent QL identity;
- clue/solution semantic fingerprints;
- query-contract identity;
- answer type and answer value;
- answer-determining fact fingerprint;
- option semantic fingerprints;
- correct option/index;
- misconception identity and recomputation evidence.

`localization/readiness.ts` exposes the canonical parity projection used to compare every localized candidate with the frozen English authority without comparing learner-facing wording.

## Native learner-language implementation

The first fragment-by-fragment translation approach was rejected during editorial inspection because semantic parity alone did not produce natural Hindi/Punjabi word order.

SEA-001 now uses fail-closed native rendering through:

- `localization/native-sentence-kit.ts` — native setup/clue/question/answer sentence families;
- `localization/native-review-v2.ts` — native review-candidate composition;
- `localization/native-input-adapter.ts` — canonical-form normalization plus final learner-language polish;
- `localization/native-wrong-option-teaching.ts` — query-specific misconception/elimination teaching for every reviewed query contract;
- `sea-001-localized-review-export.ts` — fail-closed side-by-side English/Hindi/Punjabi review exporter.

The native renderer deliberately throws on unsupported clue/query forms instead of falling back to fragment translation.

## Editorial hardening in the native candidate

The final review-candidate layer includes explicit protections against the defects found during manual artifact inspection:

- zero Latin-script learner-text residue;
- zero canonical English-name leakage;
- zero known mechanical translationese fragments;
- correct Hindi/Punjabi oblique ordinal grammar;
- gender-neutral singular seating language so unisex names are never assigned a guessed gender;
- native if/otherwise facing language;
- direct centre/outward, same-facing and opposite-facing clue families;
- clockwise/anticlockwise directional-count normalization without changing semantic parity;
- query-specific wrong-option explanations instead of generic “this option is wrong because Y is correct” text;
- explicit under-count/over-count teaching for numeric distractors;
- explicit neighbour/reference-person elimination;
- sequence-mismatch, opposite-seat, relative-position and facing-reversal explanations.

## Exact final proof

On branch head `c410fec1502326b6c46759fe7ee6cd8bb9742813`, Wave-5 run `31767669260` passed the native localization proof with:

```text
PASS_SEA_001_NATIVE_REVIEW_V2
localized caselets                 200
localized child questions          800
semantic parity                    200/200
query contracts                    16
Latin learner residue              0
known mechanical translationese    0
ordinal grammar violations         0
gendered singular seating markers  0
generic wrong-option fallbacks     0
human language review              PENDING
Question Studio registered         false
publicly publishable               false
```

The same exact run passed production saturation, CP001–CP005 regressions, TypeScript, permanent-allocation freeze, source/authority audits, teaching explanations and review-readiness checks.

## Human-review artifact

The exact-head workflow artifact is:

- artifact: `sea-001-hi-pa-review-200`;
- artifact ID: `9206923822`;
- SHA-256 digest: `97b17d3f274a88961710b6dfe8495a302760839007ce4673e7763681a485fd80`;
- Hindi: 100 caselets;
- Punjabi: 100 caselets;
- total localized child questions: 800;
- 20 review caselets per checkpoint in each language;
- renderer marker: `SEA001_NATIVE_REVIEW_V2`.

The exporter itself rechecks semantic parity, Latin residue, canonical-name leakage, mandatory human-review status and delivery locks before it writes the review files.

## Lifecycle after this checkpoint

```text
Permanent QLs:                 20 (SEA-QL-001..SEA-QL-020)
English:                       FROZEN / APPROVED
Localization foundation:       READY
Hindi native review candidate: READY FOR HUMAN REVIEW
Punjabi native review candidate: READY FOR HUMAN REVIEW
Hindi/Punjabi human approval:  PENDING
Multilingual freeze:           NOT APPLIED
Question Studio registration:  false
Question Bank writes:          false
Mock-test eligibility:         false
Public publication:            false
```

Human language review is the next gate. Passing automated semantic/language checks does **not** count as Hindi/Punjabi approval. Multilingual freeze and product activation remain blocked until the review ledger is genuinely signed.
