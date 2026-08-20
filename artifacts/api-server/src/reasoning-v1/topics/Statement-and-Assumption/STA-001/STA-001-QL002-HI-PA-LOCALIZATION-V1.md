# STA-001 QL002 Hindi/Punjabi Localization V1

Status: **REVIEW CANDIDATE V1 / UNFROZEN**

QL001 Hindi/Punjabi is already frozen as `STA-001-QL001-HI-PA-v2-frozen`. QL002 localization starts from that protected base and from the independently frozen English V2 corpus.

## Coverage

The complete frozen QL002 English authority is localized, not a sample:

- frozen QL002 authorities: **16**;
- reviewed discovery authorities: **4**;
- English expansion authorities: **6**;
- V2 gap-fill authorities: **6**;
- Hindi authored stems: **32**;
- Punjabi authored stems: **32**.

The slice covers need/relevance, efficacy and feasibility assumptions plus explicit-restatement, too-strong, value-judgement, wrong-timeframe, wrong-stakeholder, reverse-dependency and feasibility-overreach distractors.

## Semantic boundary

The localized runtime gets question structure from frozen English and changes learner-facing copy only. The parity proof requires exact equality for:

- question / QL / scenario / seed identity;
- selected candidate IDs;
- oracle classification and evidence;
- answer set and correct option index;
- option semantic answer sets;
- difficulty and source profile;
- all downstream publication locks.

QL001 immutable freeze proof runs before the QL002 proof in CI, so QL002 cannot advance if the approved QL001 learner surface changes.

## Editorial baseline

QL002 V1 begins directly with the native terminology approved during QL001 review:

- Hindi: `पूर्वधारणा / निहित`;
- Punjabi: `ਧਾਰਨਾ / ਨਿਹਿਤ`.

The rejected translation-heavy QL001 V1 terms are regression-blocked in generated QL002 learner content. Explanations begin directly with candidate decisions and do not repeat the full question stem.

## Lifecycle

```text
English corpus/runtime:   FROZEN_V2
QL001 Hindi/Punjabi:      FROZEN_V2
QL002 Hindi/Punjabi:      REVIEW_CANDIDATE_V1 / UNFROZEN
QL003 Hindi/Punjabi:      NOT_STARTED
QL004 Hindi/Punjabi:      NOT_STARTED
multilingual STA chapter: NOT_FROZEN
Question Studio:          CLOSED
Question Bank writes:     CLOSED
mock/test eligibility:    CLOSED
public publication:       CLOSED
```

QL002 requires exact-head CI and direct learner review of the retained 64-question Hindi/Punjabi artifact before any freeze decision.
