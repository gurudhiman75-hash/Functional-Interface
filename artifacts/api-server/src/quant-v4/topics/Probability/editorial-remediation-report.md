# Probability Editorial Remediation Report

## Result

- Source QLs validated: **216**
- Human-review questions regenerated: **135**
- Unique visible review questions: **135/135**
- PRB-001 review set: **75** questions using the SSC CGL/CHSL profile and four options
- PRB-002 review set: **60** questions using the Banking Mains profile and five options
- Average review explanation length: **78.5 words**

## Student-facing standard

Questions now use direct exam language. Internal enum names, artificial template introductions, unused variables and invalid displayed probabilities are blocked. Singular and plural forms are rendered from the actual number. Difficulty is based on the number of reasoning steps rather than stem length. Exact duplicate visible questions are rejected during review generation; a different valid QL is substituted when necessary.

Explanations now use a visible worked-solution pattern:

1. **Approach:** state the exact probability idea and why it fits.
2. **Numbered working:** establish the sample space, derive any missing value and count the required cases.
3. **Simplification:** reduce the fraction explicitly when reduction is required.
4. **Why this works:** explain why the counting or probability rule is valid.
5. **Answer:** close with the exact required probability or count.

Combination questions explain what is being chosen; replacement, order, overlap and conditional restrictions are stated explicitly. Small sample spaces display their actual outcomes. The object named in the stem remains the same throughout the explanation. Internal QA terminology is never displayed to students.

## Exam profiles

- **SSC CGL/CHSL:** simple probability pool, four options.
- **SSC CGL JSO/Statistics:** full probability pool, four options.
- **Banking Prelims:** selected direct probability pool, five options.
- **Banking Mains:** full probability and counting pool, five options.

## Release status

Human English editorial approval was recorded on **2026-08-08**. The approved English questions are eligible for scored mocks and writable to the Question Bank subject to the per-family `maxPerMock: 1` policy. `PRB-QL-004` and `PRB-QL-010` remain learning-only and are not stored.

Public publication remains disabled. Hindi and Punjabi localisation, multilingual parity review and public-release approval are separate future stages.

Question Studio package metadata and generated batch context are locked to `ENGLISH_MOCK_READY`, `APPROVED_EDITORIAL_ENGLISH`, `WRITABLE` and `ELIGIBLE_WITH_FAMILY_LIMIT`, while preserving `publiclyPublishable: false`.
