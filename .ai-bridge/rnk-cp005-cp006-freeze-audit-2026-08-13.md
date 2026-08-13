# RNK CP-005 / CP-006 English Freeze Audit — 2026-08-13

## Decision

- **RNK-CP-005:** `EDITORIAL_FREEZE_APPROVED / READY_TO_BIND`
- **RNK-CP-006:** `EDITORIAL_FREEZE_APPROVED / READY_TO_BIND`
- **Canonical runtime bind:** `PENDING_SOURCE_SYNC`
- **Question Studio / Question Bank / tests / public publication:** remain disabled until the canonical RNK source is present on `New-main` and its runtime gates are rerun.

This audit records the human/editorial freeze decision. It does **not** claim that permanent QL IDs have already been written into runtime source, because the current `New-main` reasoning tree does not contain the latest RNK CP-005/CP-006 implementation files.

## Source candidates reviewed

### RNK-CP-005

- Artifact: `RNK-CP-005-PERMANENT-RUNTIME-CANDIDATE-REVIEW-36Q.md`
- Candidate authorities: 3
- Candidate questions: 576
- Questions per authority: 192
- Manual review sample: 36, 12 per authority
- Review answer positions: 9 / 9 / 9 / 9
- Candidate projection SHA-256: `c45517d1d8bf4283d38eb4b62d1c9e2f90c5ec58593e2c400a59b2a26fb6e71e`

### RNK-CP-006

- Artifact: `RNK-CP-006-PRODUCTION-CANDIDATE-REVIEW-36Q.md`
- Candidate authorities: 3
- Candidate questions: 576
- Questions per authority: 192
- Manual review sample: 36, 12 per authority
- Review answer positions: 9 / 9 / 9 / 9
- Candidate projection SHA-256: `3b26204b7137910d3247af37c75934680ea34cd86b5f342b55de2012e057fd00`

## Approved permanent identity mapping

These identities are **approved/reserved for binding** once the canonical RNK source is synced. They are not yet claimed as runtime-allocated.

| QL | Authority | Checkpoint |
|---|---|---|
| `RNK-QL-036` | `RELATION_TRUTH_STATUS` | RNK-CP-005 |
| `RNK-QL-037` | `POSSIBLE_RANK_BOUND` | RNK-CP-005 |
| `RNK-QL-038` | `EXACT_RANK_DETERMINACY` | RNK-CP-005 |
| `RNK-QL-039` | `EQUALITY_AWARE_PAIR_RELATION` | RNK-CP-006 |
| `RNK-QL-040` | `EQUALITY_AWARE_ENDPOINT` | RNK-CP-006 |
| `RNK-QL-041` | `COMPLETE_WEAK_ORDER` | RNK-CP-006 |

## CP-005 audit result

### Logic and answer safety — PASS

The 36-question final review pack was checked across all three consolidated authorities:

1. `RELATION_TRUTH_STATUS`
   - MUST questions use forced transitive relations.
   - COULD questions include valid witnesses.
   - CANNOT questions contradict forced order constraints.
   - pair-direction questions distinguish first-above, second-above and indeterminate relations correctly.
   - indeterminate questions provide valid counter-witness rankings in opposite orientations.

2. `POSSIBLE_RANK_BOUND`
   - highest-possible ranks agree with compulsory predecessor counts and valid placement witnesses.
   - lowest-possible ranks agree with compulsory successor counts and valid placement witnesses.
   - no bound is presented as an exact rank unless it is actually forced.

3. `EXACT_RANK_DETERMINACY`
   - definite-rank questions have the same target rank in all valid rankings.
   - indeterminate-rank questions provide at least two valid rankings with different target ranks.

No wrong key, invalid witness, duplicated option, or multi-answer defect was found in the final 36-question pack.

### Exam readiness — PASS

- Natural merit-list, shortlist, race, score and performance contexts.
- Partial-order topologies are meaningfully varied rather than being renamed total-order chains.
- `must / could / cannot`, possible-rank bounds and determinacy are distinct reasoning tasks.
- Distractors are tied to actual logical errors: forced-vs-possible confusion, reversed relation, impossible rank and forced exact-rank assumptions.
- 9/9/9/9 answer-position balance avoids obvious key leakage in the review sample.

### CP-005 freeze decision

`APPROVE` — bind the three consolidated authorities to `RNK-QL-036..038` after source sync and rerun the permanent runtime gates.

## CP-006 audit result

### Logic and answer safety — PASS

All 36 equality-aware review questions were checked across:

1. `EQUALITY_AWARE_PAIR_RELATION`
2. `EQUALITY_AWARE_ENDPOINT`
3. `COMPLETE_WEAK_ORDER`

The equality relation is not decorative in the sampled questions. It acts as a bridge between comparison fragments; removing it breaks the decisive inference, global endpoint determination, or complete weak-order reconstruction.

The pair questions correctly avoid direct equality lookup as the answer. Endpoint questions use equality to connect otherwise separate chains. Complete weak-order questions preserve the equality class and use distractors that model split-tie, false-equality and strict-order mistakes.

No question asks for a numerical rank after a tie, so the candidate does not silently impose dense ranking, competition ranking, modified competition ranking, or another unstated post-tie rank convention.

No wrong key, invalid weak order, duplicate option, or multi-answer defect was found in the 36-question review pack.

### Exam readiness — PASS

- Height, scores, speed, seniority and performance contexts are natural and semantically consistent.
- Equality wording is explicit (`equally tall`, `equal marks`, `same time`, `same seniority level`, `same performance level`).
- Medium/Hard labels broadly follow proof length and entity count.
- The three authorities have distinct answer semantics and proof scopes: pair relation, global endpoint, and full weak order.
- Complete-order distractors are materially different, not simple noun substitutions.

### Minor non-blocking note

The complete weak-order explanations use a deliberately compact repeated shell. It is acceptable for freeze because it correctly exposes the tie class and final order, but future learner-facing enrichment could vary the explanation phrasing without changing the authority.

### CP-006 freeze decision

`APPROVE` — bind the three authorities to `RNK-QL-039..041` after source sync and rerun the permanent runtime gates.

## Governance cleanup required before binding

Older August 8 CP-005 shared-set review packs used `RNK-QL-036..043` as provisional review labels for a superseded design. Those labels must be treated as **non-canonical historical review IDs**. They must not reserve or own permanent runtime identities.

Before binding the new authorities:

1. search the synced RNK source for historical/provisional references to `RNK-QL-036..043`;
2. ensure none are active runtime identities;
3. bind only the six approved authorities above;
4. regenerate QL/authority counts and confirm exactly 192 questions per bound authority;
5. pin the candidate projections or regenerate and explicitly record any intentional hash change;
6. rerun answer-key, uniqueness/determinacy, witness, duplicate, answer-position and explanation gates;
7. keep persistence, Question Bank, mock-test eligibility and public publication disabled until separately approved.

## Repository status at audit time

The connected `New-main` tree was checked before this decision was recorded. The current `artifacts/api-server/src/reasoning-v1/topics` tree does not expose the latest Rank & Order CP-005/CP-006 implementation source. Therefore this commit records the editorial decision only; it intentionally does not fabricate runtime files or claim a source-level freeze that cannot be verified.

## Final status

```text
RNK-CP-004  FROZEN              RNK-QL-027..035
RNK-CP-005  FREEZE APPROVED     RNK-QL-036..038 READY_TO_BIND
RNK-CP-006  FREEZE APPROVED     RNK-QL-039..041 READY_TO_BIND
Runtime bind                  PENDING_SOURCE_SYNC
Product activation            BLOCKED / unchanged
```
