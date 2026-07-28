# PNL-001 CP-001 Dynamic Question Studio Integration

## Status

`PNL-CP-001` is available in Question Studio through an explicit opt-in `DYNAMIC_CANDIDATE` runtime while the existing `CANONICAL_REVIEW` runtime remains the default for the complete PNL-001 chapter.

## Runtime boundary

- package: `PNL-001`
- dynamically enabled CP: `PNL-CP-001`
- dynamic QLs: `PNL-QL-001` through `PNL-QL-036`
- dynamic language: English
- default runtime: `CANONICAL_REVIEW`
- opt-in runtime: `DYNAMIC_CANDIDATE`

Requests for `DYNAMIC_CANDIDATE` are restricted to `PNL-CP-001`. CP-002 through CP-006 continue to use canonical review until their dynamic runtimes are implemented and proved.

## Safety contract

Both PNL review modes remain outside production question use:

```text
questionBankStatus: NOT_STORED
testEligibility: INELIGIBLE
publiclyPublishable: false
```

Dynamic packages additionally carry:

```text
reviewStatus: UNREVIEWED_DYNAMIC_CANDIDATE
runtimeMode: DYNAMIC_CANDIDATE
```

Question Studio previews preserve these fields, and Question Bank conversion rejects review-only or ineligible payloads.

## Proof coverage

The shared Question Studio integration proof validates:

- one visible `PNL-001` package and no exposed nested CP folders;
- canonical review remaining the default across all six CPs;
- opt-in dynamic generation restricted to CP-001;
- deterministic QL-level generation for a fixed seed;
- four unique options with the keyed answer;
- propagation of runtime and safety metadata into preview payloads;
- rejection of unsupported dynamic CP and runtime-mode requests;
- rejection of dynamic review candidates by Question Bank conversion;
- continued English-only enforcement for the current PNL Question Studio runtime.

The permanent workflow is `.github/workflows/validate-pnl-question-studio-review-runtime.yml`.
