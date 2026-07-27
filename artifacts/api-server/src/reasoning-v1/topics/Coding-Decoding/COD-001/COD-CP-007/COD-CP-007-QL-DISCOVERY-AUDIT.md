# COD-CP-007 — Open QL Discovery Audit

Status: **open; no fixed QL count; no permanent IDs**.

This audit applies the exhaustive discovery rule from `../cod-001-open-ql-discovery-amendment.md`. Candidate contracts may be merged, split, renamed or removed until executable evidence closes every meaningful gap.

---

## 1. Discovery axes

Every candidate is compared across:

1. source-observed exam format;
2. source and output token domains;
3. hidden rule state;
4. task direction;
5. inverse contract;
6. answer type;
7. correctness predicate;
8. position dependence;
9. decimal-wrap semantics;
10. leading-zero semantics;
11. renderer needs;
12. misconception/distractor model;
13. explanation proof obligation;
14. difficulty reach;
15. collision with CP-001 through CP-006, CP-010, OPS, PNC and Series.

A difference in characters alone does not create a QL.

---

## 2. Current candidate matrix

| Candidate prototype family | Candidate directions | Evidence | Collision risk | Current decision |
|---|---|---|---|---|
| uniform modular digit translation | encode, decode, missing token, infer/apply | direct source evidence | whole-number arithmetic; arbitrary substitution | implement first prototype |
| direct digit substitution | encode, decode, missing token | source-pending | CP-001 direct mapping | keep open |
| digit-to-symbol bijection | encode, inverse decode, missing symbol | source-pending | CP-001 symbol mapping; CP-010 table | keep open |
| position-dependent digit translation | encode, decode, missing token | source-pending | CP-004 position shifts | keep open |
| pure digit permutation | encode/decode | weak | CP-005 transposition | presumptive merge/exclude |
| alphanumeric dual-channel transform | encode, decode, missing token | weak/source-pending | CP-003/004/006 composite | keep open |
| mixed-token direct substitution | encode/decode | weak/source-pending | CP-001 direct mapping | presumptive merge unless material difference |

No row is a QL.

---

## 3. First source-proven family audit

### 3.1 Hidden state

```text
rule = uniform decimal translation
parameter = non-zero shift k modulo 10
source = ordered digit string
code = ordered digit string of equal length
```

### 3.2 Candidate task directions

- encode a target digit string;
- decode a coded digit string;
- recover one missing coded digit;
- infer the shift from two or more examples and encode a target;
- choose the only matching complete code.

### 3.3 Provisional merge decision

Encode, infer-and-encode, choose-matching and missing-token presentations may share one rule family but may require distinct task contracts. Inverse decode has a different operation and explanation obligation and remains a separate prototype candidate.

The final merge/split decision waits for executable corpus evidence.

---

## 4. Rule-collision inventory

The uniform translation prototype must be tested against at least:

- identity transformation;
- shift by every other `k`;
- backward instead of forward translation;
- arbitrary direct digit substitution;
- whole-number addition/subtraction;
- reversal;
- fixed position permutation;
- odd/even position shifts;
- indexed shifts;
- digit complement;
- one-position exception;
- source/code length mismatch.

Evidence is accepted only when one canonical rule/parameter fingerprint remains.

---

## 5. Inverse audit

For shift `k`, decoding uses `-k mod 10` and is uniquely invertible.

The inverse prototype must additionally prove:

- a code beginning with zero decodes without losing that zero token;
- wrap is reversed correctly;
- distractors are source digit strings of equal length;
- no alternative shift survives all displayed examples;
- the student-facing explanation applies the inverse, rather than re-encoding guesses.

---

## 6. Edge and ambiguity audit

Required cases:

- no wrap in evidence, wrap in target;
- wrap in evidence and target;
- output starts with zero;
- source starts with zero;
- repeated digits;
- all digits identical;
- missing first digit;
- missing middle digit;
- missing final digit;
- length 3, 4, 5, 6, 7 and 8;
- a single example that admits a whole-number arithmetic competitor and must be rejected;
- repeated examples with no additional information;
- target equal to an evidence source;
- identity shift rejected;
- forward and backward shifts confused;
- code rendered with and without separators;
- leading zero accidentally dropped by serialization;
- target whose output equals the source at some positions due to repeated decimal cycles;
- invalid non-digit token;
- inverse target with multiple apparent guesses but one formal preimage.

---

## 7. Representation audit

Required representations:

- inline source/code pair;
- multi-example target block;
- missing-token display;
- optionally spaced digit tokens when leading zero or token boundaries need emphasis.

The following remain presentation variants rather than QLs:

- quotation style;
- commas versus line breaks between examples;
- spaced versus unspaced digit strings when unambiguous;
- table versus inline display.

---

## 8. Distractor audit

Each generated question should use three different misconception families where possible.

Priority traps:

- wrong direction;
- off-by-one shift;
- missed wrap;
- whole-number addition;
- one unchanged position;
- reversal;
- leading zero removed;
- incorrect inverse;
- adjacent digit at the missing position.

A distractor must be independently evaluated and must not accidentally satisfy any surviving eligible rule.

---

## 9. Explanation audit

The explanation must distinguish digit-wise transformation from whole-number arithmetic.

Required structure:

1. state that each position is transformed independently;
2. infer `k` from a representative example;
3. mention modulo-10 wrap when used;
4. apply the rule to every target digit;
5. reject one actual option-specific trap.

Normalized explanation duplication must be measured across seeds and task directions. Data changes alone are not sufficient authorship variation.

---

## 10. Difficulty reach

The source-proven family must demonstrate:

- Easy: rule stated or obvious from one clean example, no inverse, little collision risk;
- Medium: infer shift from multiple examples, wrap or missing token;
- Hard: inverse or missing-token task with competing rule elimination and leading-zero/wrap interaction.

Magnitude of `k` alone does not determine difficulty.

---

## 11. Source and ownership gap audit

Before checkpoint freeze, answer all of the following:

1. Is direct arbitrary digit substitution recurring in target-exam sources?
2. Is digit-to-symbol coding directly observed, rather than inferred by symmetry?
3. Do position-dependent digit rules recur enough to survive CP-004 collision?
4. Does pure digit permutation add a material solve contract beyond CP-005?
5. Are mixed alphanumeric source strings a recurring exam format?
6. Does dual-channel letter/digit transformation require a new solver or only reuse existing rules?
7. Are any candidate symbol pools visually unsafe or operator-like?
8. Can each retained family produce natural, bounded, unambiguous questions at useful yield?
9. Are encode and inverse directions materially separate?
10. Is any source-backed format still uncovered?

---

## 12. Allocation lock

Until this audit is frozen:

- permanent QL count: **none**;
- next available chapter ID remains `COD-QL-169`, but it is not reserved to any candidate;
- Question Studio discovery: disabled;
- localisation: not started;
- public publishability: false.

---

## 13. Current verdict

Proceed with one checkpoint-local executable prototype family: `UNIFORM_MODULAR_DIGIT_TRANSLATION`.

Do not allocate permanent IDs. Use the prototype to measure generation yield, task-direction merge/split, ambiguity rejection, leading-zero safety, explanation quality and source-format fit before admitting any additional family.
