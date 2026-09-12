# ARG-001 — Statement & Arguments — End-to-End Design

Status: CP015 INTERNAL-READY / PUBLIC RELEASE LOCKED
Chapter: Statement & Arguments
Subject: Reasoning
Chapter ID: ARG-001
Subject code: REAS-ARG
Target exams: SSC, Banking, Railways, Punjab/state exams
Current runtime authority: ARG-CP-015
Question Studio: REGISTERED
Languages: English, Hindi, Punjabi

## 1. Purpose

ARG-001 tests whether a candidate can distinguish a strong argument from a weak argument in relation to a stated issue, proposal, policy question or decision.

A strong argument is not merely a statement that sounds sensible or agrees with the proposal. It must raise an important consideration that directly bears on the issue and be logically, practically or normatively defensible. A strong argument may support or oppose the proposal. Both opposing arguments can be strong when both identify material considerations.

The generator evaluates argument quality independently of YES/NO polarity.

## 2. Hard taxonomy boundaries

ARG-001 must not collapse into adjacent chapters.

- Statement & Assumption asks what must be implicitly accepted; ARG judges the strength of an expressly stated reason.
- Statement & Conclusion asks what follows from supplied information; ARG evaluates reasons for or against a proposal.
- Course of Action asks what should be done after a situation; ARG judges the supplied consideration rather than selecting an action.
- Cause & Effect may appear as one reasoning dimension, but ARG is not a causal-direction puzzle.
- Decision Making chooses between decisions; ARG does not choose the final policy.
- Ranking/order/inequality are prohibited as semantic substitutes.

## 3. Permanent semantic QLs

ARG-001 has six permanent question-level families.

### ARG-QL-001 — Direct relevance and materiality
Directly addresses the issue and distinguishes material reasons from tangents, trivial considerations and restatements.

### ARG-QL-002 — Evidence, mechanism and causal support
Distinguishes defensible mechanisms/evidence from bare assertions, unsupported causal leaps, correlation-as-causation and anecdotal overreach.

### ARG-QL-003 — Feasibility and implementation consequences
Tests enforceability, capacity, transition costs, operational bottlenecks and realistic implementation constraints.

### ARG-QL-004 — Scope, proportionality and extremity
Tests bounded versus unjustifiably sweeping claims. Extreme words are not automatically weak; weakness depends on whether the universal scope is supported.

### ARG-QL-005 — Stakeholder, fairness, rights and public-interest trade-offs
Covers legitimate safety, accessibility, equality, privacy, due-process, welfare, autonomy and public-cost considerations while rejecting prejudice, stereotypes and irrelevant emotional/popularity appeals.

### ARG-QL-006 — Counterargument quality, alternatives and second-order effects
Covers viable alternatives, displacement/evasion, proportionality, due process, incentives/access, automated flags, unintended consequences and false dilemmas.

## 4. Permanent semantic depth

The current certified core contains:

- 6 QLs;
- exactly 8 semantic archetypes per QL;
- 48 permanent core templates;
- Easy, Medium and Hard semantic coverage in every QL;
- all four two-argument truth classes in every QL;
- four semantic dimensions per template;
- at least four distinct values per dimension;
- at least 256 semantic combinations per template;
- at least 2,048 raw semantic combinations per QL before later surface scheduling.

A permanent final-chapter structural proof enforces these invariants.

## 5. Answer classes and real-paper profiles

Canonical two-argument truth classes remain:

- ONLY_I
- ONLY_II
- BOTH
- NEITHER

CP015 supports four canonical real-paper presentation profiles:

1. `SSC_RECENT_2X4` — two arguments, four options, Easy/Medium. This is also the certified state/Railway-style two-argument authority.
2. `BANKING_CLASSIC_2X5` — two arguments, five options, Medium/Hard. The fifth `Either I or II` choice is a presentation distractor, not a fifth truth class.
3. `BANKING_COMBO_3X5` — three arguments, five combination options, Medium/Hard.
4. `BANKING_COMBO_4X5` — four arguments, five combination options, Hard.

Explicit delivery aliases route through the same certified 2x4 semantic authority rather than duplicating logic:

- `RRB_2X4`
- `RAILWAY_2X4`
- `PUNJAB_STATE_2X4`
- `STATE_2X4`

Question Studio capabilities expose the real-paper profile catalog so clients do not need hidden hard-coded profile knowledge.

## 6. Difficulty model

Difficulty is semantic, not merely lexical.

EASY:
- one strong reason contrasted with an obvious relevance, triviality or scope defect.

MEDIUM:
- both arguments can look plausible; the distinction depends on mechanism, evidence, scope, feasibility or materiality.

HARD:
- both arguments are materially connected to the issue and require distinguishing defensible trade-offs, calibrated alternatives or due-process concerns from speculative, overbroad, false-dilemma or remote reasoning.
- Banking combination profiles add multi-argument evaluation without changing the underlying strength authority.

## 7. Exam-realness contract

Do not generate:

- circular `Yes because X is good / No because X is bad` constructions;
- arguments that merely repeat the statement;
- cartoonishly absurd distractors;
- irrelevant colour/name/personal-taste trivia;
- partisan persuasion;
- live-current-fact dependencies;
- moral preaching in place of reasoning.

Preferred domains include education/examinations, banking/digital payments, public administration, transport, environment/municipal services, workplace policy, consumer protection, technology/privacy/cyber safety, recruitment and service delivery.

SSC/state/Railway-style items are concise and compact. Banking profiles support richer trade-offs, alternatives, enforcement constraints and second-order effects.

## 8. Argument-strength authority

Each generated argument is backed by hidden deterministic semantic authority including relevance, materiality, support quality, feasibility, scope, stakeholder legitimacy, issue match and typed weakness defects.

Learner wording is never the source of truth. Runtime strength is determined from semantic authority and deterministic template logic, not an LLM-style subjective score.

## 9. Localization

Supported learner languages:

- `en-IN`
- `hi-IN`
- `pa-IN`

Localization must preserve answer class, polarity, scope and strength exactly. Hindi and Punjabi have dedicated naturalness regression gates in addition to the general semantic-alignment and grammar/plain-language gates.

## 10. Explanation contract

Explanations must be short, clear, beginner-readable and tied to the actual argument.

Required behavior:

- say why each supplied argument is strong or weak;
- refer to the concrete reasoning used in that argument;
- do not introduce an unrelated safeguard, mechanism or fact;
- do not merely define a strong argument;
- do not expose hidden authority labels or scoring metadata;
- avoid shortcut/trap boilerplate when a direct explanation is clearer.

CP015 includes permanent semantic-alignment guards for reviewed English, Hindi and Punjabi explanation families.

## 11. Diversity and anti-gaming

The certified CP015 deterministic 1,000-question audit passes:

- 1,000/1,000 exact-unique learner questions;
- 600/600 exact-unique core questions;
- 120/120 SSC 2x4;
- 118/118 Banking classic 2x5;
- 108/108 Banking combo 3x5;
- 54/54 Banking combo 4x5;
- all 48 core templates represented;
- 376 unique real-paper statements in the certified audit sample;
- deterministic replay;
- answer-position/polarity anti-gaming checks.

Exact uniqueness does not by itself prove zero semantic near-duplication, so human-review sampling remains part of release governance.

## 12. Certified human-review surface

CP015 persists a deterministic 216-question trilingual review corpus:

- 72 English;
- 72 Hindi;
- 72 Punjabi;
- 12 questions per QL per language;
- Core, SSC and Banking profile/difficulty coverage.

Permanent gates cover grammar/plain language, semantic explanation alignment, Hindi naturalness, Punjabi naturalness, perceived diversity, Question Studio registration, historical freezes and production builds.

## 13. Checkpoint lineage

- CP001–CP005: taxonomy, authority model, template expansion, localization and early integration.
- CP006: exact historical core freeze.
- CP007: real-paper profile generation.
- CP008: exact historical real-paper freeze.
- CP009: expanded core semantic source.
- CP010–CP012: Question Studio and real-paper semantic/editorial remediation.
- CP013: approved learner-facing editorial surface.
- CP014: records manual approval and internal eligibility without opening public release.
- CP015: deterministic diversity scheduling, final multilingual editorial hardening, semantic/naturalness gates and current Question Studio authority.

The CP006 and CP008 byte freezes remain historical preservation contracts; later checkpoints are additive overlays and must not silently rewrite those authorities.

## 14. Question Studio and lifecycle

CP015 is registered ahead of its historical ARG fallbacks in the canonical Question Studio registry.

Current internal lifecycle:

- Question Bank writable: **true**
- test eligible: **true**
- mock-test eligible: **true**
- lifecycle: `INTERNAL_ELIGIBLE`

Public/student boundary remains closed:

- publicly publishable: **false**
- public release authorized: **false**
- direct student delivery authorized: **false**
- automatic student publication: **false**

Internal readiness must never be interpreted as publication authorization.

## 15. Final acceptance contract

A current ARG-001 build is acceptable only while all of the following remain green:

- six permanent QLs and 48 core semantic templates;
- eight unique semantic archetypes per QL;
- Easy/Medium/Hard and all four canonical answer classes per QL;
- deterministic Question Studio generation;
- certified profile routing including explicit state/Railway aliases;
- English grammar/plain-language checks;
- explanation semantic alignment;
- Hindi and Punjabi naturalness checks;
- 1,000-question exact-uniqueness/diversity proof;
- Question Studio registration/capability contract;
- CP006/CP008 exact byte freezes;
- CP013 approved surface and CP014 approval preservation;
- production API and admin builds;
- public/student release flags remain false until separately authorized.

This document describes the CP015 internal production authority. Public learner release is a separate governance decision.
