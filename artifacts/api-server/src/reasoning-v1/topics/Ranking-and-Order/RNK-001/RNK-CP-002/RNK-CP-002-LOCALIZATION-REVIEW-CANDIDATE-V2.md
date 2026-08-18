# RNK-CP-002 — Hindi/Punjabi Native Editorial Review Candidate V2

Status: **EXECUTABLE REVIEW CANDIDATE — HUMAN LANGUAGE REVIEW REQUIRED — NOT MULTILINGUAL FROZEN**

Date: 2026-08-14

## Editorial lineage

V1 proved semantic parity across 1,536 Hindi and 1,536 Punjabi records and passed the frozen-English/build regressions. Direct inspection of its retained 128-question learner artifact found two native-language defects:

1. QL-015 extreme-total questions used direct/singular-looking category forms before count-genitive constructions, e.g. `व्यक्ति की अधिकतम संख्या` / `ਵਿਅਕਤੀ ਦੀ ਵੱਧ ਤੋਂ ਵੱਧ ਗਿਣਤੀ` rather than the natural plural/genitive forms;
2. sentence-valued QL-017 outcomes already ended in `है` / `ਹੈ`, but generic answer explanation framing appended another copula, producing forms such as `... है है।` / `... ਹੈ ਹੈ।`.

V1 remains semantic-parity evidence. **V2 supersedes V1 as the human-language review candidate.**

## V2 remediation

QL-015 learner stems now require:

```text
Hindi
अभ्यर्थियों की अधिकतम/न्यूनतम संख्या
व्यक्तियों की अधिकतम/न्यूनतम संख्या

Punjabi
ਉਮੀਦਵਾਰਾਂ ਦੀ ਵੱਧ ਤੋਂ ਵੱਧ/ਘੱਟ ਤੋਂ ਘੱਟ ਗਿਣਤੀ
ਵਿਅਕਤੀਆਂ ਦੀ ਵੱਧ ਤੋਂ ਵੱਧ/ਘੱਟ ਤੋਂ ਘੱਟ ਗਿਣਤੀ
```

QL-017 option explanations, option analysis and conclusions remove only a duplicated terminal copula. The localized answer and option values themselves are unchanged.

## Invariance contract

Across the complete 3,072-record V2 bank, the regression preserves V1 exactly for:

- package/checkpoint/permanent QL/authority identity;
- context and localized person identities;
- displayed evidence;
- answer semantic;
- localized answer value;
- localized option values and labels;
- misconception identities;
- correct option position;
- difficulty;
- normalized state;
- mathematical fingerprint;
- canonical semantic fingerprint;
- structured-evidence/canonical-outcome provenance;
- lifecycle locks.

Only QL-015 stems may differ for the genitive repair. Option explanation prose, rebuilt option-analysis prose and conclusions may differ only by terminal duplicate-copula removal.

## Inventory

```text
permanent QLs:                  RNK-QL-010..017
Hindi V2 candidates:                    1536
Punjabi V2 candidates:                  1536
total localized candidates:             3072
human review pack:                    64 + 64
new QLs allocated:                         0
next available QL:                RNK-QL-043
```

## Lifecycle

```text
English frozen:                  true
Hindi/Punjabi:                   REVIEW_CANDIDATE
human language review:           REQUIRED
multilingual freeze:             false
Question Studio:                 DISABLED
Question Bank:                   NOT_STORED
test eligibility:                INELIGIBLE
public publication:              false
product delivery unlocked:       false
```

The retained V2 128-question artifact must be inspected directly before CP002 can be marked review-ready.
