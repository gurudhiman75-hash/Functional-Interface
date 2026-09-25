# PGK-001 CP001 — Exhaustive Audit V1

Status: REVIEW-READY / AWAITING HUMAN APPROVAL
Chapter: `PGK-001 — Punjab General Knowledge`
Checkpoint: `PGK-001-CP-001 — Punjab Basic Profile`
Audit scope: all 36 frozen English review questions, all 6 QLs, all 21 canonical fact rows
Base: `New-main`
Audit branch: `feature/pgk-001-cp001-exhaustive-audit-v1`

## 1. Audit result

CP001 is factually stable and structurally complete. No confirmed wrong answer, QL ownership error, duplicate question, missing fact, option-count defect, or historical/current Punjab scope collision was found.

One editorial defect class was found: learner-facing source/provenance wording survived in 15 question rows. These references made otherwise good questions sound like internal review material rather than competitive-exam questions. The learner text has been cleaned without changing any canonical answer, QL ownership, fact ID, source ID, difficulty, or question count.

## 2. Full question audit

- Questions audited: 36 / 36
- QLs audited: 6 / 6
- Questions per QL: 6 each
- Canonical facts used: 21 / 21
- Options: 4 unique options per question
- Exact duplicate questions: 0
- Confirmed factual errors: 0
- Blocking ambiguity defects: 0
- Historical/current Punjab scope violations: 0
- Versioning failures for the 2022 district snapshot: 0
- Learner-facing source/provenance wording rows found and remediated: 15

Difficulty distribution remains:
- Easy: 11
- Medium: 17
- Hard: 8

The distribution is appropriate for a basic-profile CP: direct identity facts dominate Easy/Medium while historical-versus-present river distinctions, chronology and multi-statement synthesis carry the Hard layer.

## 3. Editorial remediation

The following learner-facing patterns were removed or rewritten:

- `Government of Punjab gives...`
- `Punjab government profile...`
- `official Punjab profile...`
- `state government profile...`
- `Punjab at a Glance 2022...` in learner-facing wording
- `Punjab ENVIS reference...`
- other source-note phrasing such as `cited ... snapshot`

The 2022 district count remains explicitly versioned, but it is now framed as a dated administrative snapshot rather than by naming an internal source in the question.

A regression guard was added so these source/provenance phrases cannot silently return to CP001 learner text.

## 4. Factual and source audit

### Primary sources

**GOV-PUNJAB-KNOW-PUNJAB — Primary**
Used for the Punjab name/five-river identity, present-day river distinction, broad regions, area/location, borders, language/script, Chandigarh and reorganisation facts.

**GOV-PUNJAB-AT-A-GLANCE-2022 — Primary**
Used for the 50,362 sq km area and the versioned 23-district 2022 snapshot.

### Strong official secondary sources

**PSEB-AGRICULTURE-CLASS8-NURSERY — Strong official secondary**
Punjab School Education Board material directly states Shisham as Punjab's state tree.

**PSCST-ENVIS-NORTHERN-GOSHAWK-2016 — Strong official secondary**
Punjab State Council for Science & Technology material identifies Northern Goshawk as the state bird and gives the exact 18 September 2015 state-notification locator.

**GOV-INDIA-NFDB-STATE-FISHES-AQUATIC-ANIMALS — Strong official secondary**
Government of India NFDB material identifies the Indus River dolphin (`Platanista minor`) as Punjab's state aquatic animal and records the 2019 declaration.

### Weak official corroboration

**GOV-PUNJAB-MRSAFPI-QUESTION-PAPER-2024 — Weak official corroboration**
The source is an official Punjab-government examination paper and supports Blackbuck as the state animal, but an examination question is not the ideal normative source for a state-symbol declaration.

Result: the Blackbuck fact is not treated as factually doubtful, but its source authority should be upgraded when a direct Punjab notification or equivalent primary wildlife record is available. This is a source-strength improvement, not a learner-content blocker.

## 5. Coverage and distractors

Coverage is complete across:
- name and five-river identity;
- present-day Sutlej/Beas/Ravi distinction;
- area, latitude, longitude and borders;
- Majha/Doaba/Malwa;
- official language and Gurmukhi;
- Chandigarh and 1 November 1966 reorganisation;
- versioned 2022 district count;
- state animal, tree, bird and aquatic animal;
- hard synthesis combining river scope, boundaries, symbols and state identity.

Distractors remain plausible for the stated difficulty. Easy questions intentionally use broader distractors; Medium/Hard items use closer same-domain alternatives, date swaps, river-scope traps and relation mismatches.

## 6. Freeze decision

Recommended state after human review:

`CP001 — AUDIT PASSED / CONTENT FROZEN / SOURCE-UPGRADE NOTE RETAINED`

No QL expansion is required in CP001. The next audit target after approval is CP002.
