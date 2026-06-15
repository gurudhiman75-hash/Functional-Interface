# AVG-001: Implementation Plan

## Phase A: Topology Discovery (Completed)
- [x] Identify independent canonical problems.
- [x] Define reasoning patterns (Middle-term, Deviation).
- [x] Establish difficulty framework.

## Phase B: Library Development (Next)
### B1: Question Language (QL)
- Create `question-language.en.json` with teacher-voice templates.
- Support variants for join/leave/replace.
- Parity for Hindi and Punjabi.

### B2: Task Registry
- Map each QL ID to a `taskKind` (e.g., `errorCorrection`, `apMiddleTerm`).
- Define `requiredVariables` for each topology.

### B3: Variable Ranges
- Define constraints for integer-friendly deviations.
- Set bounds for realistic human data (Ages 1-100, Weights 30-120kg).

## Phase C: Runtime Core
### C1: Parameter Generator
- Implement logic for generating AP sequences with integer averages.
- Implement delta-balancing for replacement problems.

### C2: Solver
- Implement deviation-based calculation engine.
- Implement multi-stage sum aggregation.

### C3: Validator
- Ensure all intermediate sums are non-negative.
- Validate that rounding doesn't introduce traceability errors.

## Phase D: Documentation & Audits
- Create `library-authority-map.md`.
- Generate coverage and maturity audits.
- Freeze record.
