# PCT-002 Phase C-A Runtime Infrastructure

Package:

PCT-002

Consume only:

- question-language.library.json
- explanation.library.json
- variable-ranges.library.json
- coverage-targets.library.json
- distribution-targets.library.json

Educational ownership remains HUMAN_OWNED.

Runtime must never create educational language.

Create exactly these files:

cp-registry.ts
topology-registry.ts
reasoning-pattern-registry.ts
difficulty-registry.ts
stem-selector.ts
explanation-selector.ts
variable-sampler.ts
coverage-selector.ts
distribution-controller.ts
package-registry.ts
types.ts

Active CP list:

CP01 Final value after a single percentage increase

CP02 Final value after a single percentage decrease

CP03 Final value after successive percentage changes

CP04 Equivalent net percentage change

CP05 Original value before percentage increase

CP06 Original value before percentage decrease

Topology count = 6

Reasoning pattern count = 6

Difficulty entries = 6

Requirements:

cp-registry.ts

Register all six CPs.

topology-registry.ts

One topology per CP.

reasoning-pattern-registry.ts

One reasoning pattern per CP.

difficulty-registry.ts

Support:

EASY
MEDIUM
HARD

Difficulty controls numerical complexity only.

stem-selector.ts

Read only from question-language.library.json.

No generated wording.

No fallback text.

explanation-selector.ts

Read only from explanation.library.json.

No paraphrasing.

variable-sampler.ts

Consume variable-ranges.library.json.

coverage-selector.ts

Consume coverage-targets.library.json.

distribution-controller.ts

Consume distribution-targets.library.json.

package-registry.ts

Register:

PCT-002

Ownership:

HUMAN_OWNED

Usage:

Runtime Consumption Only

types.ts

Shared interfaces only.

No educational language.

Forbidden:

Do NOT create:

parameter-generator.ts
solver.ts
reasoning-graph.ts
explanation-renderer.ts
validator.ts
pipeline.ts
coverage-auditor.ts
index.ts
tests
audits
CSV files

Verification:

CP count = 6

Topology count = 6

Reasoning pattern count = 6

Runtime file count = 11

JSON libraries consumed = 5

Ownership = HUMAN_OWNED

No educational language created

No stems or explanations paraphrased

No new CPs created

Forbidden files created = 0

Run:

pnpm --dir artifacts/api-server run build

Output only:

active CP list

topology count

reasoning pattern count

runtime file count

build status