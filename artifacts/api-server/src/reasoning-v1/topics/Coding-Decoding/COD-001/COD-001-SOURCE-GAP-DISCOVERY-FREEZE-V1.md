# COD-001 — Source-Gap Discovery Freeze V1

Status: **approved discovery freeze for four late-discovered English solve contracts; permanent allocation authorised only through the paired manifest amendment**.

Freeze version: `COD_SOURCE_GAP_DISCOVERY_FREEZE_V1`

Date: 2026-09-13

This freeze follows `cod-001-open-ql-discovery-amendment.md` and the completed source-gap final audit. It closes discovery for the source evidence already audited in this wave. It does not reopen the revoked legacy 260-QL reservation.

## Frozen solve contracts

| Proposed QL | Owner | Frozen solve contract | Rule authority |
|---|---|---|---|
| `COD-QL-200` | `COD-CP-005` | infer hidden alphabetical ascending sort and encode one target word | `ALPHABETICAL_ASCENDING_SORT` |
| `COD-QL-201` | `COD-CP-006` | infer indexed shifts, then reverse, and encode one target word | `INDEXED_SHIFT_THEN_REVERSE` |
| `COD-QL-202` | `COD-CP-006` | infer reverse, then one uniform alphabet shift, and encode one target word | `REVERSE_THEN_UNIFORM_SHIFT` |
| `COD-QL-203` | `COD-CP-007` | infer mixed vowel/consonant class coding and encode one target word | `MIXED_CLASS_CODE` |

All four contracts use the same task direction: `INFER_AND_ENCODE` from two displayed word→code examples plus one target word.

## Merge / split freeze

The split is exactly four contracts.

- Alphabetical sorting is one CP005 contract because the permutation is value-dependent, not a fixed position rearrangement.
- Indexed-shift-then-reverse is distinct from the existing reverse-then-indexed-shift contract because the stages do not commute.
- Reverse-then-uniform-shift is one CP006 contract; shift sign and magnitude are instance parameters.
- Mixed-class coding is one CP007 contract. Its two source-backed mapping variants remain instance contexts of the same solve architecture and are not separate QLs.

## Explicit non-allocations

This freeze does **not** authorise new QLs for:

- inverse decode;
- recover a missing token;
- choose a matching code as a separate identity;
- explicit-rule forward application;
- rule naming or classification;
- either mixed-class mapping variant as a separate QL;
- difficulty levels, answer positions, stem wording or parameter values.

Any such future expansion requires fresh recurring source evidence and another discovery cycle.

## Quality proof carried into the freeze

The frozen contracts inherit the green source-gap proof:

- 480-question original prototype regression;
- 960-question V2 quality/fatigue matrix;
- exact reproduction of audited source fixtures;
- unique hidden-rule/context inference from displayed evidence;
- governed 180+ word exam-neutral vocabulary pool;
- rolling target/evidence-pair fatigue checks;
- instance-derived difficulty with multiple legitimate bands per rule;
- misconception-labelled distractors with no arbitrary fallback;
- beginner-first explanations without mandatory shortcut/trap boilerplate;
- mixed-class instances exercising both vowel and consonant channels.

The executable freeze additionally generates 240 deterministic instances per permanent contract and checks identity, ownership, answer positions, diversity, difficulty spread, inference uniqueness and lifecycle locks.

## Release boundary

The four frozen identities are English runtime-proof/review-only after the paired manifest amendment:

- Question Studio visibility: false;
- public publishability: false;
- Question Bank writing: disabled;
- mock-test eligibility: disabled;
- Hindi/Punjabi: not yet allocated for these four identities.

Existing Hindi/Punjabi closure remains `COD-QL-001..199` until a separate localisation expansion is implemented and audited.
