# Current Affairs CP-030 — Generic Verified-Fact Authoring

## Production problem

After CP-029 restored Punjab official coverage, Generate Yesterday could still complete with `English daily packs ... incomplete`.

The recovery path only compiles events that are:

- verified;
- exam-recommended; and
- learner-authoring `ready` or manually accepted.

The existing deterministic authoring engine supported only a small set of shapes: appointments, RBI policy/index facts, MoUs, selected ISRO mission facts and programme outlays. Many legitimate official releases therefore became `needs_editorial` even when their atomic fact graph was verified.

## CP-030 changes

### Broader official-headline atomic facts

The intelligence extractor now recognizes additional bounded factual structures in official headlines, including:

- formal government actions such as notifies, issues, approves, releases, inaugurates, conducts, holds, leads, performs and opens;
- planned official actions such as `to release`, `to inaugurate`, `to conduct`, etc.;
- passive completed events such as `NEET-PG 2026 Successfully Conducted ...`.

These patterns materialize atomic fields such as acting entity, official action, action subject, initiative and event status. They do not create learner copy directly.

### Generic verified-fact authoring

When a verified event does not match a specialist authoring template, the authoring engine can now use a fallback only when at least two reconciled atomic facts are present.

The fallback:

- renders from atomic fact keys/values rather than copying the discovery/source headline;
- keeps the existing 0.72 source-title similarity gate;
- rejects one-fact/thin events as `needs_editorial`;
- keeps specialist templates preferred when available;
- supports the newer Punjab source names without granting them special authority.

## Safety invariants

CP-030 does not change:

- evidence or auto-verification thresholds;
- fact-conflict gates;
- the 80% official-source coverage threshold;
- required National/Economy/Punjab source domains;
- release approval;
- Question Bank promotion;
- learner publication;
- trusted-news discovery authority.

A source headline alone is not learner content. It first yields bounded atomic claims, those claims still pass reconciliation and event-verification gates, and only verified facts may reach automatic authoring.
