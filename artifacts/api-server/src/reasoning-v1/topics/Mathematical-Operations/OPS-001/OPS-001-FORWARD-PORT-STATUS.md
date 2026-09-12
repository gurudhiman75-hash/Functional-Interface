# OPS-001 Forward-Port Status

Status: **chapter authority forward-ported onto current `New-main`; review-only; release blocked.**

Forward-port date: **2026-09-12**

## Purpose

`OPS-001 — Mathematical Operations and Symbol Substitution` was developed and reviewed on the historical feature branch `feat/ops-001-end-to-end-design`. The feature branch later accumulated substantial repository-history drift while other Reasoning chapters were developed independently.

This forward-port deliberately does **not** merge that historical branch into current `New-main`. Instead, the complete chapter-local authority subtree was grafted onto a fresh branch created from current `New-main`.

Source authority:

```text
historical branch: feat/ops-001-end-to-end-design
historical head:   31d7bf68eaf45980129d14635fbafb68ec6b5cb2
chapter subtree:   artifacts/api-server/src/reasoning-v1/topics/Mathematical-Operations/OPS-001/
```

Forward-port base:

```text
New-main: 40d317e7eb30bc1fc9bf40e3fd7a85b05dc7698c
branch:   chore/ops-001-forward-port-20260912
```

## Preserved authority

The forward-port preserves the existing chapter-local identities and implementation evidence:

- permanent `OPS-QL-001..031`;
- `OPS-CP-001..009` ownership;
- English, Hindi and Punjabi runtime assets;
- exact arithmetic/token/parser/solver foundation;
- ambiguity and uniqueness machinery;
- approved teaching/localisation layers;
- chapter-local delivery locks;
- source, consolidation, freeze and review records.

No permanent QL ID is renamed, reassigned or deleted by this migration.

## Safety boundary

This forward-port does **not** copy the historical repository-level integration files from the old feature branch. In particular, it does not replace or revive the old:

- top-level Reasoning V1 generation engine;
- old Question Studio routes;
- old admin Question Studio pages;
- old Question Bank conversion changes;
- old publication-route changes;
- historical CI/workflow wiring.

Current `New-main` has evolved independently and those integration seams must be adapted against the current architecture rather than merged from stale history.

The chapter remains locked:

```text
Question Studio public lifecycle     disabled / review-only
Question Bank publication            disabled
student public delivery              disabled
mock-test eligibility                disabled
publiclyPublishable                  false
publicationEnabled                   false
```

## Audit blockers intentionally retained

Forward-porting is a repository migration, not a production-readiness approval. The current Reasoning V1 final audit still holds OPS-001 on P1 remediation. Known blockers include:

1. replace QL-static difficulty assignment with generated-instance difficulty;
2. add real 10/20/50/100-question diversity and fatigue gates;
3. expand shallow curated state spaces in affected compound and hidden-mapping contracts;
4. replace generic compound distractors with misconception-derived alternatives;
5. add the source-backed two-equation operator-plus-number interchange result topology;
6. add exam-profile delivery control;
7. adapt Question Studio to the current shared generation architecture without weakening lifecycle locks.

These findings must be resolved and re-audited before production promotion.

## Historical-report interpretation

Files inside this subtree that mention historical `New-main` SHAs, old workflow run IDs, or prior integration completion describe the state of the original feature branch at the time those reports were written. They are retained as evidence, but they do not supersede this forward-port status document or prove compatibility with the current repository.

## Current verdict

```text
CHAPTER_AUTHORITY_FORWARD_PORTED = YES
STALE_BRANCH_HISTORY_MERGED      = NO
PERMANENT_QL_IDENTITIES_PRESERVED = YES
CURRENT_QS_INTEGRATION           = PENDING_CURRENT_ARCHITECTURE_ADAPTER
PUBLIC_RELEASE                   = BLOCKED
AUDIT_VERDICT                    = HOLD_P1_REMEDIATION
```
