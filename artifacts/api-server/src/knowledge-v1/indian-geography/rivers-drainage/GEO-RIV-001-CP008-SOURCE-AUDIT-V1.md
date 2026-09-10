# GEO-RIV-001-CP008 — Sources, Origins & Mouths — Source Audit V1

## Scope
CP008 tests stable source/origin and mouth/outfall facts for Indian river systems already researched in GEO-RIV-001. It is a cross-system projection, not a second factual authority.

## Truth authorities
CP008 reuses the reviewed, source-backed facts already present in:
- CP002 — Indus River System
- CP003 — Ganga River System
- CP004 — Brahmaputra River System
- CP005 — East-flowing Peninsular Rivers

Their original official/textbook source metadata and locators remain attached to every projected fact. CP008 adds no coaching-site truth authority.

## Approval boundary
CP006 — West-flowing Peninsular Rivers is still at human review. Its source/origin/mouth facts are therefore excluded from CP008 V1. The projection must fail closed if CP006 candidate facts enter before explicit approval/freeze.

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

## Explicit exclusions
- tributary and confluence topology (CP007)
- river-state course coverage except source state (CP009)
- dams/projects/reservoirs (CP010)
- cities on rivers (CP012)
- changing policy/treaty/project-status facts
- disputed or source-conflicting over-precision
- synthetic reconciliation of differing source conventions

## Editorial conventions
Where a river has multiple compatible source facts, the generator must preserve the stored relation wording. For example, `originates_from`, `originates_near`, `originates_at`, source region, range, state and district are not interchangeable.

Questions must use direct competitive-exam wording. Difficulty comes from combining stable facts, not from obscure vocabulary.

## Visual policy
Text-first. Maps/photos/diagrams remain optional manual editorial attachments in Question Studio and are never required for validity.
