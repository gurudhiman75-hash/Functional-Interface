# TMW-CP-012 — Coverage Closure & Banking Presentation

Status: **extension checkpoint; does not renumber or mutate TMW-QL-001…211**

## Why CP-012 exists

The post-R3 independent audit found that TMW-001 is mathematically broad but not fully exhaustive against the chapter blueprint and exam references. The existing 211 QLs remain frozen. CP-012 therefore owns only materially missing contracts and later presentation-layer banking formats.

## Identity rule

A CP-012 QL is admitted only when at least one of these changes materially:

1. the mathematical unknown/solve direction;
2. the information-sufficiency decision contract;
3. the presentation contract (table/caselet) in a way that changes the reasoning burden.

Superficial changes in agent count, names, numbers, or wording do not earn a new QL.

## Stage A — mathematical coverage closure

### TMW-QL-212 — `findExcludedAgentTimeFromAllTogetherAndSubgroup`

Canonical exam contract:

> A, B and C together complete a work in `T_all` days. A and B together complete the same work in `T_subgroup` days. Find the time taken by C alone.

Authority:

`r_C = 1/T_all - 1/T_subgroup`, then `T_C = 1/r_C`.

Why this is new: CP-002 contains the reverse direction (all-together + third agent → subgroup time) but does not cleanly own all-together + subgroup → excluded individual.

### TMW-QL-213 — `findNewTeamTimeAfterMemberEfficiencyChange`

Canonical exam contract:

> A:B efficiency ratio and original team completion time are known. One member becomes `p%` more or less efficient from the start. Find the new team completion time.

Authority:

Use ratio-units for original team rate, construct total work from the original completion time, change only the named member's rate, then divide total work by the new team rate.

Why this is new: CP-003 has rich individual efficiency/time relations and CP-004 has mid-project changes, but the from-start **team recomputation** direction is underrepresented.

### TMW-QL-214 — `findTeamTimeSavedOrDelayedAfterMemberEfficiencyChange`

Same rate reconstruction as QL-213, but the requested answer is the schedule impact:

`|T_old - T_new|`, semantically labelled as **time saved** for an efficiency increase or **delay** for an efficiency decrease.

This is a distinct answer contract and common exam ask.

## Stage B — Banking data sufficiency (planned after Stage A proof)

Reserve a controlled, small DS layer rather than duplicating every ordinary QL. Candidate ownership:

- combined work/rate sufficiency;
- efficiency-relation sufficiency;
- workers × days × hours equivalence sufficiency;
- staged participation sufficiency;
- pipe/leak sufficiency;
- contribution/wages sufficiency.

DS identities will be admitted only where Statement I/II independence and combination logic are actually generated and verified.

## Stage C — table/caselet presentation (planned after DS proof)

Use existing mathematical authorities wherever possible:

- crew schedule table;
- pipe operating schedule table;
- daily productivity table;
- compact shared caselet only if Question Studio can preserve shared stimulus identity without answer leakage.

Presentation diversity must not create fake mathematical QLs.

## Publication rule

CP-012 remains `publiclyPublishable: false` until:

- deterministic multi-seed proof passes;
- four options are unique and answer-aligned;
- English/Hindi/Punjabi stems and learner explanations pass the learner V2 contract;
- no existing QL001–211 regression is broken;
- final chapter audit explicitly changes the chapter verdict to GO.
