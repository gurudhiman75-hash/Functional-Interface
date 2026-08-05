# TMW-CP-004 — Hindi/Punjabi Editorial Review

Status: **assistant editorial review complete; human approval pending**.

```text
Checkpoint: TMW-CP-004
QL range: TMW-QL-058..TMW-QL-081
Hindi rows: 24
Punjabi rows: 24
Total reviewed rows: 48
Exact reviewed feature head: 29ea20efb299ce4fe6345db1b3a6537ac315b91c
Checkpoint localisation run: 30970624640
Checkpoint localisation artifact: 8916355731
Checkpoint localisation digest: sha256:b9cdb29ce43bdb2c5d00ba3c37480e7ee7a58677cf58e33e8065ede853706634
Cumulative editorial run: 30970624662
Cumulative editorial artifact: 8916365660
Cumulative editorial digest: sha256:9b63f02231b4f9ef0f659ec3afbd732f5db6d27d3a6717fa160a8140637aafab
Full chapter run: 30970624658
Full chapter artifact: 8916368014
Full chapter digest: sha256:4ed3ef537b62a08d3ff4d6f57f556d492f7d4df2bdcc9c73cc690ea4e2d3a364
```

## Review boundary

The review covered localized stems, answers, four options, openings, worked teaching, exam-speed shortcuts, option-specific trap explanations and conclusions for staged participation, joins, exits, handoffs, inverse event times, rate changes, destructive work, workforce changes and completion-time comparisons.

Mathematical state, answer values, option values, correct indices, misconception identities and fingerprints remain exclusively owned by the frozen English runtime.

This record does not set `editorialStatus: APPROVED`, does not enable `publiclyPublishable`, and is not product-owner or native-speaker approval.

## Decision summary

```text
Reviewed QLs: 24
Reviewed native rows: 48
Deterministic native packages in permanent proof: 576
Hindi deterministic packages: 288
Punjabi deterministic packages: 288
QLs protected by CP-004 editorial remediation: 24
Open automated findings: 0
```

## Accepted remediation themes

- replaced bureaucratic join/leave phrases such as `भागीदारी शुरू/समाप्त` and `ਭਾਗੀਦਾਰੀ ਸ਼ੁਰੂ/ਖਤਮ` with direct exam-language equivalents meaning “was put on the work” or “was removed from the work”;
- removed technical stage phrases such as “active members,” “exact remaining work,” “reference condition” and “changed staged condition”;
- made join-time, leave-time, unknown-phase and target-fraction openings match the exact unknown being solved;
- made required-rate explanations use the visible remaining work and remaining time directly;
- explained changed daily hours and changed efficiency without treating the change day as the final answer;
- expressed delayed destructive work as constructive rate minus destructive rate and retained a positive net-rate interpretation;
- made workforce-addition and workforce-removal explanations distinguish later total workers from workers added or removed;
- rewrote delay and time-saving comparisons using the two actual completion times rather than abstract reference terminology;
- corrected Hindi and Punjabi pronoun grammar after leave events;
- retained exact answer/option, trap/option, formula, worked-math and fingerprint parity with English.

## Permanent regression

`tmw-001-cp004-editorial-review.test.ts` checks:

```text
24 QLs × 12 deterministic seeds × 2 native languages = 576 packages
```

The dedicated CP-004 localisation workflow also checks:

```text
24 QLs × 20 deterministic seeds × 2 native languages = 960 packages
```

The permanent guards require:

- natural join and leave wording;
- no bureaucratic participation phrases;
- no technical active-member, exact-remaining-work or reference-condition language;
- solve-mode-specific openings, shortcuts and traps;
- grammatically governed Hindi and Punjabi leave-event sentences;
- exact answer/option and trap/option alignment;
- valid localized packages;
- `editorialStatus: PENDING`;
- `publiclyPublishable: false`.

## Verdict

```text
ASSISTANT_EDITORIAL_REVIEW_COMPLETE_HUMAN_APPROVAL_PENDING
```

CP-004 is ready for product-owner/native-speaker approval but is not manually frozen or eligible for Question Studio or public integration.