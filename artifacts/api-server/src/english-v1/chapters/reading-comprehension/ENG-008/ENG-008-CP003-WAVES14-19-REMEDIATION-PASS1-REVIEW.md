# ENG-008 CP003 — Waves 14–19 Remediation Pass 1

Status: `REVIEW_READY__PASSAGE_SURFACE_REMEDIATED__QUESTIONS_PENDING_PASS2`

## Scope

This pass covers the **48 Banking Prelims RC passages** contributed by Waves 14–19.

The original active passages were built through the shared ENG-008 expansion factory. Their topic specifications remain useful, but the prose surface repeated the same long-form skeleton too often.

## What changed

- all 48 passage IDs are preserved;
- all 48 titles / genres remain tied to their existing topic specifications;
- all 432 governed question authorities are preserved for this pass;
- answer keys are unchanged;
- Question Studio routing remains unchanged;
- each passage now uses a CP003-specific remediation surface rather than the original shared `longText()` Banking Prelims skeleton;
- the remediation layer uses multiple independently ordered structures and passage-specific fact / reason / inference / keyword / contrast material;
- Banking Prelims length remains **350–450 words**;
- nine governed question families remain attached to every passage.

## Why this is only Pass 1

This pass deliberately does **not** rewrite keyed questions at the same time as passage prose.

The original Waves 14–19 question authorities still contain repetitive:
- prompt ordering;
- generic distractor sets;
- explanation wording.

Those will be replaced in **Pass 2** while keeping the now-stable remediated passages fixed. Splitting the work keeps answer-key risk lower and makes editorial review easier.

## Source guards

The CP003 audit now checks:
- 126 total active Banking Prelims passages;
- 1,134 total governed question authorities;
- exactly **48** remediated Waves 14–19 passages;
- 48 unique remediated passage IDs;
- 350–450 words for each remediated passage;
- nine questions retained per remediated passage;
- removal of characteristic old shared long-form closing phrases;
- full CP003 family breadth;
- deterministic replay;
- four-option uniqueness;
- 7,200-question soak source.

## Next pass

Pass 2 should replace the 432 question surfaces attached to these 48 passages with:
- passage-specific distractors;
- varied but exam-standard question wording;
- passage-specific explanations identifying the actual clue or inference chain;
- no change to family ownership or answer-key determinism.

Lifecycle remains `QUESTION_STUDIO_REVIEW_ONLY`.
