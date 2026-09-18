# PGK-001 — Punjab General Knowledge Content Engine

Status: IMPLEMENTATION BLUEPRINT V1
Subject: Static GK
Primary target exams: Punjab state recruitment examinations including PSSSB, PPSC, Punjab Police, Patwari and comparable Punjab-specific GK sections.

## Design rules

- Build a sourced fact graph, not a bag of one-line questions.
- Separate present-day Indian Punjab from undivided/historical Punjab.
- Keep volatile office-holders, schemes, budgets and recent awards outside Static GK.
- Version administrative and census data by source year.
- Use short exam-like stems; difficulty comes from relations, chronology and close distractors, not difficult wording.
- Explanations should normally be 2–5 short sentences and should explain the decisive fact.
- Distractors must come from the same semantic class.
- Semantic duplicates do not count as new question depth.
- English, Punjabi and Hindi localisation must be built over language-neutral facts; no literal-English leakage into Punjabi/Hindi.

## CP roadmap

| CP | Module | Core coverage |
| --- | --- | --- |
| PGK-001-CP-001 | Punjab Basic Profile | Name, historical/present river distinction, area, location, borders, language/script, capital, reorganisation, verified symbols |
| PGK-001-CP-002 | Administrative Punjab | Divisions, districts, headquarters, formation history and administrative relations |
| PGK-001-CP-003 | Physical Regions & Relief | Majha, Doaba, Malwa, Kandi/Shivalik belt, plains, floodplains and relief |
| PGK-001-CP-004 | Rivers & Doabs | Sutlej, Beas, Ravi, Ghaggar, tributaries, doabs and river-location relations |
| PGK-001-CP-005 | Dams, Barrages & Canals | Bhakra-Nangal, Ranjit Sagar, Harike, barrages, canal and irrigation systems |
| PGK-001-CP-006 | Climate, Soils & Natural Resources | Climate, rainfall, soils, groundwater, vegetation and resources |
| PGK-001-CP-007 | Forests, Wildlife & Wetlands | Sanctuaries, conservation reserves, Ramsar/wetland facts and biodiversity |
| PGK-001-CP-008 | Agriculture of Punjab | Crops, cropping regions, irrigation, Green Revolution and agricultural institutions |
| PGK-001-CP-009 | Economy & Industries | Industrial centres, major industries, power and durable economic specialisations |
| PGK-001-CP-010 | Ancient Punjab | Harappan links, archaeological sites, Vedic and early historical Punjab |
| PGK-001-CP-011 | Medieval Punjab | Major dynasties, invasions and medieval political developments before Sikh political rise |
| PGK-001-CP-012 | Sikh Gurus & Punjab | Gurus, important events, places, institutions and examinable historical developments |
| PGK-001-CP-013 | Banda Singh Bahadur & Sikh Struggle | Battles, centres, administration and post-Guru Gobind Singh developments |
| PGK-001-CP-014 | Sikh Misls & Dal Khalsa | Misls, leaders, territories, Sarbat Khalsa, Dal Khalsa and Sikh political consolidation |
| PGK-001-CP-015 | Maharaja Ranjit Singh & Sikh Empire | Rise, conquests, administration, generals, diplomacy and Lahore Darbar |
| PGK-001-CP-016 | Anglo-Sikh Wars & Annexation | Wars, battles, treaties, personalities and annexation |
| PGK-001-CP-017 | Reform & Freedom Movements | Singh Sabha, Namdhari/Kuka, Ghadar, Komagata Maru, Jallianwala Bagh, Akali and Babbar Akali movements |
| PGK-001-CP-018 | Partition, PEPSU & Reorganisation | 1947 partition, princely states, PEPSU, Punjabi Suba and 1966 reorganisation |
| PGK-001-CP-019 | Punjab Polity & Governance | Legislature, constitutional/administrative structure and stable governance facts |
| PGK-001-CP-020 | Census & Demography | Census-versioned population, literacy, density, sex ratio, urban/rural and district comparisons |
| PGK-001-CP-021 | Punjabi Language & Gurmukhi | Development, script, dialects and important linguistic facts |
| PGK-001-CP-022 | Punjabi Literature | Writers, poets, works, traditions and literary movements |
| PGK-001-CP-023 | Folk Culture, Music & Dance | Dances, songs, instruments, dress, crafts, cuisine and folk traditions |
| PGK-001-CP-024 | Fairs, Festivals & Heritage | Melas, festivals, gurdwaras, temples, forts, monuments, museums and heritage sites |
| PGK-001-CP-025 | Punjab Personalities & Sports | Durable personality and sports knowledge; recent achievements remain Current Affairs |
| PGK-001-CP-026 | District Deep Dive | District-specific geography, history, heritage, industries, institutions, products and notable places |

## Fact-scope guard

Historical records must explicitly identify their geography. At minimum the content model must distinguish:

- `CURRENT_PUNJAB`
- `UNDIVIDED_PUNJAB`
- `EAST_PUNJAB`
- `PEPSU`
- `POST_1966_PUNJAB`
- `SIKH_EMPIRE`

A place or river belonging to historical Punjab must never be silently presented as a present-day Indian Punjab fact.

## Question families

Use only where naturally supported by the data:

- direct factual recall
- reverse identification
- correct/incorrect pair
- multi-statement
- chronology
- match the following
- location relation
- classification
- comparative relation
- multi-hop person/event/place or river/project/district relation

Hard questions must test relation depth, not obscure trivia.

## Source hierarchy

1. Government of Punjab and Punjab department portals
2. Census of India and other Government of India primary sources
3. Punjab Gazetteers, legislature/election/official institutional records
4. NCERT/PSEB and recognised academic/university publications
5. Reputed secondary references only for discovery or corroboration

Disputed historical facts require reconciliation before learner publication.

## Lifecycle per CP

`source collection → fact library → QL design → deterministic review batch → human review → correction → QA → freeze → Question Studio integration`

No CP becomes runtime-active merely because the review generator runs.
