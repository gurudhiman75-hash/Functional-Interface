# TMW-001 Authoritative Content Lifecycle

This chapter follows the ExamTree approval-first content flow:

```text
TMW-001 runtime generates a deterministic candidate
  → Question Studio displays it for review
  → automated mathematics, option, language and explanation checks run
  → a human reviewer approves, edits or rejects it
  → only an approved immutable instance is stored in the Question Bank
  → test assembly selects approved Question Bank records
  → the student sees the selected question inside an assembled test
```

## Binding rules

- A QL is an internal generation contract, not a student question.
- Runtime output is a Question Studio candidate, not a Question Bank record.
- Questions are not generated live during student tests.
- `RUNTIME_PROOF` means the generator contract is mathematically proven; it does not mean a candidate is approved.
- New runtime candidates begin as `UNREVIEWED`, `NOT_STORED`, `INELIGIBLE` and `publiclyPublishable: false`.
- Test assembly may use only approved Question Bank records.
- The approved bank record must preserve the seed, QL, fingerprint, answer, options, explanation and review metadata needed for exact audit or regeneration.
