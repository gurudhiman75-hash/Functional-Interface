# ANA-001 Multilingual Completion

Status: **COMPLETE AT REVIEW-ONLY RUNTIME MATURITY — QUESTION STUDIO DEFERRED**.

## Implemented chapter frontier

| Checkpoint | Permanent QLs | Count | English | Hindi | Punjabi |
|---|---:|---:|---|---|---|
| ANA-CP-001 and ANA-CP-002 | `ANA-QL-001..060` | 60 | runtime | runtime | runtime |
| ANA-CP-003 | `ANA-QL-061..108` | 48 | runtime | runtime | runtime |
| ANA-CP-004 | `ANA-QL-109..140` | 32 | runtime | runtime | runtime |
| ANA-CP-005 | `ANA-QL-141..160` | 20 | runtime | runtime | runtime |
| ANA-CP-006 | `ANA-QL-161..208` | 48 | runtime | runtime | runtime |
| ANA-CP-007 | `ANA-QL-209..222` | 14 | runtime | runtime | runtime |
| ANA-CP-008 | `ANA-QL-223..250` | 28 | runtime | runtime | runtime |
| **Total** | **`ANA-QL-001..250`** | **250** | **complete** | **complete** | **complete** |

ANA-CP-009 remains a source-research checkpoint with zero permanent QLs. It therefore creates no untranslated runtime gap.

## Meaning of multilingual completion

For every implemented QL, the chapter has:

- deterministic English generation;
- deterministic Hindi generation;
- deterministic Punjabi generation;
- answer, option, rule and hidden-state parity across languages;
- four unique options with exactly one correct answer;
- native-script stems and explanations;
- no silent English fallback for instructional text;
- no unresolved template placeholders;
- checkpoint-specific localized runtime audits;
- review-only publication safety.

Latin alphabet clusters, mathematical symbols and numbers remain unchanged where they are the actual puzzle data. This is intentional and is not language fallback.

## Punjabi editorial policy

Candidate-facing Punjabi uses natural wording such as:

- `ਸ਼ਬਦ` for a word or visible item;
- `ਜੋੜਾ` for a pair;
- `ਖਾਲੀ ਥਾਂ` for the missing place;
- `ਸਹੀ ਜਵਾਬ` for the answer;
- `ਇੱਕੋ ਨਿਯਮ` for the shared rule.

Avoidable textbook-style terms such as `ਪਦ` and `ਸਾਦ੍ਰਿਸ਼ਤਾ` are prohibited by the chapter-wide source audit. Standard school mathematical terms such as `ਵਰਗ`, `ਵਰਗਮੂਲ`, `ਘਣ` and `ਘਣਮੂਲ` remain allowed where mathematically required.

## Completion gate

The dedicated chapter workflow runs:

1. strict TypeScript over the entire ANA-001 TypeScript surface;
2. the chapter-wide range and source-language audit;
3. the CP-001/002 localized runtime proof;
4. the CP-003 localized runtime proof;
5. the CP-004 localized runtime proof;
6. the CP-005 localized runtime proof;
7. the CP-006 localized runtime proof;
8. the CP-007 localized runtime proof;
9. the CP-008 localized runtime proof;
10. the Render production build regression.

A multilingual completion claim is valid only when all dedicated Analogy gates pass on the same exact PR head.

## Deferred integration boundary

This completion does not connect Analogy to Question Studio and does not enable Question Bank writes, mock-test eligibility or public student delivery.

Current safety state:

```text
maturity: REVIEW_ONLY_RUNTIME_COMPLETE
questionStudioConnected: false
questionBankStatus: NOT_STORED
testEligibility: INELIGIBLE
publiclyPublishable: false
```

Question Studio integration can be added later as a separate reviewed change without reopening QL ownership or multilingual chapter completeness.
