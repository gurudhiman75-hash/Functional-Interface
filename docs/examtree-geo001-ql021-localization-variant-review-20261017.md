# GEO-001 / GEO-QL-021 — proposed localization pattern for editorial review

**Status: CANDIDATE — NOT YET HUMAN APPROVED.** This is a proposed addition to the previously approved frozen Geometry Hindi/Punjabi V2 rendering authority. It must not be represented as part of the approved August 2026 artifact without a new review decision. No Question Bank or public content release is requested.

## Failure reproduced
CI `validate-geometry-normal-question-studio-integration` failed on the seed for `GEO-QL-021`, prototype `GEO-TMP-CP005-MISSING-SIDE-V1`, second explanation line. English source generated an eight-number expression; the earlier exact V2 template expects the ratio to be repeated before the multiplication and therefore expects ten numeric slots.

## Proposed exact English pattern
```text
The scale factor from ABC to PQR is PQ/AB = {{0}}/{{1}}. Therefore PR = AC × {{2}}/{{3}} = {{4}} × {{5}}/{{6}} = {{7}} cm.
```

## Proposed Hindi wording
```text
ABC से PQR का माप गुणक PQ/AB = {{0}}/{{1}} है। अतः PR = AC × {{2}}/{{3}} = {{4}} × {{5}}/{{6}} = {{7}} cm।
```

## Proposed Punjabi wording
```text
ABC ਤੋਂ PQR ਦਾ ਮਾਪ ਗੁਣਕ PQ/AB = {{0}}/{{1}} ਹੈ। ਇਸ ਲਈ PR = AC × {{2}}/{{3}} = {{4}} × {{5}}/{{6}} = {{7}} cm।
```

## Technical review criteria

- Numerator/denominator order must remain PQ/AB, and PR must remain AC multiplied by the same similarity ratio; retain every numeric token in the original source order.
- English content is untouched. Candidate strings must match the exact source pattern; do not add a fallback translator or weaken the frozen-source drift assertion.
- Compare both locales to canonical source across the 75 QLs, selected checkpoints and the failing seed; check four unique options, correct-index parity, explanation completeness and diagram fingerprint parity.
- Do not silently update the approved artifact ID, digest, multilingual freeze proof, bank/test permissions or deployment settings.
- A **new explicit product-owner editorial decision** is required before merging/deploying this new localized output as frozen-approved Question Studio content. If rejected, use a separately governed remediation rather than claiming previous approval.

## Scope
PR #3412 changes source and tests only. No production/staging Cloud Run deployment, queue resume, DB write, or publication.
