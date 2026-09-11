# CAE-001 — Cause and Effect

## Engine decision

Every CAE-001 question starts with a curated causal world: event nodes, temporal order, directed causal edges, and localized renderings. A Question Logic projects nodes from that world; it never decides an answer from surface wording, chronological order, or unbounded world knowledge.

```text
causal world → graph solver → projection → options → explanation → EN / HI / PA rendering
```

The graph is shared by the three locales, so translation cannot reverse causal direction or change the correct option.

## Checkpoint ownership

| Checkpoint | QL | Learner task |
| --- | --- | --- |
| `CAE-CP-001` | `CAE-QL-001` | Direct cause/effect; statement order can be reversed. |
| `CAE-CP-002` | `CAE-QL-002` | Common cause, independent causes, and independent effects. |
| `CAE-CP-003` | `CAE-QL-003` | Identify the most probable immediate cause. |
| `CAE-CP-004` | `CAE-QL-004` | Identify the most probable immediate effect. |
| `CAE-CP-005` | `CAE-QL-005` | Select the strongest competing explanation. |
| `CAE-CP-006` | `CAE-QL-006` | Recognise indirect causation through hidden links. |
| `CAE-CP-007` | `CAE-QL-007` | Reject correlation or temporal coincidence as causal proof. |
| `CAE-CP-008` | `CAE-QL-008` | Determine a valid multi-event causal sequence. |
| `CAE-CP-009` | `CAE-QL-009` | Complete a missing causal link. |
| `CAE-CP-010` | — | Automated ambiguity, structure, locale, and distribution gates. |

`CAE-001` does not own conclusions, assumptions, arguments, courses of action, assertion/reason, or fact verification.

## Option and distractor policy

Relationship projections render either four-option or five-option exam profiles from the same graph state. The five-option profile distinguishes independent causes from independent effects; the four-option profile deliberately collapses them into one independent-events choice. This is presentation, not a different QL.

Every non-correct option carries a coded error role where applicable: reverse causation, correlation, temporal violation, weak cause, wrong scope, unrelated event, common-cause confusion, indirectness confusion, or overgeneralisation.

## Structural and ambiguity gates

The authority validator rejects:

- unknown or duplicate graph nodes;
- causal cycles, self-causation, and temporal-order violations;
- direct questions without a direct edge;
- common-cause questions with a direct causal path;
- probable-cause/effect questions with another graph-supported answer;
- indirect questions without a hidden bridge;
- correlation questions that actually have a path or common cause;
- invalid multi-event chains and ambiguous missing links;
- missing EN/HI/PA node text.

## Delivery state

The package is available in Question Studio for deterministic review only. It cannot write to the question bank or be delivered in tests, mocks, or public content until source saturation, human editorial review, and a separate release freeze are completed.
