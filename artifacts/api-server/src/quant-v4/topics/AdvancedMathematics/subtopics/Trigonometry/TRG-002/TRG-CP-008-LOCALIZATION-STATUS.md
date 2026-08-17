# TRG-002 · TRG-CP-008 Localization Status

Status: **HINDI/PUNJABI LOCALIZATION V1 IMPLEMENTED — SEMANTIC PARITY PASS — REVIEW PACK READY — HUMAN LANGUAGE REVIEW PENDING — MULTILINGUAL FREEZE OFF — ACTIVATION OFF**

## Scope

- CP: `TRG-CP-008 — Shadows, Ladders, Broken Objects & Guy Wires`
- permanent English QLs: `TRG-002-QL-025...048` = **24**
- Hindi learner surfaces: **24**
- Punjabi learner surfaces: **24**
- designated bilingual review records: **48**

## Transformation authority

Localization is layered over the human-approved frozen English 96-QL runtime. English answers, exact answers, option semantics, correct positions, canonical spatial states, diagram evidence and solution diagrams are unchanged.

`localization-cp008-v1.ts` renders learner text from canonical geometry for all six CP008 application families. `localization-cp008-v1-compat.ts` handles one historical naming boundary without altering frozen identity: original QL-045 remains `GUY_WIRE_ANCHOR`, while the Phase-8 wire QLs use `GUY_WIRE_MAST_ANCHOR`. The adapter uses the expanded label only as a rendering alias, restores the frozen family label, and recomputes the localization fingerprint against the exact canonical semantic fingerprint.

Changed-shadow questions use canonical old/new observations where available and reconstruct a missing prior shadow from the frozen height-angle relation when a projection stores only the requested state. Ladder angles are recovered from canonical right-triangle geometry when no redundant observation is stored.

## Green verification checkpoint

Verified head: `4993ea1525562a1040f80beda0cc89bd7d5be1d7`

Workflow: `32055500732` — `Verify TRG-002 CP008 Localization V1` — **SUCCESS**

Passed:

- targeted Trigonometry TypeScript compile;
- frozen English **96 / 96** approval/fingerprint gate;
- **24 QLs × 12 deterministic seeds × 2 locales = 576 localization parity cases**;
- exact answer, option semantic and correct-index equality;
- canonical spatial-state equality;
- solution-diagram and diagram-evidence equality;
- all six CP008 application families;
- legacy QL-045 wire-family identity preservation;
- deterministic localization fingerprint checks;
- Devanagari/Gurmukhi learner-text presence;
- English stem-fragment leak checks;
- localization lifecycle and activation locks;
- deterministic **48-record** Hindi/Punjabi review export and verification.

Review artifact:

- name: `trg-002-cp008-hi-pa-localization-review-v1`
- id: `9296241861`
- digest: `sha256:f2688e3a68386fe9a2b750003f38803281d01ce278c751e4cf8754c1ce8edb67`

The first CP008 run exposed only the historical family-label mismatch on frozen QL-045. TypeScript and the English 96-QL freeze gate were already green. The final compatibility layer preserves the old family identity instead of rewriting frozen metadata.

## Governance boundary

- English source: **HUMAN-APPROVED + FROZEN**
- Hindi/Punjabi semantic parity: **PASS**
- Hindi/Punjabi human language review: **PENDING**
- multilingual freeze: **NOT GRANTED**
- product delivery: **LOCKED**

Still OFF: Hindi/Punjabi runtime activation, Question Studio discovery, Test Builder eligibility, question-bank storage, public publication and automatic product delivery.

## Next checkpoint

CP008 is implementation-stable and review-ready. Human language approval remains separate. The next implementation slice may proceed to `TRG-CP-009 / QL-049...072` while CP007 and CP008 stay review candidates rather than multilingual-frozen content.
