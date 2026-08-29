# BTD-001 CP007 localization status

Status: HI/PA review candidate only. Not frozen. Not Question Studio enabled.

Authority chain:
- CP005 English content remains frozen and immutable.
- CP006 English Question Studio remains review-only with downstream delivery locked.
- CP007 v3 derives Hindi/Punjabi learner surfaces from the same deterministic source state and preserves the frozen English option order, correct answer, correct index, option ownership and misconception metadata.

Correction trace:
- v2 localized stems/explanations preserved source-state and English-content fingerprints, but its exported `options` field accidentally flattened rich option objects to text strings.
- v3 restores the full option contract (`text`, `isCorrect`, optional `misconceptionId`) from the frozen English authority. It does not alter source states, mathematics, stems, correct answers or worked localized explanations.

Release boundary:
- multilingualFrozen: false
- questionStudioDiscoverable for HI/PA: false
- questionStudioGenerationEnabled for HI/PA: false
- questionBankWritable: false
- testEligible: false
- mockTestEligible: false
- publiclyPublishable: false

Promotion requires the exact-head v3 localization audit plus review of the generated 120-question Hindi/Punjabi review corpus.
