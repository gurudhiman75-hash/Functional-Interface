# HIS-001 Question Studio Integration V1

## Status

**QUESTION_STUDIO_INTEGRATED / REVIEW_ONLY**

HIS-001 Indian History is registered in the shared `knowledge-v1` Question Studio engine.

## Registered scope

- Package: `HIS-001`
- CPs: `HIS-CP-001` through `HIS-CP-024`
- Permanent QLs: 239
- Frozen questions per language: 1,434
- Languages: `en`, `hi`, `pa`
- Total frozen multilingual surfaces: 4,302
- Supported difficulties: Easy / Medium / Hard
- Runtime mode: `review-only`
- Registration authority: `HIS-001-MULTILINGUAL-FREEZE-V1`

The same seed, selectors and difficulty filter preserve the same underlying English question identities across English, Hindi and Punjabi.

## Workflow

Generation supports package-level review batches, CP filtering, QL filtering, Easy / Medium / Hard / Mixed filtering, deterministic seeded selection without replacement, and all three frozen languages.

Generated runs enter the existing Question Studio human-review workflow.

## Release locks

HIS-001 uses `QUESTION-STUDIO-STANDARD-REVIEW-ONLY-V1`.

Question Bank storage, canonical-question conversion, test/mock eligibility, public publication, automatic student publication and production release all remain disabled.

Approving a generated HIS-001 item is an editorial review approval only. The shared approval policy keeps it out of the Question Bank while the package is review-only.

## Content authority

Question Studio reads only the final frozen History localization corpus. The source authorities remain `reviewOnly: true` and `runtimeRegistered: false`; the adapter marks only generated review payloads as registered in Question Studio.

Content changes must be made in the owning History source/localization authority and re-audited.
