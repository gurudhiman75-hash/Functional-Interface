# COD-001 — Source-Gap Final Audit V2

Status: **REMEDIATION CLEARED — FOUR CONTRACTS REVIEW-READY; PERMANENT ID ALLOCATION STILL BLOCKED PENDING EXPLICIT MANIFEST AMENDMENT**

Date: 2026-09-13

Supersedes the remediation-status portion of `COD-001-SOURCE-GAP-FINAL-AUDIT-V1.md`. The V1 ownership, merge/split and task-direction decisions remain authoritative.

## 1. V2 remediation completed

The four production-quality blockers identified by the final audit are now repaired in a separate V2 candidate layer while the original prototype remains intact as a regression oracle.

### 1.1 Instance-derived difficulty — CLEARED

`source-gap-v2.ts` derives difficulty from generated solve state rather than rule identity or seed labels.

The scorer uses:

- target length;
- repeated-letter burden;
- displayed-evidence length burden;
- alphabet wraparound count;
- composition burden;
- indexed-shift base complexity;
- uniform-shift magnitude;
- mixed vowel/consonant class-switch burden.

The 960-question V2 gate requires every retained rule authority to reach at least two genuine difficulty bands. A rule cannot remain permanently labelled Medium or Hard merely because of its family name.

### 1.2 Governed vocabulary and fatigue resistance — CLEARED

The 32-word prototype pool is no longer the production candidate source.

`source-gap-word-pool.en.ts` provides a governed exam-neutral pool of at least 180 unique uppercase words spanning short through long targets. The V2 gate enforces:

- pool uniqueness;
- at least 180 available words;
- short and long length coverage;
- at least 90 distinct targets per rule in the 240-seed matrix;
- at least 180 distinct evidence pairs per rule;
- rolling 24-question windows with at least 16 distinct targets;
- rolling 24-question windows with at least 20 distinct evidence pairs;
- both vowel and consonant channels visibly exercised in every mixed-class source/evidence word.

### 1.3 Beginner-first explanations — CLEARED

The V2 explanation contract contains only:

- a concise inferred rule;
- explicit transformation steps;
- compact visual working;
- an optional caution only where a concrete misconception warrants it.

`examShortcut` and `commonTrap` are not mandatory or present in the V2 explanation contract. Intermediate transformations remain visible for multi-stage rules.

### 1.4 Distractor provenance / arbitrary fallback — CLEARED

V2 has no generic one-token mutation fallback.

Every emitted wrong option comes from an explicit misconception provenance, including:

- descending instead of ascending sort;
- source reversal instead of sorting;
- rotated sorted sequence;
- wrong stage order;
- wrong indexed direction;
- wrong indexed base;
- omission of reversal;
- reversal only;
- uniform shift only;
- opposite shift direction;
- wrong shift magnitude;
- wrong mixed-class mapping;
- vowels left unchanged;
- consonants left unchanged;
- opposite-alphabet mapping applied to all letters.

Generation rejects an instance if three distinct misconception-grounded distractors cannot be formed. `arbitraryFallbackUsed` is permanently false in the V2 candidate metadata.

## 2. Executable proof

On PR #1650 head `2fbcbcb9d5e25f83460dcb205fb149b7c89d0d87`:

- original 480-question source-gap prototype regression — **PASS**;
- 960-question V2 quality and fatigue gate — **PASS**;
- COD-001 Runtime — **PASS**;
- COD-001 English Closure — **PASS**;
- COD-001 Multilingual Closure — **PASS**;
- COD-001 Translational Locales — **PASS**;
- COD-001 CP-008 Adapted Locales — **PASS**;
- COD-001 CP-009 Adapted Locales — **PASS**;
- COD-001 Pedagogical Quality — **PASS**;
- workflow CI hygiene — **PASS**;
- pull-request branch topology guard — **PASS**;
- Render production build — **PASS**.

The source-gap remediation therefore introduces no regression into the current `COD-QL-001..199` authority.

## 3. Final solve-contract split

Exactly four candidate permanent solve contracts survive:

1. `COD-CP-005` — infer alphabetical ascending sort and encode the target word;
2. `COD-CP-006` — infer indexed alphabet shifts followed by reversal and encode the target word;
3. `COD-CP-006` — infer reversal followed by one uniform alphabet shift and encode the target word;
4. `COD-CP-007` — infer mixed vowel/consonant class coding and encode the target word.

The two source-backed mixed-class mappings remain generated contexts of contract 4, not separate QLs.

The current source evidence does not authorize inverse decode, missing-token recovery, explicit-rule forward application, rule naming or template multiplication into extra permanent identities.

## 4. Lifecycle / identity boundary

The remediation HOLD is lifted, but permanent allocation is still a separate governance action.

Until an explicit manifest amendment is approved:

- stable permanent COD range remains `COD-QL-001..199`;
- `COD-QL-200..203` are **not yet allocated**;
- the V2 source-gap contracts remain review-only candidate authorities;
- Question Studio discovery remains disabled for these candidates;
- Question Bank writes remain disabled;
- mock/test eligibility remains disabled;
- public publication remains disabled.

The next valid COD-001 action is a versioned manifest amendment that explicitly approves these four solve contracts and allocates four sequential permanent IDs. No further source-gap quality remediation is required before that governance step unless new evidence or review uncovers a defect.
