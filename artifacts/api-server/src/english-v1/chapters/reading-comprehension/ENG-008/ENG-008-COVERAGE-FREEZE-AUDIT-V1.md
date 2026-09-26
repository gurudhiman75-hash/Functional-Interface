# ENG-008 — Reading Comprehension — Coverage / Freeze Audit V1

Status: `GAP_FOUND__CP007_REQUIRED__REVIEW_ONLY`

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

## Decision

Create **CP007 — Banking Prelims Contextual Word-fit / Filler Gap Closure**.

CP007 adds one governed contextual blank authority to each of the eight approved CP003 passages:
- no new passage content;
- one new family: `BP-F10`;
- answer derived from passage context;
- passage rendering masks the keyed word/phrase so the visible passage does not reveal the answer;
- 8 supplemental authorities total.

After human approval, CP006 may be extended from Banking Prelims set sizes `8, 9` to `8, 9, 10`.

## Freeze condition

If CP007 passes human review and the 10-question Banking Prelims set integration is approved, **no further ENG-008 checkpoint is justified by the current audit**.

Any CP008+ requires new exam evidence or a separately demonstrated content gap.
