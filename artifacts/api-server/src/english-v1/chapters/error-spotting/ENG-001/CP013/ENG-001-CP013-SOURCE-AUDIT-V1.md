# ENG-001 CP013 — Common Usage / Idiomatic Grammar — Source Audit V1

Status: `HUMAN_APPROVED__QUESTION_STUDIO_REVIEW_ONLY_REGISTERED__PRODUCTION_LOCKED`

## Blueprint boundary

ENG-BLUEPRINT-001 assigns CP013 to **Common Usage / Idiomatic Grammar** and explicitly lists these competitive-exam patterns:

- prefer X to Y
- senior/junior to
- different from
- capable of
- insist on
- prevent from
- despite / in spite of
- no sooner ... than
- hardly/scarcely ... when

The blueprint also warns that prescriptive conventions vary and therefore requires source auditing before implementation.

CP013 is intentionally narrow. It owns **fixed lexical-grammar / paired-usage conventions** in the forms above. It does not reopen the general preposition system from CP005, general conjunction selection from CP007, gerund/infinitive selection from CP009, modifier placement from CP010, conditional grammar from CP011, or voice/narration from CP012.

## Grammar authority audit

Primary authority used for the implementation design: Cambridge Dictionary / English Grammar Today.

1. **prefer X to Y** — Cambridge Grammar Today documents direct comparisons such as `prefer tea to coffee` and warns against `prefer X than Y`. It separately permits `would prefer ... rather than ...`; CP013 excludes that second construction.
2. **senior/junior to** — Cambridge Advanced/Learner dictionaries record `senior to` and `junior to` for rank/position comparisons. CP013 does not use age expressions such as `ten years his senior`.
3. **different from** — Cambridge notes that `different from` is usual, while `different to` is standard in British usage and `different than` is common in American usage. Therefore CP013 **does not mark `different to/than` as wrong**. The correct surface uses `different from`, but the mutation is an unambiguously invalid form such as `different with`.
4. **capable of** — Cambridge records `capable of something/doing something`. CP013 mutates to clearly excluded `capable to + verb` style forms.
5. **insist on** — Cambridge records `insist on something/doing something` and separately permits `insist that + clause`. CP013 only tests the noun/-ing complement construction and never rejects a valid that-clause.
6. **prevent ... from -ing** — Cambridge records the explicit pattern `prevent someone/something from doing`. It also shows that `from` can be omitted in some British usage. CP013 therefore never keys simple omission of `from`; it mutates to an excluded to-infinitive construction such as `prevent them to enter`.
7. **despite / in spite of** — Cambridge Grammar Today explicitly distinguishes `despite + noun/-ing` from `in spite of + noun/-ing` and rejects `despite of`.
8. **no sooner ... than** — Cambridge Grammar Today records `no sooner ... than` and fronted inversion such as `No sooner had ... than ...`.
9. **hardly/scarcely ... when** — Cambridge Grammar Today records immediate-succession `hardly/scarcely ... when`, including fronted inverted forms.

Reference pages consulted:
- https://dictionary.cambridge.org/grammar/british-grammar/prefer
- https://dictionary.cambridge.org/dictionary/english/senior
- https://dictionary.cambridge.org/dictionary/english/junior-to
- https://dictionary.cambridge.org/grammar/british-grammar/different-from-different-to-or-different-than
- https://dictionary.cambridge.org/dictionary/english/capable-of
- https://dictionary.cambridge.org/dictionary/english/insist-on
- https://dictionary.cambridge.org/grammar/british-grammar/word-patterns-prevent
- https://dictionary.cambridge.org/grammar/british-grammar/in-spite-of-and-despite
- https://dictionary.cambridge.org/grammar/british-grammar/no-sooner
- https://dictionary.cambridge.org/grammar/british-grammar/hardly
- https://dictionary.cambridge.org/grammar/british-grammar/scarcely

## Competitive-exam pattern audit

The target SSC/Banking-style error-spotting pattern is a short natural sentence divided into four parts, with one deterministic usage error. CP013 therefore uses the existing ENG-001 QL001 / QL002 / QL007 family rather than inventing a special idiom question format.

The implementation avoids old coaching-book traps whose status depends on dialect or stylistic preference. A question is admitted only when the incorrect form is excluded by the controlled construction above.

## Rule and mutation inventory

| Rule | Controlled usage | Mutation |
| --- | --- | --- |
| GR-USG-001 | prefer X to Y | MUT-USG-PREFER-TO-001 |
| GR-USG-002 | senior/junior to | MUT-USG-SENIOR-JUNIOR-TO-001 |
| GR-USG-003 | conservative exam surface `different from` | MUT-USG-DIFFERENT-FROM-001 |
| GR-USG-004 | capable of + noun/-ing | MUT-USG-CAPABLE-OF-001 |
| GR-USG-005 | insist on + noun/-ing | MUT-USG-INSIST-ON-001 |
| GR-USG-006 | prevent + object + from + -ing | MUT-USG-PREVENT-FROM-001 |
| GR-USG-007 | despite / in spite of | MUT-USG-DESPITE-IN-SPITE-001 |
| GR-USG-008 | no sooner ... than | MUT-USG-NO-SOONER-THAN-001 |
| GR-USG-009 | hardly/scarcely ... when | MUT-USG-HARDLY-WHEN-001 |

## Difficulty design

- **Easy:** short direct usage, nearby trigger and complement, low lexical load.
- **Medium:** longer workplace/public-service sentences, intervening phrases, less visually obvious complement boundaries.
- **Hard:** formal or inverted constructions, greater dependency distance, longer but still natural sentence surfaces.

All nine rules appear in Easy, Medium and Hard. The authored review corpus contains **60 scenes: 20 Easy + 20 Medium + 20 Hard**, with exact QL001 answer-position balance A/B/C/D = 5/5/5/5 at each difficulty.

## Explanation standard

Every explanation must:
- identify the actual usage in the sentence;
- state the required fixed pattern in simple language;
- show the full corrected sentence;
- avoid option-by-option analysis and test-taking jargon.

## Lifecycle

CP013 received explicit human editorial approval on 2026-09-14. The exact approved review artifact is pinned by SHA-256 in `eng-001-cp013-human-approval-v1.ts`, and the checkpoint is registered in Question Studio **review-only** under `ENG-001-CP013-HUMAN-EDITORIAL-APPROVAL-V1`. Question Bank writes, test/mock eligibility, public publication, automatic learner delivery and production release remain locked.
