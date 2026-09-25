# GEO-VEG-001 — Natural Vegetation & Wildlife of India

Status: ACTIVE IMPLEMENTATION — WAVE 3 (CP008–CP010) REVIEW
Engine: `knowledge-v1`
Subject: Static GK / Indian Geography
Chapter: `GEO-VEG-001`

## 1. Goal

Build an exam-standard, source-governed chapter on India's natural vegetation and wildlife. The package should cover vegetation controls, major forest types and distribution, characteristic species, wildlife-habitat relations, biodiversity/conservation concepts and mixed comparative reasoning.

Learner-facing language must remain simple, natural and consistent with SSC, Banking, Railway and comparable competitive exams.

## 2. Source policy

Primary educational authority:
- NCERT `Contemporary India-I`, Natural Vegetation and Wildlife;
- NCERT `India: Physical Environment`, Natural Vegetation.

Supporting authority may include Ministry of Environment, Forest and Climate Change, Forest Survey of India, Wildlife Institute of India and other Government of India sources when a standard NCERT fact needs more precise framing.

Runtime web or LLM output is never truth authority.

Dynamic counts, current forest-cover percentages, current reserve counts, current endangered-status lists and changing programme statistics are outside the static owning pool unless separately versioned.

## 3. Permanent checkpoint plan

| CP | Scope | Permanent QLs |
| --- | --- | --- |
| CP001 | Vegetation Basics & Controlling Factors | QL001–QL009 |
| CP002 | Tropical Evergreen & Semi-Evergreen Forests | QL010–QL018 |
| CP003 | Tropical Deciduous Forests | QL019–QL027 |
| CP004 | Tropical Thorn Forests & Scrub | QL028–QL036 |
| CP005 | Montane Vegetation | QL037–QL045 |
| CP006 | Mangrove / Tidal / Littoral & Swamp Vegetation | QL046–QL054 |
| CP007 | Vegetation Distribution & Region Associations | QL055–QL063 |
| CP008 | Characteristic Trees & Forest-Species Identification | QL064–QL072 |
| CP009 | Wildlife Habitats & Regional Distribution | QL073–QL081 |
| CP010 | Biodiversity & Conservation Concepts | QL082–QL090 |
| CP011 | Climate–Relief–Vegetation Comparative Identification | QL091–QL099 |
| CP012 | Multi-fact / Statement / Match Integration | QL100–QL108 |
| CP013 | Exhaustive Vegetation & Wildlife Mastery | no new permanent QLs |

## 4. Chapter spine

1. Natural vegetation, virgin vegetation, flora and fauna
2. Indigenous/endemic and exotic species
3. Relief, soil and climatic controls
4. Tropical evergreen and semi-evergreen forests
5. Tropical deciduous forests
6. Thorn forest and scrub
7. Montane vegetation
8. Mangroves and tidal forests
9. Regional vegetation distribution
10. Characteristic tree species
11. Wildlife and habitat relations
12. Conservation concepts
13. Mixed comparative identification

## 5. Question-quality rules

- Stems must read like real competitive-exam questions, not generated prompts.
- Avoid filler such as `associated with`, `described as`, `in the context of`, `broad` / `broadly`, and repetitive `mainly`.
- Every permanent QL must own six semantically distinct questions where the source supports them.
- Explanations should be simple, question-specific and usually 2–3 short sentences: answer directly first, then add one useful why/how connection.
- Distractors must be plausible vegetation types, regions, species, controls or conservation terms.
- Hard questions should require relation depth, comparison or multi-statement reasoning rather than difficult English.
- Do not use dynamic reserve/species counts to manufacture difficulty.
- Negative questions require a bounded canonical set.
- No option-by-option analysis unless a question genuinely needs it.

## 6. Difficulty model

- Easy: direct definition, identification or one clear relation.
- Medium: reverse association, two-clue identification, comparison or pair reasoning.
- Hard: multi-factor climate/relief reasoning, regional synthesis or three-statement integration.

## 7. Owning-pool contract

CP001–CP012 each own nine permanent QLs with six questions per QL.

Target owning pool after CP012:
- 108 permanent QLs
- 648 questions
- Easy 216 / Medium 360 / Hard 72
- chapter-level answer positions A162 / B162 / C162 / D162 at closure

Individual CP review batches may use A14 / B14 / C13 / D13 before the chapter-level rebalance.

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

Wave 1 is human-approved and merged:
- CP001–CP004 — QL001–QL036 — 216 owning questions.

Wave 2 is human-approved and merged:
- CP005–CP007 — QL037–QL063 — 162 owning questions.

Wave 3 is implemented as three 54-question review candidates:
- CP008 — Characteristic Trees & Forest-Species Identification — QL064–QL072.
- CP009 — Wildlife Habitats & Regional Distribution — QL073–QL081.
- CP010 — Biodiversity & Conservation Concepts — QL082–QL090.

Each Wave 3 checkpoint preserves:
- 54 questions and six questions per permanent QL;
- Easy18 / Medium30 / Hard6;
- A14 / B14 / C13 / D13;
- unique stems and explanations;
- domain-plausible distractors;
- static source-governed facts only;
- no dynamic population, protected-area-count or species-status snapshots;
- review-only lifecycle with runtime publication disabled.

Wave 3 adds 27 permanent QLs and 162 owning questions for human review. CP011 begins Climate–Relief–Vegetation Comparative Identification.
