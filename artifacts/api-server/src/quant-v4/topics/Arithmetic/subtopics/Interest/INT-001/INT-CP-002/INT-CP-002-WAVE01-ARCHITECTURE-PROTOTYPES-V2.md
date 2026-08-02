# INT-CP-002 — Wave 1 Architecture-Establishing English Prototypes V2

Status: **executable discovery authority; human review required; no permanent QLs**  
Checkpoint: `INT-CP-002 — Simple-Interest Comparisons, Interval Ledgers and Multiple Sums`  
Runtime authority: `INT-CP-002-WAVE01-ENGLISH-PROTOTYPES-V2`

## Provisional prototype ancestries

Wave 1 implements eight provisional mathematical ancestries:

1. successive simple-interest rate intervals;
2. multiple independent deposits;
3. split-principal allocation;
4. equal-interest reconstruction;
5. counterfactual rate change;
6. explicit partial repayment;
7. borrowing/lending interest spread;
8. declared day-count basis.

These are executable discovery prototypes. They are not permanent QLs and do not freeze the final solve-contract inventory.

## Mathematical contract

Every generated prototype contains:

- deterministic valid-state-first generation;
- exact rational source state and answer;
- four distinct misconception-owned options;
- independent verification of every displayed option;
- exactly one independently valid answer;
- calculation-rich English explanation;
- at least four worked steps with actual numerical substitution;
- explicit arithmetic or algebra;
- numerical verification and final conclusion;
- explanation of all three displayed wrong options;
- central-registry and lifecycle locks.

## V1 TeX defect and disposition

The first Wave 1 exporter exposed a JavaScript string-escape defect. TeX commands such as `\frac`, `\times` and `\text` were interpreted as form-feed or tab control characters, while `\Delta` lost its backslash.

The V1 explanation authority is therefore **superseded and must not be used for review, localisation or future QL work**.

V2 repairs the explanation presentation before output and permanently rejects:

- control characters;
- bare TeX commands;
- unbalanced inline or display delimiters;
- malformed object leakage;
- internal QL, prototype, seed or solve-contract metadata in learner text.

The repair preserves exactly:

- stem;
- source state;
- solution;
- option values and order;
- correct index;
- option misconception audit;
- mathematical generation behaviour.

## Executable mathematical proof

```text
Head:       c5d3a3235d1b0be78d59b742774266a5186a53dc
Workflow:   Validate INT-CP-002 Wave 1 prototypes
Run:        30749265239
Conclusion: PASS
Artifact:   8833898158
Digest:     sha256:5ce946c400cb9d27d4ff0bcea4b2b4379704fd304e2feb826981340b006ad0e9
```

```text
Generated questions:               800
Deterministic checks:               800
Structural checks:                6,400
Independent option checks:        3,200
Wrong-option rejection checks:    2,400
Explanation checks:               4,000
Learner-text checks:              2,400
Lifecycle checks:                 5,600
Recovered seeds:                     17
Maximum generation attempts:          2 / 32
Answer positions:          204 / 203 / 195 / 198
```

All eight ancestries and Easy, Medium and Hard states were covered. Each ancestry produced at least 39 distinct stems across 100 audited seeds; seven ancestries produced 89–98 distinct stems.

## TeX-integrity V2 proof

```text
Questions inspected:                    800
Deterministic V2 checks:                 800
Frozen-mathematics checks:             4,800
TeX-integrity checks:                  3,200
Required-command checks:              1,800
Legacy V1 control sequences detected: 8,200
Control sequences remaining in V2:        0
```

Manual artifact inspection confirmed correct rendering of representative piecewise-rate, split-principal, counterfactual and day-count explanations.

## Human-review pack

```text
Questions:                  64
Samples per ancestry:        8
Distinct stems:             64
Worked steps:              256
Minimum steps per question:  4
Answer positions:     15 / 16 / 16 / 17
Control characters:          0
Learner trace leakage:       0
```

The artifact contains:

- clean questions-only Markdown;
- TeX-safe answers and explanations Markdown;
- machine-readable JSON with full traceability;
- editorial checklist CSV;
- audit and exporter logs.

## Lifecycle boundary

```text
Permanent QLs:              0
Frozen solve contracts:     0
enabled:                     false
stagingStatus:               NOT_STAGED
registrationStatus:          NOT_REGISTERED
questionStudioDiscoverable:  false
questionBankStatus:          NOT_STORED
testEligibility:             INELIGIBLE
publiclyPublishable:         false
```

## Next wave

Wave 2 will saturate direct and inverse unknown positions around the surviving ancestries. It will not allocate permanent QLs until source, inverse, edge, representation and ownership gap audits are complete.
