# PCT-001: Library Authority Map

This document defines the ownership and authority for the PCT-001 Percentage package library artifacts.

## Artifact Authority

| Artifact | Authority | Ownership |
| --- | --- | --- |
| `question-language.*.json` | Human | Defines the pedagogical and linguistic interface. |
| `explanation.*.json` | Human | Defines the educational steps and reasoning patterns. |
| `variable-ranges.library.json` | Human | Defines the mathematical constraints for realism. |
| `coverage-targets.library.json` | Human | Defines the distribution of difficulty and problem types. |
| `distribution-targets.library.json` | Human | Defines the relative frequency of Canonical Problems. |

## Language Ownership (Human)
- **English (en)**: Standard SSC/Banking/Railway terminology.
- **Hindi (hi)**: Natural competitive-exam Hindi (Devanagari).
- **Punjabi (pa)**: Natural competitive-exam Punjabi (Gurmukhi).

## Variable Ownership (Human)
- Semantic naming convention is mandatory.
- Ranges must reflect realistic exam scenarios (e.g., standard percentages like 12.5%, 16.66% for Hard, integers for Easy).

## Logical Independence
The artifacts in this package define *what* can be generated and *how* it is explained. They do not contain runtime code, solvers, or generation logic. The Quant V4 engine consumes these libraries to produce validated question instances.
