# BLR-CP-004 — Zero-count recovery remediation

Status: **historical coverage defect corrected during clean current-main recovery**.

## What was found

The historical BLR-CP-004 runtime test required at least one explicit numeric answer of zero through `telemetry.zeroAnswerCount > 0`. The frozen 612-record bank did not actually contain such a record.

The original CP-004 workflow still appeared green because the runtime command was piped through `tee` without `pipefail`. The test process failed, but the shell step inherited `tee`'s successful exit status and continued. The later freeze checks therefore did not expose the missing zero-count coverage.

## Correction

The recovery keeps the existing checkpoint structure and solve authorities intact while making one deterministic `COUNT_MEMBERS_BY_FILTER` record exercise a legitimate zero case:

- the source family graph is selected from the existing 102 frozen family groups;
- the selected graph has an empty learner-visible marital-status category, such as no member explicitly established as unmarried or no member whose marital status is explicitly marked unstated;
- its member-count slot asks for that exact status category;
- the correct answer is therefore `0`, independently recomputed from the existing family-tree role labels;
- no person, relationship edge, checkpoint identity or solve-authority definition is invented for the correction.

An earlier recovery attempt considered a zero cousin-pair case, but the source audit proved every frozen family group already contains at least one cousin pair. That attempt was rejected and removed before recovery approval.

## Invariants preserved

```text
English review records          612
shared-passage groups           102
permanent QLs                     5
permanent range        BLR-QL-013..017
next available QL       BLR-QL-018
Question Studio                disabled
Question Bank                  disabled
mock-test eligibility          disabled
public publication             disabled
```

The remaining CP-004 records and all QL meanings remain unchanged. The correction is a coverage remediation inside the existing `COUNT_MEMBERS_BY_FILTER` authority, not a new QL or a new checkpoint.

## Evidence boundary

The historical artifact `blr-001-cp004-counts-final-freeze` (artifact ID `8820744503`) remains useful evidence for the original 612-record freeze, but its implied zero-count coverage is superseded by this recovery correction.

Current recovery CI runs the CP-004 runtime directly and fails on its real exit status. No `tee` masking or tolerated zero-count failure remains in the permanent recovery workflow.
