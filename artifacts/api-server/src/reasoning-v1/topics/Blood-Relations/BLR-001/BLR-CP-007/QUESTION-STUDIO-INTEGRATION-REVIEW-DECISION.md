# BLR-CP-007 Question Studio Integration Review Decision

## Authority

- Source corpus: `BLR_CP007_MULTILINGUAL_FROZEN`
- Review package: `REASONING_V1_BLR_001_CP_007`
- Runtime mode: `MULTILINGUAL_FROZEN_REVIEW`
- Integration status: `REVIEW_ADAPTER_READY__ACTIVATION_LOCKED`

## Approved scope

The integration branch may expose deterministic, read-only Question Studio preview payloads for the frozen English, Hindi and Punjabi BLR-CP-007 corpus.

The preview contract may expose learner text, options, reviewed answers, explanations, family-tree structures, diagram proof, relation graphs, traceability metadata and frozen authority.

## Locked scope

This review decision does not authorize:

- adding BLR-CP-007 to the enabled live Question Studio package list;
- modifying the live `/api/admin/question-studio/runs` generation path;
- writing generation runs or generated items to the database;
- Question Bank eligibility or storage;
- mock-test delivery;
- public publication or staging;
- merging the integration PR.

Every one of these actions requires a separate explicit approval gate.
