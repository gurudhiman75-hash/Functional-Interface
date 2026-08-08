# MAL-CP-004 — Solution-First English V2 Review Candidate

## Status

This is a **presentation candidate pending product review**. It is not a second approved release.

```text
Released mathematical authority: MAL-CP004-EN-v1
V2 candidate:                    MAL-CP004-EN-v2
Core runtime:                    MAL-CP004-EN-PERMANENT-RUNTIME-V1
Presentation runtime:            MAL-CP004-EN-PRESENTATION-RUNTIME-V2
Product-review remediation:      MAL-CP004-EN-PRODUCT-REVIEW-REMEDIATION-V3
Presentation review:             PENDING_PRODUCT_REVIEW
Candidate runtime mode:          REVIEW_ONLY
Candidate Question Bank writes:  disabled
Candidate test/public delivery:  disabled
Question Studio:                 review preview only
```

The released V1 mathematical authority remains available independently. The V2 presentation cannot claim `APPROVED`, `RELEASED`, Question Bank, mock-test or public-delivery status before explicit acceptance.

## Learner contract

The default learner view contains only:

1. **Solution** — one to four number-specific lines;
2. **Answer** — the concise final value.

`More help` remains collapsed and may contain:

- one QL-specific common mistake;
- verification only for `MAL-QL-045` and `MAL-QL-047`;
- an alternative alligation cross only for `MAL-QL-041` and `MAL-QL-042`.

The default view contains no forced Method heading, separate Calculation heading, Fast Method, Quick Check or learner-facing analysis of all wrong options.

## Responsive alligation policy

Alligation is available only when one ingredient has a known extreme concentration:

- `MAL-QL-041`: original solution mixed with `0%` water;
- `MAL-QL-042`: original solution mixed with `100%` pure solute.

The optional method carries the shared structured directive:

```text
[[EXAMTREE_ALLIGATION_SVG_V1:<validated-base64url-payload>]]
```

The existing responsive `AlligationDiagram` renderer therefore displays the cross. A separate ASCII or preformatted cross is not the presentation authority.

Each applicable method retains:

- both source concentrations;
- the target concentration;
- crossed percentage-point differences;
- the reduced quantity ratio;
- the number-specific calculation and result.

Alligation remains omitted from direct percentage, evaporation, known solvent-change, inverse-volume and moisture families.

## Value-quality policy for MAL-QL-038

`MAL-QL-038` is an Easy direct-percentage family. The review candidate deterministically selects a source-backed state whose requested component quantity is an integer.

The selector:

1. starts with the requested seed;
2. retains it when the answer is integral;
3. otherwise tries deterministic derived seeds;
4. records both the requested and selected seed;
5. verifies the selected state against the released V1 mathematical runtime.

This removes avoidable answers such as `50 2/5 litres` from the Easy surface without inventing a new formula or QL.

## Distractor policy

All ten QLs now use only method-derived distractors. Arbitrary nearby values, arithmetic offsets and `±10% of total` fillers are forbidden.

For `MAL-QL-038`, authorised errors include:

- using the complementary component;
- copying the printed percentage as litres;
- subtracting the percentage number from the total;
- dividing by 100 twice;
- applying the component fraction twice;
- reporting the total mixture.

Other QLs retain calculation-specific errors such as using the wrong denominator, reporting an intermediate total, confusing solute with solvent, applying the wrong conserved quantity or using the wrong moisture fraction.

Every displayed wrong option has one named misconception authority and is independently checked against the exact answer.

## Preserved mathematical authority

The candidate preserves:

- permanent QLs `MAL-QL-038..047`;
- core runtime `MAL-CP004-EN-PERMANENT-RUNTIME-V1`;
- source evidence and ownership;
- task direction, answer semantic and difficulty;
- exact solver and verifier authority.

For ordinary QLs, the requested seed maps to the same V1 state. For `MAL-QL-038`, any deterministic value-quality reselection is compared with V1 using the recorded selected seed.

## Explanation depth

- `MAL-QL-038..040`: one worked calculation line;
- `MAL-QL-041..044`: two or three conserved-quantity lines;
- `MAL-QL-045`: explicit one-variable evaporation equation;
- `MAL-QL-046..047`: dry-matter conservation in two or three lines.

Arithmetic remains MathJax-ready. Ambiguous chained division is rejected.

## Executable proof target

```text
Permanent QLs × seeds:                10 × 200
Candidate questions:                      2,000
Deterministic repeats:                     2,000
Selected-state parity with released V1:   2,000
Question Studio candidate parity:          2,000
Method-derived wrong options:              6,000
Integral MAL-QL-038 answers:                 200
Responsive shared alligation visuals:        400
Non-applicable alligation omissions:        1,600
Human-review questions:                      100
Distinct review states:                      100
Review answer positions:             25/25/25/25
Review responsive alligation crosses:          20
```

## Merge boundary

The branch remains draft and unmerged. Product acceptance, presentation activation, Question Bank writes, mock-test eligibility, publication, Hindi and Punjabi remain separate later decisions.
