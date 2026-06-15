# PCT-001: Percentage Archetype

## Mission
The mission of PCT-001 is to provide a comprehensive and mathematically rigorous topology for the "Percentage" topic, tailored specifically for competitive government exams in India (SSC, RRB, Banking, State PCS). It aims to identify the minimum set of mathematically independent canonical problems that cover the entire breadth of the subject without redundant overlaps.

## Educational Boundary
- **Target Exams**: SSC CGL, SSC CHSL, SSC MTS, RRB NTPC/Group D, IBPS PO/Clerk, SBI PO/Clerk, State PCS CSAT.
- **Focus**: Realistic, calculation-efficient, and logic-driven problems encountered in these exams.
- **Complexity**: Range from basic conceptual understanding to multi-step reasoning involving successive changes and product-based constraints.
- **Excluded**: Olympiad-level mathematics, extremely abstract number theory proofs, and non-quantitative reasoning.

## Architecture Reuse
PCT-001 is built on the Quant V4 architecture. It leverages shared components for:
- **Generation**: Unified engine for parameter selection and constraint satisfaction.
- **Formatting**: Standardized output for questions and explanations.
- **Solving**: Centralized mathematical solvers ensuring accuracy and consistency.
- **Validation**: Shared logic for checking solution correctness and realism.
- **Localization**: Decoupled language files (English, Hindi, Punjabi) for multi-lingual delivery.

## Non-Content Boundary
This package is a "Phase A" discovery artifact. It strictly defines the topology and does not contain:
- Runtime code or generators.
- Specific question instances.
- Localized language strings.
- Test suites or audits.
- Variable libraries.
