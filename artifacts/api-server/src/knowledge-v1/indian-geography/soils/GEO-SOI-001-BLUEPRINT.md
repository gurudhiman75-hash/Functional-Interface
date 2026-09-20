# GEO-SOI-001 — Soils of India

Status: ACTIVE IMPLEMENTATION — CP003–CP004 REVIEW
Engine: `knowledge-v1`
Subject: Static GK / Indian Geography
Chapter: `GEO-SOI-001`

## 1. Goal

Build an exam-standard, source-governed chapter on the soils of India. The chapter should cover soil formation, soil profile, major Indian soil groups, their distribution and properties, crop relations, soil erosion and conservation. Learner-facing language must remain simple, natural and consistent with SSC, Banking, Railway and comparable exams.

## 2. Source policy

Primary educational authority: NCERT `Contemporary India-II`, Chapter 1 — Resources and Development, especially the sections on soil as a resource, classification of Indian soils, soil erosion and conservation.

Supporting authority may include ICAR, NBSS&LUP and other Government of India educational/agricultural sources when a standard NCERT fact needs more precise framing. Runtime web or LLM output is never truth authority.

Current soil-health measurements, changing district-level survey values and live agricultural statistics are outside this static chapter unless separately versioned.

## 3. Permanent checkpoint plan

| CP | Scope | Permanent QLs |
| --- | --- | --- |
| CP001 | Soil Formation, Profile & Classification Basics | QL001–QL009 |
| CP002 | Alluvial Soils | QL010–QL018 |
| CP003 | Black Soils | QL019–QL027 |
| CP004 | Red & Yellow Soils | QL028–QL036 |
| CP005 | Laterite Soils | QL037–QL045 |
| CP006 | Arid Soils | QL046–QL054 |
| CP007 | Forest / Mountain Soils | QL055–QL063 |
| CP008 | Soil Distribution & Region/State Associations | QL064–QL072 |
| CP009 | Soil–Crop Relations | QL073–QL081 |
| CP010 | Soil Properties & Comparative Identification | QL082–QL090 |
| CP011 | Soil Erosion & Conservation | QL091–QL099 |
| CP012 | Multi-fact / Statement / Match Integration | QL100–QL108 |
| CP013 | Exhaustive Mixed Soils Mastery | no new permanent QLs |

## 4. Chapter spine

1. Soil as a natural resource
2. Factors of soil formation
3. Soil profile and horizons
4. Major soil groups of India
5. Regional distribution
6. Physical and chemical properties
7. Soil–crop suitability
8. Soil erosion
9. Soil conservation

Later CPs may integrate facts from earlier checkpoints but must not take ownership away from the original QL.

## 5. Question-quality rules

- Stems must read like real competitive-exam questions, not generated prompts.
- Avoid filler such as `associated with`, `described as`, `in the context of`, `broad` / `broadly`, and repetitive `mainly`.
- Every permanent QL must own six semantically distinct questions where the source supports them.
- Explanations should be simple, question-specific and usually 2–3 short sentences: answer directly first, then add one useful why/how connection.
- Distractors must be real soil terms, regions, properties or processes and should form plausible exam confusions.
- Hard questions should require relation depth, comparison or multi-statement reasoning rather than difficult English.
- Do not use obscure pedological terminology merely to increase difficulty.
- Negative questions require a bounded canonical set.
- No option-by-option analysis unless a question genuinely needs it.

## 6. Difficulty model

- Easy: direct identification or one clear relation.
- Medium: reverse association, two-clue identification, comparison or pair reasoning.
- Hard: multi-factor formation reasoning, regional-property synthesis or three-statement integration.

## 7. Owning-pool contract

CP001–CP012 each own nine permanent QLs with six questions per QL.

Target owning pool after CP012:
- 108 permanent QLs
- 648 questions
- Easy 216 / Medium 360 / Hard 72
- chapter-level answer positions balanced to A162 / B162 / C162 / D162 at closure

Individual CP review batches may use A14 / B14 / C13 / D13 before chapter-level rebalance.

## 8. Lifecycle

All implementation remains review-only until explicit human approval. Question Studio registration, Question Bank persistence, test/mock eligibility, public publication and production runtime remain separately governed.

## 9. Closure contract

- CP001–CP012 must qualify all QL001–QL108.
- Each permanent QL must retain six unique owning payloads.
- CP013 must contain one representative from every permanent QL.
- CP013 target: 108 questions, Easy 36 / Medium 60 / Hard 12, A27 / B27 / C27 / D27.
- Final closure requires chapter audit, exhaustive CP013 qualification, API build and main Geography validation.
- Content closure does not itself authorize public/runtime publication.

## 10. Current state

CP001 and CP002 were explicitly approved and merged through PR #1991. Their 108 owning questions across QL001–QL018 remain frozen as approved authority. CP003 — Black Soils (QL019–QL027) and CP004 — Red & Yellow Soils (QL028–QL036) are implemented as review candidates and remain unmerged until explicit human approval. Runtime publication and Question Bank/test/mock activation remain separately governed.
