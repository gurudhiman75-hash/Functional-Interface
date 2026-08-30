# Reasoning patterns

Every generated package records a connected reasoning graph following this invariant:

1. Parse partner capitals, active intervals, and the gross result.
2. Convert event wording into half-open timeline segments.
3. Sum exact `capital × duration` contributions for each partner.
4. Execute ordered pre-distribution allocations when present.
5. Divide the remaining pool in the normalized weight ratio.
6. Reconstruct the requested forward or reverse unknown.

The canonical solver works partner by partner. The independent verifier sweeps all timeline boundaries and recomputes interval contributions, preventing the verification path from merely repeating the production algorithm.
