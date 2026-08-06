# PNL-001 Multilingual Editorial Reconstruction — Wave 03

## Why this wave exists

Wave 02 passed structural, lexical and duplicate-cluster checks, but a senior manual audit correctly identified that those checks did not prove production-grade teaching quality. In particular, Wave 02 repeated the question prompt inside explanation fields, added rotating prefixes to step titles, hid existing MathJax from the CSV review surface and retained several literal Hindi-style Punjabi constructions.

## Wave 03 authority

Wave 03 is a deterministic reconstruction over the validated Wave 02 libraries. It does not alter solver, parameter, option or answer authority.

### Removed

- verbatim prompt echoes from `opening`, `concept`, `conclusion` and `commonTrap`;
- synthetic uniqueness prefixes from worked-step titles;
- selected literal Hindi-to-Punjabi phrases identified by the senior audit.

### Preserved

- all 186 permanent QL identities in both Hindi and Punjabi;
- all 12 checkpoint-language libraries;
- stem representation topology;
- worked-step count and order;
- every stem, step and final-answer MathJax expression;
- difficulty and difficulty rationale;
- solver, parameter, distractor and publication lifecycle authority.

## Equation-aware review corpus

The Wave 03 review CSV exposes the MathJax already owned by each editorial entry. Each worked step is exported with its body and its `equationLatex`; a separate `equationsLatex` column contains the complete equation sequence, and `finalAnswerLatex` is exported explicitly.

This corrects the Wave 02 review-export defect where a mathematically structured production explanation appeared to contain no symbolic work because the CSV omitted MathJax fields.

## Reviewer state

Wave 03 never auto-approves native language. Rows that pass deterministic checks are marked `AWAITING_HUMAN_REVIEW`; rows with automated blockers are marked `AUTO_REJECTED`. Native Hindi/Punjabi approval remains a manual release gate.

## Release gates

1. deterministic reconstruction test passes for all 372 entries;
2. committed JSON exactly matches the Wave 03 generator;
3. prompt echo count is zero;
4. synthetic step-prefix count is zero;
5. Punjabi literal-translation audit count is zero;
6. MathJax sequence remains identical to English authority;
7. senior human review approves the regenerated CSV before merge.
