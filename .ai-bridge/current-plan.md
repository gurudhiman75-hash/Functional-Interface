# PCT-CONTENT-012 Post-Final-Polish Audit

Updated: 2026-06-27T10:04:50.653Z
Workspace: C:\Users\gurbaj\Downloads\f
Target agent: Codex (codex)

## Plan

Continue Examtree Percentage cleanup.

Project root:
C:\Users\gurbaj\Downloads\f

Task:
PCT-CONTENT-012 — PCT-001 Post-Final-Polish Audit

Context:
- PCT-CONTENT-010 was an audit-only pass. It found 17 exact duplicate groups in PCT-001, with 16 groups in PCT-CP-001 and 1 group in PCT-CP-002.
- PCT-CONTENT-011 then rewrote the audit-listed exact duplicate members in PCT-CP-001 and PCT-CP-002.
- The purpose of this task is to verify the post-PCT-CONTENT-011 state and decide whether PCT-001 is ready for manual question-bank review.

STRICT SCOPE:
Audit only:
artifacts/api-server/src/quant-v4/topics/Arithmetic/subtopics/Percentage/PCT-001/question-language.en.json

Create report only:
artifacts/api-server/src/quant-v4/topics/Arithmetic/subtopics/Percentage/pct-content-012-pct001-post-final-polish-audit.md

DO NOT edit:
- question-language.en.json
- solver
- validator
- generator
- pipeline
- registry
- schemas
- runtime
- renderer
- explanation files
- Hindi files
- Punjabi files
- any other source/runtime file

Audit requirements:
1. Parse `PCT-001/question-language.en.json` as JSON and report whether parsing passes.
2. Count exact duplicate template strings across all PCT-001 CPs.
3. Report exact duplicate groups, affected rows, and CP spread.
4. Specifically verify whether the PCT-CONTENT-010 exact duplicate groups are now removed or reduced to one survivor.
5. Identify remaining high-confidence near-duplicate families, but do not overstate mild similarity as a blocker.
6. Provide CP-level readiness scores after PCT-CONTENT-011.
7. Make a clear publish-readiness call: `Ready for manual review`, `Needs tiny patch`, or `Needs another cleanup pass`.
8. List top remaining weak stems only if they are worth reviewing manually or patching.
9. Include a recommended next action.

Suggested report structure:
# PCT-CONTENT-012 — PCT-001 Post-Final-Polish Audit

## Scope
## Verification
## Executive Verdict
## Exact Duplicate Audit
## PCT-CONTENT-010 Duplicate Resolution Check
## Near-Duplicate Audit
## CP-Level Readiness Score
## Top Remaining Weak Stems
## Publish-Readiness Judgement
## Recommended Next Action

Important interpretation guidance:
- The previous exact duplicate pressure should be the main checkpoint.
- If exact duplicate count is zero or near-zero, prefer moving to manual review rather than another broad cleanup.
- Only recommend a tiny patch if exact duplicates remain or if a few stems are clearly embarrassing.
- Do not recommend broad CP-006 or CP-001 formula-family rewrites unless the evidence is severe.

Verification command to try from artifacts/api-server:
node -e "JSON.parse(require('fs').readFileSync('src/quant-v4/topics/Arithmetic/subtopics/Percentage/PCT-001/question-language.en.json','utf8')); console.log('JSON OK')"

Known tool caveat:
CodexPro shell in this Windows bridge may fail with `spawn bash ENOENT`. If it fails, state that runtime verification could not be executed and provide the exact local command above.

Deliverable:
Create the Markdown audit report only. Do not modify JSON or runtime files.

## Implementation contract

- Work from this plan in small, reviewable steps.
- Keep edits scoped to the requested task and existing project conventions.
- Run focused verification before handing work back.
- Update .ai-bridge/agent-status.md with files touched, checks run, results, blockers, and review notes.
- Save the final review diff to .ai-bridge/implementation-diff.patch when practical.
- Append notable execution events to .ai-bridge/execution-log.jsonl when the implementation agent supports logging.
