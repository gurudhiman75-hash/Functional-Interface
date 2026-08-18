# RNK-CP-007 — Hindi/Punjabi Native Editorial Review Candidate V3

Status: **EXECUTABLE REVIEW CANDIDATE — HUMAN LANGUAGE REVIEW REQUIRED — NOT MULTILINGUAL FROZEN**

Date: 2026-08-14

## Editorial lineage

- **V1:** semantic-parity candidate; rejected for multilingual freeze after direct/nominative labels were found before native postpositions and the compact rank sentence was incomplete.
- **V2:** fixed oblique/plural handling and rank grammar; its retained 64-question artifact passed machine gates but manual inspection found a remaining feminine interrogative-agreement defect.
- **V3:** carries forward V2 and repairs that agreement defect while changing no mathematics, options, answers, canonical semantic fingerprints or English authority.

The V2 artifact exposed examples such as:

```text
Hindi:   कितने लड़कियाँ / लड़कियाँ कितने हैं?
Punjabi: ਕਿੰਨੇ ਕੁੜੀਆਂ / ਕੁੜੀਆਂ ਕਿੰਨੇ ਹਨ?
```

V3 requires:

```text
Hindi:   कितनी लड़कियाँ हैं?
Punjabi: ਕਿੰਨੀਆਂ ਕੁੜੀਆਂ ਹਨ?
```

`ORDER_OF_MERIT` keeps the already-natural count-noun construction (`लड़कियों की संख्या` / `ਕੁੜੀਆਂ ਦੀ ਗਿਣਤੀ`).

## Canonical authority

```text
English authority:       RNK_CP007_ENGLISH_FREEZE_V1
permanent QL:            RNK-QL-042
English questions:       192
Hindi V3 candidates:     192
Punjabi V3 candidates:   192
new QLs allocated:         0
next available QL:       RNK-QL-043
```

V3 is a learner-surface editorial overlay over V2. Its regression proves that state, evidence, options, answers, explanation arithmetic, mathematical fingerprints, permanent runtime fingerprints, canonical item IDs and canonical semantic fingerprints remain identical to V2/frozen English.

## Lifecycle remains locked

```text
human language review:       REQUIRED
multilingual freeze:          false
Question Studio:              DISABLED
persistence:                  DISABLED
Question Bank:                NOT_STORED
test eligibility:             INELIGIBLE
public publication:           false
product delivery unlocked:    false
```

A new retained 64-question V3 artifact must be manually inspected before any multilingual freeze record is created.
