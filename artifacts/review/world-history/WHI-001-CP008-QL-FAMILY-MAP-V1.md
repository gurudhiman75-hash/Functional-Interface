# WHI-001-CP008 — Question-family architecture

**Status:** Full English pool family map; permanent QL IDs remain unallocated.
**Checkpoint:** First World War and Russian Revolutions.
**Pool contract:** 60 questions; 10 relationship families; 18 Easy / 30 Medium / 12 Hard.

CP008 uses the existing shared World History `knowledge-v1` contract. Family sizes follow the checkpoint coverage and are deliberately varied; no permanent QL IDs are allocated before review.

| Family | Relationship tested | Questions | Count |
|---|---|---|---:|
| Causes and alliances | Long-term pressures, alliance blocs and the difference between structural causes and the immediate trigger. | Q001, Q002, Q003, Q004, Q005, Q006, Q007, Q008 | 8 |
| Crisis and outbreak | Assassination, ultimatum, mobilisation and declarations in the July Crisis. | Q009, Q010, Q011, Q012, Q013, Q014, Q015, Q016 | 8 |
| Fronts and battles | Theatre, location, strategic purpose and sequence of major battles. | Q017, Q018, Q019, Q020, Q021, Q022, Q023, Q024 | 8 |
| Warfare and turning points | Weapons, tactics and military developments that changed operations. | Q025, Q026, Q027, Q028 | 4 |
| Global participation and home fronts | Imperial forces, U.S. entry, mobilisation and civilian participation. | Q029, Q030, Q031, Q032, Q033, Q034, Q035, Q036 | 8 |
| Turning points and armistice | Military developments from 1917 to 1918 and the November armistice. | Q037, Q038, Q041, Q042 | 4 |
| Treaty and settlement | Separate peace, armistice and postwar treaty terms and dates. | Q039, Q040, Q043, Q044 | 4 |
| Russian Revolution chronology | February/October sequence, abdication and dual power; dates identify calendar style. | Q045, Q046, Q047, Q048, Q049, Q050 | 6 |
| Bolshevik policy and institutions | Early decrees, political institutions and Russia’s exit from the war. | Q051, Q052, Q053, Q054, Q055, Q056 | 6 |
| Integrated synthesis | Connections among diplomacy, revolution, global war and the staged peace settlement. | Q057, Q058, Q059, Q060 | 4 |

## Shared architecture reuse

- Timeline and source authority → canonical facts → question families → shared question records → validator/test → human review.
- Reuse the existing World History deterministic selectors and standard review-only lifecycle after localization.
- Preserve event calendar conventions; do not conflate the armistice with the later peace treaties.
- Keep Question Studio registration gated on English approval and Hindi/Punjabi parity.
