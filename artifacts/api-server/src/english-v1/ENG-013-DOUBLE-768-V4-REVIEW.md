# ENG-013 Word Usage — V4 Doubling Review

Status: `HUMAN_REVIEW_PENDING__QUESTION_STUDIO_REVIEW_ONLY`

## Scale

| Profile | V3 | V4 added | V4 active |
|---|---:|---:|---:|
| SSC Standard | 96 | 96 | **192** |
| SSC Advanced | 96 | 96 | **192** |
| Banking Prelims | 96 | 96 | **192** |
| Banking Mains | 96 | 96 | **192** |
| **Total** | **384** | **384** | **768** |

The V4 doubling wave adds **384 distinct target terms**, 96 per profile.

## V4 authority shape

The new V4 authorities use the **incorrect-usage** form:
- three legitimate contextual/collocational usages;
- one plausible misuse;
- one keyed incorrect sentence;
- concise explanation of the target meaning/collocation.

The earlier V1–V3 bank remains active and continues to provide both correct-usage and incorrect-usage question forms.

## Breadth added

### SSC Standard
Adds another 96 administration, public-service and formal-use targets such as:
administer, appoint, approve, ascertain, audit, delegate, determine, establish, evaluate, execute, cross-check, retract, empower, attest, elaborate, track, remedy, forgo and others.

### SSC Advanced
Adds another 96 higher-context semantic/analytical targets such as:
abstruse, axiomatic, cogent, consequential, fallacious, germane, endogenous, exogenous, stochastic, parsimonious, ordinal, multivariate, semantic, syntactic, temporal, spatial and others.

### Banking Prelims
Adds another 96 retail-banking/payment targets spanning:
NEFT, RTGS, IMPS, UPI, IFSC, MICR, KYC, auto-debit, credit limit, EMI, credit score, hypothecation, deposit insurance, cheque status/forms, card security, transaction dates/balances, disputes, fees and payment channels.

### Banking Mains
Adds another 96 risk/markets/regulatory targets spanning:
exposure-at-default, expected/unexpected loss, RWA, CET1, Tier 1/2, LCR, NSFR, HQLA, VaR, expected shortfall, ALM, repricing gaps, yield curve, credit migration, recovery/cure/default rates, TLAC, MREL, CRR, SLR, margining, counterparty exposure and conduct/compliance risks.

## Identity audit

Full chapter audit:
- 768 active authority IDs;
- **384 V4 terms are unique inside the doubling wave**;
- the only repeated target words in the final chapter are five historical V1 cross-profile cases that existed before V4: issue, secure, verify, persistent and offset;
- all avoidable V4 overlaps were replaced before activation.

## Question Studio

Question Studio now points to ENG-013 V4:
- 768 active authorities;
- 192 per profile;
- CP005 composer retained;
- deterministic authority selection;
- deterministic option shuffle/remap;
- review-only lifecycle unchanged.

## Source-level guards

The V4 test source checks:
- exact 192 / 192 / 192 / 192 profile counts;
- 768 unique authority IDs;
- 384 V4 authorities;
- 384 unique V4 target terms;
- four unique option sentences per authority;
- deterministic replay;
- valid answer remapping;
- CP005 composer coverage;
- 40,000-seed soak source.

No CI/test execution is claimed by this review file.
