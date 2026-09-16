# ENG-002 CP012 — Sentence Improvement: Voice & Narration — Source Audit V1

Status: `IMPLEMENTED__AUTOMATED_VALIDATION_PENDING__HUMAN_REVIEW_PENDING__NOT_QUESTION_STUDIO_REGISTERED`

## Donor authority

ENG-002 CP012 reuses the canonical human-reviewed ENG-001 CP012 Voice & Narration grammar, scene library and difficulty boundaries. The donor source authority covers active/passive compatibility, passive auxiliary chains, intransitive-verb passive errors, modal passives, passive argument mapping, reported-speech backshift, pronouns, time/place reference, reported questions, commands/requests, universal truths and reporting-verb complements.

Donor grammar rules: `GR-VNR-001` through `GR-VNR-012`.

## Scene coverage

- Easy: 20 authored scenes, covering `GR-VNR-001` through `GR-VNR-010`.
- Medium: 24 authored scenes, two per rule across all 12 rules.
- Hard: 24 authored scenes, two per rule across all 12 rules.
- Total review scenes: 68.

The donor difficulty policy is preserved. `GR-VNR-011` and `GR-VNR-012` remain Medium/Hard only.

## Sentence Improvement transformation

Each donor scene is converted into an intact-sentence Sentence Improvement item:

- exactly one donor-owned segment is underlined;
- A–C contain real-word structural replacements;
- D is always `No improvement`;
- the correct donor segment is the keyed replacement for improvement items;
- every fourth scene per difficulty is rendered as a calibrated No-improvement item;
- punctuation is kept outside the learner replacement target;
- no slash segmentation is exposed to learners.

The generator does not invent facts or new voice/narration scenarios. It transforms only the approved donor scene and uses rule-aware distractor families.

## Explanation policy

Every explanation contains:

1. the correction or No-improvement decision;
2. a plain-language `Concept:` statement from the canonical grammar rule;
3. a sentence-specific `Here:` explanation inherited from the donor scene; and
4. the complete corrected sentence.

No option-by-option analysis or shortcut language is used.

## Lifecycle

This checkpoint is review-only until explicit human editorial approval of the generated Markdown artifact.

- `questionBankWritable: false`
- `testEligible: false`
- `mockTestEligible: false`
- `publiclyPublishable: false`
- `productionReleaseAuthorized: false`
- revision policy: `SOURCE_GENERATOR_ONLY`

Question Studio registration must not be added before approval.
