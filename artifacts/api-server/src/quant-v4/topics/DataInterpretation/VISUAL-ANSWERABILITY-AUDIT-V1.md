# Data Interpretation Visual Answerability Audit V1

Status: REMEDIATION_CANDIDATE

## Audit question

For every Data Interpretation CP, can a learner derive each answer from the stimulus that is actually rendered, without relying on hidden semantic state?

Numeric correctness alone is not sufficient. A chart/table/caselet must expose every datum required by the question at readable precision.

## CP classification

| CP | Representation | Visual-answerability status | Reason |
|---|---|---|---|
| DI-001 | Table | PASS_BY_CONTRACT | Source values are printed in the learner table. |
| DI-002 | Advanced table with one recoverable missing cell | PASS_BY_CONTRACT | Visible selected count + selection rate reconstruct the one missing Applicants value. |
| DI-003 | Grouped bar | PASS_WITH_EXISTING_PROOF | Stress test already requires every generated bar value to appear as an explicit y-axis label. |
| DI-004 | Two-series line graph | FIXED_ON_DI004_REVIEW_BRANCH | Exact plotted values are exposed at each point because generator granularity is finer than practical axis ticks. |
| DI-005 | Pie chart | PASS_WITH_STRENGTHENED_PROOF | Five sector labels are visible, exactly one intentional percentage may be hidden, and the total is printed for count tasks. |
| DI-006 | Caselet/prose | PASS_BY_CONTRACT | Questions derive from learner-facing stated values and relations, not a graphical scale. |
| DI-007 | Missing-value table | PASS_BY_CONTRACT | The missing value is recoverable from the learner-facing aggregate condition. |
| DI-008 | Arithmetic table | PASS_BY_CONTRACT | All row inputs used by arithmetic tasks are printed in the table. |
| DI-009 | Histogram | REMEDIATED_IN_THIS_BRANCH | Frequencies are generated in 5/10-unit granularity; renderer now selects a y-axis step that explicitly labels every generated frequency. |
| DI-010 | Frequency polygon | REMEDIATED_IN_THIS_BRANCH | Frequencies are generated in 5/10-unit granularity; renderer now selects a y-axis step that explicitly labels every plotted frequency. |

## Permanent gate

Visual DI must satisfy both:
1. semantic arithmetic/answer verification; and
2. rendered-stimulus answerability.

For bar, histogram and polygon representations that do not print values directly, every exact value used by a question must land on a printed axis label. If this cannot be achieved without an unreadable axis, the renderer must expose the value at the mark instead.

Pie charts must visibly expose every non-hidden share plus the total required for count conversion. Hidden values are permitted only when the learner-facing chart contains enough visible information to reconstruct them.

Tables/caselets must not reference values that exist only in internal evidence/semantic state.

## Release rule

A DI CP with a rendered-stimulus answerability failure is BLOCKED even if:
- its independent arithmetic verifier passes;
- options/correctIndex are valid; or
- semantic state is deterministic.
