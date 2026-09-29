# ENG-012 Word Swap — CP001–CP002 Review V1

Status: `HUMAN_REVIEW_PENDING__QUESTION_STUDIO_REVIEW_ONLY`

## Implemented

### CP001 — SSC Standard Word Swap
- 24 human-authored authority patterns.
- Easy/Medium emphasis.
- Four marked words.
- One clearly intended swap.
- Everyday exam-style contexts: school, transport, public services, safety, water, electricity, digital safety, queues, notices and basic civic situations.

### CP002 — SSC Advanced Word Swap
- 24 human-authored authority patterns.
- Medium/Hard emphasis.
- Four marked words.
- Closer semantic/collocational distinctions.
- Analytical contexts: evidence, measurement, policy evaluation, forecasting, automation, surveys, consultation, data, governance, model risk, targets and financial literacy.

## Surface capacity
Each authority has:
- one primary natural lexical set;
- two controlled lexical variants.

Current implemented surface capacity:
- CP001: 24 × 3 = **72**
- CP002: 24 × 3 = **72**
- total = **144 distinct authority/variant surfaces**

Option order is deterministic by seed, so presentation can vary without changing the answer contract.

## Generator contract
For every item:
1. start from a known correct sentence;
2. interchange the authority-defined word pair;
3. label the four displayed target positions A–D;
4. ask the learner which pair should be swapped;
5. provide four unique pair options;
6. reconstruct and show the corrected sentence in the explanation.

## Explanation style
The explanation:
- states the correct swap;
- identifies the first natural phrase/collocation;
- identifies the second natural phrase/collocation;
- shows the full corrected sentence;
- exposes emphasis cues such as **correct swap**, **natural phrase**, **fits naturally**, and **corrected sentence** for presentation-layer bolding.

## Ownership boundary
ENG-012 does not replace:
- ENG-002 Sentence Improvement;
- ENG-003 Grammar Fillers;
- ENG-010 Para Jumbles;
- ENG-011 Sentence Rearrangement.

The defining skill is positional correction of marked words by interchange.

## Question Studio
Package: `english-eng012-word-swap-v1`

Current implemented checkpoints:
- ENG-012-CP001
- ENG-012-CP002

Planned:
- CP003 Banking Prelims
- CP004 Banking Mains
- CP005 deterministic composer

Review-only lifecycle is retained. Student/public publication remains disabled.

## Source-level guards
- 48 authority patterns.
- 24 per implemented CP.
- unique authority IDs.
- 3 lexical surfaces per authority.
- deterministic replay.
- four unique answer options.
- correct-pair consistency.
- explanation length guard.
- 5,000-seed generation soak source.

No CI/test execution is claimed by this review file.
