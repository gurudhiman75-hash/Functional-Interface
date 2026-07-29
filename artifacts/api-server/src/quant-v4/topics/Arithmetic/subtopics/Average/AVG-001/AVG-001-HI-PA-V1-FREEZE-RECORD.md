# AVG-001 Hindi and Punjabi V1 Freeze Record

Hindi release ID: `AVG-001-HI-v1`  
Punjabi release ID: `AVG-001-PA-v1`  
Approval date: `2026-07-29`  
Approval authority: `ExamTree product owner`

## Status

**APPROVED / FROZEN / MULTILINGUAL QUESTION STUDIO RELEASE**

The complete Hindi and Punjabi Average learner presentations are approved for controlled publication through Question Studio. English remains the mathematical authority for parameters, exact answers, option values, correct indices and mathematical fingerprints.

## Frozen inventory

- Package: `AVG-001`
- Canonical problems: 6
- Active QLs per language: 425
- Hindi QL range: `AVG-QL-001` through `AVG-QL-425`
- Punjabi QL range: `AVG-QL-001` through `AVG-QL-425`
- Solve modes: 45
- Released languages: Hindi (`hi`) and Punjabi (`pa`)
- Runtime exposure: Question Studio and generation engine
- Maturity: `FROZEN`
- Publication state: `publiclyPublishable: true`

## Localisation contract

Each released localized package must retain:

- a context-faithful Hindi or Punjabi stem in the required script;
- exactly four localized explanation lines with substituted arithmetic and answer evidence;
- the English mathematical parameters and fingerprint;
- the English answer, four option values and correct index;
- deterministic localized output for the same QL, seed and language;
- a passing `localized-release-approval` validation check;
- release traceability for the corresponding language release ID.

## Verification authority

The release gate must prove:

- all 425 active QLs in each language;
- complete six-CP and 45-solve-mode coverage;
- 1,700 seeded localized release cases across Hindi and Punjabi;
- 1,700 deterministic replay checks;
- 1,700 script-presence checks;
- 1,700 mathematical parity checks;
- zero mathematical-fingerprint changes;
- zero answer, option, correct-index or parameter changes;
- exactly four explanation lines for every localized package;
- passing multilingual Question Studio adapter integration;
- passing full generation-engine integration and capability exposure;
- passing API and production build gates.

## Change control

Any localized stem or explanation change, terminology change, release metadata change, supported-language change or mathematical parity change requires a new language review and release cycle.
