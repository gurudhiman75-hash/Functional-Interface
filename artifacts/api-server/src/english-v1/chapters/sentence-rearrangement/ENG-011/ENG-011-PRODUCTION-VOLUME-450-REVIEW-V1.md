# ENG-011 — Production Volume 450 — Review V1

Status: `HUMAN_REVIEW_PENDING__QUESTION_STUDIO_REVIEW_ONLY`

## Active production target reached

ENG-011 now contains **450 active Sentence Rearrangement authority sets**:

| Profile | Existing | Added | Active total |
|---|---:|---:|---:|
| SSC Standard / CP001 | 24 | 96 | **120** |
| SSC Advanced / CP002 | 24 | 96 | **120** |
| Banking Prelims / CP003 | 24 | 76 | **100** |
| Banking Mains / CP004 | 24 | 86 | **110** |
| **Total** | **96** | **354** | **450** |

## Expansion design

The 354 new sets are built from **60 authored topic families**:
- 16 SSC Standard families;
- 16 SSC Advanced families;
- 13 Banking Prelims families;
- 15 Banking Mains families.

Each family is expanded through six controlled sentence structures using:
- subject + verb;
- object/complement;
- time phrase;
- reason clause;
- condition clause;
- contrast/concessive clause;
- purpose phrase;
- place/context phrase.

This expands syntactic breadth without relying on simple word replacement.

## Profile rules

### SSC Standard
- 4 fragments in the new production expansion;
- clear subject–verb–object chains;
- time, reason, condition or purpose attachment;
- Easy/Medium emphasis.

### SSC Advanced
- 5 fragments in the new production expansion;
- denser clause attachment;
- concessive, causal and conditional structures;
- Medium/Hard emphasis.

### Banking Prelims
- 5 fragments in the new production expansion;
- banking, payments, credit, savings and working-capital contexts;
- Medium/Hard emphasis.

### Banking Mains
- 6 fragments in the new production expansion;
- liquidity, capital, stress testing, risk, models, cyber, data, provisioning and governance;
- denser clause chains and modifiers;
- mostly Hard.

## Presentation correction

The generator no longer displays authority fragments in stored logical order.

Every question now:
1. reconstructs the canonical sentence;
2. deterministically shuffles displayed fragments;
3. remaps the correct sequence to displayed A/B/C/... labels;
4. prevents identity answer leakage such as A-B-C-D;
5. produces four unique sequence options.

## Explanation style

Generated explanations are:
- simple and longer;
- step-by-step;
- independent of stored source labels;
- explicit about finding the subject and verb first;
- explicit about attaching the object and time/reason/condition/contrast/purpose phrases;
- followed by the fully reconstructed sentence;
- compatible with structured emphasis cues for selective bolding.

## Structural guards

The source audit now checks:
- exactly **450 active sets**;
- profile counts **120 / 120 / 100 / 110**;
- exactly **354** production-expansion sets;
- unique IDs;
- unique fragment signatures;
- profile-appropriate fragment counts;
- deterministic replay;
- four unique answer options;
- correct-option remapping;
- no identity displayed answer order;
- longer explanation output;
- emphasis cues present;
- **10,000-seed soak source**.

Question Studio metadata reports 450 authority sets and remains review-only.

No CI/test execution is claimed by this review document.
