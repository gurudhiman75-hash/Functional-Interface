# WFM-001 — Final Deep Audit Closure Candidate

Status: **CONVENTIONAL DEEP AUDIT COMPLETE — MERGE BLOCKED BY UNRELATED BASE BUILD**

Date: 2026-09-29

Novelty remains deliberately deferred to the final cross-chapter Reasoning novelty pass.

## Current permanent authority

- chapter: `WFM-001`
- product code: `REAS-WFM`
- permanent QLs: `WFM-QL-001..006`
- checkpoints: `WFM-CP-001..005`
- locales: English, Hindi, Punjabi
- SSC / Punjab four-option delivery
- Banking five-option delivery only where source-backed
- normal Reasoning V1 Question Studio registration: enabled
- raw runtime discovery: disabled
- lifecycle: review-only
- Question Bank/test/mock/public/automatic publication: locked

## Permanent solve contracts

| QL | Contract | Profile |
|---|---|---|
| QL001 | exactly one option can be formed from the full source word | SSC / Punjab |
| QL002 | exactly one option cannot be formed from the full source word | SSC / Punjab |
| QL003 | selected positions → count meaningful words | SSC / Punjab / Banking |
| QL004 | meaningful-word rearrangement | SSC / Punjab |
| QL005 | ordered position extraction without jumbling | Banking |
| QL006 | unique/multiple/none word decision → output letter or explicit X/Y sentinel | Banking |

Renderer-only differences do not create extra QLs.

## Source-gap remediation

### Existing SSC contracts retained

The original QL001..004 contracts remain valid.

A source-backed correctness defect was found in the selected-letter authority:

```text
RECOGNIZE
positions 1,3,6,7
letters R,C,N,I
```

The old authority recorded zero accepted words.

It is corrected to:

```text
acceptedWords: ["CRIN"]
```

This is a source correction inside QL003, not a new QL.

### Banking gap 1 — ordered extraction

Recurring Banking questions require the learner to extract letters from one or more candidate source words in the stated order and identify which option forms a meaningful word **without rearrangement**.

This is now permanent `WFM-QL-005`.

Two renderer variants share the QL:

- one source word + several positions;
- several source words + one position per source word.

### Banking gap 2 — unique / multiple / none output

Recurring Banking questions select letters from a source word and require:

1. determine whether zero, one or multiple governed meaningful words can be formed;
2. if exactly one exists, output a requested letter from that word;
3. otherwise return X/Y according to the convention stated explicitly in the learner stem.

This is permanent `WFM-QL-006`.

Both historical X/Y conventions are supported only when explicitly written in the question.

### Banking QL003 presentation

QL003 remains one semantic contract.

- SSC/Punjab: 4 count options;
- Banking: 5 count options.

No duplicate QL is allocated merely for option-count presentation.

## Ownership exclusions

The audit deliberately did not promote:

- alphabet-position transformation before word formation;
- large positional-arrangement puzzles whose primary burden is arrangement logic;
- dictionary ordering;
- hidden coding rules;
- unrestricted permutation-and-combination counting.

These remain neighboring-family or source-watch items pending stronger recurring ownership evidence.

## Core audit proof

The current WFM core audit independently solves and stress-tests both product surfaces.

### SSC / Punjab

```text
4 QLs × 3 difficulty bands × 80 seeds = 960 generated questions
```

### Banking

```text
3 Banking-backed QLs × 3 difficulty bands × 80 seeds
= 720 generated questions
```

Total:

```text
1,680 generated core-audit questions
```

The proof checks:

- deterministic replay;
- requested difficulty integrity;
- 4-option vs 5-option profile correctness;
- unique displayed options;
- independent answer reconstruction;
- answer-position balance;
- source/fixture diversity;
- visible-surface diversity;
- raw-runtime review locks;
- EN/HI/PA instructional quality;
- both QL004 renderers;
- both QL005 renderer variants;
- both QL006 X/Y sentinel conventions.

## Fatigue-resistance floor

### QL005

The first Banking implementation had only six underlying ordered-extraction fixtures.

Although option shuffling produced many visible surfaces, six semantic data authorities were considered too thin.

The governed pool was doubled to:

```text
12 ordered-extraction fixtures
3 Easy
5 Medium
4 Hard
```

The core audit now requires at least 12 source fixtures.

### QL006

QL006 reuses the selected-letter authority pool with:

```text
13 governed source/position fixtures
unique / multiple / none outcomes
both X/Y conventions
Easy / Medium / Hard coverage
```

## Banking authority defects found and fixed

The audit caught two supposed QL005 distractors that were themselves meaningful words:

- `LOAD`
- `INCH`

Their source positions were corrected so each fixture again has exactly one governed meaningful extraction.

A governed common-extraction guard now rejects those collisions from returning.

## Runtime termination defect found and fixed

QL006 fallback option construction contained a loop whose fallback letter depended on `extras.length`.

If a fallback collided with an existing option, `extras.length` did not advance, so the same colliding letter could be generated forever.

The loop is now a bounded deterministic alphabet scan:

- no unbounded loop;
- enough distinct alternatives or explicit failure;
- deterministic replay preserved.

This was a real production-safety defect caught by the deep audit.

## Normal Question Studio integration

WFM-001 is registered in:

```text
question-studio/engines/reasoning-v1-adapter.ts
```

The current integration proof covers:

```text
6 QLs × 3 difficulty bands × 3 languages × 2 samples
= 108 explicit QL integration cases
```

It also validates:

- package registered exactly once;
- checkpoint scoping CP001..005;
- deterministic replay;
- difficulty selection;
- profile option count;
- review-only lifecycle;
- no canonical Question Bank write;
- no test/mock/public/automatic release;
- Banking mixed selection restricted to QL003/005/006;
- non-Banking access to QL005/006 fails closed;
- unknown selectors fail closed.

The integration wrapper previously hard-coded:

```text
generated.options.length === 4
```

for its validation flag.

That caused correct Banking five-option questions to mark themselves invalid.

It now verifies against the runtime-declared option count.

## Workflow hygiene

The new WFM chapter workflow initially listed its own workflow file in `pull_request.paths`.

The repository CI fanout policy correctly rejected this.

The self-watch entry was removed; the workflow hygiene gate is now green.

## Exact WFM-specific validation

On the audited branch, both substantive WFM gates pass together:

```text
PASS — WFM core/source-gap audit
PASS — normal Question Studio integration
```

Observed current Banking audit profile includes:

- QL003: 240 generated, 219 distinct visible surfaces;
- QL005: 240 generated, 222 distinct visible surfaces, 12 source fixtures;
- QL006: 240 generated, 238 distinct visible surfaces, 13 source fixtures;
- balanced five answer positions;
- both QL005 renderers;
- both QL006 sentinel conventions.

## External build blocker

After both WFM-specific gates pass, the production API build currently fails in unrelated Geography code:

```text
src/knowledge-v1/indian-geography/land-resources/
geo-lnd-001-cp001-003-review-batch-v1.ts
```

The current error is a syntax error:

```text
Expected ")" but found "}"
```

This WFM audit does not modify Geography and does not weaken the production build gate.

The shared all-engine Question Studio registry can also be blocked by unrelated package startup guards; WFM's current integration authority therefore exercises the normal `reasoning-v1` adapter directly while preserving global validation.

## Final disposition

```text
taxonomy / chapter ownership:          CLOSED
permanent QL inventory:                WFM-QL-001..006
conventional SSC coverage:             CLOSED
conventional Banking coverage:         CLOSED
Punjab profile:                        CLOSED
source-backed correctness:             CLOSED
solver / answer integrity:             CLOSED
difficulty integrity:                  CLOSED
distractor / option integrity:         CLOSED
fatigue resistance:                    CLOSED
EN/HI/PA learner surfaces:             CLOSED
normal Question Studio integration:    CLOSED
review lifecycle locks:                PRESERVED
novelty:                               DEFERRED
substantive WFM deep audit:             COMPLETE
production merge validation:           BLOCKED_BY_UNRELATED_GEOGRAPHY_BUILD
```

When the unrelated Geography syntax regression is repaired, rerun the exact merge-head production build. If it passes with the WFM gates unchanged, this closure candidate can be promoted to final closure without reopening content.
