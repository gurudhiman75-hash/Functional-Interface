# DI-005 Hindi/Punjabi Localization — Review Candidate V1

Status: HI_PA_REVIEW_CANDIDATE · HUMAN APPROVAL PENDING

## Scope

- English authority remains DI-QL-049 through DI-QL-060.
- Hindi locale: hi-IN.
- Punjabi locale: pa-IN.
- All 12 permanent DI-005 task families localized from structured task evidence.
- All 6 source contexts and all 30 sector/category labels localized.
- Pie-chart title, instruction, total label, unit, legend labels and accessibility description localized.
- Category-valued answer/options are localized while preserving semantic answer-index binding.
- Numeric values, sector shares, hidden-sector position, central angles, exam-profile option count and canonical arithmetic remain unchanged.
- Hard families preserve the English review contract: the hidden sector is recovered first before ratio / relative-percent / angle / remainder work.

## Review safeguards

- Roman-letter learner-surface leakage is prohibited in Hindi/Punjabi.
- Shared pie SVG learner/accessibility text is checked for native-script leakage.
- All three stem variants are required for every permanent QL in both locales.
- Deterministic replay is required.
- Numeric/semantic parity with the approved English authority is required.
- Hindi/Punjabi Question Studio activation remains blocked pending human approval.
- Question Bank remains NOT_STORED.
- Tests and mocks remain INELIGIBLE.
- Public/student publication remains disabled.
- Production release remains unauthorized.

## Native terminology policy

The localization uses common exam-facing terms rather than literal mechanical translation. Examples include:

- पाई चार्ट / ਪਾਈ ਚਾਰਟ
- प्रतिशत / ਪ੍ਰਤੀਸ਼ਤ
- केंद्रीय कोण / ਕੇਂਦਰੀ ਕੋਣ
- अनुपात / ਅਨੁਪਾਤ
- कुल संख्या / ਕੁੱਲ ਗਿਣਤੀ

Generic English-coded labels such as Course A–E, Product P–T and Category A–E are rendered as numbered native labels to prevent Roman leakage while preserving one-to-one semantic mapping.

## Next gate

Human editorial review of the generated Hindi/Punjabi pack is required before:

- localization status can become HI_PA_FROZEN;
- Hindi/Punjabi can be enabled in Question Studio CONTROLLED_REVIEW.

Question Bank, tests, mocks, public/student publication and production release remain closed regardless of localization approval.
