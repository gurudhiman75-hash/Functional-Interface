# SVG Pedagogical Visualization Architecture

The SVG layer consumes semantic reasoning structures, not explanation prose.

Pipeline:

1. `CanonicalPercentageProblem` + `ReasoningGraph`
2. `SvgPedagogyGraph`
3. deterministic vertical layout
4. theme-aware SVG rendering
5. export bundle for raw SVG, HTML embedding, and PNG rasterization target

The graph transformer may reorder or group visual nodes for teaching clarity, but it must not invent math. Equations remain universal and language-neutral. Only labels are localized.

Supported first-pass node types:

- `percentage_mapping_node`
- `hidden_base_node`
- `vote_filter_node`
- `mixture_balance_node`
- `population_projection_node`
- `pass_fail_gap_node`
- `reverse_percentage_node`
- `shortcut_node`
- `answer_confirmation_node`

Themes are intentionally quiet: `coaching_board`, `exam_sheet`, and `classroom_whiteboard`.

Validation protects node continuity, layout overlap, SVG safety, equation preservation, and derivation visibility.

