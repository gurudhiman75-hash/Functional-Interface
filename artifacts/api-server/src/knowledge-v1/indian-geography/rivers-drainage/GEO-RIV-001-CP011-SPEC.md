# GEO-RIV-001-CP011 — River Basins & Drainage Patterns

Status: REVIEW CANDIDATE V1  
Chapter: `GEO-RIV-001`  
Engine: `knowledge-v1`

## Scope

CP011 covers two related but distinct geography layers:

1. **River-basin membership** — a named river/tributary belongs to a named drainage basin/system.
2. **Drainage-pattern morphology and physiographic control** — how a drainage network is arranged and the terrain/structure that produces that arrangement.

It must not conflate `BELONGS_TO_BASIN` with `DRAINS_STATE` or `FLOWS_THROUGH` from CP009.

## V1 basin pool

The review corpus contains tributary membership across five high-frequency systems:

- Indus Basin — Jhelum, Chenab, Ravi, Beas, Satluj;
- Ganga Basin — Yamuna, Ghaghara, Gandak, Kosi, Son;
- Godavari Basin — Pranhita, Indravati, Sabari;
- Krishna Basin — Bhima, Tungabhadra;
- Cauvery Basin — Kabini, Bhavani.

The purpose is to test meaningful cross-system discrimination rather than tautological main-river naming.

## V1 drainage patterns

- Dendritic;
- Trellis;
- Rectangular;
- Radial.

For each pattern, recognition features and physiographic/structural controls are stored as separate relations.

## QLs

- `QL092` — river → basin;
- `QL093` — basin → river discrimination;
- `QL094` — correctly matched river–basin pair;
- `QL095` — incorrectly matched river–basin pair;
- `QL096` — identify drainage pattern from network description;
- `QL097` — identify drainage pattern from physiographic/structural control;
- `QL098` — correctly matched pattern–control pair;
- `QL099` — mixed Statement I/II;
- `QL100` — three-statement mixed basin/pattern count.

## Editorial rules

- Proper river names in learner-facing text use `River + name`: `River Yamuna`, `River Beas`, etc.
- Standard basin names remain `Ganga Basin`, `Indus Basin`, etc.; do not rewrite them as `River Ganga Basin`.
- Stems must resemble competitive-exam wording and remain concise.
- Difficulty must come from relation topology, not obscure wording.
- Explanations must state the governing fact directly and add one useful connected fact where appropriate.
- Avoid internal/version/review language, shortcut/trap language and tautological filler.

## Semantic safety

- A river belonging to a basin does not itself assert that every state drained by that basin is crossed by the river.
- Pattern recognition and pattern control are not interchangeable facts.
- Reverse basin questions must contain exactly one member of the requested basin among the options.
- Correct/incorrect pair tasks are independently recomputed from the canonical relation matrix.
- Statement questions require independent truth evaluation for every statement.

## Review batch

V1 generates 54 questions: 6 per QL.

Target difficulty:

- Easy: 12
- Medium: 36
- Hard: 6

Target answer positions:

- A: 14
- B: 14
- C: 13
- D: 13

## Lifecycle

This checkpoint is review-only until explicit human approval. No freeze, runtime registration, Question Studio activation, Question Bank promotion, test/mock eligibility or public release is implied by implementation or CI success.