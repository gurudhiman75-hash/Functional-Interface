# TMW-CP-006 — Hindi/Punjabi Editorial Review

Status: **assistant editorial review complete; human approval pending**.

```text
Checkpoint: TMW-CP-006
QL range: TMW-QL-106..TMW-QL-127
Hindi rows: 22
Punjabi rows: 22
Total reviewed rows: 44
Exact reviewed implementation head: 8e066e71962d1c8edba323ea1142eb3fe62ca4d6
Checkpoint localisation run: 31019056786
Checkpoint localisation artifact: 8935806894
Checkpoint localisation digest: sha256:df6c3595556985902d1a2ee1bed63f285f99f5f22feca995263ae94fac05281b
Cumulative editorial run: 31019057397
Cumulative editorial artifact: 8935803823
Cumulative editorial digest: sha256:9728f925748624ea0c9f3699a0f12a0ad9265ce8f4265e0e23289b6a7704e26d
Full chapter run: 31019056887
Full chapter artifact: 8935848829
Full chapter digest: sha256:5ae9f2ce5ebcd07ab82850b86079835841e5abe1236ad7b7f3a5eed5b3a32e85
```

## Review boundary

The review covered localized stems, answers, options, openings, givens, worked teaching, shortcuts, misconception-linked traps and conclusions for equivalent work states, changed workforce and schedules, progress recovery, overtime, production scaling, dimensional work, population-stock questions, absenteeism, staged worker additions and equivalent resource-time questions.

English remains the mathematical authority. Parameters, exact answers, option values, correct indices, misconception identities, formulas, worked mathematics and mathematical fingerprints were not remodeled.

This record does not set `editorialStatus: APPROVED`, does not enable `publiclyPublishable`, and is not product-owner or native-speaker approval.

## Decision summary

```text
Reviewed QLs: 22
Reviewed native rows: 44
Deterministic native packages in permanent cumulative proof: 528
Hindi deterministic packages: 264
Punjabi deterministic packages: 264
Dedicated all-seed packages: 880
QLs protected by CP-006 editorial remediation: 22
Open automated findings: 0
```

## Accepted remediation themes

- replaced shared rule-level textbook openings with direct solve-mode teaching;
- stated clearly which quantity remains equal before scaling workers, days, hours or efficiency;
- distinguished required total workforce from additional workers and removed workers;
- made progress-recovery explanations separate completed work, remaining work and remaining time;
- accepted natural remaining-work wording such as “subtract the completed part from 1” instead of forcing symbolic phrasing;
- clarified overtime as required total daily hours minus normal daily hours;
- contextualized the total-versus-change trap for overtime so it refers to total hours and extra hours, not a generic “new total number”;
- corrected removed-worker conclusions from singular copula constructions to natural forms such as “9 clerks can be removed”;
- made production questions identify output per unit per shift before scaling;
- made dimensional questions include every changing dimension rather than treating the work as one-dimensional;
- treated food, stock and similar resources through remaining person-days after elapsed consumption or population change;
- made absenteeism explanations use the number actually present;
- made staged worker-addition explanations sum the changing daily workforce instead of applying one fixed count;
- made equivalent resource-time traps misconception-aware, including omitted work ratio, hours, efficiency or inverse relation;
- removed formal phrases such as `मूल व्यवस्था`, `बदली व्यवस्था`, `ਮੂਲ ਵਿਵਸਥਾ` and `ਬਦਲੀ ਵਿਵਸਥਾ` across stems and explanations;
- preserved exact answer/option and trap/option linkage after all editorial transformations.

## Permanent regression

`tmw-001-cp006-editorial-review.test.ts` checks:

```text
22 QLs × 12 deterministic seeds × 2 native languages = 528 packages
```

The dedicated CP-006 localisation workflow additionally checks:

```text
22 QLs × 20 deterministic seeds × 2 native languages = 880 packages
```

The permanent guards require:

- solve-mode-specific openings and conclusions;
- misconception-specific and context-correct traps;
- natural Hindi and Punjabi grammar for count, time and production answers;
- no internal identifiers, English leakage or formal system wording;
- no raw mixed fractions or uninflected time expressions;
- exact answer/option, trap/option and English mathematical parity;
- valid localized packages;
- `editorialStatus: PENDING`;
- `publiclyPublishable: false`.

## Verdict

```text
ASSISTANT_EDITORIAL_REVIEW_COMPLETE_HUMAN_APPROVAL_PENDING
```

CP-006 is ready for product-owner/native-speaker approval but is not manually frozen or eligible for Question Studio or public integration.