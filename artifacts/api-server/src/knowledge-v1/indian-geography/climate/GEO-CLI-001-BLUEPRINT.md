# GEO-CLI-001 — Climate of India & Monsoon System

Status: CONTENT CLOSED — APPROVED AND MERGED
Engine: `knowledge-v1`
Subject: Static GK / Indian Geography
Chapter: `GEO-CLI-001`

## 1. Goal

Build an exam-standard, source-governed chapter on the climate of India. The chapter must cover the controls of climate, monsoon mechanism, seasons, rainfall distribution and the important weather systems commonly tested in SSC, Banking and similar exams. Questions should support direct, reverse, pair, statement, match and mixed-composition formats while keeping learner language simple.

## 2. Source policy

Primary educational authority: NCERT `Contemporary India-I`, Chapter 4 — Climate.

Supporting authorities may include NCERT `India: Physical Environment`, the India Meteorological Department and other Government of India educational or climatological material when a fact needs more precise framing.

Runtime web or LLM output is never truth authority. Current-season forecasts, live rainfall, current cyclone names and changing operational statistics are outside this static chapter.

## 3. Permanent checkpoint plan

| CP | Scope | Permanent QLs |
| --- | --- | --- |
| CP001 | Climate Controls & Monsoon Character | QL001–QL009 |
| CP002 | Monsoon Mechanism & Seasonal Wind Reversal | QL010–QL018 |
| CP003 | Cold Weather Season | QL019–QL027 |
| CP004 | Hot Weather Season & Local Winds | QL028–QL036 |
| CP005 | Advancing Southwest Monsoon | QL037–QL045 |
| CP006 | Retreating / Northeast Monsoon & Cyclonic Rain | QL046–QL054 |
| CP007 | Rainfall Distribution & Variability | QL055–QL063 |
| CP008 | Regional Rainfall & Orographic Patterns | QL064–QL072 |
| CP009 | Western Disturbances, Jet Streams & ENSO Basics | QL073–QL081 |
| CP010 | Climate–Region / State Associations | QL082–QL090 |
| CP011 | Comparative Seasons & Climate Controls | QL091–QL099 |
| CP012 | Multi-fact / Statement / Match Integration | QL100–QL108 |
| CP013 | Exhaustive Mixed Climate Mastery | no new permanent QLs |

## 4. Chapter spine

The chapter uses these learner-facing blocks:

1. Why India has a monsoon-type climate
2. Controls of climate: latitude, altitude, pressure and winds, distance from sea, relief and ocean influence
3. Seasonal monsoon mechanism
4. Cold weather season
5. Hot weather season
6. Advancing southwest monsoon
7. Retreating / northeast monsoon
8. Rainfall distribution and rain-shadow effects
9. Important weather systems and large-scale climate influences

Later CPs may integrate earlier facts but must not take ownership away from the original QL.

## 5. Question-quality rules

- Stems must read like real SSC, Banking, Railway or similar objective-exam questions; textbook/generator wording is not acceptable.
- Keep stems concise, natural and self-contained. Hard questions must be hard because of relation depth, not difficult English.
- Standard exam instructions may repeat; semantic payloads must not.
- Every permanent QL must retain six semantically distinct owning payloads where the source supports them.
- Use direct questions, applied situations, bounded pair questions and statement tasks in a balanced mix.
- Avoid filler such as `associated with`, `described as`, `in the context of`, vague `Which is correct?` prompts, and internal source/review terminology.
- Explanations must state the decisive fact directly in simple language.
- Do not use option-by-option analysis unless a question genuinely needs it.
- Avoid obscure weather trivia merely to make a question hard.
- Hard questions must come from relation depth, comparison or multi-statement reasoning.
- Negative questions require a bounded canonical relation set.
- Current/live weather, forecasts and changing annual records are excluded.
- Learner-facing terms should prefer common school/exam wording over specialist meteorological jargon unless the term itself is exam-relevant.

## 6. Difficulty model

- Easy: direct identification or one-hop association.
- Medium: reverse association, two-clue identification, comparison, pair or two-statement reasoning.
- Hard: multi-control reasoning, three-statement questions, cross-season comparison or mixed integration.

Difficulty must come from the number of facts or relations needed, not from difficult English.

## 7. Lifecycle

Every owning CP is review-only until explicit human approval. Question Studio registration, Question Bank writes, test/mock eligibility, public publication and production release remain separately governed.

## 8. Closure contract

- CP001–CP012 own QL001–QL108.
- Each permanent QL should close with six unique qualified payloads, giving 648 owning questions.
- CP013 creates no new permanent QLs.
- CP013 must produce a 108-question exhaustive master with one representative from every permanent QL.
- Final closure requires the exhaustive gate, API build and main Geography validation to pass.
- Chapter closure does not itself authorize public tests or production release.

## 9. Current state

`GEO-CLI-001` has completed content implementation through CP013. The post-merge remediation authority is `GEO_CLI_001_OWNING_AUTHORITY_V3`, covering all 648 owning questions across QL001–QL108. It includes the CP002 core-mechanism repair, CP012 integration-only repair, chapter-wide wording and duplicate-stem cleanup, exact 162/162/162/162 answer-position balance, and targeted Hard/distractor calibration. CP013 V6 is the synchronized 108-question exhaustive closure layer. Human approval was granted and the remediation candidate was merged into `New-main` in PR #1965. The chapter is content-closed on `GEO_CLI_001_OWNING_AUTHORITY_V3` with CP013 V6 as the exhaustive closure layer. Runtime registration, Question Bank writes, tests/mocks and public publication remain separately disabled.
