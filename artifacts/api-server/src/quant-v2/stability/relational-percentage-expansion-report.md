# P3 Relational Percentage Reasoning Expansion Report

## Scope

This phase adds canonical reasoning/topology coverage for relational percentage questions while preserving the existing quant-v2 architecture, multilingual realization, corpus realism governance, and admin adapter workflow.

## Added Reasoning Coverage

- New subtype: `relational_percentage`.
- New reasoning pattern: `relational_chain`.
- New topology variants:
  - `single_relation`
  - `two_step_relation_chain`
  - `three_step_relation_chain`
  - `reverse_relation_inference`
  - `ratio_percentage_bridge`
  - `hidden_base_relation_chain`
- New topology families:
  - `relational_chain`
  - `reverse_relation`
  - `percentage_ratio_hybrid`
  - `inverse_percentage_mapping`
  - `multi_entity_percentage_network`

## Graph Semantics

Relational questions now build explicit reasoning graphs with:

- reference normalization to 100,
- relation transformation steps,
- inversion-aware relation steps,
- final comparison inference,
- trap metadata for additive, wrong-base, inversion, normalization, and transitive shortcut errors.

## Realization

English, Hindi, and Punjabi stems now support compact PYQ-style relational wording.

Examples:

- `A is 20% more than B. B is 25% less than C. Find by what percent A is more or less than C.`
- `A की आय B से 20% अधिक है...`
- `A ਦੀ ਆਮਦਨ B ਨਾਲੋਂ 20% ਵੱਧ ਹੈ...`

Options render semantically as:

- English: `20% more`, `15% less`
- Hindi: `20% अधिक`, `15% कम`
- Punjabi: `20% ਵੱਧ`, `15% ਘੱਟ`

## Validation

- Added `relational-percentage-validator.ts`.
- Added `relational-percentage.test.ts`.
- Generated and validated 20,000 relational canonical graph samples.
- Validated admin flow emits multilingual relational samples with topology and validator metadata.

## Verified Commands

- `pnpm --dir artifacts/api-server run test:quant-v2-relational`
- `pnpm --dir artifacts/api-server run test:quant-v2-admin-integration`
- `pnpm --dir artifacts/api-server run test:quant-v2-corpus-realism`
- `pnpm --dir artifacts/api-server run test:quant-v2-realization-calibration`
- `pnpm --dir artifacts/api-server run test:quant-v2-multilingual-stem`
- `pnpm --dir artifacts/api-server run build`

All passed. The existing unrelated duplicate `punjab_state` warning remains.

## Remaining Gaps

- Future relational expansion can add named domains like savings/expenditure and fuel-consumption chains with richer domain-specific wording.
- Current relational topology uses compact A/B/C/D exam framing to stay PYQ-like and avoid narrative inflation.
- SVG-specific relational node styling can be expanded later if richer relational diagrams are needed.

