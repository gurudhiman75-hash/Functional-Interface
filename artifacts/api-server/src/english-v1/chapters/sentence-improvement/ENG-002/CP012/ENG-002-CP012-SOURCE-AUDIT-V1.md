# ENG-002 CP012 — Sentence Improvement: Voice & Narration — Source Audit V1

Status: `HUMAN_APPROVED__QUESTION_STUDIO_REVIEW_ONLY_REGISTERED__POST_APPROVAL_GATE_PENDING`

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

- exactly one donor-owned correction locus is underlined;
- A–C contain real-word structural replacements;
- D is always `No improvement`;
- the correct donor structure is the keyed replacement for improvement items;
- every fourth scene per difficulty is rendered as a calibrated No-improvement item;
- punctuation is kept outside the learner replacement target;
- no slash segmentation is exposed to learners.

For command/request scenes where the donor error segment contains only the infinitive complement, the learner-visible target may be widened to include the immediately adjacent reporting verb + object. This keeps distractors contextual and tests the full reporting structure instead of presenting isolated mechanical fragments. The underlying donor sentence, rule and correction remain unchanged.

The generator does not invent facts or new voice/narration scenarios. It transforms only the approved donor scene and uses rule-aware distractor families.

## Curated rule overlays

Automated and learner-facing review identified five rule families where the generic donor mutation alone could not consistently supply three distinct Sentence Improvement alternatives without weak or duplicated choices. CP012 therefore applies deterministic source-generator overlays for:

- `GR-VNR-003` — intransitive verbs: removes malformed base-form shortcuts such as *had arrive* / *did arrived* and keeps the contrast on invalid passive treatment;
- `GR-VNR-006` — reported backshift: supplies tense forms tied to the donor's explicit past reporting point;
- `GR-VNR-008` — time/place reference: supplies alternatives tied to the donor's stated reporting date/place;
- `GR-VNR-010` — commands/requests: preserves the reporting verb + object context where needed;
- `GR-VNR-012` — reporting-verb complements: uses explicit `say` / `tell` / `explain` / `inform` valency contrasts.

These overlays change only distractor construction and learner target span where necessary. They do not alter donor facts, keyed grammar rules or corrected sentences.

## Explanation policy

Every explanation contains:

1. the correction or No-improvement decision;
2. a plain-language `Concept:` statement from the canonical grammar rule;
3. a sentence-specific `Here:` explanation inherited from the donor scene; and
4. the complete corrected sentence.

No option-by-option analysis or shortcut language is used.

## Approval boundary

The exact human-approved review is pinned by `ENG002_CP012_HUMAN_EDITORIAL_APPROVAL_V1` to reviewed generator head `df464a97cc3d73949a216f4df3682d476737cf28`, Markdown SHA-256 `eb7a9023c87c0bd1098f398b55a3b608f5f6ebd7e6ad84042b147dd77b5d9a91`, and workflow artifact digest `sha256:696874430a61b987ef0a389aeb0c4cc299049345edae8bf0ca250dc9fe7057a6`.

Explicit human editorial approval was granted on 2026-09-17. Any learner-facing generator change after the approved head requires a new review artifact and new approval.

## Automated validation

The dedicated CP012 post-approval gate validates:

- 2,000 deterministic generations per difficulty (6,000 total);
- deterministic replay;
- option uniqueness and answer-position balance;
- rule and semantic-domain reachability;
- all 68 deterministic review scenes;
- Question Studio review-only lifecycle behavior;
- review Markdown materialization; and
- the API server build.

## Lifecycle

Question Studio review-only registration is authorized. Learner-facing release remains locked.

- `questionStudioReviewOnlyAuthorized: true`
- `questionBankWritable: false`
- `testEligible: false`
- `mockTestEligible: false`
- `publiclyPublishable: false`
- `automaticStudentPublication: false`
- `productionReleaseAuthorized: false`
- revision policy: `SOURCE_GENERATOR_ONLY`
