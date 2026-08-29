# NUM-CP-009 Permanent Allocation and English Freeze

## Governance decision

The 12-authority final merge/split proposal was explicitly approved after the exact-head green final source saturation gate.

Permanent identities are therefore allocated contiguously from the previously free Number System identity `NUM-QL-185`.

## Permanent authority map

| QL | Permanent authority | Discovery contribution |
| --- | --- | --- |
| `NUM-QL-185` | Unit digit of a single power | P001 |
| `NUM-QL-186` | Unit digit of a short composed power expression | P002 + P003 |
| `NUM-QL-187` | Unit digit of a bounded power tower | P004 |
| `NUM-QL-188` | Unit-digit cycle length | P005 |
| `NUM-QL-189` | Exponent class set from terminal conditions | P006 + P016 |
| `NUM-QL-190` | Bounded exponent count from a terminal condition | P007 |
| `NUM-QL-191` | Last two digits of a power expression | P008 + P009 + P015 last-two slice |
| `NUM-QL-192` | Last three digits of a power expression | P010 + P011 + P015 last-three slice |
| `NUM-QL-193` | Complete bounded exponent set from a terminal condition | P012 |
| `NUM-QL-194` | Terminal-digit feasibility | P013 |
| `NUM-QL-195` | Unit digit with a structured exponent | P014 |
| `NUM-QL-196` | Unit digit of a long repeated-power sum | P017 |

The next free Number System identity is `NUM-QL-197`.

## P015 split rule

P015 is not a standalone authority. It supplies the non-coprime / zero-creation edge regime to two different fixed-width answer contracts:

- P015 `LAST_TWO_DIGITS` states belong only to `NUM-QL-191`.
- P015 `LAST_THREE_DIGITS` states belong only to `NUM-QL-192`.

The permanent runtime resolves these slices deterministically. It does not permit a two-digit authority to emit a three-digit package or vice versa.

## Merged-source seed rule

Source selection and source generation use separate deterministic progressions. This prevents a merged prototype from receiving only one parity or residue class of seeds. In particular, the permanent proof must retain:

- both sum and difference forms from P003;
- both two-class and three-class conditions from P016;
- both `00` and `000` creation through the appropriate P015 slice;
- both exact cycle-block and leftover cases from P017.

## English freeze contract

The permanent English runtime:

- uses package `NUM-002`, checkpoint `NUM-CP-009`;
- preserves source prototype, source ancestry, representation, hidden mathematical state and verifier evidence;
- binds each package to one permanent QL and permanent authority;
- exposes learner-facing English stems/options/explanations only;
- requires canonical answer = verifier answer = keyed option = explanation final answer;
- keeps implementation vocabulary out of learner-facing text;
- keeps all downstream lifecycle gates closed.

## Lifecycle after this gate

```text
maturity:                    PERMANENT_AUTHORITY
reviewStatus:                ENGLISH_FROZEN
permanent QLs:               NUM-QL-185..196
nextAvailableQl:             NUM-QL-197
active:                      false
questionStudioDiscoverable:  false
questionBankWritable:        false
testEligible:                false
publiclyPublishable:         false
```

Hindi/Punjabi localization, Question Studio integration, Question Bank writes, test/mock eligibility and public release remain separate gates.
