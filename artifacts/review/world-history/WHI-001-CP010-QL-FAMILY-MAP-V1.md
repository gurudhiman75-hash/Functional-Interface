# WHI-001-CP010 — Question-family map

**Checkpoint:** Second World War
**Shared contract:** `knowledge-v1`; no separate engine.

| Family | Coverage role | Questions | Count |
|---|---|---|---:|
| Outbreak and chronology | Causes, invasion of Poland, declarations and the opening sequence. | Q001, Q002, Q003, Q004, Q005, Q006 | 6 |
| Axis expansion and occupation | Axis powers, early campaigns and the occupation of western Europe. | Q007, Q008, Q009, Q010, Q011, Q012 | 6 |
| European theatre | Major European campaigns, fronts and advances. | Q013, Q014, Q015, Q016, Q017, Q018 | 6 |
| Pacific theatre | Pacific campaigns, naval battles and Allied advance. | Q019, Q020, Q021, Q022, Q023, Q024 | 6 |
| Turning points | Events that shifted the balance across major theatres. | Q025, Q026, Q027, Q028, Q029, Q030 | 6 |
| Allied strategy and leaders | Wartime declarations, conferences, supply and coalition decisions. | Q031, Q032, Q033, Q034, Q035, Q036, Q037 | 7 |
| Holocaust and persecution | Nazi persecution and genocide, with historically precise framing. | Q038, Q039, Q040, Q041, Q042, Q043 | 6 |
| Resistance and home fronts | Resistance, civilian life, codebreaking and liberation. | Q044, Q045, Q046, Q047, Q048, Q049, Q050 | 7 |
| Surrender and end of war | German surrender and the atomic bombings. | Q051, Q052, Q053, Q054, Q055, Q056 | 6 |
| Consequences and synthesis | Final chronology, displacement, occupation and global scope. | Q057, Q058, Q059, Q060 | 4 |

## Reused architecture

- Stable question and fact IDs; source-backed canonical claims; family, difficulty and source links.
- Review pool and contract test preserve the shared record shape and review-only lifecycle.
- Question Studio registration follows English approval and native Hindi/Punjabi localization and parity review.
- Seeded option shuffling must recalculate `correctIndex` when a future adapter is implemented.
