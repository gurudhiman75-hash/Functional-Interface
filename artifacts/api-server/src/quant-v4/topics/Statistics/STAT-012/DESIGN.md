# STAT-012 — Analysis of Variance

This controlled-review package covers one-way ANOVA, including calculation from raw observations; additive randomized-block ANOVA; replicated two-way interaction degrees of freedom, sums of squares and F tests; interaction interpretation; post-hoc follow-up; classical assumptions; and a residual variance diagnostic.

Twenty-two permanent QLs use STAT-QL-140–151, STAT-QL-185–190, and STAT-QL-201–204 for SSC CGL Tier II and JSO. The randomized-block example has blocks as rows and treatments as columns. The unreplicated residual-df formula `(a−1)(b−1)` and its usual F tests assume an additive model: interaction cannot be separated from error without replication. The replicated example is a balanced 2×2 design with two observations per cell.

Critical-value decisions use supplied values. A significant omnibus test means at least one population mean differs; it does not identify pairs. Increasing residual spread suggests unequal variances and does not itself diagnose normality or independence. Numerical explanations distinguish rounded approximations from exact results.

This pass addresses classical foundation coverage. Repeated measures, mixed models, robust alternatives and further post-hoc procedures remain outside this pass. Question diversity and numerical pool expansion are deferred to the later pass requested by the user. Editorial approval of the new review candidate remains pending. Question Bank, test/mock use, localization, public publication and production release remain disabled.
