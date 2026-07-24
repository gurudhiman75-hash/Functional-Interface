# AVG-001 CP-001 Hindi/Punjabi Localization Pilot

Candidate release: `AVG-001-CP001-HI-PA-v1-CANDIDATE`

## Scope

- package: `AVG-001`;
- canonical problem: `AVG-CP-001`;
- active QLs: 80;
- languages: Hindi (`hi`) and Punjabi (`pa`);
- localized stems: 80 per language;
- localized explanations: question-specific arithmetic rendered in four concise steps;
- English solver, parameters, answers, options and mathematical fingerprints remain authoritative and unchanged.

## Release boundary

This is a manual-review pilot, not a production localization release.

- maturity: `MANUAL_REVIEW`;
- editorial status: `PENDING`;
- `publiclyPublishable: false`;
- Hindi and Punjabi are not advertised in Question Studio capabilities;
- the frozen English release `AVG-001-EN-v1` is unchanged.

## Automated gates

The pilot audit requires:

- exact 80/80 QL coverage in each language;
- three deterministic generations per QL and language;
- exact answer, option, correct-index, parameter and mathematical-fingerprint parity with English;
- no unresolved placeholders or internal values;
- Devanagari-only Hindi prose and Gurmukhi-only Punjabi prose;
- no English stem or explanation fallback;
- four-line explanations with substituted arithmetic and final-answer evidence;
- zero exact cross-QL localized stem duplicates;
- all non-CP-001 QLs rejected by the pilot entry point.

## Manual review

The generated Hindi and Punjabi CSVs remain `PENDING`. Review should focus on natural competitive-exam phrasing, grammar, terminology, script consistency and whether each conclusion fits its context. Approval and Question Studio exposure require a separate release decision.
