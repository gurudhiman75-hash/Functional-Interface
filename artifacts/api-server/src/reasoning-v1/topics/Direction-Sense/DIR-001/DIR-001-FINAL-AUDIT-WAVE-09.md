# DIR-001 Final Audit — Wave 09

## Scope

Question Studio integration for the fully audited `DIR-001` chapter.

This wave connects the chapter to the existing normal multi-engine Question Studio workflow without opening any downstream release gate.

## Integration path

DIR-001 is registered through the existing `reasoning-v1` engine adapter used by the global Question Studio engine registry.

The package is therefore discoverable through the normal Question Studio capabilities endpoint and generated through the normal multi-engine generation run path.

No chapter-specific bypass route is introduced.

## Package contract

- packageId: `DIR-001`
- engine: `reasoning-v1`
- subject: Reasoning
- topic: Direction Sense
- subtopic: Direction & Distance
- permanent QLs: 44
- checkpoints: 8
- languages: English, Hindi, Punjabi
- difficulties: Easy, Medium, Hard
- runtime: review-only
- deterministic seed replay: enabled
- QL selector support: enabled
- checkpoint selector support: enabled
- bounded generated-instance difficulty matching: enabled
- explanation diagrams: preserved
- question-side diagrams: rejected by integration guard

## Lifecycle

The shared standard review-only lifecycle is retained:

- Question Studio discoverable: yes
- generation enabled: yes
- review-run persistence: yes
- Question Bank writable: no
- test eligible: no
- mock-test eligible: no
- publicly publishable: no
- automatic student publication: no
- production release authorized: no
- manual approval required: yes

The integration does not interpret Question Studio visibility as chapter release.

## Generation behavior

The adapter:

- resolves `DIR-QL-001..044` directly;
- resolves `DIR-CP-001..008` to their owned QL pools;
- supports EN / HI / PA through the audited chapter-local localization layer;
- preserves correct-index and canonical-answer parity across languages;
- exposes learner-facing option labels while retaining full option records for review traceability;
- preserves structured prompt, rule, checkpoint, seed and solver metadata;
- transfers the explanation-side SVG diagram to the review payload;
- rejects any generated question that unexpectedly carries a question-side diagram.

Difficulty requests are satisfied only by actual generated instances matching the requested difficulty. The adapter does not relabel an instance merely to satisfy the filter.

## Regression proof

The new integration proof verifies:

- global Question Studio registry discovery;
- reasoning-v1 package ownership;
- 44-Ql / 8-checkpoint package metadata;
- direct QL generation;
- checkpoint-scoped generation;
- deterministic replay;
- EN / HI / PA semantic answer parity;
- generated-instance difficulty filtering;
- rejection of an impossible QL-specific difficulty request;
- explanation-diagram propagation;
- absence of question-side diagrams;
- all review-only lifecycle gates remain closed.

The existing DIR runtime workflow now executes this integration proof on every relevant DIR pull request.

The wiring assertions deliberately inspect the reasoning adapter and global engine-registry source rather than importing the entire global engine graph into the DIR-scoped strict TypeScript proof. This keeps the DIR audit isolated from unrelated legacy chapter type debt while still proving the actual registration path.

## Safety boundary

This wave does not change:

- chapter solving logic;
- QL ownership;
- answer generation;
- distractors;
- localized question semantics;
- difficulty calibration;
- diagram geometry;
- Question Bank acceptance;
- test-builder eligibility;
- mock-test eligibility;
- public delivery.

## Still open after Wave 09

- explicit multilingual freeze authority;
- final downstream release-boundary proof;
- final chapter closure / production promotion decision.
