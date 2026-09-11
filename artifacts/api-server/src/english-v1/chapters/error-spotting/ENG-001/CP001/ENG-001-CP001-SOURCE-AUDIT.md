# ENG-001-CP001 Source & Coverage Audit — Subject–Verb Agreement V4

Status: `SOURCE_AUDIT_V4__CI_GREEN__HUMAN_REVIEW_PENDING`

## Purpose

This audit defines the evidence boundary for the first English Content Engine checkpoint. It calibrates rule coverage, sentence structure, difficulty, ambiguity guards, Error Spotting surfaces, and validation before any Question Studio registration.

The implementation principle is:

> verified correct construction → registered grammar rule → controlled mutation → deterministic answer → question-specific explanation

## Source classes reviewed

### A. User-provided English reference material

The uploaded *How to Prepare for Verbal Ability and Reading Comprehension for the CAT* material identifies subject–verb agreement as a major grammatical-error class and explicitly warns that agreement becomes harder when the true subject is disguised by intervening material and separated from the verb. CP001 therefore raises difficulty through dependency distance and misleading nearby nouns rather than obscure vocabulary.

### B. Competitive-exam PYQ surfaces

The audit used indexed official-paper questions reproduced by Testbook for SSC and state-level examinations to confirm that target constructions are genuinely tested and to calibrate exam surfaces. Testbook is a secondary host of those questions, not the examination authority itself.

### C. Grammar-reference support

Where the present audit did not locate a sufficiently clean direct PYQ for an admitted rule, that rule remains reference-backed and is explicitly marked as such rather than being labelled PYQ-saturated.

## Coverage matrix

| Rule | Construction | Evidence status | Audit evidence / decision | Difficulty in V4 |
| --- | --- | --- | --- | --- |
| `GR-SVA-001` | Basic singular/plural agreement | PYQ + reference backed | Core SVA principle is directly represented throughout exam grammar items. Bare direct agreement remains Easy-only because it has little structural concealment. | Easy |
| `GR-SVA-002` | Each / every | Direct PYQ backed | SSC MTS 2024 and SSC CHSL/CGL material use `each of + plural noun` with singular agreement. | Easy–Medium |
| `GR-SVA-003` | One of + plural noun | Direct PYQ backed | SSC Stenographer 2025 includes `One of the questions were...`, requiring singular agreement with `one`. | Easy–Medium |
| `GR-SVA-004` | A number of / the number of | Partial direct PYQ + reference backed | SSC Stenographer 2025 directly tests `the number of applicants ... have increased` → singular `has`; `a number of` remains reference-backed in the present audit and is not claimed PYQ-saturated. | Medium–Hard |
| `GR-SVA-005` | Along with / together with / as well as | Direct PYQ backed | SSC CHSL 2025 and SSC Stenographer 2025 test that additive phrases do not change agreement with the main subject. | Medium–Hard |
| `GR-SVA-006` | Either/or; neither/nor proximity | Direct exam-pattern backed | SSC CHSL 2025 material confirms nearest-subject agreement under the target competitive-exam convention. V4 uses semantically compatible singular/plural arms and keeps the nearer subject explicit. | Medium–Hard |
| `GR-SVA-007` | Collective nouns | Direct PYQ backed, context-sensitive | SSC CGL 2021 supports singular agreement when a group acts as one unit; SSC Stenographer 2025 supports plural agreement when members are explicitly acting separately. V4 therefore uses dedicated unit/member scenes and rejects neutral readings. | Medium–Hard |
| `GR-SVA-008` | More than one + singular noun | Grammar-reference backed | The targeted search did not locate a sufficiently clean direct Error Spotting PYQ. Standard grammar references support singular agreement for `more than one + singular noun`. It remains admitted but not PYQ-saturated. | Medium–Hard |
| `GR-SVA-009` | Many a/an + singular noun | Direct PYQ backed | OPSC ASO 2022, Bihar D.El.Ed 2024, SSC MTS 2023 and SSC CHSL 2024 directly test singular noun/agreement after `many a/an`. Article choice is deterministic. | Medium–Hard |
| `GR-SVA-010` | Intervening phrase / misleading nearby noun | Reference + exam-pattern backed | The user-provided reference explicitly identifies subject–verb separation and misleading intervening material as a major difficulty source; SSC-style items repeatedly use the same trap. | Medium–Hard |

## Evidence URLs retained for the checkpoint

- Each of the participants — Bihar/SSC-style agreement evidence: https://testbook.com/question-answer/fill-in-the-blanks-with-the-correct-optionevery--62f3c6ba2ffaa2c2e81e14f2
- Many a man — OPSC ASO 2022: https://testbook.com/question-answer/many-a-man-_______-suffered-during-partition--684996ecb85f0c6b5cd04cd0
- Many a/an construction — SSC MTS 2023: https://testbook.com/question-answer/direction-select-the-most-appropriate-option-to-s--64a5125edb7d5e398558ca16
- Many a woman — SSC CHSL 2024: https://testbook.com/question-answer/select-the-most-appropriate-option-that-can-substi--66a4ce7f32c8062ce29eda91
- `more than one + singular noun` grammar reference: https://guidetogrammar.org/grammar/sv_agr.htm
- SSC CGL Error Spotting surface index: https://questions.examside.com/past-years/ssc/ssc-cgl-tier-i/english-comprehension/error-spotting
- SSC CGL compilation surface reference: https://edurev.in/t/565683/ssc-cgl-previous-year-questions-spotting-errors

## V4 exam-surface decisions

- Use one short, standard instruction: `Identify the part of the sentence that contains an error.`
- QL002 and QL007 add only: `If there is no error, select 'No error'.`
- QL001 uses four visible sentence parts.
- QL002 uses three sentence parts plus a `No error` option while preserving the registered error segment intact.
- QL007 is a calibrated No-error surface and excludes bare basic agreement from the default pool.
- Difficulty rises through rule interaction, dependency distance, competing nouns, and contextual agreement—not difficult vocabulary.
- A dedicated plain-language realization layer removes avoidable domain jargon and awkward collocations without changing the registered SVA target.
- Generic context suffixes are not appended to production questions because they reduced readability and naturalness; authored scenes and structural catalogs provide the sentence context.
- Explanations use a fixed simple pattern: identify the keyed part, give one short reason, state the correction directly, and show the corrected sentence. No-error explanations explicitly confirm that the existing verb is correct.

## V4 production architecture

V4 replaces the earlier exploratory V1–V3 generators with one production candidate pipeline built from authored semantic and structural catalogs:

- 640 complete semantic scenes across 20 unrelated generic domains;
- 80 dedicated pair scenes for additive/proximity structures;
- 80 dedicated intervening-subject scenes;
- 12 explicit collective-unit scenes and 12 explicit collective-member scenes;
- deterministic correct-base → one registered mutation → answer → corrected sentence;
- a plain-language surface layer that removes avoidable domain jargon without changing the registered SVA target;
- no generic context suffixes appended by the production generator;
- no local city/place names.

Historical V1–V3 implementation/review files are intentionally not shipped in the final checkpoint tree; Git history retains them if comparison is needed.

## Difficulty authority

Difficulty is derived from five structural dimensions:

- rule complexity
- dependency distance
- distractor similarity
- sentence length
- rule interaction

`lexicalLoad` remains metadata and does not raise the structural score. Hard candidates fail validation if lexical load is too high.

## Current QL contracts

- `ENG-001-QL001` — four-part Error Spotting; exactly one intended SVA error.
- `ENG-001-QL002` — three-part Error Spotting + `No error`; the registered error segment remains intact.
- `ENG-001-QL007` — calibrated No-error generated only from admitted deceptive correct structures.

Other blueprint QLs remain intentionally deferred until CP001 is approved.

## Automated validation boundary

V4 CI checks include:

- registered rule ↔ mutation consistency;
- exactly one changed source segment;
- correction-span mapping;
- seeded determinism;
- QL answer/option contracts;
- fixed simple instruction stems;
- QL002 error-segment preservation;
- calibrated No-error rule admission;
- structural difficulty consistency;
- Hard lexical-load ceiling;
- sentence-length and visible-segment bounds;
- sentence-start capitalisation and whitespace hygiene;
- adjacent duplicate-word checks;
- `many a/an` article form;
- collective-noun ambiguity guards;
- heavy-vocabulary guardrails;
- explanation-jargon and explanation-length guardrails;
- direct correction wording for error items;
- explicit correctness wording for No-error items;
- explanation/key/corrected-sentence consistency;
- machine-like repeated continuous-predicate checks;
- selected awkward-collocation regression checks found during human-style review;
- semantic-domain and production-scale diversity thresholds;
- all 20 semantic domains in each large-sample difficulty diagnostic;
- domain-balance guardrails;
- frozen review-file equality with the deterministic exporter.

These validators do not claim to be a full independent English parser. Semantic naturalness, hidden secondary errors, and disputed usage remain human-review concerns.

## V4 scale and observed diversity

The conservative canonical capacity before QL shaping is **13,464** variants. Current deterministic 20,000-seed diagnostics expose:

| Difficulty | Distinct corrected sentence surfaces | Semantic domains |
| --- | ---: | ---: |
| Easy | 1,920 | 20 |
| Medium | 3,546 | 20 |
| Hard | 1,915 | 20 |

The lower observed counts compared with the earlier context-multiplied prototype are intentional: artificial context suffix multiplication was removed in favour of clearer exam-like sentences.

## Approval state

`ENG-001-CP001` remains **review-only**. The V4 engine, production-scale stress suite, and frozen 60-question review synchronization are green, but Question Studio/publication registration and CP002 remain blocked until the user explicitly approves this checkpoint.
