# Library authority map

| Artifact | Authority |
| --- | --- |
| `task-registry.library.json` | CP, solve mode, answer type, difficulty, variables, scenario, distractor, explanation strategy |
| `question-language.en.json` | Human-owned English stems |
| `question-language.hi.json` | Human-owned Hindi semantic localization |
| `question-language.pa.json` | Human-owned Punjabi semantic localization |
| `variable-ranges.library.json` | Approved numeric domains |
| `object-pools.library.json` | Partner and business context pools |
| `coverage-targets.library.json` | Freeze-time minimum coverage contract |
| `distribution-targets.library.json` | Runtime balancing contract |

Runtime code may instantiate these contracts but must not silently invent new CPs, solve modes, or templates.
