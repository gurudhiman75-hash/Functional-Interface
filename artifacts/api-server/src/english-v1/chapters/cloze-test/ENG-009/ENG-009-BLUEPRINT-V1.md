# ENG-009 — Cloze Test / Cloze Passage — Blueprint V1

Status: `IMPLEMENTATION_IN_PROGRESS__REVIEW_ONLY`

## Ownership

ENG-009 owns passage-based deleted-word / cloze sets.

It does **not** duplicate:
- ENG-003 standalone grammar fillers;
- ENG-008 ordinary Reading Comprehension;
- ENG-008 CP007 Banking-Prelims RC-internal word-fit.

## Exam-profile design

### CP001 — SSC Standard Cloze
- short coherent passage;
- five numbered blanks;
- one question per blank;
- four options;
- mixed grammar, vocabulary, collocation and context;
- blanks must interact with passage meaning rather than behave like five unrelated single-sentence fillers.

### CP002 — SSC Advanced Cloze
- denser passage and closer distractors;
- five blanks;
- stronger collocation, discourse and contextual-vocabulary discrimination;
- medium/hard emphasis.

### CP003 — Banking Prelims Cloze
- 5–7 blanks;
- longer passage than SSC foundation;
- grammar + vocabulary + phrase/context fit;
- time-sensitive but passage-governed.

### CP004 — Banking Mains Cloze
- 5–6 blanks;
- editorial/economy/business/social-policy passages;
- phrase/phrasal-word and multiword fit where justified;
- medium/hard only.

### CP005 — Mixed / New-pattern Cloze
- reviewed multi-task forms found in banking papers;
- phrase-level blank, contextual pair fit and controlled multiword replacement;
- admitted only where the whole passage remains the authority.

### CP006 — Full-set composer
- deterministic linked-set generation;
- one shared passage;
- exact blank masking;
- no duplicate or fabricated authorities.

## Core quality rules

- Every passage must read naturally after all keyed answers are restored.
- A blank must have one clearly best answer in passage context.
- Distractors must be grammatical/plausible enough to require reading, not obviously malformed.
- The keyed word may not be visible elsewhere in a way that gives away the answer.
- Explanations identify the local clue and the passage-level reason.
- No copied public passages; source evidence defines format only.
- Question Studio remains review-only until explicit human approval.

## Volume principle

Cloze benefits from passage variety. Volume is not hard-capped, but expansion is accepted only while new passages remain distinct in topic, discourse structure, blank logic and distractor pattern.
