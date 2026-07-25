# ANA-CP-005 Manifest Realignment Audit

## Verdict

The original merged runtime was logically correct but did not implement the audited ANA-001 QL allocation. This realignment restores the canonical 20-QL scope without changing permanent QL IDs.

## Contract comparison

| Contract | Previous runtime | Realigned runtime |
|---|---|---|
| QL range | `ANA-QL-141..160` | unchanged |
| QL count | 20 | unchanged |
| task kind | split missing-term/pair names | `singleLetterTransform` |
| solve mode | `ALPHABET_RULE_TRANSFER` | `ALPHABET_RULE` |
| direct mode | `MISSING_FOURTH_TERM` | `DIRECT_COMPLETION` |
| pair mode | `EQUIVALENT_PAIR_SELECTION` | `PAIR_SELECTION` |
| rule ownership | custom ten-family set | audited ten-family set |

Pair-selection QLs use runtime answer type `LETTER_PAIR`, because the selectable payload is a complete pair. The audited manifest labels these as `LETTER`; the implementation normalizes that field without changing the canonical QL, solve mode or presentation ownership.

## QL-by-QL correction

| QLs | Previous family | Canonical family | Action |
|---|---|---|---|
| 141/142 | forward shift | fixed forward shift | narrowed to non-wrap domain |
| 143/144 | backward shift | fixed backward shift | narrowed to non-wrap domain |
| 145/146 | opposite letter | cyclic forward shift | replaced |
| 147/148 | opposite then forward | cyclic backward shift | replaced |
| 149/150 | opposite then backward | opposite letter | reassigned to canonical ID |
| 151/152 | double position | equal positional distance | replaced |
| 153/154 | double minus one | reverse-position transform | replaced |
| 155/156 | half even position | doubled positional movement | replaced |
| 157/158 | rounded half odd position | class correspondence | replaced |
| 159/160 | opposite of double | two-step position transform | replaced |

## Exhaustiveness decision

Within the audited CP-005 boundary, the realigned registry is complete:

- all 10 required single-letter families are present;
- every family has direct-completion and pair-selection QLs;
- fixed and cyclic shifts are separately owned and tested;
- position, reverse-position, class-based and composite two-step treatments are represented;
- multi-letter cluster rules remain outside CP-005.

This is a manifest-completeness claim, not a claim that every imaginable alphabet formula deserves a QL. Additional formulas are admitted only after a future source-backed gap audit shows a distinct exam-relevant contract that does not collapse into an existing family.

## Operational definitions added during implementation

The audited manifest names the families but does not fully specify parameter domains. The runtime therefore records explicit bounded meanings:

- equal distance means equal movement toward the alphabet centre, with evidence from both halves;
- reverse position means opposite letter followed by one fixed non-zero adjustment;
- class correspondence means ordinal vowel/consonant correspondence;
- two-step position means doubling followed by `+1` or `-1`.

These definitions are deterministic, independently solvable, collision-auditable and suitable for four-option generation. Any later change to these meanings requires a manifest amendment rather than a silent runtime edit.

## Global option uniqueness

A distractor is not accepted merely because it is wrong under the intended rule. The complete source-plus-option evidence is checked against every registered CP-005 rule and context. Any distractor that forms another valid alphabet relationship is discarded. This closes the alternative-rule ambiguity that is especially important for equal-distance and reverse-position pair selection.

## Removed families

The discarded half, rounded-half and opposite-of-double rules remain mathematically usable ideas, but they are not owned by the audited CP-005 registry. They should not be reintroduced under existing QL IDs without a chapter-level manifest revision.

## Freeze gate

The realignment becomes merge-ready only after:

1. English runtime audit passes;
2. Hindi/Punjabi parity audit passes;
3. regenerated reviews are inspected;
4. new family wording is accepted;
5. no complete collision, alternative-option rule or equal-or-simpler ambiguity remains.
