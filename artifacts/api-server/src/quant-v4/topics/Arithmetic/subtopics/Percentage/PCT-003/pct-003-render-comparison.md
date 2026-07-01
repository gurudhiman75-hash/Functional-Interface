# PCT-003 Render Comparison

## Scope

Pilot: `PCT-MIG-001`

Chapter target: `PCT-003` only.

The migration intentionally preserves the PCT-003 math path:

`parameter-generator → solver → reasoning-graph → validator → MCQ/package shape`

Only the explanation rendering seam was changed.

## Before

`foundation/explanation-renderer.ts` built `Pct003Explanation.lines` directly inside the chapter renderer:

1. Chapter code selected the task-kind branch.
2. Each branch pushed statement/math pairs through `sentenceWithMath(statement, consequence)`.
3. `sentenceWithMath` returned `[statement, mathJaxBlock(consequence)]`.
4. The renderer returned `{ explanationId, lines }` directly.

The runtime-facing output shape was:

```ts
interface Pct003Explanation {
  explanationId: string;
  lines: string[];
}
```

## After

`foundation/explanation-renderer.ts` still owns PCT-003-specific educational wording and formula choices, but the final render is delegated to the shared Educational Rendering Engine:

```text
chapter-owned statement/math pairs
→ ChapterOwnedEducationalStep[]
→ composeEducationalExplanation(...)
→ renderEducationalExplanation(..., "statement-math-lines")
→ Pct003Explanation.lines
```

The runtime-facing output shape remains unchanged:

```ts
interface Pct003Explanation {
  explanationId: string;
  lines: string[];
}
```

## Shared ERE seam added

| Area | Change |
|---|---|
| `renderer-contracts.ts` | Added `chapterOwnedSteps?: readonly ChapterOwnedEducationalStep[]` to `ExplanationComposerInput`; added optional `lines?: readonly string[]` to `EducationRenderResult`. |
| `explanation-composer.ts` | Composer now accepts chapter-owned educational steps and converts them into ERE teaching steps/math illustrations without rewriting the chapter wording. |
| `education-renderer.ts` | `statement-math-lines` target now renders `mathIllustrations.flatMap([statement, mathjax])`. |
| `PCT-003/foundation/explanation-renderer.ts` | Converts chapter-owned statement/math line pairs into `ChapterOwnedEducationalStep[]`, composes through ERE, and returns rendered `lines`. |

## Parity expectation

The PCT-003 renderer still builds the same chapter-owned statement/math content before handing it to ERE. The new `statement-math-lines` renderer returns each math illustration as:

```ts
[item.statement, item.mathjax]
```

Because `ChapterOwnedEducationalStep.statement` and `ChapterOwnedEducationalStep.mathjax` are populated from the exact same statement/math pair source, the expected rendered line output is byte-for-byte equivalent to the pre-migration line output.

## Task-kind line count comparison

| Task kind | Before line shape | After line shape | Expected parity |
|---|---:|---:|---|
| `directPercentageIncrease` | 3 statement/math pairs = 6 lines | 3 statement/math pairs = 6 lines | Same |
| `increaseAmount` | 3 pairs = 6 lines | 3 pairs = 6 lines | Same |
| `originalValueFromIncreasedValue` | 4 pairs = 8 lines | 4 pairs = 8 lines | Same |
| `equivalentMultiplier` | 3 pairs = 6 lines | 3 pairs = 6 lines | Same |
| `repeatedPercentageIncrease` | 3 pairs = 6 lines | 3 pairs = 6 lines | Same |
| `netIncreasePercentage` | 4 pairs = 8 lines | 4 pairs = 8 lines | Same |
| `comparativeIncrease` | 4 pairs = 8 lines | 4 pairs = 8 lines | Same |
| `percentageIncreaseInParts` | 4 pairs = 8 lines | 4 pairs = 8 lines | Same |
| `requiredIncrease` | 3 pairs = 6 lines | 3 pairs = 6 lines | Same |
| `growthBridge` | 4 pairs = 8 lines | 4 pairs = 8 lines | Same |

## Guardrails preserved

- No PCT-003 parameter-generation logic changed.
- No PCT-003 solver logic changed.
- No PCT-003 reasoning graph logic changed.
- No PCT-003 validator logic changed.
- No MCQ/package surface changed.
- No Hindi/Punjabi expansion was introduced.
- Existing chapter-specific educational wording remains chapter-owned.

## Verification note

A typecheck was attempted with `pnpm run typecheck`, but the CodexPro command runner failed before executing the command because this Windows session reports `spawn bash ENOENT`. Runtime verification therefore remains pending in an environment where the command runner can execute shell commands.
