# GEO-RIV-001-CP014 — Multi-fact / Statement / Match Tasks

Status: REVIEW CANDIDATE V1
Chapter: `GEO-RIV-001`
CP: `GEO-RIV-001-CP014`
Engine: `knowledge-v1`

## Objective

Qualify compound learner tasks using only relations already reviewed in earlier river checkpoints. CP014 introduces no new raw geography truth layer.

## Source relation inputs

- CP010 — project ↔ river ↔ state ↔ reservoir
- CP011 — river ↔ basin ↔ parent river system
- CP012 — city ↔ river
- CP013 — river classifications

Each compound answer is recomputed from these imported canonical relations. A generated question is invalid if any component relation fails independently.

## Permanent QLs

- QL119 — mixed Statement I/II across relation families
- QL120 — mixed three-statement correct-count
- QL121 — city–river–classification chain
- QL122 — project–river–state chain
- QL123 — project–river–reservoir exception
- QL124 — river–basin–river-system chain
- QL125 — identify river from city + classification intersection
- QL126 — city/project associated with the same named river
- QL127 — three-way city–project–river match

These are materially different learner tasks, not stem variants.

## Composition rules

1. Every statement must resolve independently against its owning CP relation matrix.
2. Exactly one option must satisfy the full compound condition.
3. A correct component may not rescue an incorrect component in a chain.
4. False statements must use real entities and plausible neighbouring relations.
5. `River + name` is mandatory in learner-facing text.
6. Explanations identify each governing relation directly; no shortcut/trap language.
7. No new facts are authored in CP014.

## Review batch contract

- 54 questions; 6 per QL.
- Six semantically distinct payloads per QL.
- Answer positions A14/B14/C13/D13.
- Independent semantic composition audit.
- Provenance inherited from the exact imported source facts used by the item.
- Review-only lifecycle; no runtime registration or Question Bank publication before explicit approval.

## Acceptance gate

CP014 is review-ready only when its dedicated qualification test, artifact export, API build, Geography validation, branch-topology guard and CI-hygiene policy pass on the exact review head.
