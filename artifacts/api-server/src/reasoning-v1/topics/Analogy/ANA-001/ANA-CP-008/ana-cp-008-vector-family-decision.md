# ANA-CP-008 Independent Cluster-Vector Decision

Status: **SOURCE-BACKED NON-QL PILOT AUTHORITY**

## Evidence

A recurring official-paper pattern transforms a two-letter cluster and a signed whole number through three fixed changes:

```text
output first letter  = input first letter shifted by a fixed amount
output second letter = input second letter shifted by a fixed amount
output number        = input whole number plus a fixed signed delta
```

Readable profiles recovered from PGCIL, SSC, RRB and OSSSC material include:

| Evidence | First letter | Second letter | Number |
|---|---:|---:|---:|
| `KH12 → NF-5`, `NU13 → QS-4` | `+3` | `-2` | `-17` |
| `TG13 → RC-2`, `GP19 → EL4` | `-2` | `-4` | `-15` |
| `SS14 → WP-4`, `CE10 → GB-8` | `+4` | `-3` | `-18` |
| `GN14 → ER1`, `HP18 → FT5` | `-2` | `+4` | `-13` |
| `NW-19 → PZ-10`, `RD-12 → TG-3` | `+2` | `+3` | `+9` |
| `CJ16 → DF9`, `FK9 → GG2` | `+1` | `-4` | `-7` |
| `ID19 → DB2`, `JO13 → EM-4` | `-5` | `-2` | `-17` |
| `VF19 → YB-2`, `TX11 → WT-10` | `+3` | `-4` | `-21` |
| `AI10 → YG12`, `BJ20 → ZH22` | `-2` | `-2` | `+2` |

## Ownership

Decision:

```text
Admit provisional authority:
MIXED_CLUSTER_NUMBER_INDEPENDENT_VECTOR
```

This authority is distinct from:

- `MIXED_CLUSTER_NUMBER_SHARED_DELTA`, where the same signed amount is applied to every letter and the number;
- pure CP-006 cluster transforms, which contain no number component;
- numeric analogy, which ignores the letters;
- CP-009 progressive vectors, where the vector itself changes across evidence-pair index.

## Pilot domain

- token shape: `CLUSTER_NUMBER`;
- exactly two letters for the first admitted profile;
- signed whole numbers supported, including zero;
- one fixed nonzero shift for each letter position;
- one fixed nonzero signed number delta;
- alphabet shifts bounded to magnitude `1..12`;
- number delta bounded to magnitude `1..100`;
- complete evidence must uniquely identify the exact three-part context;
- only source-backed profiles are registered in the pilot.

## Signed-number foundation

Official questions contain inputs and outputs such as:

```text
NF-5
WP-4
NW-19
PZ-10
```

Therefore mixed-token numeric components now allow canonical signed integers from `-9999` through `9999`.

Leading-zero forms remain invalid:

```text
NF-05
-019A
```

## Ambiguity requirements

Reject a generated pair when:

- the two letter shifts and number delta equal one shared delta and collide with the shared-delta authority;
- another registered vector profile explains all complete evidence;
- the number alone determines the option while the letters are decorative;
- the letters alone determine the option while the number is decorative;
- a distractor forms any registered mixed rule;
- more than one option satisfies all three transformations.

## Pilot impact

```text
Provisional authorities: 6
Provisional contexts: 69
Readable source fixtures: 11
Permanent QLs: none
Permanent solve modes: none
```

The inherited 16-QL reservation remains unchanged and unfrozen.
