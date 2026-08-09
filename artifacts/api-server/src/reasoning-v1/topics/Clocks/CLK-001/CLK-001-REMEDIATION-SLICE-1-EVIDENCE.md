# CLK-001 Remediation Slice 1 Evidence

## Authority

```text
CLK-001-CLOCKS-MASTER-END-TO-END-DESIGN-V2.md
SHA-256: db7fcb55498201427706416ba36622718f667ee88500c8c1572f59473cff4bcc
```

## Exact head proof

```text
Head:       8dca3a60e2497a688322c605ba1de9c184936467
Workflow:   Validate CLK-001 remediation slice 1
Run:        31290927141
Result:     PASS
Status:     PASS_CLK_001_REMEDIATION_SLICE_1
Artifact:   9031338509
Digest:     sha256:576e28d31018cf7ebe48d67ebc127aca254e480f166c3488e2ebe79f4675ab41
```

## Corrected checkpoints

- `CLK-CP-003` — time for an arbitrary angle;
- `CLK-CP-004` — special hand events;
- `CLK-CP-005` — event counts and recurrence.

These checkpoints now require task-specific visible stems, explicit root-order and endpoint contracts, exact answer kinds, visible stem/scenario parity, canonical analytic answers, independent phase-cycle answers, exact semantic agreement before packaging and misconception-owned distractors.

## Proof corpus

```text
English questions tested:       1,000
Correct positions:      250 / 250 / 250 / 250
Distinct fingerprints:          1,000
Dual-answer-oracle questions:     260
Structural-only questions:        740
English review questions:         100
Hindi review questions:             0
Punjabi review questions:           0
```

The 740 structural-only records belong to checkpoints that have not yet been remediated. They explicitly carry `STRUCTURAL_DISCOVERY_ONLY__REMEDIATION_REQUIRED` and do not count as solved authorities.

## Governance correction

```text
Candidate status:           SOURCE_AUDIT_CANDIDATES_NOT_AUTHORITIES
Candidate row-count quota:  false
Permanent QL allocation:    prohibited
Hindi/Punjabi generation:   blocked until English human freeze
```

## Remaining priority

Rebuild `CLK-CP-006`, `CLK-CP-007` and `CLK-CP-008` using task-specific faulty-clock scenarios, exact answer-type oracles and independent affine replays.
