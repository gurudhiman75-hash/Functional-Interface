# ANA-CP-006 Implementation Report

Status: **source-complete; checked-out execution and editorial review pending**.

## 1. Implemented scope

- Checkpoint: `ANA-CP-006`
- Revised permanent range: `ANA-QL-161..ANA-QL-208`
- QL count: 48
- Rule families: 24
- Presentation modes: direct completion and pair selection
- Task kind: `letterClusterTransform`
- Solve mode: `CLUSTER_RULE`
- Renderer: `STRUCTURED_TEXT`
- Locales: English, Hindi and Punjabi
- Publication state: disabled
- Runtime maturity: `RUNTIME_PROOF`

The checkpoint expansion and later-Ql shifts are governed by `ANA-001-MANIFEST-AMENDMENT-CP006.md`.

## 2. Implemented rule families

1. uniform forward shift;
2. uniform backward shift;
3. fixed positional shift vector;
4. alternating-sign shift;
5. increasing shift;
6. decreasing shift;
7. full reversal;
8. adjacent-pair exchange;
9. first/last exchange;
10. left rotation;
11. right rotation;
12. opposite-letter substitution;
13. odd-position transform;
14. even-position transform;
15. reverse then positional shift;
16. positional shift then reverse;
17. named-position deletion;
18. derived-letter insertion;
19. alphabet-neighbour expansion;
20. whitelisted two-stage composition;
21. outer-block exchange;
22. reverse each half/outer block;
23. parity-based regrouping;
24. alphabetical ascending/descending ordering.

## 3. Source-backed corrections

The original unimplemented 40-QL manifest omitted four recurring SSC/RRB/DSSSB families. The implementation now owns fixtures equivalent to:

- `GLIDERS → ERSDGLI` — outer-block exchange;
- `ACTION → TCANOI` — reverse each half;
- `THUNDER → UHTNRED` — reverse equal outer blocks around the centre;
- `ABSORPTION → ROSBANOITP` — reverse each half;
- `NUMERAL → UEALRMN` — parity regrouping;
- `INTEX → EINTX` and `FLORA → AFLOR` — alphabetic ordering;
- `JAUNDICE → AJNUIDEC` and `TRAMPOLINE → RTMAOPILEN` — adjacent-pair exchange.

The audit also asserts that reverse-then-shift and shift-then-reverse produce different outputs under the same non-palindromic position vector.

## 4. Runtime protections

Every accepted question requires:

- deterministic generation for QL and seed;
- a total rule application that returns `null` outside its domain;
- independent solver agreement for source and target;
- exact context transfer;
- no equal-or-simpler competing registered rule;
- four unique options;
- exactly one intended answer;
- every distractor rejected against the complete rule pool;
- a machine-readable distractor error label;
- a trap note derived from the selected distractor;
- balanced deterministic answer placement;
- no internal `CLUSTER_*` identifier in candidate-facing text.

## 5. Collision controls

Implemented controls include:

- general positional vectors cannot use the named simple vector patterns;
- left/right rotation counts are bounded to prevent duplicate direction contexts;
- reverse/shift composite families use non-palindromic position vectors;
- structural outputs are checked against all registered families over both evidence pairs;
- first/last exchange on three-letter clusters is rejected by ambiguity checking because it collapses to full reversal;
- length-changing rules have explicit output-length contracts;
- the mixed family uses only a finite whitelist of named two-stage profiles.

## 6. Localization

Hindi and Punjabi preserve Latin cluster values, options, answer index, context and difficulty exactly.

Localized content includes:

- instructions and table headings;
- all 24 rule statements;
- source and target demonstrations;
- conclusions;
- translation of the actual selected trap note.

Punjabi terminology uses `ਅੱਖਰ-ਸਮੂਹ`, `ਥਾਂ`, `ਕ੍ਰਮ`, `ਟਾਂਕ ਥਾਵਾਂ` and `ਜਿਸਤ ਥਾਵਾਂ`. The deprecated word `ਪਦ` is prohibited by the localized audit.

## 7. Committed audits

### English runtime audit

Current first-pass volume:

- 48 QLs;
- 40 seeds per QL;
- 1,920 generated English questions;
- repeat generation for determinism, effectively 3,840 generator calls.

It verifies:

- registry continuity and exact family order;
- source-backed fixtures;
- representative cross-family fingerprint collisions;
- independent solver parity;
- full-pool ambiguity acceptance;
- option uniqueness and answer correctness;
- output-length contracts;
- all layouts and difficulty bands;
- exact answer-position balance;
- minimum visible stem variety;
- no internal IDs in explanations.

### Localized runtime audit

Current first-pass volume:

- 48 QLs;
- 20 seeds per QL;
- 2 locales;
- 1,920 localized questions;
- repeat generation for localization determinism.

It verifies structural parity, answer parity, scripts, localized trap notes, terminology restrictions, all layouts, all difficulty bands and exact answer-position balance.

After the first checked-out execution is green, the intended stress expansion is:

- English: 100 seeds per QL = 4,800 questions;
- localized: 50 seeds per QL per locale = 4,800 questions.

## 8. Review exports

The exporters produce:

```text
ana-cp-006-runtime-review.md
ana-cp-006-hindi-runtime-review.md
ana-cp-006-punjabi-runtime-review.md
```

Review volume:

- English: 6 samples × 48 QLs = 288;
- Hindi: 4 samples × 48 QLs = 192;
- Punjabi: 4 samples × 48 QLs = 192.

Every sample includes stem, options, answer, rule statement, source proof, target application, conclusion and selected trap note.

## 9. Files implemented

- `question-language.en.ts`
- `rule-definitions.ts`
- `independent-solver.ts`
- `ambiguity-checker.ts`
- `option-validator.ts`
- `generator.ts`
- `task-registry.ts`
- `localized-runtime.ts`
- `ana-cp-006.test.ts`
- `ana-cp-006-localized.test.ts`
- `export-review.ts`
- `export-localized-review.ts`
- `ana-cp-006-coverage-audit.md`
- `ana-cp-006-implementation-plan.md`
- `ana-cp-006-implementation-report.md`

## 10. Execution commands

```powershell
pnpm dlx tsx .\artifacts\api-server\src\reasoning-v1\topics\Analogy\ANA-001\ANA-CP-006\ana-cp-006.test.ts

pnpm dlx tsx .\artifacts\api-server\src\reasoning-v1\topics\Analogy\ANA-001\ANA-CP-006\ana-cp-006-localized.test.ts

pnpm dlx tsx .\artifacts\api-server\src\reasoning-v1\topics\Analogy\ANA-001\ANA-CP-006\export-review.ts

pnpm dlx tsx .\artifacts\api-server\src\reasoning-v1\topics\Analogy\ANA-001\ANA-CP-006\export-localized-review.ts
```

## 11. Current limitations and honesty note

The connector environment could not clone or execute the repository because outbound DNS access was unavailable. Therefore:

- source implementation is complete;
- audit code is committed;
- no claim is made that either audit has passed;
- no review file has yet been generated from this branch;
- no Question Studio or chapter discovery integration has been enabled.

## 12. Merge gate

Do not merge or expose CP-006 until:

1. English audit passes;
2. Hindi/Punjabi audit passes;
3. all three review files are generated and inspected;
4. any collision/domain failure is repaired;
5. editorial review accepts the new block, parity and sort families;
6. the stress ranges are raised and pass;
7. user explicitly approves merge.
