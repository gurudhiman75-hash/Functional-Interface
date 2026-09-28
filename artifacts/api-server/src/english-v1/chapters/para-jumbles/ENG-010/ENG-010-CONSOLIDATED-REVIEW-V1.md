# ENG-010 — Para Jumbles — Consolidated Review V1

Status: `HUMAN_REVIEW_PENDING__QUESTION_STUDIO_REVIEW_ONLY`

## Implemented structure

- CP001 — SSC Standard Para Jumbles
- CP002 — SSC Advanced Para Jumbles
- CP003 — Banking Prelims Para Jumbles
- CP004 — Banking Mains Para Jumbles
- CP005 — Full-set composer + Question Studio integration

## V1 authority volume

- CP001: 4 sets
- CP002: 4 sets
- CP003: 4 sets
- CP004: 4 sets
- **Total: 16 original para-jumble sets**

## Question format

Each question:
- presents 5 or 6 labelled sentences;
- asks for the correct paragraph sequence;
- provides four sequence options;
- has one keyed order;
- includes a short explanation identifying the opener and main logical chain.

## Quality controls

- deterministic generation by seed;
- unique complete order per authority;
- plausible permutation distractors;
- no sentence-level grammar ownership overlap;
- no RC/Cloze duplication;
- SSC and Banking profiles separated by complexity;
- CP005 routes deterministically across all four profiles.

## Question Studio

Package:
`english-eng010-para-jumbles-v1`

Lifecycle:
- review-only;
- English only in V1;
- Question Bank writes locked;
- test/mock/public release locked;
- no automatic learner publication;
- human approval pending.

## Review focus

Please check:
1. whether the sentence chains feel like real SSC/Banking para jumbles;
2. whether any set has more than one defensible order;
3. whether distractor orders are sufficiently plausible;
4. whether Banking Mains sets feel materially harder than SSC Standard.
