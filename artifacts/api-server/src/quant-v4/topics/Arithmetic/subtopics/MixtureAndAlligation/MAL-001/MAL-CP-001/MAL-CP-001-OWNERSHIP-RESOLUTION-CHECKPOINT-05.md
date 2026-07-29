# MAL-CP-001 Ownership Resolution and Source-Recovery Checkpoint 05

Status: **OWNERSHIP RESOLVED / THREE SOURCE GAPS REMAIN / NO QL FREEZE**

Date: `2026-07-28`

## 1. Scope entering this checkpoint

```text
approved candidate contracts: 6
approved executable prototypes: 12
provisional solve modes: 7
provisional QL-template families: 11
English expansion-review rows: 48
permanent MAL-QL IDs: 0
```

The mathematical scope is product-approved. The QL-template count, solve-mode count and individual English rows are not approved or frozen.

## 2. Source recovery

### XAT 2015 nested-component dilution

Recovered source state:

1. Product M combines chemicals X and Y in ratio `5:4`.
2. X contains raw materials A:B in ratio `1:3`.
3. Y contains raw materials B:C in ratio `2:1`.
4. `864` units of Product M are mixed with water.
5. Raw material B must form `50%` of the final mixture.
6. The requested answer is water added.

The worked solution reconstructs:

```text
B from X: 360 units
B from Y: 256 units
total B: 616 units
final total mixture: 1232 units
water added: 368 units
```

Ownership verdict:

```text
MAL-CP-004 — conserved-solute transformation
```

The final total is an intermediate, not the requested learner output. This source therefore does not admit a CP-001 final-total QL template.

### Existing three-variety source

The recovered R.S. Aggarwal three-variety tea example remains:

```text
MAL-CP-002 — addition-driven ratio adjustment
```

It does not support the deferred CP-001 coupled weighted-mean topology.

## 3. Concentration ownership decision

```text
Static complete weighted blend of known concentration sources
→ MAL-CP-001

Named component conserved or reconstructed through dilution,
strengthening, evaporation, wet/dry conversion or another before/after change
→ MAL-CP-004
```

Consequences:

- concentration is a value-unit/context parameter inside existing CP-001 templates when the state is static;
- no concentration-only CP-001 QL is created;
- nested component tracking and solvent addition remain CP-004;
- duplicate CP-001/CP-004 QLs are prohibited.

## 4. Vessel ownership decision

```text
One direct combination; no intermediate vessel state survives
→ MAL-CP-001

Transfer, return, equalisation or chained movement requiring
current composition in each vessel at one or more intermediate stages
→ MAL-CP-006
```

Consequences:

- direct vessel combination is a scenario parameter inside existing CP-001 templates;
- a vessel noun alone cannot create a CP-006 contract;
- CP-006 is reserved for explicit stage-by-stage vessel bookkeeping;
- duplicate CP-001/CP-006 QLs are prohibited.

## 5. Effective gap state

The first gap pass recorded five open evidence/ownership rows. This checkpoint resolves two ownership rows without adding a QL.

```text
historical open rows: 5
resolved ownership rows: 2
effective open source gaps: 3
new QL templates admitted: 0
provisional solve modes: 7
provisional QL-template families: 11
```

Remaining source-blocked directions:

1. final total mixture quantity as the requested answer;
2. difference between two component quantities as the requested answer;
3. impossible or indeterminate alligation as the requested predicate.

No direct trusted target-exam fixture was recovered for these three directions.

## 6. Preserved product decisions

```text
MAL-CP001-PROT-DIFFERENCE-BASED-QUANTITIES
→ deferred

MAL-CP001-PROT-TWO-STAGE-UNKNOWN
→ held

MAL-CP001-PROT-THREE-WAY-TARGET-WITH-RELATION
→ referred to MAL-CP-002
```

## 7. Review and lifecycle boundary

```text
QL-template review status: PENDING
48 English row statuses: PENDING
individual English rows approved: 0
Hindi/Punjabi: not started
permanent MAL-QL IDs: 0
publiclyPublishable: false
Question Studio exposure: disabled
Question Bank writes: disabled
student/test routing: disabled
```

## 8. Next gate

1. conduct one final targeted source pass for the three requested-output gaps;
2. if direct evidence remains absent, prepare an explicit defer/reject recommendation for product approval rather than generating artificial contracts;
3. conduct grouped English review of the eleven provisional QL templates and forty-eight rows;
4. rerun merge/split, source, misconception, explanation and ownership audits;
5. freeze counts only when no meaningful uncovered mode remains;
6. only then prepare a count-bearing permanent allocation proposal.
