# ENG-011 — Saturation Pass — 990 Active Sets

Status: `HUMAN_REVIEW_PENDING__QUESTION_STUDIO_REVIEW_ONLY`

## Why 990 instead of forcing 1,000

The production pool stops at **990 active sets**. The remaining ten were deliberately not manufactured only to reach a round number.

The +540 saturation wave comes from nine additional syntactic structures applied across the existing 60 authored semantic theme families.

## Active totals

| Profile | Previous | Added | New active total |
|---|---:|---:|---:|
| SSC Standard / CP001 | 120 | 144 | **264** |
| SSC Advanced / CP002 | 120 | 144 | **264** |
| Banking Prelims / CP003 | 100 | 117 | **217** |
| Banking Mains / CP004 | 110 | 135 | **245** |
| **Total** | **450** | **540** | **990** |

## New structural coverage

The saturation wave extends beyond the original 450-set constructions with additional combinations of:
- subject + finite verb + object;
- fronted reason clauses;
- fronted conditions;
- concessive clauses;
- time phrases;
- place/context phrases;
- purpose phrases;
- reason/purpose combinations;
- condition/place combinations;
- contrast/time combinations;
- multi-clause Banking Mains arrangements.

SSC Standard now legitimately includes both **4-part and 5-part** rearrangement items.
SSC Advanced and Banking Prelims use **4–5 parts**.
Banking Mains uses **5–6 parts**.

## Existing presentation safeguards retained

Every generated question:
1. reconstructs the canonical sentence;
2. deterministically shuffles displayed fragments;
3. remaps the correct answer to displayed labels;
4. prevents identity-order leakage;
5. produces four unique answer sequences.

## Explanations

Explanations remain learner-friendly:
- identify the subject and verb first;
- attach the object;
- explain where time/reason/condition/contrast/place/purpose phrases fit;
- show the fully reconstructed sentence;
- expose structured emphasis cues for selective bolding.

## Ambiguity-risk audit

A new static ambiguity scanner flags:
- duplicate fragments;
- missing finite-verb signals;
- three or more movable adverbial/clausal fragments;
- suspiciously short fragments.

These flags create a human-review shortlist rather than pretending that grammar ambiguity can be proved mechanically.

The test source requires **zero duplicate logical fragments** across all active sets.

## Structural guards

The ENG-011 audit source now checks:
- **990** active sets;
- profile totals **264 / 264 / 217 / 245**;
- +540 saturation count **144 / 144 / 117 / 135**;
- unique authority IDs;
- unique complete fragment signatures;
- profile-appropriate fragment counts;
- deterministic replay;
- four unique options;
- non-identity displayed answers;
- longer explanations;
- explanation emphasis cues;
- ambiguity scanner coverage;
- **20,000-seed** generation soak source.

Question Studio metadata reports **990 authority sets** and remains review-only.

No CI/test execution is claimed by this document.
