# PGK-001 Source Audit V2

Status: IN PROGRESS — SOURCE CERTIFICATION BLOCKED
Branch: `feature/pgk-001-source-audit-v2`
Baseline: current `New-main`

## Certification standard

A Punjab GK fact passes source audit only when:

1. the canonical fact has explicit fact-level provenance;
2. every referenced source ID resolves to a stable source registry entry;
3. the source supports the exact learner claim, not merely the surrounding topic;
4. source quality is classified;
5. mutable claims carry a reference date/version where needed;
6. weak search pages, homepages, exam papers and discovery-only references do not act as sole canonical authority;
7. disputed or variant historical claims are reconciled before certification.

Source classes used in this audit:

- `PRIMARY` — statute/notification, Government department, official institution record, census, board/agency project record.
- `STRONG_SECONDARY` — PSEB/NCERT/recognised university or comparable authoritative educational reference.
- `SUPPORTING` — useful corroboration but insufficient as sole authority for a sensitive/superlative/disputed claim.
- `WEAK` — search portal, generic homepage, exam question paper, indirect or discovery-only page.
- `MISSING` — no resolvable fact-level authority.
- `DISPUTED` — competing spellings/interpretations or historical claims requiring reconciliation.

## Structural source audit

| CP | Module | Registry | Fact-level binding | V2 source status |
| --- | --- | --- | --- | --- |
| CP001 | Basic Profile | Yes | Yes | PARTIAL — strong overall; state-animal authority is an official exam paper and must be upgraded |
| CP002 | Administrative Punjab | No | Partial | BLOCKED — formation facts carry source IDs, but district/HQ/division master rows lack per-row provenance and source IDs are not resolved through a registry |
| CP003 | Physical Regions & Relief | Yes | Yes | PASS STRUCTURALLY — Government Punjab / PUDA / PAU links are explicit |
| CP004 | Rivers & Doabs | Yes | No | BLOCKED — ancient river names, doabs and relation facts do not bind to source IDs |
| CP005 | Dams, Barrages & Canals | Yes | Yes | PARTIAL — strong BBMB/PSPCL/PUDA core; UBDC points to PSPCL homepage and Harike points to e-procurement portal rather than a stable record |
| CP006 | Climate, Soils & Natural Resources | No | No | BLOCKED — source constants exist but facts have no source binding and no registry on New-main |
| CP007 | Forests, Wildlife & Wetlands | No | No | BLOCKED |
| CP008 | Agriculture | Yes | No | BLOCKED — authorities exist, fact-to-source binding missing |
| CP009 | Economy & Industries | Yes | No | BLOCKED — authorities exist, fact-to-source binding missing |
| CP010 | Ancient Punjab | Yes | No | BLOCKED — historical fact-to-source binding missing |
| CP011 | Medieval Punjab | No | No | BLOCKED |
| CP012 | Sikh Gurus & Punjab | No | No | BLOCKED |
| CP013 | Banda Singh Bahadur & Sikh Struggle | No | No | BLOCKED |
| CP014 | Sikh Misls & Dal Khalsa | No | No | BLOCKED |
| CP015 | Maharaja Ranjit Singh & Sikh Empire | No | No | BLOCKED |
| CP016 | Anglo-Sikh Wars & Annexation | No | Yes | PARTIAL — fact-level source IDs exist but no source registry resolves/classifies them |
| CP017 | Reform & Freedom Movements | No | No | BLOCKED |
| CP018 | Partition, PEPSU & Reorganisation | No | No | BLOCKED |
| CP019 | Punjab Polity & Governance | No | No | BLOCKED |
| CP020 | Census & Demography | No | No | BLOCKED |
| CP021 | Punjabi Language & Gurmukhi | No | No | BLOCKED |
| CP022 | Punjabi Literature | No | Yes | PARTIAL — fact-level source IDs exist but registry/classification is absent |
| CP023 | Folk Culture, Music & Dance | No | No | BLOCKED |
| CP024 | Fairs, Festivals & Heritage | No | No | BLOCKED |
| CP025 | Personalities & Sports | No | No | BLOCKED |
| CP026 | District Deep Dive | No | No | BLOCKED |

## Verified source-strength findings so far

### CP001

The core identity layer is mostly strong: Government of Punjab `Know Punjab`, `Punjab at a Glance 2022`, PSEB, Punjab ENVIS/PSCST and NFDB are identifiable authorities.

Blocking/repair item:
- `state-animal-blackbuck` currently uses a Government of Punjab recruitment/question paper as canonical evidence. Government hosting does not make an exam paper a suitable primary authority for the state-symbol designation. Replace with a direct department/notification/official profile authority or retain only as supporting evidence.

### CP002

Verified:
- `Punjab at a Glance 2022` supports 23 districts and 5 divisions.
- Punjab ePOS currently lists all 23 districts.

Blocking/repair items:
- district/HQ/division rows do not carry per-row source IDs;
- division membership needs pinpoint authoritative support, not inference from the five-division count;
- source IDs must resolve through a registry with stable locators.

### CP003

Current structure meets the source-linkage standard. Region/place and physiography records bind directly to Government of Punjab, PUDA master/regional plans or PAU.

### CP004

Source registry quality is generally suitable:
- Government of Punjab;
- BBMB;
- PUDA;
- PSEB.

Blocking/repair item:
- canonical fact objects have no source binding. Add an explicit fact-ID → source-ID authority map and reconcile ancient-name spellings before certification.

### CP005

Strong core sources:
- BBMB for Bhakra/Pong/Beas-Sutlej system;
- PSPCL for Ranjit Sagar/Shahpurkandi;
- PUDA for local headworks/canal geography.

Blocking/repair items:
- `PSPCL-UBDC-HYDEL` uses the generic PSPCL homepage;
- `PUNJAB-WR-HARIKE-HEADWORKS` uses the e-procurement portal;
- both must be replaced with stable, claim-specific records or demoted to supporting-only.

### CP006

The intended authority set is reasonable — Government of Punjab, PSEB, PAU and Soil & Water Conservation — but New-main does not resolve those IDs in a source registry and does not bind individual facts to them.

## Certification blockers

PGK-001 must not be labelled `FINAL_EXHAUSTIVE_SOURCE_AUDIT_CERTIFIED` until:

- all 26 CPs have resolvable source registries;
- every canonical fact reachable by Question Studio has fact-level authority binding;
- weak sole authorities are upgraded or the affected claim is removed/reworded;
- historical variants/disputed facts are reconciled;
- volatile administrative/demographic claims are versioned;
- an automated source-audit test proves no reachable fact has missing or unresolved provenance.

Question Studio may remain review-only while remediation is underway. This audit does not authorize Question Bank, test/mock, public, automatic-student or production release.
