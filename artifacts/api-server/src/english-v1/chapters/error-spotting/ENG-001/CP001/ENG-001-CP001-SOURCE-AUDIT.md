# ENG-001-CP001 Source Audit — Subject–Verb Agreement

Status: `IMPLEMENTATION_INPUT_V1`

## Scope

This audit anchors the first Error Spotting checkpoint to competitive-exam surface patterns before permanent Question Studio registration.

## External evidence reviewed

1. ExamSIDE SSC CGL Tier-I Error Spotting index (2023 papers): segmented-sentence error detection, including four-segment and three-segment + `No error` directions.
2. ExamSIDE SSC CGL 27 July 2023 Shift 1: direct singular-subject / plural-verb mismatch in a short natural sentence.
3. EduRev SSC CGL 2025 Spotting Errors compilation: recent four-part questions including `neither...nor` proximity agreement, intervening phrases, plural head nouns, and noun-clause subjects.

These are third-party PYQ indexes/compilations, not SSC-hosted canonical answer files. They are used for surface-pattern and coverage calibration, not as unquestioned grammatical authority.

## Observed exam-surface contracts

- The instruction is short and functional: identify/select the segment containing the grammatical error.
- Four-segment questions are common.
- A three-segment form with an explicit `No error` option also occurs.
- Difficulty often comes from locating the true subject, not from difficult vocabulary.
- A nearby noun can act as a distractor without controlling the verb.
- `neither...nor` / `either...or` can test proximity agreement.
- Explanations should identify the controlling subject and the required verb form directly.

## CP001 admitted rule families

| Rule | Family | Initial difficulty |
| --- | --- | --- |
| GR-SVA-001 | Basic singular/plural agreement | Easy–Medium |
| GR-SVA-002 | Each / every | Easy–Medium |
| GR-SVA-003 | One of + plural noun | Easy–Medium |
| GR-SVA-004 | A number of / the number of | Medium–Hard |
| GR-SVA-005 | Along with / together with / as well as | Medium–Hard |
| GR-SVA-006 | Either/or and neither/nor proximity | Medium–Hard |
| GR-SVA-007 | Collective noun acting as one unit | Medium–Hard, guarded |
| GR-SVA-008 | More than one | Medium–Hard |
| GR-SVA-009 | Many a | Medium–Hard |
| GR-SVA-010 | Intervening prepositional phrase | Medium–Hard |

## QL contracts admitted in V1

- `ENG-001-QL001` — four-part error spotting, one intended error, no `No error` option.
- `ENG-001-QL002` — three-part error spotting + `No error` option.
- `ENG-001-QL007` — calibrated no-error case using a verified correct base sentence.

The other blueprint QL families remain unimplemented until this checkpoint is reviewed.

## Editorial constraints

- Keep vocabulary ordinary even at Hard level.
- Difficulty must come from agreement structure and dependency distance.
- Do not use obscure proper nouns or local place names.
- Do not admit a collective-noun item unless the sentence clearly forces a unit reading.
- Do not admit a proximity item if either arm contains internally coordinated subjects that could create a second interpretation.
- A mutation must alter exactly one source segment.
- The corrected sentence must be recoverable deterministically from the candidate record.

## Validation boundary

V1 validators can prove structural invariants: one registered mutation, one changed source segment, answer-index consistency, correction presence, QL/no-error contracts, and explanation-key consistency.

They do **not** claim to be a full parser or independent grammar oracle. Naturalness, hidden secondary errors, and prescriptive/descriptive disputes remain explicit human-review gates for V1.

## Source URLs

- https://questions.examside.com/past-years/ssc/ssc-cgl-tier-i/english-comprehension/error-spotting
- https://questions.examside.com/past-years/ssc/question/pstrongdirection-parts-of-the-following-sentence-have-b-ssc-cgl-tier-i-english-comprehension-3vtyail5yktypnwo
- https://edurev.in/t/565683/ssc-cgl-previous-year-questions-spotting-errors
