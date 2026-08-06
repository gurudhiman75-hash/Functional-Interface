# TMW-CP-007 — Hindi/Punjabi Editorial Review

Status: **assistant editorial review complete; human approval pending**.

```text
Checkpoint: TMW-CP-007
QL range: TMW-QL-128..TMW-QL-143
Hindi rows: 16
Punjabi rows: 16
Total reviewed rows: 32
Exact reviewed implementation head: 00572b7e0629df093427a4cf8129b797a6adc70c
Checkpoint localisation run: 31066709513
Checkpoint localisation artifact: 8954082533
Checkpoint localisation digest: sha256:739498d16f6ff5415d269edb2e79c85cb67eb3a77bfaeb3c2e5ea43cf9f26e38
Cumulative editorial run: 31066709438
Cumulative editorial artifact: 8954095821
Cumulative editorial digest: sha256:7815aed006881331d066d9507413786b761d716d2a420c577ea54cedf1419d80
Full chapter run: 31066709520
Full chapter artifact: 8954107737
Full chapter digest: sha256:51f60582397693db55bcfd7354f1e254647f2b1306a1bab35b271bf2f6815850
```

## Review boundary

The review covered two- and three-category efficiency ratios, mixed-crew completion time and output, equivalent-category counts, additional-category counts, crew compositions from multiple output facts, category rates from weighted crew facts, heterogeneous group rates, category replacement, standard-resource equivalence, minimum and constrained integer crew compositions, unknown solo time, contribution fractions and two-crew comparisons.

English remains the mathematical authority. Parameters, exact answers, option values, correct indices, misconception identities, formulas, worked mathematics and mathematical fingerprints were not remodeled.

This record does not set `editorialStatus: APPROVED`, does not enable `publiclyPublishable`, and is not product-owner or native-speaker approval.

## Decision summary

```text
Reviewed QLs: 16
Reviewed native rows: 32
Deterministic native packages in permanent cumulative proof: 384
Hindi deterministic packages: 192
Punjabi deterministic packages: 192
Dedicated all-seed packages: 640
QLs protected by CP-007 editorial remediation: 16
Hindi distinct stems: 151
Punjabi distinct stems: 151
Open automated findings: 0
```

## Accepted remediation themes

- replaced generic shortcut labels with method-specific headings;
- supplied solve-mode-specific openings for all 16 QLs;
- taught inverse count-to-efficiency ratios and correct alignment of the common category in three-part ratios;
- calculated mixed-crew rates through category count × one-member rate before summing;
- distinguished equivalent total category count from additional category count;
- formed and solved two- and three-equation crew systems without leaking unknown rates or answers;
- compared old and replacement groups through old rate ÷ new rate for equal work;
- calculated a category’s contribution as its rate contribution divided by total group contribution;
- preserved requested category and crew order in pair, triple and comparison answers;
- explicitly required positive whole-number crew counts in constrained composition questions;
- normalized governed Hindi and Punjabi duration forms across stems and explanations;
- preserved the exact displayed answer inside natural conclusions such as “3 दिन लगेंगे”;
- replaced singular copulas after plural count answers with direct requirement wording;
- removed technical phrases such as per-resource rate, active category, weighted rate, record and headcount-only reasoning;
- preserved exact answer/option, trap/option and English mathematical parity.

## Permanent regression

`tmw-001-cp007-editorial-review.test.ts` checks:

```text
16 QLs × 12 deterministic seeds × 2 native languages = 384 packages
```

The dedicated CP-007 localisation workflow additionally checks:

```text
16 QLs × 20 deterministic seeds × 2 native languages = 640 packages
```

The permanent guards require:

- method-specific native shortcut titles;
- solve-mode-specific teaching and conclusions;
- natural Hindi/Punjabi case, number and duration agreement;
- positive-integer constraints where crew counts are being solved;
- exact displayed answer preservation in conclusions;
- misconception-specific trap explanations linked to the selected option;
- exact answer/option, correct-index and English mathematical parity;
- valid localized packages;
- `editorialStatus: PENDING`;
- `publiclyPublishable: false`.

## Verdict

```text
ASSISTANT_EDITORIAL_REVIEW_COMPLETE_HUMAN_APPROVAL_PENDING
```

CP-007 is ready for product-owner/native-speaker review but is not manually frozen or eligible for Question Studio or public integration.