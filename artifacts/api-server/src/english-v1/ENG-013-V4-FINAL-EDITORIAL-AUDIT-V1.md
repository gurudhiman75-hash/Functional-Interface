# ENG-013 Word Usage — V4 Final Editorial Audit V1

Status: `EDITORIAL_REMEDIATION_COMPLETE__REVIEW_READY`

Audit date: **2026-09-30**

## Scope

This audit covers the **384 V4 additions** in ENG-013 Word Usage:
- 96 SSC Standard
- 96 SSC Advanced
- 96 Banking Prelims
- 96 Banking Mains

The full active ENG-013 bank remains:
- **768 authorities**
- **192 authorities per profile**

## Finding

The V4 breadth wave had strong target-word breadth but weak sentence-surface breadth.

Each profile used one generic constructor:
- one SSC Standard transitive-verb frame;
- one SSC Advanced adjective frame;
- one Banking Prelims banking-noun frame;
- one Banking Mains financial-noun frame.

That meant 384 distinct targets were being exercised through only four repeated surface patterns.

The main quality risks were:
1. template recognition;
2. unnatural context for some advanced adjectives;
3. banking terminology being tested through generic noun-to-verb misuse rather than realistic banking context;
4. repetitive explanation wording;
5. apparent authority breadth being materially larger than surface breadth.

## Remediation

The 384 IDs and targets are preserved exactly.

A shared editorial builder layer now supplies profile-specific surface families.

### SSC Standard

The 96 V4 transitive verbs now rotate through multiple administrative sentence families.

The invalid option still tests the governed direct-object pattern, but the three valid sentences no longer repeat one committee/officials/department template.

### SSC Advanced

Advanced adjectives are assigned to semantically appropriate subject classes such as:
- relationship;
- pattern;
- structure / figure / factor;
- assessment;
- argument;
- arrangement;
- framework;
- effect.

Multiple adjective sentence families are used so terms such as:
- bilateral;
- causal;
- aggregate;
- vertical;
- normative;
- institutional;
- material;
- discerning

are not forced into the old generic “relevant feature” frame.

### Banking Prelims

The 96 customer-facing banking terms are classified into contexts such as:
- account;
- payment;
- cheque;
- card/security;
- loan;
- fee/charge;
- identity/KYC;
- service/branch operations.

The three valid sentences now describe realistic branch/customer usage for the term's category.

### Banking Mains

The 96 financial terms are classified into contexts such as:
- policy/rates;
- risk;
- capital;
- instruments/securities;
- markets/issuance;
- derivatives;
- liquidity / ALM.

The valid sentences now use profile-appropriate analytical contexts rather than one universal “risk report / policy note / institution” template.

## Editorial guards added

The V4 regression source now asserts:

1. all existing count / ID / determinism guards remain;
2. old stock V4 sentence frames are absent;
3. V4 explanations meet a stronger minimum depth;
4. every V4 profile has materially broader normalized sentence-surface diversity;
5. every V4 profile has at least four distinct incorrect-usage frames;
6. the 30,000-seed generator soak remains in place;
7. Question Studio remains review-only.

## Lifecycle

No new authorities were added and no learner release is enabled.

Current intended state after approval:

`ENG-013_V4_EDITORIALLY_REMEDIATED__QUESTION_STUDIO_REVIEW_ONLY`

The active authority count remains **768**.
