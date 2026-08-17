# TMW-CP-002 — Hindi/Punjabi Editorial Review

Status: **assistant editorial review complete; human approval pending**.

```text
Checkpoint: TMW-CP-002
QL range: TMW-QL-021..TMW-QL-034
Hindi rows: 14
Punjabi rows: 14
Total reviewed rows: 28
```

## Review boundary

The review covered localized stems, answers, options, openings, worked teaching, shortcuts, option-specific trap explanations and conclusions. Mathematical state continues to come exclusively from the frozen English runtime.

The result does not set `editorialStatus: APPROVED`, does not enable `publiclyPublishable`, and is not product-owner or native-speaker approval.

## Decision summary

```text
Rows accepted without change: 16
Rows remediated after review: 12
Rows rejected or unresolved: 0
QLs with remediation: 8
Deterministic native packages in permanent proof: 336
```

## Accepted remediation findings

| QL | Language | Finding | Resolution |
|---|---|---|---|
| TMW-QL-023 | Punjabi | Literal `ਪਤਾ ਮੈਂਬਰਾਂ` and `ਪਤਾ ਦਰ` | Changed to `ਜਾਣੇ ਮੈਂਬਰਾਂ` and `ਜਾਣੀ ਦਰ` across learner fields |
| TMW-QL-025 | Punjabi | Unnatural `ਸਾਹਮਣੀ ਜੋੜੀ-ਦਰ` | Changed to `ਬਾਕੀ ਜੋੜੀ-ਦਰ` |
| TMW-QL-026 | Punjabi | Literal `ਪਤਾ ਦਰ` | Changed to `ਜਾਣੀ ਦਰ` |
| TMW-QL-028 | Hindi | Awkward destructive-process question | Reframed as the time taken if only that process operates |
| TMW-QL-028 | Punjabi | Awkward destructive-process question | Reframed as the time taken if only that process operates |
| TMW-QL-029 | Hindi | Unknown first member was referred to only as “both” | Names members A and B explicitly and uses the inverse signed-rate relation |
| TMW-QL-029 | Punjabi | Unknown first member was referred to only as “both” | Names members A and B explicitly and uses the inverse signed-rate relation |
| TMW-QL-030 | Hindi | Plural count answer followed by singular `है` | Changed to `हैं` |
| TMW-QL-030 | Punjabi | Plural count answer followed by singular `ਹੈ` | Changed to `ਹਨ` |
| TMW-QL-032 | Hindi | Hourly rates called “daily production rates” | Replaced with unit-neutral `उत्पादन दरें` |
| TMW-QL-032 | Punjabi | Hourly rates called “daily production rates” | Replaced with unit-neutral `ਉਤਪਾਦਨ ਦਰਾਂ` |
| TMW-QL-033 | Punjabi | Literal `ਪਤਾ ਦਰ` | Changed to `ਜਾਣੀ ਦਰ` |

## Rows accepted without remediation

Both native rows for QLs 021, 022, 024, 027, 031 and 034 were accepted without changes. Unaffected language rows for language-specific findings were also accepted.

## Permanent regression

`tmw-001-cp002-editorial-review.test.ts` checks:

```text
14 QLs × 12 deterministic seeds × 2 native languages = 336 packages
```

It requires:

- zero blocked reviewed phrases;
- explicit unknown-agent wording in QL-029;
- natural count agreement in QL-030;
- time-unit-neutral output wording in QL-032;
- four unique options;
- exact answer/option and trap/option alignment;
- valid localized packages;
- `editorialStatus: PENDING`;
- `publiclyPublishable: false`.

## Verdict

```text
ASSISTANT_EDITORIAL_REVIEW_COMPLETE_HUMAN_APPROVAL_PENDING
```

CP-002 is ready for product-owner/native-speaker approval but is not manually frozen or eligible for product integration.
