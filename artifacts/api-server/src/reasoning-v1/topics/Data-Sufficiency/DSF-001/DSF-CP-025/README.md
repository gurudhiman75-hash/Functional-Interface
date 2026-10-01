# DSF-CP-025 — QL002 Seating Arrangement Batch Runtime

Status: **reasoning review candidate / undiscoverable**

This checkpoint extends permanent `DSF-QL-002` into linear Seating Arrangement.

It reuses the CP015 three-statement evaluator and the existing SEA-001 production solver, independent oracle, constraint evaluator and linear topology.

Covered targets:
- middle occupant;
- Aman's left-end position;
- number between Aman and Bina;
- Charan's relative position to Diya.

Both NORTH and SOUTH facing universes retain production-solver/oracle parity at 120 valid models each. Lifecycle remains fully locked.
