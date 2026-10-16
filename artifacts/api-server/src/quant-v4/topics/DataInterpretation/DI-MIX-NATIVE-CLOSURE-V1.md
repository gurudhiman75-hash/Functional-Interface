# DI-MIX-001 Hindi/Punjabi implementation V1

Date: 2026-10-16. Status: **NATIVE CONTROLLED-REVIEW CANDIDATE**.

This implements Hindi and Punjabi delivery for the existing 23-mode DI novelty mix across SSC CGL Tier I, Banking Prelims and Banking Mains. It extends the English technical closure in `DI-NOVELTY-EDGE-CLOSURE-V2.md`; it does not confer human native approval or authorize public delivery.

## Scope

- The mix accepts `en`, `hi`, `pa` and their `-IN` aliases. Its package card advertises the three languages with separate native candidate status.
- Seven previously English-only branches now have authored native stems, chart/table labels, category answers and worked explanations: single and stacked bars, fully visible and comparative pies, donut, advanced caselets and advanced arithmetic domains. Existing native source authorities supply the other modes.
- English remains the deterministic selection authority for duplicate repair. Different translated phrasing must not change selected source questions, difficulty, task kind or answer position. Native learner-item uniqueness is independently checked using the actual translated stem and stimulus. Temporary selection fingerprints are removed before returning questions.
- Native mix question IDs carry a language suffix; source IDs and source review status remain traceable. Native mix status is `NATIVE_MIX_REVIEW_CANDIDATE`; extension-source status is `HI_PA_REVIEW_CANDIDATE`. Existing frozen base QLs retain their source authority.
- Native SVG/table rendering includes donut-center and arithmetic-table headings. Source numerical data and answer positions are preserved.

## Demonstrated source defect

The advanced ratio-network caselet stored the proportions `3:4:5:2:6` but omitted the relation determining the fifth category. Its total and first three relations left a free parameter. English and native learner text now explicitly state that the fifth category is twice the first. The total therefore determines `k = total/20` and all five values uniquely. No stored values or answer keys changed.

## Executable evidence

- `native-extension-v1.test.ts`: 14,000 native source questions across 200 seeds per source family and both languages; 58 task kinds, five caselet topologies and six arithmetic domains. Checks cover unchanged numeric state, source immutability, native learner text/working, translated category answers and render headings. Thirty-six ratio-network states independently verify the repaired equations.
- `di-mix-native-v1.test.ts`: 6,726 selected native questions across three profiles and counts 1, 20, 100 and 1,000; all 23 source modes. Checks compare same-seed source selection, task, difficulty and correct position with English, exact quotas, native learner-item uniqueness, language IDs, deterministic replay and lifecycle restrictions. Additional probes cover the demonstrated DI-002 translation collision, locale aliases, invalid languages and explicit difficulty.
- The existing DI regression suite covers source generators, adapters, allocation boundaries, Mains depth/diversity and independent linked-chart answers. Obsolete English-only rejection cases now use unsupported languages. DI-012's stale localization test now checks the displayed hidden cell's row/column rather than an obsolete bare-variable sentence or identical explanation-step count.
- The novelty/edge CI workflow runs both native audits and uploads their logs with the existing proofs.
- Standalone type traversal has the same three pre-existing diagnostics as the parent revision: DI-001 task-difficulty coverage and two DI-004 tuple-inference errors. No new diagnostics were found. Global type checking is not claimed clean.

## Review boundary

Question Bank writes, test/mock eligibility, public publication, automatic student delivery and production release remain disabled. Manual approval remains required. Human Hindi/Punjabi wording review and live UI verification remain pending. This closure records implemented and technically tested coverage only.
