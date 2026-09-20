# ENV-001 — Question Studio Integration V1 Status

## Status

**QUESTION STUDIO INTEGRATION IMPLEMENTED — REVIEW_ONLY**

## Registered package

- Engine: `knowledge-v1`
- Package: `ENV-001`
- Subject: Static GK
- Topic: Environment & Ecology
- Scope: ENV-CP-001 through ENV-CP-020
- Permanent QLs: 255
- Frozen questions per language: 1,020
- Frozen EN-HI-PA surfaces: 3,060
- Languages: English, Hindi, Punjabi
- Runtime mode: `review-only`
- Registration authority: `ENV-001-MULTILINGUAL-CONTENT-FROZEN-2026-09-20`

## Workflow behavior

Question Studio selection is deterministic and without replacement. Selection is made against the frozen English authority, then the selected English question identities are resolved to the approved Hindi or Punjabi surface when requested. CP, QL, difficulty and correct-index parity therefore remain locked across locales.

The standard engine-aware Question Studio route persists review runs and immutable generated-item versions. The Environment admin panel exposes exam, CP, language, difficulty, count and deterministic-seed controls plus Approve review / Needs fix / Reject decisions.

## Release locks

This integration does **not** authorize downstream release.

- Question Bank writable: **false**
- Test Builder eligible: **false**
- Mock-test eligible: **false**
- Publicly publishable: **false**
- Automatic student publication: **false**
- Production release authorized: **false**

Approval inside the Environment panel is editorial REVIEW_ONLY approval. Any content correction must be made in the frozen Environment source/localization workflow and re-reviewed; the Question Studio adapter is not a second content authority.
