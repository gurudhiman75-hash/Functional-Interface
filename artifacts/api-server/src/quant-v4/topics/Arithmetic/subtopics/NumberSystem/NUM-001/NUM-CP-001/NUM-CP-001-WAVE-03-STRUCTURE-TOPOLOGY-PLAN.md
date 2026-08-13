# NUM-CP-001 Wave 03 — Structure and Topology Discovery Plan

**Checkpoint:** Number Sets, Order, Parity and Integer Structure  
**Gate:** executable discovery only; no permanent QL allocation  
**Starting prototype range:** NUM-CP001-PROT-017..024

Wave 3 attacks the remaining reasoning topologies that are not adequately represented by direct classification, direct interval counting, inverse bounds, or short-block reconstruction.

## Temporary prototype contracts

1. **PROT-017 — compound rational/irrational classification**  
   Classify exact expressions involving a non-square square root after applying an algebraically valid simplification. No fraction/decimal representation conversion is required; CP-002 remains owner when conversion is the governing inference.

2. **PROT-018 — mixed exact ordering**  
   Order already-exact integers and rational numbers. Values are compared exactly; recurring-decimal conversion is excluded.

3. **PROT-019 — integer interval cardinality topology**  
   Distinguish empty, singleton, two-member and multiple-member integer solution sets between exact rational bounds. This is topology evidence rather than another raw count-only contract.

4. **PROT-020 — missing parity condition**  
   Recover the parity condition on an integer variable under which an expression is even. Required answer topologies: every integer, no integer, even n only, odd n only.

5. **PROT-021 — longer consecutive block reconstruction**  
   Reconstruct 4-, 5- or 6-term consecutive-integer blocks from their sum. This deliberately probes whether the Wave 1 short-block family should later absorb longer lengths or remain split.

6. **PROT-022 — consecutive block middle/endpoint target**  
   Recover the first, middle or last member of an odd-length consecutive block from length and sum evidence. Target topology is retained separately for later merge/split audit.

7. **PROT-023 — possible/impossible consecutive block**  
   Decide whether a proposed sum can belong to a block of k consecutive integers using the exact divisibility/residue condition implied by k.

8. **PROT-024 — statement combination**  
   Evaluate three short claims mixing number-set, parity, signed-order and consecutive-integer structure, then select the exact true-statement combination.

## Ownership boundaries

- CP-001 owns exact number-set/parity/order/consecutive structure when representation conversion, primality, factorisation, divisibility algorithms or generic algebra are not the governing inference.
- CP-002 owns recurring/fraction/decimal conversion as the essential comparison step.
- CP-004 owns prime/composite or factorisation targets.
- Generic inequality solving remains Algebra.
- Pattern continuation remains Number Series.

## Proof requirements

Each temporary prototype must prove, over deterministic seeds:

- four unique options with misconception-owned distractors;
- canonical answer = independent verifier answer;
- deterministic replay;
- all four answer positions;
- EASY/MEDIUM/HARD reachability;
- prototype-specific topology reachability;
- explanation completeness and question specificity;
- no cross-prototype normalized-stem collisions in the structural sample;
- no learner-facing internal IDs;
- permanentQlId remains null;
- Question Studio, Question Bank, test and public lifecycle flags remain false.

Wave 3 does **not** allocate NUM-QL-124 or any other permanent identity. Source saturation, data-sufficiency/evidence-topology exploration, merge/split audit and permanent allocation remain later gates.