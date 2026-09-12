# ARG-001 Real-Paper Parity Audit

Status: **CHAPTER CLOSURE BLOCKED — REAL-PAPER FORMAT GAPS FOUND**

Authority reviewed: `ARG_CP006_IMMUTABLE_FREEZE_V1`
Review target: uploaded past-exam reasoning sources for Statement & Arguments.

## What matches well

The frozen ARG-001 semantic core is strongly aligned with the dominant recent two-argument format represented in the uploaded sources:

- statement/question followed by Arguments I and II;
- strong-vs-weak evaluation based on relevance, materiality, plausible support, feasibility, proportionality and stakeholder impact;
- four outcome classes at semantic level: only I, only II, both, neither;
- recent examples tagged RRB NTPC 2021, UPPCS 2021, RRB Group D 2017/2018, UP Police 2018/2019 and similar use the same two-argument decision task;
- frozen ARG-001 already covers the major weak-argument defects seen in those papers: irrelevant/trivial grounds, unsupported universal claims, popularity/other-country appeals, weak causal claims, false dilemmas, disproportionate responses and implementation objections.

## Real-paper gaps found

### 1. Banking multi-argument format is not generated

The uploaded banking source contains tagged SBI PO / Bank PO questions with **three arguments** and **four arguments** followed by combination-style answer options (for example, `Only I and III are strong`, `All are strong`, `None is strong`).

Current ARG-001 runtime generates exactly two arguments. Therefore ARG-001 cannot yet be called exhaustive for the stated Banking exam target.

**Severity: BLOCKER for final chapter closure.**

### 2. Five-option presentation profile is not represented

Some uploaded real questions use five answer choices, including an `Either I or II is strong` option, while the frozen Question Studio runtime exposes the four canonical outcomes only.

This is primarily a **presentation/profile gap**, not a semantic solver gap: the four canonical truth states remain valid for two independently judged arguments, but the exam-facing option set should be able to reproduce the five-choice paper style where required.

**Severity: MEDIUM; required for paper-realistic banking/UPSI presentation coverage.**

### 3. Easy/medium surfaces are somewhat longer than many recent real-paper questions

Recent tagged RRB/UPPCS/UPSI questions are frequently terse: a short policy statement and one-sentence arguments. ARG-001 has strong semantic realism, but several generated Easy/Medium surfaces are more elaborated and conditional than the source-paper style.

This does not create answer-validity problems, but a final exam-realness pass should add a concise surface profile rather than rewriting the frozen semantic authority silently.

**Severity: MEDIUM editorial/presentation gap.**

## Closure decision

**DO NOT CLOSE ARG-001 YET.**

CP006 remains valid as an immutable certified two-argument semantic authority and must not be mutated silently. A superseding post-freeze parity checkpoint should add:

1. 2-argument / 4-option modern profile (retain existing behavior);
2. 2-argument / 5-option exam presentation profile;
3. 3-argument combination-answer profile;
4. 4-argument combination-answer profile;
5. concise real-paper surface mode for Easy/Medium questions;
6. trilingual parity and Question Studio review integration for the added profiles;
7. new exhaustive proof and superseding freeze only after all profiles pass.

Learner release remains locked. CP006 frozen files remain unchanged until an explicit superseding authority is certified.
