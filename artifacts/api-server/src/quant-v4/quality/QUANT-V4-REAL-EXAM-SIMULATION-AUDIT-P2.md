# Quant V4 Real Exam Simulation Audit — P2

**Authority:** `QUANT-V4-REAL-EXAM-SIMULATION-AUDIT-P2`  
**Status:** implemented audit infrastructure; **not** a declaration that any exam profile is simulation-ready  
**Minimum run:** 20 complete section manifests per exam profile

## Why this exists

Quant V4 must stop treating chapter/CP/QL counts as the main measure of completeness. A large mathematical library can still fail to reproduce the shape of a real SSC, Banking or Punjab exam section.

This audit therefore measures the engine at the **section level**.

A chapter may be mathematically complete while the exam remains:

`EXAM_SIMULATION_NOT_READY`

That is a valid and expected audit result.

## Profiles covered

The audit plan names eleven exam families and this checkpoint covers all eleven:

1. SSC CGL Tier I
2. SSC CGL Tier II
3. SSC CHSL
4. PSSSB
5. PPSC
6. Punjab Police
7. IBPS PO Prelims
8. IBPS PO Mains
9. IBPS Clerk
10. SBI PO
11. IBPS RRB Banking

Each profile generates at least **20** deterministic section manifests. The API permits a higher run count for later soak/audit work.

## What a section manifest contains

Every expected question position is represented by exactly one record:

- `RUNTIME_GENERATED` when a current runtime can fill the slot; or
- `CAPABILITY_GAP` when the correct exam component cannot currently be sampled through the central Quant section-generation boundary.

The simulator must **not** hide a missing Trigonometry/Algebra/Punjab integration by substituting another chapter.

A structurally complete manifest containing `CAPABILITY_GAP` records is still graded `EXAM_SIMULATION_NOT_READY`.

## Runtime surfaces exercised

The first implementation samples current authorities rather than creating a parallel content engine:

- normal Quant Question Studio arithmetic packages;
- Geometry / current Mensuration Question Studio packages when exposed by the normal registry;
- Probability exam-profile runtime;
- STAT-001 central-tendency runtime;
- DI-001..DI-008 linked-set runtimes;
- SAP Banking Speed Maths;
- BNS-001 Banking Number Series;
- QCP-001 Quantity Comparison;
- DSF-001 exam-answer-profile runtime.

The audit deliberately records integration gaps for content that exists but is not yet exposed through a safe central section-simulation contract.

## Current deliberate gaps

### Algebra

Algebra has a productionized `BANK_ONLY` lifecycle, but the real-exam simulator does not invent a new route around that authority. Until a deterministic central exam-profile sampling adapter is available, Algebra section slots remain an explicit capability gap.

### Trigonometry

TRG-001/TRG-002 have mature internal lifecycle states, but they are not yet exposed through the central Quant section-simulation generation boundary. Their section slots remain explicit capability gaps rather than being replaced with Geometry or Mensuration.

### Punjab central profile

The central Quant V4 profile contract currently defines SSC, Banking and Generic profiles but no Punjab-specific contract. PSSSB/PPSC/Punjab Police therefore remain blocked by `CENTRAL_EXAM_PROFILE_MISSING` even when individual four-option questions can be generated.

### PYQ frequency weighting

The slot mixes in this checkpoint are **structural baselines**, not frozen claims about exact 2026 topic percentages. Exact topic/representation/difficulty frequency must be driven by the later PYQ-frequency-weighting checkpoint.

Every profile therefore carries:

`PROVISIONAL_PYQ_WEIGHTING_REQUIRED`

and the audit adds:

`PYQ_FREQUENCY_WEIGHTING_PENDING`

as a readiness blocker.

## Metrics captured

For each exam profile, the audit records:

- sections generated;
- expected and generated question records;
- runtime-generated count;
- capability-gap count;
- central-profile gap;
- option-count mismatches;
- empty explanations;
- question-specific explanation rate;
- normalized stem repetition;
- semantic explanation repetition;
- test-ineligible runtime content;
- public-release lock count;
- representation distribution;
- topic distribution;
- difficulty distribution;
- direct / inverse / unknown distribution;
- calculation-intensity distribution;
- average stem length;
- average explanation length;
- linked DI-set count.

The runtime reuses the existing semantic explanation-quality utility rather than creating a second explanation standard.

## Readiness rule

A profile remains `EXAM_SIMULATION_NOT_READY` if any blocking condition is present, including:

- missing central exam profile;
- capability gaps;
- wrong 4/5-option delivery;
- empty explanations;
- explanation specificity below 90%;
- normalized stem repetition above 5%;
- semantic explanation repetition above 20%;
- test-ineligible content used in the simulated section;
- provisional PYQ weighting.

`EXAM_SIMULATION_READY_CANDIDATE` is intentionally difficult to obtain. It means the engine has passed a section-level fidelity gate, not merely that its generators run.

## Option-count policy

- SSC profiles: 4 options
- Punjab profiles: 4 options, but Punjab-specific central profile still required
- Banking profiles: 5 options

The audit does not silently pad ordinary four-option arithmetic to five options. If Banking section assembly still receives a four-option arithmetic question, that is recorded as `OPTION_COUNT_PROFILE_DRIFT`.

## DI policy

DI is counted as linked **stimulus sets**, not as unrelated questions that happen to share a representation label.

The audit tracks concrete representation families such as:

- table;
- advanced table;
- grouped bar;
- line;
- pie;
- caselet;
- missing DI;
- arithmetic DI.

This protects the set/stimulus architecture introduced earlier in Quant V4.

## Relationship to later P2 work

This checkpoint provides the measurement harness for the remaining programme:

1. Hindi/Punjabi human editorial passes;
2. PYQ frequency weighting;
3. empirical difficulty calibration from learner performance.

The simulator should be rerun after each of those changes. The important output is not whether a single chapter passes; it is whether a complete exam section becomes measurably closer to the target exam.
