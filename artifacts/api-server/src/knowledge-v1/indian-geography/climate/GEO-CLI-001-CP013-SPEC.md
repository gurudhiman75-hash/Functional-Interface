# GEO-CLI-001 CP013 — Exhaustive Mixed Climate Mastery

Status: REVIEW CANDIDATE V5
Parent chapter: `GEO-CLI-001`
Permanent QLs: none; exhaustive closure layer over `QL001–QL108`.
Lifecycle: review-only; runtime/publication disabled until explicit human approval.

## Purpose

CP013 is the chapter-wide exhaustive mastery gate. It creates no new permanent facts or QLs. It must surface exactly one representative question from every permanent QL owned by CP001–CP012, giving 108 questions total.

## Composition

- QL001–QL099: representatives come from the approved final review authorities of CP001–CP011.
- QL100–QL108: representatives are synchronized to approved and merged CP012 V1.
- If an owning checkpoint changes before chapter closure, the affected representatives must be refreshed and CP013 requalified.

## Qualification history

### V1–V3
V1 exposed a legacy wording incompatibility. V2 exposed duplicate-stem and difficulty-fallback defects. V3 replaced fallback with exact difficulty assignment plus one-to-one QL-to-stem matching, reaching full 108-QL coverage and exact quota balance.

### V4
Applied seven targeted editorial corrections to awkward wording created by legacy normalization.

### V5 — exam-grade stem pass
Human review found that the master still contained learner-facing stems that read like generated prompts rather than real SSC/Banking-style questions. V5 rewrites all 108 stems for concise, natural competitive-exam phrasing. Facts, options, keyed answers, explanations, difficulty labels, QL ownership and provenance are frozen to V4 and must not drift.

V5 specifically removes loose prompt forms such as `Compare...`, `For cool-season rain...`, `For India's winter climate...`, and `For a climate summary...`. Statement questions use standard `Consider the following statements...` wording.

## Source authority

CP013 inherits source and fact provenance from the owning checkpoint. It does not introduce a new truth source.

## Final review contract

- Exactly 108 questions.
- Exactly one question for each `GEO-CLI-001-QL-001` through `GEO-CLI-001-QL-108`.
- No new QL IDs.
- Difficulty: Easy 36 / Medium 60 / Hard 12.
- Answer positions: A27 / B27 / C27 / D27.
- All 108 stems rewritten in V5.
- 108 unique stems, semantic payloads and explanations.
- Four unique options per question and canonical answer alignment.
- V5 must produce zero non-stem drift from V4.
- Source/fact provenance on every item.
- Zero learner-facing `broad` / `broadly`, `associated with`, internal review/runtime/source terminology, or the weak V4 prompt openers.
- Review-only lifecycle remains active until explicit human approval.

## Closure gate

A review-ready CP013 V5 must pass:
1. exhaustive QL001–QL108 coverage audit,
2. all-108 stem rewrite and non-stem-drift audit,
3. wording / uniqueness / provenance / lifecycle checks,
4. exact Markdown/JSON materialization,
5. API server build,
6. main Geography validation,
7. CI hygiene and branch-topology checks,
8. production build compatibility.

Chapter closure can be declared only after CP013 V5 is explicitly approved and merged. Closure still does not authorize public test publication or runtime registration.
