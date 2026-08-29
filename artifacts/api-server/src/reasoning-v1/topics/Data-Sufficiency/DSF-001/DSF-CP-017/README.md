# DSF-CP-017 — Normal Question Studio Integration

## Purpose

CP017 connects the production-integrated CP011–CP015 Data Sufficiency expansion to the **normal Examtree Question Studio review workflow**.

This is an additive product integration checkpoint. It does not rewrite the historical CP002–CP010 production authorities and it does not change the source semantics or solver ownership of CP011–CP015.

## Normal Question Studio behavior

`DSF-001` is now registered in the shared Question Studio capability surface with:

- Question Studio discoverable: `true`
- generation enabled: `true`
- persistence to generation review runs: `true`
- manual approval required: `true`
- review-only: `true`
- Question Bank writable: `false`
- scored-test eligible: `false`
- mock-test eligible: `false`
- publicly publishable: `false`
- automatic student publication: `false`

Generated items therefore enter the same `generation_runs` / `generation_run_items` / `generation_item_versions` review workflow as other normal Studio chapters without silently opening learner delivery.

## Registered semantic scope

Permanent semantic registry:

- `DSF-QL-001` — two-statement sufficiency
- `DSF-QL-002` — three-statement minimal-sufficient-subset reasoning
- next available — `DSF-QL-003`

Two-statement normal Studio generation uses the executable CP011–CP013 source-bound runtimes across 17 generator lanes:

- Ages
- Algebra
- Average
- Ratio / Percentage / Number System core arithmetic
- Interest
- Mensuration
- Mixture & Alligation
- Profit, Loss & Discount
- Time & Work / Pipes
- Time, Speed & Distance / Trains / Boats
- Blood Relations
- Direction & Distance
- Inequality
- Ranking & Order
- Calendar
- Coding-Decoding
- Seating Arrangement

The generators continue to call their source chapter solvers/oracles. CP017 only adapts their already-validated output to the normal Studio contract.

## Three-statement QL002 quality guard

`DSF-QL-002` is exposed as a permanent selectable family, but it is **not mixed into default random batches** yet. Its current source-authoritative corpus contains two Number System prototypes, so explicit QL002 batches are capped at two items until that object pool is expanded.

This avoids creating apparent breadth through repeated surfaces.

## Routing

`admin-question-studio-data-sufficiency-normal.ts` is mounted before the existing SRI capability route.

It:

1. returns the existing complete Question Studio package catalog plus the additive `DSF-001` CP017 capability;
2. claims standard `POST /runs` requests only when they select Data Sufficiency;
3. persists generated items to the generic review-run tables;
4. rejects persistence if any downstream learner-release gate is open; and
5. calls `next()` for every non-DSF request.

The older `/reasoning/data-sufficiency/*` CP002–CP010 endpoints remain unchanged and continue to represent their historical approved multilingual production scope.

## Validation

The dedicated `Validate DSF CP-017 Normal Question Studio` workflow follows the repository CI fanout policy: it is scoped to `New-main`, path-filtered to the CP017/route integration surface, cancels superseded PR runs, and does not self-trigger when its workflow definition alone changes.

Its executable authority requires the API build, CP017 integration audit, and learner-release lock scan to pass on the same PR head.

## Production ancestry

CP017 consumes CP016 production merge evidence. It does not change CP016 history or claim a new learner release. The only new authorization in this checkpoint is **normal Question Studio discovery, generation, and review-run persistence**.
