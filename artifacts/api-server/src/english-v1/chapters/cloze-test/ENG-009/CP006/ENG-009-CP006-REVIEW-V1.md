# ENG-009 CP006 — Full-set Composer / Question Studio Integration — Review V1

Status: `HUMAN_REVIEW_PENDING__REVIEW_ONLY`

## What CP006 does

CP006 does not author new cloze passages. It composes the already approved ENG-009 content into linked full-passage sets.

Profiles:
- SSC Standard → CP001
- SSC Advanced → CP002
- Banking Prelims → CP003
- Banking Mains → CP004
- Banking New-pattern → CP005

## Set integrity

- SSC sets contain 5 linked questions.
- Banking sets contain 6 linked questions.
- Every set uses one shared passage.
- Blank numbers remain unique within the set.
- Generation is deterministic by seed.
- Source CP and composer profile are retained in metadata.

## Question Studio

Package: `english-eng009-cloze-test-v1`

The package is registered in the existing `language-v1` engine and is discoverable through the normal Question Studio package list.

Lifecycle remains review-only:
- no Question Bank writes;
- no mock/test release;
- no public publication;
- no automatic learner publication.

CP001–CP005 retain their recorded human approval. CP006 is not marked approved until this review is approved.
