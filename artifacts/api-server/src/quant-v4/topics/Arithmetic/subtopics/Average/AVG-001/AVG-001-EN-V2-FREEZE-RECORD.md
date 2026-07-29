# AVG-001 English V2 Freeze Record

Release ID: `AVG-001-EN-v2`  
Approval date: `2026-07-29`  
Approval authority: `ExamTree product owner`  
Supersedes: `AVG-001-EN-v1`

## Status

**APPROVED / FROZEN / QUESTION STUDIO RELEASE**

The complete English AVG-001 editorial V2 library is approved for controlled publication through Question Studio. The earlier V1 release remains reproducible through the unchanged base pipeline, while Question Studio now routes through the explicit V2 release pipeline.

## Frozen inventory

- Package: `AVG-001`
- Canonical problems: 6
- Active English QLs: 425
- QL range: `AVG-QL-001` through `AVG-QL-425`
- Solve modes: 45
- Difficulty distribution: 182 Easy / 185 Medium / 58 Hard
- Approved language: English (`en`)
- Excluded languages: Hindi (`hi`) and Punjabi (`pa`)
- Runtime exposure: Question Studio
- Maturity: `FROZEN`
- Publication state: `publiclyPublishable: true`

## V2 editorial contract

Every released package carries:

- natural resolved exam-style stem;
- four unique semantically qualified options;
- correct answer at the frozen correct index;
- misconception traceability for all three wrong options;
- exactly four explanation tiers:
  1. key rule;
  2. step-by-step solution;
  3. exam speed shortcut;
  4. common traps and distractor analysis;
- release traceability for `AVG-001-EN-v2`;
- the original mathematical fingerprint and exact solver answer.

## Verification authority

The release gate must prove:

- 425 active QLs and exact CP inventory;
- all 45 solve modes;
- exact 182 / 185 / 58 difficulty distribution;
- 1,275 seeded V2 release generations;
- deterministic replay for all 1,275 cases;
- zero exact-answer changes;
- zero mathematical-fingerprint changes;
- four unique options for every package;
- complete four-tier explanations;
- passing `release-approval-v2` validation;
- rejection of Hindi and Punjabi from this English release;
- passing Question Studio integration across all available CP/difficulty combinations;
- passing API build and production build gates.

## Language boundary

This release does not publish Hindi or Punjabi. Their 425-QL structural localisation remains a separate controlled editorial approval and release programme.

## Change control

Any change to V2 stems, semantic options, distractor values or misconception IDs, explanations, solve modes, parameter construction, answers, mathematical fingerprints, difficulty metadata, release metadata or supported languages requires a new review and release cycle.
