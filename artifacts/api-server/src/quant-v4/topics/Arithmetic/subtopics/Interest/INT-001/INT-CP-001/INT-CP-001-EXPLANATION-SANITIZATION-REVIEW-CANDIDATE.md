# INT-CP-001 Explanation Sanitization Review Candidate

## Scope

This record freezes the learner-explanation remediation candidate created after the senior editorial and technical audit of the 315-record multilingual review corpus.

```text
Patch:     INT-CP-001-EXPLANATION-SANITIZATION-V1
English:   INT-CP-001-EN-v5 — unchanged approved release
Hindi:     INT-CP-001-HI-v5 — pending human review
Punjabi:   INT-CP-001-PA-v5 — pending human review
QL range:  INT-QL-001..INT-QL-021
```

## Finding disposition

### Accepted defects

1. A numeric percentage token was sometimes substituted into a formula that already contained explicit percentage conversion through `/100` or a leading `100` inverse formula.
2. `₹` / `\text{₹}` appeared inside TeX math segments in localized explanations.
3. Learner-shaped Markdown included QL IDs, deterministic seeds, solve-contract labels and `<sub>Trace: ...</sub>` footers.

### Clarified finding

Different locale release ordinals are not, by themselves, evidence of numerical or answer-position drift. English, Hindi and Punjabi were already protected by exact cross-language option-value and correct-index parity checks. Hindi and Punjabi move to V5 here because their learner-facing explanations genuinely change, not merely to make the numbers match English.

### Deferred non-blocking observation

The Meera/cooperative-bank context occurs 13 times in each 105-question language sample. This is recorded as a low-severity variety observation, but no stem churn is included in an explanation-only remediation because stems are already approved and the repetition is not a mathematical, linguistic or delivery defect.

## Sanitization contract

- Remove currency glyphs only from inside TeX math delimiters; keep currency in prose, options and conclusions.
- Remove a numeric `\%` only when the same TeX expression already carries explicit percent conversion and the rate token is used multiplicatively.
- Preserve valid percentage-unit scaling such as `20\% \times \frac{3}{2}=30\%` when no additional `/100` conversion is present.
- Preserve standalone rate results such as `R=12.5\%`.
- Emit learner Markdown without QL IDs, seeds, solve-contract names or trace tags.
- Retain complete traceability in companion JSON and CSV reviewer artifacts.

## Frozen-content boundary

For Hindi and Punjabi the following must remain identical to the approved V4 source:

- canonical stem;
- rich-stem presentation and emphasis spans;
- source parameters and internal provenance;
- option values and displayed option order;
- correct answer and correct index;
- reasoning graph and mathematical fingerprint;
- close-distractor ownership and proximity data.

Only explanation presentation plus release/review lifecycle metadata may change.

## Candidate lifecycle

```text
maturity:                    EXPLANATION_SANITIZATION_CANDIDATE
reviewStatus:                PENDING_EXPLANATION_SANITIZATION_REVIEW
localeReviewStatus:          PENDING_HUMAN_REVIEW
questionBankStatus:          NOT_STORED
testEligibility:             INELIGIBLE
publiclyPublishable:         false
questionStudioDiscoverable:  false
registrationStatus:          NOT_REGISTERED
```

## Representative correction

Before:

```tex
I=\frac{P\times R\times T}{100}=\frac{₹2,500\times 12.5\%\times4}{100}=₹1,250
```

After:

```tex
I=\frac{P\times R\times T}{100}=\frac{2,500\times12.5\times4}{100}=1,250
```

The surrounding localized conclusion continues to state the answer with the currency symbol.

## Review boundary

This candidate is not approved merely because automated checks pass. Hindi V5 and Punjabi V5 require explicit human review. No Question Studio registration, Question Bank storage, mock-test eligibility, publication, PR readiness transition or merge is authorized by this record.
