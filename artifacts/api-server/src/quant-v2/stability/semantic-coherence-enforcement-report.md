# Quant V2 Semantic Coherence Enforcement Report

## Scope

This pass adds a semantic consistency layer around the stable quant-v2 generators. It does not change topology selection, reasoning graph construction, admin routing, or persistence contracts.

## Implemented

- Added a canonical scenario layer with domain, object, unit, entity type, realism profile, and allowed anchor keys.
- Added `anchorLexicon.ts` as the shared anchor source for English, Hindi, and Punjabi product/domain nouns.
- Locked Hindi and Punjabi commercial stems to the product anchor already selected by the English semantic stem.
- Added `reasoningLexicon.ts` for reasoning labels that must never leak as raw English fragments in Hindi/Punjabi explanations.
- Added a final `semanticConsistency` validator covering:
  - cross-language anchor consistency
  - domain leakage
  - localization completeness
  - untranslated reasoning fragments
  - distractor realism outliers
- Added semantic consistency metadata to quant-v2 admin payloads and corpus audit exports.
- Rebalanced deterministic distractor ordering so plausible error-model distractors are preferred over extreme numeric outliers.

## Export Integration

Corpus audit items now include:

- canonical scenario metadata
- semantic consistency validator report
- existing category/subtype/reasoning-pattern anchors
- localization coverage when the export profile requests it

## Validation

- `pnpm --dir artifacts/api-server run test:quant-v2-semantic-coherence`
  - 20,000 multilingual percentage samples.
  - Validates anchor locking, domain integrity, localized explanations, and distractor realism.

## Remaining Gaps

- The anchor lexicon should expand as new domains are added, especially for future PYQ imitation and household-budget topologies.
- Distractor realism is now bounded by a final ordering/safety layer, but deeper per-topology trap labeling can still be improved later.
- Some old reference exports may still contain earlier lexical choices until goldens are intentionally regenerated.

## Readiness

The live quant-v2 admin path now has a semantic coherence firewall that keeps multilingual stems, explanations, domains, and distractors aligned for English, Hindi, and Punjabi generation.

