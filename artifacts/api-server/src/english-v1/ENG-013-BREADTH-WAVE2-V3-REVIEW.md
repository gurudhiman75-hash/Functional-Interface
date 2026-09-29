# ENG-013 Word Usage — Breadth Wave 2 V3 Review

Status: `APPROVED__FORWARD_PORT_AND_MERGE`

## Scale after Wave 2

| Profile | V2 Active | Wave 2 Added | V3 Active |
|---|---:|---:|---:|
| SSC Standard | 60 | 36 | **96** |
| SSC Advanced | 60 | 36 | **96** |
| Banking Prelims | 60 | 36 | **96** |
| Banking Mains | 60 | 36 | **96** |
| **Total** | **240** | **144** | **384** |

## Breadth principle

Wave 2 adds another **144 distinct authorities**:
- 36 SSC Standard
- 36 SSC Advanced
- 36 Banking Prelims
- 36 Banking Mains

The wave was audited against all prior ENG-013 banks. Avoidable overlaps introduced in Wave 2 were removed before activation.

Pre-existing V1 cross-profile repeats remain where the same word is intentionally tested under a different exam context.

## Coverage added

### SSC Standard
adhere, amend, attain, avert, cease, circulate, consolidate, constitute, coordinate, defer, deploy, diminish, enforce, formulate, furnish, initiate, interpret, prescribe, nominate, obtain, prioritize, ratify, reclaim, reinstate, scrutinize, suspend, validate, undertake, utilize, withhold, resume, revoke, archive, mobilize, streamline, stipulate.

### SSC Advanced
cogent, cursory, definitive, exhaustive, feasible, inferential, incongruous, indispensable, manifest, meticulous, objective, ostensible, paradoxical, pervasive, pragmatic, provisional, reciprocal, rigorous, skeptical, superficial, tangible, transient, unequivocal, volatile, analogous, ancillary, categorical, commensurate, contextual, disparate, immutable, incidental, orthodox, predicated, qualitative, retrospective.

### Banking Prelims
overdraft, mortgage, guarantor, borrower, lender, repayment, prepayment, disbursal, endorsement, dormant, recurring, transaction, merchant, issuer, acquirer, chargeback, coupon, denomination, payee, drawee, drawer, clearing, escrow, annuity, moratorium, custodian, depository, routing, cashback, interchange, grace, penalty, statement, passbook, remittance, clearance.

### Banking Mains
arbitrage, benchmark, covenant, spread, slippage, drawdown, dilution, gearing, solvency, liquidation, bankruptcy, resolution, bail-in, recapitalization, write-down, provisioning, coverage, correlation, diversification, swap, forward, futures, option, discount, par, notional, novation, countercyclical, macroprudential, microprudential, intermediation, wholesale, recovery, haircut-adjusted, loss-given-default, probability-of-default.

## Architecture

Question Studio uses ENG-013 V3:
- 384 active authorities;
- 96 per owning CP;
- deterministic authority selection;
- deterministic option shuffle/remap;
- correct-usage and incorrect-usage formats;
- CP005 composer across all four profiles;
- review-only lifecycle unchanged.

## Guards

V3 source tests cover:
- exact 96/96/96/96 profile counts;
- 384 unique authority IDs;
- 144 Wave-2 authorities;
- 144 distinct target words inside Wave 2;
- four unique sentence options per authority;
- deterministic replay;
- valid answer remapping;
- CP005 composer coverage;
- 30,000-seed soak source.

No CI/test execution is claimed by this review file.
