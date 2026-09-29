# ENG-013 Word Usage — Breadth Extension V2 Review

Status: `HUMAN_REVIEW_PENDING__QUESTION_STUDIO_REVIEW_ONLY`

## Scale

| Profile | Previous | Added | Active |
|---|---:|---:|---:|
| SSC Standard | 24 | 36 | **60** |
| SSC Advanced | 24 | 36 | **60** |
| Banking Prelims | 24 | 36 | **60** |
| Banking Mains | 24 | 36 | **60** |
| **Total** | **96** | **144** | **240** |

## What changed

This is a **breadth extension**, not a rewrite-volume pass.

The new wave adds **144 distinct target words**:
- 36 SSC Standard;
- 36 SSC Advanced;
- 36 Banking Prelims;
- 36 Banking Mains.

The breadth-only bank contains no duplicate target words.

The original V1 bank already had a small number of intentional cross-profile repeats where the same word is tested in a different exam context. Those historical authorities are retained.

## Coverage added

### SSC Standard
Formal/public-administration and everyday exam vocabulary:
comply, facilitate, endorse, postpone, inspect, preserve, acquire, impose, deter, revise, enhance, exceed, accommodate, prohibit, acknowledge, commence, terminate, designate, implement, convene, disclose, clarify, regulate, conserve, transmit, detect, assess, notify, compile, dispatch, rectify, waive, procure, exempt, monitor, authorize.

### SSC Advanced
Higher-context vocabulary and semantic precision:
nuanced, tenable, salient, implicit, empirical, anomalous, cumulative, coincidental, conclusive, tentative, intrinsic, extraneous, proportional, negligible, systematic, sporadic, viable, redundant, inherent, conditional, compatible, peripheral, substantive, derivative, opaque, equivocal, corroborate, circumvent, delineate, reconcile, invalidate, preclude, qualify, replicate, articulate, substantiate.

### Banking Prelims
Retail banking / lending / payment vocabulary:
accrue, remit, pledge, encash, disburse, foreclose, collateral, delinquent, solvent, overdraw, nominee, tenure, instalment, beneficiary, mandate, authenticate, liability, arrears, principal, premium, deduct, freeze, waiver, sanction, appraise, amortize, liquidity, rollover, encumber, settlement, encumbrance, repossess, maturity, restructure, sweep, lien.

### Banking Mains
Financial-markets / risk / regulation vocabulary:
counterparty, haircut, duration, convexity, provision, write-off, securitize, tranche, hedge, basis, capitalization, impairment, mark-to-market, contagion, leverage, deleveraging, ring-fence, forbearance, systemic, roll-off, haircutting, netting, revaluation, mismatch, runoff, collateralization, waterfall, clawback, seniority, subordination, nonperforming, rehypothecation, disintermediation, procyclical, fungible, idiosyncratic.

## Architecture

Question Studio now uses ENG-013 V2:
- 240 active authorities;
- 60 per owning CP;
- deterministic authority selection;
- deterministic option shuffle/remap;
- correct/incorrect usage forms retained;
- CP005 composer retained across all four profiles;
- review-only lifecycle unchanged.

## Quality gates

Source checks cover:
- exact 60/60/60/60 profile counts;
- 240 unique authority IDs;
- 144 breadth authorities;
- 144 unique target words inside the breadth wave;
- four unique sentences per authority;
- deterministic replay;
- valid answer remapping;
- CP005 profile coverage;
- 20,000-seed soak source.

Editorial review should still reject any item where the wrong usage is answerable purely because the sentence is nonsensical rather than because the learner understands the target word.

No CI/test execution is claimed by this review file.
