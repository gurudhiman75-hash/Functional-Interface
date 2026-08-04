# INT-CP-003 — Annual Compound Interest Fundamentals and Inverses

Status: `GROUNDED_SOLUTION_TRACE_REVIEW_CANDIDATE — STAGING_LOCKED`

The permanent mathematical inventory remains `INT-QL-053..INT-QL-066`, with all 14 legacy CP-003 families owned and zero open mathematical gaps.

## Shared mathematical authority

The architecture-consolidation candidate uses one shared mathematical authority for:

- exact rational arithmetic;
- permanent QL identity and solve-contract metadata;
- the 16 exact exam-rate values;
- QL-specific mathematical states;
- canonical answers;
- independent recurrence/relation verification;
- relevant-only mathematical fingerprints.

The legacy completion runtime delegates to this authority through a compatibility adapter. The exam model owns generation policy only: rate weighting, QL eligibility, maximum-year constraints, context eligibility, representation selection, stem-family selection and instance difficulty.

Every exam question carries its permanent QL, solve contract, authority version, generator version, solver version and verifier version. The canonical answer must pass the independent relation verifier before options, explanation traces or review output are packaged.

## Semantic solution traces

`cp003-solution-trace.ts` is the language-neutral reasoning authority between the mathematical solver and learner-facing explanation renderers.

Each generated question contains:

- one versioned solution trace;
- one QL-owned learner method;
- typed semantic operations and exact rational operands;
- separate core, foundation and verification step collections;
- optional shortcut authority with explicit source-step lineage;
- a misconception key rather than embedded learner prose;
- a final answer that is independently relation-verified.

The 14 current learner methods are:

1. direct annual factor;
2. amount minus principal;
3. reverse compound factor;
4. reverse compound-interest factor;
5. amount-ratio factor match;
6. factor-power time match;
7. nth-year opening balance;
8. reverse nth-year interest factor;
9. nth-year rate substitution;
10. reverse one-year factor;
11. consecutive-balance rate;
12. consecutive-balance principal;
13. annual amount difference;
14. yearly-interest geometric growth.

`cp003-exam-explanation.ts` remains a pure English renderer over the approved trace. It does not independently reconstruct compound-interest answers. Exam, student and foundation views all carry source-step IDs back to the same trace.

## Grounded learner contract

The exam runtime now validates the question presentation, semantic trace and rendered explanation as one learner-visible contract.

The grounded layer enforces that:

- every value required by the selected solution path is visible in the question or its answer choices;
- a displayed annual multiplier is used directly instead of being re-derived from an undisclosed rate;
- inverse-rate explanations derive the annual factor from the amount ratio before stating the rate;
- nth-year inverse-rate explanations explicitly identify option substitution before testing the correct choice;
- consecutive-balance principal questions display the actual observation years rather than abstract `t` and `t+1` labels;
- balance-ledger variants show the principal, rate, duration or annual multiplier required to solve them;
- repeating annual factors are rendered as exact fractions rather than truncated decimals presented as exact equalities;
- year-gap wording uses forms such as `2-year gap`, not `2 years gap`.

The grounding audit rejects hidden givens, circular rate reasoning, duplicated option-check verification, missing observation years and stale approximate factor text during generation of any review candidate.

## Trace and editorial rejection rules

The trace and learner-output audits reject:

- arithmetic-step disagreement;
- trace/final-answer disagreement;
- learner prose inside the semantic trace;
- missing or unknown explanation source-step IDs;
- stale method, generator or trace versions;
- shortcut text that merely repeats the main calculation;
- singular-year grammar errors;
- Unicode or plain mixed fractions inside MathJax expressions;
- truncated repeating decimals presented as exact annual factors;
- explanations that use a non-answer annual rate absent from the displayed givens.

## Generation and presentation policy

Rate profiles constrain eligible QLs, maximum years and allowed contexts. Bank-statement representations are permitted only for rates that allow a bank-deposit context. Declared prose stem families are limited to families that produce distinct rendered wording.

The learner-facing remediation uses six rendered representations, Indian formatting, deterministic option shuffling, misconception-owned distractors, three explanation depths and MathJax guards. QL-065 continues to withhold derived endpoint amounts. Amount-ratio rate recovery remains restricted to two years, while nth-year rate recovery remains restricted to years two or three.

## Validation proof

Draft PR #491 targets the current CP-003 remediation branch. Exact branch-head proof is maintained in the PR description and GitHub Actions evidence rather than embedded here, so documentation-only commits cannot make this file self-stale.

The inherited CP-002 freeze regression, legacy CP-003 completion proof, strengthened exam-readiness audit, semantic solution-trace audit, grounded presentation checks, 56-question review export, evidence assertions and complete API build must all pass at the reviewed head.

No English freeze, staging, registration, Question Studio discovery, Question Bank write, test eligibility or publication is permitted without fresh explicit approval.
