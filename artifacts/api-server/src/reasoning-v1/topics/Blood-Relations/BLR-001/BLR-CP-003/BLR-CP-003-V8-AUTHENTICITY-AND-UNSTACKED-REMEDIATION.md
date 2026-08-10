# BLR-CP-003 — V8 Authenticity, Unstacked Passage and Full-Bank Remediation

Status: **implemented full-bank candidate; machine validation pending; human review not approved; no permanent QL allocation**.

## Audit trigger

The V7 senior editorial and technical audit scored the remediated package **7.8 / 10** and identified five material concerns:

1. synthetic stems created to preserve weak binary label authorities;
2. obvious filler distractors in gender-label and marital-status-label questions;
3. repeated `Don't fall for Option X` teacher voice;
4. only 20 questions across 8 passage groups;
5. fixed 720-pixel SVG minimum width in the review HTML.

A second critical finding identified stacked clue order and flat sentence-by-sentence explanations as the primary source of artificiality.

## Structural authority correction

V8 does not cosmetically preserve two weak solve contracts.

| Source authority | V8 decision | Target |
|---|---|---|
| `DETERMINE_MEMBER_GENDER` | merge existing | `BLR-QL-003 / IDENTIFY_PERSON_BY_GENDER` |
| `DETERMINE_MEMBER_MARITAL_STATUS` | merge provisional | `IDENTIFY_MEMBER_BY_MARITAL_STATUS` |
| `SELECT_UNORDERED_FAMILY_PAIR` | retain provisional | unchanged |
| `IDENTIFY_ALL_MEMBERS_BY_RELATION` | retain provisional | unchanged |
| `IDENTIFY_MEMBER_BY_MARITAL_STATUS` | retain provisional | unchanged |
| `IDENTIFY_PERSON_BY_EXACT_LINEAGE` | preserve V5 approval | unchanged |

Reason: binary gender or marital-status labels cannot produce four natural SSC/banking options. Authentic versions use person names, person pairs or complete person sets.

## V8 full-bank candidate inventory

```text
deterministic seeds                         26
candidate records                          130
passage groups                              52
retained candidate authorities               3
pair-selection records                      52
complete-set records                        52
marital-status person records               26
gender-label records                         0
marital-status-label records                 0
permanent CP-003 QLs                         0
human review approved                    false
```

This satisfies the requested 100+ question and 30+ passage-group review telemetry. It does **not** by itself prove exhaustive solve-mode closure or authorize permanent identities.

## Passage remediation

Every V8 passage:

- begins from a younger-generation or in-law fragment rather than the top-generation couple;
- contains at least two indirect anchors such as daughter-in-law, son-in-law, mother/father of a younger member or spouse-of-child;
- changes generation level multiple times;
- is emitted in disjoint, non-topological order;
- is explicitly marked `stackedLinearChain: false`;
- avoids the V6/V7 direct edge-listing introduction.

## Question and distractor remediation

V8 uses only:

- named-person answers;
- named-person pairs;
- complete named-person sets.

Removed from the V8 learner bank:

```text
The passage is contradictory
Cannot be determined
Divorced
binary filler labels
learner-facing "unordered" terminology
```

Pair distractors now represent genuine relation errors:

- spouse pair;
- sibling pair;
- parent-child pair;
- cousin pair.

Set distractors now represent:

- omission of one valid member;
- inclusion of an extra invalid member;
- wrong branch selection.

## Explanation remediation

Each explanation contains four explicit phase cards:

1. `Phase 1 — Map generation levels`
2. `Phase 2 — Connect family branches`
3. `Phase 3 — Trace the required relation`
4. `Phase 4 — Verify the options`

The option analysis rotates natural teacher voice across multiple patterns. The repeated `Don't fall for Option X` prefix is prohibited by regression.

## Responsive review renderer

The V8 HTML renderer removes the fixed 720-pixel minimum width:

```css
.svg-family-tree svg {
  width: 100%;
  max-width: 100%;
  min-width: 0;
  height: auto;
}
```

A mobile breakpoint collapses phase cards to one column and reduces diagram padding. The SVG remains viewBox-driven and no longer forces horizontal scrolling inside the review card.

## Release boundary

```text
human review                               pending
exhaustive solve-mode freeze               not proven
final discovery freeze                     blocked
permanent CP-003 QLs                       0
next available chapter identity            BLR-QL-009
Question Studio                            disabled
Question Bank                              disabled
mock tests                                 disabled
Hindi/Punjabi                              not started
public publication                         disabled
merge                                      not authorised
```

## Next gate

```text
run exact-head V8 workflow
  -> inspect generated 130-question artifact
  -> human editorial review
  -> remediate any remaining clusters
  -> authority and solve-mode closure audit
  -> final discovery freeze only after closure
  -> permanent QL allocation only after freeze
```
