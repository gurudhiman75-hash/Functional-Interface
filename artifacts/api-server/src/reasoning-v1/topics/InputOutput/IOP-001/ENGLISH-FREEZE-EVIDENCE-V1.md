# IOP-001 English Freeze Evidence V1

Package: `IOP-001 — Machine Input–Output & Sequential Rearrangement`  
Chapter: `REAS-INP`  
Status: **ENGLISH_FROZEN**  
Human/product-owner approval date: **2026-08-18 (Asia/Kolkata)**

## Approval boundary

The revised English learner pack was explicitly approved after the review remediation for:

- full worked, question-specific explanations;
- substantially deeper word/number/object authorities;
- zero duplicate target inputs in the 38-caselet review pack;
- retained source/oracle/identifiability and option-fairness gates.

The approval freezes **English learner content only**. It does not authorize Question Studio registration, Question Bank writes, test/mock delivery, public publication, PR merge, or automatic activation.

Hindi/Punjabi localization may now begin against this frozen English authority and must pass its own semantic-parity and human-language review/freeze gates.

## Approved learner artifact

The human-approved content is pinned to the reviewed learner-facing implementation:

```text
reviewed feature head:  c0bde9aa516571e3adf71bbc99b83d2d2e7e8f3f
workflow run:           32031090452
artifact id:            9288927949
artifact name:          iop-001-english-permanent-review
artifact archive digest:
sha256:a407a19e24aeeb343690799a3b73ebd1ef5fbf45d945b43840724cb241dc0211
```

Inner reviewed files:

```text
IOP-001-ENGLISH-PERMANENT-REVIEW.html
sha256:a889a98086633330f0619eabd30a06067c79c52780599108591c8ed388657079

IOP-001-ENGLISH-PERMANENT-REVIEW.json
sha256:94b5c9b31fb497c972fccba79f948e37db22d6e945a5311f0f7036e52f7fc936
```

Canonical learner-content fingerprint (review caselets with lifecycle metadata removed):

```text
sha256:58a91a0dd0b5faeb0e601e8d5b587a0f7768a65c246530f5bb316b73b9232413
```

`english-freeze-authority.test.ts` regenerates the exact 38 approved caselets and must reproduce this canonical fingerprint. Any learner-content drift therefore requires a new human review/approval rather than silently inheriting this freeze.

## Frozen scope

```text
permanent QLs:              8
source-whitelisted modes:  19
review caselets:           38
review questions:         152
solve modes:                8
English freeze:          true
```

All eight permanent QLs have `englishProductionStatus: ENGLISH_FROZEN`.

The frozen review pack retains the approved quality remediation:

```text
general words:                    188
general two-digit numbers:         89
minimum alternatives/length:      20
minimum alternatives/vowel bin:   24
mixed RBI number candidates:      900
review-pack distinct words:       149
review-pack distinct numbers:     105
duplicate target inputs:            0
```

## Lifecycle after approval

```text
maturity:                     ENGLISH_FROZEN
English human approval:       APPROVED_2026_08_18
English freeze:               true
Hindi/Punjabi:                NOT_STARTED
Question Studio:              false
Question Bank writes:         false
test eligibility:             false
public publication:           false
```

The discovery lifecycle remains separate and unchanged so discovery/regression caselets cannot inherit delivery maturity.

## Next content gate

**Hindi/Punjabi localization over the frozen English QLs**, followed by bilingual semantic-parity proof and human language review.

Product activation remains a later, separate gate.
