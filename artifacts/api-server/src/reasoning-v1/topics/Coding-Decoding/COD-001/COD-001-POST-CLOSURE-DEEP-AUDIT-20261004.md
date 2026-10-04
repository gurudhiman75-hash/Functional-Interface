# COD-001 — Post-Closure Deep Audit

Status: **CLOSED — STANDARD QUESTION STUDIO ADAPTER REMEDIATION COMPLETE**

Date: 2026-10-04

Supersedes as current-head authority:
`COD-001-FINAL-DEEP-AUDIT-CLOSURE-20260928.md`

The September deep-audit closure, source-gap closure and 2026-10-02 controlled-novelty closure remain historical authorities. This document records the only current-head integration defect reproduced during the post-closure re-audit.

## Scope

- chapter: `COD-001`
- permanent QLs: **203** (`COD-QL-001..203`)
- checkpoints: **10** (`COD-CP-001..010`)
- languages: English / Hindi / Punjabi
- current lifecycle: review-only
- new permanent QLs: **0**
- Matrix/Games/Tournament: out of scope

The existing controlled-novelty audit remains authoritative:

`COD-001-CONTROLLED-NOVELTY-AUDIT-CLOSURE-20261002.md`

No admissible additional COD novelty provider is currently justified.

## Material defect found

### COD-001 was absent from the current standard Reasoning Question Studio adapter

COD already had a mature chapter-local multilingual runtime and legacy shared Question Studio review registration.

However, it was not registered in:

`src/question-studio/engines/reasoning-v1-adapter.ts`

Therefore the current multi-engine Question Studio API could not discover or generate Coding-Decoding through the same standard `reasoning-v1` adapter used by modernized Reasoning chapters.

## Remediation

New authority:

`COD-001-STANDARD-REASONING-ADAPTER-2026-10-04`

New module:

`question-studio-integration.ts`

The standard adapter now exposes COD-001 with:

- all **203 permanent QLs**;
- all **10 checkpoint scopes**;
- English / Hindi / Punjabi generation;
- deterministic QL selection;
- explicit QL and checkpoint selectors;
- bounded Easy / Medium / Hard filtering;
- checkpoint-ownership verification;
- source-gap QL200–203 ownership preservation;
- flattened learner options and explanations for the shared Question Studio surface;
- review-only lifecycle enforcement.

Source-gap ownership remains:

- `COD-QL-200` → `COD-CP-005`
- `COD-QL-201` → `COD-CP-006`
- `COD-QL-202` → `COD-CP-006`
- `COD-QL-203` → `COD-CP-007`

No content engine was duplicated; the adapter delegates to the existing `multilingual-runtime.ts`.

## Standard adapter proof

New gate:

`question-studio-standard-integration.test.ts`

It proves:

- COD appears exactly once in the standard Reasoning package list;
- QL001 direct generation routes through CP001;
- Punjabi QL200 generation routes through the source-gap permanent runtime and CP005;
- CP009 scope emits only QL175–198;
- requested Hard difficulty is honored;
- invalid QL204 is rejected;
- review-only lifecycle remains locked.

## Existing runtime validation

Exact substantive head:

`98e3dcda0e305d702b9182e07b6944b6251c715e`

Workflow:

`Reasoning COD-001 Runtime` — run **#285**

Result: **SUCCESS**

The exact head passed:

- CP001 exhaustive runtime audit;
- CP002 exhaustive runtime audit;
- CP003 exhaustive runtime audit;
- CP004 exhaustive runtime audit;
- CP007 permanent runtime audit;
- CP008 permanent runtime audit;
- CP009 permanent runtime audit;
- CP010 permanent runtime audit;
- CP001–CP004 editorial regression audit;
- instance difficulty and teaching-pedagogy audit;
- new standard Question Studio adapter integration;
- standard competitive-exam stem audit;
- editorial review export.

The same head also passed:

- Reasoning final current-head status;
- global Reasoning audit reconciliation;
- branch topology;
- workflow CI fanout/hygiene policy.

The central Question Studio engine-adapter workflow successfully built the API and bundled the registry proof with COD registered. Its registry validation remains subject to the known unrelated Quant defect:

`DI-001 is invalid: packages that declare lifecycle gates must declare lifecycleStage`

That DI defect is outside COD-001 and is not modified here.

## CI governance remediation

The existing COD runtime workflow predated the repository's current fanout policy.

It was updated to:

- target `New-main` explicitly;
- use concurrency with `cancel-in-progress: true`;
- stop listing its own workflow file in `pull_request.paths`.

No validation scope was weakened.

## Lifecycle

COD-001 remains review-only:

```text
Question Studio:                ENABLED
Question Bank writable:         false
test eligible:                  false
mock eligible:                  false
publicly publishable:           false
automatic publication:          false
manual approval required:       true
production release authorized:  false
```

## Final disposition

```text
permanent QLs:                       203
checkpoint coverage:                 CLOSED
existing runtime answer proofs:      PRESERVED
EN/HI/PA runtime:                    CLOSED
source-gap QL200–203:                CLOSED
controlled novelty:                  CLOSED — NO ADMISSIBLE PROVIDER
standard reasoning-v1 adapter:       REGISTERED
difficulty selection:                BOUNDED / VERIFIED
Question Studio lifecycle:           REVIEW_ONLY
public/student release:              LOCKED
post-closure deep-audit status:      CLOSED
```

Reopen COD-001 only for a newly evidenced recurring Coding-Decoding solve contract outside the existing 203 permanent QLs, an answer/solver regression, a multilingual/editorial regression, a standard-adapter regression, or a separately approved lifecycle transition.
