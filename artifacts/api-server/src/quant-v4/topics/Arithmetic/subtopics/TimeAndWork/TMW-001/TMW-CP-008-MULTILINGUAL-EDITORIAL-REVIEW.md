# TMW-CP-008 — Hindi/Punjabi Editorial Review

Status: **assistant editorial review complete; human approval pending**.

```text
Checkpoint: TMW-CP-008
QL range: TMW-QL-144..TMW-QL-156
Hindi rows: 13
Punjabi rows: 13
Total reviewed rows: 26
Exact reviewed implementation head: 77cdec264c41e577c8799978c85313a5d8ab156a
Checkpoint localisation run: 31142643574
Checkpoint localisation artifact: 8980322831
Checkpoint localisation digest: sha256:b906eaf19350fdee6e7def9aaca165755f236387ea48fd4dc6fe01309c56bbbc
Cumulative editorial run: 31142646704
Cumulative editorial artifact: 8980334292
Cumulative editorial digest: sha256:9d94db9e78ec1491b91647bfa37f81e5750cc4630fa8a2ada7131347aa2b4e80
Full chapter run: 31142646822
Full chapter artifact: 8980343498
Full chapter digest: sha256:c7a35c6d7659b1275f931fb90b8593ae166892dc0aa30bd4b39cf3e99a3931e1
```

## Review boundary

The review covered contribution-based payment ratios, selected-person and selected-group payments, recovery of total payment from a known share, residual payment, staged participation, completed-work fractions, inverse contribution-factor questions, missing time and efficiency, mixed-category payment distribution, piece-rate payment, target-based bonuses and signed or defective contribution.

English remains the mathematical authority. Parameters, exact answers, option values, correct indices, misconception identities, formulas, worked mathematics and mathematical fingerprints were not remodeled.

This record does not set `editorialStatus: APPROVED`, does not enable `publiclyPublishable`, and is not product-owner or native-speaker approval.

## Decision summary

```text
Reviewed QLs: 13
Reviewed native rows: 26
Deterministic native packages in permanent cumulative proof: 312
Hindi deterministic packages: 156
Punjabi deterministic packages: 156
Dedicated all-seed packages: 520
QLs protected by CP-008 editorial remediation: 13
Hindi distinct stems: 118
Punjabi distinct stems: 118
Open automated findings: 0
```

## Accepted remediation themes

- replaced broad rule-level openings with direct teaching for all 13 solve modes;
- explained payment as a share of total contribution rather than attendance alone;
- combined efficiency, work days and hours per day only where each factor actually applies;
- separated a selected person’s or group’s contribution from total contribution;
- recovered total payment from a known share without treating one person’s payment as the total;
- handled residual payment by subtracting every previously paid amount from the fixed total;
- counted only the duration during which each person actually participated in staged work;
- linked completed-work fractions directly to payment fractions;
- isolated unknown time or efficiency after removing all known contribution factors;
- calculated mixed-category contribution as member count × one-member rate × duration;
- counted only accepted units in piece-rate payment;
- calculated bonus shares from production above the individual target, not total production;
- deducted rejected or rework quantities before distributing payment;
- replaced generic shortcut labels with method-specific headings;
- replaced mechanical terms such as contribution product, contribution weight, active time, payment pool, selected recipient and target share;
- made every trap explanation correspond to its exact misconception;
- preserved exact answer/option, trap/option and English mathematical parity.

## Permanent regression

`tmw-001-cp008-editorial-review.test.ts` checks:

```text
13 QLs × 12 deterministic seeds × 2 native languages = 312 packages
```

The dedicated CP-008 localisation workflow additionally checks:

```text
13 QLs × 20 deterministic seeds × 2 native languages = 520 packages
```

The permanent guards require:

- solve-mode-specific Hindi and Punjabi teaching;
- method-specific shortcut titles and steps;
- misconception-specific trap explanations linked to the selected option;
- natural native-language grammar and terminology;
- exact displayed answer preservation in conclusions;
- correct rupee delivery and payment-order preservation;
- exact answer/option, correct-index and English mathematical parity;
- valid localized packages;
- `editorialStatus: PENDING`;
- `publiclyPublishable: false`.

## Verdict

```text
ASSISTANT_EDITORIAL_REVIEW_COMPLETE_HUMAN_APPROVAL_PENDING
```

CP-008 is ready for product-owner/native-speaker review but is not manually frozen or eligible for Question Studio or public integration.