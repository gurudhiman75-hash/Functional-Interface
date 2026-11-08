# Quant V4 — one-pass LaTeX / MathJax closure

## Objective

Audit and repair **all enabled Quant packages / CPs / QLs** in one offline pass; do not go chapter-by-chapter in chat. No production Cloud Run changes, queue operations, live question generation or Question Bank publishing.

## Authoritative scope

- Base: New-main, current draft PR #3541.
- Seven Quant source groups: Arithmetic, AdvancedMathematics, DataInterpretation, NumberSystem, Probability, SpeedMathematics, Statistics.
- Discover actual enabled Quant packages via the Question Studio registry; do not assume the directory inventory is the runtime registry. Account for standalone adapters and legacy quant v2/v3 sources if they feed active Question Studio chapters.
- Only count runnable English/Hindi/Punjabi variants; report unsupported locales, don't manufacture translations.
- Inspect user-visible stem, options, answers, explanation and step-by-step previews, including diagram captions and admin/student previews.

## Repeatable automated sweep

1. Inventory active packages, canonical CPs and QLs from registry, cross-check directory and Question Studio mappings, report omissions.
2. Use deterministic seeds with numerical/boundary variation. Generate in isolated bounded chunks and persist an output manifest plus compact sample JSONL; avoid importing all 5,940 files into a single test process if memory is insufficient.
3. Validate raw output, rendered text and TeX delimiters: `\\(...\\)`, `\\[...\\]`, `$...$`, `$$...$$`; balanced groups; supported MathJax commands; lost JavaScript escapes; nested fractions and radicals; `\\left`/`\\right`; symbols, powers and currency; Hindi/Punjabi text within math.
4. Compare before/after each generated question: question identity/seed, numeric solution, answer, correctIndex, options and count. Any change to solution semantics is disallowed for presentation fixes.
5. Render representative and problematic questions in both actual student MathJax and canonical admin MathRenderingProvider surfaces, including mobile width and Hindi/Punjabi fonts. DOM/unit checks alone do not certify visual rendering.
6. Group findings by chapter, CP, QL, language and risk. Distinguish confirmed runtime defects, expected notation, false positives, and unavailable/untested coverage.
7. Fix confirmed presentation defects at source/package boundary. Avoid global regex substitution on arithmetic or unverified source warnings. Add deterministic regressions per defect class.
8. Re-run every supported package/language and existing dedicated latex tests. Produce machine-readable JSON and a human-readable markdown closure report including remaining exceptions.

## Existing evidence

- Source-only first pass emitted 2,126 **review** findings (1,971 dynamic TeX, 145 Indic text, 10 raw permutation/combination), **zero confirmed runtime defects** at that stage.
- One confirmed JavaScript template-string spacing issue in INT-001 CP001 has been corrected in the draft branch (27 uses) with a targeted tri-language test awaiting execution.
- Source warnings do not imply that all 2,126 should be altered. Any new count of confirmed faults must come from actual generated content and valid reproduction.
- Existing student renderer uses MathJax; test and fix MathJax compatibility, not KaTeX APIs.

## Done criteria

One consolidated PR and report. Explicit package/CP/QL/language counts, seed sampling coverage, exact failures and corrected files, passing targeted and full tests, before/after math semantics parity, and transparent unresolved gaps. Do **not** claim exhaustive or zero errors if any active path is untested or if the full run was not executed.
