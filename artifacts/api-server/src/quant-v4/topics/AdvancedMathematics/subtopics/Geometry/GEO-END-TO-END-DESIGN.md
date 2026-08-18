# ExamTree Geometry — End-to-End Design Authority Revision 3

Geometry Revision 3 is a **composite authority**:

1. the original hash-locked Revision-2 base authority; and
2. the Revision-3 Diagram Policy Amendment, which supersedes Revision-2 Section 20 where they differ.

All Revision-2 content outside the amended diagram-policy scope remains authoritative.

## Revision-2 base authority

The canonical Revision-2 authority supplied on **18 August 2026** is stored in four ordered raw chunks under:

```text
design-authority-rev2/part-01.md
design-authority-rev2/part-02.md
design-authority-rev2/part-03.md
design-authority-rev2/part-04.md
```

The connector contents writes omitted the terminal newline at the `part-01` and `part-03` storage boundaries. Canonical reconstruction therefore restores exactly those two newline bytes:

```bash
{
  cat design-authority-rev2/part-01.md
  printf '\n'
  cat design-authority-rev2/part-02.md
  cat design-authority-rev2/part-03.md
  printf '\n'
  cat design-authority-rev2/part-04.md
} > GEO-END-TO-END-DESIGN-REV2.reconstructed.md
```

Expected SHA-256 of the reconstructed Revision-2 base:

```text
1790e494167121d2541145deea128d202feb125496ac72533a3340f09edf10d8
```

## Revision-3 Diagram Policy Amendment

Canonical amendment:

```text
design-authority-rev3/diagram-policy-amendment.md
```

Expected SHA-256:

```text
08b8560c195b0bc090ef1c9c5ced5d0723c076db3bf7096fb01a108df2b06bf2
```

The amendment makes diagram use explicitly **selective** rather than default. Every production QL must receive a stable diagram disposition (`NO_DIAGRAM`, `OPTIONAL_STEM_DIAGRAM`, `REQUIRED_STEM_DIAGRAM`, `REQUIRED_SOLUTION_DIAGRAM`, or `REQUIRED_BOTH`) during source saturation / merge-split review. It also governs semantic givens, diagram-only evidence parity, not-to-scale behavior, visual answer-leak prevention, learner-layout/oracle separation, responsive QA, accessibility and localisation.

The Geometry Phase-0 CI gate verifies both the original Revision-2 authority bytes and the Revision-3 amendment hash. Together they are the **sole current Geometry design authority**.

Current implementation status is executable discovery through `GEO-CP-014`; this authority revision does not allocate permanent QLs or freeze solve modes.

Hard lifecycle locks remain: permanent QLs `0`, frozen solve modes `0`, Question Studio disabled, Question Bank writes disabled, test eligibility disabled, and public publication disabled.
