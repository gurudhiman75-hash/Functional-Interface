# Indian Geography — Family Freeze Audit V1

Status: FAMILY CONTENT FROZEN — QUESTION STUDIO REVIEW-ONLY

## Scope
This authority covers the complete Indian Geography package family currently implemented in Examtree:

1. GEO-LOC-001 — Location, Extent & Neighbours
2. GEO-PHY-001 — Physiography
3. GEO-RIV-001 — Rivers & Drainage
4. GEO-CLI-001 — Climate & Monsoon
5. GEO-SOI-001 — Soils
6. GEO-VEG-001 — Natural Vegetation & Wildlife
7. GEO-AGR-001 — Agriculture
8. GEO-MIN-001 — Minerals & Energy
9. GEO-IND-001 — Industries
10. GEO-TRN-001 — Transport & Communication
11. GEO-POP-001 — Population & Settlements
12. GEO-WAT-001 — Water Resources, Irrigation & Multipurpose Projects
13. GEO-HAZ-001 — Natural Hazards & Disaster Geography
14. GEO-LND-001 — Land Resources, Land Use & Degradation
15. GEO-PLN-001 — Regional Planning & Sustainable Development
16. GEO-LAK-001 — Lakes, Lagoons & Waterfalls
17. GEO-MTP-001 — Mountain Passes & Major Peaks

## Final audit findings
- No major Indian Geography syllabus block remains unowned after the residual passes.
- All 17 packages are routed through the Question Studio composite adapter.
- All 17 adapters use review-only lifecycle controls with Question Bank writes disabled.
- Older mature packages (Climate, Physiography, Rivers, Soils, Vegetation) retain their earlier closure-authority architecture rather than being rewritten only for cosmetic consistency.
- Later packages use owning-pool + non-owning integrated/mastery layers.
- No new World Geography work is included in this authority.

## Ownership boundaries
To prevent duplicate fact ownership:
- GEO-AGR-001 owns crop/agricultural-system facts; GEO-WAT-001 owns water-resource and irrigation-system geography.
- GEO-WAT-001 owns major dam/project geography; GEO-PLN-001 may reuse Indira Gandhi Canal facts only for regional-planning reasoning.
- GEO-PHY-001 owns physiographic divisions; GEO-MTP-001 owns named passes/peaks as reference-map facts.
- GEO-RIV-001 owns river systems; GEO-LAK-001 owns named lake/lagoon/waterfall location relationships.
- GEO-LOC-001 owns India extent, neighbours, states/UT reference geography and islands.
- GEO-VEG-001 owns vegetation/wildlife geography; GEO-HAZ-001 owns hazard processes and warning/mitigation geography.
- Integrated/mastery CPs are non-owning and must not create new permanent semantic facts.

## Static-GK discipline
- Stable geographic relationships may remain undated.
- Census percentages/rankings remain explicitly tied to Census 2011.
- Volatile traffic, network-length, reservoir-level, production, ranking and project-progress figures are not timeless permanent QLs.
- Current-event updates must not overwrite closed static authorities without a deliberate revision.

## Family lifecycle
- content frozen
- Question Studio review-only
- immutable closed authorities
- deterministic generation where supported by each package
- no automatic Question Bank writes
- no mock/test/public publication
- no production release without separate authorization

Indian Geography should not receive new packages unless a later source-led audit identifies a genuinely missing exam-relevant block or a source change requires revision.
