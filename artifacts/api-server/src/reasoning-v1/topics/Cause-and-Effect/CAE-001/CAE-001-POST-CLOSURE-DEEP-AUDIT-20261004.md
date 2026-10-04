# CAE-001 — Post-Closure Deep Audit

Status: **CLOSED — POST-CLOSURE GRAPH-TO-QUESTION-STUDIO AND CURRENT-STATE REMEDIATION COMPLETE**

Date: 2026-10-04

Supersedes as current-head authority:
`CAE-001-FINAL-DEEP-AUDIT-CLOSURE-20260929.md`

The September closure remains historical evidence. This authority records defects found only after re-auditing the already-frozen graph-first runtime and its live Question Studio contract.

## Scope

- chapter: `CAE-001`
- permanent QLs: `CAE-QL-001..CAE-QL-009`
- current state: `SOURCE_SATURATED_CONTENT_FROZEN`
- languages: English / Hindi / Punjabi
- source-profile families: Bank five-relation, Punjab four-relation, SSC direct recognition
- Matrix/Games/Tournament: out of scope
- no new permanent QL required

## Answer architecture

CAE-001 already had a genuinely independent graph solver.

`causal-solver.ts` derives causal relationship from canonical graph structure, including:

- direct edge direction;
- indirect causal path;
- common cause;
- independent causes/effects;
- no causal link.

Chronology or wording alone is not promoted into causation.

The post-closure audit therefore did not replace the semantic solver. It hardened the final learner-surface and Question Studio mapping boundary.

## Material defects found

### 1. Graph truth was not explicitly re-proved after Question Studio mapping

New authority:

`CAE_001_FINAL_GRAPH_TO_QUESTION_STUDIO_MAPPING_PROOF_2026_10_04`

The final guard now fails closed unless:

- learner options match semantic option metadata one-for-one;
- exactly one graph-proved option is correct;
- `correctIndex` points to that option;
- `answerId` matches the graph-proved option ID;
- Question Studio preserves option order/content;
- mapped `correctIndex` / `correct`, answer text and canonical answer remain aligned;
- `causalStateId`, `itemVariantId` and `answerId` survive adapter mapping unchanged.

Mutation tests deliberately corrupt the final key and mapped answer identity and require rejection.

### 2. Current frozen QLs were still exposed as “provisional” in live package metadata

Historical source/projection authorities still correctly retain:

`PROVISIONAL_PENDING_SOURCE_SATURATION`

because that was their state when authored.

The current chapter manifest, however, is already:

`SOURCE_SATURATED_CONTENT_FROZEN`

The live Question Studio package now truthfully reports:

- permanent QL count: **9**
- current provisional QL count: **0**
- historical provisional QL count: **9**

Historical provenance is preserved explicitly instead of being presented as current chapter status.

### 3. Standard Banking adapter over-applied FIVE_WAY

The first post-closure gate reproduced a real bug: every Banking request was forced to `FIVE_WAY`.

That made valid requests such as `CAE-QL-003` fail because the projection authority supports only four-way presentation.

Remediation:

- profile selection is now QL-aware;
- unsupported five-way QLs fall back to their approved four-way form rather than failing.

### 4. Historical QL007 five-way flag exceeded the current reviewed runtime contract

The historical projection authority lists QL007 as four/five-way, but the current reviewed correlation renderer is four-option only.

Current reviewed source-profile evidence supports five-way relation presentation for QL001 and QL002.

The live standard adapter therefore now declares:

- current five-way QLs: **QL001, QL002**
- QL003..QL009: current four-way fallback for Banking requests
- historical projection five-way flags remain preserved as provenance.

This prevents a historical capability marker from becoming a false current product claim.

## Post-closure executable proof

New gate:

`cae-001-post-closure-audit-20261004.test.ts`

Observed coverage:

- direct four-way surfaces: **2,592**
- direct five-way surfaces: **192**
- standard adapter surfaces: **162**
- reviewed source-profile surfaces: **411**
- total audited surfaces: **3,357**
- all relevant answer positions exercised
- EN/HI/PA
- all nine permanent QLs

Semantic digest:

`9154aa1de69678a66ddbf7ab57e86694c6cade87db942d8612e3a346c3a2d696`

## Existing chapter QA preserved

The post-closure pass keeps the full existing final-QA stack intact.

On the substantive post-closure head, the following passed:

- frozen V3 regression
- new post-closure graph/mapping audit
- saturation wave 1
- saturation wave 2
- saturation wave 4
- candidate-heavy saturation
- CP007 Wave 4 regression
- CP008 Wave 3 regression
- CP009 Wave 3 regression
- reviewed saturation sampling
- reviewed final QA
- **45,000-question semantic saturation audit**
- semantic-audit artifact generation
- final review-pack materialization/upload
- standard CAE/BLR Question Studio route test
- production API build
- production admin app build

## Exact substantive-head validation

Substantive code head:

`ca47888a0a64429355547462c4383e7dfb0e8a68`

Workflow:

`CAE-001 Final QA` — run **#305**

Result: **SUCCESS**

The standard CAE/BLR Question Studio route workflow also passed on the same current contract.

Shared Reasoning current-head status, global reconciliation, branch topology and CI hygiene were green during the post-closure pass.

## Lifecycle

CAE-001 remains review-only:

```text
Question Studio visible:          true
Question Bank writable:           false
test eligible:                    false
mock eligible:                    false
public/student delivery:          false
automatic publication:            false
manual approval required:         true
```

This audit does not authorize learner release.

## Final disposition

```text
semantic QL breadth:                       CLOSED — 9 PERMANENT QLS
graph-first causal solver:                 CLOSED / INDEPENDENT
final learner option integrity:            CLOSED — FAIL_CLOSED
Question Studio mapping integrity:         CLOSED — FAIL_CLOSED
current QL freeze state:                   RECONCILED
historical provisional provenance:         PRESERVED
current five-way scope:                    QL001 + QL002
Banking fallback for QL003..009:           FOUR_WAY
EN/HI/PA:                                  CLOSED
45k semantic saturation:                   PASS
production API:                            PASS
production admin app:                      PASS
Question Bank/test/mock/public release:    LOCKED
post-closure deep-audit status:            CLOSED
```

Reopen CAE-001 only for a newly evidenced recurring causal learner operation not representable by the nine frozen QLs, a graph/answer regression, a source-profile capability regression, an editorial/localization regression, a permanent audit-gate failure, or a separately approved release transition.
