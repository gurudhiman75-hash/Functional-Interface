# BTD-001 CP007 localization status

Status: HI/PA review candidate only. Not frozen. Not Question Studio enabled.

Authority chain:
- CP005 English content remains frozen and immutable.
- CP006 English Question Studio remains review-only with downstream delivery locked.
- CP007 derives Hindi/Punjabi learner surfaces from the same deterministic source state and preserves frozen English option order, correct answer, correct index, option ownership and misconception metadata.

Correction trace:
- v2 localized stems/explanations preserved source-state and English-content fingerprints, but its exported `options` field accidentally flattened rich option objects to text strings.
- v3 restored the full option contract (`text`, `isCorrect`, optional `misconceptionId`) without changing source states or mathematics.
- v4 added evidence-based anti-thin-pool coverage, native Hindi/Punjabi stem grammar polish, deterministic content-fingerprint semantics, and native calculation lead-ins.
- v5 localized remaining learner-facing time units/formula vocabulary and replaced rounded intermediate proxies with exact reproducible working expressions.
- V7 audit caught QL019 losing the explicit `BD/TD` conceptual relation during exact-working rewrite; the runtime now shows `x = BD/TD − 1 = ...` directly and preserves the concept as well as the arithmetic.

Exact-head V7 certification evidence:
- validated head before cleanup: `084bc7219982b0d7512a79630a380dffad717fe2`
- workflow run: `33238634034`
- artifact: `9710696500`
- artifact digest: `sha256:d94ae109a41bbe4ce645b7dce16d54242af1de774a65d5e46bdd7036c9bb2dcf`
- 20 permanent QLs × 2 languages × 100 seeds = 4,000 localized packages per audit layer.
- base localization audit: 28,000 option-parity checks, 16,000 misconception checks, 16,000 semantic checks, 20,000 script checks, 36,000 explanation checks, 48,000 learner-token checks, 6,000 naturalness checks, 8,000 display-localization checks.
- diversity: 93.825% chapter-wide unique-stem rate; minimum 84/100 unique stems in every QL-language scope; maximum exact-stem frequency 4; all three stem families reached in every scope.
- exact-working pass: 40,000 invariant-surface checks, 4,000 deterministic checks, 10,200 exact-working checks, 24,000 native-step checks, 8,000 residual-English checks, 32,000 lifecycle checks.
- regenerated review corpus: 120 questions, covering every QL × language × stem-family combination; reviewed after V7 green, including date/grace-day, weighted two-bill, inverse rate/time and BD/TD relation families.
- API build and exact-head assertion passed.

Release boundary:
- localizationStatus: `HI_PA_REVIEW_CANDIDATE`
- multilingualFrozen: false
- questionStudioDiscoverable for HI/PA: false
- questionStudioGenerationEnabled for HI/PA: false
- questionBankWritable: false
- testEligible: false
- mockTestEligible: false
- publiclyPublishable: false

Promotion requires explicit review/approval. This checkpoint does not itself freeze multilingual content or open any downstream delivery surface.
