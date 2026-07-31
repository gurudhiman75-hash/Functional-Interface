# INT-CP-001 Calculation-Rich Explanation Review Candidate

Date: 2026-07-31

## Candidate releases

```text
English:  INT-CP-001-EN-v6
Hindi:    INT-CP-001-HI-v6
Punjabi:  INT-CP-001-PA-v6
Patch:    INT-CP-001-CALCULATION-RICH-EXPLANATIONS-V1
Status:   PENDING_CALCULATION_RICH_EXPLANATION_REVIEW
```

## Reason for this wave

Manual review found that some explanations displayed the symbolic formula but did not consistently show the actual generated values inside that formula or the intermediate arithmetic/algebra. The issue affected the explanation authority, not only the exported review sample.

## Candidate contract

Every solve contract now provides at least four worked steps that collectively show:

1. known values and time conversion where required;
2. the governing formula;
3. actual numerical substitution;
4. intermediate arithmetic or algebra;
5. the final result and numerical check.

The two advanced amount-ratio modes explicitly cross-multiply and isolate the requested variable:

- `INT-QL-017`: annual rate from two-time amount ratio;
- `INT-QL-021`: later time from two-time amount ratio.

## Frozen content boundary

The candidate preserves:

- all 21 permanent QL identities and solve contracts;
- canonical stems and structured emphasis spans;
- source parameters, hidden state and mathematical fingerprints;
- option values, option order and correct index;
- reasoning graphs and canonical solver/verifier results;
- close-distractor ownership and proximity metadata;
- all storage, test, publication and Question Studio locks.

Only learner-facing explanation content and candidate lifecycle/release metadata change.

## Pre-record executable proof

```text
Head:       b4eea53c58b5bb8d4b843c267b1a2ac99bb5cb2c
Workflow:   Validate INT-CP-001 calculation-rich explanations
Run:        30598096591
Conclusion: PASS
Artifact:   8780888189
Digest:     sha256:244958eba5f7aba5651fa41a5f7bffc9eaedb89384c0a80ae5b9cd374701d11a
```

```text
21 QLs × 80 seeds × 3 languages:    5,040 questions
Deterministic checks:                5,040
Frozen-content checks:              5,040
Lifecycle checks:                   5,040
Worked-step checks:                 5,040
Formula checks:                     5,040
Numeric-substitution checks:        5,040
Arithmetic checks:                  5,040
Math-sanitization checks:           5,040
Cross-language parity checks:       3,360
Advanced ratio-algebra checks:        480
```

Each language covered all 21 QLs and all four answer positions.

## Human-review corpus

```text
English: 105 questions / 420 worked steps
Hindi:  105 questions / 420 worked steps
Punjabi: 105 questions / 420 worked steps
Total:   315 questions / 1,260 worked steps
```

Every language has 105 distinct stems, at least four worked steps per question and exact cross-language option-value/correct-index parity.

## Lifecycle boundary

```text
enabled:                    false
registrationStatus:         NOT_REGISTERED
questionStudioDiscoverable: false
questionBankStatus:         NOT_STORED
testEligibility:            INELIGIBLE
publiclyPublishable:        false
```

This record is a review-candidate checkpoint. It is not an approval, registration, activation, publication or merge authorization.
