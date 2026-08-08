# NUM-CP-006 — Wave 01 HCF/LCM Foundation

## Checkpoint

`NUM-CP-006 — HCF, LCM and Common-Alignment Applications`

This wave starts executable discovery from the approved `NUM-CP-005` merge. It does not allocate permanent QLs and does not fix a final solve-mode count.

```text
Current next available Number System QL: NUM-QL-070
Permanent QLs introduced by this wave:   0
Question Studio discovery:               disabled
Question Bank writes:                    disabled
Test/public eligibility:                 disabled
```

## Wave 01 temporary prototypes

| Prototype | Family | Student task |
|---|---|---|
| `NUM-CP006-PROT-001` | Direct HCF | Find the HCF of two numbers |
| `NUM-CP006-PROT-002` | Direct LCM | Find the LCM of two numbers |
| `NUM-CP006-PROT-003` | Direct HCF | Find the HCF of three numbers |
| `NUM-CP006-PROT-004` | Direct LCM | Find the LCM of three numbers |
| `NUM-CP006-PROT-005` | Inverse pair | Recover the missing number from HCF, LCM and one number |
| `NUM-CP006-PROT-006` | Inverse pair | Select the pair having the stated HCF and LCM |
| `NUM-CP006-PROT-007` | Grouping/measurement | Find the greatest equal measure without waste |
| `NUM-CP006-PROT-008` | Common alignment | Find the first positive time at which schedules meet again |

## Mathematical authority

Canonical routes use exact integer arithmetic:

- Euclidean gcd;
- `lcm(a,b) = |ab| / gcd(a,b)` with division before multiplication;
- prime-exponent minima for HCF;
- prime-exponent maxima for LCM;
- for exactly two positive integers, `ab = HCF × LCM`;
- `a = hx`, `b = hy`, `gcd(x,y)=1` for inverse pair structure;
- HCF for the greatest equal exact grouping or measurement;
- LCM for the first positive common repeat.

Independent verification recomputes gcd/lcm directly, evaluates every pair option, checks exact divisibility and excludes time zero where the wording asks for the next coincidence.

## Ownership safeguards

- Prime factorisation as an answer remains `NUM-CP-004`.
- Divisor count, sum, product and divisor-set functions remain `NUM-CP-005`.
- HCF/LCM targets and common-alignment arithmetic belong to `NUM-CP-006`.
- Geometry remains under Mensuration; this checkpoint owns only the common-measure arithmetic.
- Time, speed and work chapters own their domain models; CP-006 owns the common-cycle calculation when HCF/LCM is the governing invariant.
- Inclusion-exclusion overlap counting is not promoted in Wave 01.
- The two-number product identity is never extended to three or more numbers.
- Event questions explicitly ask for the next or first positive alignment so time zero cannot become a hidden second answer.

## Question and explanation standard

Each package contains:

- four literal and semantic distinct options;
- exactly one correct option;
- question-specific misconception ownership for every wrong option;
- deterministic replay;
- an independent verifier result equal to the canonical answer;
- a teacher-like explanation using the displayed numbers;
- three question-relevant traps;
- state-derived difficulty;
- a mathematical fingerprint for variation audits.

## Executable proof target

```text
Temporary prototypes:          8
Runtime seeds per prototype: 100
Exact generated packages:    800
Structural audit seeds:       60
Structural audit packages:   480
English review questions:     24
Permanent QLs:                 0
```

The proof requires every answer position, at least two genuine difficulty bands per prototype, at least 40 distinct mathematical fingerprints per prototype, zero verifier mismatches and zero lifecycle leaks.

## Open after Wave 01

Later discovery waves must still cover:

- Euclidean ladder and division-table representations;
- one-number-divides-another and coprime edge families;
- least/greatest numbers under HCF/LCM constraints;
- same-remainder greatest-divisor problems;
- remainder-adjusted HCF/LCM applications;
- rational-unit normalisation;
- common multiple counts in bounded ranges;
- claim verification, statement combination and data sufficiency;
- mini-caselets;
- explicit ownership audit against set-counting, Time and Work, Time–Speed–Distance and Mensuration;
- source saturation and merge/split audit before any permanent count proposal.

## Lifecycle

```text
maturity:                    EXECUTABLE_DISCOVERY_PROOF
reviewStatus:                UNREVIEWED_DISCOVERY_CANDIDATE
permanentQlId:               null
active:                      false
questionStudioDiscoverable:  false
questionBankWritable:        false
testEligible:                false
publiclyPublishable:         false
```
