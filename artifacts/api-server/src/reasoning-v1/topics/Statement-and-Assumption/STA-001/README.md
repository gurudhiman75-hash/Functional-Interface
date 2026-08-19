# STA-001 — Statement & Assumption

Product code: `REAS-STA`

Family: `Reasoning V1 / Family C — Logic and deduction`

## Status

```text
maturity:                    PERMANENT_QL_SEMANTIC_FREEZE
permanentQlCount:            4
sourceSaturation:            TARGETED_CORE_SATURATION_COMPLETE
executableDiscovery:         GREEN
englishProductionCorpus:     NOT_FROZEN
questionStudioDiscoverable:  false
questionBankWritable:        false
testEligible:                false
publiclyPublishable:         false
hindiPunjabi:                NOT_STARTED
```

Authoritative chapter design:

- `STA-001-END-TO-END-DESIGN.md`

Executable/freeze authorities:

- `types.ts`
- `prototype-authorities.ts`
- `oracle.ts`
- `generator.ts`
- `router.ts`
- `permanent-authorities.ts`
- `foundation-proof.test.ts`
- `permanent-ql-proof.test.ts`
- `STA-001-EXECUTABLE-DISCOVERY-EVIDENCE-V1.md`

## Permanent semantic QLs

```text
STA-QL-001  Core prerequisite / existence / availability / capability / feasibility dependency
STA-QL-002  Recommendation / proposal / policy / decision need-and-efficacy dependency
STA-QL-003  Source-supported notice / rule / institutional-communication audience-purpose dependency
STA-QL-004  Claim / prediction hidden causal-or-efficacy bridge
```

Candidate count (2 or 3), answer coding, negative wording and option ordering are metadata, not QL identity.

Still deferred rather than silently allocated:

- advertising/appeal breadth as a distinct QL;
- comparison/measurement/representativeness as a distinct QL;
- negative-query-only QL.

## Product boundary

This chapter owns **implicit-assumption identification** only.

It is separate from:

- Statement & Conclusion (`REAS-STC`)
- Statement & Argument (`REAS-ARG`)
- Course of Action (`REAS-COA`)
- Cause & Effect (`REAS-CAE`)
- Assertion & Reason (`REAS-ASM`)

The chapter may share Family C proposition utilities later, but it retains its own semantic oracle, scenario authority, distractor taxonomy, explanation contract and QA gates.

## Current implementation evidence

- independent oracle never reads the editorial expected-answer flag as answer authority;
- removing a required hidden dependency makes the candidate fail;
- making the same proposition explicit makes it cease to be an implicit assumption;
- semantic negation is represented as data rather than text-level `not` insertion;
- two- and three-assumption questions both execute;
- an SSC-style `All I, II and III` correct outcome executes;
- all four option positions are exercised per QL;
- deterministic replay is enforced;
- the production API build is part of the dedicated CI gate;
- review HTML/JSON is generated as a CI artifact.

## Next implementation step

Permanent QL identity is frozen, but the chapter is **not yet production-ready**.

Next:

1. expand the English curated scenario/family library substantially inside the four frozen QLs;
2. run large diversity, ambiguity, misconception and exam-readiness audits;
3. freeze the English production corpus and explanation quality;
4. localize/adapt Hindi and Punjabi with semantic parity tests;
5. only then register the whole frozen chapter in Question Studio and open downstream gates.
