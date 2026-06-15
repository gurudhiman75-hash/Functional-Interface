

---

# PCT-002 Phase C-B Final Runtime Execution Layer

Package:

PCT-002

Educational ownership remains:

HUMAN_OWNED

Runtime must consume only approved libraries and runtime registries.

No educational wording may be generated.

---

Create exactly these files:

```text
parameter-generator.ts
solver.ts
reasoning-graph.ts
explanation-renderer.ts
validator.ts
pipeline.ts
coverage-auditor.ts
index.ts
```

Create exactly one test:

```text
pct-002.test.ts
```

---

Generate:

```text
pct-002-human-review.csv
pct-002-pre-freeze-coverage-audit.md
pct-002-maturity-audit.md
```

---

## Supported CPs

```text
CP01 Final value after a single percentage increase

CP02 Final value after a single percentage decrease

CP03 Final value after successive percentage changes

CP04 Equivalent net percentage change

CP05 Original value before percentage increase

CP06 Original value before percentage decrease
```

Topology count = 6

Reasoning pattern count = 6

---

## parameter-generator.ts

Generate parameters only using approved variable ranges.

No educational wording.

---

## solver.ts

Implement pure mathematics only.

No wording generation.

---

## reasoning-graph.ts

Construct deterministic trace nodes.

One reasoning pattern per CP.

---

## explanation-renderer.ts

Read explanations only from:

```text
explanation.library.json
```

Read stems only from:

```text
question-language.library.json
```

No paraphrasing.

No fallback wording.

No educational generation.

---

## validator.ts

Verify:

```text
answer correctness
parameter validity
finite values
CP consistency
traceability consistency
```

---

## pipeline.ts

Execution order:

```text
parameter generation
↓
solver
↓
reasoning graph
↓
explanation renderer
↓
validator
```

---

## coverage-auditor.ts

Audit:

```text
CP coverage
category coverage
stem coverage
explanation coverage
```

Detect:

```text
unused QL IDs
unused ES IDs
```

---

## index.ts

Export package runtime.

---

## pct-002.test.ts

Stress test all six CPs.

Verify:

```text
no crashes
no invalid answers
no missing traces
no unused stem IDs
no unused explanation IDs
```

---

## Human Review CSV

Generate:

```text
pct-002-human-review.csv
```

Rows:

```text
4000
```

Balanced across CPs.

Include:

```text
CP ID
stem ID
explanation ID
parameters
answer
rendered question
rendered explanation
```

---

## Pre-Freeze Audit

Generate:

```text
pct-002-pre-freeze-coverage-audit.md
```

Verify:

```text
all CPs exercised
all categories exercised
all stems reachable
all explanations reachable
```

---

## Maturity Audit

Generate:

```text
pct-002-maturity-audit.md
```

Verify:

```text
validation failures
traceability failures
MathJax failures
unused QL IDs
unused ES IDs
```

---

Update:

```text
artifacts/api-server/build.mjs
```

Emit:

```text
dist/quant-v3/pct-002.test.mjs
```

---

Run:

```bash
pnpm --dir artifacts/api-server run build
```

Then:

```bash
node artifacts/api-server/dist/quant-v3/pct-002.test.mjs
```

---

Report only:

```text
generation failures
validation failures
traceability failures
MathJax failures
unused QL IDs
unused ES IDs
```

Final verdict:

```text
READY FOR HUMAN FREEZE REVIEW
```

only if every failure count equals zero.

---

