# BLR-CP-003 — V6 Editorial Review Findings

Status: **review completed; V6 not approved; remediation required before human approval and final-freeze readiness**.

## Review boundary

This record audits the exact V6 learner-evidence candidate artifact generated from PR #308 head:

```text
8fd762a6cda83b6242d02bd3b342bcea7e9a8f16
```

Reviewed artifact:

```text
blr-001-cp003-learner-evidence-v6-candidate
artifact ID: 8769386941
candidate records: 20
provisional authorities: 5
records per authority: 4
```

This is an editorial and product-quality audit. It is **not** a human approval record and does not authorize permanent QLs, Question Studio visibility, publication or merge.

## Overall disposition

```text
APPROVE AS WRITTEN        8
REVISE                   12
REJECT                     0
HOLD                       0
TOTAL                     20
```

Authority-level disposition:

| Provisional authority | Records | Disposition | Reason |
|---|---:|---|---|
| `DETERMINE_MEMBER_GENDER` | 4 | **REVISE — severe** | The stem asks for the gender of a “paternal uncle”. The word *uncle* already encodes male gender, so the passage and relation path are unnecessary to answer the question. |
| `SELECT_UNORDERED_FAMILY_PAIR` | 4 | **REVISE — wording** | Logic, answer and distractors are correct, but “unordered pair” is internal/mathematical terminology and is not natural SSC/banking blood-relations wording. |
| `IDENTIFY_ALL_MEMBERS_BY_RELATION` | 4 | **REVISE — visual proof** | Each answer contains two people and two evidence paths, but the SVG is built from only `evidencePaths[0]`; only the aunt path is highlighted, so the visual proof is incomplete. |
| `DETERMINE_MEMBER_MARITAL_STATUS` | 4 | **APPROVE** | The target must be derived through two family links and the status is explicitly stated; options are unique and the explanation is logically complete. |
| `IDENTIFY_MEMBER_BY_MARITAL_STATUS` | 4 | **APPROVE** | The answer must satisfy both the derived kinship relation and the explicit status condition; distractors represent distinct family-role errors. |

## Mandatory remediation 1 — remove the gender tautology

Affected records:

```text
BLR-CP003-SCN-EXPLICIT-UNMARRIED-BRANCH-S0-V6-RELATION-QUALIFIED-GENDER
BLR-CP003-SCN-EXPLICIT-UNMARRIED-BRANCH-S1-V6-RELATION-QUALIFIED-GENDER
BLR-CP003-SCN-EXPLICIT-UNMARRIED-BRANCH-S2-V6-RELATION-QUALIFIED-GENDER
BLR-CP003-SCN-EXPLICIT-UNMARRIED-BRANCH-S3-V6-RELATION-QUALIFIED-GENDER
```

Current pattern:

```text
What is the gender of <reference>'s paternal uncle?
```

Why it fails:

- “uncle” is already a male relation label;
- the answer can be obtained without reading the passage;
- graph distance `2` does not rescue a stem whose wording discloses the answer;
- the candidate therefore does not provide valid learner-facing evidence for `DETERMINE_MEMBER_GENDER`.

Required replacement pattern:

```text
What is the gender of <reference>'s father's sibling who is explicitly stated to be unmarried?
```

The replacement must:

- identify the target through a gender-neutral relation (`sibling`);
- use the explicit unmarried fact to select the correct sibling;
- use a separate clue such as `son` or `daughter` to establish gender;
- update the core concept, steps, option analysis, conclusion, shortcut and traps;
- add a regression that rejects gender questions whose target relation itself encodes gender.

## Mandatory remediation 2 — remove learner-facing internal jargon

Affected records:

```text
BLR-CP003-SCN-TWO-COUPLE-COUSIN-BRANCH-S0-V6-DERIVED-COUSIN-PAIR
BLR-CP003-SCN-TWO-COUPLE-COUSIN-BRANCH-S1-V6-DERIVED-COUSIN-PAIR
BLR-CP003-SCN-TWO-COUPLE-COUSIN-BRANCH-S2-V6-DERIVED-COUSIN-PAIR
BLR-CP003-SCN-TWO-COUPLE-COUSIN-BRANCH-S3-V6-DERIVED-COUSIN-PAIR
```

Current pattern:

```text
Which of the following unordered pairs consists of cousins?
```

Required learner-facing wording:

```text
Which of the following pairs consists of cousins?
```

`UNORDERED_PERSON_PAIR` may remain an internal answer contract. The word `unordered` should not appear in the learner stem, explanation or shortcut.

## Mandatory remediation 3 — prove every member in a set answer

Affected records:

```text
BLR-CP003-SCN-EXPLICIT-UNMARRIED-BRANCH-S0-V6-DERIVED-PATERNAL-UNCLE-AUNT-SET
BLR-CP003-SCN-EXPLICIT-UNMARRIED-BRANCH-S1-V6-DERIVED-PATERNAL-UNCLE-AUNT-SET
BLR-CP003-SCN-EXPLICIT-UNMARRIED-BRANCH-S2-V6-DERIVED-PATERNAL-UNCLE-AUNT-SET
BLR-CP003-SCN-EXPLICIT-UNMARRIED-BRANCH-S3-V6-DERIVED-PATERNAL-UNCLE-AUNT-SET
```

Current implementation in `buildCandidate` selects only:

```ts
const primaryPath = input.evidencePaths[0];
```

The set records contain both:

```text
AUNT:  D -> C -> G
UNCLE: E -> C -> G
```

but the diagram highlights only the first path. Required remediation:

- highlight both answer paths in the same SVG, or render two clearly labelled supporting paths;
- ensure both correct answer nodes are highlighted;
- make the accessible summary mention both paths;
- add a regression proving that every consecutive edge in every `evidencePath` appears in the highlighted visual evidence.

## Approved records

The following eight records are acceptable as currently written:

```text
BLR-CP003-SCN-EXPLICIT-UNMARRIED-BRANCH-S0-V6-RELATION-QUALIFIED-MARITAL-STATUS
BLR-CP003-SCN-EXPLICIT-UNMARRIED-BRANCH-S0-V6-IDENTIFY-UNMARRIED-PATERNAL-UNCLE
BLR-CP003-SCN-EXPLICIT-UNMARRIED-BRANCH-S1-V6-RELATION-QUALIFIED-MARITAL-STATUS
BLR-CP003-SCN-EXPLICIT-UNMARRIED-BRANCH-S1-V6-IDENTIFY-UNMARRIED-PATERNAL-UNCLE
BLR-CP003-SCN-EXPLICIT-UNMARRIED-BRANCH-S2-V6-RELATION-QUALIFIED-MARITAL-STATUS
BLR-CP003-SCN-EXPLICIT-UNMARRIED-BRANCH-S2-V6-IDENTIFY-UNMARRIED-PATERNAL-UNCLE
BLR-CP003-SCN-EXPLICIT-UNMARRIED-BRANCH-S3-V6-RELATION-QUALIFIED-MARITAL-STATUS
BLR-CP003-SCN-EXPLICIT-UNMARRIED-BRANCH-S3-V6-IDENTIFY-UNMARRIED-PATERNAL-UNCLE
```

Their approval here means only that no remediation issue was found in this audit. They remain review-only candidates and inherit the chapter’s release locks.

## Non-blocking publication polish

Before eventual learner publication, vary repeated explanation phrasing across seeds and reconsider the distractor text `The passage is contradictory`, which is logically distinct but less typical of SSC/banking exam language. This is not the present discovery blocker.

## Release boundary after this review

```text
V6 human approval                         false
final discovery freeze                    blocked
permanent CP-003 QLs                      0
next available chapter identity           BLR-QL-009
Question Studio                           disabled
Question Bank                             disabled
mock tests                                disabled
Hindi/Punjabi                             not started
public publication                        disabled
merge                                     not authorised
```

## Exact next checkpoint

```text
implement the 12-record V6 remediation
  -> regenerate the 20-record candidate artifact
  -> run exact-head runtime and freeze-readiness workflows
  -> obtain explicit human approval of the corrected pack
  -> rerun final-freeze readiness with all retained authorities supported
  -> allocate permanent QLs only after the final discovery freeze
```
