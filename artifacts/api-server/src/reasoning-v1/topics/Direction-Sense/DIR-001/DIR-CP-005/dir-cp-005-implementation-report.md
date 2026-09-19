# DIR-CP-005 Implementation Report

Status: English runtime implemented on a feature branch; manual editorial review pending.

## Ownership

`DIR-CP-005` owns questions in which two or more independent movement paths must be solved and their final endpoints compared. Same-origin and different-origin starts are runtime variations rather than separate QLs. Speed, time and relative-speed arithmetic are excluded.

## Need-based QLs

| QL | Answer demand | Material distinction |
|---|---|---|
| `DIR-QL-016` | direction between two final endpoints | two independent paths and reference reversal |
| `DIR-QL-017` | shortest separation distance | endpoint distance rather than travelled distance |
| `DIR-QL-018` | direction plus shortest separation | combined qualitative and numeric answer |
| `DIR-QL-019` | mover at a stated endpoint relation | entity-valued inverse lookup among four movers |
| `DIR-QL-020` | directional endpoint extremum | northmost/southmost/eastmost/westmost comparison |
| `DIR-QL-021` | nearest or farthest from a reference point | exact endpoint-distance ranking |
| `DIR-QL-022` | final coincidence pair | independently generated paths converge to one endpoint |

## Runtime and explanation

Each mover has an explicit start, ordered cardinal path, point trace and endpoint. A separate independent solver replays every path. Explanations track each mover separately, state final positions from a common reference, compare endpoints, show an explicit Pythagorean expansion when needed, conclude directly, and place the diagram last.

## Proof

The checkpoint proof generates `120` seeds per QL (`840` cases total) and checks deterministic replay, independent endpoint agreement, option uniqueness, both origin topologies, all-eight-direction coverage, exact integer separation, expanded squared-component calculations, unique entity/extremum/ranking/coincidence answers, diagram contracts, stem diversity and answer-position balance.
