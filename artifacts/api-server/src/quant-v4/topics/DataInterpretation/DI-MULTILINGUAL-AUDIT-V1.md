# Data Interpretation Hindi/Punjabi Coverage Audit V1

Audit date: 2026-09-29
Scope: learner-facing Hindi (hi-IN) and Punjabi (pa-IN) coverage for DI-001 through DI-014.

## Findings

| DI package | Hindi/Punjabi state | Audit note |
|---|---|---|
| DI-001 | Frozen for controlled review | All 10 permanent task families have localized prompts, explanations, table labels and working surfaces. |
| DI-002 | Frozen for controlled review | All 12 permanent task families have localized prompts, explanations and table labels. |
| DI-003 | Frozen for controlled review | Grouped-bar labels and task text are localized. Existing review checks include visible chart-text script and semantic parity. |
| DI-004 | Review candidate | Localization exists, but the status file still requires human approval before freeze. |
| DI-005 | Frozen for controlled review | Pie-chart labels, category answers and accessibility text are localized. |
| DI-006 | Frozen for controlled review | All 12 task families and caselet prose are localized. The status page's stale pending-approval note has been removed; the generator test already asserts HI_PA_FROZEN. |
| DI-007 | Frozen for controlled review | Missing-value recovery prompts and explanations are localized. |
| DI-008 | Frozen for controlled review | All 12 task families and 144 object labels have Hindi/Punjabi surfaces. |
| DI-009 | Frozen for controlled review | Histogram labels, task text and explanations are localized; the status file records integer and rounding requirements. |
| DI-010 | Frozen for controlled review | Frequency-polygon labels, task text and working tables are localized. |
| DI-011 | No localization | Current review candidate is English-only. |
| DI-012 | No localization | Current review candidate is English-only; localization remains a future gate. |
| DI-013 | No localization | Current review candidate is English-only; the status file says localization has not started. |
| DI-014 | No localization | Current review candidate is English-only. |

## Existing quality evidence

For DI-001 through DI-010, existing localization review tests exercise Hindi and Punjabi surfaces, deterministic replay, learner-language script checks, and numeric/answer parity with the English authority. The package status files record each package's task and visual-label coverage. These checks do not constitute a new independent linguistic certification; DI-004 remains explicitly pending human approval.

No source change was made to localized question content in this audit. The review found one documentation contradiction (DI-006's already-frozen test state versus a stale approval-pending note), corrected in this change.

## Chapter-level gate

Hindi/Punjabi are available for controlled review only in DI-001 through DI-010, with DI-004 still a review candidate. DI-011 through DI-014 need a separate localization build and review before they can be described as multilingual. Question Bank, scored tests, mocks, student/publication and production-release gates are not changed by this audit.
