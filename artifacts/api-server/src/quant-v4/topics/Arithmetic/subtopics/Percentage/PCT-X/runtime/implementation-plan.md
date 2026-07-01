# PCT-002: Implementation Plan

This plan outlines the subsequent development phases for the Advanced Percentage package. Due to architectural insights gained from PCT-001, PCT-002 will bypass legacy assumptions and utilize the explicit `task-registry.library.json` approach from Day 1.

## Phase B: Core Libraries & Localization
- **Human Creation**:
    - `question-language.[en|hi|pa].json`: Pedagogical question stems for all 6 CPs.
    - `explanation.[en|hi|pa].json`: Step-by-step reasoning texts.
    - `variable-ranges.library.json`: Precise mathematical constraints to ensure realistic scenarios (e.g., commission rates, replacement volumes).
- **Architectural Control**:
    - `task-registry.library.json`: Define explicit `taskKind`, `answerType` (e.g., `PERCENT`, `ABSOLUTE`, `COUNT`), and `requiredVariables` to map every QL template directly to solver logic without text-parsing.

## Phase C: Runtime Engineering
- **Engineering Implementation**:
    - `types.ts`: Define specific `Pct002TaskKind` types reflecting the advanced logic (e.g., `inclusionExclusion`, `tieredCommission`, `fractionalError`).
    - `solver.ts`: Implement robust mathematical solvers for piecewise logic, chained fractions, and inverse Venn-diagrams.
    - `parameter-generator.ts`: Implement `chooseGreaterThan` / `chooseLessThan` dynamic constraints to ensure non-negative valid votes and logical overlaps.
    - `validator.ts`: Re-use the strengthened template-to-variable placeholder validation pioneered in PCT-001.

## Phase D: Exhaustive Quality Assurance
- **Unit Testing**: Focus heavily on Reverse Reasoning tasks (e.g., extracting Total Sales from Commission).
- **Pre-Freeze Audit**: Generate 500 records to verify diversity, duplicate rates, and zero formatting errors (e.g., preventing `%` from appearing on absolute `COUNT` answers).
- **Maturity Audit**: 1000 records to ensure cross-language mathematical parity and high CP utilization prior to finalizing the package.