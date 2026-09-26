# ENG-008 — Reading Comprehension — Coverage / Freeze Audit V1

Status: `COVERAGE_COMPLETE__FROZEN__REVIEW_ONLY`

## Audit scope

Reviewed:
- ENG-008 blueprint and exam-profile matrix;
- CP001 SSC Foundation RC;
- CP002 SSC Editorial / Current-Affairs RC;
- CP003 Banking Prelims RC;
- CP004 Banking Mains Analytical RC;
- CP005 Research / Survey / Report RC;
- CP006 Full Multi-question Passage Sets;
- current Question Studio review-only routing.

## Coverage result

Covered:
- SSC story/book-style RC;
- SSC report/editorial/current-affairs RC;
- Banking Prelims direct comprehension, inference, contextual vocabulary, synonym/antonym, supported statement, phrase meaning, cause-effect and title;
- Banking Mains deep inference, viewpoint/tone/purpose, can/cannot infer, paragraph relation, conclusion and scope/assumption;
- research/survey limitation, evidence/conclusion, correlation-vs-causation and confound reasoning;
- one-passage -> governed linked-question-set generation.

## Demonstrated remaining gap

Recent SBI Clerk Prelims paper analyses report RC sets containing an **RC-internal filler/word-fit question**. The ENG-008 blueprint already anticipated contextual word-fit in Banking Prelims, but CP003 currently has only nine families and does not implement that operation.

This also explains the current CP006 constraint: Banking Prelims has only nine approved authorities per passage, so a 10-question RC set is intentionally rejected.

## Gap closure result

**CP007 — Banking Prelims Contextual Word-fit / Filler Gap Closure** was implemented and human-approved.

CP007 adds one governed contextual blank authority to each of the eight approved CP003 passages:
- no new passage content;
- one new family: `BP-F10`;
- answer derived from passage context;
- passage rendering masks the keyed word/phrase so the visible passage does not reveal the answer;
- 8 supplemental authorities total.

CP006 has now been extended from Banking Prelims set sizes `8, 9` to **`8, 9, 10`** using the approved BP-F10 authority. The 10-question set renders one shared masked passage and does not fabricate or duplicate an authority.

## Final freeze decision

The demonstrated gap is closed. Current ENG-008 coverage includes:
- SSC Foundation RC;
- SSC Editorial / Current-Affairs RC;
- Banking Prelims RC including contextual word-fit/filler and 8/9/10-question linked sets;
- Banking Mains Analytical RC;
- Research / Survey / Report RC;
- governed one-passage multi-question set composition.

**No CP008 is justified by the current audit. ENG-008 is frozen.**

Any CP008+ requires new exam evidence or a separately demonstrated content gap. Existing approved content remains review-only: Question Bank writes, scored tests, mocks, learner/public publication, automatic publication and production release remain locked.


## SSC filler / cloze boundary clarification

SSC does test passage-based deleted-word / fill-the-blank sets extensively. These are governed as **Cloze Test / Cloze Passage**, not duplicated inside ENG-008 ordinary Reading Comprehension.

Evidence pattern:
- SSC CGL/CHSL papers use directions such as “some words have been deleted/left out” and ask the most appropriate option for each numbered blank;
- these are passage-level contextual fillers, but structurally they are cloze sets rather than normal RC question families.

Therefore:
- **ENG-008 remains frozen without an SSC filler CP**;
- **ENG-009 owns SSC Cloze Test / Cloze Passage**, including multi-blank passage sets and contextual word fit;
- ENG-008 CP007 remains Banking-Prelims-specific because banking paper analyses show the word-fit/filler operation embedded inside an RC set rather than as a separate cloze block.

This boundary prevents duplicate authoring and duplicate runtime ownership.
