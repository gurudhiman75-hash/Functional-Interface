# BLR-CP-003 — Human Editorial Remediation V3

Status: **user-reported editorial defects remediated; V3 human-review candidate generated; no freeze or permanent allocation**.

## Reported defects

The V2 passage review exposed two material learner-experience defects:

1. generation rows and raw text facts did not provide an instantly readable family-tree diagram;
2. explanations still used graph-engine language instead of a simple teacher voice.

The requested production standard required:

- a visual family tree on every passage item;
- `(+)=Male` and `(-)=Female` markers where gender is stated;
- `========` for married couples;
- `│` for parent-child lineage;
- `──` for siblings;
- four learner-facing explanation tiers;
- option-by-option guidance;
- explicit subject-to-reference direction verification;
- no raw semantic keys or internal error labels.

## V3 remediation architecture

### Visual tree renderer

`cp003-visual-tree-renderer.ts` now creates a deterministic diagram from the solved family graph.

Every diagram contains:

```text
===================================================================
                       VISUAL FAMILY TREE GRID
===================================================================
Generation +1 (oldest displayed):
  [Name] (+) ======== [Name] (-)

Generation 0:
  [Name] (-) ── [Name] (+)

Parent–child lineage:
  [Parent] (+)
                         │
                         └── [Child] (-)
===================================================================
Key: (+) = Male  |  (-) = Female  |  ======== = Married couple
     │ = Parent–child lineage  |  ── = Siblings
===================================================================
```

The renderer does not infer marriage from shared parenthood and does not infer co-parenthood from marriage. It displays only modelled edges.

### Evidence-safe gender display

A hidden graph may contain a gender required for internal validation even when the displayed passage does not state that gender. V3 never exposes that hidden fact as learner evidence.

Rule:

```text
entailed male gender       -> (+)
entailed female gender     -> (-)
gender not stated          -> no marker
```

An affected diagram adds:

```text
Unmarked name = Gender not stated in the passage
```

This preserves exact-lineage inference requirements without teaching a guessed gender.

### Four-tier teacher explanation

`cp003-teacher-editorial.ts` and `cp003-teacher-editorial-finalizer.ts` produce:

1. `📌 Core Concept` — two short teaching rules;
2. `📝 Step-by-Step Solution & Family Tree` — family summary, visual tree, reasoning and option checks;
3. `💡 10-Second Exam Speed Shortcut` — task-specific exam method;
4. `⚠️ Common Traps & Mistakes` — named-option warning and direction warning where relevant.

### Option-by-option teaching

Every item now explains all four options. Pair options are described through actual family relationships, member-set options identify omissions or additions, claim options compare the stated and actual relations, and relation options state the correct direction in natural language.

Learner-facing V3 records deliberately omit:

- semantic keys such as `PAIR:A::B`;
- raw labels such as `NON_SPOUSE_PAIR`;
- internal graph vocabulary;
- hidden answer metadata.

Reviewer references such as item IDs remain available outside the student explanation.

### Direction contract

For every stem of the form:

```text
How is X related to Y?
```

V3 enforces the conclusion:

```text
X is the [relation] of Y.
```

The common-trap tier also warns against answering the reverse relation.

## Manual inspection findings and remediation

The first generated V3 artifact passed structural checks but manual reading found additional issues. They were corrected rather than accepted as technically valid output.

| Finding | Remediation |
|---|---|
| lower-cased name in a final step | conclusions are reused without lower-casing the first character |
| `X is same generation Y` | rewritten as `X and Y are in the same generation` |
| `joined by a spouse clue` | rewritten as `directly stated to be married` |
| `the relation wording directly fixes` | rewritten as conversational passage guidance |
| reference person described as a relation `of itself` | rewritten as `the reference person, not the person being identified` |
| unstated gender shown as `(?)` | marker removed and evidence-safe key added only where needed |

Permanent regression checks now reject:

```text
PAIR:
::
NON_
supported family path
shortest supported path
Trace the relation
reconstructed family graph
subject-to-reference
modelled parent
spouse clue
 is same generation 
 of itself.
(?)
```

## V3 review inventory

```text
Passage sets                         32
Learner-facing records             208
Scenarios/topologies                 8
Temporary item handles              18
Answer positions       [57, 53, 49, 49]
Visual diagrams                     208
Four-tier explanations              208
Four-option analyses                208
Permanent CP-003 QLs                  0
```

Export formats:

- HTML;
- Markdown;
- CSV;
- JSONL;
- summary JSON.

## Validation evidence

Remediation implementation head:

```text
081f6ef49841269951d1ce180f8bbdc1c65f2983
```

Successful workflows:

```text
Reasoning BLR-001 CP-003 Runtime   30421978680
Reasoning BLR-001 CP-001 Runtime   30421978743
Reasoning BLR-001 CP-002 Runtime   30421978720
Validate Render production build  30421978726
Validate integrated admin panel   30421978709
```

Exact remediation artifact:

```text
name:     blr-001-cp003-teacher-review-v3
ID:       8712245335
digest:   sha256:2bc6d20d377afae3a05da4d5b12ba08344bf2154879727f68188b885aa6efd8a
head:     081f6ef49841269951d1ce180f8bbdc1c65f2983
```

Manual artifact inspection confirmed:

- 208 JSONL records;
- 208 visual-tree headers;
- 208 core-concept blocks;
- 208 option-analysis blocks;
- 832 HTML tier headings;
- zero occurrences of the rejected engine or awkward-language patterns.

## Decision

The reported V2 defects are remediated in V3. V3 replaces V2 as the active English human-review candidate.

This record is not a human approval or a discovery freeze. The mandatory sequence remains:

```text
human review of V3
  -> accepted follow-up remediation, if any
  -> deterministic rerun
  -> post-human source-gap confirmation
  -> final discovery freeze
  -> sequential QL allocation
```

## Release boundary

- `BLR-QL-009`: unclaimed;
- permanent CP-003 QLs: `0`;
- Question Studio visibility: disabled;
- Question Bank eligibility: disabled;
- mock-test eligibility: disabled;
- Hindi and Punjabi: not started;
- public publication: disabled;
- draft PR remains unmerged.
