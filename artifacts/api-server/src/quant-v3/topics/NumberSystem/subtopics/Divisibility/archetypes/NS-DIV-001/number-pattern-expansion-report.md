# NS-DIV-001 Number Pattern Expansion Report

## Scope

This report documents the Phase 12 number pattern library expansion for NS-DIV-001.

This phase expands educational coverage only. It does not implement CP-003, implement CP-004, modify solver logic, modify reasoning graph logic, modify explanation styles, modify question language, or create new architecture.

## Audit Summary

| Field | Count |
| --- | ---: |
| Total Pattern Count Before | 15 |
| Total Pattern Count After | 27 |
| New Pattern Count | 12 |

## New Patterns Added

| Pattern ID | Pattern Structure | Length | Missing Position | Reason For Inclusion |
| --- | --- | ---: | ---: | --- |
| NP-016 | `x724` | 4 | 1 | Adds the missing 4-digit first-position pattern so all four 4-digit positions are represented. |
| NP-017 | `x2849` | 5 | 1 | Adds first-position 5-digit variety using an explicit realistic number formation. |
| NP-018 | `2x849` | 5 | 2 | Adds middle-position 5-digit variety using the same reviewed digit family. |
| NP-019 | `28x49` | 5 | 3 | Adds middle-position 5-digit variety with the missing digit in a central position. |
| NP-020 | `284x9` | 5 | 4 | Adds middle-position 5-digit variety near the final digit. |
| NP-021 | `2849x` | 5 | 5 | Adds last-position 5-digit variety using the same reviewed digit family. |
| NP-022 | `x72849` | 6 | 1 | Adds 6-digit first-position coverage. |
| NP-023 | `7x2849` | 6 | 2 | Adds 6-digit second-position coverage. |
| NP-024 | `72x849` | 6 | 3 | Adds 6-digit third-position coverage. |
| NP-025 | `728x49` | 6 | 4 | Adds 6-digit fourth-position coverage. |
| NP-026 | `7284x9` | 6 | 5 | Adds 6-digit fifth-position coverage. |
| NP-027 | `72849x` | 6 | 6 | Adds 6-digit last-position coverage. |

## 4-Digit Coverage After Expansion

| Position | Pattern |
| --- | --- |
| Position 1 | `x724` |
| Position 2 | `7x24` |
| Position 3 | `72x4` |
| Position 4 | `724x` |

## Pattern Coverage Report

| Length Category | Pattern Count After Expansion | Patterns |
| --- | ---: | --- |
| 3-digit patterns | 3 | `x24`, `2x4`, `24x` |
| 4-digit patterns | 4 | `x724`, `7x24`, `72x4`, `724x` |
| 5-digit patterns | 14 | `5x728`, `57x28`, `572x8`, `5728x`, `x7384`, `8x396`, `83x96`, `839x6`, `8396x`, `x2849`, `2x849`, `28x49`, `284x9`, `2849x` |
| 6-digit patterns | 6 | `x72849`, `7x2849`, `72x849`, `728x49`, `7284x9`, `72849x` |

## Missing Position Coverage

| Missing Position | Coverage After Expansion | Patterns |
| --- | --- | --- |
| Position 1 | Covered | `x24`, `x724`, `x7384`, `x2849`, `x72849` |
| Position 2 | Covered | `2x4`, `7x24`, `5x728`, `8x396`, `2x849`, `7x2849` |
| Position 3 | Covered | `24x`, `72x4`, `57x28`, `83x96`, `28x49`, `72x849` |
| Position 4 | Covered | `724x`, `572x8`, `839x6`, `284x9`, `728x49` |
| Position 5 | Covered | `5728x`, `8396x`, `2849x`, `7284x9` |
| Position 6 | Covered | `72849x` |

## CP Reachability

Each new pattern contains exactly one missing digit and has at least one approved divisor route for CP-001 and CP-002.

| Pattern ID | Pattern | CP-001 Reachability | CP-002 Reachability |
| --- | --- | --- | --- |
| NP-016 | `x724` | Reachable | Reachable |
| NP-017 | `x2849` | Reachable | Reachable |
| NP-018 | `2x849` | Reachable | Reachable |
| NP-019 | `28x49` | Reachable | Reachable |
| NP-020 | `284x9` | Reachable | Reachable |
| NP-021 | `2849x` | Reachable | Reachable |
| NP-022 | `x72849` | Reachable | Reachable |
| NP-023 | `7x2849` | Reachable | Reachable |
| NP-024 | `72x849` | Reachable | Reachable |
| NP-025 | `728x49` | Reachable | Reachable |
| NP-026 | `7284x9` | Reachable | Reachable |
| NP-027 | `72849x` | Reachable | Reachable |

## Coverage Improvements

| Finding Before Expansion | Resolution |
| --- | --- |
| No approved 4-digit first-missing pattern | Added `x724`. |
| No approved 6-digit patterns | Added six 6-digit patterns covering positions 1 through 6. |
| Only 15 approved patterns | Expanded to 27 approved patterns. |
| Limited 5-digit first-position variety | Added `x2849`. |
| Limited 5-digit last-position variety | Added `2849x`. |
| Limited 5-digit middle-position variety | Added `2x849`, `28x49`, and `284x9`. |

## Remaining Coverage Gaps

| Gap | Status |
| --- | --- |
| 3-digit pattern count remains smaller than 4-, 5-, and 6-digit coverage | Remaining gap for future human review. |
| Position 6 coverage exists only for 6-digit patterns | Expected from number length constraints. |
| Pattern IDs are documented in this report but not stored as fields in `number-patterns.library.json` | Existing library shape preserved; no new architecture created. |

