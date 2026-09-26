# ENG-008 — Reading Comprehension — Blueprint V2

Status: `IMPLEMENTATION_COMPLETE__FROZEN__REVIEW_ONLY`

## 1. Ownership

ENG-008 owns Reading Comprehension across SSC and banking exam profiles.

It does not duplicate ENG-001–ENG-007 grammar/vocabulary chapters except when a grammar or vocabulary operation is explicitly tested **inside passage context**.

The engine stores one canonical passage/question authority model but applies different exam-profile selectors, passage pools, difficulty contracts and set structures.

## 2. Source boundary

### SSC — official syllabus authority

Current SSC CGL syllabus explicitly includes `Comprehension Passage` and states that comprehension may contain three or more paragraphs, with at least one simple paragraph based on a book/story and other paragraphs based on current affairs, a report or an editorial.

Official source:
- SSC CGL notice/syllabus: https://ssc.gov.in/api/attachment/uploads/masterData/NoticeBoards/Notice_of_adv_cgl_2025.pdf

Therefore these SSC passage classes are **official-source-backed**:
- simple book/story narrative;
- report/current-affairs passage;
- editorial/current-affairs passage;
- multi-paragraph comprehension.

### Banking — official section boundary, empirical RC profile

Current IBPS and SBI recruitment documents officially define English Language / General English sections but do not publish an SSC-like granular list of RC genres.

Official section references:
- IBPS PO/MT XV notification: https://www.ibps.in/wp-content/uploads/Detailed-Notification_CRP-PO-XV_10.7.25.pdf
- IBPS CSA XV notification: https://www.ibps.in/wp-content/uploads/DetailedNotification_CRP_CSA_XV_Final_for_Website_1.8.2025-1.pdf
- SBI PO 2025-26 recruitment/exam material: https://sbi.co.in/web/careers/current-openings

Accordingly, banking passage genres and question mixes must be governed by audited actual-paper/paper-analysis evidence and must **not** be labelled as official syllabus topics.

## 3. Core passage model

Every passage authority stores:
- passage ID;
- exam-profile eligibility;
- genre;
- topic/domain;
- text;
- paragraph count;
- approximate length/readability;
- factual propositions;
- inference propositions;
- discourse relation metadata;
- vocabulary-in-context targets;
- optional tone/purpose metadata;
- question authorities;
- evidence text or evidence rationale;
- source/authoring provenance;
- review status.

Every question authority stores:
- family ID;
- one keyed answer;
- three curated distractors;
- difficulty;
- evidence location/rationale;
- explanation;
- scope/ambiguity notes where needed.

No RC answer may depend on outside GK unless the passage explicitly supplies that fact.

## 4. Exam-profile taxonomy

### CP001 — SSC Foundation RC

Purpose: establish the simpler SSC foundation layer.

Passage classes:
- simple narrative/story;
- straightforward report/expository.

Core families:
- factual retrieval;
- inference;
- main idea/theme;
- suitable title;
- vocabulary in context;
- passage-supported statement.

The current CP001 runtime pool contains 8 original passages:
- 4 narrative/story;
- 4 report/expository;
- 48 atomic question authorities.

### CP002 — SSC Editorial & Current-Affairs RC

Passage classes:
- editorial/argumentative;
- current-affairs-style report;
- public-policy/social/economic/science/environment report.

Question families expand to:
- author purpose;
- tone/attitude;
- conclusion;
- cause/effect;
- implication;
- statement supported/not supported;
- contextual vocabulary;
- summary/main idea.

Four editorial passages authored during the initial ENG-008 pass are retained as seed material but are not runtime-exposed from CP001.

### CP003 — Banking Prelims RC

Empirical paper-profile checkpoint, not an official granular syllabus claim.

Passage pool may include:
- narrative/anecdotal;
- everyday/social issues;
- business/economy-light;
- environment;
- science/technology-light;
- consumer/workplace/digital-life topics.

Question mix:
- direct comprehension;
- local inference;
- contextual vocabulary;
- synonym/antonym in context;
- supported statement;
- simple filler/word-fit only when source audit confirms it as part of RC sets.

Difficulty target: readable passage + time-pressure discrimination, not abstract prose.

### CP004 — Banking Mains Analytical RC

Passage pool may include:
- economy/business/labour market;
- finance-adjacent public issues;
- science/medicine/health;
- technology/AI/digital economy;
- environment/climate/sustainability;
- social policy;
- analytical/editorial themes.

Question mix expands to:
- deeper inference;
- author viewpoint;
- tone;
- purpose;
- central argument;
- can/cannot be inferred;
- contextual synonym/antonym;
- phrase meaning;
- logical conclusion;
- paragraph relation;
- assumption/scope distinction.

Difficulty must come from discourse complexity and close evidence-based distractors, not obscure vocabulary alone.

### CP005 — Research / Survey / Report RC

Focus:
- studies and findings;
- survey interpretation;
- competing explanations;
- correlation vs causation;
- limitation/scope;
- qualitative comparisons;
- evidence/conclusion distinction.

This checkpoint is especially useful for banking mains and advanced SSC profiles.

### CP006 — Full Multi-question Passage Sets

ENG-008 must support both:
1. `passage -> individual governed question authority`; and
2. `passage -> governed exam-style question set`.

Set profiles include:
- SSC small/medium RC set;
- SSC multi-paragraph set;
- Banking Prelims RC set;
- Banking Mains RC set.

A set may contain 5/6/8/10 questions only when the target exam profile/source evidence supports that structure. The engine must not hardcode one universal question count.

### CP007 — Banking Prelims Contextual Word-fit / Filler Gap Closure

Gap-audit checkpoint adding one BP-F10 contextual word-fit authority to each approved Banking Prelims passage. This closes the evidence-backed RC-internal filler gap and enables genuine 10-question Banking Prelims linked sets.

### CP008+ — Gap audit only if newly justified

No arbitrary checkpoint count. The current freeze audit found no remaining gap after CP007. Additional CPs require new exam evidence or a separately demonstrated exam-relevant gap.

## 5. Difficulty contract

### Easy
- explicit answer;
- one local evidence span;
- low paraphrase distance;
- clearly eliminable distractors.

### Medium
- moderate paraphrase;
- local inference;
- main idea/title;
- vocabulary in context;
- statement support;
- two plausible distractors.

### Hard
- cross-sentence/cross-paragraph synthesis;
- implicit conclusion;
- tone/purpose distinction;
- scope-sensitive close distractors;
- evidence may be distributed rather than adjacent.

## 6. Distractor contract

RC distractors must be one of:
- passage detail attached to the wrong question;
- overstatement/understatement of a supported claim;
- reversed cause/effect;
- unsupported but topic-plausible statement;
- partial truth with incorrect scope;
- nearby contextual meaning that does not fit the passage;
- wrong title/theme that matches only one paragraph.

Random unrelated vocabulary is not acceptable as an RC distractor.

## 7. Explanation contract

Explanations should be short and evidence-led:
1. state the answer;
2. show the relevant passage idea/evidence;
3. explain the inference only when needed.

No option-by-option analysis unless ambiguity requires it.

## 8. Lifecycle

ENG-008 remains `REVIEW_ONLY`.

Until explicit human approval:
- no Question Studio registration for the checkpoint;
- no Question Bank writes;
- no scored tests;
- no mocks;
- no learner/public publication;
- no automatic publication;
- no production release.

Future changes to approved passage/question authorities require regenerated review material and fresh approval where reviewed output changes.
