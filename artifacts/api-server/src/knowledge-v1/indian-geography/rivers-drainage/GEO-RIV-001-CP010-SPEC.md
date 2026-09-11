# GEO-RIV-001-CP010 — Dams, Projects & Reservoirs — Spec V1

## Purpose
Generate deterministic, source-backed competitive-exam questions on major Indian dams, river projects and reservoirs while keeping each geographic relation explicit.

## Canonical relation contract
CP010 uses separate facts for:

- `project_on_river` — a named dam/project is built on a named river;
- `project_in_state` — a named dam/project is located in a named state;
- `project_creates_reservoir` — a named dam/project creates/is directly associated with a named reservoir;
- `reservoir_on_river` — a named reservoir lies on/is formed on a named river.

One relation must never be substituted for another. A project being in a river basin does not by itself prove that the dam is built on the main river. A project may have more than one valid state relation when it lies on a state boundary.

## V1 project corpus
V1 covers these high-frequency, source-backed projects:

- Bhakra Dam
- Pong Dam
- Tehri Dam
- Hirakud Dam
- Nagarjuna Sagar Dam
- Sardar Sarovar Dam
- Indira Sagar Dam
- Mettur Dam
- Rihand Dam
- Ukai Dam
- Gandhi Sagar Dam
- Tungabhadra Dam

The corpus may expand later, but expansion must not weaken source quality or unique-answer guarantees.

## Permanent question families
1. **GEO-RIV-001-QL-083 — Dam/project → river**
2. **GEO-RIV-001-QL-084 — River → dam/project**
3. **GEO-RIV-001-QL-085 — Dam/project → state**
4. **GEO-RIV-001-QL-086 — Dam/project → reservoir**
5. **GEO-RIV-001-QL-087 — Reservoir → dam/project**
6. **GEO-RIV-001-QL-088 — Correctly matched project–river pair**
7. **GEO-RIV-001-QL-089 — Incorrectly matched project–state pair**
8. **GEO-RIV-001-QL-090 — Mixed Statement I/II**
9. **GEO-RIV-001-QL-091 — Three-statement mixed-relation count**

## Ambiguity rules
- Reverse river → project questions may use only rivers that map to exactly one project inside the generation scope.
- Direct project → state questions may use only projects with one unambiguous state answer in the question family.
- Multi-state projects remain in the canonical fact graph and may be used in question types that can represent all valid states safely.
- Pair distractors must use real projects, rivers, states and reservoirs from the qualified corpus; no fabricated names.
- Negative pair generation must be validated against the full CP010 relation matrix before release.

## Learner-facing naming policy
Every proper river name shown to the learner must use the prefix **`River`**:

- River Satluj
- River Beas
- River Bhagirathi
- River Mahanadi
- River Krishna
- River Narmada
- River Cauvery

The canonical entity labels stored in facts remain `Satluj`, `Beas`, `Bhagirathi`, etc. The prefix is a presentation rule, not part of the canonical entity ID.

## Stem policy
Stems must use conventional competitive-exam language and remain short and natural.

Preferred forms include:

- “On which of the following rivers is Bhakra Dam built?”
- “Which of the following dams/projects is built on River Mahanadi?”
- “Select the correctly matched dam/project–river pair.”
- “With reference to dams and river projects in India, consider the following statements…”

Avoid engine/internal wording, unnecessary scene-setting, conversational filler and obscure phrasing used only to make a question look difficult.

## Explanation policy
Explanations must be question-specific, simple and connected. They should directly state the correct project relation and may add one useful connected relation, such as the reservoir or state.

Statement questions must evaluate each statement independently before giving the final combination/count answer.

Do not use option-by-option analysis, internal review/version terms, generic shortcuts/traps, or tautological filler.

## Difficulty policy
- **Easy:** direct project↔river/state/reservoir recall.
- **Medium:** reverse reservoir/project recall, matched-pair discrimination and two-statement composition.
- **Hard:** three-statement mixed-relation composition.

Difficulty must come from relation topology and plausible near-neighbour distractors, never from awkward language.

## Freshness and mutability
The physical location relation between an established dam/project, river, state and reservoir is treated as immutable after qualification unless an authoritative correction changes the convention.

Operational status, live storage, gates opened, commissioning progress of new units, daily levels and similar current fields are **out of scope for CP010 V1** and must not be embedded in immutable questions.

## Validation requirements
Every review question must pass:

- source-authority audit;
- relation-direction check;
- unique-answer validation;
- option distinctness;
- distractor truth-collision check;
- deterministic replay;
- learner-facing River-prefix audit;
- provenance completeness;
- statement-composition truth recomputation;
- difficulty distribution audit;
- balanced answer-position audit.

## Lifecycle
Review-only until explicit human approval. No freeze, Question Studio registration, Question Bank promotion, test/mock eligibility, production publication or merge is authorized by this spec before human review.
