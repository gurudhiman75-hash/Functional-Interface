# ARG-001 CP008 Real-Paper Closure Status

Status: **FROZEN / CERTIFIED**

- Chapter: `ARG-001` — Statement & Arguments
- Subject code: `REAS-ARG`
- Checkpoint: `ARG-CP-008`
- Freeze authority: `ARG_CP008_REAL_PAPER_CLOSURE_V1`
- Preserved core authority: `ARG_CP006_IMMUTABLE_FREEZE_V1`
- Closed additive parity authority: `ARG_CP007_REAL_PAPER_PARITY_V2`

## Certified closure

CP008 freezes the additive real-paper parity layer without rewriting the CP006 semantic/localization/runtime core. It pins the exact CP007 generator, ARG-specific Question Studio real-paper route, and CP007 certification proof, while CP006 continues to pin its 29 authority files byte-for-byte.

Certified real-paper profiles:

1. `SSC_RECENT_2X4` — recent SSC/state-style 2-argument, 4-option
2. `BANKING_CLASSIC_2X5` — classic banking 2-argument, 5-option
3. `BANKING_COMBO_3X5` — banking 3-argument combination, 5-option
4. `BANKING_COMBO_4X5` — banking 4-argument combination, 5-option

All four profiles are available across the supported difficulty bands defined by CP007, with `en-IN`, `hi-IN`, and `pa-IN` semantic parity. The six permanent QLs remain unchanged.

## Certification evidence

The CP008 closure gate passed:
- strict TypeScript contract validation
- exact CP007 post-CP006 blob freeze
- CP008 behavioral closure proof
- CP007 real-paper parity proof
- exact 29-file CP006 byte freeze
- CP006 behavioral freeze
- CP005 Question Studio regression proof
- production API build
- production admin build

## Lifecycle boundary

Question Studio remains **review only** and manual approval remains mandatory. CP008 closes chapter development / real-paper parity; it does not admit questions to learner delivery.

Still locked:
- persistence outside review runs
- Question Bank writes
- test eligibility
- mock-test eligibility
- public publication
- automatic learner publication
- learner release

Any future change to the frozen CP007 profile/runtime layer must explicitly supersede `ARG_CP008_REAL_PAPER_CLOSURE_V1`. Any change to the CP006 core must separately supersede `ARG_CP006_IMMUTABLE_FREEZE_V1`.
