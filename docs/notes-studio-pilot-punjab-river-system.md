# Notes Studio production pilot — Punjab River System

Status: operator-ready pilot manifest (NS-021 rights-safe path)

Purpose: run a real Static-GK note through the normal Notes Studio lifecycle without Punjab-specific product code, synthetic evidence, or special-case database edits. The pilot is intended to expose generic production gaps and convert only repeatable gaps into Notes Studio checkpoints.

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
- Taxonomy binding: bind to the live canonical Punjab Geography / rivers node if it exists. If it cannot be resolved, keep the explicit topic label and do not invent a taxonomy ID.

### Syllabus / exam emphasis

Create an exam-oriented note that distinguishes the historic five-river identity of Punjab from the rivers flowing through present-day Indian Punjab; places Ravi, Beas and Sutlej in the wider Indus system; covers the highest-yield river-development and water-management associations; and avoids unsupported coaching shorthand, folklore and encyclopedic padding.

## 2. Governed source pack and rights decision

The pilot uses `official_first` and requires two genuinely independent governed sources. Source-policy independence still depends on distinct content hashes and publisher/domain identities.

For this pilot, **do not infer reproduction or retained-text permission from the fact that a publisher is a government body**. Unless an editor has separately documented a rights basis that permits retained source text, ingest the Punjab Government and BBMB pages as:

- `rightsBasis = reference_only`
- `retentionMode = metadata_only`

NS-021 then makes the source evidence-ready only after an editor records at least one reviewed `editor_reference_note` for that source. The publisher wording remains unretained.

### Mandatory source A — primary authority

- Publisher: Government of Punjab, India
- Role: `primary_authority`
- URL: `https://punjab.gov.in/know-punjab/`
- Intended use: Punjab/five-river identity, historic river framing, present-day Punjab river framing, and bounded regional context.
- Pilot rights path: `reference_only` unless independently documented permission/licence permits text retention.

### Mandatory source B — core reference

- Publisher: Bhakra Beas Management Board
- Role: `core_reference`
- Preferred URL: `https://bbmb.gov.in/indus-basin.htm`
- Supporting BBMB pages may be attached separately when needed:
  - `https://bbmb.gov.in/formation-of-bbmb.htm`
  - `https://bbmb.gov.in/functions-of-bbmb.htm`
  - `https://bbmb.gov.in/beas-project-.htm`
- Intended use: Indus-basin context, eastern-river allocation, Bhakra-Nangal, Beas-Sutlej Link, Pong Dam and BBMB institutional/project facts.
- Pilot rights path: `reference_only` unless independently documented permission/licence permits text retention.

### Supplemental candidate — CWC

- Publisher: Central Water Commission
- Candidate URL: `https://www.cwc.gov.in/en/about-basins`
- Role after editorial review: `supplemental` or `core_reference`
- Use only if normal governed intake can fetch the source and the editor records a truthful rights basis. Do not weaken URL, fetch or rights safeguards merely to make the pilot green.

### Optional exam-context source

A current official Punjab recruitment/commission syllabus may be attached as `exam_context` if it establishes Punjab-specific General Knowledge coverage. It is not factual river evidence unless the document itself contains the relevant factual proposition.

## 3. NS-021 reference-evidence rules for this pilot

For a `reference_only` / `metadata_only` source:

1. Open the exact governed source from **Notes Studio → Reference Evidence**.
2. Verify one factual proposition at a time.
3. Record an exact page heading, section, table, paragraph or equivalent locator.
4. Write a bounded factual paraphrase independently in the editor's own words; do not paste or lightly rewrite publisher wording.
5. Explicitly attest that the note is independently paraphrased.
6. The resulting evidence block is `editor_reference_note`; publisher wording is not retained.
7. Recording reference evidence never creates or accepts a claim automatically.
8. A metadata-only source does not satisfy an evidence-ready source-policy requirement until reviewed reference evidence exists.

The ordinary **Build evidence index** action remains for sources whose governed rights basis permits retained extracted text. A reference-evidence-only pilot does not need to manufacture a retained-text source or run a no-op rebuild before claim work; the reviewed reference notes are already evidence blocks.

## 4. Coverage plan

Create these 14 targets in order.

| # | Coverage target | Syllabus ref | Priority | Depth | Exam rationale |
|---|---|---|---|---|---|
| 1 | Why Punjab is called the land of five rivers | Punjab Geography → River System → Identity | required | standard | Foundational definition and historic/present-day framing. |
| 2 | Historic five rivers: Jhelum, Chenab, Ravi, Beas and Sutlej | Punjab Geography → River System → Historic five | required | standard | High-yield enumeration/classification fact. |
| 3 | Rivers flowing through present-day Indian Punjab: Ravi, Beas and Sutlej | Punjab Geography → River System → Present-day Punjab | required | standard | Prevents a common historic-vs-present-day confusion. |
| 4 | Punjab rivers within the wider Indus river system | Indian Geography → Indus System → Punjab rivers | required | standard | Connects state GK with national river-system hierarchy. |
| 5 | Eastern vs western rivers under the Indus Waters Treaty | Indian Geography → Indus Waters Treaty → River groups | high | standard | Common competitive-exam classification; authoritative support required. |
| 6 | Sutlej: exam-relevant course and Punjab significance | Punjab Geography → Rivers → Sutlej | required | deep | Supports Bhakra-Nangal and water-management associations. |
| 7 | Beas: exam-relevant course and Punjab significance | Punjab Geography → Rivers → Beas | required | deep | Supports Pong/Beas Project associations. |
| 8 | Ravi: exam-relevant course and Punjab significance | Punjab Geography → Rivers → Ravi | required | deep | Supports treaty/project associations. |
| 9 | Bhakra-Nangal project and Sutlej linkage | Punjab Geography → River Projects → Bhakra-Nangal | high | standard | High-yield river/project pairing. |
| 10 | Beas Project: Beas-Sutlej Link and Pong Dam | Punjab Geography → River Projects → Beas Project | high | standard | High-yield project/river associations. |
| 11 | Ravi development context including Thein/Ranjit Sagar only if adequately supported | Punjab Geography → River Projects → Ravi | supporting | brief | Leave uncovered rather than infer unsupported naming/project relationships. |
| 12 | BBMB role in regulation of Ravi, Beas and Sutlej water / project power | Punjab Geography → Water Management → BBMB | high | standard | Links river projects with the responsible institution. |
| 13 | Majha, Doaba and Malwa: only river-related regional facts directly supported by evidence | Punjab Geography → Physiographic/Cultural Regions | supporting | brief | Preserve bounded regional framing without inventing river boundaries. |
| 14 | High-yield comparison / revision table | Punjab Geography → River System → Revision | high | standard | Consolidate only accepted-claim material. |

### Bulk coverage import payload

Paste this array into **Notes Studio → Coverage Import**. The import is atomic and creates coverage targets only.

```json
[
  {"title":"Why Punjab is called the land of five rivers","syllabusRef":"Punjab Geography → River System → Identity","priority":"required","plannedDepth":"standard","examRationale":"Foundational definition and historic/present-day framing.","sortOrder":0},
  {"title":"Historic five rivers: Jhelum, Chenab, Ravi, Beas and Sutlej","syllabusRef":"Punjab Geography → River System → Historic five","priority":"required","plannedDepth":"standard","examRationale":"High-yield enumeration/classification fact.","sortOrder":1},
  {"title":"Rivers flowing through present-day Indian Punjab: Ravi, Beas and Sutlej","syllabusRef":"Punjab Geography → River System → Present-day Punjab","priority":"required","plannedDepth":"standard","examRationale":"Prevents a common historic-vs-present-day confusion.","sortOrder":2},
  {"title":"Punjab rivers within the wider Indus river system","syllabusRef":"Indian Geography → Indus System → Punjab rivers","priority":"required","plannedDepth":"standard","examRationale":"Connects state GK with national river-system hierarchy.","sortOrder":3},
  {"title":"Eastern vs western rivers under the Indus Waters Treaty","syllabusRef":"Indian Geography → Indus Waters Treaty → River groups","priority":"high","plannedDepth":"standard","examRationale":"Common competitive-exam classification; authoritative support required.","sortOrder":4},
  {"title":"Sutlej: exam-relevant course and Punjab significance","syllabusRef":"Punjab Geography → Rivers → Sutlej","priority":"required","plannedDepth":"deep","examRationale":"Supports Bhakra-Nangal and water-management associations.","sortOrder":5},
  {"title":"Beas: exam-relevant course and Punjab significance","syllabusRef":"Punjab Geography → Rivers → Beas","priority":"required","plannedDepth":"deep","examRationale":"Supports Pong/Beas Project associations.","sortOrder":6},
  {"title":"Ravi: exam-relevant course and Punjab significance","syllabusRef":"Punjab Geography → Rivers → Ravi","priority":"required","plannedDepth":"deep","examRationale":"Supports treaty/project associations.","sortOrder":7},
  {"title":"Bhakra-Nangal project and Sutlej linkage","syllabusRef":"Punjab Geography → River Projects → Bhakra-Nangal","priority":"high","plannedDepth":"standard","examRationale":"High-yield river/project pairing.","sortOrder":8},
  {"title":"Beas Project: Beas-Sutlej Link and Pong Dam","syllabusRef":"Punjab Geography → River Projects → Beas Project","priority":"high","plannedDepth":"standard","examRationale":"High-yield project/river associations.","sortOrder":9},
  {"title":"Ravi development context including Thein/Ranjit Sagar only if adequately supported","syllabusRef":"Punjab Geography → River Projects → Ravi","priority":"supporting","plannedDepth":"brief","examRationale":"Leave uncovered rather than infer unsupported naming/project relationships.","sortOrder":10},
  {"title":"BBMB role in regulation of Ravi, Beas and Sutlej water / project power","syllabusRef":"Punjab Geography → Water Management → BBMB","priority":"high","plannedDepth":"standard","examRationale":"Links river projects with the responsible institution.","sortOrder":11},
  {"title":"Majha, Doaba and Malwa: only river-related regional facts directly supported by evidence","syllabusRef":"Punjab Geography → Physiographic/Cultural Regions","priority":"supporting","plannedDepth":"brief","examRationale":"Preserve bounded regional framing without inventing river boundaries.","sortOrder":12},
  {"title":"High-yield comparison / revision table","syllabusRef":"Punjab Geography → River System → Revision","priority":"high","plannedDepth":"standard","examRationale":"Consolidate only accepted-claim material.","sortOrder":13}
]
```

## 5. Explicit exclusions

Exclude unless separately supported and exam-relevant:

- unsourced river-length figures;
- exact district-by-district course lists;
- minor tributaries with no clear exam value;
- folklore/etymological variants not established by governed evidence;
- live reservoir levels, discharge or transient flood status;
- political commentary about water disputes;
- claims inferred only from a map;
- precise confluence locations without governed evidence.

## 6. Evidence and claim rules

1. Candidate claims must be atomic: one independently checkable proposition per claim.
2. Every accepted claim must have at least one active `supports` evidence mapping.
3. Both `retained_excerpt` and reviewed `editor_reference_note` blocks are valid governed evidence; discovery snippets and model prose are not.
4. Prefer independent two-source support when a claim combines historic identity, treaty classification or project relationships and both sources cover the fact.
5. Do not turn an editor reference note directly into accepted truth: it still goes through candidate-claim review.
6. If governed sources conflict, mark the claim `conflict` and resolve editorially; do not average or silently choose a value.
7. Preserve learner-facing standard spellings such as `Sutlej` while keeping source identity/locator provenance intact.

## 7. Expected English note shape

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

Section synthesis remains claim-bounded. If a target lacks accepted supported claims, leave the section incomplete and use the governed research loop rather than filling the gap from model knowledge.

## 8. Quality gates

The English version is not review-ready unless:

- all `required` coverage items are `covered`;
- no required/high item is `blocked`;
- no accepted claim lacks active supporting evidence;
- no unresolved conflict feeds a section;
- historic five rivers are explicitly distinguished from the rivers flowing through present-day Indian Punjab;
- Jhelum/Chenab are not described as flowing through present-day Indian Punjab;
- treaty grouping and project/river pairings are source-backed;
- learner markdown contains no unsupported numeric fact;
- the comparison table contains only accepted-claim material;
- all section QA runs pass.

## 9. Localization gate

Only after the English approved version is frozen:

- generate Hindi and Punjabi through the existing localization workflow;
- preserve river/proper-noun identity consistently;
- review Sutlej/Satluj transliteration and project names for semantic parity;
- localization must not introduce facts absent from the approved English version.

## 10. Immediate operator sequence

1. Create/select `Static GK — Punjab River System`.
2. Set source policy to `official_first`.
3. Use Web Discovery to locate the exact Punjab Government and BBMB pages and inspect the returned URLs.
4. Explicitly ingest both mandatory sources as `reference_only` unless a different retention-permitting rights basis is independently documented; assign `primary_authority` and `core_reference` roles.
5. Open **Reference Evidence**. For each mandatory source, review the source and record enough atomic, locator-bearing editor paraphrases to support the pilot's factual scope. Do not paste source wording.
6. Confirm Source Policy shows both required roles as evidence-ready and independence checks are green.
7. Open **Coverage Import** and atomically import the 14 targets above.
8. Work from the reviewed reference evidence blocks in Evidence/Candidate Claims. Run retained-text evidence rebuild only if an additional source genuinely permits retained extracted text.
9. Extract/create candidate claims in bounded batches; accept/reject/conflict them editorially.
10. Apply coverage proposals and inspect uncovered/partial/blocked targets.
11. For real gaps, use Coverage-gap Research → Web Discovery. If the source pack is frozen, use NS-018 Research Restart before attaching or reclassifying sources.
12. Generate sections only from accepted mapped claims.
13. Run QA, approve English, localize Hindi/Punjabi, materialize and hand off for learner publication.

## 11. Pilot success criteria

The pilot succeeds only if it reaches an approved/materialized learner resource through normal Notes Studio controls without synthetic evidence, bypassed review states, Punjab-specific generator code or special database edits.

Record exposed gaps under:

- source discovery/ingestion;
- rights/retention/reference-evidence workload;
- taxonomy binding;
- evidence-block quality;
- claim review workload;
- coverage completeness;
- section exam orientation;
- table/revision formatting;
- QA false positives/negatives;
- Hindi/Punjabi semantic parity;
- materialization/learner presentation.

A repeated structural problem becomes a generic Notes Studio checkpoint. A one-off factual/editorial correction remains editorial work.
