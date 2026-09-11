# GEO-RIV-001-CP008 — Sources, Origins & Mouths — Source Audit V1

## Scope
CP008 tests stable source/origin and mouth/outfall facts for Indian river systems already researched in GEO-RIV-001. It is a cross-system projection, not a second factual authority.

## Truth authorities
CP008 reuses reviewed/source-backed facts already present in:
- CP001 — approved normalized drainage/outfall and mouth-type relations
- CP002 — Indus River System
- CP003 — Ganga River System
- CP004 — Brahmaputra River System
- CP005 — East-flowing Peninsular Rivers

CP001 is admitted only because its final V2 authority is already approved; it contributes stable `drains_into` and `has_mouth_type` facts, including Arabian Sea/Bay of Bengal and estuary/delta contrasts. Original official/textbook source metadata and locators remain attached to every projected fact. CP008 adds no coaching-site truth authority.

## Approval boundary
CP006 — West-flowing Peninsular Rivers is still at human review. Its source/origin/mouth facts are excluded from CP008 V1. The projection must fail closed if CP006 candidate facts enter before explicit approval/freeze.

## Included relation families
### Source / origin
- `originates_from`
- `originates_near`
- `originates_at`
- `source_point`
- `source_region`
- `source_range`
- `source_state`
- `source_district`

### Mouth / outfall
- `drains_into`
- `has_mouth_type`

## Explicit exclusions
- tributary and confluence topology (CP007)
- river-state course coverage except source state (CP009)
- dams/projects/reservoirs (CP010)
- cities on rivers (CP012)
- changing policy/treaty/project-status facts
- disputed or source-conflicting over-precision
- synthetic reconciliation of differing source conventions

## Editorial conventions
Where a river has multiple compatible source facts, the generator preserves the stored relation wording. `originates_from`, `originates_near`, `originates_at`, source region, range, state and district are not interchangeable.

Questions use direct competitive-exam wording. Difficulty comes from combining stable facts, not from obscure vocabulary. Mouth questions must distinguish receiving-water facts from mouth-type facts rather than blur them together.

## Visual policy
Text-first. Maps/photos/diagrams remain optional manual editorial attachments in Question Studio and are never required for validity.
