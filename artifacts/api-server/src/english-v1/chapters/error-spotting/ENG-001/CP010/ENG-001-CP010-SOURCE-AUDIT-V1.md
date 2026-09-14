# ENG-001 CP010 — Modifiers — Source Audit V1

Status: `REVIEW_CANDIDATE_V1__HUMAN_REVIEW_PENDING__NOT_QUESTION_STUDIO_REGISTERED`

## Blueprint ownership

The English blueprint requires CP010 to cover modifier placement, specifically misplaced modifiers, dangling modifiers, adverb placement, `only` / `almost` / `even`, and participial phrase attachment.

CP010 owns **placement and attachment**. It does not retest the underlying adjective/adverb form choice already owned by CP006, gerund/infinitive/participle form selection owned by CP009, relative-pronoun case/selection owned by CP004, conjunction structure owned by CP007, or preposition choice owned by CP005.

## Source-audit inputs

The rule inventory was checked against:
- British Council LearnEnglish, **Participle clauses** — participle clauses normally share their understood subject with the main clause;
- British Council LearnEnglish, **Where adverbials go in a sentence** — neutral positions for frequency and manner adverbials;
- Cambridge English Grammar Today, **Even** — ordinary mid-position and focus placement of `even`;
- competitive-exam modifier questions surfaced from Testbook, including official-paper style items testing dangling/misplaced introductory modifiers and proximity of modifiers to the noun they describe.

The source audit is used for coverage and exam pattern calibration only. The CP010 scenes are independently authored.

## Rule inventory

1. `GR-MOD-001` — introductory present-participle attachment
2. `GR-MOD-002` — introductory perfect/passive participle attachment
3. `GR-MOD-003` — introductory adjective/descriptive phrase attachment
4. `GR-MOD-004` — relative-clause proximity to intended antecedent
5. `GR-MOD-005` — `only` focus placement
6. `GR-MOD-006` — `almost` / `nearly` scope placement
7. `GR-MOD-007` — `even` in ordinary negative auxiliary/perfect constructions
8. `GR-MOD-008` — frequency-adverb placement
9. `GR-MOD-009` — manner-adverb placement with a direct object
10. `GR-MOD-010` — participial/restrictive postmodifier proximity

## Mutation inventory

- `MUT-MOD-DANGLING-PRESENT-001`
- `MUT-MOD-DANGLING-PERFECT-001`
- `MUT-MOD-DANGLING-PHRASE-001`
- `MUT-MOD-RELATIVE-PROXIMITY-001`
- `MUT-MOD-ONLY-FOCUS-001`
- `MUT-MOD-ALMOST-FOCUS-001`
- `MUT-MOD-EVEN-FOCUS-001`
- `MUT-MOD-FREQUENCY-ADVERB-001`
- `MUT-MOD-MANNER-ADVERB-001`
- `MUT-MOD-PARTICIPLE-PROXIMITY-001`

## Corpus / difficulty design

V1 uses 60 authored semantic scenes: 20 Easy, 20 Medium and 20 Hard. Every rule has two scenes at every difficulty. QL001, QL002 and QL007 are supported.

Difficulty is structural rather than lexical:
- **Easy:** short dependency distance and one immediately visible attachment/focus cue.
- **Medium:** extra phrases or competing nearby nouns, while the intended modifier target stays unique.
- **Hard:** longer clauses, realistic administrative/technical prose and longer dependency distance, without obscure vocabulary or multiple grammar defects.

The authored QL001 source answers are exactly balanced at every difficulty: A=5, B=5, C=5, D=5.

## Ambiguity controls

- dangling-modifier scenes use a human/agent action that the incorrect grammatical subject cannot logically perform;
- `only` scenes include an explicit contrast fixing the intended scope;
- `almost` / `nearly` scenes use quantity or degree expressions rather than free stylistic alternatives;
- `even` scenes use neutral `had not even + past participle` style rather than marked contrastive readings;
- relative and participial proximity scenes use concrete properties that identify one intended noun;
- manner/frequency scenes exclude literary or deliberately emphatic word order.

## Explanation standard

Explanations identify the sentence-specific modifier target, state why the visible placement is wrong, and show the full corrected sentence. They do not contain option-by-option analysis, shortcuts, traps or test-taking jargon.

## Runtime lifecycle

CP010 V1 is a human-review candidate only. It is not registered in Question Studio and cannot write to Question Bank, enter tests/mocks, publish publicly, reach learners automatically, or obtain production-release status.

Any defect found in review must be fixed in the rule/scene/generator source and the review artifact regenerated. Human approval is required before Question Studio review-only registration or merge to `New-main`.
