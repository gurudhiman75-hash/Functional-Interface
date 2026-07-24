# AVG-001 CP-003 Hindi/Punjabi Localization Pilot

Candidate release: `AVG-001-CP003-HI-PA-v1-CANDIDATE`

## Scope

- package: `AVG-001`;
- canonical problem: `AVG-CP-003`;
- active QLs: 98 (86 core QLs plus 12 reverse-count expansion QLs);
- languages: Hindi (`hi`) and Punjabi (`pa`);
- solve families: addition, removal, replacement, reverse added value, reverse removed value, reverse replacement value, cricket innings, original count after joining and original count after leaving;
- age-shift, newborn, child-age, salary, sales, marks, output, weight and cricket contexts are rendered separately;
- the frozen English solver, parameters, answer, options, correct index and mathematical fingerprint remain authoritative and unchanged.

## Release boundary

This is manual-review infrastructure, not a production localization release.

- maturity: `MANUAL_REVIEW`;
- editorial status: `PENDING`;
- `publiclyPublishable: false`;
- Hindi and Punjabi are not advertised in Question Studio;
- `AVG-001-EN-v1`, CP-001 and CP-002 localization pilots remain unchanged.

## Automated gate

The dedicated audit generates each of the 98 QLs in both languages with three seeds: 588 localized packages.

It verifies:

- exact answer, option, correct-index, parameter and mathematical-fingerprint parity with English;
- deterministic localized generation;
- expected Devanagari/Gurmukhi script and no cross-script contamination;
- no English stem or explanation fallback;
- no unresolved placeholders or internal tokens;
- four-step explanations with substituted arithmetic and answer evidence;
- preservation of elapsed years and innings counts in localized stems;
- zero exact cross-QL localized stem duplicates;
- rejection of QLs outside CP-003.

Separate 98-row Hindi and Punjabi CSVs are generated for manual language review.
