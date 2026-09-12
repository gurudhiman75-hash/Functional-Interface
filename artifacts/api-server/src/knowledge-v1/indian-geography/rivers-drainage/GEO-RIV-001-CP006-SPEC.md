# GEO-RIV-001-CP006 — West-flowing Peninsular Rivers

Status: REVIEW CANDIDATE V1
Chapter: `GEO-RIV-001`
CP: `GEO-RIV-001-CP006`
Engine: `knowledge-v1`

## Objective

Fill the blueprint-reserved CP006 / QL046–QL054 gap with source-backed west-flowing Peninsular river coverage before CP007 and CP015 can be qualified.

## Canonical scope

Core systems with tributary-bank depth:
- Narmada
- Tapi
- Mahi
- Sabarmati

Secondary source/outfall breadth:
- Sharavathi
- Netravati

Core facts cover source place/region/state, west-flowing classification, outfall, and explicit left-/right-bank tributaries where official sources support them. Secondary systems are not assigned unsupported tributary-bank facts.

## QLs

- QL046 — River → source place
- QL047 — Source clue → river
- QL048 — River → mouth/outfall
- QL049 — Tributary → parent river
- QL050 — Bank-side tributary recognition
- QL051 — Correctly matched west-flowing pair
- QL052 — Incorrect tributary–parent–bank combination
- QL053 — Statement I/II
- QL054 — Three-statement correct count

## Editorial and truth rules

- learner-facing proper river names use `River + name`;
- left-bank/right-bank wording is hyphenated when adjectival;
- source/outfall questions use only source-supported conventions;
- no state-traversal duplication from CP009;
- no dynamic project-status facts;
- independent semantic audit recomputes source, outfall, parent-river and bank truth;
- 54 questions, six semantically distinct items per QL;
- answer-position target A14/B14/C13/D13;
- review-only; no runtime promotion before explicit human approval.

## Acceptance gate

CP006 is review-ready only when its qualification test, artifact export, API build, Geography validation, Render build, branch-topology guard and CI-hygiene policy pass on the exact review head.
