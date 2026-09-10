# Quant V4 Number System SSC PYQ Normalization — Wave 2 P2

**Authority:** `QUANT-V4-NUMBER-SYSTEM-SSC-PYQ-NORMALIZATION-WAVE2-P2`

**Source inspected:** `SSC Mathematics Previous Year Solved Paper Number System [sscstudy.com].pdf` from the Examtree project Library.

## Purpose

Wave 2 broadens the Number System evidence sample without pretending the secondary collection is an official-paper corpus. It also follows the Wave-1 provenance correction that reassigned one item to CHSL and one to CGL Tier-II.

All six new observations remain `VERIFIED_PYQ_COLLECTION`. Exact dates, shifts and official paper IDs are unresolved, so no empirical CP/QL, difficulty or representation weights are promoted.

## New observations

| ID | Source attribution | Collection locator | V4 owner | Independent mathematical check |
| --- | --- | --- | --- | --- |
| `NUM-SSC-W2-001` | SSC CGL Tier-I 2011 | Q29 | `NUM-CP-001` | for odd `a,b`, `a+b+2ab` is even |
| `NUM-SSC-W2-002` | SSC CGL Tier-I 2010 | Section I Q13 | `NUM-CP-002` | `15/16` is less than `19/20`, `24/25` and `34/35` by exact cross-multiplication |
| `NUM-SSC-W2-003` | SSC CHSL 2016 | Section III Q1 | `NUM-CP-002` | recurring `0.3939... = 39/99 = 13/33` |
| `NUM-SSC-W2-004` | SSC CHSL DEO 2014 | Section II Q15 | `NUM-CP-004` | primes strictly between 80 and 90 are 83 and 89; product `7387` |
| `NUM-SSC-W2-005` | SSC CHSL 2015 | Section II Q1 | `NUM-CP-004` | least/greatest primes below 100 are 2 and 97; difference `95` |
| `NUM-SSC-W2-006` | SSC CHSL DEO & LDC 2012 | PDF page 37, Q20 | `NUM-CP-002` | recurring `0.63... + 0.37... = 63/99 + 37/99 = 100/99` |

## Coverage after Wave 2

Across corrected Wave 1 plus Wave 2, `NUM-001` contains **16 normalized countable observations**:

- `SSC_CGL_TIER_I`: **10**;
- `SSC_CHSL`: **5**;
- `SSC_CGL_TIER_II`: **1**.

Evidence now reaches:

- `NUM-CP-001` — parity/integer structure;
- `NUM-CP-002` — fraction/recurring-decimal representation;
- `NUM-CP-003` — divisibility;
- `NUM-CP-004` — prime structure;
- `NUM-CP-006` — HCF;
- `NUM-CP-005` — **still uncovered**.

`NUM-CP-005` is deliberately left at zero because this source pass did not produce a clean supported-profile divisor-function fixture. An FCI divisor-set application exists in the collection, but FCI is outside the current specialized profile map and is therefore not repurposed as SSC CGL/CHSL evidence.

## Evidence boundary

The shared unresolved paper identity is retained per exam family even when the collection gives different years. This is intentionally conservative: year labels alone are not converted into distinct official paper identities. Consequently, the observations can establish topic presence and broaden the sample, but they cannot yet support trustworthy paper-frequency calibration.

## Runtime decision

After this wave:

- `NUM-001 / SSC_CGL_TIER_I` -> `EVIDENCE_ACCUMULATING_SELECTION_PENDING` with 10 observations;
- `NUM-001 / SSC_CGL_CHSL` -> `EVIDENCE_ACCUMULATING_SELECTION_PENDING` with 5 observations;
- `NUM-001 / SSC_CGL_JSO` -> `EVIDENCE_ACCUMULATING_SELECTION_PENDING` with 1 CGL Tier-II observation;
- Banking and Punjab profiles remain zero-evidence / selection-pending;
- `profileSelectionCalibrated` remains `false` everywhere for specialized Number System routes.

No generation routing, CP weight, QL weight, difficulty weight or representation weight is changed by Wave 2.
