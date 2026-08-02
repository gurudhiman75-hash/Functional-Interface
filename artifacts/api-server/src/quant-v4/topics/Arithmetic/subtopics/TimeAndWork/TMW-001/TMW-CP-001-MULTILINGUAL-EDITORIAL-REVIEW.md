# TMW-CP-001 — Hindi/Punjabi Editorial Review

Status: **assistant editorial review complete; human approval pending**.

This record covers the deterministic manual-review rows for:

```text
Checkpoint: TMW-CP-001
QL range: TMW-QL-001..TMW-QL-020
Hindi rows: 20
Punjabi rows: 20
Total reviewed rows: 40
Source chapter artifact: 8834195484
Source artifact digest: sha256:8a4abed2d764bca30a99d56218618e93c239fe5a84908cbd2d7100801538068e
```

## Review boundary

The review checked learner-facing:

- stems;
- answers and four options;
- opening guidance;
- formulas and worked steps;
- exam-speed shortcuts;
- option-specific trap explanations;
- conclusions;
- Hindi/Punjabi naturalness, grammar and script separation.

Mathematical correctness, parameter state, answer authority, option authority, misconception identity, correct index and fingerprint remain owned by the frozen English runtime.

This review does **not** set `editorialStatus: APPROVED`, does not set `publiclyPublishable: true`, and does not represent product-owner or external human approval.

## Decision summary

```text
Rows accepted without change: 25
Rows remediated after review: 15
Rows rejected or unresolved: 0
QLs with remediation: 11
Automated proof packages after remediation: 480
```

## Accepted remediation findings

| QL | Language | Field | Finding | Resolution |
|---|---|---|---|---|
| TMW-QL-003 | Hindi | stem | Literal rate-word order | Changed to `4 आवेदन प्रतिदिन` |
| TMW-QL-003 | Punjabi | stem | Literal rate-word order | Changed to `4 ਅਰਜ਼ੀਆਂ ਪ੍ਰਤੀ ਦਿਨ` |
| TMW-QL-006 | Hindi | common trap | Explanation did not identify why `1/5` was wrong | States that it represents 3 days, while the question asks for 2 days |
| TMW-QL-006 | Punjabi | common trap | Explanation did not identify why `1/5` was wrong | States that it represents 3 days, while the question asks for 2 days |
| TMW-QL-007 | Punjabi | stem | Quantity agreement in `ਕਿੰਨੇ ਪ੍ਰਤੀਸ਼ਤ ਹਿੱਸਾ` | Changed to `ਕਿੰਨਾ ਪ੍ਰਤੀਸ਼ਤ ਹਿੱਸਾ` |
| TMW-QL-011 | Punjabi | stem | Quantity agreement in `ਕਿੰਨੇ ਪ੍ਰਤੀਸ਼ਤ ਹਿੱਸਾ` | Changed to `ਕਿੰਨਾ ਪ੍ਰਤੀਸ਼ਤ ਹਿੱਸਾ` |
| TMW-QL-012 | Hindi | opening/shortcut | Overly literal `प्रति इकाई समय` phrasing | Rewritten as daily production × number of days |
| TMW-QL-012 | Punjabi | opening/shortcut | Overly literal `ਪ੍ਰਤੀ ਇਕਾਈ ਸਮੇਂ` phrasing | Rewritten as daily production × number of days |
| TMW-QL-013 | Punjabi | opening/shortcut | Unnatural `ਪਤਾ ਹਿੱਸੇ` | Changed to `ਦਿੱਤੇ ਹਿੱਸੇ` |
| TMW-QL-014 | Punjabi | opening/shortcut | `ਅਧੂਰਾ ਕੰਮ` incorrectly suggested unfinished work | Rewritten as time taken for the given part of the work |
| TMW-QL-015 | Hindi | stem/opening/shortcut | Literal and grammatically weak production sentence | Rewritten as bottles filled in 6 hours and 3 hours |
| TMW-QL-015 | Punjabi | stem/opening/shortcut | Literal and grammatically weak production sentence | Rewritten as bottles filled in 6 hours and 3 hours |
| TMW-QL-017 | Punjabi | opening/shortcut | Missing Punjabi postposition punctuation | Changed to `ਦਰ 'ਤੇ` |
| TMW-QL-019 | Punjabi | stem | Missing Punjabi postposition punctuation | Changed to `ਆਮ ਤੌਰ 'ਤੇ` |
| TMW-QL-020 | Punjabi | stem | Missing Punjabi postposition punctuation | Changed to `ਆਮ ਤੌਰ 'ਤੇ` |

## Rows accepted without remediation

The Hindi and Punjabi rows for the following QLs were accepted at this review stage without wording changes:

```text
TMW-QL-001, 002, 004, 005, 008, 009, 010,
TMW-QL-016, 018
```

For QLs with a language-specific remediation, the unaffected language row was also accepted without change where applicable.

## Permanent regression

`tmw-001-cp001-editorial-review.test.ts` checks:

```text
20 QLs × 12 deterministic seeds × 2 native languages = 480 packages
```

It requires:

- zero open blocked wording findings;
- valid localized packages;
- four unique options;
- exact answer/option alignment;
- exact trap/option alignment;
- `editorialStatus: PENDING`;
- `publiclyPublishable: false`.

## Verdict

```text
ASSISTANT_EDITORIAL_REVIEW_COMPLETE_HUMAN_APPROVAL_PENDING
```

CP-001 may advance to product-owner/native-speaker approval, but it is not manually frozen and is not eligible for product integration or publication.
