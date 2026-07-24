# AVG-001 English Freeze Record

Release ID: `AVG-001-EN-v1`  
Approval date: `2026-07-24`  
Approval authority: `ExamTree product owner`

## Status

**APPROVED / PASS — ENGLISH FREEZE READY**

The English AVG-001 question library is approved for controlled publication. Runtime packages are emitted with maturity `FROZEN`, `publiclyPublishable: true`, and release traceability for `AVG-001-EN-v1`.

## Locked scope

- Package: `AVG-001`
- Canonical problems: 6
- Active English QLs: 425
- Solve modes: 45
- Difficulty distribution: 109 Easy / 187 Medium / 129 Hard
- Approved language: English (`en`)
- Excluded languages: Hindi (`hi`) and Punjabi (`pa`)
- Runtime exposure: Question Studio
- Maturity: `FROZEN`
- Publication state: `publiclyPublishable: true`

## Verification completed

- 5,100 deterministic chapter-test generations passed;
- 5,100 independent-verifier cases passed with zero mathematical or display mismatches;
- 1,275 dedicated freeze generations passed across all 425 QLs and three seeds each;
- 850 Hindi/Punjabi rejection checks passed;
- active QLs are unique and consecutively numbered `AVG-QL-001` to `AVG-QL-425`;
- exact CP and difficulty distribution passed;
- unresolved placeholder/internal-token failures: 0;
- cross-QL exact rendered stem duplicate groups: 0;
- all packages contain four unique options and misconception-based distractor traceability;
- all packages carry a passing `release-approval` validation check;
- combined and CP-specific review exports regenerated with all quality fields `PASS` and editorial status `APPROVED`;
- API build and Question Studio production gate passed;
- Render production build and deployment-artifact verification passed;
- admin typecheck, tests and application build passed;
- student application build and single-site hosting assembly passed.

## Language boundary

This freeze does not approve Hindi or Punjabi content. Both languages remain rejected at runtime and require a separate localization, editorial review and release cycle before exposure.

## Change control

Any change to English QLs, templates, solve modes, parameter construction, answers, options, explanations, difficulty labels, release metadata or supported languages invalidates this freeze and requires a new review cycle with a new release ID.
