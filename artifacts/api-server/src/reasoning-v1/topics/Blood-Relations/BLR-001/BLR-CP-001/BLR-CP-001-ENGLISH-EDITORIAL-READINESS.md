# BLR-CP-001 — English Editorial Readiness

Status: **machine editorial gate passed; review pack generated; human approval pending; no discovery freeze**.

## Automated editorial corpus

The dedicated editorial test generates:

```text
11 exploratory prototypes × 40 seeds = 440 questions
```

It enforces:

- deterministic repeat equality;
- all seven provisional solve authorities;
- all eleven exploratory prototype IDs;
- six learner answer shapes;
- exact answer-position distribution `[110, 110, 110, 110]`;
- Easy, Medium and Hard reach;
- both structured-text and family-tree-explanation renderers;
- four unique options and exactly one correct option;
- an error label for every wrong option;
- no unresolved values or internal runtime identifiers in learner text;
- complete normalised clues, query path, conclusion and trap rejection;
- substantial teaching detail and broad stem diversity.

Seven authorities and six answer shapes are intentional: `IDENTIFY_PERSON_BY_RELATION` and `IDENTIFY_PERSON_BY_GENDER` use different solve predicates but both return `PERSON_NAME`.

## Hosted review pack

The workflow exports eight deterministic seeds per prototype:

```text
11 prototypes × 8 seeds = 88 review records
```

Files:

- `blr-cp001-review.html` — human-readable cards;
- `blr-cp001-review.csv` — flat review sheet;
- `blr-cp001-review.jsonl` — complete structured records;
- `blr-cp001-review-summary.json` — inventory and balance proof.

Pack summary:

```text
permanent QLs:                 0
exploratory prototypes:       11
provisional authorities:       7
review records:               88
answer positions:       22/22/22/22
```

Each review record includes the full stem, options, error labels, correct answer, normalised clues, rule statement, query trace, conclusion, trap rejection, structured query, person-name map and runtime metadata.

## Manual spot-check observations

A representative question from every provisional authority was inspected after export.

Strengths observed:

- direct relation wording is clear and direction-specific;
- ordered-pair questions make pair order explicit;
- generation explanations count parent-child level changes rather than path names;
- gender questions rely on displayed relation evidence, not name stereotypes;
- exact-lineage explanations explicitly identify the connecting parent and then derive the paternal or maternal side;
- brother-in-law and sister-in-law appear naturally in the relation-label review sample;
- no duplicate stems occurred in the 88-record pack.

Editorial item for human review:

- relation-claim distractors are mathematically valid and misconception-labelled, but some intentionally false statements are easier than the closest competitive-exam distractors. Human review should decide whether the claim option builder needs an additional plausibility tier before freeze.

This observation is not a mathematical blocker and is not concealed by the automated gate. It remains an editorial freeze blocker until reviewed.

## Current decision

The checkpoint is ready for structured English review, but it is **not English-approved** and is **not frozen**.

Next required sequence:

```text
review the 88-record pack
  -> tighten wording or distractors where required
  -> rerun the complete gate
  -> perform second source/gap audit
  -> freeze only if no material contract or editorial defect remains
```

Question Studio visibility, localisation, permanent QL allocation and public publication remain disabled.
