# ExamTree Quant LaTeX Authoring Contract

## Status

`ACTIVE FOR NEW AND REVIEWED QUANT V4 CONTENT`

This contract governs mathematical text emitted by Question Studio packages and displayed in the student and admin applications.

## Canonical delimiters

Use inline LaTeX inside prose:

```text
The number of selections is \( \binom{n}{r} \).
```

Use display LaTeX only when a calculation should occupy its own line:

```text
\[
\binom{n}{r}=\frac{n!}{r!(n-r)!}
\]
```

The supported delimiters are:

- inline: `\(...\)` or `$...$`;
- display: `\[...\]` or `$$...$$`.

New Quant V4 authoring should prefer `\(...\)` and `\[...\]` because they do not conflict with currency symbols.

## Required notation

| Meaning | Required LaTeX |
|---|---|
| permutation | `\( {}^nP_r \)` |
| combination | `\( \binom{n}{r} \)` |
| factorial quotient | `\( \frac{(n+2)!}{n!} \)` |
| multiplication | `\( 8 \times 7 \times 6 \)` |
| exact division | `\( \frac{56}{7} \)` or `\( 56 \div 7 \)` |
| power | `\( 5^4 \)` |
| bounded inverse domain | `\( 2 \le r \le n \)` |
| selection then roles | `\( \binom{n}{s}\,{}^sP_k \)` |
| multiset arrangement | `\( \frac{n!}{a!b!c!} \)` |

## Prohibited visible forms

Do not expose these forms in stems, options, explanations, Question Studio previews, Question Bank previews, test QA or student solutions:

- `nPr`, `8P3`, `nCr`, `8C3`;
- `(n+2)!/n!`;
- `7!/(2!2!)`;
- raw `5^4` when it is being used as a mathematical expression;
- raw arithmetic chains such as `8 × 7 × 6 = 336` outside math delimiters.

Internal solver evidence may retain plain machine-readable equations when required for fingerprints, validators or exact regression comparisons. A user-facing field must be formatted at the package boundary.

## Rendering surfaces

The student application uses `QuestionRichText` with MathJax. The canonical admin application uses `MathRenderingProvider`, which processes the same delimiters across:

- Question Studio;
- Question Bank and question detail;
- content review;
- test builder and test QA;
- generated-item original/version previews.

Raw LaTeX remains editable inside inputs and textareas. Preview text is typeset.

## Validation requirements

A production-ready Quant package must verify:

1. no known raw ASCII formula remains in visible content;
2. inline and display delimiters are balanced;
3. the solver retains a delimiter-free TeX authority field;
4. options and correct-answer semantics are unchanged by formatting;
5. explanation text still contains the verified answer;
6. the student and admin builds complete successfully.

## First verified package checkpoint

`PNC-001` is the first package to enforce this contract at runtime.

Verified on 2026-07-25:

- 106 English QLs;
- 1,272 deterministic runtime-proof cases;
- 5,300 package stress cases;
- zero raw permutation/combination tokens in visible output;
- zero split multiplication or equality operators between MathJax blocks;
- zero malformed chained bounds;
- zero raw factorial quotient slashes in the 106-row review export;
- complete admin tests and build: PASS;
- student build and combined hosting output: PASS;
- Render production build: PASS.

Other Quant V4 packages should adopt the same package-boundary formatting and validation pattern rather than duplicating UI-specific transformations.
