# ENG-012 Word Swap — Production Volume 450 — Review V2

Status: `HUMAN_REVIEW_PENDING__QUESTION_STUDIO_REVIEW_ONLY`

## Production scale

| Profile | Previous | Added | Active |
|---|---:|---:|---:|
| SSC Standard | 24 | 96 | **120** |
| SSC Advanced | 24 | 96 | **120** |
| Banking Prelims | 24 | 76 | **100** |
| Banking Mains | 24 | 86 | **110** |
| **Total** | **96** | **354** | **450** |

Each authority retains one primary lexical set plus two controlled variants.

**Total controlled lexical surfaces: 1,350.**

## Expansion method

SSC expansion adds 32 authored semantic families:
- 16 SSC Standard;
- 16 SSC Advanced;
- six controlled swap positions per family.

Banking expansion reuses the already-reviewed 48 Banking sentence families and activates additional interchange positions from those same natural sentences. This increases positional variety without introducing thin finance prose merely for volume.

## Generator

Question Studio now uses ENG-012 V2:
- active pool = 450 authorities;
- deterministic surface selection;
- deterministic option ordering;
- four unique pair options;
- full corrected sentence in explanation;
- structured explanation emphasis cues;
- CP005 composer still selects across all four profiles.

## Production guards

Source tests check:
- exact counts 120 / 120 / 100 / 110;
- 450 unique authority IDs;
- 1,350 controlled surfaces;
- every authority has two lexical variants;
- displayed sentence differs from corrected sentence;
- correct pair is present and indexed correctly;
- deterministic replay;
- four unique options;
- all CP005 profiles;
- 20,000-seed soak source.

No CI/test execution is claimed by this review file.


## No-correction mix

ENG-012 now includes a controlled no-correction form.

- **45 of 450 authorities** (~10%) are designated as already-correct questions.
- Profile distribution: **12 SSC Standard / 12 SSC Advanced / 10 Banking Prelims / 11 Banking Mains**.
- These questions display the natural sentence without swapping any marked words.
- Their correct answer is **No correction required**.
- Swap-required questions continue to have a genuine interchange pair as the correct answer.
- The no-correction option is therefore semantically real, not a random decorative distractor.

Source guards verify that:
- no-correction items display exactly the corrected sentence;
- swap-required items display a genuinely misplaced pair;
- all four options remain unique.
