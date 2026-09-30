# Data Interpretation Hindi/Punjabi Coverage Audit V1

Audit date: 2026-09-30
Scope: learner-facing Hindi (hi-IN) and Punjabi (pa-IN) coverage for DI-001 through DI-014.

## Findings

| DI package | Hindi/Punjabi state | Audit note |
|---|---|---|
| DI-001 | Frozen for controlled review | All 10 permanent task families have localized prompts, explanations, table labels and working surfaces. |
| DI-002 | Frozen for controlled review | All 12 permanent task families have localized prompts, explanations and table labels. |
| DI-003 | Frozen for controlled review | Grouped-bar labels and task text are localized. Existing review checks include visible chart-text script and semantic parity. |
| DI-004 | Two-series scope frozen; remaining variants are review candidates | DI-QL-109 through DI-QL-120 remain frozen. Single-series and three-series variants now have Hindi/Punjabi Question Studio candidates requiring language review. |
| DI-005 | Frozen for controlled review | Pie-chart labels, category answers and accessibility text are localized. |
| DI-006 | Frozen for controlled review | All 12 task families and caselet prose are localized. The status page's stale pending-approval note has been removed; the generator test already asserts HI_PA_FROZEN. |
| DI-007 | Frozen for controlled review | Missing-value recovery prompts and explanations are localized. |
| DI-008 | Frozen for controlled review | All 12 task families and 144 object labels have Hindi/Punjabi surfaces. |
| DI-009 | Frozen for controlled review | Histogram labels, task text and explanations are localized; the status file records integer and rounding requirements. |
| DI-010 | Frozen for controlled review | Frequency-polygon labels, task text and working tables are localized. |
| DI-011 | Hindi/Punjabi review candidate | All 5 mixed-representation pairs and 10 question families expose hi-IN/pa-IN candidates with localized visible chart labels and explanations. |
| DI-012 | Hindi/Punjabi review candidate | All 7 recovery models and 10 question families expose hi-IN/pa-IN candidates with localized table labels and conditions. |
| DI-013 | Hindi/Punjabi review candidate | Radar chart labels, categories, stems, options and explanations expose hi-IN/pa-IN candidates. |
| DI-014 | Hindi/Punjabi review candidate | Radar/pie labels, categories, stems, answer options and explanations expose hi-IN/pa-IN candidates. |

## Existing quality evidence

DI-001 through DI-010 retain their prior frozen scopes, including DI-004's permanent QLs DI-QL-109 through DI-QL-120. DI-004 single-/three-series variants and DI-011 through DI-014 now expose Hindi/Punjabi review candidates with deterministic replay and answer-parity checks. These new candidates have not been frozen or approved for production; native-language review remains required.

## Chapter-level gate

Hindi/Punjabi are frozen for the approved scopes of DI-001 through DI-010. DI-004 single-/three-series and DI-011 through DI-014 are multilingual review candidates only and need native-language approval before a freeze. Question Bank, scored tests, mocks, student/publication and production-release gates are not changed by this audit.
