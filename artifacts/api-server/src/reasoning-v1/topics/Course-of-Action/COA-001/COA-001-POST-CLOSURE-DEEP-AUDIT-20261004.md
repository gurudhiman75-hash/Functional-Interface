# COA-001 — Post-Closure Deep Audit

Status: **CLOSED — FINAL ACTION-SEMANTICS PROOF AND CP012 GOVERNANCE REMEDIATION COMPLETE**

Date: 2026-10-04

Supersedes as current-head authority:
`COA-001-FINAL-DEEP-AUDIT-CLOSURE-20260929.md`

The September closure and the 2026-10-02 controlled-novelty closure remain historical evidence. No new semantic QL or novelty provider is introduced here.

## Scope

Current active semantic QLs:

- `COA-QL-001..COA-QL-006`
- `COA-QL-008`
- `COA-QL-009`

`COA-QL-007` remains retired from active semantic generation.

Current source inventory:

- active ordinary semantic authorities: **118**
- dedicated mutually-exclusive Either authorities: **4**
- three-action authorities: **6**
- frozen semantic authorities including historical QL007 ordinary rows: **130**
- EN/HI/PA full localization remains active

CP012 remains a lifecycle-only promotion of the CP011 approved learner content.

## Material defects found

### 1. Final learner answer semantics were not re-proved after downstream transforms

The source Course-of-Action architecture already has a genuine structured action-validity model.

`evaluateCoaAction` derives FOLLOWS / DOES_NOT_FOLLOW from:

- relevance
- actionability
- authority fit
- feasibility
- proportionality
- evidence fit
- expected utility
- urgency fit
- constraint fit
- sequence fit

CP008 also proves ordinary, Either and three-action source semantics.

However, the current learner path is later:

`structured authorities -> CP009 localization -> CP010 Question Studio presentation -> CP011 editorial/diversity overlay -> CP012 internal-eligibility promotion`

Before this audit there was no final general proof that the displayed `semanticActionId` values, answer class/mask, localized options and final `correctIndex` still agreed with the structured source authority after all of those downstream transforms.

### 2. CP012 advertised a runtime mode it could not execute

CP012 advertises:

`APPROVED_CP011_SURFACE_INTERNAL_ELIGIBILITY`

But it forwarded that runtime mode into the older CP010 review-only source generator, whose accepted runtime mode is different.

A client that sent the runtime mode advertised by the current CP012 package could therefore be rejected by the historical source layer.

The inherited `supportedRuntimeModes` value was also stale.

Remediation:

- CP012 validates its own advertised runtime mode;
- the CP012-only runtime mode is stripped before delegation into the frozen CP011/CP010 source path;
- CP012 now advertises only the runtime mode it actually accepts.

### 3. Approved CP012 output inherited a stale “review pending” editorial marker

CP011 correctly carried:

`FINAL_EDITORIAL_DIVERSITY_REVIEW_PENDING`

during its review phase.

CP012 promotes the same learner content into approved internal eligibility. Because the CP012 object was built by spreading the CP011 object, the old review-pending marker still appeared on current approved output.

Remediation:

- historical/source marker is preserved as `sourceEditorialDiversityStatus`;
- current CP012 output now exposes:
  `FINAL_EDITORIAL_DIVERSITY_APPROVED_INTERNAL`.

No learner content was changed.

## Final semantic proof authority

New authority:

`COA_CP012_FINAL_ACTION_SEMANTICS_PROOF_2026_10_04`

For every final learner question the proof resolves each displayed `semanticActionId` back to the frozen structured source action and independently re-runs `evaluateCoaAction`.

### Ordinary two-action profiles

For both four-way and five-code ordinary presentations the proof:

- resolves the displayed semantic action identities;
- re-derives each action verdict;
- derives ONLY_I / ONLY_II / BOTH / NEITHER from the displayed order;
- independently identifies the matching localized learner option;
- requires exactly one semantic option match;
- verifies runtime `answerClass`, `correctIndex`, `answer` and `canonicalAnswer`;
- requires `INDEPENDENT_VERDICTS`.

### Dedicated Either profile

The proof:

- verifies the source authority belongs to the dedicated Either pool;
- independently verifies both actions are valid;
- requires the five-code profile;
- requires `MUTUALLY_EXCLUSIVE_ALTERNATIVES`;
- independently identifies the localized EITHER option;
- verifies the final key.

Either remains a presentation/pair-relation semantic over two independently valid actions; it is not inferred merely because option index 2 was authored.

### Three-action combination profile

The proof:

- resolves all three displayed semantic actions;
- independently re-evaluates each action;
- derives the truth mask from displayed order;
- independently parses every EN/HI/PA combination option into its semantic mask;
- requires exactly one option matching the independently derived mask;
- verifies `answerMask`, `correctIndex`, `answer` and `canonicalAnswer`.

Unknown, duplicated or foreign semantic action identities fail closed.

## Exhaustive post-closure proof

Executable gate:

`coa-001-post-closure-audit-20261004.test.ts`

Exact successful result:

- active permanent QLs: 8
- retired QL: `COA-QL-007`
- active ordinary authorities: **118**
- Either authorities: **4**
- three-action authorities: **6**
- ordinary final surfaces: **708**
- Either final surfaces: **12**
- three-action final surfaces: **18**
- total final semantic-proof surfaces: **738**

The ordinary pass exhausts every active ordinary semantic authority in:

- two-action four-way;
- two-action five-code;
- English;
- Hindi;
- Punjabi.

The gate also exhausts all dedicated Either and all three-action authorities across all three languages.

Additional regression proofs cover:

- CP011 -> CP012 learner-content identity;
- current standard `reasoning-v1` adapter execution using the advertised CP012 runtime mode;
- QL007 retirement;
- wrong final key;
- unknown/foreign semantic action identity;
- wrong Either pair relation;
- wrong three-action answer mask.

Authority digest:

`551803d5823229750b9021c5b43bb9e5a847f1ba4c63fd6b047d19d4c151048e`

## Exact substantive-head validation

Substantive branch head:

`52e6c07556b227d970b777ecc378aedefa3d4598`

Workflow:

`Validate COA CP-012 internal eligibility` — run **#20**

Result: **SUCCESS**

The exact head passed:

- production API build;
- existing CP012 internal-eligibility approval proof;
- new post-closure final semantic proof.

The same head also passed:

- CP001 foundation
- CP002 expansion
- CP003 expansion
- CP004 expansion
- CP005 presentation
- CP006 ordered response
- CP007 integrated reasoning
- CP008 source audit
- CP009 localization
- CP010 Question Studio
- CP011 editorial diversity
- controlled novelty closure
- Reasoning final current-head status
- global Reasoning audit reconciliation
- branch topology
- CI workflow hygiene

## Lifecycle

Current approved internal lifecycle remains:

- Question Studio: active
- Question Bank writable: **yes**
- test eligible: **yes**
- mock eligible: **yes**
- public release: **no**
- student delivery: **no**
- automatic publication: **no**
- production release authorization: **no**

Current editorial-diversity status:

`FINAL_EDITORIAL_DIVERSITY_APPROVED_INTERNAL`

No public-release boundary was opened by this audit.

## Novelty

The controlled-novelty closure of 2026-10-02 remains valid.

No admissible new Course-of-Action novelty provider or permanent semantic QL was found.

## Final disposition

```text
semantic breadth:                         CLOSED — NO NEW QL REQUIRED
active semantic QLs:                      8
retired QL007:                            PRESERVED / NOT GENERATABLE
active ordinary authorities:              118
Either authorities:                       4
three-action authorities:                 6
final structured action proof:            CLOSED
ordinary final option/key semantics:      CLOSED
Either final option/key semantics:        CLOSED
three-action final mask/key semantics:    CLOSED
EN/HI/PA semantic carry-through:           CLOSED
CP012 advertised runtime mode:            FIXED / EXECUTABLE
CP012 editorial approval status:          FIXED / TRUTHFUL
CP011 -> CP012 learner content identity:  PRESERVED
Question Bank/Test/Mock eligibility:      ACTIVE
public/student/automatic release:         LOCKED
post-closure deep-audit status:           CLOSED
```

Reopen COA-001 only for a newly evidenced recurring Course-of-Action solve contract not represented by the active QLs, a structured action-validity regression, a final semantic-ID/key regression, a localization/editorial regression, or a separately approved release transition.
