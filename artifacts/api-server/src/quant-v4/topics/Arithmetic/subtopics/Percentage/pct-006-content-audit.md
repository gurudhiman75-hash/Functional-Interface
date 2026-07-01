# PCT-006 Content Audit

## Scope

Audited:

- `artifacts/api-server/src/quant-v4/topics/Arithmetic/subtopics/Percentage/PCT-006/question-language.en.json`

## Exact Duplicate Audit

### Headline count

- Exact duplicate template groups: `0`
- Affected rows: `0`

### CP spread

- `PCT-CP-001`: `0`
- `PCT-CP-002`: `0`
- `PCT-CP-003`: `0`
- `PCT-CP-004`: `0`
- `PCT-CP-005`: `0`
- `PCT-CP-006`: `0`
- `PCT-CP-007`: `0`
- `PCT-CP-008`: `0`
- `PCT-CP-009`: `0`
- `PCT-CP-010`: `0`

### Notes

- The first generated pass had `10` exact duplicate groups inside `PCT-CP-010`.
- Those duplicate shells were rewritten and the final English library now has zero exact duplicates.

## High-Confidence Near-Clone Families

These are family-level repetitions, not exact-duplicate failures.

1. `PCT-CP-003`
   Reverse comparison shells still revolve around `A is p% more/less than B` and contextualized restatements of the same reversal.
2. `PCT-CP-007`
   Compare-after-change families intentionally repeat the `compare final values` shell across four change-direction patterns.
3. `PCT-CP-008`
   Chain-comparison stems remain close because the chapter goal is multiplier chaining between `A`, `B`, and `C`.
4. `PCT-CP-009`
   Percentage-point vs relative-change prompts are conceptually narrow and therefore structurally close.
5. `PCT-CP-010`
   Cross-base comparison prompts still cluster around `convert each percentage to actual value, then compare`, though the exact duplicate problem was removed.

## Top Weak Stems

These are not blockers, but they are the likeliest candidates for a later editorial refinement pass.

| CP ID | QL ID | Stem snippet | Issue |
| --- | --- | --- | --- |
| `PCT-CP-001` | `PCT-QL-031` | `A comparison note says that Riya's marks stand...` | Slightly stiffer than the strongest direct exam-style shells |
| `PCT-CP-004` | `PCT-QL-191` | `A comparison row lists... Express the difference...` | Serviceable, but more report-like than exam-book natural |
| `PCT-CP-007` | `PCT-QL-341` | `A comparison line tracks {subjectA} and {subjectB}...` | Functional, but visibly templated |
| `PCT-CP-008` | `PCT-QL-391` | `A chained comparison states that...` | Clear, though more formal than the best chapter stems |
| `PCT-CP-010` | `PCT-QL-495` | `A comparison table lists... Identify the larger actual value.` | Acceptable, but among the most mechanical report-style shells |

## Language Naturalness Notes

- The chapter now avoids exact duplicate pressure entirely.
- Context spread is broad: salary, marks, population, production, price, sales, attendance, stock, passengers, and utility usage.
- The strongest English appears in direct salary/marks/population comparison shells.
- The weakest English is concentrated in a few `comparison note / comparison line / comparison table` wrappers used to diversify structure.
- The chapter stays inside the intended comparison/base-switching boundary and does not drift into mixture/concentration.

## CP-Level Content Richness Score

| CP ID | Score / 10 | Notes |
| --- | ---: | --- |
| `PCT-CP-001` | `8.0` | Strong breadth and clear direct-comparison wording |
| `PCT-CP-002` | `8.0` | Mirrors CP-001 well with good recovery and difference coverage |
| `PCT-CP-003` | `7.5` | Narrow by design, but still varied enough for manual review |
| `PCT-CP-004` | `8.0` | Good selected-base emphasis and context variety |
| `PCT-CP-005` | `7.5` | Ratio shell remains structurally tight but usable |
| `PCT-CP-006` | `8.0` | Clear target-matching phrasing and decent context spread |
| `PCT-CP-007` | `8.0` | Good conceptual coverage, though some report-style stems feel templated |
| `PCT-CP-008` | `7.5` | Hard-content value is strong; language is slightly more formal |
| `PCT-CP-009` | `8.0` | Important conceptual distinction and sufficiently clear wording |
| `PCT-CP-010` | `8.0` | Duplicate issue fixed; still the most shell-clustered CP |

## Manual-Review Readiness

Status: `Ready for manual review`

Why:

- Exact duplicate count is `0`.
- The chapter hits the required `500` English QLs with `50` per CP.
- The chapter stays on-mission as a comparison/base-switching chapter.
- Remaining repetition is mostly conceptual-family similarity rather than copy-paste duplication.

## Recommended Next Action

1. Move `PCT-006` to manual question-bank review.
2. Ask reviewers to keep a light eye on the report-style shells in CP-007 to CP-010.
3. Treat Hindi and Punjabi as structural placeholders until a language-authoring pass is scheduled.
