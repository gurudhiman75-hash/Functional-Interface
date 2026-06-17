# Generation System Audit - Phase Z

## Active Generation Path

Question Studio is now a thin UI over Quant V4.

Active path:

```text
Question Studio UI
-> /api/generator/pattern or /api/generator/generate
-> quant-v4/generation-engine.ts
-> selected Quant V4 package runtime
-> preview, reasoning graph, traceability, validation, semantic metadata
```

## Single Entry Point

The platform entry point is:

```text
generateQuestion()
```

`generateQuestion()` owns the delegation boundary. It resolves the selected package, CP, difficulty, language, and seed, then calls the selected Quant V4 package runtime.

## Package Discovery

Question Studio package discovery is provided by:

```text
listQuantV4Packages()
```

Discovery scans Quant V4 package folders under:

```text
artifacts/api-server/src/quant-v4/topics
```

Runtime-enabled packages are wired to compiled package pipelines. Packages with educational libraries but no runtime may still be discovered, but are marked disabled.

Verified visible and enabled packages:

- `PCT-001`
- `PCT-002`
- `RAP-001`

## Removed From Question Studio UI

The following UI systems are absent from the active Question Studio surface:

- AI Intake
- Corpus Audit controls
- Corpus Scheduler controls
- Legacy template generator mode
- Quant V2/V3 generation controls
- Corpus queue dashboard
- Corpus export controls
- Scheduler summary panel

## Backend Paths Cleared Or Gated

The following paths no longer execute their old generation/intake behavior:

- `/api/knowledge/extract`
- `/api/knowledge/ingest-file`
- `/api/knowledge/extraction-candidates`
- `/api/knowledge/extraction-candidates/:candidateId/review`
- `/api/generator/pattern/jobs`
- `/api/generator/corpus-audit/*`

These routes return `410 Gone` with `generationSystem: "quant-v4"`.

## Runtime Ownership

Quant V4 package runtime owns:

- generation
- solver
- reasoning graph
- explanation
- validation
- semantic layer
- traceability

Question Studio owns only UI:

- topic selection
- subtopic selection
- archetype selection
- difficulty selection
- language selection
- generation count
- preview
- reasoning graph display
- traceability display
- validation display
- semantic metadata display
- review CSV export

## Verification

- AI Intake UI absent.
- Corpus Scheduler UI absent.
- Corpus Audit UI absent.
- AI intake backend returns `410 Gone`.
- Corpus audit backend returns `410 Gone`.
- Async legacy generation jobs return `410 Gone`.
- PCT-001 visible through Quant V4 discovery.
- PCT-002 visible through Quant V4 discovery.
- RAP-001 visible through Quant V4 discovery.
- Direct generation smoke check returned `generationBackend: "quant-v4"`.

## Final Verdict

QUANT V4 IS THE ONLY QUESTION GENERATION SYSTEM.
