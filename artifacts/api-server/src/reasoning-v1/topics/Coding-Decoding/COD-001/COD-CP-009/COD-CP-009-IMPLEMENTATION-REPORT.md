# COD-CP-009 — Permanent English Runtime Report

Status: **24 permanent English QLs implemented at runtime-proof maturity**.

## Identity

- permanent range: `COD-QL-175..198`;
- QL count: 24;
- source task contracts: 16;
- solve contracts: 24;
- topology families: 10;
- runtime version: `cod-cp009-runtime-v1`.

## Promotion design

The permanent runtime wraps the frozen prototype generators and their independent constraint solver. It does not duplicate or reinterpret the sentence-code logic.

Each question records:

- permanent QL identity;
- frozen solve-contract identity;
- source prototype provenance;
- source topology provenance;
- review-only and non-public release flags.

The ten exact-atomic QLs each own one fixed proof topology. The possible, possible-set and complete-candidate-domain QLs rotate deterministically across controlled two-way and three-way partial-information instances because uncertainty width was merged during discovery.

## Validation target

The permanent runtime audit generates 24 seeds for every QL, for a total of 576 questions, and enforces:

- deterministic output;
- continuous `COD-QL-175..198` identity;
- one-to-one solve-contract ownership;
- all 16 source task contracts;
- all ten topology families;
- four semantically distinct options;
- exactly one marked correct option;
- valid answer positions;
- complete explanations and solver metadata;
- Easy, Medium and Hard reach;
- no prototype identity at the student-facing top level;
- no Question Studio or public exposure.

The existing 720-question combined prototype saturation suite and final English discovery-freeze gate remain regression authorities.

## Release boundary

- locale: `en-IN` only;
- review-only: true;
- Question Studio: disabled;
- Question Bank: disabled;
- mock tests: disabled;
- public publication: disabled;
- Hindi/Punjabi: deferred until chapter-wide English approval.
