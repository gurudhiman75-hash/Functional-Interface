# ENG-001 — Answer-Position Diagnostic V1

Status: `FINAL_AUDIT_DIAGNOSTIC_ONLY`

The 117-question chapter master review uses one deterministic sample for every checkpoint × difficulty × permanent QL cell. Its single-sample answer positions are therefore not treated as evidence of production distribution by themselves.

This diagnostic samples `ENG-001-QL001` and `ENG-001-QL002` across all 13 checkpoints and all three difficulties using 50 independent deterministic seeds per cell (3,900 error-bearing questions total). It reports A/B/C/D frequencies globally, by QL and by checkpoint so the final closure review can distinguish a master-pack sampling artifact from a genuine generator-level position bias.

The diagnostic does not modify approved question corpora or lifecycle state.
