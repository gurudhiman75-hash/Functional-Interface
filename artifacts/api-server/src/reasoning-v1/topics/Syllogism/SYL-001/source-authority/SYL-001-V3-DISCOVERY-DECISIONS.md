# SYL-001 V3 — Discovery Decisions

Authority: `SYL_001_V3_DISCOVERY_DECISIONS_V1`

Status: **implemented; permanent QL allocation remains blocked by closeout audits**.

## 1. Plain FEW

Decision: `GOVERNED_EXCLUSION`.

The available exam-preparation authorities do not provide one stable semantic contract:

- one authority treats `Few A are B` primarily as guaranteeing `Some A are B`, with the negative part not necessarily fixed;
- another authority treats it as both `Some A are B` and `Some A are not B`.

The runtime therefore preserves both competing interpretations and keeps plain `FEW` normalization blocked. A future source-profile amendment must select and version the intended convention before any QL can use it.

References:

- https://www.bankersadda.com/syllogism-concept/
- https://gstguntur.com/syllogism-questions/

## 2. Intentional contradictory statements

Decision: `GOVERNED_EXCLUSION` from the published V1 question family.

The solver diagnostic is implemented and proves that `All A are B` together with `No A is B`, under the selected non-empty-term policy, has no model. However, the verified V1 source authorities describe ordinary conclusion evaluation under statements treated as true; they do not yet establish an intentional inconsistent-premise answer family for the target package.

The diagnostic remains executable with `permanentQlId: null`. Publication requires a verified target-exam source-pattern authority.

References:

- https://sathee.iitk.ac.in/sathee-bank-exam/bank-exams/ibps-po/study-materials/memory-based-questions/syllogism/theory/
- https://sathee.iitk.ac.in/sathee-bank-exam/bank-exams/ibps-po/study-materials/memory-based-questions/syllogism/formulas/

## 3. Irrelevant premises

Decision: `REJECT_FROM_GENERATED_POOL`.

The executable prototype adds an unrelated `No D is E` statement to a valid A-B-C chain. Removing that statement leaves the tested conclusion’s classification and true/false model space unchanged. Such a statement increases reading load without contributing to the answer.

The production premise-relevance gate must reject this payload. It is an adversarial quality test, not a student-facing QL family.

## 4. Redundant premises

Decision: `REJECT_FROM_GENERATED_POOL`.

The executable prototype adds `All A are C` after `All A are B` and `All B are C`, although the third statement is already implied by the first two. Removing it leaves the tested conclusion unchanged.

The production pool must reject derived or duplicate authority statements unless a verified exam pattern explicitly requires redundancy as the task itself.

## 5. Same-witness versus different-witness reasoning

Decision: `IMPLEMENTED_EXECUTABLE_PROTOTYPE`.

For:

```text
Some A are B.
Some B are C.
```

both of the following are legal:

- one A-B-C witness satisfies both statements;
- separate A-B and B-C witnesses satisfy the statements.

Therefore `Some A are C` is undetermined. The V3 proof contract records `MAY_BE_SAME_OR_DIFFERENT` and must not merge existential witnesses unless the premises force identity.

Reference for the underlying exam rule that two particular statements do not force a conclusion:

- https://sathee.iitk.ac.in/sathee-bank-exam/bank-exams/ibps-po/study-materials/memory-based-questions/syllogism/theory/

## 6. Three-witness boundary

Decision: `IMPLEMENTED_EXECUTABLE_PROTOTYPE`.

A five-term prototype combines two existential overlaps, a some-not obligation and exclusions that prevent witness merging. The independent model requires at least three occupied witness regions and exercises the solver’s five-term boundary.

This prototype has `permanentQlId: null`. It proves architecture coverage but does not create a permanent QL before source saturation and merge/split review.

## Freeze boundary

All six automated decisions are resolved as runtime coverage, executable prototypes, governed exclusions or pool-rejection rules. The following still block permanent QL allocation and chapter freeze:

1. source saturation and source-profile sign-off;
2. QL merge/split and duplicate-authority audit;
3. native English, Hindi and Punjabi editorial review;
4. representative mobile diagram human review;
5. immutable review decisions for the final discovered archetype inventory.
