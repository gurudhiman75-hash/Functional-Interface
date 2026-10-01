# VEN-001 — Deep Audit Wave 06: Multilingual Quality and Explanation Polish

Date: 2026-10-01

Status: `MULTILINGUAL_GENERATOR_POLISHED__SCRIPT_LEAKAGE_GATES_ADDED__HUMAN_SIGNOFF_STILL_PENDING`

## Scope

Wave 06 reviews the live learner-facing Hindi and Punjabi output for VEN-CP005 through VEN-CP011.

The pass targets:

- Hindi/Punjabi cross-script contamination;
- literal or machine-like Punjabi wording;
- scenario-inappropriate generic terms such as “activity” or “membership”;
- duplicated or instruction-like stem wording;
- question-specific explanation quality;
- stale review artifacts.

This wave does **not** silently clear the runtime `localeParityPendingHumanReview` flags. Those remain pending until explicit human signoff.

## Numerical findings and fixes

### 1. Punjabi CP007 percentage helper leaked Hindi connectors

The percentage helper previously used Hindi `और / दोनों / तीनों` for every non-English locale.

That meant Punjabi percentage questions could contain Devanagari/Hindi wording even though the rest of the question was Punjabi.

Wave 06 now has a dedicated Punjabi branch using:

- `ਅਤੇ`
- `ਦੋਵੇਂ`
- `ਤਿੰਨੇ`

Regression gates reject:

- Devanagari leakage in Punjabi learner text;
- Gurmukhi leakage in Hindi learner text.

### 2. Punjabi machine terms removed

Punjabi explanations contained literal/template terms such as:

- `ਗਤੀਵਿਧੀ`
- `ਮੈਂਬਰਸ਼ਿਪ`

These were replaced with natural group/task wording such as `ਸਮੂਹ`, `ਕੰਮ`, and direct scenario labels.

The numerical and CP011 test suites now reject those machine terms in Punjabi explanations.

### 3. CP005 explanations made question-specific

Before Wave 06, simple two-set questions such as only-A, only-B, exactly-one and union could receive a full reconstruction of all four Venn regions.

Wave 06 changes these to concise derivations:

- only A = A total − overlap;
- only B = B total − overlap;
- exactly one = the two exclusive parts added;
- union = A + B − overlap;
- none = total − union;
- both/total use direct inclusion–exclusion.

This makes the explanation proportional to the question rather than dumping unrelated region calculations.

### 4. CP006 / CP009 explanation wording made scenario-neutral

The shared three-set explanation template previously spoke about “activities” even for club memberships, media use, documents, and other non-activity contexts.

Wave 06 changes the logic to neutral set language:

- group totals;
- pair counts;
- all-three group;
- pair-only regions;
- no-group region.

Hindi `जोड़ी-योग` style wording was also removed.

### 5. CP007 ratio explanations polished

The ratio explanations previously narrated “simplify by HCF 1,” which reads mechanically.

Wave 06 now:

- says the ratio is already in simplest form when the HCF is 1;
- otherwise explicitly divides both terms by the actual HCF.

The three-set percentage-count stem also no longer repeats the surveyed total in the question sentence.

Regression tests enforce both rules.

### 6. CP010 bound explanations naturalized

Hindi/Punjabi bound explanations previously used literal wording equivalent to a person “giving memberships.”

Wave 06 rewrites the reasoning in terms of how many group totals one person can contribute to and why an excess forces an all-group intersection.

Maximum-intersection and maximum-union explanations were also simplified to direct set-count reasoning.

## CP011 findings and fixes

### 1. Single-region explanation grammar

Long activity labels produced awkward constructions equivalent to “the user’s own region.”

Wave 06 now uses neutral diagram language:

- Hindi: “आरेख में केवल इसी समूह वाले क्षेत्र…”
- Punjabi: “ਚਿੱਤਰ ਵਿੱਚ ਸਿਰਫ਼ ਇਸੇ ਸਮੂਹ ਵਾਲੇ ਖੇਤਰ…”

### 2. Pair-only explanation grammar

Pair-only explanations now explicitly describe:

- the region common to the selected two groups;
- outside the excluded third group.

This replaces vague wording such as “this exact region.”

### 3. Union / at-least-two explanation clarity

The Hindi/Punjabi explanations no longer concatenate all three long group labels into an awkward possessive phrase.

They now refer directly to:

- the four regions counted for at-least-two;
- the seven inside regions counted for at-least-one.

### 4. Punjabi municipal wording

`ਮੁੜ-ਵਰਤੋਂ ਪ੍ਰੋਗਰਾਮ` was replaced with the more natural `ਰੀਸਾਈਕਲਿੰਗ ਪ੍ਰੋਗਰਾਮ` in the CP011 municipal-services scenario.

## Review-pack verification

After regeneration, the saved review packs contain:

- numerical CP005–CP010: 144 localized questions;
- CP011 shape-regions: 60 localized questions;
- total checked surface: 204 learner-facing questions.

Automated scan result:

- Hindi→Gurmukhi leakage: 0
- Punjabi→Devanagari leakage: 0
- Punjabi `ਗਤੀਵਿਧੀ` / `ਮੈਂਬਰਸ਼ਿਪ`: 0
- ordinal first/second/third group/activity placeholders: 0

## Lifecycle and signoff

No publication authority changes in Wave 06.

CP005–CP011 remain:

- review-only;
- Question Bank non-writable;
- test/mock ineligible;
- not publicly publishable;
- `REVIEW_CANDIDATE_TRILINGUAL`;
- `localeParityPendingHumanReview: true`.

The generator and review artifacts are materially cleaner, but human language signoff is still an explicit final gate.
