# DSF-CP-024 — QL002 Inequality Batch Runtime

Status: **reasoning review candidate / undiscoverable**

This checkpoint extends permanent `DSF-QL-002` into Inequality.

It reuses the frozen CP015 three-statement evaluator/19-state semantic profile and the existing `resolveInequalityRelation` source authority.

Covered targets:
- A versus D;
- A versus C;
- B versus D.

The finite source universe contains all value assignments for A, B, C and D over 0..3 with equality allowed. Generated questions use three mutually consistent statements and evaluate all seven non-empty subsets.

Lifecycle remains fully locked until the reasoning QL002 breadth is complete.
