# ENG-012 — Word Swap — Blueprint V1

Status: `IMPLEMENTATION_IN_PROGRESS__REVIEW_ONLY`

## Ownership
ENG-012 owns questions in which two or more marked words are placed in the wrong positions inside an otherwise complete sentence and the learner must identify the swap that restores natural grammar and meaning.

ENG-012 does **not** own:
- sentence improvement or error correction (ENG-002);
- standalone grammar fillers (ENG-003);
- para jumbles (ENG-010);
- fragment/sentence rearrangement (ENG-011);
- vocabulary meaning questions where no positional swap is required.

## Checkpoints
- CP001 — SSC Standard Word Swap: four marked words, one misplaced pair, clear lexical/syntactic fit, Easy/Medium.
- CP002 — SSC Advanced Word Swap: four marked words, closer semantic fit, collocation/reference/argument-structure clues, Medium/Hard.
- CP003 — Banking Prelims Word Swap: business/economy/social contexts, usually one pair, Medium/Hard.
- CP004 — Banking Mains Word Swap: denser editorial/financial sentences; one pair or controlled multi-swap patterns, Hard.
- CP005 — deterministic composer + Question Studio integration.

## Question contract
- The displayed sentence contains four labelled target words: (A), (B), (C), (D).
- Exactly one answer restores the intended natural sentence.
- Standard answer choices use pair labels such as A-B, A-C, B-D plus `No swap required` only when the authority explicitly supports it.
- Distractors must be plausible positional alternatives, not random pairs.
- The correct restored sentence must be stored/reconstructable for explanation.
- No punctuation/capitalisation leakage.

## Explanation style
Use simple language:
1. state the correct swap;
2. explain the first natural collocation/grammatical link;
3. explain the second link;
4. show the corrected sentence.
Key reasoning phrases may be exposed through structured emphasis cues for selective bolding.

## Quality
- Original authored sentences.
- One clearly best swap.
- No pair should produce a second equally natural reading.
- Avoid obscure vocabulary when grammar/collocation is the intended test.
- Review-only until human approval.
