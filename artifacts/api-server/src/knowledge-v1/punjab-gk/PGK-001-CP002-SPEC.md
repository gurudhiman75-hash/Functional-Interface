# PGK-001 CP002 — Administrative Punjab

Status: REVIEW CANDIDATE V1
Chapter: `PGK-001 — Punjab General Knowledge`
CP: `PGK-001-CP-002 — Administrative Punjab`
Permanent QLs: `PGK-001-QL-007` to `PGK-001-QL-013`

## Scope

CP002 builds the present-day administrative relation layer for Punjab: five administrative divisions, the 23-district set, district headquarters/aliases, division membership and selected high-value district-formation history.

## Qualified coverage

- Official statistical snapshot: 5 administrative divisions and 23 districts in `Punjab at a Glance 2022`
- Current 23-district roster cross-checked against the Government of Punjab ePoS district list
- Division set: Faridkot, Ferozepur, Jalandhar, Patiala and Rupnagar/Ropar
- District-to-division map used as an administrative relation graph
- District headquarters, including the non-identical-name cases:
  - Sahibzada Ajit Singh Nagar district → Mohali
  - Shaheed Bhagat Singh Nagar district → Nawanshahr
- Common official aliases are preserved for recognition: Rupnagar/Ropar, Sahibzada Ajit Singh Nagar/SAS Nagar/Mohali, Shaheed Bhagat Singh Nagar/SBS Nagar/Nawanshahr, Sri Muktsar Sahib/Muktsar, Ferozepur/Firozpur
- Selected formation history:
  - Moga: district formed on 24 November 1995; earlier a subdivision of Faridkot district
  - Sahibzada Ajit Singh Nagar: formed as Punjab's 18th district on 14 April 2006 from areas of Ropar and Patiala districts; part of Rupnagar division
  - Tarn Taran: formed on 16 June 2006 from Amritsar district; became Punjab's 19th district
  - Barnala: became a district on 19 November 2006; earlier part of Sangrur district
  - Pathankot: declared a district on 27 July 2011; earlier a tehsil of Gurdaspur district
  - Fazilka: announced as Punjab's 21st district in July 2011; earlier part of Ferozepur district
  - Malerkotla: carved out of Sangrur as Punjab's 23rd district on 2 June 2021

## Freshness rule

Administrative membership is mutable. `23 districts` and `5 divisions` are source-versioned facts, not eternal counts. Current office-holders, DC names, commissioner names, tehsil counts and local-body counts are excluded from the static learner pool.

## QL design

| QL | Focus | Difficulty |
| --- | --- | --- |
| PGK-001-QL-007 | Division count and division names | Easy |
| PGK-001-QL-008 | District headquarters and administrative aliases | Easy / Medium |
| PGK-001-QL-009 | District-to-division membership | Medium |
| PGK-001-QL-010 | District formation and parent-district history | Medium |
| PGK-001-QL-011 | Correct/incorrect administrative pairs | Medium |
| PGK-001-QL-012 | Two-clue district identification | Medium / Hard |
| PGK-001-QL-013 | Multi-statement administrative synthesis | Hard |

Each QL exposes six semantic payloads, for 42 review questions total.

## Stem rule

Use direct Punjab-exam language. Avoid repeatedly starting with `Which of the following is associated with...` or adding `with reference to Punjab` when the context is already obvious.

## Distractor rule

District questions must use district distractors; division questions use divisions; headquarters questions use plausible Punjab cities. Formation questions should use nearby years or similarly timed district-creation events.

## Explanation rule

Explanations should normally be 2–4 short sentences and state the decisive administrative relation. Formation explanations should include both date/year and parent district when verified.

## Lifecycle

This checkpoint is review-only. It is not registered for runtime Question Studio generation, Question Bank writes, tests, mocks or public publication until explicit human approval.
