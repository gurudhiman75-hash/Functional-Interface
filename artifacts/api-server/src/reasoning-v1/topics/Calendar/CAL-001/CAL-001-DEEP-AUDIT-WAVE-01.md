# CAL-001 — Deep Audit Wave 01

Status: **ACTIVE — REMEDIATION STARTED**

Date: 2026-09-27

## Scope

This wave audits the already-completed Calendar chapter against the current Reasoning V1 deep-audit standard.

Novelty is deliberately excluded from this pass and remains deferred to the later final novelty audit.

## Existing strengths confirmed

Calendar already has unusually strong prior evidence:

- 47 source-backed prototypes compressed to 36 permanent semantic QLs;
- permanent range `CAL-QL-001..036`;
- explicit merge/split and inverse decisions;
- source-gap closure for same-date recurrence, named-weekday date enumeration and 29-February range counting;
- SSC, RRB, Punjab-state, book/practice and banking-boundary review in the frozen source audit;
- Gregorian/leap/century foundations;
- four unique options and exact answer-index checks;
- deterministic generation;
- English/Hindi/Punjabi parity and human freeze;
- active Question Studio production workflow with manual approval required;
- no automatic student publication.

No new permanent QL is allocated in Wave 01.

## Finding 1 — learner explanation diagnostics leak

### Problem

The live Question Studio projection appended these source-package diagnostics after the worked solution:

- `closestTrap`;
- `verification`.

The source runtime may retain these fields for QA, but they do not belong in the normal learner explanation surface under the current Examtree explanation standard.

This made Calendar older in style than later audited chapters such as ALP, where learner explanations are intentionally limited to the concept, worked reasoning and conclusion.

### Remediation

`question-studio-runtime.ts` now projects only:

1. observation/context;
2. rule;
3. worked steps;
4. conclusion.

Trap diagnostics and verification metadata remain inside the underlying source package for QA and provenance.

### Regression guard

`cal-001-deep-audit-wave1.test.ts` sweeps:

- all 36 permanent QLs;
- English, Hindi and Punjabi;
- 6 deterministic seeds per QL per language;
- 648 learner surfaces total.

It rejects learner-facing diagnostic phrases and also rechecks option/answer integrity.

## Finding 2 — requested difficulty can silently fall back

### Problem

`selectSourcePackage()` searches up to 256 generated candidates for the requested difficulty. If none matches, it currently returns the first generated candidate at another natural difficulty.

Therefore an explicit request such as `Hard` is not a strict contract for every QL.

The returned question reports its actual generated difficulty, so the content is not falsely labelled. However, the request itself can be silently ignored.

### Disposition

**OPEN P1.**

Do not solve this by artificially relabelling easy questions as hard.

The next audit wave must first build a QL × difficulty reachability matrix from generated-state evidence. After that:

- QLs that genuinely support a requested band should generate it;
- naturally fixed/narrow QLs should declare their real supported bands;
- unsupported explicit QL+difficulty requests should fail honestly or the mixed scheduler should select a compatible QL.

## Finding 3 — stale lifecycle documentation

The root `README.md` still describes the old discovery-only state:

- permanent QLs = 0;
- Question Studio false;
- Question Bank false;
- mock/public false.

That is historical and now contradicts the later approved production-completion authority, which exposes 36 permanent QLs in Question Studio with approval-gated downstream eligibility.

### Disposition

**OPEN P2 documentation drift.**

The historical records themselves should remain immutable, but the root README should describe the current lifecycle and link historical freeze records as history rather than present state.

## Current Wave 01 disposition

```text
coverage/source identities:          strong prior evidence; deeper recheck continues
solver/foundation correctness:       strong prior evidence
learner explanation surface:         REMEDIATED
difficulty-control honesty:          OPEN P1
documentation lifecycle drift:       OPEN P2
stem realism:                        next-wave sample/profile audit
distractor quality:                  next-wave generated-state audit
diversity/fatigue resistance:        next-wave profile audit
multilingual parity:                 strong prior evidence; current-surface recheck continues
Question Studio integration:         active; lifecycle consistency audit continues
novelty:                             DEFERRED
chapter deep-audit closure:          NOT YET
```

Calendar must not be marked deep-audit closed until the difficulty reachability/control issue and the remaining generated-content profile checks are completed.
