# Question Analytics publication-linkage hotfix

The frozen Question Analytics validator requires completed attempt evidence to be explicitly linked to the canonical `assessment.test_publications` record.

The collection route already carried `learning.attempts.test_publication_id` and separately loaded the publication catalogue, but the attempt scan no longer contained the explicit relational join required by the freeze contract. This hotfix restores that join without changing scoring, linkage reconstruction, metrics, or write boundaries.

The admin route literals are also kept in the frozen form expected by the validator; this is formatting-only and does not change routing behavior.
