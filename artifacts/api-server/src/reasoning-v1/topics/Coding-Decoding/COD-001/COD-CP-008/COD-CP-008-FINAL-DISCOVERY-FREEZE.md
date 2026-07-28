# COD-CP-008 — Final English Discovery Freeze

Status: **English discovery frozen under `COD_CP008_ENGLISH_DISCOVERY_FREEZE_V1`; zero permanent QLs**.

## Final solve inventory

Exactly two materially distinct solve contracts survive:

| Prototype contract | Student operation |
|---|---|
| `DIRECT_RENAMED_LABEL` | The real referent is stated directly; return the label assigned to it. |
| `SEMANTIC_REFERENT_THEN_RENAME` | Resolve one curated ordinary fact, role, property, category or use; then return the label assigned to that referent. |

The second contract is not merely a harder stem. It adds a semantic-resolution stage whose correctness must be independently curated and verified before the renaming lookup.

## Merge decisions

The following do not create additional QLs:

- open chain versus cycle;
- four, five, six or more displayed renaming statements;
- colour, profession, object, body-part, food, animal and time-unit contexts;
- direct question versus option-selection wording;
- mapping order and renderer variation.

Following a chain more than once is an exam distractor. A statement such as `doctor is called manager` means that the real doctor is answered as manager; it does not instruct the student to continue renaming manager.

## Source-gap and ownership closure

- Character or token substitution remains owned by CP-001.
- Sentence/artificial-language deduction remains owned by CP-009.
- Conditional tables and precedence remain owned by CP-010.
- No recurring materially distinct inverse-original-referent task was found; it is excluded from this freeze.
- Unstable, disputed and multi-answer semantic facts are rejected from the dataset.

## Executable evidence

The prototype corpus contains:

```text
Prototype contracts:          2
Seeds per contract:         200
Generated questions:        400
Curated semantic facts:      15
Semantic categories:          4
Topologies:                    2
Renderers:                     3
Permanent QLs:                 0
```

The audit proves deterministic reproduction, one-step renaming, injective maps without identity edges, independent solver agreement, four unique options, all answer positions, Easy/Medium/Hard reach, open-chain/cycle coverage and misconception-labelled distractors.

## Guarded allocation after this freeze merges

```text
COD-QL-173 — DIRECT_RENAMED_LABEL
COD-QL-174 — SEMANTIC_REFERENT_THEN_RENAME
```

Those identities are an allocation plan, not permanent QLs in this discovery PR.

## Safety boundary

- English prototypes only;
- Hindi and Punjabi deferred until English ownership is stable;
- Question Studio disabled;
- Question Bank and mock-test eligibility disabled;
- public publication disabled.
