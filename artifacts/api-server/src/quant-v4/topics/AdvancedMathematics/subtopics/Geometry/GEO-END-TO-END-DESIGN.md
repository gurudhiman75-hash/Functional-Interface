# ExamTree Geometry — End-to-End Design Authority Revision 2

The canonical Revision-2 authority supplied on **18 August 2026** is preserved byte-for-byte in four ordered raw parts under:

```text
design-authority-rev2/part-01.md
design-authority-rev2/part-02.md
design-authority-rev2/part-03.md
design-authority-rev2/part-04.md
```

Canonical reconstruction:

```bash
cat design-authority-rev2/part-01.md \
    design-authority-rev2/part-02.md \
    design-authority-rev2/part-03.md \
    design-authority-rev2/part-04.md > GEO-END-TO-END-DESIGN-REV2.reconstructed.md
```

Expected SHA-256 of the reconstructed authority:

```text
1790e494167121d2541145deea128d202feb125496ac72533a3340f09edf10d8
```

The Geometry Phase-0 CI gate reconstructs these parts and verifies this hash. The parts are storage-only boundaries caused by connector write limits; **their concatenation, not the boundaries, is the sole design authority**.

Status from the authority: `DESIGN_COMPLETE_READY_FOR_PHASE_0`.

Hard lifecycle locks remain: permanent QLs `0`, frozen solve modes `0`, Question Studio disabled, Question Bank writes disabled, test eligibility disabled, and public publication disabled.
