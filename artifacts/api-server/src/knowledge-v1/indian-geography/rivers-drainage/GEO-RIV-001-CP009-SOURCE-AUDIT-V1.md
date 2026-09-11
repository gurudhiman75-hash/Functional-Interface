# GEO-RIV-001-CP009 — Rivers and States — Source Audit V1

## Scope
CP009 tests durable river-to-state geography. It distinguishes the **main river course** from the wider **river basin/drainage area**. A state is never marked as a course state merely because some part of the basin lies there.

## Truth-authority order
1. Central Water Commission / Ministry of Jal Shakti river and basin publications.
2. National Water / central government technical sources where they explicitly describe a river course.
3. State-government water resources, environment or district sources for state-specific course segments.
4. Existing reviewed GEO-RIV-001 facts only for source-state relations already locked in earlier CPs.

Coaching/exam-prep sites may inform coverage frequency but are not truth authorities.

## Core course evidence admitted in V1
- **Ganga:** CWC Upper Ganga Basin Organisation explicitly describes the river passing through Uttarakhand, Uttar Pradesh, Bihar, Jharkhand and West Bengal.
- **Brahmaputra:** Government of Assam Water Resources states that the river enters India through Arunachal Pradesh and flows through Assam before Bangladesh.
- **Krishna:** CWC Krishna-Godavari Basin Organisation and Government water-resource material support Maharashtra, Karnataka, Telangana and Andhra Pradesh course associations.
- **Godavari:** Government sources support the main stem in Maharashtra, Telangana and Andhra Pradesh; basin-only states are not promoted as course states.
- **Mahanadi:** CWC / Government of Odisha material supports Chhattisgarh and Odisha course geography.
- **Cauvery:** Government of Tamil Nadu water-quality material explicitly states that Cauvery flows in Karnataka and Tamil Nadu.
- **Pennar:** CWC hydrological publications explicitly state that the main Pennar runs in Karnataka and Andhra Pradesh.
- **Teesta:** Government of Sikkim / West Bengal material supports its course through Sikkim and West Bengal before Bangladesh.
- **Subarnarekha:** Government technical sources support its course through Jharkhand, West Bengal and Odisha.

## Semantic relation policy
- `flows_through_state` = the named main river has a course segment in that state/UT.
- `enters_india_through_state` = first Indian state/UT reached by the named river, only when directly sourced.
- `forms_state_boundary` = the river forms part of a boundary; this is not automatically rewritten as `flows_through_state` unless the course-state association is independently supported.
- `source_state` = where the river rises; reused from earlier reviewed CP facts where available.
- `drains_state` / basin-state relations are **out of scope** for course questions and must not be used as synonyms for `flows_through_state`.

## Explicit exclusions
- basin-only state lists presented as if the main river flows through every state;
- changing administrative/project status;
- exact course lengths unless the question family explicitly needs a stable, source-agreed number;
- border micro-segments where source conventions differ;
- Bangladesh/Pakistan/Nepal state/province geography beyond what is needed to explain an India-course relation;
- CP006 candidate facts until CP006 receives human approval.

## Editorial policy
Questions use exam-standard wording such as “Which of the following states does the river flow through?” or “Which pair is correctly matched?”. Avoid `associated with`, `linked with`, and procedural explanation language. Explanations state the course relation directly.

## Visual policy
Text-first. Maps remain optional manual editorial attachments in Question Studio and are not required for question validity.
