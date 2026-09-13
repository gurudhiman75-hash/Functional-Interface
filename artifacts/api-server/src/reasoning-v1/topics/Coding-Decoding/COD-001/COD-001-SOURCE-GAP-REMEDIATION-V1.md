# COD-001 — Source-Gap Remediation V1

Status: **REOPENED FOR SOURCE-GAP REMEDIATION; PROTOTYPE-ONLY; NO PERMANENT QL CHANGE**

Date: 2026-09-11

This authority records the post-approval audit finding that the existing `COD-QL-001..199` chapter is internally strong but not source-complete against the uploaded SSC/CPO solved-paper corpus.

The previously approved 199 permanent QLs remain unchanged. This remediation does not mutate an approved solve contract, does not allocate a new permanent ID, and does not enable Question Studio, Question Bank conversion, mock-test eligibility or public publication.

## 1. Confirmed source gaps

### 1.1 CP-005 — value-dependent alphabetical rearrangement

SSC CGL 2022 includes the pattern:

```text
BEHOLD -> BDEHLO
INDEED -> DDEEIN
COURSE -> CEORSU
```

The operation is ascending English-alphabet sorting of the letters. This is not one of the existing fixed position permutations in CP-005 and cannot be represented by reusing one source-position order for every word.

Prototype authority:

```text
ALPHABETICAL_ASCENDING_SORT
```

Target owner after approval: `COD-CP-005`.

### 1.2 CP-006 — indexed shifts followed by reversal

SSC CGL 2023 includes:

```text
PLIERS -> MMAFJO
SHOVEL -> FZRLFR
WRENCH -> BXJBPV
```

A source-consistent derivation is:

```text
move positions by -1, -2, -3, ...
then reverse the transformed sequence
```

The existing CP-006 authority contains `REVERSE_THEN_INDEXED_SHIFT`, but these stages do not commute. Therefore the inverse stage order is a genuinely different source-backed solve family.

Prototype authority:

```text
INDEXED_SHIFT_THEN_REVERSE
```

Target owner after approval: `COD-CP-006`.

### 1.3 CP-006 — reversal plus one uniform alphabet shift

SSC CGL 2024 includes:

```text
NAME -> FNBO
NANO -> POBO
NAIL -> MJBO
```

The construction is reversal plus one uniform alphabet movement. Both operations are active, but the current CP-006 registry has no `REVERSE + UNIFORM SHIFT` composition.

Prototype authority:

```text
REVERSE_THEN_UNIFORM_SHIFT
```

Target owner after approval: `COD-CP-006`.

### 1.4 CP-007 — mixed letter/digit output by character class

The earlier CP-007 freeze excluded alphanumeric dual-channel coding for lack of recurring source evidence. The uploaded SSC CPO material disproves that exclusion.

SSC CPO 2019 contains:

```text
HONEY -> G4M2X
STATUE -> RS1S52
```

with vowels coded as `A=1, E=2, I=3, O=4, U=5` and consonants moved one letter backward.

SSC CPO 2018 contains:

```text
CATHODE -> X5GS2W4
RELATION -> I4O5G32M
```

with vowels coded as `A=5, E=4, I=3, O=2, U=1` and consonants replaced by opposite-alphabet partners.

Prototype authority:

```text
MIXED_CLASS_CODE
  - VOWEL_INDEX_CONSONANT_PREVIOUS
  - REVERSE_VOWEL_INDEX_CONSONANT_OPPOSITE
```

Target owner after approval: `COD-CP-007`.

## 2. Architectural correction

CP-006 must no longer be treated as a closed list of hand-named composite recipes. The long-term authority should be a bounded source-backed composition grammar over already proven atomic transformations.

The grammar must still be conservative:

1. a composition is admitted only with recurring exam/source evidence;
2. every stage must materially alter the selected instance;
3. the displayed evidence must reject equal-or-simpler competing rules;
4. stage orders are separate only when they are mathematically and pedagogically distinct;
5. commuting operations are canonicalised rather than duplicated;
6. distractors must represent plausible partial-stage, wrong-order or parameter errors;
7. no mathematically possible composition is admitted merely because the engine can generate it.

V1 implements only the four confirmed source-gap authorities above. It does not open an unrestricted combinatorial generator.

## 3. Executable prototype gate

`remediation/source-gap-prototype.test.ts` must generate:

```text
4 rule authorities x 120 seeds = 480 review-only English questions
```

The gate requires:

- deterministic generation;
- exact reproduction of the audited SSC/CPO source examples;
- two displayed evidence rows per generated question;
- independent candidate reconstruction from displayed evidence;
- exactly one surviving rule/context;
- four unique options and one correct answer;
- all four answer positions reachable for every rule;
- at least 80 visible variants per 120-question rule matrix;
- simple competitive-exam stem language;
- problem-specific step-by-step explanations and visual working;
- no permanent QL ID;
- no Question Studio, Question Bank, mock-test or public eligibility.

The review exporter emits a compact human-readable sample across all four authorities.

## 4. Approval boundary

Existing approved authority remains:

```text
COD-QL-001..199
```

This remediation is deliberately additive and non-permanent until product review.

After prototype review and explicit approval, the next guarded phase may:

1. decide the exact permanent solve-contract split and allocate new IDs after `COD-QL-199`;
2. integrate the approved additions into CP-005/006/007 runtime registries;
3. route them through the shared instance-based difficulty scorer;
4. add Hindi and natural-Punjabi localization with logic parity;
5. extend pedagogy and review exporters;
6. rerun whole-chapter English, multilingual, collision, explanation and publication-safety gates;
7. supersede the old source-complete claim with a new chapter closure authority.

Until that approval occurs, `COD-001` remains unchanged for all currently frozen/publication-disabled surfaces.
