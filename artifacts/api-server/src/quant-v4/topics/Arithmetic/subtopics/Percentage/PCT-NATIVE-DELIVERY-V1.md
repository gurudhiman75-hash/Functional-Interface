# Percentage native Question Studio delivery V1

Date: 2026-10-16. Status: **NATIVE REVIEW CANDIDATE — HUMAN APPROVAL PENDING**.

The 11 October Quant reconciliation recorded Percentage's English-only capability cards as an unresolved follow-up. This pass verifies and connects existing Hindi/Punjabi runtimes for PCT-001–007, preserving the existing 1,950 authored QL identities and 66 checkpoints. It adds no new mathematical families or QLs and does not claim that repeated structural companions are independently authored questions.

## Demonstrated delivery defects

- Individual package metadata and its language gate rejected Hindi/Punjabi despite existing localized libraries. The legacy PCT-ALL route bypassed that gate and had no explicit native review contract. Both now advertise the supported languages and return native candidates with explicit downstream locks.
- PCT-005 translated its count label before applying an English-label integer constraint. The same seed could therefore use different numeric data in each language. Count constraints now run on the English mathematical state before presentation labels are localized.
- PCT-007 used translated units to choose number pools and identify discrete counts. It now uses the canonical context unit for these mathematical decisions and keeps localized labels for presentation.
- PCT-006's equal-after-change answer branch retained an English sentence in native explanations. It now has explicit Hindi/Punjabi tie answers.
- PCT-007's native worked explanations retained English labels inside visible MathJax expressions. The existing formulas and numerical calculations now carry native labels.
- Two existing PCT-005 English stems used article-sensitive `a {wholeLabel}` wording. They now use `the {wholeLabel}`. A stale PCT-002 regression expected only two shared QLs per checkpoint; it now verifies complete English/native library coverage.

## Verification

- `native-delivery-v1.test.ts`: 11,700 native source questions, covering 1,950 QLs × three seeds × two languages. Every QL validates; numerical variable state and solver evidence match English; numerical answers match and textual-answer magnitudes are preserved. Native stems, explanation/formula labels, answer-option binding and review locks are checked. Review projection must not mutate source packages.
- `native-adapter-v1.test.ts`: 3,188 native questions through shared delivery, covering all 66 checkpoint routes in SSC CGL Tier I, Banking Prelims and Banking Mains, plus 1,000-question PCT-ALL batches in each native language. Checks cover QL selection, answer positions, four/five-option contracts, language metadata, replay, identity uniqueness and lifecycle locks.
- Existing active PCT-001–007 source regressions pass. The broader 47-file historical test scan yielded 42 passing files after the active fixes and correcting one test's working directory. Five historical harnesses remain outside the active delivery gate: PCT-X's broken import and Vitest harness, PCT-002's Vitest harness (standalone Node cannot resolve the runner), and two PCT-001 question-definition readiness/CSV-snapshot expectations. Those historical failures are not represented as clean.
- Scoped TypeScript checking retains two existing shared generic-write diagnostics in `common/language-coverage.ts` and `common/percentage-label-localization.ts`; no diagnostics remain in the changed source/helper files. Hosted API build and shared-delivery proofs are separate gates.
- An unchanged-parent reproduction confirmed that the PNL integration fixture still assumed an implicit Bank-write approval. Its regression now verifies rejection without the explicit write flag, uses a test-only explicit approval for its positive case, and retains its dynamic-runtime rejection. No PNL runtime or release authority changed.
- CI bundles both new audits and all seven active Percentage source regressions, and uploads their logs.

## Review and release boundary

Native source and preview packages have language-qualified review identities with source IDs retained. Their runtime/review state is `REVIEW_ONLY` / `NATIVE_REVIEW_CANDIDATE`. Bank writes, scored tests, mocks, automatic student delivery, public publication and production release remain disabled; manual approval remains required. English source generation remains under its existing authority.

PCT-006/007's structural companion wording, broad diversity/editorial assessment and human native approval remain pending. This implementation verifies technical generation, parity and integration; it does not certify final human wording quality or publisher saturation. Live UI verification stays deferred.
