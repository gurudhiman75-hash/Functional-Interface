# DSF-CP-017 — Normal Question Studio Review Integration

Status: **IMPLEMENTED / VALIDATION PENDING**

CP-017 is an additive delivery adapter over the production-integrated DSF CP011–CP016 work. It does not rewrite any frozen source solver, DSF sufficiency semantic, CP014 editorial rule, or permanent QL allocation.

## Purpose

Make Data Sufficiency behave like an ordinary Question Studio package:

- discoverable in the shared Question Studio capability list;
- selectable through the standard `DSF-001` package;
- generated through the shared generation dispatcher;
- submitted through the standard `POST /admin/question-studio/runs` workflow;
- persisted to `content.generation_runs`, `generation_run_items` and `generation_item_versions` with status `review`;
- reviewed manually before any downstream use.

The existing specialized `/reasoning/data-sufficiency/*` endpoints remain untouched for the previously approved CP008–CP010 multilingual flow.

## Generatable scope

Permanent semantic registry:

- `DSF-QL-001` — two-statement target determinacy — **generatable**
- `DSF-QL-002` — three-statement minimal-sufficient-subset semantics — **permanent but runtime-deferred**
- next permanent identity: `DSF-QL-003`

`DSF-QL-002` is deliberately not exposed for batch generation. CP015 froze the semantic lattice and source-backed Number System prototypes, but did not create an exhaustively reviewed production batch runtime. CP017 rejects QL002 generation explicitly instead of replaying prototypes or pretending it is ready.

## Two-statement Question Studio lanes

CP017 exposes 21 normal-workflow lanes under `DSF-QL-001`.

### Existing frozen core

1. Number System
2. Ratio & Proportion
3. Percentage
4. Algebra

### CP011 Quant breadth

5. Average
6. Ages
7. Profit, Loss & Discount
8. Simple & Compound Interest
9. Time & Work / Pipes & Cisterns
10. Time, Speed & Distance / Trains / Boats
11. Mixture & Alligation
12. Mensuration 2D & 3D
13. Ratio / Percentage / Number System enrichment
14. Algebra enrichment

### CP012 Reasoning Wave 1

15. Ranking & Order
16. Direction Sense
17. Blood Relations
18. Inequality

### CP013 Reasoning Wave 2

19. Seating Arrangement
20. Coding-Decoding
21. Calendar

Reasoning lanes keep the CP014 V3 common-base editorial surface. CP017 adds no new solver truth.

## Language boundary

The newly integrated CP011–CP013 breadth is currently English-first (`en`). CP017 does not claim Hindi/Punjabi localization for content that has not been localized and reviewed.

The older approved Hindi/Punjabi DSF workflow remains available through the existing specialized Data Sufficiency route and is not modified by this checkpoint.

## Lifecycle promotion boundary

CP017 intentionally opens only the two capabilities required for normal Question Studio authoring:

- Question Studio discoverable: **yes**
- review-run persistence: **yes**

Everything downstream remains locked:

- review only: **yes**
- manual approval required: **yes**
- Question Bank writable: **no**
- scored-test eligible: **no**
- mock-test eligible: **no**
- publicly publishable: **no**
- automatic student publication: **no**

The authenticated standard `/runs` route re-checks these locks on every generated payload before it writes anything to the review tables.

## Integration surfaces

- source adapter: `DSF-CP-017/question-studio-review-v1.ts`
- shared capabilities/generation dispatcher: `question-studio/shared-generation-engine-sri.ts`
- canonical Reasoning review registry: `reasoning-v1/question-studio-review-registry.ts`
- authenticated standard review-run route: `routes/admin-question-studio-data-sufficiency-current.ts`
- canonical route mount registry: `routes/admin-question-studio-registry.ts`

## Required validation

CP017 is not frozen merely because the package appears in a dropdown. Its executable gate must prove:

1. API server builds on the current base;
2. all 21 lanes generate a valid two-statement/five-option question;
3. every generated question has exactly one correct option;
4. CP014 V3 editorial identity is preserved for Reasoning lanes;
5. deterministic seed replay is stable;
6. mixed batches do not duplicate source identities;
7. the latest shared capability list contains exactly one `DSF-001` package;
8. the shared dispatcher routes DSF requests to CP017 rather than the Quant fallback;
9. the standard `/runs` DSF handler is mounted before legacy DSF/catch-all routes;
10. review persistence is enabled while Bank/test/mock/public/automatic-publication gates remain false;
11. a QL002 generation request fails explicitly until a real reviewed batch runtime exists.
