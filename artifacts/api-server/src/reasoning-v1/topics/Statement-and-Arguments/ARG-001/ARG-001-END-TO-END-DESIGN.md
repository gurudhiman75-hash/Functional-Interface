# ARG-001 — Statement & Arguments — End-to-End Design

Status: FOUNDATION / EDITORIAL CONTRACT
Chapter: Statement & Arguments
Subject: Reasoning
Chapter ID: ARG-001
Subject code: REAS-ARG
Target exams: SSC, Banking, Railways, Punjab/state exams
Learner release: CLOSED
Question Studio: NOT YET REGISTERED

## 1. Purpose

ARG-001 tests whether a candidate can distinguish a strong argument from a weak argument in relation to a stated issue, proposal, policy question or decision.

A strong argument is not merely a statement that sounds sensible or agrees with the proposal. It must raise an important consideration that directly bears on the issue and be logically, practically or normatively defensible. A strong argument may support or oppose the proposal. Both opposing arguments can be strong when both identify material considerations.

The generator must therefore evaluate argument quality independently of YES/NO polarity.

## 2. Hard taxonomy boundaries

ARG-001 MUST NOT collapse into adjacent chapters.

- Statement & Assumption: asks what must be implicitly accepted. ARG asks whether a stated reason is strong enough to bear on the issue.
- Statement & Conclusion: asks what follows from supplied information. ARG evaluates reasons for/against a proposal; it does not infer an unstated conclusion.
- Course of Action: asks what should be done after a situation. ARG may discuss feasibility or consequences of a proposal, but the answer is strength/weakness of the given reason.
- Cause & Effect: causal quality may be one dimension of an argument, but ARG is not a standalone causal-direction puzzle.
- Decision Making: ARG does not choose a final policy; it judges the quality of supplied considerations.
- Ranking/Order/Inequality: prohibited as a semantic substitute.

## 3. Permanent semantic QLs

### ARG-QL-001 — Direct relevance and materiality
Tests whether the argument directly addresses the exact issue and raises a material consideration.

Strong examples:
- identifies a major benefit, harm, cost, right, safety consequence or operational effect directly tied to the proposal.

Weak defects:
- irrelevant tangent
- trivial/minor consideration
- restates the question without a reason
- topic-adjacent but decision-irrelevant fact

### ARG-QL-002 — Evidence, mechanism and causal support
Tests whether a claimed effect has a reasonable mechanism or evidentiary basis rather than a naked assertion.

Strong examples:
- plausible mechanism connecting the proposal to the stated outcome
- established/ordinary experience used with calibrated scope

Weak defects:
- unsupported causal leap
- correlation-as-causation
- bare prediction
- anecdote used as universal proof
- circular reasoning

### ARG-QL-003 — Feasibility and implementation consequences
Tests practicality, enforceability, resources and implementation constraints.

Strong examples:
- realistic resource burden
- enforceability risk
- implementation capacity
- transition cost or operational bottleneck that materially affects the proposal

Weak defects:
- impossible or fanciful consequence
- concern with no meaningful bearing on implementation
- assumes unlimited resources/capacity
- claims implementation failure without a mechanism

### ARG-QL-004 — Scope, proportionality and extremity
Tests whether the reason is calibrated to the issue.

Strong examples:
- proportionate claim with bounded language
- recognizes limited conditions or exceptions where relevant

Weak defects:
- all/always/never/only claims without justification
- one benefit used to prove total superiority
- one drawback used to prove complete rejection
- sweeping generalization from a narrow case

Important: extreme words are not automatically weak. They are weak only when the authority does not justify the universal scope.

### ARG-QL-005 — Stakeholder, fairness, rights and public-interest trade-offs
Tests whether an argument raises a legitimate material stakeholder or normative consideration.

Strong examples:
- safety, accessibility, equality, privacy, due process, public cost, welfare, autonomy, fairness
- relevant distributional effect on a materially affected group

Weak defects:
- prejudice or stereotype
- emotional appeal with no issue-specific reason
- popularity/celebrity/authority appeal used as substitute for reasoning
- personal convenience treated as overriding public policy without materiality

### ARG-QL-006 — Counterargument quality, alternatives and second-order effects
Tests more mature critical-reasoning arguments common in Banking/state-exam style.

Strong examples:
- credible unintended consequence
- opportunity cost
- displacement/black-market/evasion effect
- viable alternative that materially weakens the necessity of the proposal
- balanced exception that directly changes the policy case

Weak defects:
- speculative slippery slope with no mechanism
- alternative unrelated to the stated objective
- false dilemma
- counterargument attacking a different proposal
- remote second-order possibility presented as decisive

## 4. Answer classes

Active canonical answer classes:
- ONLY_I
- ONLY_II
- BOTH
- NEITHER

The active generator will use a four-way presentation:
1. Only argument I is strong.
2. Only argument II is strong.
3. Both arguments I and II are strong.
4. Neither argument I nor II is strong.

Do not infer strength from YES/NO direction. The scheduler must balance answer classes.

A five-option `EITHER_I_OR_II` profile is NOT active in V1. It may be added later only with an explicit exam-source justification and a deterministic semantic contract.

## 5. Argument-strength authority model

Each generated argument must carry hidden semantic authority fields; surface wording is never the source of truth.

Required dimensions:
- relevance: DIRECT | INDIRECT | IRRELEVANT
- materiality: MAJOR | MINOR | TRIVIAL
- support: GROUNDED | PLAUSIBLE | ASSERTED | FALLACIOUS
- feasibility: REALISTIC | UNCERTAIN | IMPRACTICAL | NOT_APPLICABLE
- scope: CALIBRATED | OVERBROAD | ABSOLUTE_UNJUSTIFIED
- stakeholderLegitimacy: LEGITIMATE | WEAK | PREJUDICIAL | NOT_APPLICABLE
- issueMatch: EXACT | PARTIAL | DIFFERENT_ISSUE
- fallacies: zero or more typed defects

Canonical strength must be determined from the semantic authority, never by LLM-style subjective scoring at runtime.

## 6. Strong/weak decision principle

A strong argument must:
1. match the exact issue,
2. raise an important/material consideration,
3. provide a defensible reason rather than a bare assertion or fallacy,
4. avoid unjustified scope/extremity,
5. be sufficiently plausible/practical for the exam context.

An argument can be strong even when:
- it opposes the statement,
- the other argument is also strong,
- it is not conclusive enough to determine the final policy.

An argument is weak when a material defect defeats its usefulness for forming a reasoned opinion.

## 7. Exam-realness contract

The old synthetic pattern used in some generated reasoning systems is prohibited.

Do not generate:
- `Should X happen? I. Yes, because X is good. II. No, because X is bad.`
- arguments that merely repeat statement vocabulary
- cartoonishly absurd distractors
- trivia such as colour, naming, personal taste unless truly material
- politically loaded partisan persuasion
- unverifiable current-fact claims that make correctness depend on live news
- moral preaching instead of reasoning

Preferred statement domains:
- education and examinations
- banking and digital payments
- public administration
- transport and road safety
- environment and municipal services
- workplace policy
- consumer protection
- technology/privacy/cyber safety
- public health administration without medical diagnosis/treatment claims
- recruitment and service delivery

SSC profile:
- concise issue statement
- compact arguments
- one inferential defect at a time on easy/medium items

Banking/state critical-reasoning profile:
- richer context
- trade-offs, enforcement, costs, alternatives and second-order effects
- plausible weak arguments, not joke distractors

## 8. Difficulty model

EASY
- one argument clearly strong, one with a single obvious relevance/triviality/extreme defect

MEDIUM
- both arguments plausible on surface; weakness depends on unsupported leap, scope or implementation defect

HARD
- both arguments materially related; candidate must distinguish a defensible trade-off from a speculative/false-dilemma/remote concern
- both-strong and neither-strong cases included

## 9. Surface architecture

Minimum production target after expansion:
- 6 permanent QLs
- at least 8 distinct semantic archetypes per QL
- at least 8 variableized templates per QL
- at least 256 semantic variants per template
- >= 2048 unique semantic surfaces per QL
- EN/HI/PA parity

No metadata-only uniqueness. A different seed must change learner-visible semantic content within the certified cycle.

## 10. Localization

Locales:
- en-IN
- hi-IN
- pa-IN

Localization happens only after English semantic authorities pass exam-realness review.

Rules:
- preserve strength/weakness exactly
- preserve polarity and scope
- avoid unnatural literal translation of `strong argument`
- use standard exam terminology consistently
- no accidental strengthening/weakening through modal words

## 11. Explanation contract

Explanation must be short, human and issue-specific.

Good form:
`Argument I is strong because it directly addresses the safety objective and gives a plausible mechanism by which the restriction can reduce risk. Argument II is weak because it makes a sweeping claim about all users without support.`

Avoid:
- repeating the full stem
- generic definitions only
- hidden metadata labels in learner prose
- formula-like scoring dumps

## 12. Anti-gaming requirements

The proof suite must enforce:
- answer-class balance
- YES/NO polarity independent of strength
- no fixed strength by argument position
- no recurring lexical cue for strong/weak
- no unresolved placeholders
- no duplicated semantic surface inside certified cycle
- both-supporting, both-opposing and opposing-polarity pairs where semantically valid
- all four answer classes across every QL

## 13. Foundation checkpoints

ARG-CP-001 — taxonomy + semantic authority model + English micro-corpus
ARG-CP-002 — exhaustive English archetype/template expansion and exam-realness audit
ARG-CP-003 — saturation scheduler + anti-gaming + answer balance
ARG-CP-004 — Hindi/Punjabi localization parity
ARG-CP-005 — Question Studio review integration
ARG-CP-006 — freeze/certification

Learner release remains a separate approval after CP006.

## 14. Initial source calibration

Current exam-prep material and recent official-style questions consistently frame strong arguments as important/directly related considerations, and recent examples include cases where opposing arguments are both strong because each raises a material practical or fairness consideration. This design adopts that stable exam convention but authors original Examtree content.

## 15. V1 acceptance gates

Before Question Studio registration:
- 6/6 QLs represented
- all four answer classes represented per QL
- >= 8 semantic archetypes per QL
- no taxonomy leakage into STA/STC/Course-of-Action
- English exam-realness audit green
- strong/weak authority deterministic
- explanation human-readable
- learner lifecycle flags closed

Before freeze:
- >= 2048 unique semantic surfaces per QL
- full EN/HI/PA parity
- anti-gaming proof green
- production API/admin build green
- shared registry integration green
- explicit freeze manifest/proof

Question Bank, test, mock, public and automatic learner publication remain CLOSED until separate explicit release approval.
