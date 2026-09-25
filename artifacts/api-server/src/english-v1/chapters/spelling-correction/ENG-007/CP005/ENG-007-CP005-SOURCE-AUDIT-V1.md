# ENG-007-CP005 — Gap-Audit Expansion — Source & Coverage Audit V1

Status: `HUMAN_APPROVED__REVIEW_ONLY__QUESTION_STUDIO_BLOCKED_UNTIL_CHAPTER_APPROVAL`

## Why this checkpoint exists

CP005 is not quota-driven. It was produced from a breadth audit of the **1,020 approved spellings** in CP001-CP004 against the larger curated English vocabulary authorities already present in the repository.

The audit retained an uncovered word only when it had **at least two independent spelling-risk features**, such as:
- doubled letters;
- `ie/ei` sequences;
- silent/complex consonant clusters;
- difficult vowel clusters or vowel runs;
- confusable suffix/endings;
- `-cede/-ceed/-sede` patterns;
- long-form orthographic complexity.

Technical and specialist domains already substantially represented in CP004 were excluded from this pass unless the word also belonged to a broader competitive-exam vocabulary category.

## Result

- **265 new governed spellings** emerged from the audit.
- Difficulty was assigned from spelling complexity, not forced into equal buckets:
  - Easy: **26**
  - Medium: **181**
  - Hard: **58**
- These 265 spellings are deduplicated against CP001-CP004.
- Every generated misspelling is blocked from colliding with any canonical spelling across CP001-CP005.

## Source authorities

Canonical words are snapshotted from the already-curated:
- ENG-004 Synonyms & Antonyms lexical authorities; and
- ENG-006 One-word Substitution categorized lexical authorities.

These sources provide the candidate vocabulary; CP005 applies independent spelling-risk and duplicate filters before inclusion.

## Question surfaces

1. Correctly spelt word: exactly one correct option plus three misspelt options of comparable difficulty.
2. Incorrectly spelt word: three correctly spelt options plus one misspelt keyed answer.

## Lifecycle

Review-only. Question Studio registration and all downstream release surfaces remain blocked until explicit human approval. CP006 is not assumed; it will be created only if the post-CP005 breadth audit still finds material exam-relevant gaps.
