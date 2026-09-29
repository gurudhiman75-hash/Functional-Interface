# ENG-013 Word Usage — Breadth Wave 2 V3 Review

Status: `HUMAN_REVIEW_PENDING__QUESTION_STUDIO_REVIEW_ONLY`

## Scale

| Profile | After Wave 1 | Wave 2 added | Active |
|---|---:|---:|---:|
| SSC Standard | 60 | 36 | **96** |
| SSC Advanced | 60 | 36 | **96** |
| Banking Prelims | 60 | 36 | **96** |
| Banking Mains | 60 | 36 | **96** |
| **Total** | **240** | **144** | **384** |

Wave 2 contributes **144 distinct target words**.

## Wave 2 coverage

### SSC Standard
adhere, amend, attain, avert, cease, circulate, consolidate, constitute, coordinate, defer, deploy, diminish, enforce, formulate, furnish, initiate, interpret, prescribe, nominate, obtain, prioritize, ratify, reclaim, reinstate, scrutinize, suspend, validate, undertake, utilize, withhold, resume, revoke, archive, mobilize, streamline, stipulate.

### SSC Advanced
cogent, cursory, definitive, exhaustive, feasible, inferential, incongruous, indispensable, manifest, meticulous, objective, ostensible, paradoxical, pervasive, pragmatic, provisional, reciprocal, rigorous, skeptical, superficial, tangible, transient, unequivocal, volatile, analogous, ancillary, categorical, commensurate, contextual, disparate, immutable, incidental, orthodox, predicated, qualitative, retrospective.

### Banking Prelims
overdraft, mortgage, guarantor, borrower, lender, repayment, prepayment, disbursal, endorsement, dormant, recurring, transaction, merchant, issuer, acquirer, chargeback, coupon, denomination, payee, drawee, drawer, clearing, escrow, annuity, moratorium, custodian, depository, routing, cashback, interchange, grace, penalty, statement, passbook, remittance, clearance.

### Banking Mains
arbitrage, benchmark, covenant, spread, slippage, drawdown, dilution, gearing, solvency, liquidation, bankruptcy, resolution, bail-in, recapitalization, write-down, provisioning, coverage, correlation, diversification, swap, forward, futures, option, discount, par, notional, novation, countercyclical, macroprudential, microprudential, intermediation, wholesale, recovery, haircut-adjusted, loss-given-default, probability-of-default.

## Architecture

Question Studio now uses ENG-013 V3:
- 384 active authorities;
- 96 per owning profile;
- deterministic authority selection;
- deterministic option shuffle/remap;
- correct-usage and incorrect-usage forms retained;
- CP005 composer retained;
- review-only lifecycle unchanged.

## Quality controls

Wave 2 was audited against all prior ENG-013 banks.

Three avoidable overlaps found during authoring were removed before activation:
- retain -> archive
- mandate -> prescribe
- derivative -> forward

The original V1 bank still contains a few intentional cross-profile repeats that predate the breadth waves.

Source checks cover:
- exact 96/96/96/96 profile counts;
- 384 unique authority IDs;
- 144 Wave-2 authorities;
- 144 distinct target words inside Wave 2;
- four unique sentence options per authority;
- deterministic replay;
- answer remapping;
- CP005 composer coverage;
- 30,000-seed soak source.

Editorial review should continue to reject any item where the wrong usage is obvious only because the sentence is nonsensical rather than because the target word is understood.

No CI/test execution is claimed by this review file.
