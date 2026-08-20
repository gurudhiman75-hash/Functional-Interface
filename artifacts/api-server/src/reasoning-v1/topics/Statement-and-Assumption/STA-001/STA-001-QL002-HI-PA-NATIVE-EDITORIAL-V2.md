# STA-001 QL002 Hindi/Punjabi Native Editorial V2

Status: **REVIEW CANDIDATE V2 / UNFROZEN**

QL002 V1 passed semantic parity and generated the full bilingual review surface, but direct learner review rejected it for freeze because several phrases remained translation-heavy or grammatically weak. V2 is a learner-copy editorial overlay only; it does not alter frozen English, QL identity, oracle evidence, answer identity or the already frozen QL001 Hindi/Punjabi surface.

## V1 review findings corrected

Hindi corrections include:
- `लंबित कतार` phrasing replaced with natural wording around applications remaining pending;
- `लक्षित ...` phrasing removed from learner copy where it sounded mechanical;
- `स्टाफिंग / कर्मचारी क्षमता` wording rewritten around actual employee availability;
- `व्यवहारिक` normalized to `व्यावहारिक`;
- status-tracking, loaner-device and inspection rationales simplified;
- awkward appointment wording corrected;
- `बड़ी सिस्टम अपग्रेड ... की जाएगी` agreement corrected to `बड़ा सिस्टम अपग्रेड ... किया जाएगा`.

Punjabi corrections include:
- application `ਹਾਲਤ` normalized to `ਸਥਿਤੀ`;
- `ਨਿਸ਼ਾਨਾ ਬਣਾਏ / ਨਿਸ਼ਾਨਾ ਬਣਾਈ` translationese removed;
- `ਸਟਾਫਿੰਗ` and capacity-heavy phrasing rewritten around employee/inspection availability;
- pending-application queue wording naturalized;
- kiosk overreach rewritten as a direct universal-capability claim;
- appointment wording corrected, including the misleading `ਛੁੱਟੀਆਂ ਅਪਾਇੰਟਮੈਂਟਾਂ` construction;
- system-upgrade gender/agreement corrected;
- maintenance explanations simplified.

## Semantic boundary

V2 wraps the proven QL002 V1 localization runtime and edits learner-facing text only. The V2 proof requires exact equality with V1 for:

- question / QL / scenario / seed identity;
- selected candidate IDs;
- oracle classification, evidence and misconception semantics;
- answer set and correct option index;
- option semantic answer sets and correctness flags;
- difficulty and source profile;
- QL001 freeze identity and all downstream product locks.

The V2 regression proof also blocks the exact translation-heavy fragments rejected during direct V1 learner review.

## Review surface

The V2 exporter emits both authored stems for every frozen QL002 authority in both languages:

- frozen QL002 authorities: **16**;
- Hindi: **32** questions / **32 unique stems**;
- Punjabi: **32** questions / **32 unique stems**;
- combined native-review surface: **64** questions.

## Lifecycle

```text
English corpus/runtime:   FROZEN_V2
QL001 Hindi/Punjabi:      FROZEN_V2
QL002 Hindi/Punjabi V1:   TECHNICALLY GREEN / REJECTED FOR FREEZE BY EDITORIAL REVIEW
QL002 Hindi/Punjabi V2:   REVIEW_CANDIDATE_V2 / UNFROZEN
native/product approval:  NOT_RECORDED
QL003 Hindi/Punjabi:      NOT_STARTED
QL004 Hindi/Punjabi:      NOT_STARTED
multilingual STA chapter: NOT_FROZEN
Question Studio:          CLOSED
Question Bank writes:     CLOSED
mock/test eligibility:    CLOSED
public publication:       CLOSED
```

V2 requires exact-head CI plus direct review of its retained 64-question artifact before any localization freeze decision.
