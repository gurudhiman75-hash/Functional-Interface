# NUM-CP-013 Permanent Allocation and English Freeze

## Checkpoint

`NUM-CP-013 — Positional Bases and Numeral Conversion`

## Authorization basis

Permanent allocation is opened only after exact-head Wave01–04 certification on discovery head:

`3025065dbe9ffbfc3ea6ab1554465fc129a4aa4b`

That certification passed:

- Wave01 exhaustive foundation audit
- Wave01 independent uniqueness audit
- canonical Wave02 V4 edge/representation audit
- canonical Wave02 V4 independent saturation audit
- Wave03 source/edge saturation audit
- Wave03 independent saturation audit
- Wave04 merge/split and ownership closure audit
- API server build

## Permanent authority allocation

| QL | Authority | Permanent solve authority | Source prototypes |
| --- | --- | --- | --- |
| NUM-QL-237 | NUM-CP013-AUTH-001 | Base numeral value and positional-structure projections | P001, P011 |
| NUM-QL-238 | NUM-CP013-AUTH-002 | Conversion to a target non-decimal base | P002, P003, P009 |
| NUM-QL-239 | NUM-CP013-AUTH-003 | Base validity, minimum base and bounded valid-base domain | P004, P010, P012, P018, P022 |
| NUM-QL-240 | NUM-CP013-AUTH-004 | Unknown digit in a base numeral equality | P005 |
| NUM-QL-241 | NUM-CP013-AUTH-005 | Unknown base inverse family and bounded solution topology | P006, P013, P021 |
| NUM-QL-242 | NUM-CP013-AUTH-006 | Addition in a stated base | P007, P019 |
| NUM-QL-243 | NUM-CP013-AUTH-007 | Subtraction in a stated base | P008, P020 |
| NUM-QL-244 | NUM-CP013-AUTH-008 | Multiplication in a stated base | P014 |
| NUM-QL-245 | NUM-CP013-AUTH-009 | Comparison of numerals written in different bases | P015 |
| NUM-QL-246 | NUM-CP013-AUTH-010 | Base-essential remainder and divisibility | P016 |
| NUM-QL-247 | NUM-CP013-AUTH-011 | Terminal digit in a stated non-decimal base | P017 |

The permanent range is therefore **NUM-QL-237..NUM-QL-247** and the next free Number System identity becomes **NUM-QL-248**.

## Merge/split result

The 22 discovery prototypes are retained behind 11 solve authorities. Representation-only variants remain reachable by deterministic source-prototype cycling; they are not discarded during permanent projection.

Important split decisions remain enforced:

- unknown digit is separate from unknown base;
- addition, subtraction and multiplication remain separate state machines;
- cross-base comparison is not collapsed into conversion;
- base-essential remainder remains distinct from ordinary decimal remainder ownership in CP008;
- stated-base terminal digit remains distinct from decimal terminal-digit cycles in CP009;
- Data Sufficiency remains owned by `DSF-001`.

## Permanent source-seed reachability repair

Static freeze review found a source-selection coupling defect before publication gates were opened. The first permanent projection used the same permanent seed both to choose a source prototype and to drive that source prototype's internal `seed % N` mode. For merged authorities, that can trap a retained prototype in only some residue classes even though prototype-level coverage looks green.

Two concrete CP013 losses were identified:

- `NUM-QL-237 / P011`: P011 was selected only on even permanent seeds, so its internal `seed % 4` family reached only mode 0 (place value) and mode 2 (largest n-digit boundary). Mode 1 (number of digits in a base) and mode 3 (smallest n-digit boundary) were unreachable.
- `NUM-QL-241 / P021`: P021 was selected only when the permanent seed was divisible by 3, while P021 also uses `seed % 3`. It therefore reached only mode 0 (`NO_SOLUTION`); `ONE_SOLUTION` and `MULTIPLE_SOLUTIONS` were unreachable.

The permanent projection now deliberately separates the two clocks:

- `sourceIndex = (permanentSeed - 1) % sourcePrototypeCount`
- `sourceSeed = floor((permanentSeed - 1) / sourcePrototypeCount) + 1`

Thus each retained prototype receives source seeds 1, 2, 3, ... on successive visits while the permanent seed continues to control permanent replay and answer-position normalization. Single-source authorities naturally preserve `sourceSeed = permanentSeed`.

The permanent audit now requires internal-mode reachability, not merely prototype identity:

- QL237/P011 → modes 0, 1, 2, 3
- QL238/P009 → modes 0, 1, 2, 3
- QL239/P012 → modes 0, 1, 2
- QL241/P021 → modes 0, 1, 2
- QL245/P015 → modes 0, 1, 2

This repair does not allocate a new QL and does not open any downstream lifecycle gate.

## English runtime contract

`permanent-runtime.ts` projects certified discovery packages into permanent authority packages while preserving:

- exact mathematical state and fingerprint;
- source prototype ancestry;
- explicit permanent seed and resolved source seed;
- source task/representation;
- canonical answer and independent verifier answer;
- four distinct misconception-tagged options;
- deterministic replay;
- concise question-specific English explanation;
- merged-authority source and internal-mode diversity.

Permanent answer position is deliberately normalized by permanent seed so A/B/C/D are all guaranteed rather than left to accidental random coverage.

The English explanation exposes:

1. the governing concept for the concrete generated state;
2. a direct exam strategy;
3. two to four numerical/logical steps using the actual values in that question;
4. the final answer.

It does not expose generator, prototype, fingerprint, lifecycle or authority implementation vocabulary to the learner.

## Certification target

The permanent English audit evaluates **880 packages**: 11 QLs × 80 seeds.

It checks:

- deterministic replay;
- permanent QL and authority identity;
- certified source-prototype reachability;
- prototype-internal mode reachability for every multi-mode source family;
- valid decoupled source-seed progression;
- canonical/verifier equality;
- unique four-option MCQs;
- exact correct-answer binding;
- A/B/C/D position coverage;
- misconception identity on every option;
- mathematical state pool breadth;
- concise learner-facing English explanation;
- locked lifecycle gates.

## Lifecycle after English freeze

This stage freezes permanent English authorities only.

- permanent authority: ON
- English frozen: ON
- Question Studio discoverable: OFF
- Question Bank writable/stored: OFF
- test eligible: OFF
- mock-test eligible: OFF
- public publication: OFF
- automatic student publication: OFF

Hindi/Punjabi localization and shared Question Studio integration are later controlled stages and are not opened by this freeze.
