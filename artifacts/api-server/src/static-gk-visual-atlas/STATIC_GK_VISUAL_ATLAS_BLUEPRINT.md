# Examtree Static GK Visual Atlas — MVP Blueprint

Status: implementation foundation
Branch: `feature/static-gk-visual-atlas-mvp`
Initial scope: Static GK → India Geography
Primary output: deterministic, exam-linked vertical visual lessons (1080×1920, 9:16)

## 1. Product thesis

The Visual Atlas is not a generic AI-video feed. It is a structured Static GK learning system that compiles verified facts into repeatable map/3D visual lessons, then links those lessons to notes, questions, tests, and revision.

The core rule is:

> AI may propose scripts, narration, captions, and shot ordering. It may not invent geography, labels, routes, dates, classifications, or answer keys.

Every educational claim used by a published visual must resolve to a locked fact and at least one reviewed source reference.

## 2. MVP boundaries

### In scope

- India Geography first.
- 20 pilot lesson candidates.
- Six reusable visual patterns, led by deterministic map animation.
- English master copy first; Hindi and Punjabi share the same fact/scene manifest later.
- 1080×1920 rendered video output.
- One end-of-short exam-style recall question.
- Links from a short to related Static GK topic IDs and question IDs.
- Human approval before publish.

### Explicitly out of scope for MVP

- TikTok-style social features.
- Open-ended user video generation.
- Real-time 3D rendering on student devices.
- Fully generative maps.
- Annual rankings or current data presented as timeless Static GK.
- Automated publishing without QA.

## 3. Content model

The canonical TypeScript contracts live in `types.ts`.

A publishable `StaticGkVisualManifest` contains:

1. identity and taxonomy
2. template selection
3. source references
4. atomic locked facts
5. geographic targets
6. deterministic visual beats
7. localized narration/captions
8. quiz prompt
9. links to related topics/questions
10. renderer/schema versions

This keeps visual rendering downstream of verified knowledge rather than making the video file itself the source of truth.

## 4. Authoring state machine

`backlog`
→ `fact-lock`
→ `storyboard`
→ `render-ready`
→ `rendered`
→ `qa`
→ `approved`
→ `published`
→ `retired`

No state may be skipped in production tooling.

### Gate: fact-lock

Required before storyboard generation:

- every narration claim exists as a `StaticGkFact`
- every fact has at least one source reference
- conflicting source wording is resolved explicitly
- time-sensitive claims are either removed from Static GK or date-stamped
- geographic labels use canonical names

### Gate: render-ready

Required before render job creation:

- visual beats are time-bounded and non-overlapping where exclusivity matters
- every beat references known target IDs and fact IDs
- map geometry references exist
- labels fit a mobile-safe area
- final quiz is answerable using facts taught in the lesson

### Gate: QA

Required before approval:

- factual QA
- map placement QA
- label spelling QA
- narration-caption parity
- answer-key QA
- safe-area/caption overlap QA
- audio intelligibility
- render integrity

## 5. Reusable renderer templates

### A. `india-map-path`

Use for rivers, latitudes/longitudes, coasts, routes, and ordered geographic journeys.

Inputs:

- base geometry
- ordered path points/segments
- labels
- highlights
- camera presets
- beat timing

Never infer path geometry from narration text at render time.

### B. `india-state-highlight`

Use for distributions and state association.

Inputs:

- canonical state/UT IDs
- optional region overlays
- ordered highlights
- legend/callouts

### C. `india-point-zoom`

Use for passes, parks, dams, lakes, cities, ports, and site collections.

Inputs:

- verified coordinates or canonical geometry references
- regional camera framing
- labels and callouts

### D. `india-region-compare`

Use for mountain bands, physiographic regions, or two/three-region comparisons.

### E. `compare-split`

Use for visual comparison such as Western Ghats vs Eastern Ghats.

### F. `rapid-recall`

Use for quiz-heavy revision: map marker → pause → reveal.

## 6. Rendering architecture

Recommended pipeline:

```text
StaticGkVisualManifest
        |
        v
manifest validator
        |
        v
scene compiler
        |
        +--> map geometry loader
        +--> asset registry
        +--> typography/localization
        +--> camera/beat compiler
        |
        v
Blender render worker
        |
        +--> silent master video
        |
        +--> TTS voice track
        +--> captions/subtitles
        +--> music bed (optional, low level)
        |
        v
FFmpeg assembly
        |
        v
QA artifacts + final MP4
```

For the first map-heavy MVP, Blender is useful for 2.5D/3D camera treatment but geographic geometry remains deterministic. We should not use a text-to-video model to draw India, state boundaries, river paths, pass positions, or labels.

## 7. Geometry and asset registry

Create a versioned asset registry rather than storing arbitrary file paths in manifests.

Example logical IDs:

```text
geo.india.states.v1
geo.india.uts.v1
geo.india.coastline.v1
geo.india.rivers.major.v1
geo.south-asia.countries.v1
terrain.india.relief.v1
icon.dam.v1
icon.port.v1
marker.default.v1
```

Each registry entry should track:

- logical asset ID
- file/object storage location
- version
- source/license
- geometry coordinate system where applicable
- checksum
- approved status
- last QA date

Changing a geometry asset creates a new version rather than silently changing past lessons.

## 8. Recommended database entities

Do not create these tables until the manifest and pilot workflow prove stable. The first slice can use versioned manifests in source control.

When database persistence is introduced, use roughly:

### `static_gk_topics`

- `id`
- `slug`
- `domain`
- `category`
- `subcategory`
- `canonical_title`
- `status`
- `created_at`
- `updated_at`

### `static_gk_sources`

- `id`
- `publisher`
- `title`
- `url`
- `edition_or_version`
- `checked_at`

### `static_gk_facts`

- `id`
- `topic_id`
- `statement`
- `stability`
- `exam_importance`
- `status`
- `reviewed_by`
- `reviewed_at`

### `static_gk_fact_sources`

- `fact_id`
- `source_id`

### `static_gk_visuals`

- `id`
- `topic_id`
- `template`
- `manifest_json`
- `schema_version`
- `renderer_version`
- `authoring_state`

### `static_gk_render_jobs`

- `id`
- `visual_id`
- `locale`
- `status`
- `input_manifest_hash`
- `worker_version`
- `started_at`
- `completed_at`
- `error_code`
- `error_detail`

### `static_gk_render_outputs`

- `id`
- `render_job_id`
- `video_url`
- `thumbnail_url`
- `caption_url`
- `duration_ms`
- `checksum`

### `static_gk_visual_reviews`

- `id`
- `visual_id`
- `review_type`
- `reviewer_id`
- `status`
- `notes`
- `created_at`

## 9. API boundary

Recommended eventual API surface:

### Admin authoring

- `GET /api/admin/static-gk/visuals`
- `POST /api/admin/static-gk/visuals`
- `GET /api/admin/static-gk/visuals/:id`
- `PATCH /api/admin/static-gk/visuals/:id`
- `POST /api/admin/static-gk/visuals/:id/fact-lock`
- `POST /api/admin/static-gk/visuals/:id/storyboard`
- `POST /api/admin/static-gk/visuals/:id/render`
- `POST /api/admin/static-gk/visuals/:id/review`
- `POST /api/admin/static-gk/visuals/:id/publish`

### Student delivery

- `GET /api/static-gk/visuals/feed`
- `GET /api/static-gk/visuals/:slug`
- `POST /api/static-gk/visuals/:id/quiz-attempt`

The student feed response should include only published, approved versions.

## 10. Admin UI placement

The existing admin app already exposes `/content/learning-resources` and `/content/media` is a placeholder. The preferred information architecture is:

```text
Content
  Learning Resources
    Notes
    Static GK Visual Atlas
    Current Affairs
  Media
    Asset Registry
    Render Jobs
```

Suggested Visual Atlas screens:

### Atlas overview

- pipeline counts by state
- pilot backlog
- filters by domain/category/template/state
- fact-lock warnings
- recent renders

### Visual editor

Three-column desktop layout:

1. facts/sources
2. scene timeline and storyboard
3. phone preview / render status

### Fact-lock panel

- atomic facts
- source chips
- stability flag
- approve/reject/edit
- conflict warning

### Render review

- video preview
- factual checklist
- map checklist
- caption/narration checklist
- quiz checklist
- approve/reject

## 11. Student experience

Do not launch a generic infinite feed first.

MVP entry points:

1. Static GK Visual Atlas page
2. topic/chapter page embedded visual cards
3. related visual after answering a linked GK question

Each lesson ends with:

```text
1-question recall
→ View note
→ Practice related questions
→ Next connected visual
```

Student telemetry should eventually capture:

- started
- 25/50/75/100% watched
- replayed
- quiz answered
- quiz correct
- opened note
- opened practice

This lets Examtree measure learning value instead of only watch time.

## 12. Localization design

English is the semantic master for MVP, but visual facts and geometry are language-neutral.

Localization changes only:

- narration
- captions
- labels when appropriate
- quiz wording

Localization must never create a second independent fact set.

Recommended flow:

```text
locked facts
  → English educational realization
  → Hindi/Punjabi realization
  → terminology QA
  → same scene manifest
  → locale render
```

## 13. Static-vs-current data policy

Static GK must not accidentally freeze changing data.

Examples requiring special treatment:

- current production ranking
- latest Ramsar count
- newest UNESCO listing count
- current number/classification of ports if official categories change
- current office holders

Such facts must be either:

1. excluded from Static GK visual manifests, or
2. marked `time-sensitive`, date-stamped, and routed through an update/review workflow.

## 14. First 20 pilot candidates

The source-controlled backlog is in `pilot-backlog.ts`.

Priority-1 candidates intentionally emphasize map memory and template reuse:

1. Tropic of Cancer through India
2. Standard Meridian
3. Ganga journey
4. Yamuna tributaries
5. Brahmaputra journey
6. Godavari system
7. Narmada westward course
8. Himalayan range order
9. Western vs Eastern Ghats
10. Himalayan passes
11. major dams and rivers
12. national parks on a map
13. major soil regions
14. India and neighbouring countries

Priority-2 candidates expand the same renderer into biosphere reserves, crop belts, mineral belts, ports, islands, and coastal plains.

## 15. Pilot success criteria

The system is ready to expand beyond the pilot only when:

- 10+ visuals are approved end-to-end
- zero known factual/map defects are present in approved outputs
- at least 80% of the scene work across those lessons comes from reusable templates/assets rather than one-off editing
- a new map lesson can be authored by supplying facts, geometry references, copy, and beat timing without writing new renderer code
- one English lesson can produce Hindi/Punjabi variants without changing geographic scene logic
- quizzes link correctly into Examtree's question/taxonomy system

## 16. Implementation order

### CP-001 — contracts and pilot backlog

- TypeScript domain contracts
- pilot candidate registry
- architecture blueprint

### CP-002 — fact-lock for first three lessons

- authoritative sources
- atomic fact packs
- canonical geo target lists
- educational narration drafts
- quiz drafts

Initial lessons:

1. Tropic of Cancer
2. India's Standard Meridian
3. Journey of the Ganga

### CP-003 — geometry registry

- source/version India state boundaries
- base coastline
- river path strategy
- coordinate normalization
- asset metadata contract

### CP-004 — scene compiler prototype

- manifest validation
- deterministic timeline
- map highlight/path primitives
- camera presets
- renderer fixture output

### CP-005 — first vertical render

- 1080×1920 master
- English TTS
- captions
- quiz end card
- thumbnail

### CP-006 — admin Visual Atlas workspace

- backlog
- fact-lock
- storyboard
- render request
- review state

### CP-007 — student atlas surface

- published lesson API
- atlas listing/detail
- topic links
- quiz handoff

### CP-008 — multilingual

- Hindi and Punjabi realization
- terminology QA
- locale render outputs

## 17. Non-negotiable quality rules

1. No AI-generated geographic boundary may be used as source geometry.
2. No label position may be inferred from a generative video frame.
3. No published narration claim may exist without a locked fact ID.
4. No quiz answer may exist without the supporting locked fact IDs.
5. No visual may be published directly from generation.
6. Static GK must distinguish timeless facts from data that can change.
7. Renderer and geometry versions must be reproducible.
8. Any correction to a locked fact invalidates affected renders and requires re-review.

## 18. Immediate next slice

CP-001 is represented by this blueprint, `types.ts`, and `pilot-backlog.ts`.

Next: complete CP-002 for `SGK-VIS-IND-GEO-001`, `002`, and `003`, beginning with authoritative source gathering and fact lock. Only after those manifests are educationally correct should we build the first renderer primitive.
