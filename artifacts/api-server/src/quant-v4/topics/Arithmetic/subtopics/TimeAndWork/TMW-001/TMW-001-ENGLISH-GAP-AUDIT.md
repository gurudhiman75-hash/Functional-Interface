# TMW-001 — Chapter-Wide English Gap Audit

## Status

**Automated English freeze readiness: PASSED.**

The calibrated chapter proof now reports:

- 211 QLs, `TMW-QL-001` through `TMW-QL-211`;
- 12 deterministic states per QL;
- 2,532 generated candidates and 2,532 valid candidates;
- 0 hard failures;
- 0 English-freeze blockers;
- 2,527 distinct exact stems;
- 2,483 distinct normalised stems;
- 1,302 distinct normalised explanations;
- chapter context-first share of approximately 10.27%;
- all 211 QLs with the approved four-tier learner explanation and option-linked trap contract.

Three non-blocking observations remain: the 12-state audit sample reaches three of four answer positions for `TMW-QL-058`, `TMW-QL-066` and `TMW-QL-075`. Their permanent CP-004 proof reaches all four answer positions across 50 seeds per QL, so these observations do not block freeze.

Automated readiness does not itself publish the chapter. The next gate is manual review of the generated 211-question corpus.

## Purpose

This phase began after the merge of `TMW-CP-011`. It audits the complete English runtime as one chapter rather than treating the eleven checkpoint proofs as independent islands.

The implemented source range is `TMW-QL-001` through `TMW-QL-211`. No QL count was added or removed during remediation because the ownership audit found no material coverage gap requiring a new authority.

## Evidence corpus

The automated diagnostic generates:

- 12 deterministic states for every QL;
- 211 QLs × 12 states = 2,532 runtime candidates;
- deterministic replay for the first two states of every QL;
- one human-readable review candidate per QL;
- checkpoint-level and chapter-level opening-style distributions;
- exact and normalised stem/explanation collision maps;
- a calibrated target-syntax report;
- one 211-question manual-review corpus.

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

## Opening-language result

The chapter uses deterministic opening rotation across original, temporal-first and objective-first deliveries while preserving the generated mathematical state and question target.

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

1. migrated fractional time typography to shared MathJax-safe rendering;
2. calibrated explicit target syntax for both interrogative and imperative clauses;
3. removed learner-facing academic jargon and negative-command traps;
4. upgraded CP-001 through CP-005 with mode-specific four-tier learner layers;
5. completed three-stage working for CP-006 and CP-007;
6. removed normalised explanation collisions, including the remaining CP-010 pairs;
7. added deterministic chapter-wide stem-opening diversity;
8. removed obsolete write-enabled remediation workflows;
9. converted the permanent chapter audit to a read-only proof workflow.

## Manual review gate

The manual reviewer should inspect the hosted 211-question corpus for:

- natural exam wording and realistic context;
- exact agreement between target, answer and conclusion;
- human-authored feel across stems, working, shortcuts and traps;
- distractor plausibility without ambiguity;
- terminology consistency across all eleven checkpoints;
- absence of repetitive phrasing that is meaningful to a human reviewer but below automated collision thresholds.

English may be manually frozen after this corpus is approved. Hindi and Punjabi localisation must begin only after the English manual freeze is recorded.

## Safety boundary

This branch does not enable Question Studio routing, Question Bank writes, localisation, test assembly or public delivery. Every candidate remains `publiclyPublishable: false`.
