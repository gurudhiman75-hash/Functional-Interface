# SEA-001 — Hindi/Punjabi Localization Readiness Evidence

Authority: **SEA Seating Arrangement Master End-to-End Family Design V3 (merged)**.

Status: **LOCALIZATION FOUNDATION READY; TRANSLATION + HUMAN LANGUAGE REVIEW PENDING; INACTIVE**.

## Why this gate exists

SEA-001 English is already permanently frozen. Multilingual work must therefore localize learner-facing text without changing solve identity, query identity, answer semantics, option correctness, misconception semantics or the approved English corpus.

This stage establishes that contract before translation starts.

## Target locales

- canonical authority: `en-IN`;
- translation candidate: `hi-IN`;
- translation candidate: `pa-IN`.

Hindi and Punjabi are **not** marked approved at this stage.

Active blocker:

`HINDI_PUNJABI_HUMAN_REVIEW_PENDING`

## Protected semantic layer

Localization must preserve, among other fields:

- checkpoint and PBA authority;
- permanent QL identity;
- clue/solution semantic fingerprints;
- query-contract identity;
- answer type and answer value;
- answer-determining fact fingerprint;
- option semantic fingerprints;
- correct option/index;
- misconception identity and recomputation evidence.

`localization/readiness.ts` exposes a canonical parity projection so translated candidates can later be checked against the frozen English authority without comparing learner-facing wording.

## Spatial-language foundation

The localization foundation includes explicit Hindi/Punjabi authority terms for the high-risk seating operators:

- left / right;
- immediate position;
- clockwise / anticlockwise;
- adjacent / non-adjacent;
- between;
- facing;
- centre / outward;
- opposite;
- extreme end / middle;
- same/opposite facing;
- if / otherwise conditional language.

This glossary is a semantic translation authority, not a claim that every final sentence has already passed human editorial review.

## Proof

`sea-001-localization-readiness-proof.test.ts` validates the foundation against the same exact 100-caselet canonical review selection used for the English gate.

It proves:

- 100 canonical `en-IN` caselets are present;
- all 20 PBAs are represented;
- 20 caselets exist per checkpoint;
- all review query contracts remain within the frozen checkpoint query sets;
- every child remains four-option / one-correct / answer-index aligned;
- all canonical parity projections are unique;
- Hindi/Punjabi target locales are explicit;
- the spatial glossary contains both Devanagari and Gurmukhi authority terms;
- the English review fingerprint remains the localization anchor;
- Question Studio, Question Bank, mock-test and public-delivery gates remain false.

The Wave-5 workflow includes a dedicated `localization-readiness` CI job.

## Lifecycle after this checkpoint

```text
Permanent QLs:                 20 (SEA-QL-001..SEA-QL-020)
English:                       FROZEN / APPROVED
Localization foundation:       READY
Hindi translation:             PENDING
Punjabi translation:           PENDING
Hindi/Punjabi human review:    PENDING
Question Studio registration:  false
Question Bank writes:          false
Mock-test eligibility:         false
Public publication:            false
```

The next localization checkpoint is to generate deterministic `hi-IN` and `pa-IN` review candidates under this parity contract, audit language leakage and semantic parity, then obtain genuine human language approval before any multilingual freeze or product activation.
