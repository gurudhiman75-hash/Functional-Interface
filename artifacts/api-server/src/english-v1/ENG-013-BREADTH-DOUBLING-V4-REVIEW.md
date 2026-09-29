# ENG-013 Word Usage — V4 Breadth Doubling Review

Status: `REVIEW_READY__NOT_MERGED`

## Scale

| Profile | V3 | V4 added | V4 total |
|---|---:|---:|---:|
| SSC Standard | 96 | 96 | **192** |
| SSC Advanced | 96 | 96 | **192** |
| Banking Prelims | 96 | 96 | **192** |
| Banking Mains | 96 | 96 | **192** |
| **Total** | **384** | **384** | **768** |

## What this wave adds

- **384 new target words / banking terms**
- **zero intended overlap with V3 target words**
- 96 new authorities in every owning profile
- deterministic option shuffle and answer remapping retained
- CP005 composer retained across all four profiles
- Question Studio remains review-only
- no Question Bank write, mock-test release or learner publication is authorized

## Question construction

### SSC Standard
The target set uses exam-relevant transitive verbs in administrative and formal contexts. Three sentences use the verb with a direct object; the incorrect option inserts an invalid `to + object` pattern.

Examples include:
- abolish
- allocate
- ascertain
- curtail
- disseminate
- nullify
- rescind
- supersede
- verify
- process

### SSC Advanced
The target set expands adjective-level contextual usage. Three options use the word as an adjective; the incorrect option wrongly treats it as a finite verb.

Examples include:
- ambiguous
- coherent
- consequential
- discerning
- equivocal-style higher vocabulary coverage without reusing the V3 target
- impartial
- resilient
- stringent
- unprecedented
- normative

### Banking Prelims
The target set adds everyday banking terminology and customer-facing account/loan/payment vocabulary.

Examples include:
- savings account
- fixed deposit
- credit score
- standing instruction
- UPI
- KYC
- CIBIL score
- hypothecation
- sanction letter
- outstanding balance

### Banking Mains
The target set adds policy, risk, capital, liquidity, market and instrument terminology.

Examples include:
- repo rate
- cash reserve ratio
- liquidity adjustment facility
- yield curve
- capital adequacy ratio
- expected credit loss
- securitization
- credit default swap
- provision coverage ratio
- net NPA ratio

## V4 guards

The V4 source audit asserts:

1. exactly **768 active authorities**;
2. exactly **192 authorities per profile**;
3. exactly **384 V4 additions**;
4. exactly **384 distinct V4 target words/terms**;
5. **no exact target-word/term overlap with V3**;
6. unique authority IDs;
7. four distinct options per authority;
8. deterministic replay;
9. valid answer remapping;
10. CP005 composer coverage;
11. 30,000-seed soak source;
12. Question Studio authority metadata updated from 384 to **768**.

## Lifecycle

`REVIEW_ONLY`

This wave is intentionally not marked human-approved by implementation. Merge should follow editorial approval and green repository checks.
