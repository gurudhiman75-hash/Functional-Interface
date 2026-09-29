# ENG-013 Word Usage — Doubling to 768 — V4 Review

Status: `HUMAN_REVIEW_PENDING__QUESTION_STUDIO_REVIEW_ONLY`

## Scale

| Profile | Before V4 | Added | Active |
|---|---:|---:|---:|
| SSC Standard | 96 | 96 | **192** |
| SSC Advanced | 96 | 96 | **192** |
| Banking Prelims | 96 | 96 | **192** |
| Banking Mains | 96 | 96 | **192** |
| **Total** | **384** | **384** | **768** |

## Doubling-wave rule

The V4 expansion is a true breadth pass:
- **384 new authorities**
- **384 distinct target words inside V4**
- no duplicate target word inside the doubling wave
- collocation/preposition/governed-usage traps instead of nonsense sentences
- SSC and Banking profile ownership retained

The existing V1–V3 bank remains intact underneath V4.

## V4 architecture

New helper:
`eng-013-breadth3-factory-v4.ts`

Each compact breadth record stores:
- target word;
- one sentence template;
- four competing contextual/collocational forms;
- one intended correct usage;
- concise explanation.

This avoids repetitive boilerplate while preserving explicit human-reviewed word-level control.

## Coverage direction

### SSC Standard
Formal usage, governed prepositions, public-administration and everyday exam English:
abide by, accountable for, accustomed to, conform to, refrain from, comply with, appeal to, entrust to, subscribe to, warn against, and many more.

### SSC Advanced
Higher-order usage and semantic precision:
averse to, conducive to, devoid of, replete with, tantamount to, germane to, inimical to, cogent, cursory, definitive, pervasive, pragmatic, unequivocal, analogous, commensurate, predicated on, etc.

### Banking Prelims
Retail banking, lending, card/payment, deposit and account usage:
credit, debit, remittance, overdraft, instalment, beneficiary, collection, routing, compounding, credit line, surcharge, hypothecation, accrual, drawal, posting, etc.

### Banking Mains
Markets, risk, capital, regulation, structured finance and resolution usage:
exposure, duration, convexity, spread, hedge, margin, haircut, netting, solvency, bail-in, securitization, tranche, macroprudential, countercyclical, intermediation, rehypothecation, waterfall, clawback, loss-given-default, probability-of-default, etc.

## Question Studio

Question Studio now uses ENG-013 V4:
- 768 active authorities;
- 192 per owning CP;
- CP005 composer retained;
- deterministic authority selection;
- deterministic option shuffle/remap;
- review-only lifecycle unchanged.

## Source guards

The V4 test source requires:
- 768 active authorities;
- 192 per profile;
- 384 V4 authorities;
- 384 unique V4 target words;
- 768 unique authority IDs;
- four unique sentences/options per authority;
- deterministic replay;
- answer remapping correctness;
- all CP005 profiles;
- 30,000-seed soak source.

No CI/test execution is claimed by this review file.
