# ARG-001 — Final Chapter Audit

Date: 2026-09-12
Chapter: Statement & Arguments
Baseline merged authority: PR #1408 / `50b35dd417a1c51ca772061b52da8e35592e8a3c`
Audit branch: `audit/arg-001-final-chapter-audit`

## Verdict

**Chapter engine: INTERNAL-READY / AUDIT PASS AFTER REMEDIATION**

**Public/student release: LOCKED**

The final audit found no chapter-level semantic blocker in the current ARG-001 engine. The engine has substantial semantic depth, deterministic answer authority, trilingual learner-surface gates, profile-aware exam presentation, large deterministic diversity and Question Studio integration. The audit found integration/documentation gaps around state/Railway profile discovery and stale CP006-era documentation; those are addressed on this audit branch while the intentionally frozen CP006 authority itself remains byte-identical.

This verdict is an internal content-engine readiness decision. It is not public-release authorization.

## 1. Audit scope

The audit covered:

- taxonomy separation from adjacent reasoning chapters;
- semantic QL coverage;
- template/archetype depth;
- Easy/Medium/Hard behavior;
- answer-class balance;
- real-exam presentation profiles;
- SSC/state/Railway and Banking applicability;
- stem naturalness and exam feel;
- weak-argument plausibility;
- explanation specificity and beginner readability;
- Hindi/Punjabi naturalness;
- deterministic uniqueness and anti-gaming;
- Question Studio routing/capabilities;
- lifecycle/release boundaries;
- historical freeze and approved-surface preservation;
- production API/admin build compatibility.

## 2. Structural depth

Permanent core contract:

- 6 permanent QLs;
- 8 unique semantic archetypes per QL;
- 48 core templates total;
- Easy, Medium and Hard represented in every QL;
- ONLY_I, ONLY_II, BOTH and NEITHER represented in every QL;
- 4 semantic dimensions per template;
- at least 4 distinct values per dimension;
- at least 256 raw semantic combinations per template;
- at least 2,048 raw semantic combinations per QL.

The final audit adds a permanent structural proof so this depth cannot silently shrink in later work.

## 3. Semantic coverage

The six QLs form a coherent Statement & Arguments progression:

1. direct relevance/materiality;
2. evidence, mechanism and causal support;
3. feasibility and implementation;
4. scope, proportionality and extremity;
5. stakeholder/fairness/rights/public-interest trade-offs;
6. alternatives, counterarguments and second-order effects.

QL006 has eight materially distinct archetypes rather than one generic difficult-question family. It covers alternatives, risk-based alternatives, incentive/evasion effects, proportionality and false dilemmas, displacement, due process, price/access incentives and automated flags.

No additional QL was justified by the final audit. The current six-QL taxonomy is broad enough for the chapter while remaining distinct from Assumption, Conclusion, Course of Action, Cause & Effect and Decision Making.

## 4. Difficulty audit

Difficulty is not merely a vocabulary or sentence-length switch.

- Easy emphasizes obvious relevance, triviality or unsupported-extreme defects.
- Medium uses plausible-looking arguments where the learner must inspect mechanism, feasibility, scope or evidentiary support.
- Hard uses materially related competing considerations, alternatives, proportionality, due process, second-order effects and multi-argument Banking combinations.

The audit therefore found genuine semantic difficulty differentiation.

## 5. Exam-realness and profile coverage

The current canonical profiles are:

- `SSC_RECENT_2X4` — 2 arguments / 4 options, Easy/Medium;
- `BANKING_CLASSIC_2X5` — 2 arguments / 5 options, Medium/Hard;
- `BANKING_COMBO_3X5` — 3 arguments / 5 options, Medium/Hard;
- `BANKING_COMBO_4X5` — 4 arguments / 5 options, Hard.

External calibration confirms that the chapter and two-argument presentation are relevant to SSC/Railway-style reasoning, while Banking-style material can use richer combination formats. The audit did not find evidence that Punjab/Railway require a separate semantic engine.

However, Question Studio previously could not explicitly request Punjab-state or Railway intent even though the certified 2x4 authority was appropriate. The audit therefore adds explicit aliases:

- `RRB_2X4`;
- `RAILWAY_2X4`;
- `PUNJAB_STATE_2X4`;
- `STATE_2X4`.

All route through `SSC_RECENT_2X4`, keeping a single certified semantic source rather than duplicating templates. Unknown profiles remain rejected.

The CP015 capabilities endpoint now exposes the real-paper profile catalog to clients.

Caution: this is a shape/content-family calibration, not a claim that exact Punjab official-paper formatting has been independently proven for every exam conducted in the state.

## 6. Learner-surface quality

The final learner-facing review history fixed defects that automated structural checks alone would not catch, including:

- unnatural English prepositions and arrival wording;
- English QL006 generic/new-device fraud explanations;
- due-process explanations that previously introduced safeguards not present in the actual argument;
- Hindi QL003–QL006 agreement/naturalness and contextual explanation families;
- Punjabi QL004 plural agreement and other reviewed naturalness families.

Current permanent gates cover:

- grammar/plain-language surface;
- explanation-to-argument semantic alignment;
- Hindi naturalness;
- Punjabi naturalness;
- Question Studio registration and lifecycle propagation.

The explanation standard is deliberately argument-specific: the learner should see why this supplied reason is strong or weak, not a generic lesson about strong arguments.

## 7. Diversity and novelty

The certified deterministic 1,000-question audit produces:

- 1,000/1,000 exact-unique full questions;
- 600/600 exact-unique Core;
- 120/120 SSC 2x4;
- 118/118 Banking classic 2x5;
- 108/108 Banking combo 3x5;
- 54/54 Banking combo 4x5;
- all 48 core templates represented;
- 376 unique real-paper statements.

The 216-question trilingual human-review corpus provides 72 English, 72 Hindi and 72 Punjabi samples across all six QLs and relevant profile/difficulty cells.

This gives ARG-001 enough controlled variation to avoid looking like a small bank of paraphrased stems. The semantic archetype system also gives the engine room for novel combinations inside known exam logic.

## 8. Anti-gaming

The current architecture does not infer strength from YES/NO direction or fixed argument position. All four answer classes are deliberately represented, and the deterministic diversity scheduler prevents exact repeats inside the certified cycle.

Weak arguments are intended to remain plausible enough to require reasoning; joke distractors, cosmetic irrelevancies and obvious keyword cues are prohibited by design and reviewed through learner-surface gates.

## 9. Multilingual readiness

English, Hindi and Punjabi are active.

Hindi and Punjabi do not rely only on a generic translation check. Dedicated regression suites exercise reviewed families for naturalness, grammatical agreement and semantic preservation. The final audit found no need for a separate localized semantic authority; strength remains shared and deterministic while surface naturalization is language-specific.

## 10. Question Studio and lifecycle

ARG-001 CP015 is the current Question Studio authority and is registered ahead of historical ARG fallbacks.

Internal lifecycle remains:

- Question Bank writable: true;
- test eligible: true;
- mock-test eligible: true;
- lifecycle: `INTERNAL_ELIGIBLE`.

Public/student lifecycle remains closed:

- publicly publishable: false;
- public release authorized: false;
- direct student delivery authorized: false;
- automatic student publication: false.

## 11. Historical preservation

The audit preserves the checkpoint lineage rather than rewriting old authorities:

- CP006 exact core byte freeze;
- CP008 exact real-paper byte freeze;
- CP013 approved learner-facing surface;
- CP014 manual approval/internal-eligibility contract;
- CP015 current diversity/editorial runtime.

The shared `types.ts` file is part of the CP006 frozen authority and therefore intentionally still describes the CP001–CP006-era learner shape. Later checkpoints carry their own additive contracts. During this audit an attempted modernization of that historical type was correctly rejected by the byte-freeze proof and was reverted exactly; no frozen authority is being rewritten merely to make old types look current.

## 12. Audit findings and disposition

The final audit found these concrete issues:

1. **Stale end-to-end design** — still described CP006-era registration and release state. Updated to CP015 reality.
2. **CP006-era shared type appeared stale** — investigated, but it is an intentionally frozen historical authority rather than the current CP015 contract. An attempted edit was reverted exactly after the freeze proof caught it.
3. **Stale diversity-status document** — still implied certification was pending. Updated with the certified/merged state.
4. **Missing explicit Punjab/Railway profile routing** — added aliases to the certified state-style 2x4 authority.
5. **Hidden real-paper capabilities** — CP015 `/capabilities` now exposes canonical profiles and alias intent.
6. **No permanent final structural floor** — added a structural audit proof for QL/template/archetype/difficulty/answer-class/capacity invariants.
7. **Audit-harness cwd defect** — the first final-audit run invoked historical byte-freeze proofs from the API subdirectory even though those proofs resolve repository-root paths. The harness was corrected; frozen learner authorities were not modified.
8. **Freeze proof caught the audit's own overreach** — once the harness ran correctly, it detected the attempted `types.ts` modernization. That audit edit was removed, demonstrating that the historical freeze still protects the chapter as intended.

## 13. Residual risks / deliberate non-claims

The following are not treated as blockers but should remain explicit:

- Exact-question uniqueness does not mathematically guarantee zero semantic near-duplicates across arbitrarily large future batches.
- Human review remains useful because machine gates cannot perfectly judge every subtle wording issue.
- Exact Punjab official-paper format parity has not been independently established for every Punjab recruitment body/exam; Punjab intent currently routes to the certified state-style 2x4 authority.
- The chapter can generate novel combinations within its semantic model, but novelty must remain inside exam-valid Statement & Arguments reasoning rather than inventing exotic formats for their own sake.
- Historical frozen interfaces may look older than current overlays by design; their modern replacements belong in additive checkpoint contracts, not silent edits to frozen evidence.
- Public/student release requires a separate explicit authorization gate.

## 14. Final recommendation

ARG-001 no longer needs another broad redesign. Future work should be evidence-driven: only add a semantic family or presentation profile when fresh official-paper evidence demonstrates a recurring pattern that the current six QLs/four canonical profiles cannot represent.

For internal Question Studio, Question Bank and test/mock assembly, the chapter is ready after this audit remediation, subject to the final audit workflow remaining green.
