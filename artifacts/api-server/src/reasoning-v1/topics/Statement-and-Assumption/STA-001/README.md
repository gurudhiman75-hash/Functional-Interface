# STA-001 — Statement & Assumption

Product code: `REAS-STA`

Family: `Reasoning V1 / Family C — Logic and deduction`

## Status

```text
maturity:                    DESIGN_AUTHORITY
permanentQlCount:            0
sourceSaturation:            NOT_STARTED
executableDiscovery:         NOT_STARTED
questionStudioDiscoverable:  false
questionBankWritable:        false
testEligible:                false
publiclyPublishable:         false
```

Authoritative chapter design:

- `STA-001-END-TO-END-DESIGN.md`

## Product boundary

This chapter owns **implicit-assumption identification** only.

It is separate from:

- Statement & Conclusion (`REAS-STC`)
- Statement & Argument (`REAS-ARG`)
- Course of Action (`REAS-COA`)
- Cause & Effect (`REAS-CAE`)
- Assertion & Reason (`REAS-ASM`)

The chapter may share Family C proposition utilities later, but it must retain its own semantic oracle, scenario authority, distractor taxonomy, explanation contract and QA gates.

## Next implementation step

Phase A foundation:

1. define scenario/proposition/dependency runtime types;
2. implement dependency-based assumption oracle;
3. implement semantic denial representation;
4. implement misconception taxonomy;
5. implement two-assumption outcome contract;
6. build the first curated English discovery scenarios for `STA-CP-001`;
7. create deterministic semantic/oracle tests before Question Studio exposure.
