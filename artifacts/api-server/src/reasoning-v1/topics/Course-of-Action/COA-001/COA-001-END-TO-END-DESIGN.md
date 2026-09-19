# COA-001 — Course of Action

Status: **COA-CP-012 INTERNAL ELIGIBILITY CANDIDATE / APPROVAL PENDING**

## 1. Chapter purpose

COA-001 owns exam-style **Course of Action** questions in which a situation, problem, policy issue, incident, or operational difficulty is followed by one or more proposed actions. The learner must judge whether an action should reasonably follow from the information given.

The chapter tests **practical reasoning**, not moral preference, political opinion, general knowledge, or whether an action sounds impressive.

A valid course of action should normally be:

- relevant to the stated problem;
- directed at the actual cause, risk, or operational need visible in the statement;
- feasible within the stated or reasonably implied authority;
- proportionate to the seriousness of the problem;
- specific enough to address the problem rather than merely restating it;
- supported by the supplied facts without inventing outside circumstances;
- safe from obvious contradiction with an explicit constraint in the statement.

An action is not automatically valid merely because it is positive, strict, preventive, popular, expensive, or socially desirable.

## 2. Chapter boundary

COA-001 is distinct from neighbouring critical-reasoning chapters.

- **Statement & Assumption (STA):** asks what must be implicitly taken for granted.
- **Statement & Conclusion (STC):** asks what logically follows from the supplied facts.
- **Statement & Arguments (ARG):** asks whether a reason is strong and relevant to a proposition.
- **Cause & Effect (CAE):** asks about causal direction, relationship, or causal structure.
- **Course of Action (COA):** asks what practical response should reasonably be taken after the stated situation.
- **Decision Making:** applies explicit rules/criteria to a case; COA does not require a formal eligibility rule table.

COA must not collapse into “what is a good idea?” The answer must be tied to the exact problem and constraints in the stem.

## 3. Core semantic test

Every proposed action is evaluated against the following dimensions.

1. **Problem relevance** — Does it address the stated issue rather than a side issue?
2. **Actionability** — Is it an actual step that can be taken?
3. **Authority / control** — Can the implied actor reasonably take or initiate it?
4. **Feasibility** — Does the statement contain a constraint that makes it impossible or self-defeating?
5. **Proportionality** — Is it excessive, punitive, or disruptive relative to the stated problem?
6. **Evidence fit** — Does it rely on facts not supplied in the statement?
7. **Expected usefulness** — Would it plausibly reduce, investigate, prevent, contain, or resolve the stated problem?
8. **Procedural fairness** — When the statement only establishes suspicion or uncertainty, an irreversible punitive action normally requires verification first.
9. **Non-redundancy** — An action that merely repeats the problem or states a vague wish is not enough.
10. **Constraint consistency** — The action must not directly violate an explicit resource, timing, legal, safety, or operational constraint in the stem.

These dimensions form the semantic authority. Learner-facing explanations should use ordinary language and only mention the dimensions necessary for that question.

## 4. Permanent Question Logic allocation

The final-frozen semantic allocation contains eight active QLs: COA-QL-001..006, COA-QL-008 and COA-QL-009. COA-QL-007 is retired from future semantic expansion and survives only as a legacy presentation/calibration identifier. No additional permanent semantic QL was justified by CP008 source saturation.

### COA-QL-001 — Direct remedial action

The statement presents a clear current problem and the action directly addresses it.

Typical operations:
- repair a service failure;
- correct an administrative process;
- provide a missing facility;
- remove an identified operational bottleneck.

Primary traps:
- unrelated but desirable action;
- restating the problem;
- excessive blanket restriction;
- action aimed at a different cause.

### COA-QL-002 — Preventive / risk-reduction action

The problem exposes a repeatable risk and the proposed action is preventive rather than merely reactive.

Typical operations:
- inspection or maintenance;
- safety protocol;
- backup or contingency;
- awareness/training tied to the exact risk;
- targeted monitoring.

Primary traps:
- generic awareness with no connection to the failure mechanism;
- universal ban where targeted prevention is sufficient;
- prevention against a risk not present in the statement.

### COA-QL-003 — Investigation / verification before irreversible action

The statement contains uncertainty, allegation, anomaly, complaint, or incomplete evidence. The correct response may be to verify facts before punishment, closure, cancellation, or other irreversible action.

Primary traps:
- immediate punishment based only on suspicion;
- ignoring a material warning sign;
- investigation unrelated to the uncertainty actually present;
- indefinite delay disguised as verification.

### COA-QL-004 — Administrative / institutional response

The situation concerns an institution, public service, workplace, school, bank, examination body, transport system, or similar organized setting. The action must be within a realistic administrative response range.

Primary traps:
- action outside the actor’s authority;
- impractical organization-wide shutdown;
- symbolic action with no operational link;
- transferring responsibility without addressing the problem.

### COA-QL-005 — Constraint-aware action

The stem provides an explicit limitation such as time, funds, staffing, capacity, safety, access, or continuity of service. The learner must judge actions against that constraint.

Primary traps:
- action that solves the problem only by violating the stated constraint;
- assuming unlimited resources;
- treating a temporary constraint as permanent;
- choosing the cheapest action despite ineffectiveness.

### COA-QL-006 — Proportionality and overreaction

Several actions are relevant, but one may be excessive compared with the stated problem.

Primary traps:
- blanket ban for a localized problem;
- permanent closure for a temporary failure;
- severe punishment before verification;
- replacing an entire system when a narrow correction is adequate.

Hard questions should make the excessive action superficially attractive, not absurd.

### COA-QL-007 — Retired semantic identifier / legacy paired presentation

QL007 is **not** an active semantic family. Paired I/II judgment is a presentation layer applied to the active semantic authorities. The two historical CP001 QL007 calibration states remain frozen only for backward compatibility and audit traceability. New semantic generation must reject QL007 as a selector.

### COA-QL-008 — Multi-step / ordered response

The problem reasonably requires a sequence such as:
- verify → contain → correct;
- temporary safeguard → investigation → permanent remedy;
- immediate service restoration → root-cause prevention.

The learner operation is not merely “both actions are good”; the order or dependency matters.

Primary traps:
- irreversible step before required verification;
- long-term measure presented as the only immediate response;
- correct steps in a harmful order;
- action that becomes unnecessary after the first step resolves the issue.

### COA-QL-009 — Integrated exam-grade discrimination

Mixed higher-depth cases combining relevance, feasibility, proportionality, authority, evidence, and sequencing.

This QL is reserved for genuinely integrated reasoning and must not become a dumping ground for ordinary paired questions.

## 5. Exam presentation profiles

Presentation is separate from semantic QL identity.

Initial supported profiles should be source-audited before freeze, but the engine must be capable of:

- `TWO_ACTION_FOUR_WAY` — Course I and II; only I / only II / both / neither;
- `TWO_ACTION_FIVE_CODE` — conventional five-option coded presentation where source-supported;
- `THREE_ACTION_COMBINATION` — I/II/III combination format where source-supported;
- `SEQUENCE_ACTION` — choose the correct order or next action.

`SINGLE_BEST_ACTION` is excluded from core COA and belongs to the Decision Making / situational-judgment boundary.

No profile should be labelled direct-PYQ-backed until dated source evidence is recorded.

## 6. Scenario architecture

Generation must be **scenario-first and semantic-authority-first**, not sentence-template-first.

A scenario world should contain:

- `actor` — institution/person/body capable of acting;
- `problem` — explicit learner-visible issue;
- `affectedGroup` — who/what is affected;
- `causeEvidence` — optional known cause, suspected cause, or unknown cause;
- `constraints` — explicit operational limits;
- `urgency` — immediate / routine / long-term;
- `reversibility` — whether a proposed action is easy to reverse;
- `authorityScope` — what the actor can plausibly do;
- `candidateActions` — authored actions with semantic evaluations;
- `actionDependencies` — optional ordered or prerequisite relations;
- `sourceProfileTags` — exam/presentation provenance only.

Each candidate action must carry authored semantic metadata rather than being judged from keywords.

Implemented CP001 action authority dimensions:

```text
relevance: DIRECT | INDIRECT | UNRELATED
actionability: ACTIONABLE | VAGUE_WISH | RESTATEMENT
authorityFit: WITHIN_SCOPE | ESCALATABLE | OUTSIDE_SCOPE
feasibility: FEASIBLE | CONSTRAINED | IMPOSSIBLE
proportionality: PROPORTIONATE | EXCESSIVE | INSUFFICIENT
evidenceFit: SUPPORTED | UNSUPPORTED | CONTRADICTED
expectedUtility: HIGH | MODERATE | LOW | HARMFUL
urgencyFit: IMMEDIATE | FOLLOW_UP | MISMATCHED
constraintFit: COMPATIBLE | NOT_APPLICABLE | VIOLATES
sequenceFit: NOT_APPLICABLE | VALID_STEP | WRONG_ORDER | REDUNDANT_AFTER_PRIOR
verdict: FOLLOWS | DOES_NOT_FOLLOW
```

The verdict is checked by an independent semantic evaluator in `action-validity-model.ts`; learner-facing wording is not used to infer correctness.

## 7. Scenario family targets

The initial English discovery should deliberately cover multiple domains so that the chapter does not feel machine-generated from one administrative template.

Required family groups:

- public services and utilities;
- banking and customer operations;
- workplace and institutional administration;
- schools/examinations/training;
- transport and logistics;
- public safety and crowd management;
- health-service operations without medical-diagnosis reasoning;
- digital services and data/process failures;
- agriculture/rural service delivery where wording remains standard and nationally understandable;
- consumer/service complaints;
- infrastructure and maintenance;
- environmental or civic operational issues where no political opinion is required.

Do not use local-city trivia or names as a source of difficulty.

## 8. Distractor taxonomy

Distractors must be plausible courses of action, not nonsense.

Permanent distractor mechanisms should include:

- `UNRELATED_GOOD_ACTION`
- `RESTATES_PROBLEM`
- `OUTSIDE_AUTHORITY`
- `UNSUPPORTED_ASSUMPTION`
- `EXCESSIVE_RESPONSE`
- `TOO_WEAK_TO_ADDRESS_PROBLEM`
- `CONSTRAINT_VIOLATION`
- `PREMATURE_PUNITIVE_ACTION`
- `WRONG_TARGET`
- `WRONG_TIMING`
- `LONG_TERM_ONLY_WHEN_IMMEDIATE_ACTION_REQUIRED`
- `SHORT_TERM_ONLY_WHEN_ROOT_CAUSE_RESPONSE_REQUIRED`
- `CORRECT_ACTION_WRONG_SEQUENCE`
- `SYMBOLIC_BUT_INEFFECTIVE`
- `DUPLICATE_OR_REDUNDANT_ACTION`

Hard questions should use near-miss distractors that fail on one material dimension, not obscure vocabulary.

## 9. Difficulty model

Difficulty must come from reasoning depth, not harder English.

### Easy
- clear problem;
- one direct useful action versus clearly irrelevant/excessive alternatives;
- no hidden constraint interaction;
- short explanation.

### Medium
- two plausible actions;
- one explicit constraint, authority issue, or evidence requirement;
- paired I/II judgment may require independent evaluation.

### Hard
- multiple plausible actions with one decisive semantic distinction;
- uncertainty plus proportionality or sequencing;
- explicit constraint interaction;
- no answer should depend on outside specialist knowledge.

## 10. Stem rules

Stems must read like real SSC/Banking/Punjab-state reasoning questions.

Rules:

- keep language simple and direct;
- state all facts required to judge the action;
- do not add unnecessary scene-setting;
- avoid repeated filler such as “associated with”, “in relation to”, or explanatory boilerplate;
- do not reveal the intended criterion in the stem;
- do not make the correct action uniquely longer or more detailed;
- avoid culturally or politically loaded framing when a neutral operational scenario can test the same reasoning;
- retain conventional exam instructions where they are genuinely instructional rather than substantive stem variety.

## 11. Explanation rules

Explanations must be simple enough for a beginner.

Preferred structure:

1. identify the actual problem;
2. explain what Action I would do and whether it addresses that problem;
3. explain Action II independently when present;
4. mention the decisive issue — relevance, feasibility, evidence, authority, proportionality, constraint, or order;
5. state the coded answer.

Do not provide verbose option-by-option commentary when a short independent judgment of the courses is enough.

No shortcut language such as “extreme words are always wrong.” An apparently strict action can be correct when the scenario justifies it.

## 12. Anti-gaming rules

Permanent QA must prevent:

- answer position concentration;
- “both follow” becoming dominant;
- a particular domain mapping to one answer class;
- longer action = correct answer;
- “investigate” being automatically correct;
- any absolute word automatically implying invalidity;
- Easy/Medium/Hard mapping to predictable answer classes;
- one scenario family dominating review packs;
- identical action pairs resurfacing with only noun substitution.

Semantic fingerprints should ignore superficial wording and track the underlying problem/action/verdict configuration.

CP001 already enforces equal chapter-level answer-class balance: 6 Only-I, 6 Only-II, 6 Both, and 6 Neither scenarios.

## 13. Localization

English semantic authority should freeze before full Hindi/Punjabi expansion.

Hindi and Punjabi localization must preserve:

- same scenario state;
- same action verdicts;
- same answer class and position;
- same difficulty;
- same constraint/evidence/authority relations;
- natural native wording rather than literal translation.

English leakage in learner-facing Hindi/Punjabi content is not acceptable except unavoidable standard abbreviations or proper nouns explicitly approved by the locale contract.

## 14. Source audit requirements

Before final freeze, source review must establish:

- which two-action/five-code presentations are directly observed;
- whether three-action combinations are materially present in target exams;
- source frequency of preventive, investigative, administrative, and proportionality patterns;
- whether “single best action” belongs inside the same chapter for target exams or should remain a separate decision-making presentation;
- any Punjab-state-specific presentation differences that change the renderer but not semantic QL identity.

Source evidence may change presentation profiles or add a genuinely new QL, but should not cause cosmetic QL fragmentation.

## 15. Checkpoint roadmap

### COA-CP-001 — English semantic foundation — IMPLEMENTED / HUMAN REVIEW PENDING
- chapter boundary and action-validity dimensions are encoded;
- initial two-action semantic authority model is implemented;
- 24-question English calibration corpus covers all nine proposed QLs;
- answer classes are exactly balanced 6/6/6/6 at chapter level;
- independent semantic evaluator and executable proof are present;
- human review pack: `COA-CP-001-ENGLISH-REVIEW.md`;
- no Question Studio integration.

### COA-CP-002 — Direct remedial + preventive actions
Own QL001–QL002 with semantic-state expansion and distractor hardening.

### COA-CP-003 — Verification + administrative response
Own QL003–QL004; explicitly guard premature punishment and outside-authority traps.

### COA-CP-004 — Constraint + proportionality
Own QL005–QL006; ensure difficulty comes from realistic near-miss actions.

### COA-CP-005 — Paired-course engine
Own QL007 and source-supported exam coding profiles.

### COA-CP-006 — Multi-step / ordered response
Own QL008 with prerequisite and sequencing authority.

### COA-CP-007 — Integrated reasoning
Own QL009; cross-family difficult cases without English complexity inflation.

### COA-CP-008 — Source saturation + exam-realness audit
Run real-paper/source census, close pattern gaps, and freeze QL allocation only when no material learner operation remains uncovered.

### COA-CP-009 — Hindi/Punjabi localization — APPROVED / FROZEN
Full Hindi/Punjabi localization covers all 130 frozen semantic authorities and 260 localized learner surfaces. Native wording, semantic parity and leakage gates are approved/frozen.

### COA-CP-010 — Question Studio integration — APPROVED / FROZEN
COA-001 is registered in Question Studio for review-only EN/HI/PA generation across the eight active semantic QLs and three approved presentation profiles. Review runs may persist; canonical Question Bank, test/mock and public/student gates remain closed. Product-owner approval recorded on 2026-09-18.

### COA-CP-011 — Final editorial/diversity freeze — APPROVED / FROZEN
Large semantic saturation and anti-gaming audit is complete. Question Studio enforces semantic uniqueness inside a review batch, truthful safe semantic capacity, QL008 Medium/Hard-only integrity, and final EN/HI/PA editorial regression gates. Product-owner approval recorded on 2026-09-18.

### COA-CP-012 — Internal eligibility — CANDIDATE / APPROVAL PENDING
CP012 is a lifecycle-only evaluation over the frozen CP011 surface. The candidate recommends internal Question Bank/test/mock eligibility, but does not activate those gates before explicit product-owner approval. Learner-facing content must remain byte-identical to CP011 and public/student release remains separately locked.

## 16. Lifecycle boundary

Current CP012 candidate state:

```text
semantic design:                 APPROVED_FROZEN
active semantic QLs:             COA-QL-001..006, COA-QL-008..009
retired semantic QLs:            COA-QL-007 (legacy compatibility only)
English authority:               APPROVED_FROZEN
Hindi/Punjabi authority:         APPROVED_FROZEN
Question Studio:                 CONNECTED_REVIEW_ONLY / LIVE_AUTHORITY_CP011
Question Studio languages:       EN / HI / PA
review-run persistence:          ALLOWED
semantic repetition in batch:    BLOCKED
CP012 technical candidate:       READY_FOR_APPROVAL
internal eligibility activated:  NO
canonical Question Bank writes:  CLOSED
test/mock eligibility:           CLOSED
public/student publication:      CLOSED
```

No checkpoint may infer approval from green CI alone. Human editorial approval and lifecycle promotion are separate decisions.

## 17. Definition of chapter-complete

COA-001 is chapter-complete only when:

- every supported learner operation is represented by a stable QL;
- source-pattern audit shows no material target-exam gap;
- generated questions are exam-like across all supported profiles;
- distractors are plausible and semantically grounded;
- explanations are simple, specific, and correct;
- English, Hindi, and Punjabi preserve semantic parity;
- diversity/anti-gaming audits are green at large sample sizes;
- Question Studio uses the current approved authority;
- internal eligibility is explicitly approved and recorded;
- public/student release remains a separate product decision.
