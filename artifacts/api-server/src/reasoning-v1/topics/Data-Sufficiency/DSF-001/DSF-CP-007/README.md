# DSF-CP-007 — Production Readiness Freeze

Status: **PRODUCTION_READY_FROZEN** for the currently approved scope.

Authority: `DSF_CP007_PRODUCTION_READINESS_FREEZE_V1`

## Frozen production scope

- learner chapter: Data Sufficiency
- permanent identity: `DSF-QL-001`
- next available identity: `DSF-QL-002`
- language: English (`en-IN`)
- exam families: Banking and SSC
- source domains: Number System, Ratio & Proportion, Percentage, Algebra
- solve modes: 8
- approved answer profiles: 5
- canonical two-statement semantic classes: 5

## Production path

The chapter uses ExamTree's canonical controlled release path:

1. deterministic DSF generation in Question Studio;
2. manual generation-item approval;
3. canonical Question Bank conversion;
4. explicit Question Bank publication;
5. canonical test validation and QA/release;
6. canonical test publication / test-series release;
7. student access only to live, genuinely published tests.

No DSF-specific publish, mock, or student endpoint exists.

## Safety invariant

`automaticStudentPublication` remains `false`.

This is intentional and matches the mature production pattern used elsewhere in ExamTree. Production readiness means the generated content is eligible for the normal Question Bank, scored-test, mock-test, and student-live delivery pipeline after the existing manual/QA gates. It does **not** mean generated questions bypass those gates.

## Deferred expansion

The following are outside this freeze and require separate checkpoints/evidence:

- Punjab-specific answer profile;
- Hindi localization;
- Punjabi localization;
- three-statement Data Sufficiency (`DSF-QL-CAND-002`);
- Reasoning-world adapters that require complete valid-world enumeration.

No new permanent QL is allocated by CP-007.
