# ENG-008 CP004 — Banking Mains Analytical Reading Comprehension — Source Audit V1

Status: `HUMAN_APPROVED__QUESTION_STUDIO_REVIEW_ONLY`

## Purpose

CP004 implements a distinct Banking Mains Reading Comprehension profile. It does not reuse the shorter, faster Banking Prelims contract.

Recent paper analyses show mains RC spanning analytical and abstract topics such as social-media use, employment/labour, aviation, philosophy, discipline/advertising and other public-interest or business themes. Set sizes vary by exam and shift, so CP004 does not hardcode one universal question count.

## Passage contract

- 8 original analytical passages
- target length: **450–650 words**
- target structure: **6–8 paragraphs**
- denser argumentation than prelims
- evidence can be distributed across paragraphs
- difficulty comes from scope, inference distance, paragraph relation and close distractors rather than obscure vocabulary

Passage domains:
- economy / labour market
- business / digital markets
- technology / AI
- science / health
- environment / sustainability
- social policy
- philosophy / behaviour
- media / information systems

## Question authority families

- `BM-F01` — Direct but non-trivial detail
- `BM-F02` — Deep inference
- `BM-F03` — Central argument / best summary
- `BM-F04` — Author tone / attitude
- `BM-F05` — Author purpose / rhetorical role
- `BM-F06` — Can / cannot be inferred
- `BM-F07` — Paragraph relation / structural role
- `BM-F08` — Logical conclusion / implication
- `BM-F09` — Contextual phrase / vocabulary
- `BM-F10` — Scope / assumption / evidence distinction

Each passage carries 10 atomic authorities, for **80 governed authorities**. This is an authoring pool, not a claim that every Banking Mains RC set contains ten questions.

## Difficulty contract

- Medium: multi-sentence evidence, local paragraph relation, contextual vocabulary, supported conclusion.
- Hard: cross-paragraph synthesis, scope-sensitive inference, author stance, assumption/evidence distinction.
- Easy is intentionally absent from CP004.

## Distractor contract

Distractors should be close enough to require reading:
- true detail attached to the wrong claim;
- overstatement or understatement;
- reversed cause/effect;
- partial truth with wrong scope;
- plausible outside-world claim unsupported by passage;
- conclusion stronger than evidence;
- tone label close but not precise;
- paragraph role confused with paragraph content.

## Explanation contract

1. state the answer;
2. identify the relevant passage idea/evidence;
3. explain the reasoning link when the answer is inferential.

No option-by-option filler unless ambiguity genuinely requires it.

## Validation

- 8 unique passages;
- 80 unique authorities;
- all 10 families exactly 8 times;
- all 8 domain classes represented;
- 450–650 words and 6–8 paragraphs per passage;
- Medium/Hard only;
- 4 unique options;
- deterministic replay;
- 8,000-question soak;
- no lifecycle leakage.

## Lifecycle

Human approval was recorded on **2026-09-26** against `ENG-008-CP004-REVIEW-V1.md` at reviewed head `1521a943d12b367b19b524500168d00d7f453767`. CP004 is registered in the existing ENG-008 Question Studio package in **review-only** mode. Question Bank writes, scored tests, mocks, learner/public publication, automatic publication and production release remain locked.
