# AVG-001 Hindi/Punjabi Stem Quality Reset

## Why this reset is required

The original CP-001, CP-002 and CP-003 localization pilots passed mathematical parity, script and placeholder audits, but those checks did not adequately measure natural human-authored exam language.

Manual inspection of the generated review sheets found release-blocking editorial defects:

- non-person values such as scores, sales days, prices, parcels and machine output were described as members joining or leaving a group;
- Hindi and Punjabi noun, gender and oblique-case agreement errors remained in age and machine questions;
- CP-002 used translated labels such as `अंक-श्रृंखला`, `मूल्य-श्रृंखला` and their Punjabi equivalents instead of naturally phrased exam situations;
- CP-001 retained machine-like phrases, vague subjects and unnecessary `.0` number formatting;
- many stems followed the same translated sentence skeleton even when their real contexts differed.

## Corrective scope

This change resets the presentation layer for every currently localized AVG question:

- AVG-CP-001: 80 QLs;
- AVG-CP-002: 62 QLs;
- AVG-CP-003: 98 QLs;
- languages: Hindi and Punjabi;
- total localized stems under review: 480.

The frozen English mathematical packages remain the sole source of truth. Answers, options, correct indices, parameters, solve modes, difficulty labels and mathematical fingerprints are not changed.

## New editorial approach

Each stem is reconstructed from its actual context rather than translating an internal mathematical role.

Examples include:

- test score or next examination instead of a value joining a group;
- a sales day being added or excluded instead of a member joining or leaving;
- a machine being installed, removed or replaced with correct grammatical agreement;
- a parcel being included or removed from a weight set;
- salary, price, age, cricket and production questions using their own natural vocabulary;
- arithmetic-progression questions expressed as real score, price, production, distance or number sequences without artificial translated labels.

## Automated gate

The cross-CP stem-quality audit generates two deterministic seeds for every Hindi and Punjabi question: 960 packages.

It rejects:

- unresolved placeholders and internal values;
- English prose or cross-script contamination;
- known literal-translation and generic-member defects;
- missing context vocabulary;
- machine and child agreement defects;
- unnecessary `.0` formatting;
- exact duplicate stems;
- sentence skeletons repeated more than three times.

## Release boundary

Hindi and Punjabi remain:

- maturity: `MANUAL_REVIEW`;
- editorial status: `PENDING`;
- `publiclyPublishable: false`;
- unavailable in Question Studio.

No localized package should be approved until the regenerated review sheets have been inspected after this reset.

## Next phase: explanation authorship

After stem quality is accepted, a separate chapter-wide explanation pass will cover:

- all 425 frozen English QLs;
- all Hindi and Punjabi QLs currently localized in CP-001 to CP-003;
- future CP-004 to CP-006 localizations.

That phase will replace repeated generic explanation blocks with context-aware, QL-specific openings, arithmetic routes, transitions, checks and conclusions. It will also add normalized explanation-skeleton diversity gates. Explanation variation will never change the underlying mathematical proof.
