# AVG-001 CP-002 Hindi/Punjabi Localization Pilot

Candidate release: `AVG-001-CP002-HI-PA-v1-CANDIDATE`

## Scope

- package: `AVG-001`;
- canonical problem: `AVG-CP-002`;
- active QLs: 62;
- languages: Hindi (`hi`) and Punjabi (`pa`);
- solve modes: consecutive/equally spaced averages, middle terms, extreme terms, odd/even sets, reverse term counts and common differences;
- localized stems: 62 per language;
- localized explanations: four concise steps with substituted arithmetic;
- frozen English solver, parameters, answers, options, correct index and mathematical fingerprint remain authoritative and unchanged.

## Release boundary

This is review infrastructure, not a production localization release.

- maturity: `MANUAL_REVIEW`;
- editorial status: `PENDING`;
- `publiclyPublishable: false`;
- Hindi and Punjabi remain unavailable in Question Studio;
- the English release `AVG-001-EN-v1` remains unchanged.

## Required pilot gates

- all 62 active CP-002 QLs covered in both languages;
- exact mathematical parity with English across three seeds per QL;
- deterministic localized generation;
- no unresolved placeholders or internal tokens;
- expected Devanagari/Gurmukhi script with no cross-script contamination;
- no English prose fallback;
- four-line explanations with substituted arithmetic and final-answer evidence;
- zero exact cross-QL localized stem duplicate groups;
- separate 62-row Hindi and Punjabi review CSVs;
- complete English freeze, API, Render, admin and student checks remain green.

A separate approval change is required before either language can be published or exposed in Question Studio.
