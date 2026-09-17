# COA-001 / CP008 — Source Saturation + Exam-realness Audit

Status: **IMPLEMENTED / HUMAN REVIEW REQUIRED**

## Audit conclusion

The existing semantic families cover the material learner operations found in the audited Course-of-Action sources, but the presentation layer had two real gaps:

1. **three-course combination questions** are materially present in official-paper reproductions and require a dedicated renderer;
2. **five-code two-course questions with `Either I or II`** are materially present in banking memory-based reproductions and require a dedicated exclusive-alternative pair authority rather than inference from ordinary independent courses.

No source evidence from this pass justified reviving `COA-QL-007` as a separate semantic family. Paired-course structure remains presentation metadata.

## Source-backed presentation findings

### A. Two actions / four-way — core, directly supported

Observed in public reproductions of:

- SSC CGL 2025, 19 September 2025 Shift 3 — https://testbook.com/question-answer/consider-the-following-statement-and-choose-the-op--690b2b4b9b71212a5ba09022
- RRB NTPC CBT 2 Level-2, 13 June 2022 Shift 2 — https://testbook.com/question-answer/read-the-given-statement-and-courses-of-action-car--62b3ea88da6508c0c6b46b0e
- RRB ALP CBT-I, 27 November 2024 Shift 3 — https://testbook.com/question-answer/in-this-question-a-statement-is-followed-by-two-c--675994551800e812ea9f2bd9
- Punjab Civil Service 2018 CSAT — https://testbook.com/question-answer/directions-in-the-question-given-below-is--678680579de47e4f62b08b98

Decision: `TWO_ACTION_FOUR_WAY` is source-supported core presentation. Punjab-state evidence does not require a different semantic QL.

### B. Two actions / five-code — banking profile, source-supported with restriction

Observed in public memory-based reproductions of:

- IBPS PO Mains, 4 February 2021 — https://testbook.com/question-answer/direction-in-the-question-below-are-given-a-state--5f60d413df10bed46fcdbc91
- RBI Grade B, 9 November 2019 — https://testbook.com/question-answer/directionsin-the-question-below-are-given-a--5d97b857f60d5d721e0e949e

The RBI Grade B reproduction includes a case marked `Either I or II follows`, where the two courses are alternative resolution routes rather than two independent actions to perform together.

Decision:

- five-code rendering is enabled as a **banking memory-based source-supported profile**;
- ordinary QL authorities may be rendered into five options for Only-I / Only-II / Both / Neither;
- `Either I or II` may be generated **only** from dedicated `MUTUALLY_EXCLUSIVE_ALTERNATIVES` authorities;
- ordinary two-action authorities are forbidden from mapping to `Either`.

This preserves the CP005 safety decision: `Either` is a pair relation, not a fifth label guessed from two independent verdicts.

### C. Three actions / combination answer — material official-paper pattern

Observed in public official-paper reproductions of:

- NHPC JE Civil, 4 April 2022 Shift 2 — https://testbook.com/question-answer/a-statement-is-followed-by-three-courses-of-action--625e16c8a127f46c416a02ae
- Telangana Police SI Mains 2016 — https://testbook.com/question-answer/candidates-who-appeared-for-an-examination-are-agi--60950cb183020cf77f27e9e8
- OPSC OAS Prelims CSAT, 15 October 2023 — https://testbook.com/question-answer/statement-one-aspirant-was-killed-due-to-stamped--6a070b45148548c17073d2b3

Additional older official-paper reproductions also show the profile in BARC and Rajasthan Police material.

Decision: `THREE_ACTION_COMBINATION` is a source-supported core variant. CP008 implements six authored calibration authorities with independently evaluated I/II/III verdicts and four authored combination choices per scenario.

### D. Single-best action — exclude from core COA

A situational question reproduced from CGPSC Civil Service 2020 CSAT asks for the best reaction from four direct alternatives:

https://testbook.com/question-answer/read-the-situation-and-choose-the-best-course-of-a--6142e301ce2a8ca9ae9acf6d

Decision: this is closer to situational judgment / decision making than the statement + independently judged Course I/II/III operation owned by COA-001. `SINGLE_BEST_ACTION` remains outside core COA.

## Semantic-family saturation

The audit did not identify a missing learner operation that requires another permanent semantic QL beyond:

- QL001 direct remedy;
- QL002 prevention / risk reduction;
- QL003 verification before irreversible action;
- QL004 administrative / institutional response;
- QL005 constraint-aware action;
- QL006 proportionality / overreaction;
- QL008 sequencing / dependency;
- QL009 integrated multi-dimension reasoning.

`QL007` is therefore **retired from future semantic expansion**. Its approved CP001 calibration examples remain untouched as legacy identifiers because approved historical authority is immutable. New generation must not route through QL007.

Overall QL allocation is **freeze-ready but not yet frozen** because CP007 itself is still awaiting explicit human approval.

## Exam-realness findings

The audited sources reinforce the following permanent content rules:

- short, direct problem statements are common; difficulty must not come from long English;
- a strict action can follow when facts justify it, so absolute-word heuristics are invalid;
- investigation before punishment is recurring and must remain represented;
- immediate relief and preventive follow-up can both follow;
- broad shutdowns, blanket punishments and unrelated desirable actions are common distractor mechanisms;
- social/civic/public-administration scenarios occur alongside banking and operational scenarios, so the generated pool must not drift too heavily toward software/process failures;
- conventional direction wording may repeat without being counted as stem-template duplication.

## CP008 implementation

- `cp008-source-census.ts` — typed evidence ledger and profile decisions;
- `cp008-profile-authorities.ts` — six three-action and four dedicated exclusive-either authorities;
- `cp008-source-backed-profiles.ts` — five-code and three-action renderers;
- `cp008-source-saturation-proof.test.ts` — source threshold, additive preservation, pair-safety, combination and reachability proof;
- `COA-CP-008-PROFILE-REVIEW.md` — human review samples;
- dedicated CP008 CI gate.

## Lifecycle

- CP001–CP006: **APPROVED / FROZEN**
- CP007: **HUMAN REVIEW PENDING**
- CP008: **HUMAN REVIEW PENDING**
- QL007 future semantic expansion: **RETIRED**
- overall QL allocation: **FREEZE-READY / WAITING FOR CP007 + CP008 HUMAN APPROVAL**
- Question Studio: **CLOSED**
- Question Bank: **CLOSED**
- Hindi/Punjabi: **NOT STARTED**
- public/student delivery: **CLOSED**
