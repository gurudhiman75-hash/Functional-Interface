# SEA-002 — Final Content Deep-Audit Closure

Date: 2026-10-03

Status: `CONTENT_DEEP_AUDIT_CLOSED__CP006_TO_CP010__22_PERMANENT_QLS__EN_HI_PA__REVIEW_ONLY`

## Package boundary

`SEA-002` is the advanced-topology package inside `REAS-SEA — Seating Arrangement`.

It owns:
- `SEA-CP-006` — two parallel rows facing each other;
- `SEA-CP-007` — parallel rows with same-direction or mixed/non-uniform facing;
- `SEA-CP-008` — square seating;
- `SEA-CP-009` — rectangular and regular-polygon seating;
- `SEA-CP-010` — concentric / dual-group seating.

It does not own:
- single-row and basic circular seating already frozen in `SEA-001`;
- attribute-linked, vacancy, uncertain-number and other conditional seating reserved for `SEA-003`;
- floor/flat arrangement owned by `FLR-001`;
- general multi-attribute assignment puzzles owned by `LP-001`.

## Permanent QL authority

Retained prior authorities:
- CP006: `SEA-QL-021..024`;
- CP007: `SEA-QL-025..028`;
- CP008: `SEA-QL-029..035`.

New final authorities:
- CP009: `SEA-QL-036..039`;
- CP010: `SEA-QL-040..042`.

Total SEA-002 permanent QLs: **22**.

Next available permanent seating identity after SEA-002: `SEA-QL-043`.

Query direction, option order, arrangement size within the same topology, name pool and wording do not create new QLs.

## Source posture

Repository source audits already established CP006–008 banking-style ownership.

External source validation for the remaining topology gap confirms:
- polygonal seating includes square, rectangle, triangle, pentagon, hexagon and similar table shapes;
- mixed inward/outward facing is an established polygonal seating form;
- concentric arrangement is a recognized seating family with one inner table/ring and one outer table/ring;
- banking-oriented concentric practice includes cross-ring facing correspondence and inner/outer groups.

Reviewed external references:
- https://testbook.com/reasoning/seating-arrangement-reasoning
- https://testbook.com/objective-questions/mcq-on-bidirectional--5eea6a0e39140f30f369e483
- https://testbook.com/objective-questions/mcq-on-concentric--5eea6a0e39140f30f369e486
- https://testbook.com/questions/lic-assistant-seating-arrangement-questions--64e8b8cb45233732311cc4c8
- https://www.oliveboard.in/blog/seating-arrangement-questions-for-bank-exams/

No claim is made that every topology occurs at a fixed frequency in SSC, Banking or Punjab papers.

## Solver model

CP006–008 retain their reviewed/frozen source engines.

CP009 and CP010 use exact finite-state enumeration.

New closure state spaces include:
- rectangular eight-seat arrangement with rotational symmetry normalized by an explicit corner-role anchor: `7! = 5,040` states;
- regular hexagon uniform facing: `5! = 120` states;
- regular hexagon independent mixed facing: `5! × 2^6 = 7,680` states;
- fixed-membership 4+4 concentric circles: `4! × 3! = 144` states after rotational normalization;
- inferred-membership 4+4 concentric circles: `2 × C(7,3) × 3! × 4! = 10,080` states;
- fixed-membership 3+3 concentric circles with independent mixed facing: `3! × 2! × 2^6 = 768` states.

A generated advanced question is rejected unless all displayed clues leave exactly one normalized state and the solved fingerprint matches the hidden target.

## Symmetry governance

Rotational symmetry may be normalized only when the normalization is logically valid.

Final remediation explicitly prevents:
- silently assuming a person belongs to the outer concentric ring when ring membership is the tested inference;
- silently fixing a rectangular seat role without a learner-visible role clue.

This keeps solver uniqueness equivalent to the displayed problem rather than uniqueness inside a narrower hidden model.

## Question Studio

A single current `SEA-002` package exposes CP006–010.

Mixed review order is checkpoint-stratified so the first normal five-question cycle contains all five checkpoints rather than appearing as one repeated seating topology.

Lifecycle remains review-only:
- Question Bank writes: false;
- test eligibility: false;
- mock-test eligibility: false;
- public publication: false;
- automatic student publication: false.

CP007's historical manual freeze gate remains separate. Exposing its already-reviewed generator through the unified review surface does not claim learner-release approval.

## Language and learner presentation

Supported languages:
- English;
- Hindi;
- Punjabi.

Learner-facing content must not expose internal terms such as solver, oracle, fingerprint or blueprint.

Explanations show the final arrangement and apply person-relative left/right according to the person's actual facing.

## Remaining Seating family work

`SEA-003` remains unimplemented and owns advanced conditional seating such as:
- attribute-linked seating;
- vacant-seat arrangements;
- uncertain-number seating;
- conditional/ranking-linked advanced seating where the seating contract itself materially changes.

## Result

`SEA_002_CONTENT_DEEP_AUDIT_CLOSED__22_QLS__CP006_TO_CP010__TRILINGUAL__REVIEW_ONLY`
