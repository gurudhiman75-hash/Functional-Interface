# ENG-010 / ENG-011 — Closure Audit V1

Status: `CLOSURE_CANDIDATE__HUMAN_REVIEW_PENDING`

## ENG-010 Para Jumbles
- 450 active authority sets.
- SSC Standard 120; SSC Advanced 120; Banking Prelims 100; Banking Mains 110.
- SSC active format fixed at four complete sentences.
- Banking keeps longer 5–6 sentence sets.
- Deterministic presentation shuffle prevents source-order answer leakage.
- Four unique answer options are enforced.
- Longer/simple explanations and structured emphasis cues are present.
- Production test source contains a 10,000-seed soak.
- The New-main TypeScript syntax regression was repaired separately before this closure pass.

### Closure result
No additional content-volume work is required before freeze. Future work should be quality replacement only: retire an ambiguous/formulaic set and replace it one-for-one rather than increasing volume blindly.

## ENG-011 Sentence Rearrangement
- 990 active authority sets.
- SSC Standard 264; SSC Advanced 264; Banking Prelims 217; Banking Mains 245.
- Deterministic fragment shuffle/remap prevents identity-order leakage.
- SSC uses 4–5 fragments; Banking reaches 5–6 fragments where appropriate.
- Longer/simple explanations reconstruct the complete sentence.
- Structured emphasis cues are present.
- Ambiguity-risk scanner flags duplicate fragments, weak finite-verb signals, heavy movable-adverbial constructions and suspiciously short fragments.
- Test source requires zero duplicate logical fragments and includes a 20,000-seed soak.

### Closure result
990 is treated as saturation. Do not force 1,000 with filler items. Future ENG-011 work should be ambiguity replacement or genuine missing-structure work only.

## Lifecycle
Both packages remain Question Studio review-only. This audit does not authorize student/public publication.
