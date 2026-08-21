# NUM-CP-009 — Wave 03 Final Material Gaps

**Checkpoint:** `NUM-CP-009 — Cyclicity, Unit Digit and Terminal Digits`  
**Parent audit:** post-Wave02 source/gap saturation exact-head green  
**Permanent QLs:** 0  
**Next available QL:** `NUM-QL-185`

## Need-based prototypes

15. `NUM-CP009-PROT-015` — non-coprime last-two/last-three terminal blocks with zero creation;
16. `NUM-CP009-PROT-016` — composite terminal condition producing several exponent residue classes;
17. `NUM-CP009-PROT-017` — long repeated-power terminal sum using complete cycle-block aggregation.

The post-Wave02 audit proved these are the only remaining material gaps. Claim/table/DS forms remain adapters or source holds, and factorial last-non-zero work remains at the CP011/CP014 boundary.

## P015 — non-coprime terminal blocks

- includes bases sharing factors with 100/1000;
- covers both last-two and last-three answer semantics;
- explicitly reaches exact `00` and `000` outputs;
- canonical route uses generic repeated squaring modulo the terminal modulus;
- verifier uses direct repeated modular multiplication;
- no multiplicative-order shortcut is assumed when coprimality fails;
- all outputs retain fixed width.

## P016 — multiple exponent classes

- outer base uses a four-position unit-digit cycle;
- terminal condition accepts a stated set of digits rather than one target digit;
- generated conditions contain exactly two or three valid exponent classes modulo 4;
- canonical route maps accepted digits to cycle positions;
- verifier directly checks a complete exponent period;
- answer is the complete class set, not one arbitrary representative.

## P017 — long repeated-power sum

Target form:

`a^1 + a^2 + ... + a^N`

- `N` is large enough that term-by-term learner evaluation is inappropriate;
- canonical route computes one unit-digit cycle, its cycle sum, complete block count and leftover terms;
- verifier directly sums every bounded power modulo 10;
- generation covers cycle lengths 2 and 4;
- generation covers exact whole-cycle blocks and non-zero leftovers.

## Learner presentation

The solution surface stays compact and human:

- state the relevant terminal-cycle/modulus idea;
- show the actual generated values;
- perform the necessary modular/cycle calculation;
- give the answer once.

No generic option-by-option analysis, metadata or quota language is learner-facing.

## Lifecycle

```text
permanentQlId:              null
maturity:                   EXECUTABLE_DISCOVERY_PROOF
reviewStatus:               UNREVIEWED_DISCOVERY_CANDIDATE
questionBankStatus:         NOT_STORED
testEligibility:            INELIGIBLE
active:                     false
questionStudioDiscoverable: false
questionBankWritable:       false
testEligible:               false
publiclyPublishable:        false
```

After Wave 03 exact-head validation, the next gate is final source saturation plus merge/split across all 17 temporary prototypes. Permanent IDs remain forbidden until explicit final authority-count approval.
