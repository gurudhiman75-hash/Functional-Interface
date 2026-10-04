# ASM-001 — Assertion and Reason

Standalone Reasoning V1 implementation for `REAS-ASM — Assertion and Reason`.

Current authority:
- permanent QLs: `ASM-QL-001`;
- curated scenarios: 23;
- semantic answer classes: 5;
- presentation profiles: standard 4-option + extended 5-option;
- languages: English, Hindi, Punjabi;
- Question Studio: review-only;
- learner/public release: locked.

The chapter uses curated proposition truth and explanation-link metadata rather than free-form runtime truth generation.

See `ASM-001-FINAL-DEEP-AUDIT-CLOSURE-20261003.md`.

## Post-closure batch capacity

Question Studio selects curated scenarios without replacement inside a batch.

- Mixed: 23 distinct scenarios
- Easy: 9
- Medium: 9
- Hard: 5

All five semantic answer classes are represented at every difficulty. Requests above the available distinct pool fail closed instead of repeating a scenario.
