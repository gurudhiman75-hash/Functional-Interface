# ENG-001 CP011 — Conditionals — Source Audit V1

**Checkpoint:** ENG-001-CP011  
**Status:** REVIEW CANDIDATE DESIGN INPUT  
**Scope:** Error Spotting / Sentence Error Detection  
**Question families:** ENG-001-QL001, ENG-001-QL002, ENG-001-QL007

## Blueprint requirement

ENG-BLUEPRINT-001 requires each checkpoint to have a source audit, rule inventory, sentence-pattern inventory, mutation inventory, difficulty mapping, explanation logic, validators, a representative human-review batch, defect correction and Question Studio compatibility before completion.

CP011 is limited to **conditional grammar**. It does not take ownership of general tense errors already covered by CP002, conjunction selection already owned by CP007, non-finite verb complements from CP009, or modifier placement from CP010.

## Sources inspected

1. British Council LearnEnglish — *Conditionals: zero, first and second*  
   https://learnenglish.britishcouncil.org/free-resources/grammar/b1-b2/conditionals-zero-first-second
2. British Council LearnEnglish — *Conditionals: third and mixed*  
   https://learnenglish.britishcouncil.org/free-resources/grammar/b1-b2/conditionals-third-mixed
3. Testbook — competitive-exam item using **unless** in a conditional sentence (ACC 123 ICE Part-I, Aug 2020)  
   https://testbook.com/question-answer/choose-the-correct-conjunction-from-the-given-opti--604f1ef21550f5bb2dcd68d7

The external examples were used only to audit rule coverage and exam presentation. CP011 sentences are independently authored.

## Coverage findings

| Rule | Coverage target | Key learner-visible contrast | Ambiguity guard |
|---|---|---|---|
| GR-CND-001 | Zero conditional / standing rule | present general condition vs inappropriate past/hypothetical form | Explicit rule, regular-behaviour or whenever meaning |
| GR-CND-002 | First conditional result | real future `will/can/may` result vs unreal `would` | Condition must be genuinely possible |
| GR-CND-003 | Neutral future reference inside if-clause | present simple vs `will` in the condition | No willingness, insistence or volitional `will` |
| GR-CND-004 | Second conditional | unreal present/future: past condition + `would/could` result | Context must be clearly hypothetical |
| GR-CND-005 | Third conditional | past perfect condition + perfect conditional result | Both events anchored in the past |
| GR-CND-006 | Mixed past → present | past-perfect condition + present unreal result | Explicit `now/today` cue |
| GR-CND-007 | Mixed present → past | continuing unreal state + past unreal result | Stable state/characteristic + past result cue |
| GR-CND-008 | Unless | `unless + positive clause` for a single negative condition | Extra negative must clearly reverse intended meaning |
| GR-CND-009 | `Had` inversion | `Had + subject + past participle` | Mutation targets inversion itself |
| GR-CND-010 | `Should/Were` inversion | formal inversion without `if` | No stylistic keys; mutation creates structurally invalid `if should/if were` |

## Deliberate exclusions

- **Was vs were** by itself is not keyed. Contemporary standard English allows variation in some second-conditional contexts, and the British Council explicitly notes common `was` usage. CP011 uses `were` where natural but does not make ordinary `was` the sole error.
- **If + will** is keyed only for neutral future reference. Volitional or willingness uses are excluded.
- Conditional linkers such as `provided that`, `as long as`, `even if` and `in case` are not used as synonym-selection traps here because that would overlap CP007 and introduce semantic ambiguity.
- Counterfactual meaning is never inferred from obscure vocabulary alone; temporal and factual cues must carry the distinction.

## Difficulty model

**Easy:** short clauses, direct time cues, one obvious conditional dependency.  
**Medium:** longer noun phrases, passive forms, embedded reporting and wider dependency distance.  
**Hard:** mixed temporal relations, institutional contexts, passive/perfect forms, formal inversion and longer but still natural exam-style sentences.

Lexical obscurity is not used to manufacture difficulty.

## Corpus and presentation contract

- 60 authored semantic scenes.
- 20 Easy / 20 Medium / 20 Hard.
- Exactly 2 scenes per rule at each difficulty.
- QL001 source answer positions are exactly balanced at each difficulty: A=5, B=5, C=5, D=5.
- QL002 merges a non-keyed boundary and retains exactly one keyed error.
- QL007 exposes the canonical correct sentence and keys **No error**.
- Every explanation names the sentence-specific conditional relation and prints the complete corrected sentence.
- Runtime status remains `REVIEW_CANDIDATE_V1__HUMAN_REVIEW_PENDING__NOT_QUESTION_STUDIO_REGISTERED`.

## Review gate

Human review must reject any scene that:
- permits two reasonable conditional readings,
- relies on a debatable prescriptive preference,
- sounds written for a grammar textbook rather than a competitive exam,
- contains a secondary grammar error,
- has an explanation that merely states a formula without applying it to the actual sentence.

Any repeated defect must be corrected in the rule/corpus/generator source and the review batch regenerated.
