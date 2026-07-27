# PNL-CP-001 Dynamic Runtime Checkpoint

Status: **IMPLEMENTED AND CI-PROVEN**

## Scope

This checkpoint promotes the 36 frozen English QLs in `PNL-CP-001` from static canonical review to a true seeded dynamic-candidate pipeline.

Implemented layers:

- QL-addressable deterministic parameter generation;
- direct and reverse fundamental price relations across all 18 solve modes;
- exact canonical solving;
- independent exact verification;
- Editorial V2 stem and explanation binding;
- answer-semantic formatting for money, percentage, ratio, fraction and no-change answers;
- four unique misconception-labelled options;
- deterministic option ordering;
- dynamic package emission with full traceability;
- explicit Question Bank, test and publication safety.

## Frozen range

```text
PNL-QL-001 through PNL-QL-036
QL count: 36
Canonical problem: PNL-CP-001
Language: English
Runtime mode: DYNAMIC_CANDIDATE
```

## Passing proof gate

The dedicated runtime proof generated every QL across 24 deterministic seeds on commit `e7332c39a247eabbdd833a1b209ae05947bbe6c6`:

```text
36 QLs × 24 seeds = 864 generated packages
Easy packages: 360
Medium packages: 264
Hard packages: 240
```

Passing workflow evidence:

```text
Validate PNL CP-001 dynamic candidate runtime — run 28 — PASS
Validate PNL Freeze Readiness — run 73 — PASS
Validate PNL-001 Question Studio review runtime — run 63 — PASS
Validate PNL Editorial V2 — run 235 — PASS
Validate PNL Exam Stems — run 90 — PASS
Validate PNL Native Prompts — run 102 — PASS
```

The proof checks:

- exact deterministic regeneration;
- four unique options and one keyed answer;
- independent-verifier agreement;
- no unresolved prose placeholders while preserving rendered LaTeX;
- value-specific explanations;
- seed diversity per QL;
- difficulty-band selection;
- unsupported-language rejection;
- publication safety.

## Edge cases proven during the sweep

The seed sweep exposed and resolved:

- LaTeX braces being mistaken for unresolved prose placeholders;
- fixed-answer diversity handling for `PNL-QL-035`;
- fractional-paise misconception options while preserving exact canonical money;
- the 100% profit boundary in margin-on-selling-price distractors;
- the 100% profit boundary in rate-to-fraction distractors.

## Safety boundary

Until manual review and later release gates are completed, every generated package remains:

```text
reviewStatus: UNREVIEWED_DYNAMIC_CANDIDATE
questionBankStatus: NOT_STORED
testEligibility: INELIGIBLE
publiclyPublishable: false
```

Shared Question Studio routing remains on the already merged canonical-review runtime during this proof checkpoint. Dynamic routing must be enabled only after the generated review export is manually inspected and approved.
