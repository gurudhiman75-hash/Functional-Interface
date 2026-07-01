# PLATFORM-INF-001 Risk Analysis

## Risk 1 — Existing UI expects only string answers

Mitigation: `answer` remains unchanged. `canonicalAnswer` is additive.

Residual risk: downstream consumers that blindly serialize all fields may expose the new object. This is acceptable for admin/debug surfaces but should be reviewed before public UI display.

## Risk 2 — Legacy MathJax answers become symbolic

Mitigation: the adapter preserves MathJax in `rendered` and does not parse it. This is safer than computing distractors from rendered syntax.

Residual risk: symbolic answers receive generic symbolic distractors. Future symbolic topics should provide topic-specific distractor strategies.

## Risk 3 — Archived package filtering hides useful experimental runtime from admin discovery

Mitigation: PCT-X is explicitly historical and retained in the repository. It is only removed from active discovery/tooling.

Residual risk: a developer may expect PCT-X to appear in Question Studio. They should remove or edit the archive manifest only if PCT-X is intentionally promoted.

## Risk 4 — Shared content libraries are not yet enforced

Mitigation: this task creates infrastructure, not migration. Libraries are foundation assets for future migration.

Residual risk: duplicate/context richness will not improve automatically until chapters record context/structure usage.

## Risk 5 — Maturity framework is introduced but not yet wired into every coverage auditor

Mitigation: the framework is reusable and backward-compatible.

Residual risk: current freeze/audit scripts may continue to report duplicate rate without blocking until they are migrated to shared maturity evaluation.

## Risk 6 — Large existing uncommitted changes in workspace

Mitigation: platform changes were limited to Quant V4 shared infrastructure and `generation-engine.ts`; chapter content was not rewritten.

Residual risk: existing unrelated working-tree changes may affect full build/test results. Review diffs before committing.
