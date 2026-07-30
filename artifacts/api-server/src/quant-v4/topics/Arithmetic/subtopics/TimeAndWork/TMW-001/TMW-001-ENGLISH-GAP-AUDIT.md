# TMW-001 — Chapter-Wide English Gap Audit

## Status

**Automated English freeze readiness: PASSED.**

**Manual English corpus freeze: PASSED.**

The exact proof on source head `0afc3ea85f1e2c4ba16726ea394af63c413a3e62` is GitHub Actions run `30555930280` (`Audit TMW-001 English freeze readiness`, run number 136). The read-only workflow completed its automated diagnostic, 211-question export, permanent manual audit, calibration, evidence upload and combined enforcement successfully.

The final evidence reports:

- 211 QLs, `TMW-QL-001` through `TMW-QL-211`;
- 12 deterministic states per QL;
- 2,532 generated candidates and 2,532 valid candidates;
- 0 hard failures;
- 0 English-freeze blockers;
- 211 manual-review rows across all 11 checkpoints;
- 0 manual English findings;
- 211 valid four-tier review rows;
- 0 publishable rows;
- 2,527 distinct exact stems;
- 2,483 distinct normalised stems;
- 1,302 distinct normalised explanations;
- chapter context-first share of approximately 10.27%.

Three non-blocking observations remain: the 12-state audit sample reaches three of four answer positions for `TMW-QL-058`, `TMW-QL-066` and `TMW-QL-075`. Their permanent CP-004 proof reaches all four answer positions across 50 seeds per QL, so these observations do not block freeze.

This result freezes the English learner-delivery corpus for review and localisation handoff. It does not publish the chapter or enable any product route.

## Purpose

This phase began after the merge of `TMW-CP-011`. It audits the complete English runtime as one chapter rather than treating the eleven checkpoint proofs as independent islands.

The implemented source range is `TMW-QL-001` through `TMW-QL-211`. No QL count was added or removed during remediation because the ownership audit found no material coverage gap requiring a new authority.

## Evidence corpus

The permanent read-only proof generates:

- 12 deterministic states for every QL;
- 211 QLs × 12 states = 2,532 runtime candidates;
- deterministic replay for the first two states of every QL;
- one human-readable review candidate per QL;
- checkpoint-level and chapter-level opening-style distributions;
- exact and normalised stem/explanation collision maps;
- a calibrated target-syntax report;
- one 211-question manual-review corpus;
- one permanent manual English findings report.

The evidence artifact for run `30555930280` is `tmw-001-english-gap-audit` (artifact ID `8764777837`). It contains the automated report and log, calibration log, 211-question corpus, and manual audit report and log.

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

The final automated report contains no hard failures.

## English-freeze blockers

A freeze blocker may be mathematically valid but not yet production-ready:

- missing Core → Working → Shortcut → Trap structure;
- no option-linked diagnostic trap;
- negative-command trap wording;
- textbook-heavy learner language;
- raw LaTeX or ASCII fractional time;
- no explicit interrogative or imperative target clause;
- overly short or overly long stems;
- one opening style across all sampled states of a QL;
- checkpoint-level dominance by one opening style;
- excessive context-first or repeated-prefix usage;
- normalised cross-QL stem or explanation collisions.

The final calibrated report contains no English-freeze blockers.

## Manual English gate

The permanent manual audit regenerates one valid candidate for every QL and checks:

- four unique options and exact answer alignment;
- a distractor-linked, option-specific diagnostic trap;
- absence of command-style trap advice;
- absence of learner-facing generation, invariant, internal-ID and camelCase solve-mode language;
- contextual rather than generic conclusions;
- the corrected CP-001 remaining-share trap;
- the CP-005 periodic machine context and cycle-based distractors;
- CP-008 inverse-pool and residual-payment guidance;
- CP-009 boundary-decision options, trap and conclusion;
- CP-011 diagnostic traps and contextual conclusions.

The final manual report contains 211 rows, 211 QLs, 11 checkpoints and 0 findings.

## Opening-language result

The chapter uses deterministic opening rotation across original, temporal-first and objective-first deliveries while preserving the mathematical state and question target.

Final chapter distribution across 2,532 candidates:

- subject-first: 545;
- temporal-first: 863;
- objective-first: 856;
- context-first: 260;
- other: 8;
- context-first share: approximately 10.27%, below the 30% chapter threshold.

Every checkpoint remains below its 70% dominant-style ceiling, 35% context-first ceiling and 35% repeated-prefix ceiling. Every sampled QL reaches at least two opening styles.

## Remediation completed

The audit branch completed the following chapter-wide upgrades:

1. migrated fractional-time typography to shared MathJax-safe rendering;
2. calibrated explicit target syntax for both interrogative and imperative clauses;
3. removed learner-facing academic jargon and negative-command traps;
4. upgraded CP-001 through CP-005 with mode-specific four-tier learner layers;
5. completed three-stage working for CP-006 and CP-007;
6. removed normalised explanation collisions, including the remaining CP-010 pairs;
7. added deterministic chapter-wide stem-opening diversity;
8. corrected manual-only option, context, trap and conclusion defects across CP-001, CP-005, CP-008, CP-009 and CP-011;
9. added permanent English delivery polish and a permanent 211-row manual audit;
10. removed obsolete write-enabled remediation workflows;
11. retained a read-only combined automated/manual proof workflow.

## Freeze handoff

English is frozen for this chapter on the audited branch. After PR #331 is merged and the freeze is recorded on the chapter base, Hindi and Punjabi localisation may begin from the frozen English authority.

Any later English wording or option change must rerun both the 2,532-case automated diagnostic and the 211-row manual audit. The freeze must not be inferred from checkpoint tests alone.

## Safety boundary

This branch does not enable Question Studio routing, Question Bank writes, localisation, test assembly or public delivery. Every candidate remains `publiclyPublishable: false`.