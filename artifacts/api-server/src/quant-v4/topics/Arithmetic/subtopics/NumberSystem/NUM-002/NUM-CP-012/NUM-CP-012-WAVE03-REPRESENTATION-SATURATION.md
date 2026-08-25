# NUM-CP-012 — Wave 03 Representation Saturation

**Checkpoint:** `NUM-CP-012`  
**Package:** `NUM-002`  
**Status:** discovery representation saturation  
**Permanent QL allocation:** none

## Purpose

Wave 03 closes representation demand without creating solve-authority inflation. Waves 01 and 02 already provide the underlying perfect-power mathematics. This wave asks whether source-backed claim, complete-set and data-sufficiency forms need new engines or can be rendered from existing mathematical state.

## Representation decisions

### Factorisation claim / statement evaluation

**MERGE as a representation of recognition.**

`NUM-CP012-PROT-001` already contains the complete factorisation state, declared power index `k`, exact perfect-power classification and independent exact-root verification. A claim such as:

```text
The number is a perfect kth power because every prime exponent is divisible by k.
```

changes learner projection from selecting an integer to evaluating a claim; it does not require a new mathematical engine. The permanent recognition authority must allow `BOOLEAN_CLAIM` as a representation semantic in addition to direct identification.

### Terminal-pattern compatibility

**MERGE into the recognition/claim authority.**

`NUM-CP012-PROT-013` is necessary rejection evidence only. It must not become a standalone permanent QL because terminal compatibility is neither sufficient proof nor a requested CP009-style terminal-digit computation. It remains a recognition/claim representation.

### Complete bounded candidate set for missing exponent

**MERGE as an inverse-exponent representation.**

`NUM-CP012-PROT-014` already enumerates the entire bounded set of exponents satisfying the perfect-power invariant before collapsing it to `NO_SOLUTION / ONE_SOLUTION / MULTIPLE_SOLUTIONS`. Returning that complete set is a projection change, not a new solve engine.

### Data sufficiency

**REASSIGN to `DSF-001`.**

The repository already has a dedicated Number System Data Sufficiency runtime under `reasoning-v1/topics/Data-Sufficiency/DSF-001`. CP012 must expose mathematically truthful world/constraint state if DS composition needs it later, but CP012 must not allocate a permanent perfect-power QL merely for the five-option DS answer contract.

### “Find a factor/number whose product becomes a perfect power”

**MERGE into multiplicative completion.**

When the required factor is least, it is exactly the least-multiplier authority. If the wording allows any factor, the answer is non-unique unless a bound/selection rule is added; that is a representation or inverse-set problem, not a new completion engine.

### Least perfect-power multiple value

**SPLIT from least multiplier by answer semantic, but share the completion engine.**

`NUM-CP012-PROT-003` returns the multiplier. `NUM-CP012-PROT-012` returns the completed perfect-power value. The prime-exponent completion algorithm is shared, yet the requested learner object and distractor topology differ materially (`multiplier` versus `completed multiple`). Preserve two permanent authorities.

### Recognition versus exact root

**SPLIT.**

Recognition answers classification/claim semantics. Exact root reconstructs an integer root and owns signed-domain/no-root behavior. They share exact-power verification but not answer semantics or misconception topology.

### Directional additive completion

**MERGE addition and subtraction as representations of one boundary-adjustment authority.**

Both use adjacent exact-power boundaries and return the adjustment amount. Direction is a representation parameter; no new permanent QL is needed for add versus subtract.

### Bound value versus nearest value

**SPLIT.**

Bound projection (`greatest at most` / `least at least`) is one-sided. Nearest perfect power compares both adjacent boundaries. Their learner algorithm and common mistakes differ enough to retain separate authorities.

## Ownership closures

- square/cube divisor count → `NUM-CP-005`;
- requested remainder of square/cube expression → `NUM-CP-008`;
- requested terminal digit(s) → `NUM-CP-009`;
- symbolic radical/exponent manipulation → Surds & Indices;
- algebraic square/cube identities → Algebra;
- geometry requiring area/volume interpretation → Mensuration;
- Data Sufficiency answer contract → `DSF-001`;
- independently essential second-engine hybrids → `NUM-CP-014` candidate after ablation.

## Wave 03 exit decision

No additional temporary solve prototype is required. Representation saturation is complete when executable audits prove:

1. recognition state can render a truthful factorisation claim without new mathematics;
2. terminal compatibility remains rejection-only and maps to recognition;
3. bounded inverse-exponent state can expose the full candidate set before class collapse;
4. DS ownership is demonstrably external in `DSF-001`;
5. merge/split decisions above are recorded before permanent allocation.

All lifecycle gates remain closed and no permanent identity is allocated in Wave 03.
