# INT-CP-005 — Variable Rates, Growth & Decay — V14 Final Authority

## Final authority

- Canonical problem: `INT-CP-005`
- QLs: `INT-QL-086..INT-QL-095`
- QL count: 10
- Runtime: `INT-CP-005-VARIABLE-GROWTH-DECAY-v14`
- Freeze: `INT-CP-005-EN-HI-PA-v14-frozen`
- Locales: `en-IN`, `hi-IN`, `pa-IN`
- Status: multilingual learner authority frozen; delivery inactive

## QL ownership

| QL | Contract |
|---|---|
| INT-QL-086 | Variable periodic rates — final context value |
| INT-QL-087 | Variable periodic rates — net gain |
| INT-QL-088 | Reverse initial context value |
| INT-QL-089 | Missing periodic rate |
| INT-QL-090 | Periodic depreciation — final value |
| INT-QL-091 | Reverse depreciation |
| INT-QL-092 | Mixed appreciation/depreciation |
| INT-QL-093 | First threshold-crossing period |
| INT-QL-094 | Percentage growth plus fixed migration/event order |
| INT-QL-095 | Compare two variable periodic plans |

## Context-value contract

`INT-QL-086` and `INT-QL-088` use the registry-level semantic `CONTEXT_VALUE`.

The learner display is context-owned:

- investment → INR
- salary → INR
- population → people/count
- production → units

The semantic contract is therefore stable at QL level while the display unit remains faithful to the visible scenario.

## Mathematical hardening

### Threshold crossing — INT-QL-093

The legacy coupled sampler was replaced with an independent deterministic stream. Release guards require broad coverage across:

- both growth and decay directions,
- target years 2–5,
- diverse rate profiles,
- diverse initial values,
- exact integral learner boundaries,
- independent first-crossing verification.

### Plan comparison — INT-QL-095

The legacy low-diversity plan sampler was replaced with an independent deterministic stream. The final authority additionally has deterministic exact-money safety resampling so arbitrary production seeds cannot surface fractional-rupee distractor states.

A release regression explicitly covers the formerly failing seed `int-cp005-v7-audit-INT-QL-095-4`, and the hardened release audit includes 500 additional arbitrary plan seeds.

## Learner-surface standard

- native English/Hindi/Punjabi stems,
- formula-first question-specific explanations,
- Examtree MathJax `\(...\)` / `\[...\]`,
- no legacy dollar delimiters,
- misconception-owned distractors,
- context-aware final-answer wording,
- Punjabi compound-interest terminology standardized to `ਮਿਸ਼ਰਤ ਵਿਆਜ`,
- salary-growth, depreciation and threshold feedback use the correct domain language,
- high-value salary contexts use a realistic senior-executive framing,
- population and production options never display currency,
- investment and salary options retain INR formatting.

## Final review pack

The V14 exporter produces 40 questions per locale, 120 total:

- 4 examples per QL,
- answer positions A/B/C/D balanced 10/10/10/10 per locale,
- no duplicate review stems,
- all 10 QLs represented in every locale.

The exported Markdown was independently scanned for the defects discovered during implementation, including duplicate people nouns, English localization leaks, raw/legacy math delimiters, awkward population grammar, and incorrect context-value units.

## Freeze proof

The immutable V14 freeze audit replays 100 seeds × 10 QLs × 3 locales = 3,000 frozen questions and proves:

- learner-content identity to V14,
- mathematical-state/fingerprint/solution identity,
- option value and misconception identity,
- independent verifier ownership for every option,
- `CONTEXT_VALUE` semantic preservation for QL-086/088,
- closed lifecycle at both question and frozen-lifecycle levels,
- recursive object immutability,
- mutation rejection.

## Delivery lifecycle

The final frozen authority remains deliberately inactive:

- `enabled: false`
- `stagingStatus: NOT_STAGED`
- `registrationStatus: NOT_REGISTERED`
- `questionStudioDiscoverable: false`
- `questionBankStatus: NOT_STORED`
- `testEligibility: INELIGIBLE`
- `publiclyPublishable: false`

No Question Studio registry/provider/route activation is part of CP005 completion.
