# ENG-001-CP001 Source & Coverage Audit — Subject–Verb Agreement V2

Status: `SOURCE_AUDIT_V2__REVIEW_GATE_OPEN`

## Purpose

This audit defines the evidence boundary for the first English Content Engine checkpoint. It is used to calibrate rule coverage, sentence structure, difficulty, ambiguity guards, and Error Spotting surfaces before Question Studio registration.

The implementation principle remains:

> verified correct construction → registered grammar rule → controlled mutation → deterministic answer → question-specific explanation

## Source classes reviewed

### A. User-provided English reference material

The uploaded *How to Prepare for Verbal Ability and Reading Comprehension for the CAT* material identifies subject–verb agreement as a major grammatical-error class and explicitly warns that agreement becomes harder when the true subject is disguised by intervening material and separated from the verb. CP001 therefore treats dependency distance and misleading nearby nouns as difficulty dimensions rather than increasing vocabulary difficulty.

### B. Competitive-exam PYQ surfaces

The audit used indexed official-paper questions reproduced by Testbook for SSC and state-level examinations. These sources are used to confirm that a construction is genuinely tested and to calibrate its exam surface. Testbook is a secondary host of the questions, not the examination authority itself.

### C. Grammar-reference support

Where the current PYQ search did not locate a direct question for an admitted starter rule, the rule remains reference-backed and is explicitly marked as such rather than being labelled PYQ-saturated.

## Coverage matrix

| Rule | Construction | Evidence status | Audit evidence / decision | Difficulty in V2 |
| --- | --- | --- | --- | --- |
| `GR-SVA-001` | Basic singular/plural agreement | PYQ + reference backed | Core SVA principle is directly represented throughout official-paper grammar items; kept only at Easy because the bare rule has little structural concealment. | Easy |
| `GR-SVA-002` | Each / every | Direct PYQ backed | SSC MTS 2024 and SSC CHSL/CGL questions use `each of + plural noun` with singular agreement. | Easy–Medium |
| `GR-SVA-003` | One of + plural noun | Direct PYQ backed | SSC Stenographer 2025 includes `One of the questions were...`, requiring singular agreement with `one`. | Easy–Medium |
| `GR-SVA-004` | A number of / the number of | Partial direct PYQ + reference backed | SSC Stenographer 2025 directly tests `the number of applicants ... have increased` → singular `has`; `a number of` remains reference-backed in the present audit and is not claimed PYQ-saturated. | Medium–Hard |
| `GR-SVA-005` | Along with / together with / as well as | Direct PYQ backed | SSC CHSL 2025 and SSC Stenographer 2025 test that additive phrases do not change agreement with the main subject. | Medium–Hard |
| `GR-SVA-006` | Either/or; neither/nor proximity | Direct exam-pattern backed | SSC CHSL 2025 material confirms nearest-subject agreement under the target competitive-exam convention. V2 rejects internally coordinated arms to avoid multiple readings. | Medium–Hard |
| `GR-SVA-007` | Collective nouns | Direct PYQ backed, context-sensitive | SSC CGL 2021 tests singular agreement when a team acts as one unit; SSC Stenographer 2025 tests plural agreement when jury members are explicitly divided. V2 therefore models both readings and rejects neutral contexts. | Medium–Hard |
| `GR-SVA-008` | More than one + singular noun | Grammar-reference backed | Current targeted PYQ search did not locate a sufficiently clean direct Error Spotting example. Standard grammar references support singular agreement for `more than one + singular noun`. Keep admitted but mark as not PYQ-saturated. | Medium–Hard |
| `GR-SVA-009` | Many a/an + singular noun | Direct PYQ backed | OPSC ASO 2022, Bihar D.El.Ed 2024, SSC MTS 2023 and SSC CHSL 2024 directly test singular noun/agreement after `many a/an`. V2 also renders `a/an` deterministically. | Medium–Hard |
| `GR-SVA-010` | Intervening phrase / misleading nearby noun | Reference + exam-pattern backed | User-provided reference material explicitly identifies subject–verb separation and misleading intervening material as a major difficulty source; SSC-style items repeatedly use the same trap. | Medium–Hard |

## V2 evidence URLs

Direct/PYQ-backed examples used in the matrix:

- Each of the participants — Bihar/SSC-style agreement evidence: https://testbook.com/question-answer/fill-in-the-blanks-with-the-correct-optionevery--62f3c6ba2ffaa2c2e81e14f2
- Many a man — OPSC ASO 2022: https://testbook.com/question-answer/many-a-man-_______-suffered-during-partition--684996ecb85f0c6b5cd04cd0
- Many a/an construction — SSC MTS 2023: https://testbook.com/question-answer/direction-select-the-most-appropriate-option-to-s--64a5125edb7d5e398558ca16
- Many a woman — SSC CHSL 2024: https://testbook.com/question-answer/select-the-most-appropriate-option-that-can-substi--66a4ce7f32c8062ce29eda91
- `more than one + singular noun` grammar reference: https://guidetogrammar.org/grammar/sv_agr.htm

The existing V1 audit also retains the ExamSIDE SSC CGL Error Spotting index and EduRev SSC CGL compilation as surface-style references:

- https://questions.examside.com/past-years/ssc/ssc-cgl-tier-i/english-comprehension/error-spotting
- https://edurev.in/t/565683/ssc-cgl-previous-year-questions-spotting-errors

## Exam-surface findings

- Error Spotting instructions should be short and functional.
- Four-part segmented sentences are a primary surface.
- A three-segment form with an explicit `No error` option is also admitted.
- No-error items should contain a deceptive but correct construction; direct basic agreement is too weak for the calibrated pool.
- Difficulty should rise through dependency distance, proximity cues, competing nouns, or contextual agreement—not through obscure vocabulary.
- The intended erroneous span should remain identifiable as one segment; QL002 V2 therefore never merges the registered error segment with neighbouring text.

## V2 systemic corrections after V1 review

1. **Fixed-corpus ceiling removed:** V1's 22 authored candidates were suitable for review but too shallow for scale. V2 separates grammar rules from controlled sentence patterns and lexical bundles.
2. **QL002 segmentation corrected:** V1 could merge the erroneous verb with adjacent material. V2 merges only non-error neighbours and keeps the error segment intact.
3. **No-error calibration tightened:** `GR-SVA-001` basic direct agreement is excluded from the default No-error pool.
4. **Collective nouns made contextual:** V2 supports both unit and member readings only when the sentence contains an explicit cue; neutral collective-noun candidates are rejected.
5. **Many a/an realization fixed:** article choice is deterministic (`many a candidate`, `many an officer`).
6. **Sentence-start casing validated:** pattern-generated first segments must begin with a capital letter.
7. **Difficulty made structural:** lexical load is excluded from the difficulty score; Hard requires a structural score threshold and lexical load must stay low.
8. **Explanations simplified:** the renderer no longer repeats the rule principle and application in two near-identical sentences.

## Difficulty authority V2

Difficulty is derived from five structural dimensions:

- rule complexity
- dependency distance
- distractor similarity
- sentence length
- rule interaction

`lexicalLoad` is retained as metadata but does **not** raise the score.

Thresholds:

- Easy: structural score `<= 8`
- Medium: `9–14`
- Hard: `>= 15`

Hard candidates additionally fail validation if lexical load exceeds 2/5.

## Pattern/variety audit

Local deterministic stress validation over 1,200 seeds per difficulty produced:

| Difficulty | Distinct corrected sentence surfaces | Distinct candidate fingerprints |
| --- | ---: | ---: |
| Easy | 72 | 72 |
| Medium | 203 | 203 |
| Hard | 167 | 167 |

These figures are a V2 checkpoint metric, not a final production-capacity claim. The engine still requires human approval and later pool expansion before production freeze.

## Current QL contracts

- `ENG-001-QL001` — four-part error spotting; exactly one intended SVA error.
- `ENG-001-QL002` — three-part error spotting + `No error`; V2 preserves the registered error segment intact.
- `ENG-001-QL007` — calibrated No-error; generated only from admitted deceptive correct structures.

Other blueprint QLs remain intentionally deferred until CP001 architecture is approved.

## Validation boundary

V2 automatically checks:

- registered rule ↔ mutation consistency
- exactly one changed source segment
- correction-span mapping
- seeded determinism
- QL answer/option contracts
- QL002 error-segment preservation
- calibrated No-error rule admission
- derived difficulty consistency
- Hard lexical-load ceiling
- sentence-length review bounds
- sentence-start capitalisation
- adjacent duplicate words
- `many a/an` article form
- collective-noun context guard
- explanation/key/corrected-sentence consistency
- minimum deterministic variety thresholds

These validators still do not claim to be a full independent English parser. Semantic naturalness, hidden secondary errors, and disputed usage remain human-review gates.

## Approval state

`ENG-001-CP001` remains **review-only**. Do not register it in Question Studio and do not begin CP002 until V2 passes human review for:

- grammar correctness
- one defensible answer
- sentence naturalness
- real-exam resemblance
- Easy/Medium/Hard separation
- explanation clarity
- No-error plausibility
- collective-noun ambiguity
- duplicate/variety quality
