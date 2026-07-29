# MAL-CP-001 Product Approval and First-Allocation Scope

Status: **candidate scope approved; exhaustive QL expansion open**  
Approval date: **2026-07-28**  
Approval authority: **ExamTree product owner**  
Permanent QLs: **0**

## 1. Meaning of the approval

The product owner explicitly approved the scoped recommendation produced after executable discovery, source reconciliation, ownership review and English editorial-v2 closure.

The approval freezes which mathematical contracts and executable representations may enter the first CP-001 allocation expansion. It does **not** imply that:

- all sixty individual English review rows were separately approved;
- the permanent QL count is known;
- solve-mode or question-language inventories are frozen;
- permanent `MAL-QL-*` IDs may be assigned immediately;
- Question Studio, Question Bank or public routing may be enabled.

Individual question-row review status remains `PENDING` until a later row-level editorial decision is recorded.

## 2. Approved candidate contracts

Six candidate contracts may enter exhaustive QL-template and solve-mode expansion:

```text
MAL-CP001-FREEZE-TARGET-RATIO
MAL-CP001-FREEZE-FINAL-MEAN
MAL-CP001-FREEZE-UNKNOWN-SOURCE-VALUE
MAL-CP001-FREEZE-UNKNOWN-COMPONENT-QUANTITY
MAL-CP001-FREEZE-QUANTITIES-FROM-RATIO-SCALE
MAL-CP001-FREEZE-TWO-STAGE-FINAL-MEAN
```

Five are approved in full. The ratio-scale contract is approved only for its total-scale and requested-share representations.

## 3. Approved executable representation scope

Twelve executable prototype identities are admitted to the first allocation expansion:

```text
MAL-CP001-PROT-RATIO-FROM-TARGET
MAL-CP001-PROT-MEAN-FROM-QUANTITIES
MAL-CP001-PROT-MEAN-FROM-RATIO
MAL-CP001-PROT-THREE-COMPONENT-MEAN
MAL-CP001-PROT-UNKNOWN-SOURCE-VALUE
MAL-CP001-PROT-SOURCE-VALUE-FROM-RATIO
MAL-CP001-PROT-UNKNOWN-COMPONENT-QUANTITY
MAL-CP001-PROT-ADDED-QUANTITY-FOR-TARGET
MAL-CP001-PROT-THIRD-COMPONENT-QUANTITY
MAL-CP001-PROT-TWO-QUANTITIES-FROM-TOTAL
MAL-CP001-PROT-COMPONENT-SHARE-FROM-TARGET
MAL-CP001-PROT-TWO-STAGE-BLEND-MEAN
```

Their existing four-row samples account for 48 of the 60 review rows. Those rows are **inside the approved expansion scope**, but remain individually `PENDING` rather than being treated as separately human-approved.

## 4. Deferred, held and reassigned scope

### Deferred representation

```text
MAL-CP001-PROT-DIFFERENCE-BASED-QUANTITIES
```

The difference-as-scale form remains valid executable evidence inside the ratio-scale learner contract, but it is excluded from the first allocation expansion until direct source evidence or a later explicit product decision admits it.

### Held candidate

```text
MAL-CP001-PROT-TWO-STAGE-UNKNOWN
```

The inverse two-stage topology remains on hold because its external support is analogous rather than direct. It must not influence the first CP-001 QL count.

### Referred to CP-002

```text
MAL-CP001-PROT-THREE-WAY-TARGET-WITH-RELATION
```

The recovered competitive-exam relation pattern is addition-driven ratio adjustment. It remains CP-002 ownership-boundary evidence and is excluded from CP-001 allocation.

## 5. Frozen counts at this checkpoint

```text
candidate decisions: 8
approved candidate contracts: 6
approved-scope executable prototypes: 12
deferred prototypes: 1
held prototypes: 1
referred-to-CP-002 prototypes: 1
review rows inside approved scope: 48
individual question rows approved: 0
permanent QLs: 0
```

The following counts remain deliberately open:

```text
permanent QL-template families: not frozen
solve modes: not frozen
English QL count: not frozen
Hindi QL count: not started
Punjabi QL count: not started
```

## 6. Next gate: exhaustive allocation expansion

For the twelve admitted prototypes, derive the complete learner-facing inventory from evidence rather than assigning one QL per prototype.

The expansion must separately audit:

1. hidden mathematical state and requested unknown;
2. direct, inverse and reconstruction task direction;
3. answer semantic and option contract;
4. explicit quantities, ratio input, total-scale and multi-component representations;
5. two-component versus multi-component parameterisation;
6. temporal addition wording versus a genuinely different task;
7. table, prose and any source-backed exam presentation formats;
8. misconception strategy and explanation sequence;
9. difficulty as an instance property;
10. ownership overlap with Average, MAL-CP-002, MAL-CP-004 and MAL-CP-006.

A representation should become a separate QL only when it materially changes the question-language contract, answer shape, evidence topology, misconception plan, explanation sequence or validator. Scenario nouns and superficial wording changes must not inflate the count.

## 7. ID-freeze boundary

Permanent `MAL-QL-*` IDs may be proposed only after:

1. exhaustive QL-template and solve-mode discovery across the approved scope;
2. executable proof for every proposed template family;
3. gap and merge audits showing no meaningful uncovered or duplicate modes;
4. row-level English editorial decisions for the proposed review pack;
5. chapter-wide range-impact review against later MAL canonical problems;
6. an explicit count-bearing allocation approval.

Until those gates close:

```text
permanentQlId: null
publiclyPublishable: false
Question Studio exposure: disabled
Question Bank writes: disabled
student/test routing: disabled
```
