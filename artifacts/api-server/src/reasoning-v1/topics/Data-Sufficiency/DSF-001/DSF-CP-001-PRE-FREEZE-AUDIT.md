# DSF-CP-001 — Pre-Freeze Cross-Wave Audit

Status: `NOT_FREEZABLE_SOURCE_DEPENDENCY_PENDING`

Permanent Question Logic: `DSF-QL-001 / TWO_STATEMENT_TARGET_DETERMINACY`

## What is production-backed on New-main

Three independent source-domain waves are merged and executable:

| Source | Solve modes | State |
|---|---|---|
| `NUM-001 / Number System` | missing digit; digit parity | production-generated, English review candidate |
| `RAP-001 / Ratio & Proportion` | simplified A:B; greater quantity | production-generated, English review candidate |
| `PCT-001 / Percentage` | successive net change; final direction | production-generated, English review candidate |

All six solve modes remain the same permanent QL because the learner task is unchanged: test Statement I, Statement II and their conjunction for unique determination of the asked target.

No `DSF-QL-002` allocation is justified by these source-domain additions.

## Cross-wave invariants

The executable pre-freeze audit verifies that all three merged waves:

- emit `DSF-QL-001` only;
- use `DS_STANDARD_5` with identical semantic/text mapping;
- cover all five canonical two-statement sufficiency classes;
- keep exactly one correct option;
- preserve publication locks;
- expose distinct source ancestry and solve-mode metadata without QL proliferation;
- generate unique deterministic identities across the combined audit corpus.

The permanent registry lifecycle is advanced from the obsolete `NOT_PRODUCTION_GENERATED` state to:

`PARTIAL_PRODUCTION_GENERATION_REVIEW_CANDIDATE`

This is a content-lifecycle progression only. CP-000 semantic/identity freeze is unchanged.

## Algebra re-audit

The original CP-000 conclusion that Algebra lacked a reusable source runtime is no longer technically true.

Current Algebra source work exists in draft PR `#867` on branch:

`feature/alg-001-phase0-foundation`

Audit snapshot head:

`2332b2e0b2e08bd8baa20951393bb68934126ab4`

That branch contains:

- `ALG-001` and `ALG-002`;
- 43 permanent Algebra QLs according to the PR authority;
- shared exact Algebra infrastructure under `quant-v4/shared/algebra`;
- equation/system/inequality and related exact engines;
- permanent English adapter/audit work.

However, PR #867 is still **draft and unmerged**. None of that source runtime exists on current `New-main`.

### Governance consequence

DSF must **not**:

- copy Algebra mathematics into DSF;
- import code from the unmerged feature branch;
- create a substitute local Algebra solver;
- freeze CP-001 while the planned Algebra source dependency is unresolved.

After Algebra reaches `New-main`, DSF must re-audit the merged source interfaces and add the smallest justified Algebra DS solve modes under `DSF-QL-001`.

## Current CP-001 decision

```text
CP-001 semantic correctness:             proven for 3 merged domains
CP-001 cross-wave contract consistency:  audit candidate
Permanent QL count:                      1
Next available DSF QL:                   DSF-QL-002
Algebra source capability:               ready off-base
Algebra usable by DSF today:             no
CP-001 freezable today:                  no
Question Studio discoverable:            false
Question Bank writable:                  false
Mock-test eligible:                      false
Publicly publishable:                    false
```

## Next gate

1. pass the cross-wave pre-freeze CI on the current DSF tree;
2. keep CP-001 open but stable;
3. wait for/reconcile the Algebra source PR independently;
4. after Algebra is on `New-main`, implement and audit the Algebra DS adapter;
5. only then perform the final CP-001 freeze audit.

CP-002 should not be declared frozen or production-authoritative by bypassing this dependency.
