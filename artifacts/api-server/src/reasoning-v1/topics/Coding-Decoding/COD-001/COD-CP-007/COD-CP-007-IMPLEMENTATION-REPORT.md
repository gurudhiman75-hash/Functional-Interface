# COD-CP-007 — English Runtime Implementation Report

Status: **four permanent QLs implemented at English runtime-proof maturity; review-only**.

## Implemented identities

```text
COD-QL-169..172
```

The runtime promotes the frozen uniform digit prototype into four permanent solve contracts:

1. explicit forward application;
2. inverse decode;
3. missing code digit;
4. inferred forward coding.

The inferred-forward QL supports both direct answer and choose-matching presentations without changing its solve authority.

## Runtime architecture

- reuses the saturated token-string generator and independent ambiguity solver;
- preserves leading zeroes;
- applies decimal wrap digit by digit;
- retains four unique misconception-labelled options;
- emits permanent QL identity and `prototypeOnly: false`;
- remains `reviewOnly: true`, `publiclyPublishable: false` and hidden from Question Studio.

## Validation target

The permanent audit generates 100 seeds for each QL and enforces:

- deterministic output;
- contiguous permanent identities;
- solve-contract and prototype provenance;
- one surviving uniform shift;
- rejection of whole-number arithmetic;
- four unique options and exactly one answer;
- answer-position, renderer and difficulty coverage;
- leading-zero and wrap coverage;
- first, middle and final missing-token positions;
- both presentation variants for `COD-QL-172`.

Hindi and Punjabi are intentionally deferred until the remaining COD-001 English ownership is frozen.
