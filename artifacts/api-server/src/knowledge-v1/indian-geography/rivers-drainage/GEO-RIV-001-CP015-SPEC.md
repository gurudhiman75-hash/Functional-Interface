# GEO-RIV-001-CP015 — Mixed Rivers Mastery

Status: REVIEW CANDIDATE V1
Chapter: `GEO-RIV-001`
CP: `GEO-RIV-001-CP015`
Engine: `knowledge-v1`

## Objective

Provide a balanced chapter-level mastery batch after CP001–CP014 qualification. CP015 introduces no new geography truth; it samples the latest qualified review surfaces and preserves their provenance and answer authority.

## Upstream mastery lanes

- QL128 — Sources and river-course mastery (latest CP008 V5)
- QL129 — Rivers and states mastery (latest CP009 V3)
- QL130 — Projects and reservoirs mastery (CP010 V1)
- QL131 — Basins and drainage-pattern mastery (CP011 V1)
- QL132 — Cities and rivers mastery (CP012 V1)
- QL133 — River comparison and classification mastery (CP013 V1)
- QL134 — Integrated rivers mastery (CP014 V1)

## Coverage contract

The V1 review batch contains 64 questions. Each of CP008–CP014 contributes at least one question from every one of its nine source QLs, covering 63 distinct upstream QLs. CP014 contributes one additional unique integrated item. No source question or stem+answer semantic payload may repeat within CP015.

## Balance contract

- 64 questions;
- answer positions exactly A16/B16/C16/D16;
- at least 40 Medium + Hard questions combined;
- at least 8 Hard questions;
- all seven mastery lanes represented;
- upstream source audits must remain valid.

## Integrity rules

- use only latest qualified upstream review surfaces;
- preserve canonical answer, explanation and source provenance;
- only answer-option position may be changed during CP015 materialization;
- learner-facing wording must not introduce generator/engine/solver or source-review language;
- `reviewOnly=true` and `runtimeRegistered=false` until explicit human approval;
- no Question Bank or Question Studio promotion as part of this checkpoint.

## Acceptance gate

CP015 is review-ready only when the dedicated qualification test, review export, API build, Geography validation, branch-topology guard, CI-hygiene policy and Render build pass on the exact review head.
