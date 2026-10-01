# DSF-001 — Deep Audit Wave 01

Date: 2026-10-01

Status: `CURRENT_MAIN_LIVE_QUESTION_STUDIO_AUDIT_STARTED`

## Current authority

The current DSF authority is additive and must not be confused with the older CP010 multilingual production freeze.

Current permanent semantic registry:

- `DSF-QL-001` — two-statement target determinacy — normal Question Studio generation enabled;
- `DSF-QL-002` — three-statement minimal-sufficient-subset semantics — permanently allocated at CP015, normal batch generation intentionally deferred;
- next available permanent identity: `DSF-QL-003`.

Current CP017 normal Question Studio breadth:

- 21 QL001 lanes;
- legacy Quant core + CP011 Quant breadth + CP012/CP013 Reasoning breadth;
- English-first for the newly added breadth;
- review-run persistence enabled;
- Question Bank/test/mock/public/automatic-publication locks remain closed.

## Wave 01 gate

Wave 01 exercises the actual shared Question Studio dispatcher, not only source adapters.

For each of the 21 live QL001 lanes and each requested difficulty (Easy/Medium/Hard), the gate generates two questions and verifies:

- lane and QL routing;
- requested difficulty preservation;
- two-statement structure;
- five-option contract;
- exactly one correct option;
- answer/index integrity;
- non-empty human explanation;
- unique question/source identities;
- review-only downstream locks;
- no internal/debug leakage.

It also proves:

- exactly one DSF package is exposed;
- permanent registry is exactly QL001 + QL002;
- QL001 is generatable;
- QL002 is explicitly runtime-deferred, not missing;
- next identity is QL003;
- requests for QL002 fail closed;
- the new CP011–CP013 breadth does not falsely claim Hindi localization.

## Next waves

After Wave 01 is green:

1. lane-by-lane content breadth and repetition audit;
2. difficulty consistency across Quant/Reasoning lanes;
3. explanation quality and statement-sufficiency pedagogy;
4. QL001/QL002 merge-split boundary recheck;
5. final content closure, while keeping QL002 runtime-deferred unless a reviewed batch runtime is implemented.

Novelty remains deferred to the reasoning-wide final novelty pass.
