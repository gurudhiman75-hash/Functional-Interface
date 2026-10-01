# VEN-001 — Deep Audit Wave 02: Numerical Editorial Realness

Date: 2026-10-01

Status: `NUMERICAL_STEM_REALNESS_HARDENED__REGRESSION_GATE_ADDED__FINAL_CLOSURE_PENDING`

## Scope

Wave 02 changes learner-facing wording only. It does not change:

- numerical state generation;
- inclusion-exclusion logic;
- overlap-bound logic;
- answer keys;
- distractor math;
- permanent QL mapping;
- lifecycle locks.

## Defects corrected

### 1. Repetitive survey boilerplate

Removed recurring openings such as:

- `A survey of ...`
- `In a survey ...`
- `Survey results showed ...`
- Hindi/Punjabi equivalents

The standard total-bearing opener is now compact:

- English: `Among N people, ...`
- Hindi: `कुल N लोगों में, ...`
- Punjabi: `ਕੁੱਲ N ਲੋਕਾਂ ਵਿੱਚ, ...`

Percentage forms without an explicit total use a short data-led opener rather than another survey sentence.

### 2. Anonymous ordinal groups

Learner stems no longer ask about:

- first group
- second group
- third group

where the actual activities/categories are known.

The generated wording now names the scenario groups, e.g. newspaper A / newspaper B / newspaper C, tea / coffee / milk, mathematics / science / English, etc.

This applies to two-set exclusivity and three-set operations such as:

- A and B but not C;
- B and C but not A;
- A and C but not B;
- A or B but not C;
- A but not B;
- A and B including members also in C.

## Regression authority

`ven-001-editorial-audit.test.ts` generates multilingual numerical questions across VEN-CP005..VEN-CP010 and rejects:

- generic survey-style opening templates;
- first/second/third-group learner references.

The full VEN workflow now runs this editorial audit in addition to the topology, renderer, authority, numerical, shape and permanent-QL proofs.

## Lifecycle

Review-only remains unchanged. This wave does not authorize Question Bank writes, tests, mocks, public delivery or automatic learner publication.
