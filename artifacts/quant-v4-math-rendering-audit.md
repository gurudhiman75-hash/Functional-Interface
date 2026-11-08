# Quant V4 math rendering audit — initial coverage

Source baseline: `New-main` at `338bd46c7b9254f083060288e9f4aef630ddada8`.

## Current evidence
- Canonical math rendering is MathJax in the student `QuestionRichText`; admin has `MathRenderingProvider`.
- Quant V4 authoring rules live at `artifacts/api-server/src/quant-v4/latex-authoring-contract.md`.
- Seven topic groups are present: Arithmetic, AdvancedMathematics, NumberSystem, SpeedMathematics, DataInterpretation, Probability, Statistics.
- Repository tree inventory found approximately 5,940 TypeScript/JavaScript files under these topic groups, including test and helper sources.
- Probability already has `probability-mathjax.test.ts`; this is package-specific and cannot prove general coverage.
- The student tokenizer accepts `\\(...\\)`, `\\[...\\]`, `$...$`, and `$$...$$`. Its dollar matching warrants a currency-regression test; this is a risk to investigate, not a demonstrated bug.

## Running the initial scanner

```bash
node scripts/audit-quant-v4-math-rendering.mjs > /tmp/quant-math-source-audit.json
node scripts/audit-quant-v4-math-rendering.mjs --samples /path/to/generated-quant-review.jsonl > /tmp/quant-math-runtime-audit.json
```

The default pass covers all production topic source files in the seven groups (not just representative chapters). It flags **candidates for editorial review**, not certified defects. The optional JSON/JSONL pass validates actual rendered strings, including stems, options, and explanations. Use real deterministic generated output for each chapter, language and CP; source scanning alone is not exhaustive.

## Remaining acceptance work

1. Generate representative and edge-case questions from every enabled canonical Quant package, CP and language using deterministic seeds.
2. Validate actual strings, including options and explanations, against the canonical LaTeX contract. Record chapter/CP/QL/seed with each finding.
3. Exercise MathJax rendering in both admin and student interfaces, especially Indic text, currency, nested fractions, long equations and mobile layout.
4. Correct confirmed defects at package boundaries without modifying mathematical answers or question logic.
5. Add regression cases for each confirmed defect and rerun the full audit before merging.

## Safety

This initial audit changes **no** question records, generators, renderer components, production services or queues. Do not classify review warnings as proof of errors or treat a clean static report as full render certification.
