
# PCT-007 Library Authority Map

- `task-registry.library.json` maps each QL id to CP, task kind, solve mode, answer type, and required variables.
- `question-language.en.json` is the English stem source of truth.
- `question-language.hi.json` and `question-language.pa.json` preserve placeholder parity for runtime checks.
- `explanation.en.json` maps CP ids to explanation ids.
- `variable-ranges.library.json` documents curated numeric pools used by the parameter generator.
- `coverage-targets.library.json` and `distribution-targets.library.json` document expected coverage counts and balance targets.
