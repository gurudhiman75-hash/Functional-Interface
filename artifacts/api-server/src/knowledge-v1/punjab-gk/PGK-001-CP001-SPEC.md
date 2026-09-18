# PGK-001 CP001 — Punjab Basic Profile

Status: HUMAN APPROVED / FROZEN V1
Chapter: `PGK-001 — Punjab General Knowledge`
CP: `PGK-001-CP-001 — Punjab Basic Profile`
Permanent QLs: `PGK-001-QL-001` to `PGK-001-QL-006`

## Scope

CP001 establishes the stable identity layer for present-day Indian Punjab while explicitly separating it from undivided/historical Punjab. It covers the name and river origin, present-day rivers, broad traditional regions, area/location, boundaries, official language/script, capital/reorganisation and a small verified state-symbol set.

### Qualified coverage

- Punjab = Punj (five) + Aab (water), conventionally understood as land of five rivers
- Historical five rivers: Sutlej, Beas, Ravi, Chenab and Jhelum
- Present Indian Punjab: Sutlej, Beas and Ravi flow through the state
- Traditional regions: Majha, Doaba and Malwa
- Geographical area: 50,362 sq km
- Approximate official portal coordinate span: 29.30°N–32.32°N and 73.55°E–76.50°E
- Boundaries: Pakistan to the west; Jammu and Kashmir to the north; Himachal Pradesh to the northeast; Haryana and Rajasthan to the south
- Official language: Punjabi; script used on the Punjab government profile: Gurmukhi
- Capital: Chandigarh; Chandigarh is a Union Territory and serves as the capital of both Punjab and Haryana
- Reorganisation reference date: 1 November 1966
- Versioned administrative snapshot: 23 districts in Punjab at the `Punjab at a Glance 2022` reference point
- Verified state symbols in this checkpoint: Blackbuck (state animal), Shisham/Indian Rosewood (`Dalbergia sissoo`) (state tree), Northern Goshawk (state bird), Indus River dolphin (`Platanista minor`) (state aquatic animal)

## Historical-geography guard

The learner-facing engine must never equate the five historical Punjab rivers with rivers flowing through present-day Indian Punjab. `Chenab` and `Jhelum` may appear in the historical five-river set, but CP001 questions must state or imply the historical/etymological context when using all five.

Likewise, `CURRENT_PUNJAB`, `UNDIVIDED_PUNJAB`, `EAST_PUNJAB`, `PEPSU`, and `POST_1966_PUNJAB` are distinct scopes. CP001 tests only the first/last two where needed; later history CPs own deeper chronology.

## Freshness guard

The following are not immutable facts and must carry a reference date or remain outside CP001:

- district counts
- tehsil/subdivision/local-body counts
- current office holders
- current budget/economic rankings

`23 districts` is therefore explicitly a 2022 official statistical snapshot, not a timeless statement.

## QL design

| QL | Focus | Difficulty |
| --- | --- | --- |
| PGK-001-QL-001 | Name, historical five rivers and present-day river distinction | Easy |
| PGK-001-QL-002 | Area, location and borders | Easy |
| PGK-001-QL-003 | Traditional regions and direct identity relations | Easy / Medium |
| PGK-001-QL-004 | Capital, language, script, reorganisation and versioned administration | Medium |
| PGK-001-QL-005 | State symbols and close semantic distractors | Medium |
| PGK-001-QL-006 | Two-clue / multi-statement synthesis with historical-geography guard | Hard |

Each QL exposes six semantic payloads, for 36 review questions total.

## Language rule

Learner language must be short, natural and exam-like. Avoid filler such as `associated with`, `with reference to Punjab`, or explanatory material inside the stem when the relation can be asked directly. Difficulty must come from close relations and controlled composition, not from long sentences.

## Explanation rule

Explanations should normally be 2–4 short sentences. They must add the key relation or distinction that makes the answer correct. No routine option-by-option analysis.

## Source authority

Primary/current identity facts are based on Government of Punjab `Know Punjab` and `Punjab at a Glance 2022`. Symbol facts use official/government educational, examination, environment or fisheries references and remain source-tagged individually.

## Lifecycle

CP001 V1 was human-approved on 14 September 2026 and is frozen as the accepted review authority. Runtime Question Studio registration, Question Bank writes, tests, mocks and publication remain a separate later integration step.
