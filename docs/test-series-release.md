# Canonical Test Series release

The Test Series admin workspace uses the canonical `assessment.test_series`, `assessment.test_series_versions`, and `assessment.test_series_items` tables.

This release provides:

- immutable series versions;
- ordered test membership;
- exam-version consistency checks;
- optional availability windows;
- open, sequential, and score-gated progression policy;
- member-level unlock times, minimum scores, required flags, and title overrides;
- release readiness against canonical test lifecycle status;
- soft archive and restore;
- immutable audit events for create, version, archive, and restore actions.

The admin route does not claim that student delivery is live. Student-facing series discovery, entitlement checks, availability evaluation, progression calculation, and attempt-based unlocking remain a separate production slice.
