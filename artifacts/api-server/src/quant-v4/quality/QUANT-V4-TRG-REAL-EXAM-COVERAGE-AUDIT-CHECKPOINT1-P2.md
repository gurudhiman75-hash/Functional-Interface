# Quant V4 — TRG Real-Exam Coverage Audit, Checkpoint 1 (P2)

Authority: `QUANT-V4-TRG-REAL-EXAM-COVERAGE-AUDIT-CHECKPOINT1-P2`

## Scope

This checkpoint begins the post-frequency micro-audit of the highest-impact trigonometry evidence. It compares real SSC CGL whole-section observations against the current `New-main` Trigonometry package authority rather than assuming that a large QL count implies real-exam completeness.

This is an audit checkpoint, not a production activation record.

## Finding 1 — package-boundary defect found and corrected

Real paper:

- SSC CGL Tier-I, 10 Sep 2024 Shift 1
- pole of length 10 m making 30° with the ground
- solve horizontal distance

The observation had been mapped to `TRG-001`.

Current Trigonometry family authority explicitly assigns physical line-of-sight / Heights & Distances applications to `TRG-002`.

Action completed:

- remapped the observation `TRG-001` -> `TRG-002`;
- corrected Wave 11 local contribution expectations;
- corrected central whole-section package counts;
- corrected package coverage 28 -> 29;
- corrected Wave 11/12 stability documents;
- corrected audit-only support tiers.

Corrected Wave 12 trigonometry counts:

- `TRG-001`: **32 / 300 = 10.67%**
- `TRG-002`: **1 / 300 = 0.33%**

This proves that package-authority validation is required before frequency evidence can be trusted.

## Finding 2 — acute-angle sin/cos ordering is not currently treated as a gap

Real paper:

- SSC CGL Tier-I, 10 Sep 2024 Shift 1
- compare/order `sin t` and `cos t` over the acute-angle interval

Current `TRG-001` design explicitly includes comparison/ranking under standard-angle/exact-evaluation coverage and controlled ratio comparison elsewhere.

Decision:

- **covered at authority level**;
- still requires runtime-role/stem review before final PASS;
- no new CP or package split justified from this observation alone.

## Finding 3 — cubic trigonometric factorisation is a coverage ambiguity

Real paper:

- SSC CGL Tier-I, 9 Sep 2024 Shift 2
- simplify `(sin^3 A - cos^3 A)/(sin A - cos A)` using difference-of-cubes factorisation and `sin^2 A + cos^2 A = 1`.

Current `TRG-001` authority explicitly lists:

- fundamental quadratic identities;
- reciprocal/quotient identities;
- rational simplification;
- derived-ratio relations;
- mixed identity expressions;
- composite SSC-style expressions.

However, neither the locked QL ledger nor the authority manifest explicitly identifies a cubic trig-factorisation role. Repository search also does not surface a TRG-001 implementation role using the cubic form.

Decision:

- **not yet classified as missing** because a broad mixed-expression role could implement it;
- **not allowed to be considered covered merely because CP-006 says “composite SSC-style expressions”**;
- requires direct inspection of `production-authority-runtime.ts` role definitions / solve modes.

Audit status: `COVERAGE_AMBIGUITY_REQUIRES_RUNTIME_ROLE_PROOF`.

## Structural concern exposed

`TRG-001` currently has:

- 144 permanent QLs;
- 24 QLs per CP;
- 39 exact Phase-0 subfamilies represented;
- AI editorial PASS on 144/144;
- execution evidence pending;
- human freeze pending.

These are valuable engineering guarantees, but they do not by themselves prove exhaustiveness against PYQ archetypes. A package can be internally complete relative to its design while the design itself omits a real-exam form.

Therefore Quant V4 final audit must use two independent completeness checks:

1. **internal authority completeness** — every locked QL/CP/subfamily is implemented correctly;
2. **external PYQ completeness** — every materially recurring real-exam archetype has an explicit, demonstrated home in the authority/runtime.

Both are required before final freeze.

## Next TRG audit work

1. Extract all corrected `TRG-001` and `TRG-002` observations from the 12-paper corpus.
2. Map each observed representation to an explicit CP + QL family/role.
3. Mark each as `COVERED`, `COVERED_BUT_WEAK`, `AMBIGUOUS`, `MISCLASSIFIED`, or `MISSING`.
4. For `AMBIGUOUS`/`MISSING` forms, inspect the concrete authority runtime rather than relying on ledger wording.
5. Only after coverage mapping, sample generated stems/explanations/distractors for the corresponding QLs.
6. Do not alter frequency weights or activate Question Studio during this audit.
