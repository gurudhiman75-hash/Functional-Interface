# RAP-002: Compound Proportions & Linked Ratios

## Domain Description

Advanced applications of Ratio and Proportion where relationships are chained, reversed, nested, or compared across multiple stages. RAP-002 extends RAP-001 by focusing on compound linkage rather than foundational ratio formation.

## Exam Context

- **SSC (CGL/CHSL)**: Chain ratios, age-ratio shifts, transfers, and continued proportion style questions.
- **Banking**: Partnership-like weighted chains, work-rate inverse chains, and nested distribution.
- **RRB/State Exams**: Direct/inverse proportional chains and comparison of equivalent ratio systems.

## Mathematical Scope

1. **Direct Chain Ratios**: Aligning ratios with shared linking elements across 3-4 quantities.
2. **Reverse Chain Resolution**: Recovering an intermediate or endpoint value from linked ratios and constraints.
3. **Multi-Stage Transformations**: Tracking ratio changes across add/remove/transfer operations.
4. **Conditional Partitioning**: Dividing a total, then subdividing one or more parts by a second ratio.
5. **Inverse Chain Proportions**: Work-rate, speed, and effort chains where one relation reverses another.
6. **Ratio Comparison & Ordering**: Comparing, ordering, or proving equivalence between chains.

## Boundary With RAP-001

RAP-001 covers foundational ratio creation, basic partitioning, mathematical proportion formulas, weighted mapping, and mixture ratio basics.

RAP-002 should not duplicate those direct forms. It should only include questions where the student must manage a chain, reverse a chain, compare chains, or combine ratios across nested/conditional stages.

## Architecture Target

- Follow RAP-001 flat module architecture.
- Keep one `RAP-002` folder with no `foundation/` subdirectory.
- Use task-kind driven parameter generation and solver routing.
- Build multilingual English/Hindi/Punjabi from the start.
- Keep solver/math logic language-neutral.
- Use shared entity libraries and language coverage infrastructure.
- Do not expose public/student catalog until English and multilingual audits pass.

## Performance Targets

- Support 3-4 linked entities in direct chains.
- Support at least 6 canonical problems and 18-24 task kinds.
- Target 120-150 active QLs across English, Hindi, and Punjabi.
- Maintain zero unresolved placeholders and zero English leakage in Hindi/Punjabi.
