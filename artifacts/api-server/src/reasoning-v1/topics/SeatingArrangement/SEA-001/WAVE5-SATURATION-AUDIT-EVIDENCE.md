# SEA-001 — Wave 5 Saturation and Audit Evidence

Authority: **SEA Seating Arrangement Master End-to-End Family Design V3 (merged)**.

This evidence records automated/source completion only. It is **not** the English manual-review freeze and it does not allocate permanent QLs.

## Implementation boundary

All five SEA-001 checkpoints are executable:

- `SEA-CP-001` — single row, same facing;
- `SEA-CP-002` — single row, mixed facing;
- `SEA-CP-003` — circular, facing centre;
- `SEA-CP-004` — circular, facing outward;
- `SEA-CP-005` — circular, mixed facing.

All named provisional authorities `SEA-PBA-001` through `SEA-PBA-020` are reachable.

## Production-candidate saturation

The package saturation proof runs the real checkpoint generators and enforces:

```text
caselets                    >= 1,500
child questions             >= 6,000
material structural variants >= 60
query-template surfaces     >= 24
balanced review candidates  = 100
technical/editorial blockers = 0
permanent QLs               = 0
```

The current harness accepts 80 unique caselets per named PBA, producing **1,600 accepted caselets** and **6,400 genuine child questions**.

The current proof exposes **34 query-template surfaces** and keeps the lower-bound structural saturation gates intact. `SEA-QC-016`, `SEA-QC-017` and `SEA-QC-019` are owned SEA-001 contracts whose reachability is mandatory.

Exact and normalized duplicate clue-set candidates are rejected during saturation sampling.

## CP-001 closure and exam-query breadth

Wave 5 closes the remaining CP-001 implementation gaps identified against V3:

- seat-count boundary expanded to 5–8 persons;
- thirteen distinct query-contract families are reachable across deterministic CP-001 seeds;
- four-child caselets remain inside the V3 3–5-child rule;
- position-from-end, immediate-right, adjacent-pair and seat-exchange hypothetical queries are included;
- V3 `SEA-QC-016` **which statement is true** is executable with `STATEMENT` answer semantics;
- V3 `SEA-QC-017` **which statement is false** is executable with `STATEMENT` answer semantics;
- V3 `SEA-QC-019` **odd pair/group by seating relation** is executable with `PAIR` answer semantics;
- wrong options in these exam-style formats carry explicit misconception classification, semantic fingerprints, recomputation evidence and value-specific explanations;
- the saturation residual audit declares QC016/QC017/QC019 owned, so any loss of their reachability fails the package gate;
- PBA-004 displays exactly one negative-adjacency clue and at most seven clues;
- PBA-004 relative clues are seed-varied rather than distance-ranked;
- if a PBA-004 passage contains multiple relative clues, at least two relation distances are required;
- absolute end anchors render as `left end` / `right end` rather than ordinal-from-end artifacts.

The V3 roadmap wording says five CP-001 provisional blueprints, but the explicit named inventory contains `SEA-PBA-001` through `SEA-PBA-004`. The repository records **named-inventory precedence** and does not invent an unnamed fifth authority.

## Editorial hardening from the 100-caselet pass

The balanced review surfaced systematic presentation weaknesses that were not correctness failures. They are now generator-level regressions rather than one-off edits:

- every correct option carries the question-specific child explanation instead of a generic `This matches ...` rationale;
- fallback distractors carry value-specific explanations;
- person/pair fallbacks may not reuse a participant explicitly named in the query;
- visible option displays must remain four-way unique;
- mixed-facing relation labels use natural ordinals and `Immediately to the left/right` wording;
- awkward `the relation is immediate to ...` explanation phrasing is normalized;
- the balanced review corpus is scanned for the rejected wording.

Detailed review evidence is recorded in `SEA-001-EDITORIAL-REVIEW-EVIDENCE.md`.

## Circular closure work

- CP-003 exposes the shared physical clockwise/anticlockwise query contract as well as centre-facing left/right.
- CP-003 and CP-004 retain odd-N opposite-seat guards.
- CP-004 retains an explicit counterfactual detector for accidental centre-facing semantics.
- CP-005 retains per-person facing constraints in the solver while grouping multiple explicit facing facts into one natural student-facing clue.
- PBA-020 no longer relies on a near-complete immediate-clockwise chain followed by repetitive if/otherwise facing links. Its retained solve contract requires conditional orientation, reference-facing left/right work and physical cyclic placement together.
- PBA-020 passages are capped at 9 displayed clues and expose exactly one explicit if/otherwise facing clue; binary-equivalent retained links render naturally as same/opposite-facing statements.

## Merge/split audit

The automated audit records one decision for each of the 20 named PBAs and compares execution signatures plus the V3 defining discriminator.

Established green evidence:

```text
merge/split decisions 20
merge candidates       0
split candidates       0
missing authorities    0
```

No named PBA is automatically merged or split.

## Inverse audit

Established green evidence includes:

```text
linear inverse round trips          296
linear facing inversions            296
cyclic inverse round trips           580
centre/outward facing inversions     580
opposite involutions                  24
odd opposite guards                   16
arc complement checks                290
mixed-facing double inversions         2
```

These checks guard left/right inversion, cyclic direction inversion, centre/outward reversal, odd/even opposite semantics and arc-count complements.

## Gap audit

The technical gap audit checks:

- V3 seat-count partitions;
- reachability of all 20 named PBAs;
- odd-circle opposite guards;
- landmark variants;
- genuine mixed-facing CP-005 states;
- CP-001 query-family coverage;
- package-boundary exclusions for SEA-002/SEA-003;
- source-gated hypothetical categories.

Current automated result: **0 genuine missing-implementation gaps**. The same governance gates re-run after every seating change.

## External exam source audit

External evidence validates exam relevance only; it does not redefine V3.

The source evidence register covers:

- SSC;
- Banking;
- Railway;
- Punjab State;
- all five SEA-001 checkpoints.

There are 13 verified evidence records. SSC, Railway and Punjab lanes include official-paper-index records. The Banking lane explicitly records its memory-based-paper limitation where reusable official papers are not available.

## English review candidate

`sea-001-review-export.ts` generates:

- `sea-001-review-100.json`;
- `sea-001-review-100.csv`;
- `sea-001-review-100.html`;
- `sea-001-review-ledger-template.json`.

The final review corpus remains balanced at **20 caselets per checkpoint / 5 per PBA**.

For CP-001, review selection requires **QC016, QC017 and QC019 in every PBA's five-caselet review slice** before filling the remaining two slots. The exporter builds a broader candidate pool and then selects exactly 100 review caselets; the review count itself has not increased.

The ledger is content-fingerprinted. A decided entry must include `reviewerId` and `reviewedAt`.

## Manual-review and allocation lock

The following remains intentionally open:

```text
signed English manual review  PENDING
REWRITE count                  not yet signed
REJECT count                   not yet signed
permanent QL allocation         LOCKED
solve-inventory freeze          LOCKED
query-mix freeze                LOCKED
English freeze                  LOCKED
Question Studio registration    false
Question Bank writes            false
mock-test eligibility           false
public delivery                 false
```

Permanent allocation can become eligible only after the exact 100-entry review ledger contains 100 signed `ACCEPT` decisions and zero `REWRITE` / zero `REJECT`.

Even after allocation eligibility is reached, activation remains a separate downstream gate.
