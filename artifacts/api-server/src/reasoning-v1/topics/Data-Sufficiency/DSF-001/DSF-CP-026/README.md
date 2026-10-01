# DSF-CP-026 — QL002 Coding-Decoding Batch Runtime

Status: **reasoning review candidate / undiscoverable**

This checkpoint extends permanent `DSF-QL-002` into Coding-Decoding.

It reuses the CP015 three-statement evaluator and COD-001/COD-CP-001 direct mapping authorities:
- `solveCodCp001`
- `mappingFromEvidence`

The source universe contains all 24 one-to-one mappings of four symbols to digits 1–4.

Covered targets:
- encode the first source symbol;
- decode digit 1;
- encode the first two symbols.

Each generated item uses three mapping statements and evaluates all seven non-empty statement subsets. Lifecycle remains fully locked.
