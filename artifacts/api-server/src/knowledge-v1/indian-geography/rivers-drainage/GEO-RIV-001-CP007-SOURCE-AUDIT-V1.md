# GEO-RIV-001-CP007 — Tributaries & Confluences

## Source audit V1

Status: **FOUNDATION / REVIEW_REQUIRED**

CP007 is a cross-system relation checkpoint. It does not create a second truth table for rivers. Instead it projects already source-backed, editorially reviewed relations from the approved upstream river-system CPs and uses those relations for cross-system question generation.

### Admitted upstream authorities

| Upstream CP | System | Authority used by CP007 | Relation families admitted |
|---|---|---|---|
| CP002 | Indus | `GEO_RIV_001_CP002_REVIEWABLE_FACTS_V1` | main tributaries, secondary tributaries, headstreams, joining chain, confluence places |
| CP003 | Ganga | `GEO_RIV_001_CP003_REVIEWABLE_FACTS_V1` | source streams/headstreams, major tributaries, Panch Prayag, Ganga bank-side relations, confluence places |
| CP004 | Brahmaputra | `GEO_RIV_001_CP004_REVIEWABLE_FACTS_V1` | principal tributaries, Siang/Dihang-Dibang-Lohit formation, north/south-bank groups, lower-course confluence relations |
| CP005 | East-flowing Peninsular | `GEO_RIV_001_CP005_REVIEWABLE_FACTS_V1` | tributaries, left/right-bank groups, Brahmani formation and related confluence hierarchy |

Every projected CP007 fact preserves the original source metadata (`sourceId`, title, locator, source type, freshness) from its upstream fact.

### Explicit approval boundary

`GEO-RIV-001-CP006 — West-flowing Peninsular Rivers` is **not** an admitted upstream authority while CP006 remains at human review. CP007 must not import, duplicate, or silently consume CP006 candidate facts before explicit approval/freeze. West-flowing tributary/confluence coverage will be added to CP007 only after that boundary is crossed.

This is deliberate fail-closed behavior, not a content omission being hidden from review.

### Stable relation scope

CP007 admits only river-network relations relevant to tributaries and confluences:

- `main_tributary_of`
- `tributary_of`
- `principal_tributary_of`
- `tributary_of_brahmaputra_system`
- `headstream_of`
- `source_stream_of`
- left/right-bank tributary relations
- Ganga bank-side and Brahmaputra north/south-bank relations
- `joins_river`, `joins_river_at`, `joins_parent_near`, `joins_mainstream`, `joins`
- `formed_by`, `formed_at`, and confluence-driven name transition

Source/course/mouth/city/project facts are not projected unless they are needed to state a verified confluence relation.

### Truth and exam-pattern separation

The upstream official/reference sources remain truth authority. Prior competitive-exam patterns influence question-language allocation and distractor design only; they do not override source truth.

### Editorial rules

1. Use standard stems such as “Which of the following is a tributary of…?”, “At which place do… meet?”, and “Which pair is correctly matched?”
2. Avoid process language such as “matches the reviewed relation”, “associated with”, “listed among”, “joining relation”, “exam trap”, or “shortcut”.
3. Explain the exact river relation directly. Do not merely repeat the option.
4. Hard questions must come from linked facts or multi-statement reasoning, not obscure vocabulary.
5. Confluence questions must distinguish **river joined**, **place of confluence**, and **river formed**; these are separate relations.
6. Bank-side questions must use real river alternatives, never artificial “both/neither bank” filler.

### Visual policy

Maps/photos/diagrams are optional manual editorial attachments in Question Studio. CP007 generation remains fully valid text-first and must not depend on automatic GIS or schematic-map generation.
