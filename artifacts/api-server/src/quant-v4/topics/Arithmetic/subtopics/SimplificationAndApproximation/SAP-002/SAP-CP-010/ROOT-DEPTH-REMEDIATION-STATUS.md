# SAP-CP-010 Root-Depth Remediation Status

This stacked review candidate addresses the product-review findings that root states were too concentrated beside perfect powers and that raw Unicode radicals did not provide a scoped vinculum.

Current requirements:
- square/cube/fourth-root interval states span multiple positions across the full interval;
- nearest-root states occur on both sides of the half-way boundary;
- derived root products/quotients and inverse states use materially varied root positions;
- learner-facing radicals use scoped LaTeX rather than raw `√`, `∛` or `∜` strings;
- all candidate QLs remain provisional and every delivery lifecycle flag remains OFF;
- no freeze or activation occurs before the exhaustiveness audit and explicit product-owner approval.

The first executable run caught an API export issue. The next run caught a real QL-175 distractor collision at seed 22; the generator was corrected with a guaranteed-distinct misconception option without relaxing authority requirements.
