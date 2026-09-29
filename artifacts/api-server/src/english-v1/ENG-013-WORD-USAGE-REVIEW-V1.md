# ENG-013 Word Usage / Contextual Usage — Review V1

Status: `HUMAN_REVIEW_PENDING__QUESTION_STUDIO_REVIEW_ONLY`

## Implemented scope

| CP | Profile | Authorities |
|---|---|---:|
| CP001 | SSC Standard | 24 |
| CP002 | SSC Advanced | 24 |
| CP003 | Banking Prelims | 24 |
| CP004 | Banking Mains | 24 |
| **Total** |  | **96** |

CP005 deterministic composer is implemented across all four profiles.

## Question forms

ENG-013 currently supports:
- **Correct usage** — identify the sentence where the target word is used correctly.
- **Incorrect usage** — identify the sentence where the target word is used incorrectly.

Each authority has:
- one target word;
- four complete contextual sentences;
- one keyed sentence;
- simple explanation of the intended meaning/collocation.

## Ownership

ENG-013 owns contextual vocabulary use only.

It does **not** duplicate:
- ENG-002 Sentence Improvement;
- ENG-003 Grammar Fillers;
- ENG-004 Synonyms/Antonyms;
- ENG-007 Spelling;
- ENG-012 Word Swap.

## Profile coverage

### SSC Standard
Common exam vocabulary and everyday formal usage:
adopt, brief, issue, retain, decline, secure, conduct, observe, address, maintain, permit, display, resolve, consume, release, raise, support, submit, operate, allocate, sustain, verify, restrict, withdraw.

### SSC Advanced
Subtle semantic/collocational distinctions:
subtle, arbitrary, robust, marginal, coherent, plausible, constrain, explicit, credible, derive, mitigate, preliminary, distort, ambiguous, relevant, infer, persistent, offset, adequate, discrete, complement, precede, elicit, notable.

### Banking Prelims
Retail banking and basic finance usage:
credit, balance, mature, service, settle, charge, issue, default, liquid, yield, secure, transfer, exposure, margin, process, float, reserve, debit, eligible, renew, verify, recover, redeem, proceed.

### Banking Mains
Editorial/financial contextual usage:
material, prudential, impair, contingent, absorb, granular, amplify, resilient, concentration, transmission, stress, structural, vulnerable, embedded, offset, persistent, calibrate, dislocation, buffer, underwrite, deteriorate, latent, reprice, spillover.

## Generator safeguards

- deterministic authority selection;
- deterministic option shuffle;
- four unique options;
- answer remapped after option shuffle;
- CP and difficulty filters;
- CP005 composer profile support;
- 10,000-seed soak-test source;
- review-only lifecycle.

## Editorial review gate

Before merge/freeze, review should specifically reject any authority where a wrong usage is so grammatically broken or nonsensical that the learner can answer without understanding the target word.

The intended standard is:
- wrong usage is grammatically plausible;
- error is primarily semantic, collocational, register-based, or sense-based;
- exactly one keyed sentence remains clearly best.

No CI/test execution is claimed by this review file.
