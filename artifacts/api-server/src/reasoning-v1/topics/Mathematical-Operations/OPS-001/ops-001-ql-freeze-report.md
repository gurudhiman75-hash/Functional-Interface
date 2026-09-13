# ExamTree Reasoning V1 — OPS-001 Permanent QL Freeze Report

Status: **31 permanent QLs frozen; integration is the next phase.**

Freeze version: `OPS_001_QL_FREEZE_V1`

Freeze date: **2026-07-27**

## Final decision

```text
PERMANENT_QL_COUNT      = 31
PERMANENT_QL_IDS        = OPS-QL-001 through OPS-QL-031
CHECKPOINT_COUNT        = 9
CHECKPOINT_RANGES       = FROZEN
MERGED_PRESENTATIONS    = 3
UNOWNED_SOURCE_FAMILIES = 0
UNOWNED_STUDENT_ACTIONS = 0
```

## Branch synchronization

The moving base was synchronized through PR #207 before permanent allocation.

```text
base at synchronization:  New-main @ 78d5f75e619f42999d20f646fcfefe152da0e64d
sync merge commit:        6bb752f88ebc848c412df63ea2bff0ed04a7d746
post-sync comparison:     ahead 97, behind 0
```

PR #174 became mergeable again after synchronization.

## Permanent registry proof

Canonical files:

```text
registry/ops-ql-registry.ts
registry/ops-ql-registry.test.ts
registry/index.ts
ops-001-final-ql-manifest.md
```

The registry test proves:

```text
continuous QL IDs                         31 / 31
unique candidate ownership                31 / 31
checkpoint ranges                         9 / 9
source-family ownership                   17 / 17
merged presentation aliases               3 / 3
English frozen-generation sample          310
Hindi/Punjabi frozen-generation sample    620
four unique options                       PASS
one keyed answer                          PASS
answer/index parity                       PASS
solver-proof parity                       PASS
checkpoint and solve-mode drift checks    PASS
```

Dedicated workflow:

```text
Validate OPS-001 approved teaching runtime
Run ID: 30234920051
Conclusion: success
```

The run passed strict TypeScript, the existing 3,100-instance approved teaching proof, the permanent QL registry proof and canonical review export.

## Supporting final gates

```text
exact foundation and 34-candidate pilot proof
  Run ID: 30234920058
  Conclusion: success

all-contract Hindi/Punjabi proof
  Run ID: 30234920044
  Conclusion: success

device/glyph proof after responsive and option corrections
  Run ID: 30231451914
  Conclusion: success
```

The device proof covers English, Hindi and Punjabi at 360, 390, 768 and 1280 pixels.

## Permanent ranges

```text
OPS-CP-001  OPS-QL-001..002   2
OPS-CP-002  OPS-QL-003..005   3
OPS-CP-003  OPS-QL-006..007   2
OPS-CP-004  OPS-QL-008..011   4
OPS-CP-005  OPS-QL-012..017   6
OPS-CP-006  OPS-QL-018..020   3
OPS-CP-007  OPS-QL-021..023   3
OPS-CP-008  OPS-QL-024..027   4
OPS-CP-009  OPS-QL-028..031   4
```

## Merged presentation aliases

```text
OPS-CAND-002 -> OPS-QL-001
OPS-CAND-006 -> OPS-QL-003
OPS-CAND-031 -> OPS-QL-028
```

These aliases must not be counted as separate QLs by Question Studio, analytics or publication workflows.

## Next phase

The following are now permitted but are not completed by the freeze itself:

```text
chapter-level generation-engine adapter
checkpoint runtime exports
Question Studio discovery and preview
admin enablement
student delivery integration
analytics registration
publication controls
```

Every integration must consume `registry/ops-ql-registry.ts`; it may not allocate, renumber or reinterpret OPS QLs.
