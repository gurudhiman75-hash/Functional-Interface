# TMW-001 — Chapter-Wide English Gap Audit

## Purpose

This phase begins after the merge of `TMW-CP-011`. It audits the complete English runtime as one chapter rather than treating the eleven checkpoint proofs as independent islands.

The implemented source range is `TMW-QL-001` through `TMW-QL-211`. No QL count is added or removed in this phase unless the ownership audit proves a material gap or collision.

## Evidence corpus

The automated diagnostic generates:

- 12 deterministic states for every QL;
- 211 QLs × 12 states = 2,532 runtime candidates;
- deterministic replay for the first two states of every QL;
- one human-readable review candidate per QL;
- checkpoint-level and chapter-level opening-style distributions;
- exact and normalised stem/explanation collision maps.

## Hard failures

A hard failure indicates a broken runtime or canonical contract:

- QL continuity or duplicate ID failure;
- CP, QL, solve-mode or language mismatch;
- non-deterministic replay;
- canonical runtime validation failure;
- invalid four-option package;
- answer/index mismatch or duplicate correct answer;
- unresolved values or placeholders;
- unbalanced MathJax;
- publication safety failure;
- fewer than three mathematical states for a QL;
- exact cross-QL duplicate stem.

## English-freeze blockers

A freeze blocker may be mathematically valid but not yet production-ready:

- missing Core → Working → Shortcut → Trap structure;
- no option-linked diagnostic trap;
- negative-command trap wording such as “Do not choose”;
- textbook-heavy learner language;
- raw LaTeX or ASCII fractional time;
- missing direct-question punctuation;
- overly short or overly long stems;
- one opening style across all sampled states of a QL;
- checkpoint-level dominance by one opening style;
- excessive context-first or repeated-prefix usage;
- normalised cross-QL stem or explanation collisions.

## Opening-language target

The chapter should not look like a single string template. A checkpoint becomes a blocker when:

- one opening style exceeds 70% of its sampled stems;
- context-first stems exceed 35%;
- one four-word prefix exceeds 35%;
- every sampled state of a QL uses one opening style.

The chapter-wide context-first target is at most 30%. These are freeze thresholds, not quotas for individual question generation.

## Review order

1. Resolve hard runtime failures.
2. Resolve ownership and normalised-collision findings.
3. Upgrade missing four-tier learner explanations.
4. Remove dominant stem prefixes and negative trap commands.
5. Re-run the 2,532-case audit.
6. Review the 211-question corpus manually.
7. Freeze English only when both automation and manual review pass.

## Safety boundary

This branch does not enable Question Studio routing, Question Bank writes, localisation, test assembly or public delivery. Every candidate must remain `publiclyPublishable: false`.
