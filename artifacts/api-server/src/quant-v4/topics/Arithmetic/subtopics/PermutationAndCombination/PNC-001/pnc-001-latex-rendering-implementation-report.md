# PNC-001 LaTeX Rendering Implementation Report

## Status

`IMPLEMENTED — DRAFT / UNMERGED`

This change standardizes mathematical display for PNC-001 and the active ExamTree admin review surfaces. It does not publish PNC-001, enable generation-engine routing, or approve the package for production use.

## Authoring contract

Mathematical expressions are stored as UTF-8 prose with explicitly delimited TeX:

- inline math: `\(...\)` or `$...$`;
- display math: `\[...\]` or `$$...$$`.

Normal English, Hindi and Punjabi prose remains outside math delimiters so language fonts and line breaking are preserved.

Examples:

```text
The number of ordered selections is \({}^{n}P_{r}=\frac{n!}{(n-r)!}\).
```

```text
\[
\binom{n}{r}=\frac{n!}{r!(n-r)!}
\]
```

## PNC-001 runtime implementation

`foundation/latex.ts` is the code-owned notation layer. It:

- preserves existing delimited TeX;
- converts raw `nPr` and `nCr` notation;
- converts factorial quotients and factorial arithmetic;
- converts powers, inequalities, multiplication and division expressions;
- detects unbalanced delimiters;
- detects formula-bearing prose that remains outside TeX;
- distinguishes TeX groups from unresolved authoring placeholders.

The solver's `mathJax` field remains the mathematical display authority. The explanation renderer consumes that evidence rather than rebuilding calculations independently.

`foundation/pipeline.ts` now:

- emits TeX-formatted stems and explanation lines;
- records `mathRendering: DELIMITED_TEX` in traceability;
- rejects unbalanced delimiters;
- rejects raw formula notation outside delimiters;
- requires a non-empty solver MathJax equation.

Legacy validators previously treated TeX braces such as `{6}` as template placeholders. The pipeline masks braces only inside delimited math at the legacy-validation seam. The returned question package retains the original TeX, and the new LaTeX gates inspect the untouched content.

## Admin application rendering

The admin application now declares `better-react-mathjax` and provides one global `MathJaxContext`.

`components/shared/MathText.tsx` is the shared admin renderer used by:

- Question Studio generated-item stems;
- Question Studio answer options;
- Question Studio explanations;
- the live revision preview;
- Question Bank question-detail stems, options and explanations;
- Question Bank desktop and mobile stem previews.

Textareas and inputs intentionally retain raw TeX so editors can author and revise formulas directly while viewing the rendered preview beside the source.

## Student application

The student application already used `QuestionRichText` with MathJax support. The PNC runtime now supplies the delimited TeX format that component expects, so no duplicate PNC-specific student renderer was introduced.

## Validation evidence

Final workflow: `Validate platform LaTeX rendering`

Validated on the documented implementation head:

- frozen pnpm dependency installation;
- strict targeted PNC-001 TypeScript;
- 106 QLs × 12 seeds = 1,272 rendered LaTeX audit cases;
- complete 1,272-case deterministic chapter proof;
- 106 QLs × 50 seeds = 5,300 package stress cases;
- 1,060 repeatability checks;
- zero validator failures;
- zero independent-verifier disagreements;
- zero option-contract failures;
- zero explanation-contract failures;
- zero exact-template duplicate groups;
- zero rendered-explanation duplicate groups;
- admin typecheck;
- admin tests;
- admin production build;
- student production build.

## Safety boundary

- English-only PNC-001 runtime remains unchanged.
- `publiclyPublishable: false` remains enforced.
- No generation-engine, Question Studio package enablement, publication or public routing was added.
- Hindi and Punjabi authoring remains deferred until English freeze approval.
- The implementation remains in draft PR #103 and is stacked on draft audit PR #101.
