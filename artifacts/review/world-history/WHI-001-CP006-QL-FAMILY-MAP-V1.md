# WHI-001-CP006 — Question-family architecture

**Status:** Full English family map; permanent QL IDs remain unallocated.
**Checkpoint:** Nationalism and Unification.
**Pool contract:** 60 questions; 10 distinct families, six questions per family; 18 Easy / 30 Medium / 12 Hard.

CP006 reuses the existing `knowledge-v1` contract. `questionFamily` carries each stable family value; Question Studio registration remains gated on approved Hindi and Punjabi overlays.

| Family value | What the family tests | Full-pool questions | Count |
|---|---|---|---:|
| Movement and objective | A national movement, organisation or coalition and its stated aims. | Q001, Q007, Q021, Q023, Q039, Q055 | 6 |
| State and political base | The state, monarchy or institutional platform that carried a political process. | Q002, Q008, Q020, Q022, Q027, Q041 | 6 |
| Constitutional and political structure | A constitution, dual monarchy or institutional arrangement and its limits. | Q003, Q028, Q031, Q032, Q033, Q034 | 6 |
| Movement comparison | A meaningful difference or overlap among political programmes or methods. | Q004, Q017, Q024, Q035, Q048, Q059 | 6 |
| Event and outcome | A campaign, settlement, assembly or proclamation and its outcome. | Q005, Q010, Q012, Q029, Q037, Q056 | 6 |
| Cross-stage synthesis | A conclusion that connects multiple national processes, people or dates. | Q006, Q038, Q049, Q050, Q054, Q060 | 6 |
| Person and contribution | A leader and a historically grounded role or contribution. | Q009, Q011, Q016, Q030, Q036, Q051 | 6 |
| Chronology and sequence | Ordering dated stages without mixing national timelines. | Q013, Q015, Q019, Q025, Q026, Q045 | 6 |
| Territory and completion | Territorial status, accession or state formation and its date. | Q014, Q042, Q043, Q044, Q046, Q057 | 6 |
| Diplomacy and popular action | How diplomacy, warfare and popular campaigns interacted. | Q018, Q040, Q047, Q052, Q053, Q058 | 6 |

## Shared engine contract

- Reuse the existing `knowledge-v1` engine and standard review-only lifecycle.
- Register CP006 only after the 60-question English pool is approved and Hindi/Punjabi pass parity and native-language review.
- Reuse the existing package, checkpoint, question and difficulty selectors, seeded deterministic shuffle, and lifecycle gates.
- Preserve English IDs, fact IDs, family, difficulty, keyed option order and correct answer across translations.
- Keep Question Bank writes, scoring, mock delivery and public publication disabled during review.
