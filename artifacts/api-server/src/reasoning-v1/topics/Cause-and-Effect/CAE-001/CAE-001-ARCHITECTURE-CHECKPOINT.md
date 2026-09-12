# CAE-001 architecture checkpoint — generative causal state V3

Status: review-only. Checkpoint/QL allocation, family count, and source coverage are not frozen. This refactor deliberately stops before adding a new checkpoint or promoting any QL.

## Audit result

The prior V2 implementation preserved a useful graph solver but was a small authored bank: seven completed worlds and twelve completed projections. A seed mainly selected a projection and permuted its options. It also treated the QL list as permanent and rendered `world.context` wholesale, which could disclose a hidden cause, an independence cue, or the answer itself.

V3 preserves the graph-first solver, deterministic seed contract, locale-shared semantic state, and review-only Question Studio package. It removes completed question authorities as the runtime unit.

## Revised architecture and data model

```text
provisional checkpoint/QL plan
  → compatible scenario family
  → variant + graph-substructure selection from seed
  → canonical causal world (all nodes, edges, alternatives)
  → question-visible context (backdrop + permitted nodes only)
  → graph solver + ambiguity gates
  → error-mechanism distractors + derived difficulty
  → EN / HI / PA render from the identical semantic state
```

| Layer | Authority | What it owns |
| --- | --- | --- |
| Scenario family | `CaeScenarioFamilyAuthority` | Domain, topology, compatible projections, allowed exam profiles, rendering constraints, variants. |
| Variant | `CaeScenarioVariant` | Neutral backdrop, reusable event units, edge bindings, scenario-local competing candidates. |
| Canonical world | `CaeCausalWorld` | Fully materialized event DAG. It contains causes, intermediates, primary/secondary effects, and temporal order even when these are hidden from the learner. |
| Visible context | `CaeVisibleContext` | The backdrop and exact node IDs permitted in the stem. It never serializes the canonical world automatically. |
| Node / edge | `CaeNode`, `CaeCausalEdge` | Role, scope, severity, magnitude, temporal order, effect priority; edge strength, temporal relation, and directness. |
| Candidate | `CaeCandidateAuthority` | Localized event plus error mechanism, timing fit, scope fit, magnitude fit, and causal distance. |
| Generation plan | `CaeProjectionAuthority` | A provisional QL/checkpoint owner and compatible families; it is not a finished question. |

The model expressly records scenario family/domain, intermediate nodes, primary and secondary effects, branching/common effects, strength, temporal relation, directness/distance, scope, severity/magnitude, exam profile compatibility, and stem-rendering constraints.

## Canonical state versus question-visible context

`materializeCae001World` constructs the complete graph. `contextFor` receives a specific visible-node list and only renders the neutral variant backdrop plus those listed nodes. The rest remains hidden.

Examples of the guard in action:

| Learner task | Canonical information kept hidden | Visible information |
| --- | --- | --- |
| Common cause | Root cause | The two effects and a neutral setting. |
| Independent/correlation | Both roots and the fact that the chains are separate | Two observations and a neutral setting; no “independent”, “separate”, or “no shared cause” cue. |
| Probable cause/effect | Correct candidate | One observation, then candidate options. |
| Competing explanation | Root cause and intermediate chain | Outcome plus timing/scope/magnitude neutral setting. |
| Indirect/missing-link | Intermediate event(s) | Endpoints only. |
| Sequence | Nothing required to be hidden | Selected event cards; the task is their order. |

The renderer throws if the answer-option text enters a cause/effect/competing/missing stem, if the neutral backdrop embeds a canonical event, or if an independence/correlation backdrop uses answer-leaking language.

## Scenario-family system

Nine families currently provide 27 composable variants. They are intentionally current discovery coverage, not a declared corpus size.

| Family | Topology | Core compatible tasks |
| --- | --- | --- |
| Operations chain | Direct chain | Direct, probable cause/effect, indirect, sequence, missing link |
| Shared pressure | Branching common cause | Direct, common cause, probable effect |
| Parallel incidents | Parallel chains | Independent causes/effects, correlation |
| Diagnostic disruption | Direct chain | Direct, probable cause/effect, competing explanation, indirect |
| Competing scope | Competing causes | Probable cause/effect, competing explanation, indirect |
| Hidden chain | Long hidden chain | Indirect, sequence, missing link, probable cause, competing explanation |
| Coincident observations | Parallel chains | Correlation, independence |
| Civic sequence | Long hidden chain | Direct, indirect, sequence, missing link, probable effect |
| Missing bridge | Long hidden chain | Missing link, indirect, sequence, probable cause, competing explanation |

Generation first selects a compatible family and variant deterministically, then selects an eligible graph substructure: a direct edge, common-effect pair, independent pair, root-to-leaf path, or two-edge bridge. Thus the same plan creates new causal states; shuffling happens only after semantic selection.

## Provisional QL discovery and allocation strategy

The nine present IDs are `CAE_PROVISIONAL_QL_IDS`; neither the manifest nor Question Studio labels them permanent.

1. Keep CPs as ownership boundaries only: direct relation, common/independent, probable cause, probable effect, competing explanation, indirect chain, correlation, sequence, and missing link.
2. Maintain a source-pattern ledger per checkpoint: paired-statement form, option profile, directness, causal distance, domain, distractor mechanism, and observed exam wording.
3. Add a family only when it contributes a new validated causal structure or a source-supported wording/option family; do not add it just to increase count.
4. Split a provisional QL when saturation reveals materially different inference rules or ambiguity checks. Merge/retire one when two plans share the same solver, renderer, distractor policy, and difficulty evidence.
5. Freeze a QL allocation only after source coverage, semantic saturation, ambiguity review, multilingual review, and editorial approval. Until then the Question Studio package remains review-only and cannot write to the bank.

## Difficulty and ambiguity policy

Difficulty is calculated from the generated state, not stored on a projection: causal distance, hidden links, topology complexity, plausible distractors, visible-event count, and inference burden. The resulting score maps to EASY, MEDIUM, or HARD.

The authority validator rejects unknown slots, cycles, temporal violations, non-neutral backdrops, duplicate locale text, insufficient local distractors, and distractors that are indistinguishable from the graph-supported answer. Generation additionally rejects answer leakage and independence cues. Candidate choices are drawn from the current scenario unit and distinguish reverse causation, weak cause, wrong scope, magnitude mismatch, temporal violation, common-cause confusion, correlation, and indirectness confusion—not unrelated nodes imported from another world.

Explanations show only the needed causal chain or shared-cause/separate-path structure, then one short reason. All explanatory glue is locale-specific; Hindi and Punjabi do not reuse English sentences.

## Generated review samples

These are deterministic V3 outputs from the review generator. They demonstrate different families, topologies, difficulties, hidden-information policies, and distractor mechanisms across CP-001 to CP-009.

| CP | Seed / generated state | Review sample |
| --- | --- | --- |
| CP-001 | `31` · Diagnostic disruption / pump · EASY | **I:** Water reached upper-floor homes slowly. **II:** Residents stored water earlier than usual. Answer: I directly causes II. Chain shown in explanation only: slow delivery → earlier storage. |
| CP-002 | `48` · Coincident observations / vaccination-market · MEDIUM | Vaccination-desk visits and park footfall are shown under the neutral cue “Two public notices appeared on the same noticeboard.” Answer: independent; neither root cause is printed. |
| CP-003 | `65` · Diagnostic disruption / server · MEDIUM | Observation: online applications took longer to submit. Answer: server response queue grew. Competing options are a late outcome, weak local disturbance, and wrong-scope service event. |
| CP-004 | `82` · Civic sequence / cleaning · MEDIUM | Observation: a water-main repair began near the market. Answer: market entrance was temporarily restricted. The bridge node is not in the stem. |
| CP-005 | `99` · Competing scope / metro · HARD | Observation: nearby-station metro use increased. Answer: main-route bridge closure, not light rain, a side-street market, or a later ridership count. Explanation reveals bridge closure → diversion → longer commute → metro use. |
| CP-006 | `116` · Civic sequence / cleaning · HARD | Water-main repair and delayed shop opening are visible. Answer: the repair is an indirect cause. The entrance restriction and longer delivery route remain hidden until the explanation. |
| CP-007 | `133` · Coincident observations / vaccination-market · MEDIUM | Vaccination-desk visits and a weekend craft market opening are visible. Answer: co-occurrence does not establish causation. The two causal roots are hidden. |
| CP-008 | `150` · Hidden chain / cold-storage · HARD | Select the order: power failure → backup-generator delay → loading pause → late dispatch. Wrong orders encode temporal, reverse-causation, and indirectness errors. |
| CP-009 | `167` · Hidden chain / drainage · HARD | Heavy rain → ? → water on access road. Answer: storm drain became blocked. The alternative choices encode weak, wrong-scope, and reverse-causation mechanisms. |

## Review gate

No new causal-world family, projection kind, checkpoint, source-promotion claim, or QL freeze should be added until this architectural checkpoint and the linked saturation report are reviewed.

