# PNL-001 Multilingual Lexical Naturalness — Wave 01 Report

## Result

The first Hindi/Punjabi lexical-naturalness wave is complete across the full committed PNL-001 Editorial V2 corpus.

```text
Native libraries:                 12
Hindi entries:                   186
Punjabi entries:                 186
Total native entries:            372
Fatal structural findings:         0
Lexical-review findings before:    76
Lexical-review findings after:      0
Editorial repetition findings:    108
Lifecycle changes:                  0
```

## Corrected learner wording

The shared contextual-note authority no longer uses the abstract phrases:

- Hindi `व्यावसायिक क्रम`;
- Punjabi `ਵਪਾਰਕ ਕ੍ਰਮ`.

The note now tells the learner to read the given purchase, expense and sale information in order.

`PNL-QL-078` and `PNL-QL-091` also no longer use Hindi `अज्ञात समूह`. They now describe the concrete group whose percentage or missing rate must be found. Matching Punjabi prompts were rewritten naturally rather than translated word for word.

## Source discipline

The corrections were made in:

- the shared multilingual normalizer authority;
- the Hindi and Punjabi CP-003 question-language sources for `PNL-QL-091`.

All six Hindi and all six Punjabi committed Editorial V2 libraries were regenerated from the updated source authority. Source parity and native rendering remained valid.

## Permanent regression

`pnl-001-multilingual-lexical-naturalness.test.ts` now proves:

- exactly 12 native libraries and 372 entries;
- absence of `व्यावसायिक क्रम`;
- absence of `ਵਪਾਰਕ ਕ੍ਰਮ`;
- absence of `अज्ञात समूह`;
- expected natural Hindi/Punjabi wording for `PNL-QL-078` and `PNL-QL-091`.

The permanent multilingual editorial workflow is read-only and now triggers for changes to:

- committed Hindi/Punjabi Editorial V2 libraries;
- multilingual normalizer authority;
- Hindi/Punjabi question-language sources;
- the lexical regression;
- the multilingual audit source.

It rejects either structural blockers or a regression of the frozen zero-finding lexical baseline.

## Hosted proof

```text
Workflow:   Apply PNL Multilingual Lexical Naturalness Wave 01
Run:        30557841733
Conclusion: PASS
Artifact:   8765563129
Digest:     sha256:ba3bda7cd97e248fa26d181aaca1213050061e8be9d77b26604644b2de1c9cdc
```

The successful run regenerated all 12 native libraries and passed:

- multilingual source contract;
- native rendering;
- committed-source parity;
- lexical-naturalness regression;
- complete 372-row multilingual audit;
- validated learner-content commit.

An earlier proof run, `30557603262`, also passed every content and audit check. Its final push alone was rejected because the GitHub Actions token could not update a workflow file. That permission-only failure did not affect the validated learner-content result. Its artifact was `8765457920` with digest `sha256:65c23b36eaee1851ead7e30eb1b9f6f02afa139a403873ade741ea2bd55758dd`.

## Remaining editorial work

The audit still reports 108 non-fatal editorial repetition findings:

- 48 repeated step-title clusters;
- 24 repeated common-trap clusters;
- 24 repeated conclusion clusters;
- 10 repeated opening clusters;
- 2 repeated concept clusters.

These require targeted natural-language diversification. They are not structural, mathematical or runtime failures.

## Safety boundary

No solver, answer semantic, option lifecycle, Question Studio route, shared generation route, Question Bank status, test eligibility or publication metadata changed. The chapter remains outside unrestricted Question Studio integration, and generated candidates remain unreviewed, not stored, test-ineligible and non-public.
