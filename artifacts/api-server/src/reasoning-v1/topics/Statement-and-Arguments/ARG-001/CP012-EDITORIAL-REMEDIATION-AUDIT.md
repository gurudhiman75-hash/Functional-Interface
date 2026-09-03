# ARG-001 CP012 — Editorial Remediation Audit

Status: **TECHNICALLY CERTIFIED / MANUAL EDITORIAL APPROVAL REQUIRED / LEARNER RELEASE LOCKED**

## Why CP012 reopened the chapter

CP011 remains valid historical technical-freeze evidence. The separate manual editorial gate subsequently identified learner-facing defects that required an additive remediation authority before release:

1. **Correlated wording mismatch:** CP010 correctly constrained actor/object pairings, but QL001 grievance-contact scenarios still inherited a generic justification about helping users "understand the decision process". A grievance contact instead provides a route to seek clarification or report a possible error.
2. **Combination-cardinality shortcut:** the historical banking combination generator exposed answer-cardinality cues even though option positions rotated. `BANKING_COMBO_3X5` mapped difficulty to a fixed strong-argument count, while `BANKING_COMBO_4X5` always contained exactly two strong arguments.
3. **Localization editorial naturalness:** selected Hindi/Punjabi real-paper explanation phrases were semantically faithful but read as literal technical calques rather than natural exam-language explanations.

These are editorial/exam-realness defects. They do not invalidate CP006, CP008, CP010 or CP011 as records of what was certified at those checkpoints.

## CP012 remediation authority

- Checkpoint: `ARG-CP-012`
- Real-paper authority: `ARG_CP012_EDITORIAL_REAL_PAPER_REMEDIATION_V1`
- Question Studio authority: `ARG_CP012_QUESTION_STUDIO_EDITORIAL_REMEDIATION_V1`
- Core semantic authority remains CP009.
- CP010 remains preserved as historical correlated-real-paper authority.

## Remediation design

### Correlated learner copy

CP012 keeps the CP010 explicit compatibility scenarios but applies scenario-aware editorial copy where the generic CP007 wording does not cleanly fit the correlated object. The first explicit correction is the QL001 grievance-contact family in English, Hindi and Punjabi.

### Banking 3×5

CP012 derives three-argument questions from the four correlated candidate arguments and varies which candidate is omitted. Every supported difficulty exposes both one-strong and two-strong surfaces instead of mapping difficulty to a fixed answer cardinality.

### Banking 4×5

CP012 preserves the correlated scenario while cycling curated semantically compatible one-, two- and three-strong states. Options and the correct index are recomputed from the final strength state. The former always-two-strong shortcut is not permitted.

### Localization naturalness

Identified Hindi/Punjabi literal-calque explanation phrases are replaced with natural learner-facing reasoning language without changing the intended argument-strength judgement.

## Certification evidence

Dedicated workflow: `Validate ARG-001 CP012 Editorial Remediation`

Certified runtime/code head: `1ce9815c5dac1fcb554ba8cbbb4bb12ce4038fd7`

GitHub Actions run: **33768035238 — SUCCESS**

The run passed all required gates:

- strict target-owned TypeScript check;
- CP012 real-paper editorial-remediation proof;
- deterministic replay and profile argument/option integrity;
- 3×5 cardinality breadth `{1,2}` for every QL × locale × supported difficulty;
- 4×5 cardinality breadth `{1,2,3}` for every QL × locale;
- correlated grievance-contact wording regression proof;
- Hindi/Punjabi naturalness regression proof for the identified calques;
- CP012 Question Studio activation and lifecycle proof;
- routing precedence over CP010/CP007/CP005;
- CP009 core authority preservation;
- CP010 correlated real-paper proof preservation;
- CP011 superseding-freeze proof preservation;
- exact CP006 historical core byte-freeze preservation;
- exact CP008 historical real-paper byte-freeze preservation;
- production API build;
- production admin build;
- lifecycle boundary.

## Current technical decision

**CP012 technical remediation: PASS.**

The active review authority is now:

- ordinary/core Question Studio generation → CP009 semantic/localization authorities, surfaced through the CP012 Question Studio wrapper;
- real-paper Question Studio generation → CP012 editorial-remediated real-paper authority.

Historical CP010/CP007/CP005 routers remain mounted behind CP012 only as preserved fallbacks; recognized ARG-001 review requests are upgraded to the current path.

## Lifecycle boundary

CP012 is **review-only**.

The following remain disabled:

- persistence outside Question Studio review flow;
- Question Bank writes;
- test eligibility;
- mock-test eligibility;
- public publication;
- automatic learner publication.

Learner release remains **LOCKED pending separate manual editorial approval of the CP012 learner-facing review surfaces**.

Technical success is not learner-release approval. A later approval must be explicit and must not silently weaken any downstream lifecycle lock.
