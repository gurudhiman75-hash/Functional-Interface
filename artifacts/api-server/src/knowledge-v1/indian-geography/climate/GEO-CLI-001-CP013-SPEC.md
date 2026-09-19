# GEO-CLI-001 CP013 — Exhaustive Mixed Climate Mastery

Status: REVIEW CANDIDATE V6 — POST-MERGE REMEDIATION SYNC
Parent chapter: `GEO-CLI-001`
Permanent QLs: none; exhaustive closure layer over `QL001–QL108`.
Lifecycle: review-only; runtime/publication disabled until explicit human approval.

## Purpose

CP013 is the chapter-wide exhaustive mastery gate. It creates no new permanent facts or QLs. It must surface exactly one representative question from every permanent QL owned by CP001–CP012, giving 108 questions total.

## Composition

- QL001–QL099: representatives come from the approved final review authorities of CP001–CP011.
- QL100–QL108: representatives are synchronized to the remediated CP012 V2 authority.
- If an owning checkpoint changes before chapter closure, the affected representatives must be refreshed and CP013 requalified.

## Qualification history

### V1–V3
V1 exposed a legacy wording incompatibility. V2 exposed duplicate-stem and difficulty-fallback defects. V3 replaced fallback with exact difficulty assignment plus one-to-one QL-to-stem matching, reaching full 108-QL coverage and exact quota balance.

### V4
Applied seven targeted editorial corrections to awkward wording created by legacy normalization.

### V5 — exam-grade stem pass
Human review found that the master still contained learner-facing stems that read like generated prompts rather than real SSC/Banking-style questions. V5 rewrites all 108 stems for concise, natural competitive-exam phrasing. Facts, options, keyed answers, explanations, difficulty labels, QL ownership and provenance are frozen to V4 and must not drift.

V5 specifically removes loose prompt forms such as `Compare...`, `For cool-season rain...`, `For India's winter climate...`, and `For a climate summary...`. Statement questions use standard `Consider the following statements...` wording.

### V6 — post-merge owning-authority synchronization

V6 refreshes CP013 against `GEO_CLI_001_OWNING_AUTHORITY_V3`, the repaired 648-question owning pool. It inherits the CP002 mechanism fixes, CP012 integration-only fixes, chapter-wide wording cleanup, duplicate-stem remediation, exact chapter-level answer balancing, and targeted Hard/distractor calibration.

V6 preserves the one-question-per-QL closure model. Where the owning semantic payload changed, the representative stem is refreshed from the new source question; otherwise the previously approved V5 exam-grade stem is retained with minor lexical cleanup. Options, keyed answer, explanation, QL ownership and provenance are synchronized to the V3 owning source.

## Source authority

CP013 inherits source and fact provenance from the owning checkpoint. It does not introduce a new truth source.

## Final review contract

- Exactly 108 questions.
- Exactly one question for each `GEO-CLI-001-QL-001` through `GEO-CLI-001-QL-108`.
- No new QL IDs.
- Difficulty: Easy 36 / Medium 60 / Hard 12.
- Answer positions: A27 / B27 / C27 / D27.
- V6 keeps the approved V5 exam-grade stem where the owning semantic payload is unchanged and refreshes the stem where the owning payload changed.
- 108 unique stems, semantic payloads and explanations.
- Four unique options per question and canonical answer alignment.
- V6 must match the V3 owning authority for answer, option set, explanation, QL ownership and provenance.
- Source/fact provenance on every item.
- Zero learner-facing `broad` / `broadly`, `associated with`, internal review/runtime/source terminology, or the weak V4 prompt openers.
- Review-only lifecycle remains active until explicit human approval.

## Closure gate

A review-ready CP013 V6 must pass:
1. exhaustive QL001–QL108 coverage audit,
2. owning-authority synchronization and refreshed-stem audit,
3. wording / uniqueness / provenance / lifecycle checks,
4. exact Markdown/JSON materialization,
5. API server build,
6. main Geography validation,
7. CI hygiene and branch-topology checks,
8. production build compatibility.

Chapter closure can be declared only after CP013 V6 is explicitly approved and merged. Closure still does not authorize public test publication or runtime registration.
