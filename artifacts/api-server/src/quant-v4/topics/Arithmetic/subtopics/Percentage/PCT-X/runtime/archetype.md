# PCT-002: Advanced Percentage & Analytical Logic

## Mission
The mission of PCT-002 is to map the advanced, multi-stage, and analytical percentage scenarios frequently tested in competitive government exams (SSC CGL Mains, Banking PO, RRB, State PCS). Building upon the foundational logic established in PCT-001, this archetype isolates mathematically independent topologies that require conditional logic, set theory, piecewise formulas, and multi-layered hierarchies. 

## Educational Boundary
- **Target Exams**: SSC CGL (Tier I & II), SSC CHSL, RRB NTPC, IBPS PO, SBI PO, Punjab PCS.
- **Focus**: Medium to Hard/Elite level questions testing analytical intersections of percentages rather than direct formula application.
- **Complexity**: Encompasses Venn-diagram logic, multi-stage attritions (elections with invalidations), step-functions (commissions/tax), and repeated operations.
- **Excluded**: Basic conversions, single-step increases/decreases, and simple proportionalities (covered in PCT-001). Extreme mathematical proofs and non-competitive math are also excluded.

## Architecture Reuse
PCT-002 aligns fully with the stabilized **Quant V4** architecture. It leverages:
- **Task Registry**: Explicitly maps templates to computational logic (`task-registry.library.json`) to prevent keyword-masking and inference errors.
- **Unified Engineering**: Shared generators, solvers, and validators across multilingual libraries.
- **Localization**: Strictly human-owned JSON libraries for stem variations and step-by-step explanations in English, Hindi, and Punjabi.

## Non-Content Boundary
This package represents a "Phase A" discovery artifact. It defines the logical boundaries and topology. It strictly does not contain:
- Runtime TypeScript code or math solvers.
- Parameter generators or Graph logic.
- JSON variable boundaries or language libraries.
- Executable audits or test suites.