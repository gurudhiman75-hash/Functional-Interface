# CLK-001 — Corrective Open Discovery V2

## Authority

This work remains governed solely by:

```text
CLK-001-CLOCKS-MASTER-END-TO-END-DESIGN-V2.md
SHA-256: db7fcb55498201427706416ba36622718f667ee88500c8c1572f59473cff4bcc
```

## Corrected status

The repository contains valuable exact Clock foundations and broad source-candidate experiments. It does **not** yet contain a frozen, exam-ready or multilingual Clock chapter.

The design's open-discovery rows are now explicitly classified as:

```text
SOURCE_AUDIT_CANDIDATES_NOT_AUTHORITIES
```

Their row count has no product meaning. They are not permanent QLs, quotas or proof that 100 distinct learner authorities should survive source saturation.

## Remediation slice 1

This slice rebuilds `CLK-CP-003`, `CLK-CP-004` and `CLK-CP-005` because the former generic event handler could package roots or counts that did not answer the visible query.

Corrective controls now include:

- dedicated task-specific stems and scenarios;
- exact root-order contracts such as earlier, first, next, previous and all roots;
- independent analytic-versus-cycle event answers;
- visible stem-token parity checks;
- answer-kind contract checks;
- explicit interval endpoint metadata;
- task-specific event distractors;
- English-only review generation.

Every remediated event question must carry:

```text
proofLevel: DUAL_ANSWER_ORACLE
stemScenarioParity: true
answerContractVerified: true
contractOracle: <task-specific oracle>
```

## Remaining discovery debt

The following sections still remain structural experiments and must not claim completed dual-answer proof:

- parts of `CLK-CP-001` and `CLK-CP-002` needing editorial refinement;
- `CLK-CP-006` to `CLK-CP-008` task-specific faulty-clock reconstruction;
- `CLK-CP-011` answer-leak removal;
- `CLK-CP-012` structured media and accessibility remediation;
- `CLK-CP-013` interchange stem and option remediation;
- `CLK-CP-014` mixed-synthesis reconstruction.

These candidates carry:

```text
STRUCTURAL_DISCOVERY_ONLY__REMEDIATION_REQUIRED
```

## Localisation policy

Hindi and Punjabi generation is blocked until:

1. corrected English task authorities pass source saturation;
2. merge/split, inverse, boundary and chapter-gap audits pass;
3. English human freeze is approved.

Script presence is not accepted as localisation proof.

## Lifecycle lock

```text
Permanent QLs:                0
Source-saturation freeze:     false
English human freeze:         false
Hindi/Punjabi generation:     blocked
Question Studio discovery:    false
Question Bank writes:         false
Mock-test eligibility:        false
Public publication:           false
```

## Next remediation slice

Rebuild `CLK-CP-006` to `CLK-CP-008` with separate scenario constructors and answer-type oracles for each faulty-clock candidate contract. Do not route those contracts through one generic affine example.
