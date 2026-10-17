# Banking Number Series — displayed numeric contract audit

Scope: post-freeze verification of the implemented BNS V3 learner package. This
does not reopen the existing mathematical grammar authority or certify new PYQs.
Live verification remains deferred to the user.

## Reproduced defects

The independent verifier used JavaScript numeric conversion without first
validating all displayed numeric fields. A valid missing-term question continued
to pass when a displayed number became a numeric string, or when its answer and
correct option were replaced with equivalent hexadecimal text. Invalid distractor
text could also survive because it simply failed to match a grammar. Wrong-term
choices were not required by the verifier to belong to the displayed series.

## Correction

- All non-placeholder series entries must be finite, positive numbers.
- Every choice must be finite, positive decimal text; hexadecimal, whitespace,
  negative and nonnumeric choices are rejected before arithmetic verification.
- Choices must be distinct numerically as well as textually, preventing two
  spellings of the same value from appearing as separate answers.
- Every wrong-term choice must identify a number displayed in the question.

Independent arithmetic reconstruction still ignores generator arithmetic proof
fields. Legitimate fractional decimal choices, equivalent grammar descriptions,
and the existing multilingual delivery remain supported.

## Regression coverage

The existing BNS test now exercises both an integer foundation grammar and a
fractional advanced grammar across next/missing/wrong tasks and EN/HI/PA.
It checks 18 valid controls and 132 malformed numeric surfaces. This supplements
the existing deterministic, independent-verifier, distractor, multilingual,
source-fixture and Mains audits in the same blocking CI command.

## Source and frequency boundaries

The current source ledger covers two publisher practice pages, not official
PYQs: 19 adjudicated items and one excluded unresolved item. Reinspection of
BankersAdda item 8 on 17 October confirmed that the published series remains
unchanged. No unique correction or source authority is inferred from that fact.
The hold remains in place; this audit does not invent a grammar to admit it.

The twelve-family Mains selector is an implemented technical profile. Neither
the practice-page inventory nor generated question counts establish actual exam
frequency weights. Whole-chapter official-PYQ saturation and exam-frequency
calibration remain unverified. Human language approval is not asserted.

Question Bank, scored tests/mocks and public/student release locks are preserved.

## Validation result

PASS: 4,188 English questions, 6,336 Hindi/Punjabi questions, 288 targeted
Mains checks, 18 valid numeric controls and 132 malformed-surface rejections.
The existing deterministic replays, 19 source fixtures, distractor checks and
wrong-term reconstruction tests remain green. Scoped strict runtime type checking
passed using TypeScript 7.0.2; no project-wide type-clean claim is made.
Reproducible counts are in `bns-source-review/numeric-surface-proof-20261017.json`.

Run the existing CI command:
`npx -y tsx artifacts/api-server/src/quant-v4/topics/SpeedMathematics/BankingNumberSeries/BNS-001/bns-001.test.ts`.
