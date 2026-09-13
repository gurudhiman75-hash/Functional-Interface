# POL-CP-002 — Constituent Assembly & Making of the Constitution Status

**Branch:** `feature/polity-cp002-constituent-assembly`  
**Lifecycle:** APPROVED / FROZEN ENGLISH CONTENT  
**Runtime registration:** DEFERRED to Polity integration checkpoint

## Implemented

- curated source registry with primary/official authority IDs
- 9 constitution-making milestones from first sitting to full commencement
- 5 high-yield role/person mappings
- 5 major committee/chair/function mappings
- 9 composition/drafting-count records
- Cabinet Mission provincial election method
- 4 selected constitutional-influence mappings
- 16 genuine QLs
- deterministic same-domain distractors
- dedicated adoption/signing/commencement distinction
- dedicated drafting-process sequence
- 50-question English review batch
- structural and provenance QA test
- generic `On which date did the following occur...` wrapper removed from QL-001 and replaced by direct exam-style stems

## Mechanical review-batch QA

Independent generator reproduction passed:
- 50 questions
- 16/16 QLs represented
- 18 Easy / 24 Medium / 8 Hard
- exactly four unique options for every question
- all four answer positions used
- canonical answer matches the recorded correct option for every question
- 50 unique semantic signatures
- every used source ID resolves in the CP source registry
- generic date-wrapper QA gate enabled

This is a mechanical/content-structure checkpoint, not a claim that the full repository CI suite has run.

## Approval

Project owner approved the revised V2 English review batch on 13 September 2026.

## Deferred chapter-level work

- Question Studio exposure
- Hindi/Punjabi localization
- package-wide production registration

These are intentionally deferred to the Polity integration/localization checkpoints so later CPs can reuse one stable chapter-level adapter rather than creating per-CP integration fragments.
