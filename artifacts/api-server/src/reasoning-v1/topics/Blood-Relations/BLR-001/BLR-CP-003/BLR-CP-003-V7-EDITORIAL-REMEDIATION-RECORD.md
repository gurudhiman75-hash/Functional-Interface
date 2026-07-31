# BLR-CP-003 — V7 Editorial Remediation Record

Status: **the 12 V6 review findings are implemented in a separate corrected candidate layer; human approval remains pending**.

## Traceability boundary

The reviewed V6 source pack is preserved unchanged. V7 imports that deterministic 20-record pack and applies only the accepted remediation identified in `BLR-CP-003-V6-EDITORIAL-REVIEW-FINDINGS.md`.

```text
source candidate layer              V6
corrected candidate layer           V7
candidate records                   20
provisional authorities              5
records per authority                4
permanent CP-003 QLs                 0
next available chapter identity     BLR-QL-009
```

V7 remains prototype-only, review-only and inaccessible to Question Studio, Question Bank, mock tests and public publication.

## Implemented remediation

### 1. Gender tautology removed — 4 records

The failed V6 pattern disclosed the answer through the word `uncle`.

The corrected learner stem is:

```text
What is the gender of <reference>'s father's sibling who is explicitly stated to be unmarried?
```

The corrected reasoning contract is:

1. identify the reference member's father;
2. select that father's sibling using the explicit unmarried fact;
3. use a separate `son` clue to determine gender;
4. never infer gender from the target's name.

A runtime regression rejects a gender stem ending in a gender-encoding target relation such as uncle, aunt, brother, sister, son, daughter, husband, wife, father or mother.

### 2. Learner-facing internal jargon removed — 4 records

The internal answer type remains:

```text
UNORDERED_PERSON_PAIR
```

The learner stem is now:

```text
Which of the following pairs consists of cousins?
```

A runtime regression scans the complete learner-facing editorial surface and rejects the word `unordered`.

### 3. Complete set-answer visual evidence — 4 records

Each set record contains two evidence paths:

```text
AUNT:  D -> C -> G
UNCLE: E -> C -> G
```

V7 converts them into one connected visual evidence walk whose highlighted edge set covers every consecutive edge of both source paths. Both correct answer nodes are highlighted, and the accessible summary names both answer paths separately.

A runtime regression proves, for every record:

- every person in every evidence path appears in the highlighted visual evidence;
- every consecutive edge in every evidence path appears in the highlighted visual edge set;
- multi-member set answers retain all supporting paths.

## Preserved approved content

The eight V6 records previously accepted as written are copied into the V7 candidate pack without learner-facing semantic changes:

```text
DETERMINE_MEMBER_MARITAL_STATUS       4
IDENTIFY_MEMBER_BY_MARITAL_STATUS     4
```

They receive only the V7 item identity, remediation metadata and regenerated semantic fingerprint required for candidate-pack traceability.

## New executable authorities

```text
cp003-learner-evidence-v7-candidate.ts
cp003-learner-evidence-v7-candidate.test.ts
export-cp003-learner-evidence-v7-candidate.ts
```

The exporter produces:

```text
blr-cp003-v7-candidates.jsonl
blr-cp003-v7-candidates.csv
blr-cp003-v7-candidates.html
blr-cp003-v7-candidates.md
blr-cp003-v7-summary.json
```

## Approval and release boundary

```text
V7 machine remediation proof          required
V7 human review                       required
V7 human approval                     false
final discovery freeze                blocked
permanent CP-003 QLs                  0
Question Studio                       disabled
Question Bank                         disabled
mock tests                            disabled
Hindi/Punjabi                         not started
public publication                    disabled
merge                                 not authorised
```

## Exact next checkpoint

```text
run the V7 remediation workflow at the exact branch head
  -> inspect the generated V7 review artifact
  -> conduct explicit human review of all 20 corrected records
  -> create an approval or further-remediation disposition
  -> rerun final-freeze readiness
  -> freeze discovery only when every retained authority is learner-supported and approved
```
