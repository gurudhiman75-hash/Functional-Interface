# GEO-RIV-001-CP009 — Rivers and States — Spec V1

## Purpose
Generate deterministic, source-backed competitive-exam questions on Indian rivers and the states/UTs through which their **main course** flows, without confusing river-basin extent with river course.

## Permanent question families
1. **GEO-RIV-001-QL-074 — Direct river → state**
2. **GEO-RIV-001-QL-075 — Reverse state → river**
3. **GEO-RIV-001-QL-076 — Source-state identification**
4. **GEO-RIV-001-QL-077 — Multi-state course set / pair**
5. **GEO-RIV-001-QL-078 — Correctly matched river-state pair**
6. **GEO-RIV-001-QL-079 — Incorrectly matched river-state pair**
7. **GEO-RIV-001-QL-080 — Interstate course discrimination**
8. **GEO-RIV-001-QL-081 — Statement I and II**
9. **GEO-RIV-001-QL-082 — Multi-statement count**

## Required river coverage
V1 must cover at least:
- Ganga
- Brahmaputra
- Krishna
- Godavari
- Mahanadi
- Cauvery
- Pennar
- Teesta
- Subarnarekha

## Coverage rules
- direct course facts must be independently source-backed;
- no basin-state fact may satisfy a `flows_through_state` question;
- reverse state questions must be filtered for ambiguity before generation;
- multi-state set questions must compare canonical main-course state sets, not catchment states;
- matched-pair distractors must be plausible river/state combinations;
- no self-evident filler such as “all/none of these” unless the QL explicitly requires it;
- Statement I/II must exercise all four truth outcomes;
- multi-statement count must exercise None/One/Two/Three;
- every question must retain source/fact provenance.

## Main-course closure boundary
For the rivers included in CP009, the canonical `flows_through_state` rows form the complete Indian **main-course** list used by the review generator. This permits deterministic negative answers such as “incorrectly matched” and exact “only these states” questions.

This is deliberately narrow:
- it is not a claim that CP009 contains every river/state fact in Indian geography;
- absence from a river's main-course list may reject only a `flows_through_state` claim for that included river;
- absence must never be used to conclude that the state is outside the river's basin/catchment;
- `drains_state` and `flows_through_state` remain separate relations.

## Difficulty policy
- Easy: one-hop direct course or source-state recall.
- Medium: reverse identification, pair discrimination, multi-state course sets and two-statement composition.
- Hard: multi-fact interstate discrimination and three-statement count; wording must remain simple.

## Explanation policy
Explanations must be question-specific, simple enough for a beginner, and state the geographic relation directly. Where useful, include the river's full Indian main-course state list as connected context. For statement questions, evaluate each statement separately before giving the final result. When a negative course claim could be confused with basin extent, explicitly preserve the distinction between main-course flow and basin/catchment drainage.

Do not use option analysis, `Correct fact:` labels, “the pair is incorrect”, internal review/version language, “associated with”, shortcuts/traps, or tautological filler.

## Approval boundary
CP006 remains unapproved and cannot enter CP009 V1. CP007/CP008 are cross-system review candidates and are not dependencies of CP009.

## Lifecycle
Review-only until explicit human approval. No freeze, Question Studio registration, Question Bank promotion, test/mock eligibility or production publication is authorized by this spec.
