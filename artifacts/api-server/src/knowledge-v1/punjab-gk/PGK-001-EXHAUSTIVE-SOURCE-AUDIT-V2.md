# PGK-001 — Exhaustive Source Audit V2

Status: SOURCE PROVENANCE REMEDIATED / SUPERSEDED BY FINAL FACTUAL CERTIFICATION V1
Date: 22 September 2026
Follow-on: `PGK-001-FINAL-FACTUAL-CERTIFICATION-V1.md` (23 September 2026) resolves the remaining factual-certification gate and strengthens the CP001 state-symbol evidence.
Branch: `feature/pgk-001-exhaustive-source-audit-v2`
Pull request: #2063
Base: current `New-main`

## Scope

This pass audits the source architecture behind the frozen English Punjab GK corpus:

- 26 CPs
- 182 permanent QLs
- 1,092 frozen English questions
- Question Studio package `PGK-001`
- review-only lifecycle retained

A symbolic source ID alone is not considered sufficient. Sources must be resolvable to an identifiable authority, and learner questions must retain non-empty fact and source provenance.

## Source-strength result

### Remediated

- CP002: administrative authority records now have resolvable source metadata.
- CP005: UBDC now uses a pinpoint PSPCL project document; Harike uses a MoEFCC primary record with Punjab Water Resources support.
- CP006-CP007: source registries added for Government of Punjab/PSEB/PAU/MoEFCC/Ramsar/WII authorities.
- CP011-CP021: formerly symbolic authorities now resolve through explicit source registries/URLs.
- CP017: generic Singh Sabha history authority replaced with an identifiable Punjabi University/Punjabipedia authority.
- CP022: generic literary placeholders replaced with concrete Punjabi University/Punjabipedia, Punjab Auqaf, Sahitya Akademi and Jnanpith authorities.
- CP023: source registry and fact-level provenance added for folk culture, music, crafts and rural heritage.
- CP024: source registry and fact-level provenance added for fairs, festivals and heritage, using district/Government of Punjab and institutional sources.
- CP025: source registry and fact-level provenance added for personalities and sports, using Government of India, World Athletics, Hockey India and other first-party authorities.
- CP026: district-by-district provenance added using district NIC/Government of Punjab and relevant institutional authorities.

### Already strong / retained

- CP003: Government of Punjab / PUDA / PAU.
- CP004: Government of Punjab / BBMB / PUDA / PSEB.
- CP008: Punjab Agricultural University / Government of Punjab.
- CP009: Government of Punjab / PUDA / official cooperative and institutional sources.
- CP010: PSEB / ASI / NMA / Government of Punjab with reputable secondary support where appropriate.

## Remaining source-quality flags

### CP001 — state symbols

Two claims still have official but weaker-than-ideal authority:

1. `state-animal-blackbuck`
   - currently supported by an official Punjab Government recruitment question paper;
   - no stronger direct notification/department state-symbol record has yet been located in this audit.

2. `state-tree-shisham`
   - currently supported by Punjab School Education Board material;
   - no stronger direct notification/department state-symbol record has yet been located in this audit.

These are not missing-source defects. They remain source-strength flags for the strictest certification standard.

## Automated exhaustive guard

The PGK Question Studio contract now scans all 1,092 frozen English questions and fails on:

- missing source provenance;
- missing fact provenance;
- generic source placeholders;
- banned learner wording;
- duplicate normalized stem + answer semantics;
- oversized stems or explanations;
- explanations outside the allowed sentence range;
- unversioned Census-2011 demographic questions;
- existing option/answer, CP, QL and lifecycle integrity failures.

The PGK chapter-close workflow passes on the forward-port branch.

## Certification boundary

This V2 pass closes the chapter-level **source-provenance architecture** gaps.

It does **not** by itself certify that every external claim in all 1,092 questions has been independently re-read against its cited authority. The final factual pass must still verify claim truth, interpretation, historical scope, ancient-name variants, superlatives/first-only claims, mutable facts and any disputed historical attribution.

Question Bank writes, test/mock eligibility, public publication, automatic student release and production promotion remain unauthorized.
