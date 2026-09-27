# MIS-CP-002 Implementation Status

Status: **EXECUTABLE PROTOTYPE / ENGLISH REVIEW CANDIDATE**

## Implemented scope

MIS-CP-002 implements the blueprint's three-input arithmetic structures as seven provisional semantic authorities:

| Candidate | Authority |
|---|---|
| MIS-CAND-009 | add all three inputs |
| MIS-CAND-010 | add two inputs and subtract the third |
| MIS-CAND-011 | multiply a pair, then add/subtract the remaining input |
| MIS-CAND-012 | add a pair, then multiply by the remaining input |
| MIS-CAND-013 | subtract one input from another, then multiply by the remaining input |
| MIS-CAND-014 | multiply a pair, then exactly divide by the remaining input |
| MIS-CAND-015 | add a pair, then exactly divide by the remaining input |

The plus/minus branch inside MIS-CAND-011 is an instance context rather than a premature permanent QL split.

## Operand-role architecture

CP002 does not hardcode every expression to one column arrangement.

Where the mathematical family allows it, the runtime varies which displayed position is:

- the adjusted term;
- the multiplier;
- the divisor;
- the minuend/subtrahend.

Commutative pair order is normalized. Difference order remains explicit because it changes the relation.

Every allowed context is validated to use all three displayed inputs. Questions that only look three-input while one number is actually irrelevant are prohibited.

## Generation and ambiguity

The pipeline is:

1. select a semantic candidate and normalized operand-role context;
2. construct complete three-input groups from that rule;
3. reject non-integral division and non-positive/unwieldy results;
4. independently recompute every group;
5. enumerate all CP002 rule/context combinations;
6. add a third evidence group when two groups are not enough to isolate one semantic rule;
7. choose a target group only after ambiguity is resolved;
8. build three misconception-grounded distractors;
9. hide only the target result for this checkpoint;
10. create a value-specific explanation and fingerprints.

Difficulty comes from inference burden. Arithmetic remains clean and exam-appropriate.

## Question Studio

MIS-001 now has one chapter-level Question Studio registration covering:

- MIS-CP-001
- MIS-CP-002

Current chapter review state:

- provisional candidates: 15 total;
- permanent QLs: 0;
- English review: active;
- Hindi/Punjabi: not started;
- Question Bank writes: blocked;
- mock/test/public release: blocked;
- source saturation: not complete;
- merge/split audit: not complete.

## Validation target

The CP002 audit generates 80 deterministic seeds for each of the seven candidate authorities:

~~~text
7 candidates × 80 seeds = 560 generated questions
~~~

Assertions cover:

- deterministic replay;
- all three inputs participating;
- independent solver agreement;
- one surviving normalized semantic rule;
- role-context diversity;
- both plus and minus variants for product-adjust-third;
- clean integer outputs;
- two/three evidence groups;
- four unique options;
- exactly one correct answer;
- misconception-labelled distractors;
- answer-position distribution;
- Easy/Medium coverage;
- numeric and structural diversity.

## Review export

Run:

~~~bash
pnpm --dir artifacts/api-server exec tsx src/reasoning-v1/topics/Missing-Number/MIS-001/MIS-CP-002/export-review.ts
~~~

Output:

~~~text
artifacts/api-server/dist/reasoning-v1/mis-001/MIS-CP-002-REVIEW.md
~~~

The review pack contains five exact deterministic samples per candidate authority.

## Explicitly not completed

- source saturation;
- permanent QL allocation;
- merge/split freeze;
- inverse missing-input forms;
- figure renderers;
- powers/squares;
- structured/consecutive relations;
- localization;
- full chapter closure.

The next blueprint checkpoint after human review is MIS-CP-003: square, cube and power relationships.
