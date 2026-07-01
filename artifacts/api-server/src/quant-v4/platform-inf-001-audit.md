# PLATFORM-INF-001 Architecture Audit

Date: 2026-06-26
Scope: Quant V4 platform infrastructure, not Percentage content expansion.

## Executive finding

The prior audit is technically correct in its core direction, but several recommendations needed to be implemented as shared platform adapters rather than chapter rewrites.

## Verified findings

### 1. Option generation used rendered answer strings

Confirmed. `generation-engine.ts` contained a local `buildAnswerOptions(answer, seed)` helper used by `toQuestionStudioPreview`. It converted `pkg.answer` to a string and inferred ratios, fractions, numeric values, and suffixes through regular expressions. This made the preview pipeline dependent on the rendered answer surface instead of a computational answer contract.

Impact: future MathJax-rendered, unit-bearing, symbolic, or locale-specific answers could produce weak or incorrect distractors.

Resolution: the local helper has been removed from `generation-engine.ts`; preview now delegates to the shared answer option service in `shared/answers/option-generation.ts`.

### 2. Canonical answer representation was missing from the platform boundary

Confirmed, with nuance. Runtime packages still return backward-compatible `answer` fields, usually as strings or numbers. A shared answer contract already existed under `shared/answers/answer-contract.ts`, but it was not wired into Question Studio preview option generation.

Resolution: the preview model now exposes `canonicalAnswer` while preserving `answer` unchanged for existing callers and CSV/export compatibility.

### 3. Duplicate rate was reported, but not modeled as maturity policy

Confirmed. Coverage auditors calculate and print duplicate rate, and some package tests use permissive duplicate thresholds. There was no shared stage model stating when duplicate rate should block maturity.

Resolution: introduced `shared/maturity/maturity-framework.ts`. Duplicate rate is intentionally non-blocking for `FOUNDATION_READY` and becomes blocking at `CONTENT_READY` and above.

### 4. PCT-X could participate in discovery indirectly

Confirmed. `PCT-X` itself is not in `RUNTIME_PACKAGES`, but it contains a nested `runtime/` folder with `question-language.*.json` and package-shaped runtime files. The discovery walker searched recursively for question-language libraries and would discover that nested folder as package id `runtime` unless excluded.

Resolution: added archive manifest support and marked `PCT-X` archived. Discovery now skips archived package directories before recursing.

### 5. Content richness is tightly coupled inside chapter assets

Confirmed. Existing chapters depend on per-package QL assets and semantic libraries. Common entity/scenario libraries exist, but there was no platform-level `shared/content/` library for reusable context families, stem structures, and answer styles.

Resolution: added foundation shared content libraries without migrating Percentage chapters.

## Areas intentionally not changed

- Percentage chapter QLs were not expanded.
- Existing solvers, validators, and renderers were not rewritten.
- Hindi/Punjabi content was not generated.
- PCT-X historical files were retained.

## Backward compatibility assessment

- `answer` remains present and unchanged in Question Studio preview output.
- Existing package runtime contracts remain accepted because shared answer normalization adapts strings and numbers.
- Existing package-specific options are still honored when they can be matched to the canonical answer.
- Package discovery continues to include active runtime packages, while archived packages are filtered out.
