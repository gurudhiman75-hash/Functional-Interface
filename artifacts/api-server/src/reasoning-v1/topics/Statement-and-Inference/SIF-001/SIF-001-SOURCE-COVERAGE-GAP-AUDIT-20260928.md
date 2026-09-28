# SIF-001 — Source Coverage and Gap Audit

Status: **GAP FOUND — BANKING THREE-INFERENCE PRESENTATION**

Date: 2026-09-28

## Scope

This audit compares the frozen 17-pack Statement & Inference engine against recurring target-exam presentation and reasoning forms.

Novelty is excluded. This is conventional source/PYQ-style coverage only.

## Existing semantic coverage

The 17 frozen content packs already cover the major inference mechanisms needed by the chapter:

- direct fact support;
- dual inference evaluation;
- quantifiers;
- comparisons;
- suggestive reasons;
- purpose/intention;
- negative and restrictive wording;
- contextual synthesis;
- numerical/data comparison;
- conditional direction;
- multiple-factor synthesis;
- support threshold / possible-vs-supported boundary;
- sample/population scope;
- temporal order without causal overreach;
- bounded position/attitude;
- advanced paragraph inference;
- mixed quantifier/conditional/scope inference.

The existing engine also already covers the main controlled distractor families such as overgeneralisation, excessive certainty, reversed relationship, causal assumption, scope change, quantity distortion, time distortion, unsupported intent, common knowledge, partial support and stronger claim.

## Recent source-pattern comparison

### SSC

Recent SSC inference items continue to use the familiar statement plus two inferences with four answer-code options.

Decision: **COVERED** by the current two-inference renderer.

### Banking

Recent Banking Mains material includes statement/passage questions followed by **three separately numbered inferences** and a five-option combination answer.

Decision: **NOT COVERED** by the current renderer.

The current generator explicitly rejects every format except `TWO_INFERENCES`, even though the type layer already anticipates broader presentation families.

This is a genuine presentation/answer-contract gap, not evidence for a new semantic content pack.

## Gap classification

```text
semantic reasoning family missing:       NO
new permanent CP required:               NO
new presentation/answer contract:        YES
target exam:                             BANKING
required form:                           THREE_INFERENCES
current runtime support:                 ABSENT
source-backed priority:                  HIGH
```

## Required remediation

Add a governed Banking three-inference overlay that:

1. reuses frozen SIF semantic mechanisms rather than inventing a new chapter family;
2. uses curated three-candidate authorities rather than auto-writing a third inference from prose;
3. derives the answer from structured candidate support states;
4. supports five-option Banking combination answers;
5. has English/Hindi/Punjabi parity;
6. retains controlled distractor provenance for every unsupported inference;
7. keeps the current Question Studio/release lifecycle review-only;
8. does not change existing two-inference authorities or their approved freeze;
9. does not count as novelty.

## Single-best-inference forms

Single-best-inference / choose-the-inference questions exist in broader critical-reasoning material, but the present audit does not yet have enough recent target-exam evidence to make them a mandatory V1 SIF gap.

Disposition: **SOURCE WATCH / DO NOT ADD YET**.

## Closure consequence

SIF-001 should **not** be marked conventional-content-complete until the Banking three-inference presentation is implemented, localized and validated.

The existing 17 semantic content packs remain valid and should not be reopened merely to close this presentation gap.
