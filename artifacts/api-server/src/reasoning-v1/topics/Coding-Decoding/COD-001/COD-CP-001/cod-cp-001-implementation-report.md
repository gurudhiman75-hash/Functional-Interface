# COD-CP-001 Runtime-Proof Implementation Report

Status: English runtime proof complete and repository CI verified; human editorial approval pending.

## Scope

- Exact QL range: `COD-QL-001` through `COD-QL-024`
- Exact QL count: `24`
- Canonical rules: `4`
- Locale: English (`en-IN`)
- Maturity: `RUNTIME_PROOF`
- Publicly publishable: `false`
- Question Studio discovery: deliberately not wired

## Implemented contracts

- chapter-local deterministic PRNG;
- typed code, prompt, renderer, option and explanation contracts;
- injective direct mappings and inverse decoding;
- four QL blocks of six entries each;
- letter, digit and symbol outputs;
- encode, decode, missing-code and overlap-inference tasks;
- independent solver reconstructed only from displayed evidence;
- rejection of identity, uniform-shift and opposite-alphabet collapses;
- evidence coverage and overlapping-example checks;
- rule-aware distractors and independent option validation;
- exact review exporter;
- 100-seed-per-QL runtime audit.

## Validation executed

The checkpoint source was first compiled with TypeScript in an isolated local harness and the committed test logic was executed with Node. The same committed audit then executed successfully in GitHub Actions through the `Reasoning COD-001 Runtime` workflow on PR #117.

Verified audit result:

- generated questions: `2,400` (`24 QLs × 100 seeds`);
- answer positions: `573 / 606 / 607 / 614`;
- answer-position max/min ratio: approximately `1.072`;
- renderers covered: `EXAMPLE_TARGET_BLOCK`, `INLINE_CODE_PAIR`, `MAPPING_TABLE`;
- task directions covered: encode, decode, overlap inference and missing-code recovery;
- answer types covered: letter cluster, digit sequence, symbol sequence and single token;
- difficulties covered: Easy, Medium and Hard;
- deterministic equality, solver agreement, injectivity, evidence coverage, ambiguity acceptance and option contracts passed for every sampled instance.

Repository workflow result: **success**.

## Repository runtime command

From the repository root:

```powershell
pnpm dlx tsx .\artifacts\api-server\src\reasoning-v1\topics\Coding-Decoding\COD-001\COD-CP-001\cod-cp-001.test.ts
```

The exact runtime review can be produced by importing `exportCodCp001Review` from `export-review.ts` and writing its CSV output to an uncommitted review file.

## Remaining before checkpoint freeze

- inspect the full 24-row exact review export across several seeds;
- tune any weak or overly mechanical stems and distractors;
- record English editorial approval;
- keep localization and Question Studio discovery deferred until English acceptance.
