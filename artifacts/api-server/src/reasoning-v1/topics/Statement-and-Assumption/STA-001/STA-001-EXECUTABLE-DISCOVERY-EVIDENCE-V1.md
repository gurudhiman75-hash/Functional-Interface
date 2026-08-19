# STA-001 — Executable Discovery & Permanent QL Semantic Freeze Evidence V1

Status: **PERMANENT QL SEMANTIC FREEZE CANDIDATE / DOWNSTREAM GATES CLOSED**

This evidence records the transition of `STA-001 — Statement & Assumption` from design/source discovery into executable proof and stable QL identity.

## 1. Scope

Frozen semantic IDs:

```text
STA-QL-001
STA-QL-002
STA-QL-003
STA-QL-004
```

Checkpoints:

```text
STA-CP-001  Core Hidden Dependencies
STA-CP-002  Prescriptive, Communicative & Bridge Assumptions
```

Candidate count, answer coding, option order and negative wording are representation metadata and do not create QLs.

## 2. Source-normalized QL boundaries

### STA-QL-001

Core prerequisite / existence / availability / capability / feasibility dependency.

### STA-QL-002

Recommendation / proposal / policy / decision whose rationale requires a real need/relevance plus efficacy or feasibility.

### STA-QL-003

Source-supported notice / rule / institutional communication whose purpose requires audience relevance, ability to respond or service/action capability.

Advertising and appeal breadth are not silently included; they remain deferred pending stronger source evidence.

### STA-QL-004

Claim / prediction that requires a genuinely hidden causal or efficacy bridge between explicit information and the stated outcome.

Human review rejected the first QL-004 prototype wording because the candidate assumption was too close to a paraphrase of the explicit prediction. The reviewed V2 authorities instead contain an explicit premise plus a distinct hidden bridge.

## 3. Reviewed executable authorities

Current canonical executable authority set:

```text
STA-QL-001  3 scenarios
STA-QL-002  4 scenarios
STA-QL-003  3 scenarios
STA-QL-004  3 scenarios
TOTAL       13 scenarios
```

The QL-002 set contains a three-assumption scenario in which all three assumptions are independently necessary, proving a genuine `All I, II and III` outcome.

## 4. Oracle independence proof

The semantic oracle computes assumption status from:

1. proposition identity;
2. explicit-versus-hidden status;
3. hidden dependency membership;
4. linkage to the actual discourse objective;
5. semantic denial evidence.

The oracle does **not** read `expectedClassification` to compute the answer.

Mutation proof includes:

- flip editorial expected answer -> oracle result must remain unchanged;
- remove required hidden dependency -> formerly implicit candidate must become `NOT_IMPLICIT`;
- mark required proposition explicit -> candidate must become `NOT_IMPLICIT / EXPLICIT_RESTATEMENT`;
- remove semantic opposite -> integrity must reject the authority.

## 5. Deterministic generation proof

Dedicated CI runs:

```text
120 seeds per QL
4 QLs
480 generated questions per proof run
```

Validated dimensions:

- deterministic replay;
- two- and three-assumption candidate counts;
- four unique answer options;
- exactly one correct semantic answer set;
- all four answer positions used in every QL;
- both implicit and non-implicit assumptions generated;
- real all-three-implicit outcomes generated;
- no internal enum/rule leakage into student explanations;
- Question Studio and publication gates remain closed.

The reviewed V2 executable run produced:

```text
curated scenario authorities:             13
generated deterministic questions:        480
generated candidate assumptions:          1173
implicit candidates:                      607
not-implicit candidates:                  566
all-three-implicit questions:              30
editorial/oracle parity checks:             39
expected-answer independence checks:        39
dependency-removal mutation checks:         21
explicitness mutation checks:               21
```

Answer-position distribution in that run:

```text
STA-QL-001  33 / 23 / 32 / 32
STA-QL-002  32 / 28 / 33 / 27
STA-QL-003  25 / 39 / 28 / 28
STA-QL-004  29 / 38 / 24 / 29
```

## 6. Human review findings

The generated HTML/JSON review pack was inspected after CI generation.

Accepted characteristics:

- short, exam-style statements;
- concise question-specific explanations;
- no formula/rule-dump style;
- realistic same-scenario distractors;
- necessary-vs-plausible distinctions are explained in plain language;
- QL-004 now uses actual hidden bridge reasoning rather than explicit restatement;
- three-assumption combinations render naturally.

## 7. Deferred reserves

No permanent ID is allocated for:

```text
advertising / appeal breadth as a separate QL
comparison / measurement / representativeness as a separate QL
negative query wording as a separate QL
```

These remain source-dependent reserves. Presentation variants cannot create permanent logic by themselves.

## 8. Lifecycle after semantic freeze

```text
maturity:                    PERMANENT_QL_SEMANTIC_FREEZE
permanentQlCount:            4
questionStudioDiscoverable:  false
questionBankWritable:        false
testEligible:                false
publiclyPublishable:         false
Hindi/Punjabi:               NOT_STARTED
English production corpus:   NOT_FROZEN
```

This is a **QL-identity freeze**, not a chapter/publication freeze.

## 9. Next gate

Before English chapter freeze:

1. expand the curated scenario/family library substantially inside the four permanent QLs;
2. audit semantic diversity rather than seed count alone;
3. run ambiguity and cross-QL collision suites;
4. audit misconception distribution and answer-pattern balance;
5. perform human exam-readiness review of a larger export;
6. freeze English only after no-known-content-gap review.

Hindi/Punjabi and Question Studio remain downstream of English freeze.
