# SYL-001 — Deep Audit Wave 02

Date: 2026-09-29

Status: `ANTI_INFLATION_METADATA_HARDENED__PROFILE_FREEZE_STILL_OPEN`

## Finding

Question Studio correctly keeps all 18 historical QLs available for review, but the review payload did not expose the existing consolidation decision that only four legacy QLs represent canonical mock-frequency archetypes:

- `SYL-QL-001`
- `SYL-QL-003`
- `SYL-QL-004`
- `SYL-QL-008`

The remaining compatibility IDs include remodel candidates, premise-form aliases and training diagnostics. Without explicit role metadata, a future consumer could accidentally count those IDs as independent mock families.

## Remediation

The Question Studio package and every preview record now expose:

- canonical archetype ID;
- QL disposition;
- lesson eligibility;
- adaptive-practice eligibility;
- legacy mock weight;
- whether the QL is an independent mock-frequency dimension.

Non-canonical review surfaces explicitly state that they must not be treated as independent mock-frequency families.

## Regression gate

The closeout audit now proves:

- all 18 QLs have review-role metadata;
- exactly four current legacy QLs have positive mock-frequency identity;
- those four are `001, 003, 004, 008`;
- every training-only QL has zero mock-frequency identity;
- each generated preview carries the correct role.

## Lifecycle

This change is metadata-only.

It does not:

- enable mock generation;
- activate source-profile weights;
- register the Banking modal candidate family;
- create a new permanent QL;
- enable persistence, Question Bank, test or public delivery.

## Remaining blockers

Source-profile/mock freeze remains open for the reasons recorded in Wave 01 and Freeze Readiness V9.

Novelty remains deferred.
