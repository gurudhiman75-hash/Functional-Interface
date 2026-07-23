# AVG-001 CP-006 Design Amendment

## Scope

This amendment locks the implementation scope for `AVG-CP-006` — Multi-Stage Hierarchical Systems.

- Branch: `feat/avg-001-cp006-advanced-average`
- Base commit: `426899f7d5d48d2bbfa660c70e282cb3e61f2a7d`
- Stable earlier QLs: `AVG-QL-001` through `AVG-QL-329`
- CP-006 range: `AVG-QL-330` through `AVG-QL-373`
- English QLs: 44
- CP-001 through CP-005 must remain unchanged.
- Hindi and Punjabi remain structurally unsupported for this implementation stage.
- All CP-006 packages remain `publiclyPublishable: false`.

## Mathematical model

Every hierarchy is resolved through totals:

`subgroup total = subgroup count × subgroup average`

`parent average = sum of child totals ÷ sum of child counts`

Questions may move forward from child groups to a parent average or work backwards to a missing child average, child count, or total.

## Solve-mode allocation

| Solve mode | QLs |
|---|---:|
| `findClassAverageFromSectionAverages` | 8 |
| `findSuperGroupAverageFromSubgroups` | 6 |
| `findMissingSectionAverage` | 7 |
| `findSectionCountFromOverallAverage` | 6 |
| `findMissingSubgroupCount` | 5 |
| `findSubgroupTotalFromHierarchy` | 4 |
| `findOverallTotalFromHierarchy` | 4 |
| `findMissingLowerLevelAverage` | 4 |
| **Total** | **44** |

## Difficulty allocation

- Easy: 14
- Medium: 15
- Hard: 15

Easy questions use two or three clean subgroups and direct totals. Medium questions introduce unequal counts, one missing value, or a reverse step. Hard questions use two hierarchy levels, larger counts, or a missing count/average that requires comparing parent and known-child totals.

## Context coverage

Use realistic exam contexts such as:

- sections → class;
- classes → school;
- branches → region;
- departments → company;
- product lines → factory;
- wards → district;
- teams → division;
- shops → market group.

The explanation must use the nouns from the question. Avoid generic wording such as `records`, `entities`, `super-group`, `hierarchical reconstruction`, `derive`, `recover`, or `reconstruct`.

## Explanation rules

Each explanation must:

1. state which group totals are needed in plain language;
2. show one or two substituted arithmetic lines;
3. use simple words such as `total`, `number`, `average`, `missing section`, and `all groups together`;
4. end with the answer and correct contextual unit;
5. avoid internal solve-mode names and formal textbook language.

## Runtime isolation

CP-006 receives its own catalogue, runtime, explanation layer, validation audits, and review export. The main pipeline may dispatch to CP-006, but existing CP runtimes and QL definitions must not be edited except where shared type/library/pipeline registration is necessary.
