# WHI-001-CP006 — Question-family architecture

**Status:** Proposed family contract for review; no permanent QL IDs allocated.
**Checkpoint:** Nationalism and Unification.
**Pool contract:** 60 questions, 10 distinct families, 6 questions per family; Easy 18, Medium 30, Hard 12.

This uses the existing `knowledge-v1` package contract. `questionFamily` carries the stable family value in each record and becomes the adapter's `patternId`, as in the existing World History CP003–CP005 adapter. Permanent QL allocation waits for the English pool review.

| Family value | What the family tests | CP006 evidence examples | Current batch |
|---|---|---|---|
| Movement and objective | A movement or organisation and its political aims | Young Italy; liberal-national demands of 1848 | Q001, Q007 |
| Person and contribution | A named leader and a defensible role | Mazzini, Cavour, Garibaldi, Victor Emmanuel II | Q009, Q011, Q016 |
| State and political base | The state or institution that carried a unification process | Frankfurt Assembly; Piedmont-Sardinia; North German Confederation | Q002, Q008, Q020 |
| Event and outcome | A campaign, assembly, proclamation or refusal and its result | Expedition of the Thousand; 1861 proclamation; crown refusal | Q005, Q010, Q012 |
| Chronology and sequence | Ordering dated stages without mixing national timelines | 1860, 1861, 1864, 1866, 1870–71 | Q013, Q015, Q019 |
| Territory and completion | Which territories entered a state and when | Venetia and Rome joining Italy | Q014 |
| Constitutional and political structure | A proposed constitution, state arrangement or institutional limit | Frankfurt constitution; 1871 empire | Q003, Q006 |
| Movement comparison | Differences and overlap among political programmes | Nationalism and liberalism; Mazzini and Cavour | Q004, Q017 |
| Diplomacy and popular action | How state diplomacy, war and popular campaigns interacted | Cavour's statecraft and Garibaldi's southern campaign | Q018 |
| Cross-stage synthesis | Combine multiple leaders, events or dates to explain unification | The failed 1848 project and later Prussian-led empire | Q006 |

The first 20 records are provisionally mapped above. For Q021–Q060, keep six questions in each family across the complete pool and use the approved coverage map; do not inflate a family by rewording the same fact. A cross-check will confirm the final six-per-family distribution before Question Studio registration.

## Shared engine contract

- Reuse the existing `knowledge-v1` engine and review-only lifecycle.
- Extend the current grouped World History adapter configuration for package `WHI-006` after the full English/Hindi/Punjabi corpora exist.
- Reuse its explicit package/CP/question selectors, difficulty filters, seeded `deterministicShuffle`, language parity checks and publication locks.
- Preserve English question IDs, fact IDs, family, difficulty, review option order and keyed answer across locales.
- Do not add a second question bank, generator framework, or engine.
