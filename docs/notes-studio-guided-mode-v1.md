# Notes Studio Guided Mode V1

## Problem
The production pilot showed that the governed Notes Studio capabilities are individually useful but the normal editor workflow is too fragmented. The current hub exposes specialist pages for planning, discovery, source policy, reference evidence, claims, coverage, gap research, drafts, QA, approval, release, and operations.

## Product decision
Guided Mode becomes the default authoring experience. Existing specialist surfaces remain available under Advanced for exceptions, diagnostics, and governance audits.

## Normal editor journey
1. Start — choose/create a note job and define the topic/scope.
2. Research checkpoint — review the source/evidence/claim/coverage pack.
3. Draft checkpoint — review the assembled note plus QA findings.
4. Publication remains a separate explicit release action.

Guided V1 removes lifecycle-navigation burden first: the editor chooses a job and receives one clear next action. Existing governed surfaces are still used underneath. Later guided checkpoints can orchestrate more of those internal steps without weakening authority boundaries.

## Governance boundaries
Guided Mode does not weaken Notes Studio governance:
- no automatic factual authority;
- no automatic claim acceptance;
- no automatic source/evidence admission;
- no automatic learner publication;
- model suggestions remain advisory;
- reference-only source handling and rights rules remain unchanged;
- detailed provenance and audit trails remain available in Advanced.

## UX rule
The editor should not need to understand internal lifecycle names or scan specialist tabs during a normal run. The default screen should answer only:
- What note am I working on?
- Where is it in the pipeline?
- What needs my review now?
- What is the single next action?

Specialist controls belong behind Advanced.