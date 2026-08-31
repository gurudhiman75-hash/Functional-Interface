# Notes Studio production pilot — Punjab River System

Status: operator-ready pilot manifest

Purpose: run a real Static-GK note through the existing Notes Studio lifecycle without adding Punjab-specific product behavior. This document fixes the editorial brief, source-pack intent, coverage targets and acceptance criteria so the pilot can expose genuine workflow/content gaps rather than moving goalposts mid-run.

## 1. Authoring brief

- Internal title: `Static GK — Punjab River System`
- Topic label: `Punjab Geography → River System`
- Source language: `en`
- Depth: `comprehensive`
- Learner level: `standard`
- Source-pack template: `official_first`
- Intended learner resource category: `notes`
- Intended format: `article`
- Initial publication languages after English approval: `hi`, `pa`
- Taxonomy binding: use the canonical Punjab Geography / rivers node if it exists in the live catalog. If the node cannot be resolved, keep the explicit topic label above and do not invent a taxonomy ID.

### Syllabus / exam emphasis

Create an exam-oriented Static-GK note that distinguishes the historic five-river identity of Punjab from the river system of present-day Indian Punjab; places Ravi, Beas and Sutlej within the wider Indus system; covers the highest-yield river-development projects and water-management facts; and avoids unsupported folklore, coaching shorthand and low-value encyclopedic detail.

## 2. Governed source pack

The pilot uses the existing `official_first` policy. The two mandatory sources must be independently fetched, independently hashed and generation-ready before evidence rebuild.

### Mandatory source A — primary authority

- Publisher: Government of Punjab, India
- Role: `primary_authority`
- URL: `https://punjab.gov.in/know-punjab/`
- Why: canonical state-government framing for the meaning of Punjab, the historic five rivers, the three rivers flowing through present-day Indian Punjab, and the Majha / Doaba / Malwa regional framing.
- Rights: editor must choose the correct rights basis during governed intake; discovery must not infer it.

### Mandatory source B — core reference

- Publisher: Bhakra Beas Management Board
- Role: `core_reference`
- Preferred URL: `https://bbmb.gov.in/indus-basin.htm`
- Supporting BBMB pages that may be attached separately when useful:
  - `https://bbmb.gov.in/formation-of-bbmb.htm`
  - `https://bbmb.gov.in/functions-of-bbmb.htm`
  - `https://bbmb.gov.in/beas-project-.htm`
- Why: official technical/institutional coverage of the Indus basin, the eastern-river allocation under the Indus Waters Treaty, Bhakra-Nangal, Beas-Sutlej Link, Pong Dam and the water/power-management role of BBMB.
- Rights: editor must choose the correct rights basis during governed intake.

### Supplemental candidate — CWC

- Publisher: Central Water Commission
- Role when successfully ingested: `supplemental` or `core_reference` only after editorial review
- Candidate URL: `https://www.cwc.gov.in/en/about-basins`
- Why: basin-level river descriptions and project context.
- Important: this page can return an authentication/anti-automation response to some fetchers. It is not required to satisfy the pilot source-pack gate. If Notes Studio cannot fetch it normally, record the failure and continue with the two mandatory independent official sources rather than weakening source-intake safeguards.

### Optional exam-context source

A current official Punjab recruitment / commission syllabus may be added as `exam_context` if it explicitly establishes Punjab-specific General Knowledge coverage. It is not required for the `official_first` evidence gate and must not be used as factual river evidence unless it actually contains the relevant fact.

## 3. Coverage plan

Create the following items in this order. Priorities/depths are deliberately bounded so the first pilot remains exam-oriented rather than encyclopedic.

| # | Coverage target | Syllabus ref | Priority | Depth | Exam rationale |
|---|---|---|---|---|---|
| 1 | Why Punjab is called the land of five rivers | Punjab Geography → River System → Identity | required | standard | Foundational definition; anchors the note and prevents confusion between historic and present-day Punjab. |
| 2 | Historic five rivers: Jhelum, Chenab, Ravi, Beas and Sutlej | Punjab Geography → River System → Historic five | required | standard | High-yield enumeration and classification fact. |
| 3 | Rivers flowing through present-day Indian Punjab: Ravi, Beas and Sutlej | Punjab Geography → River System → Present-day Punjab | required | standard | Essential distinction repeatedly confused in revision material. |
| 4 | Punjab rivers within the wider Indus river system | Indian Geography → Indus System → Punjab rivers | required | standard | Connects state GK with national geography and provides the correct basin hierarchy. |
| 5 | Eastern vs western rivers under the Indus Waters Treaty | Indian Geography → Indus Waters Treaty → River groups | high | standard | Common competitive-exam classification; include only treaty facts supported by authoritative evidence. |
| 6 | Sutlej: exam-relevant course and Punjab significance | Punjab Geography → Rivers → Sutlej | required | deep | Major river for Punjab; supports Bhakra-Nangal and water-management questions. |
| 7 | Beas: exam-relevant course and Punjab significance | Punjab Geography → Rivers → Beas | required | deep | Major river for Punjab; supports Pong/Beas project questions. |
| 8 | Ravi: exam-relevant course and Punjab significance | Punjab Geography → Rivers → Ravi | required | deep | Major river for Punjab; supports Ravi-project and treaty questions. |
| 9 | Bhakra-Nangal project and Sutlej linkage | Punjab Geography → River Projects → Bhakra-Nangal | high | standard | Frequently examined river-project pairing and irrigation/power significance. |
| 10 | Beas Project: Beas-Sutlej Link and Pong Dam | Punjab Geography → River Projects → Beas Project | high | standard | High-yield project/river associations; useful for matching questions. |
| 11 | Ravi development context including Thein/Ranjit Sagar only if adequately supported | Punjab Geography → River Projects → Ravi | supporting | brief | Include only if authoritative retained evidence supports the exact naming/project relationship; otherwise leave uncovered rather than infer. |
| 12 | BBMB role in regulation of Ravi, Beas and Sutlej water / project power | Punjab Geography → Water Management → BBMB | high | standard | Links rivers with the institution candidates are often asked to identify. |
| 13 | Majha, Doaba and Malwa: only river-related regional facts directly supported by retained evidence | Punjab Geography → Physiographic/Cultural Regions | supporting | brief | Preserve the official three-region framing but do not invent river boundaries from memory. |
| 14 | High-yield comparison / revision table | Punjab Geography → River System → Revision | high | standard | Consolidate river, system, major project and one-line exam associations entirely from accepted claims. |

### Bulk coverage import payload

After NS-020 is deployed, paste this JSON array into **Notes Studio → Coverage Import** for the pilot job. The action is an atomic append and creates only coverage targets.

```json
[
  {
    "title": "Why Punjab is called the land of five rivers",
    "syllabusRef": "Punjab Geography → River System → Identity",
    "priority": "required",
    "plannedDepth": "standard",
    "examRationale": "Foundational definition; anchors the note and prevents confusion between historic and present-day Punjab.",
    "sortOrder": 0
  },
  {
    "title": "Historic five rivers: Jhelum, Chenab, Ravi, Beas and Sutlej",
    "syllabusRef": "Punjab Geography → River System → Historic five",
    "priority": "required",
    "plannedDepth": "standard",
    "examRationale": "High-yield enumeration and classification fact.",
    "sortOrder": 1
  },
  {
    "title": "Rivers flowing through present-day Indian Punjab: Ravi, Beas and Sutlej",
    "syllabusRef": "Punjab Geography → River System → Present-day Punjab",
    "priority": "required",
    "plannedDepth": "standard",
    "examRationale": "Essential distinction repeatedly confused in revision material.",
    "sortOrder": 2
  },
  {
    "title": "Punjab rivers within the wider Indus river system",
    "syllabusRef": "Indian Geography → Indus System → Punjab rivers",
    "priority": "required",
    "plannedDepth": "standard",
    "examRationale": "Connects state GK with national geography and provides the correct basin hierarchy.",
    "sortOrder": 3
  },
  {
    "title": "Eastern vs western rivers under the Indus Waters Treaty",
    "syllabusRef": "Indian Geography → Indus Waters Treaty → River groups",
    "priority": "high",
    "plannedDepth": "standard",
    "examRationale": "Common competitive-exam classification; include only treaty facts supported by authoritative evidence.",
    "sortOrder": 4
  },
  {
    "title": "Sutlej: exam-relevant course and Punjab significance",
    "syllabusRef": "Punjab Geography → Rivers → Sutlej",
    "priority": "required",
    "plannedDepth": "deep",
    "examRationale": "Major river for Punjab; supports Bhakra-Nangal and water-management questions.",
    "sortOrder": 5
  },
  {
    "title": "Beas: exam-relevant course and Punjab significance",
    "syllabusRef": "Punjab Geography → Rivers → Beas",
    "priority": "required",
    "plannedDepth": "deep",
    "examRationale": "Major river for Punjab; supports Pong/Beas project questions.",
    "sortOrder": 6
  },
  {
    "title": "Ravi: exam-relevant course and Punjab significance",
    "syllabusRef": "Punjab Geography → Rivers → Ravi",
    "priority": "required",
    "plannedDepth": "deep",
    "examRationale": "Major river for Punjab; supports Ravi-project and treaty questions.",
    "sortOrder": 7
  },
  {
    "title": "Bhakra-Nangal project and Sutlej linkage",
    "syllabusRef": "Punjab Geography → River Projects → Bhakra-Nangal",
    "priority": "high",
    "plannedDepth": "standard",
    "examRationale": "Frequently examined river-project pairing and irrigation/power significance.",
    "sortOrder": 8
  },
  {
    "title": "Beas Project: Beas-Sutlej Link and Pong Dam",
    "syllabusRef": "Punjab Geography → River Projects → Beas Project",
    "priority": "high",
    "plannedDepth": "standard",
    "examRationale": "High-yield project/river associations; useful for matching questions.",
    "sortOrder": 9
  },
  {
    "title": "Ravi development context including Thein/Ranjit Sagar only if adequately supported",
    "syllabusRef": "Punjab Geography → River Projects → Ravi",
    "priority": "supporting",
    "plannedDepth": "brief",
    "examRationale": "Include only if authoritative retained evidence supports the exact naming/project relationship; otherwise leave uncovered rather than infer.",
    "sortOrder": 10
  },
  {
    "title": "BBMB role in regulation of Ravi, Beas and Sutlej water / project power",
    "syllabusRef": "Punjab Geography → Water Management → BBMB",
    "priority": "high",
    "plannedDepth": "standard",
    "examRationale": "Links rivers with the institution candidates are often asked to identify.",
    "sortOrder": 11
  },
  {
    "title": "Majha, Doaba and Malwa: only river-related regional facts directly supported by retained evidence",
    "syllabusRef": "Punjab Geography → Physiographic/Cultural Regions",
    "priority": "supporting",
    "plannedDepth": "brief",
    "examRationale": "Preserve the official three-region framing but do not invent river boundaries from memory.",
    "sortOrder": 12
  },
  {
    "title": "High-yield comparison / revision table",
    "syllabusRef": "Punjab Geography → River System → Revision",
    "priority": "high",
    "plannedDepth": "standard",
    "examRationale": "Consolidate river, system, major project and one-line exam associations entirely from accepted claims.",
    "sortOrder": 13
  }
]
```

### Explicit exclusions for the first pilot

Do not pad the note with facts merely because they are commonly found in coaching notes. Exclude unless separately supported and exam-relevant:

- unsourced river-length figures;
- exact district-by-district course lists;
- minor tributaries with no clear exam value;
- folklore / etymological variants not established by the primary source;
- current reservoir levels, live discharge data or transient flood status;
- political commentary about water disputes;
- any claim inferred from a map without textual/authoritative support;
- precise confluence locations unless a governed source supports them.

## 4. Evidence and claim rules

1. Rebuild evidence only after `official_first` source policy is green.
2. Candidate claims must be atomic: one independently checkable proposition per claim.
3. Every accepted claim must retain at least one active `supports` evidence mapping.
4. Prefer two-source support for claims that combine historical identity, treaty classification or project relationships when both authoritative sources cover the point.
5. Do not turn discovery-result snippets or model prose into claims. Only retained governed-source evidence blocks count.
6. When Punjab Government and BBMB use different spellings such as `Sutlej` / `Satluj`, preserve the learner-facing standard spelling but keep source wording/provenance intact in evidence.
7. If a source conflicts with another source, mark the claim `conflict` and resolve editorially; do not average or silently choose a value.

## 5. Section target

Expected English note shape after claim review and coverage mapping:

1. Punjab and the five-river identity
2. Historic five vs present-day Indian Punjab
3. Punjab rivers in the Indus system
4. Sutlej
5. Beas
6. Ravi
7. Indus Waters Treaty: eastern/western river grouping
8. Major river projects and BBMB
9. Exam-oriented comparison table
10. Rapid revision / one-line takeaways

The section generator remains claim-bounded. If a coverage target lacks accepted supported claims, leave the section incomplete and use the NS-016 → NS-019 → NS-018 research loop instead of filling the gap from model knowledge.

## 6. Quality gates for this pilot

The English version is not review-ready unless all of the following are true:

- all `required` coverage items are `covered`;
- no required/high item is `blocked`;
- no active accepted claim lacks supporting evidence;
- no unresolved conflict claim feeds a section;
- the distinction between historic five rivers and the three rivers flowing in today's Punjab is explicit;
- Jhelum/Chenab are not described as flowing through present-day Indian Punjab;
- the Indus Waters Treaty river grouping is sourced, not model-inferred;
- project-to-river pairings are source-backed;
- no unsupported numeric fact appears in learner markdown;
- the comparison table contains only accepted-claim material;
- all section QA runs pass before approval.

## 7. Localization gate

Only after the English approved version is frozen:

- generate Hindi and Punjabi localizations through the existing localization workflow;
- preserve river/proper-noun identity consistently across languages;
- specifically review Sutlej/Satluj transliteration and project names for semantic parity;
- do not allow localization to introduce new factual detail absent from the approved English source version.

## 8. Pilot success criteria

This pilot is successful only if it reaches an approved/materialized learner resource through normal Notes Studio controls **without special-case database edits or Punjab-specific generator code**.

Record product gaps exposed during the run under these buckets:

- source discovery / ingestion;
- source rights / retention;
- taxonomy binding;
- evidence-block quality;
- claim extraction/review workload;
- coverage completeness;
- section structure / exam orientation;
- table/revision formatting;
- QA false positives/negatives;
- Hindi/Punjabi semantic parity;
- materialization / learner presentation.

Any repeated structural gap should become a generic Notes Studio checkpoint. A one-off content correction should remain an editorial correction, not new infrastructure.

## 9. Immediate operator sequence

1. Create/select the `Static GK — Punjab River System` authoring job.
2. Set source policy to `official_first`.
3. In Web discovery, search for the Government of Punjab and BBMB sources above and inspect the actual returned URLs.
4. Explicitly ingest the two mandatory sources with reviewed rights bases; assign `primary_authority` and `core_reference` roles.
5. Confirm source-policy readiness and source independence.
6. Open **Coverage Import**, paste the 14-item payload above and import it atomically.
7. Rebuild evidence.
8. Run candidate-claim extraction on evidence blocks in bounded batches.
9. Accept/reject/conflict claims editorially.
10. Apply coverage proposals, then inspect uncovered/partial/blocked targets.
11. For genuine gaps, use Coverage-gap research → Web discovery; if the source pack is already frozen, use NS-018 research restart before attaching a new source.
12. Generate sections only from accepted mapped claims.
13. Run QA, approve English, localize Hindi/Punjabi, materialize and hand off for publication.

This sequence is deliberately the normal product path. The pilot must not be made green by seeding synthetic evidence or bypassing review states.
