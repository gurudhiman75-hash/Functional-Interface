# WHI-001 CP001–CP016 — Chapter-Wide Coverage and Quality Audit V1

**Audit date:** 29 September 2026  
**Status:** Structural and coverage review complete; source-by-source verification and content balancing remain open.  
**Release:** Review-only. No learner delivery, Question Bank writes, tests or mock tests are authorized by this audit.

## Scope and method

Reviewed the 16 English checkpoint corpora in `knowledge-v1` (CP001–CP016), their available coverage plans and canonical-fact registers, Question Studio provenance for CP016, and the World War II family map. Automated checks covered record shape, counts, difficulty distribution, answer-key presence, source-ID patterns and lifecycle flags. A stem/fact scan identified repeated events and overlap between checkpoints. The findings below are an issue-finding audit; they do not claim that every historical statement has been independently checked against its cited passage.

The SSC CGL syllabus specifies General Awareness broadly, including History and Culture, but does not enumerate a complete World History topic list. Therefore, “coverage gaps” below are measured against this chapter’s declared plans and a broad history reference framework; they are not claims that SSC explicitly prescribes every listed topic. Reference: [SSC CGL indicative syllabus](https://ssc.gov.in/api/attachment/uploads/masterData/Syllabus/CGL-syllabus-169635-.pdf) and [CBSE Class XI History course structure, 2025–26](https://cbseacademic.nic.in/web_material/CurriculumMain26/SrSec/History_SrSec_2025-26.pdf).

## Structural checks

| Check | Result |
|---|---|
| English pool | 960 questions: 60 in each of 16 checkpoints |
| IDs | 960 unique question IDs |
| Difficulty | Every checkpoint: 18 Easy, 30 Medium, 12 Hard |
| MCQ shape | Four choices and a matching answer key in every English record |
| Explanation/source fields | Present in every English record |
| Lifecycle | All 960 remain `reviewOnly: true`, `runtimeRegistered: false` |
| Localized full pools | CP001–CP005 and CP016 have EN/HI/PA files; CP006–CP015 currently have English only |
| CP016 localized extent | Four questions per origin checkpoint, not full Hindi/Punjabi translations of CP006–CP015 |

These checks establish structural consistency; they do not establish that all 960 questions are necessary, distinct, source-verified or factually correct.

## Repairs made in this audit branch

1. **CP016 source-ID normalization:** The 44 CP016 questions selected from CP005–CP015 had source IDs with duplicated checkpoint prefixes (for example, `CP006-CP006-S01`). Corrected the three language corpora, canonical-facts register and English review file to use `CP006-S01` form, while retaining the original values in `originSourceIds`. Extended the adapter contract test to reject invalid/doubled source IDs.
2. **CP010 Q018 classification:** Midway was tagged as “European theatre” even though the stem, answer and source refer to the Pacific. Reclassified it as “Pacific theatre” in the pool, fact register and review artifacts; updated the map and coverage ranges. Q017 (Pearl Harbor/U.S. entry) is now classified under the Pacific theatre, giving 4 European-theatre and 8 Pacific-theatre items.

## Checkpoint coverage and quality findings

| CP | Current coverage | Main audit finding |
|---|---|---|
| 001 | Ancient civilizations through medieval Europe, Islam and Mongol history | Broad timeline, but several facts recur in Roman chronology, Byzantine transition, Crusades/Black Death and Mongol/Silk Roads items. The single checkpoint has 52 distinct family labels, so family taxonomy is not normalized. Ancient African, Chinese and South Asian civilizations and early human societies are thin or absent. |
| 002 | Renaissance, Reformation, Scientific Revolution, exploration and Atlantic system | Strong named-person/work and voyage coverage. Printing/Reformation relationships recur in several forms. Indigenous societies and the consequences of European expansion receive little space relative to the exploration material. |
| 003 | Enlightenment, American, Haitian and Spanish-American independence | Broad revolution coverage, but the American Revolution is much more granular than the other cases. Several U.S. documents/events and Haitian/Latin American chronology items cover overlapping facts. |
| 004 | French Revolution, Napoleon and Congress of Vienna | Broadly coherent, with many date and chronology questions. Generic stems such as “Choose the correct sequence” repeat; Q015 and Q056 use the same stem template for different sequences. |
| 005 | Industrial Revolution and social change | British machinery, factory law and worker movements dominate. Several invention, factory-law and railway facts recur. Belgium, the United States and Meiji Japan appear, but comparative non-British industrialization and its wider social/environmental effects remain thin. |
| 006 | 1848 movements, Italian/German unification, Dual Monarchy and Balkans | Multiple items restate Mazzini, Cavour, Garibaldi, the 1861 proclamation and Rome’s 1870 incorporation; German 1866 outcomes also recur. Balkan coverage leans heavily on the 1878 settlement rather than varied national movements and their distinct paths. |
| 007 | Scramble for Africa, Congo, resistance and imperialism in Asia | Congo Free State and Berlin Conference material recur across event, chronology and synthesis questions. The plan names British India and French Indochina, but the pool’s Asian section is mostly China, with one Dutch East Indies item; those planned areas are not adequately represented. |
| 008 | First World War and Russian Revolutions | Strong on alliances, July Crisis, Western Front battles and Russian chronology. Ottoman/Middle Eastern campaigns, the Armenian genocide, colonial participation beyond a general item, and civilian/home-front experience need a coverage check before the pool can be called exhaustive. |
| 009 | Postwar settlement, League, Weimar, Depression, dictatorships and road to war | Useful interwar coverage, but Germany and League failures are central. Passage-level source locators now cover Q013–Q036, including the League response, Weimar institutions, the Dawes Plan, the Depression’s global and German effects, and the rise of Fascist/Nazi leadership. The Poland invasion and declarations of war overlap directly with CP010’s opening sequence. |
| 010 | Second World War, theatres, Holocaust, resistance, surrender and consequences | Q017 (Pearl Harbor/U.S. entry) is assigned to the Pacific theatre; the family split is 4 European and 8 Pacific items. Passage-level source locators now cover Q013–Q036, including the European/Pacific campaigns and turning points, with direct sources for island-hopping, the Coral Sea, Allied conferences, Lend-Lease, and Potsdam. Normandy is tested twice (Q014 and Q028); outbreak and declarations repeat CP009 and recur within CP010 Q001–Q006. Review whether both versions add different assessment value. |
| 011 | UN, Bretton Woods, tribunals and Germany’s division | Good coverage of institutions and postwar rules. The Security Council veto is asked twice (Q021, Q025); founding/institution chronology appears in several synthesis items. |
| 012 | Asian and Middle Eastern decolonization, China 1949, Bandung and Palestine | Resolution 181 and the end of the British Mandate are repeated across adjacent questions. The PRC proclamation is repeated in CP014. Coverage of the Philippines, Sri Lanka and postwar independence in Syria, Lebanon, Jordan and Iraq is absent or thin. |
| 013 | African independence, Congo, OAU, apartheid and transition | Ghana’s 1957 independence is tested several times (Q001–Q006). Apartheid and its transition occupy 24 questions (Q031–Q054), while country coverage is narrow; Nigeria, Portuguese Africa, Zimbabwe and Namibia are not represented. |
| 014 | Cold War blocs, Korea, Vietnam, Cuba, arms control, proxy conflict and nonalignment | Bandung, China’s 1949 revolution and Vietnam’s 1954 settlement overlap with CP012. Keep contextual comparison where useful, but avoid duplicate direct-recall items across packages. |
| 015 | Gorbachev, 1989 transitions, German reunification, Soviet dissolution and Yugoslavia | 36 questions focus on Gorbachev/Soviet dissolution and associated republics/coup/agreements; other Eastern European transitions and post-communist state changes are comparatively thin. Several 1991 declarations and dissolution milestones repeat within this checkpoint. |
| 016 | Cumulative sample: four questions per checkpoint | The 60-question pool samples every checkpoint evenly, but four selections cannot demonstrate complete topic coverage inside any one checkpoint. It should remain a review sampler, not a substitute for the 900-question chapter pool. |

## Cross-checkpoint overlap to resolve

| Overlap | Items | Recommendation |
|---|---|---|
| Start of the Second World War in Europe | CP009 Q057–Q059; CP010 Q001–Q006 | Keep CP009 focused on interwar causes and the decision sequence; reduce repeated date/place recall in CP010 or make the latter test a distinct military consequence. |
| Chinese Revolution / PRC proclamation | CP012 Q031; CP014 Q017 | Retain one direct-recall item; make the other test a distinct Cold War consequence or remove it. |
| Bandung Conference | CP012 Q037–Q042; CP014 Q050–Q054 | Assign factual ownership to CP012 and use CP014 only for a distinct Non-Aligned Movement/Cold War relationship. |
| 1954 Geneva settlement in Vietnam | CP012 Q021–Q024; CP014 Q024 | Avoid repeating the same settlement fact; keep the decolonization outcome in CP012 and use CP014 for a separate Cold War effect. |
| Global character of the world wars | CP008 Q035; CP010 Q060 | The generic “global character” synthesis stems are parallel; give each a distinct comparison focus or retain only the stronger item. |

This is a semantic review list, not an instruction to remove every related question: chronological reinforcement may be useful when each item tests a different skill. The next revision should record the learning purpose and canonical fact for every retained overlap.

## Source, localization and architecture gates

1. **Source locators:** CP006–CP015 have source registers, but their `sourceLocator` values are topic/family labels rather than page, section or quoted passage locators. CP016’s source-register `locator` fields are null. CP001–CP005 use legacy `S<n>` IDs and do not share the same checkpoint-wide canonical-fact/source-locator structure; CP002 and CP005 have plans, but the full crosswalk remains incomplete. Verify each question against a specific source passage and retain the locator.
2. **Family taxonomy:** CP001, CP003, CP004 and CP005 have 52, 46, 41 and 38 unique question-family labels respectively; CP002 has 10; CP006 onward mostly use ten broad groups, with uneven counts in some pools. Normalize to a shared family ID and keep the topic/fact as separate metadata. CP016’s ten generic families should not replace the origin question’s original family.
3. **Localization:** Full Hindi/Punjabi pools are absent for CP006–CP015. CP016 contains only four selected items per language from each of those checkpoints. Complete native Hindi and Punjabi review for the full English pools, including answer position, names, date conventions and source/fact parity.
4. **Accuracy and difficulty:** No full independent fact-by-fact source validation was possible from the available generic locators. Recheck dates and causal claims against the sources; then review whether Easy/Medium/Hard reflects the reasoning load rather than merely the fact’s obscurity.
5. **Question Studio:** CP016 now reuses the shared `knowledge-v1` review-only lifecycle. Keep all World History packages in that shared architecture; learner delivery remains blocked until coverage, source, duplicate, factual and localization gates close.

## Recommended order

1. Build the checkpoint-wide canonical topic/fact map and source-locator register for CP001–CP016.
2. Resolve the explicit duplicate clusters and coverage gaps above; add or revise questions only where a missing exam-relevant fact is supported by the source audit.
3. Normalize question-family IDs and rebalance pools based on coverage needs rather than preserving a fixed count for its own sake.
4. Complete full-pool Hindi/Punjabi localization and parity review for CP006–CP015.
5. Rerun the chapter close, source, chronology, duplicate, ambiguity, difficulty and Question Studio lifecycle audits before considering learner release.


## Follow-up implementation log

- **CP013 coverage rebalance:** merged in [PR #2622](https://github.com/gurudhiman75-hash/Functional-Interface/pull/2622). Seven repeated items were replaced with source-backed coverage for Nigeria, Angola/Mozambique, Zimbabwe and Namibia. The full Hindi/Punjabi localization gate remains open.
- **CP012/CP014 overlap cluster:** merged in [PR #2627](https://github.com/gurudhiman75-hash/Functional-Interface/pull/2627). Three direct-recall duplicates were replaced with distinct Korean War, SEATO and Bandung convening facts.

- **CP010 opening/turning-point overlap:** merged in [PR #2636](https://github.com/gurudhiman75-hash/Functional-Interface/pull/2636). Four repeat items were replaced with source-backed Blitzkrieg, Phoney War, Warsaw surrender and Kursk coverage. English review materials and canonical locators are aligned; localization remains open.


- **CP009/CP010 opening overlap:** merged in [PR #2640](https://github.com/gurudhiman75-hash/Functional-Interface/pull/2640). CP009’s repeated war-declaration date and outbreak sequence are replaced with the March assurance and August UK-Poland mutual assistance agreement; the invasion date remains CP009’s single endpoint.


- **CP009/CP010 localization readiness:** baseline recorded in `WHI-001-CP009-CP010-LOCALIZATION-READINESS-V1.md`. No Hindi or Punjabi pools/review files are present; 43/60 CP009 and 47/60 CP010 canonical facts still have family-level rather than passage-level locators; focused source locators now cover CP009 Q001–Q012/Q055–Q059 and CP010 Q001–Q012/Q028. Verify sources and complete English review before localization, then run language parity checks.
