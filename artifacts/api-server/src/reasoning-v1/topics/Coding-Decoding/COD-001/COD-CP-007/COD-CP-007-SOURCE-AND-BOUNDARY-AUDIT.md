# COD-CP-007 — Source and Boundary Audit

Status: **open English discovery; no permanent QLs; no fixed count**.

Authority order:

1. `../../../../REASONING-V1-MASTER-BLUEPRINT.md`;
2. `../../../../REASONING-V1-ARCHITECTURE.md`;
3. `../cod-001-open-ql-discovery-amendment.md`;
4. this source and boundary audit;
5. the checkpoint end-to-end design and executable discovery audits.

The old manifest reservation of exactly 24 QLs and `COD-QL-169..192` is revoked by the open-discovery amendment. The checkpoint scope remains **digit, symbol and alphanumeric coding**, but its final contracts and count must be discovered exhaustively.

---

## 1. Sources inspected

The current pass inspected:

- the uploaded competitive-reasoning book `reasoning_aggarwal.pdf`, especially its Coding–Decoding chapter;
- the merged COD-001 source audit, chapter manifest and open-discovery amendment;
- the stable CP-001 through CP-006 runtime and editorial lessons;
- the final CP-009 ownership freeze, which explicitly delegates digit/symbol/alphanumeric coding to CP-007.

The uploaded book separates number coding, letter coding, symbol coding, substitution coding, sentence coding and conditional coding. That separation is useful for ownership, but the book does not automatically prove that every formally symmetric digit/symbol variant deserves its own QL.

---

## 2. Directly observed source formats

### 2.1 Uniform per-digit transformation

The clearest direct CP-007 example is:

```text
35674 → 57896
4213  → ?
```

The intended operation is a position-preserving translation of every digit by the same amount. This directly supports a **uniform digit transformation** prototype with decimal wrap handled as a string operation, not whole-number arithmetic.

### 2.2 Direct character-to-symbol coding

The source also contains fixed character-to-symbol examples such as a word being represented by symbols. That format is already implemented under `COD-CP-001` when the source domain is letters or words. It does not by itself prove a new CP-007 QL.

A CP-007 direct symbol contract requires the **source domain itself** to be digits, symbols or mixed alphanumeric tokens, or it must introduce a materially different solver/answer obligation.

### 2.3 Unconditional mapping tables

The source contains unconditional lookup tables for letters and numeric codes. Letter lookup is already covered by CP-001. Conditional lookup tables are owned by CP-010.

An unconditional digit-to-symbol table may remain a CP-007 prototype candidate, but it requires recurring direct exam evidence before freeze.

### 2.4 Conditional mixed coding

The source includes mixtures of letters, digits and symbols controlled by endpoint or vowel/consonant conditions. Those belong to `COD-CP-010`, not CP-007.

### 2.5 Letter-to-number and aggregate coding

The source has many word-to-number questions based on direct substitution, alphabet ranks, sums, odd/even rank values and other aggregates. These are already owned by CP-001 and CP-002.

### 2.6 Code-formation counting

Questions asking how many alphanumeric codes can be formed belong to Permutation and Combination, not Coding–Decoding. CP-007 must infer or apply a coding rule; it must not count possible codes.

---

## 3. Ownership matrix

| Format | Owner | CP-007 decision |
|---|---|---|
| letter/word → fixed digit or symbol | COD-CP-001 | exclude duplicate |
| alphabet-position or word aggregate number code | COD-CP-002 | exclude duplicate |
| letter shift/opposite-alphabet rule | COD-CP-003 | exclude duplicate |
| position/class-dependent letter transform | COD-CP-004 | exclude duplicate |
| pure position permutation over letters | COD-CP-005 | exclude duplicate |
| composite multi-stage word transform | COD-CP-006 | exclude duplicate |
| digit/symbol/mixed-token coding with material decimal or token semantics | COD-CP-007 | include candidate |
| renamed objects, roles or referents | COD-CP-008 | exclude |
| sentence/artificial-language constraints | COD-CP-009 | exclude |
| conditional lookup/override table | COD-CP-010 | exclude |
| operator or relation substitution | OPS-001 | exclude |
| count possible codes | PNC-001 | exclude |
| uncoded number/letter series | Series or Missing Number | exclude |
| input-output machine sequence | Input-Output | exclude |

---

## 4. Current source-evidence ledger

| Candidate family | Evidence strength | Current disposition |
|---|---|---|
| uniform modular digit translation | direct recurring-format evidence | retain first executable prototype |
| inverse uniform digit translation | formal inverse of a source-backed bijection | retain prototype candidate |
| missing digit under uniform translation | standard presentation extension | prototype before deciding |
| arbitrary digit-to-digit substitution | insufficient direct evidence in current pass | keep open; do not allocate |
| digit-to-symbol bijection | insufficient direct recurring evidence | keep open; do not allocate |
| symbol-to-digit inverse | dependent on digit-to-symbol evidence | keep open |
| position-dependent digit transformation | plausible but not yet directly frozen | prototype only after source confirmation |
| digit permutation | major collision risk with CP-005 | presumptively merge/exclude unless numeric semantics are material |
| alphanumeric dual-channel transform | checkpoint-labelled but weak direct evidence | keep open; require source confirmation |
| mixed alphanumeric arbitrary token mapping | possible collision with CP-001 direct mapping | retain only if mixed-domain semantics are material |

No family count is frozen by this table.

---

## 5. Boundary rules

A CP-007 contract survives only when all of the following hold:

1. the source or code domain contains digits, symbols or mixed alphanumeric tokens in a way that changes the student operation;
2. the rule is not merely an existing letter-domain QL with cosmetic characters substituted;
3. the question is not a counting problem, number series, operator substitution or conditional-table problem;
4. the code is treated as an ordered token string, preserving leading zeroes;
5. encode and inverse decode semantics are formally validated;
6. enough evidence is displayed to reject equal-or-simpler competing rules;
7. the source format recurs or has strong independent corroboration.

---

## 6. Source gaps still open

The next source pass must specifically search for recurring exam examples of:

- digit strings coded by arbitrary digit substitutions;
- digits coded as symbols and inverse symbol decoding;
- position-dependent digit shifts or complements;
- mixed letter-digit source strings transformed into mixed output;
- alphanumeric token maps whose reasoning cannot be absorbed by CP-001, CP-004, CP-005 or CP-006.

Formal symmetry alone is not enough to admit a QL.

---

## 7. Current verdict

The checkpoint is justified, but only one family is directly source-proven at present: **uniform position-preserving digit transformation**.

All other old-manifest families remain discovery candidates. The design may prototype them with non-permanent IDs, but permanent allocation is forbidden until source, collision, inverse, edge, renderer and merge/split audits pass.
