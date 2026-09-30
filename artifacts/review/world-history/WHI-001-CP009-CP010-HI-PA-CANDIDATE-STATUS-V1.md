# WHI-001-CP009/CP010 — Hindi/Punjabi Candidate Status V1

**English approval:** Recorded 2026-09-30 for both CP009 and CP010.  
**Localization status:** Four complete 60-record candidates prepared for human language review.  
**Release status:** Review-only; no runtime registration or learner delivery.

## Candidate inventory

| Checkpoint | Locale | Candidate records | Human-readable review | State |
|---|---|---:|---|---|
| CP009 | Hindi | 60 | `WHI-001-CP009-HI-LOCALIZATION-REVIEW-V1.md` | Native review pending |
| CP009 | Punjabi | 60 | `WHI-001-CP009-PA-LOCALIZATION-REVIEW-V1.md` | Native review pending |
| CP010 | Hindi | 60 | `WHI-001-CP010-HI-LOCALIZATION-REVIEW-V1.md` | Native review pending |
| CP010 | Punjabi | 60 | `WHI-001-CP010-PA-LOCALIZATION-REVIEW-V1.md` | Native review pending |

The locale JSON follows the established `knowledge-v1` localized-record architecture used by CP016. Each locale record has a suffixed ID, English question linkage, checkpoint and canonical fact IDs, localized family/stem/options/explanation, unchanged difficulty and source IDs, the same answer key, and review-only lifecycle flags.

## Verification performed

- 60/60 record count and unique IDs in each locale pool.
- Item-by-item parity for English question linkage, fact and checkpoint IDs, difficulty, keyed option order, correct answer, and source IDs.
- Nonempty localized stem, four options, and explanation for every record.
- Review markdown rendered from the same locale records and includes stem, all options, answer, explanation, and sources.

Structural parity does not certify translation fluency. Native Hindi and Punjabi reviewers must check natural exam wording, grammar, terminology, and explanation clarity before approval. Correct any issues while preserving the English canonical facts and answer semantics.

## Release gate

Do not register these candidates in Question Studio or expose them to learners yet. After native review and corrections, rerun parity checks; then use the existing shared Question Studio review-only adapter and keep student publication disabled until approval.
