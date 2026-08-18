# IOP-001 — English Review Candidate Evidence V1

Status: **ENGLISH_REVIEW_CANDIDATE — automated and artifact audit passed; human/product-owner freeze not granted**.

## Authority state

```text
packageId:                     IOP-001
chapterId:                     REAS-INP
sourceFamilySaturation:        PASS_V1
permanentQlCount:              8
whitelistedSourceModeCount:    19
English automated scale proof: PASS
English human-audit pack:      PASS
English artifact audit:        PASS
English freeze:                false
Question Studio:               false
Question Bank:                 false
testEligible:                  false
publiclyPublishable:           false
Hindi/Punjabi:                 NOT_STARTED
```

`ENGLISH_REVIEW_CANDIDATE` means the permanent English authorities and review artifacts are ready for human/product-owner acceptance. It is deliberately **not** an English freeze or product activation.

## Exact green chapter gate

Feature head that introduced the final learner-facing implementation before this metadata closure:

```text
524bb1d41d1b33a71609d2c4543a60340c463907
```

Authoritative PR merge-ref workflow:

```text
workflow run: 31990896800
job:          95274155333
result:       SUCCESS
```

The serialized chapter gate passed:

### Discovery regressions

```text
CP001–CP004 foundation
  deterministic caselets:       960
  child questions:             3,840
  competing rule executions:  58,080
  unique visible caselets:       960

CP005–CP010 advanced
  deterministic caselets:       720
  child questions:             2,880
  competing program executions:18,400
  unique visible caselets:       720

RBI mixed source gap
  deterministic caselets:       160
  child questions:               640
  competing rule executions:  23,040
```

### Permanent allocation

```text
permanent QLs:                  8
mapped discovery authorities:  28
CP010 machine QLs:              0
Question Studio:                false
Question Bank:                  false
```

### English production scale proof

```text
PASS_IOP_001_ENGLISH_PRODUCTION_AUTHORITIES
permanent QLs:                  8
whitelisted source modes:      19
scaled caselets:               96
scaled child questions:       384
solve modes covered:            8
unique scaled caselets:        96
answer positions:      99 / 102 / 98 / 85
English freeze:              false
Question Studio:             false
```

### Human-review audit proof

```text
PASS_IOP_001_ENGLISH_REVIEW_AUDIT
review caselets:               38
review questions:             152
box display coherence:       PASS
```

Exact query distribution:

```text
STEP_OUTPUT:              20
FINAL_OUTPUT:             20
ELEMENT_AT_POSITION:      18
POSITION_OF_ELEMENT:      18
STEP_NUMBER:              19
PREVIOUS_STEP:            19
MISSING_STEP:             19
REMAINING_STEP_COUNT:     19
```

Strict TypeScript and the production API build also passed in the same serialized gate.

## Final review artifact

Artifact from run `31990896800`:

```text
artifact id: 9275284412
artifact:    iop-001-english-permanent-review
SHA-256:     ea0b9a7a6544fce1b8285c89a5534b76bbdc287debee2a5907caefb57b0d2f53
```

Contents:

```text
IOP-001-ENGLISH-PERMANENT-REVIEW.html
IOP-001-ENGLISH-PERMANENT-REVIEW.json
```

Independent artifact inspection confirmed:

- 38 caselets;
- 152 child questions;
- all 8 permanent QLs represented;
- all 19 source modes represented exactly twice;
- exact balanced query distribution above;
- four semantically unique options for every child;
- exactly one correct option per child;
- answer index and answer display parity;
- child explanations contain the specific answer;
- child explanations do not repeat the full shared machine rule;
- no `1 steps` grammar leakage;
- word-only and number-only authorities use domain-correct directions;
- lifecycle remains review-only in every caselet;
- no duplicate learner-visible machine states within caselets.

## QL008 box fairness remediation

The English review cycle found two box-specific fairness hazards and fixed both before this candidate state:

1. random rejection sampling was too sparse for the source topology, so production now constructs source-shaped valid box groups directly while preserving the source rule, independent oracle and 48-rule ambiguity audit;
2. displayed Step-3 quotients are rounded to two decimals, so generated demonstrations/targets are now accepted only when the **visible rounded quotients reproduce the visible final answer exactly**.

The final artifact was checked again: both QL008 demonstrations and both QL008 targets satisfy visible arithmetic coherence.

Final-value options are numeric peers and structured-state questions use same-shape distractors so the answer cannot be identified by option shape alone.

## English source-mode boundary

Production remains narrower than the executable discovery engine.

In particular:

- `IOP-QL-005` uses the source-backed odd-reverse/even-increment two-ended numeric machine;
- `IOP-QL-006` V1 uses the source-backed RBI-style **text** transformation pipeline; alphanumeric production remains outside the V1 whitelist even though the permanent semantic QL can own future source-backed alphanumeric modes;
- `IOP-QL-007` uses the source-pinned RBI Grade B 2024 mixed transformed-pair family;
- `IOP-QL-008` uses the source-backed cross-product / digit-combine / quotient / difference box family;
- discovery-only arbitrary reverse/rotate/pair-rewrite pipelines remain quarantined.

## Remaining approval gate

The next action is **human/product-owner English review and explicit freeze decision**.

Until that approval:

```text
englishFreeze = false
Hindi/Punjabi = NOT_STARTED
questionStudioDiscoverable = false
questionBankWritable = false
testEligible = false
publiclyPublishable = false
```

No localization or product integration is authorized by this evidence file.
