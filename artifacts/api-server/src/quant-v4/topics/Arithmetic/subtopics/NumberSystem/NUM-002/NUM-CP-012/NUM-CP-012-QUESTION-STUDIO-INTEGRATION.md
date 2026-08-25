# NUM-CP-012 — Question Studio Integration

## Release surface

Permanent CP012 authorities `NUM-QL-226..NUM-QL-236` are exposed to the shared Question Studio review runtime in English, Hindi and Punjabi.

The shared `NUM-002` capability now aggregates CP008 through CP012:

- CP008: `NUM-QL-166..184` — 19 authorities;
- CP009: `NUM-QL-185..196` — 12 authorities;
- CP010: `NUM-QL-197..212` — 16 authorities;
- CP011: `NUM-QL-213..225` — 13 authorities;
- CP012: `NUM-QL-226..236` — 11 authorities;
- aggregate: **71 permanent QLs**.

The next free Number System QL remains `NUM-QL-237`.

## Routing contract

CP012 claims only explicit requests:

- `canonicalProblemId` / `cpId = NUM-CP-012`;
- `patternId` naming `NUM-CP-012`;
- `questionLanguageId = NUM-QL-226..236`.

Package-only `NUM-002` is **not** claimed by CP012 and preserves the established fallback routing.

The admin route infers `NUM-CP-012` from `NUM-QL-226..236`, rejects mismatched explicit CP/QL ownership, and permits frozen Hindi/Punjabi review for CP012.

## Review-only lifecycle

Question Studio may generate and store **generation-run review items**. This is not Question Bank publication.

For every CP012 Studio item:

- `questionStudioDiscoverable = true`;
- `questionBankStatus = NOT_STORED`;
- `questionBankWritable = false`;
- `testEligibility = INELIGIBLE`;
- `testEligible = false`;
- `mockTestEligible = false`;
- `publiclyPublishable = false`;
- `automaticStudentPublication = false`.

## Traceability

Every generated review item retains:

- permanent QL and authority ID;
- source temporary prototype;
- source answer semantic and permanent answer semantic;
- hidden mathematical state;
- mathematical fingerprint;
- source/prototype ancestry;
- frozen content/localization state;
- deterministic request/source seed trace.

## Regression boundary

Shared-engine routing is rechecked for CP008, CP009, CP010 and CP011. CP012 must not steal any earlier explicit CP/QL request. The previous CP011 route contract is updated only to recognize the legitimate 71-QL aggregate extension; its own QL213..225 routing remains unchanged.
