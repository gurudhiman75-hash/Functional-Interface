# ENG-009 CP005 — Mixed / New-pattern Cloze — Source / Coverage Audit V1

Status: `HUMAN_REVIEW_PENDING__REVIEW_ONLY`

## Evidence basis

Recent banking exam analyses show two cloze variants that justify a separate governed checkpoint:
- SBI Clerk Mains 2025: Cloze Test reported as a **phrasal-word** pattern;
- IBPS Clerk Mains 2025: Cloze Test reported in **can-fit / cannot-fit** replacement form.

CP005 implements only these evidenced cloze variants. It does not absorb unrelated topics such as phrase replacement, word swap or sentence rearrangement.

## Contract

- 8 original analytical passages;
- 6 blanks per passage;
- 48 governed authorities;
- Medium/Hard only;
- three modes:
  - `phrasal-word`
  - `can-fit`
  - `cannot-fit`
- one shared passage across each six-question set;
- simple explanations;
- no copied public passage content.

## Validation

Automated guard covers:
- exact 8/48 corpus counts;
- six masks per passage;
- all three new-pattern modes;
- unique accepted/rejected pools;
- deterministic replay;
- unique four-option rendering;
- stable linked-set rendering;
- 300–540 word passage band;
- 6,000-question soak.

Lifecycle remains review-only pending explicit human approval.
