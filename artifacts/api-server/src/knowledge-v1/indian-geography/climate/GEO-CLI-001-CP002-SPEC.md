# GEO-CLI-001 CP002 — Monsoon Mechanism & Seasonal Wind Reversal

Status: REVIEW CANDIDATE V5 — POST-MERGE REMEDIATION
Parent blueprint: `GEO-CLI-001-BLUEPRINT.md`
Permanent QLs: `GEO-CLI-001-QL-010` to `GEO-CLI-001-QL-018`

## Scope

CP002 explains the core seasonal monsoon mechanism after CP001's climate-control foundation. It covers differential heating of land and sea, the summer thermal low, the northward shift of the ITCZ/monsoon trough, cross-equatorial southeast trade winds, Coriolis deflection into the southwest monsoon, summer ocean-to-land flow, winter pressure reversal and the northeast monsoon.

V5 also restores two core mechanism factors that the post-merge audit found missing from learner-facing coverage:
- the high-pressure area east of Madagascar near about 20°S over the southern Indian Ocean, commonly discussed as the Mascarene High;
- intense summer heating of the Tibetan Plateau, which produces strong vertical air currents and low pressure aloft.

Cold-weather details, hot-weather local winds, advancing/retreating monsoon rainfall, regional rainfall patterns, western disturbances, jet streams and ENSO remain owned by later checkpoints.

| QL | Focus | Difficulty |
| --- | --- | --- |
| QL010 | Differential heating of land and sea | Easy |
| QL011 | Summer thermal low and pressure gradient | Easy |
| QL012 | ITCZ and monsoon trough | Easy |
| QL013 | Cross-equatorial southeast trade winds | Medium |
| QL014 | Coriolis deflection and southwest direction | Medium |
| QL015 | Summer onshore monsoon flow | Medium |
| QL016 | Winter pressure pattern and northeast monsoon | Medium |
| QL017 | Seasonal wind reversal | Medium |
| QL018 | Integrated monsoon mechanism, including Madagascar high-pressure and Tibetan Plateau factors | Hard |

## Source authority

Primary educational authority: NCERT `Contemporary India-I`, Chapter 4 — Climate. Its monsoon-mechanism discussion supports differential land-sea heating, the northward shift of the ITCZ, the high-pressure area east of Madagascar near 20°S, and intense summer heating of the Tibetan Plateau with strong vertical air currents and low pressure aloft.

Supporting authority for the detailed mechanism: NCERT `India: Physical Environment`, Climate chapter. This source supports the ITCZ/monsoon trough, its July position around 20°N–25°N over the Gangetic plain, southeast trade winds crossing the Equator mainly between 40°E and 60°E, Coriolis deflection into the southwest monsoon, and the southward ITCZ shift with northeast-wind reversal in winter.

No live weather, current forecast, current cyclone, annual rainfall record or changing operational statistic is admitted.

## Ownership boundary

- CP002 owns the mechanism and seasonal wind reversal, not the detailed four-season climatology.
- CP002 owns direct coverage of the Madagascar high-pressure factor and Tibetan Plateau heating because both are part of the core monsoon mechanism.
- CP002 may name the summer southwest monsoon and winter northeast monsoon only to explain direction and pressure reversal.
- CP002 does not drill branch-wise advancing-monsoon rainfall; that belongs to CP005.
- CP002 does not drill retreating-monsoon cyclonic rain; that belongs to CP006.
- Jet streams, western disturbances and ENSO remain reserved for CP009.

## Exam-grade stem and explanation contract

- Every learner-facing stem must read like a normal SSC, Banking, Railway or similar objective-exam question.
- Easy questions use direct factual wording without sounding childish or note-like.
- Medium questions use a clear relation, direction, pressure pattern, sequence or short applied situation.
- Hard questions integrate the monsoon mechanism; difficult English is never used to manufacture difficulty.
- Standard statement instructions may repeat, but statement format must not dominate the batch.
- Avoid generator-like filler such as `associated with`, `described as`, `in the context of`, `with reference to the above`, and vague `Which is correct?` prompts without a clear object.
- Learner-facing CP002 text must not use `broad`, `broadly` or repetitive `mainly`.
- Applied stems must contain only clues needed to solve the item.
- Explanations must be question-specific, simple and connected. Repeating one QL-level explanation tail across six questions is not allowed.
- Explanations must explain the decisive relation or mechanism rather than mechanically beginning with the canonical answer.
- No option-by-option analysis unless genuinely needed.
- Learner-facing text must not contain source names, review-state terminology or generator language.

## Review contract

- 54 questions
- exactly 6 questions per QL
- 18 Easy / 30 Medium / 6 Hard
- 54 unique learner-facing stems
- 54 unique semantic payloads
- 54 unique question-specific explanations
- explicit learner-facing coverage of the Madagascar high-pressure factor
- explicit learner-facing coverage of Tibetan Plateau summer heating
- A14 / B14 / C13 / D13 answer-position split at this checkpoint; chapter-wide answer-position rebalance is a later remediation stage
- at least three distinct canonical answers among Hard questions
- four unique options per item
- stem length 28–360 characters
- no more than 10 statement-format stems
- no exact reuse of the two CP003 winter-pressure/wind stems identified by the post-merge audit
- source/fact provenance on every question
- review-only; runtime registration disabled

## Version history

### V2 editorial correction

V2 removed source-name leakage from the learner-facing explanation layer while preserving the V1 stems, options, answers, difficulty labels and provenance.

### V3 stem correction

V3 replaced every learner-facing stem with an explicit exam-grade version while preserving V2 options, correct answers, answer positions, difficulty labels, QL ownership, explanations and provenance.

### V4 final stem correction

V4 replaced the remaining `best described as` construction in the ITCZ item with a direct exam question.

### V5 post-merge remediation

V5 responds to the exhaustive post-merge audit. It:
- adds the missing Madagascar/Mascarene High and Tibetan Plateau mechanism coverage;
- rewrites all 54 explanations individually;
- removes CP002 uses of `broad`, `broadly` and repetitive `mainly`;
- rewrites the two CP002 winter stems that exactly duplicated CP003;
- normalizes the most conspicuous option-shape issues in Q013, Q052 and Q053;
- preserves the 54-question / 9-QL checkpoint structure, difficulty distribution and current checkpoint answer-position quota.

V5 remains review-only and must not be merged until explicit human approval. Because CP002 is an owning authority, CP013 must be regenerated and requalified after the owning-authority remediation is approved.
