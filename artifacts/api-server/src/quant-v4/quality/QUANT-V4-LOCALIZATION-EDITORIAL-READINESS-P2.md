# Quant V4 Hindi/Punjabi Editorial Readiness — P2

**Authority:** `QUANT-V4-LOCALIZATION-EDITORIAL-READINESS-P2`  
**Purpose:** reconcile the current Hindi/Punjabi editorial state without fabricating human/native approval.

## Principle

Automated semantic parity is not the same as human editorial approval. A chapter may have excellent deterministic Hindi/Punjabi generation and still remain review-only until the exact learner corpus is explicitly approved.

This checkpoint therefore separates:

- `EDITORIAL_ENGINEERING_CLOSED` — the learner surface has already received the intended editorial engineering/remediation and should not be reopened by a broad cleanup;
- `ENGINEERING_REVIEW_READY_HUMAN_SIGNOFF_PENDING` — the localized corpus is ready for explicit human/native review but no approval is recorded;
- `REVIEW_CANDIDATE_ACTIVE_REMEDIATION` — localized content exists but remains an active editorial candidate;
- `MULTILINGUAL_FROZEN` — explicit approved/frozen authority already exists.

No P2 audit may convert a pending human-review state into an approval merely because CI is green.

## Current high-priority review queue

### Probability

- 216 permanent English QLs.
- 216 Hindi + 216 Punjabi native review surfaces = **432** explicit review decisions required.
- ML-06 Question Studio native-review surface is available.
- Recorded human decisions remain **0/432**.
- Normal localized generation, scored mocks and public publication remain locked.

State: `ENGINEERING_REVIEW_READY_HUMAN_SIGNOFF_PENDING`.

### Interest · INT-CP-001

- Hindi/Punjabi V2 cash-flow-aware review packs exist.
- V2 is deliberately marked `PENDING_HUMAN_REVIEW`.
- Question Studio discovery and publication remain locked for this review authority.

State: `ENGINEERING_REVIEW_READY_HUMAN_SIGNOFF_PENDING`.

### Trigonometry · TRG-001

- Frozen English authority: 144 QLs.
- Final5 native-language engineering polish is merged.
- Current status remains explicitly `HUMAN REVIEW PENDING / NOT FROZEN / NOT ACTIVATED`.
- Final5 must not be silently promoted by an audit.

State: `ENGINEERING_REVIEW_READY_HUMAN_SIGNOFF_PENDING`.

### Trigonometry · TRG-002 localization families

- The approved/frozen English production authority is preserved.
- Hindi/Punjabi CP007–CP010 localization layers remain `REVIEW_CANDIDATE_V1`/remediation candidates.
- `humanReviewStatus` remains pending, freeze remains false, activation remains false.

State: `REVIEW_CANDIDATE_ACTIVE_REMEDIATION`.

## Already-closed examples that must not be reopened

### Partnership · PRT-001

E11 completed the Hindi/Punjabi editorial engineering pass across all 105 QLs. The final freeze evidence retains zero internal allocation-enum leakage and zero remaining cross-QL editorial near-similarity signals. This chapter is not part of the pending P2 rewrite queue.

### Mensuration

The approved Hindi/Punjabi Human Solution V2 authority already exists. Lifecycle activation remains a separate downstream concern, but broad localization re-authoring is not justified by this checkpoint.

## Blocking rules

The P2 gate fails if any pending family:

1. claims human approval without an explicit recorded authority;
2. becomes frozen while its recorded human review is still pending;
3. becomes Question-Bank/test/public eligible solely because localization CI passed;
4. loses its exact review inventory or review-only surface;
5. silently replaces the frozen English mathematical authority.

The gate also fails if a known editorially-closed authority is accidentally downgraded back into a generic localization draft.

## What this checkpoint does not do

It does **not** invent native-speaker/product-owner decisions. The next content action for pending families is review of their generated Hindi/Punjabi packs, followed by targeted corrections where findings exist. Only an explicit approval decision may advance a corpus to multilingual freeze.

## Relationship to the Real Exam Simulation Audit

The section simulator measures English/current runtime exam fidelity. This localization gate is complementary: it protects the language layer so later Punjab/SSC multilingual section simulation can use approved native surfaces without conflating mathematical parity with editorial readiness.
