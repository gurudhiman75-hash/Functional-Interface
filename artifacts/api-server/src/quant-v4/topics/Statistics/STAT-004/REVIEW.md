# Statistics — Data Foundations Review V1

**Scope:** SSC CGL JSO Paper II — data collection, classification, tabulation, and basic frequency-distribution construction  
**Review status:** English representative review batch  
**Package/QL numbering:** Not assigned. The semantic contracts below are working names only; permanent package and QL IDs must be checked out through the repository ownership process.

## 1. Ownership and exclusions

This batch covers statistical data sources and collection methods, classification, simple tabulation, and forming a basic grouped frequency table from raw observations.

It deliberately excludes:

- histogram questions: DI-009 already owns reading class frequencies, totals, ranges, modal/median classes and grouped measures from histograms;
- frequency-polygon questions: DI-010 already owns graph-type identification, class marks, plotted frequencies, totals, grouped mean, median class and polygon construction properties;
- grouped mean, median and mode calculations: STAT-003 owns those contracts;
- sampling designs and sampling errors beyond distinguishing complete enumeration from a sample survey: reserve those for the Sampling Theory package;
- quartiles, dispersion, moments, correlation, probability and inference: reserve those for their dedicated Statistics ownership groups.

**Boundary rule:** Statistics owns how data are obtained, classified, arranged, and represented as a frequency table. DI owns solving numerical questions from an already supplied chart or table. If a future statistics chart contract would reproduce DI-009/010, do not create a second QL for it.

## 2. Candidate semantic contracts

These are semantic coverage contracts, not permanent IDs.

| Working contract | Coverage | Level target |
|---|---|---|
| PRIMARY_VS_SECONDARY_SOURCE | Decide whether data were collected first-hand for the current investigation or obtained from an existing source. | Easy |
| CENSUS_VS_SAMPLE_ENUMERATION | Distinguish complete enumeration from observation of a selected part of the population. | Easy |
| DIRECT_PERSONAL_INVESTIGATION | Recognize investigator-collected first-hand responses from the units concerned. | Medium |
| INDIRECT_ORAL_INVESTIGATION | Identify collection through informed witnesses when direct respondents are unavailable or unsuitable. | Medium |
| SCHEDULE_VS_QUESTIONNAIRE | Distinguish an enumerator-filled schedule from a respondent-completed questionnaire. | Medium |
| OBSERVATION_METHOD | Identify systematic recording of events/behaviour without asking respondents to report them. | Easy |
| SECONDARY_DATA_FITNESS | Assess whether an existing source matches the study's definitions, units, population and time period. | Hard |
| QUALITATIVE_CLASSIFICATION | Classify observations by attributes/categories rather than numerical magnitude. | Easy |
| DISCRETE_VS_CONTINUOUS_VARIABLE | Distinguish countable values from measurements that can vary continuously over an interval. | Easy |
| CHRONOLOGICAL_VS_GEOGRAPHICAL_CLASSIFICATION | Identify organization by time period versus place. | Easy |
| ONE_WAY_VS_TWO_WAY_CLASSIFICATION | Determine whether a table classifies units by one characteristic or jointly by two. | Medium |
| TABLE_COMPONENTS | Identify title/caption, column heading/boxhead, and row heading/stub by their function. | Medium |
| FREQUENCY_TABLE_CHECK | Verify that category/class frequencies reconcile to the number of observations represented. | Medium |
| MUTUALLY_EXCLUSIVE_CLASS_INTERVALS | Choose class intervals that assign each observation to exactly one class, including boundary values. | Hard |
| BUILD_A_BASIC_FREQUENCY_TABLE | Tally a short raw list into clearly stated, non-overlapping classes. | Hard |

## 3. Representative questions

### Q1 — Primary data (Easy)

A factory wants to estimate the average time its workers spend travelling to work. For this study, the investigator asks the workers to complete a new survey. The responses are:

A. primary data  
B. secondary data  
C. classified data  
D. census records

**Answer: A. primary data**

**Explanation:** The investigator collected the responses directly for this study. Data collected first-hand for the investigation are primary data. Published records or earlier surveys would be secondary data.

### Q2 — Secondary data (Easy)

A researcher studying changes in district population uses tables from the latest published Census report. For that researcher, the Census tables are:

A. primary data  
B. secondary data  
C. direct observations  
D. an enumerator-filled schedule

**Answer: B. secondary data**

**Explanation:** The Census agency collected the figures earlier. The researcher is reusing an existing source, so the figures are secondary data for this study.

### Q3 — Complete enumeration (Easy)

A college records the travel mode of every one of its 480 students. This is an example of:

A. complete enumeration  
B. a sample survey  
C. indirect oral investigation  
D. secondary-data collection

**Answer: A. complete enumeration**

**Explanation:** Every unit in the stated population—the 480 students—is covered. A sample survey would collect information from only a selected part of those students.

### Q4 — Observation method (Easy)

To estimate how many buses enter a terminal between 8 a.m. and 9 a.m., an investigator watches the entrance and records each bus. Which method is being used?

A. observation  
B. mailed questionnaire  
C. indirect oral investigation  
D. published-source study

**Answer: A. observation**

**Explanation:** The investigator records events as they occur without asking drivers or passengers to report them. That is the observation method.

### Q5 — Continuous variable (Easy)

Which of the following is a continuous variable?

A. number of calls received by a help desk in an hour  
B. number of machines in a workshop  
C. weight of parcels handled in a day  
D. number of students absent from a class

**Answer: C. weight of parcels handled in a day**

**Explanation:** Weight is measured and can take fractional values within a range. The other quantities are counts and take whole-number values.

### Q6 — Qualitative classification (Easy)

A survey groups households by their main cooking fuel: LPG, electricity, firewood or biogas. The classification is based on:

A. a qualitative attribute  
B. a continuous variable  
C. a chronological series  
D. a frequency density

**Answer: A. a qualitative attribute**

**Explanation:** The groups name kinds of fuel, not measured numerical amounts. The classification is qualitative.

### Q7 — Chronological classification (Easy)

A statistical abstract lists the rainfall recorded in one district separately for each year from 2019 to 2024. The data are arranged by:

A. chronological classification  
B. geographical classification  
C. qualitative classification  
D. two-way classification

**Answer: A. chronological classification**

**Explanation:** The observations are arranged in time order by year. A geographical classification would arrange observations by places such as districts or states.

### Q8 — Enumerator-filled schedule (Medium)

Enumerators visit selected households, ask each question, and write the answers on a form themselves. The form is functioning as a:

A. schedule  
B. respondent-completed questionnaire  
C. published secondary table  
D. frequency polygon

**Answer: A. schedule**

**Explanation:** In a schedule method, an enumerator asks the questions and records the responses. In a questionnaire method, respondents normally fill in the form themselves.

### Q9 — Indirect oral investigation (Medium)

A study concerns the working conditions of seasonal migrant workers who are difficult to contact individually. Investigators collect information from several knowledgeable local officials and support workers who regularly deal with them. This is closest to:

A. indirect oral investigation  
B. complete enumeration  
C. direct observation of every worker  
D. a respondent-completed questionnaire

**Answer: A. indirect oral investigation**

**Explanation:** Information is obtained from informed persons about the group rather than directly from each member of the group. That is indirect oral investigation. It should be used carefully because witnesses may not know every individual's circumstances.

### Q10 — Questionnaire method (Medium)

A company emails a form to customers and asks each customer to enter their own answers and return it. This is a:

A. questionnaire method  
B. schedule method  
C. direct personal investigation  
D. complete enumeration by observation

**Answer: A. questionnaire method**

**Explanation:** Customers fill in and return the form themselves. When an enumerator asks the questions and records answers, the method is a schedule instead.

### Q11 — Two-way classification (Medium)

A college table classifies students jointly by **year of study** and **mode of residence** (hostel or day scholar). This is:

A. one-way classification  
B. two-way classification  
C. chronological classification only  
D. a raw-data array

**Answer: B. two-way classification**

**Explanation:** Each student is classified by two characteristics: year of study and mode of residence. A table based on one characteristic alone would be one-way classification.

### Q12 — Table stub (Medium)

In a statistical table, the left-hand column lists the names of the groups represented in each row. This part is called the:

A. stub  
B. caption  
C. body note  
D. source note

**Answer: A. stub**

**Explanation:** The stub contains row headings. Column headings are captions (or a boxhead); the body contains the data cells.

### Q13 — Suitability of a secondary source (Hard)

A researcher compares average household electricity use across two published reports. One report covers calendar-year households and reports kWh per household; the other covers financial-year accounts and reports total kWh for each district. What should the researcher do before comparing the figures?

A. check and reconcile the periods, units and populations covered  
B. compare the totals directly because both reports concern electricity  
C. treat both reports as primary data  
D. discard the report with the larger number

**Answer: A. check and reconcile the periods, units and populations covered**

**Explanation:** The reports use different time periods and measures, and one reports per-household use while the other gives district totals. Those figures are not directly comparable until definitions, units, coverage and periods are aligned.

### Q14 — Boundary rule (Hard)

A distribution uses the class intervals 0–10, 10–20 and 20–30, with the convention that each class includes its lower limit but excludes its upper limit, except the final class. Where is an observation of exactly 20 placed?

A. in 0–10 only  
B. in 10–20 only  
C. in 20–30 only  
D. in both 10–20 and 20–30

**Answer: C. in 20–30 only**

**Explanation:** Under the stated lower-inclusive, upper-exclusive rule, 10–20 contains values at least 10 but less than 20. The value 20 therefore enters 20–30. Each boundary value is assigned once.

### Q15 — Build a basic frequency table (Hard)

The following values record the number of service calls received by 8 branches on a particular day:

`3, 7, 5, 8, 4, 6, 9, 5`

Using the classes 0–4, 4–8 and 8–12, with lower limits included and upper limits excluded, what are the class frequencies?

A. 1, 5, 2  
B. 2, 4, 2  
C. 2, 3, 3  
D. 3, 3, 2

**Answer: A. 1, 5, 2**

**Explanation:** The class 0–4 contains only 3, giving frequency 1. The class 4–8 contains 4, 5, 6, 5 and 7, giving frequency 5. The class 8–12 contains 8 and 9, giving frequency 2. The frequencies add to 8, matching the eight observations.

## 4. Pool and variation plan

The generators should vary realistic statistical contexts while preserving the contract:

- **Primary-data contexts:** attendance, travel time, household expenditure, waiting time, crop yield, customer preference, defect counts.
- **Secondary-source contexts:** published Census tables, administrative records, annual reports, archived survey datasets, official statistical abstracts.
- **Collection methods:** direct inquiry, indirect oral sources, observation, enumerator-filled schedules, self-completed questionnaires; each stem must include the decisive method detail.
- **Classifications:** qualitative attributes, discrete counts, continuous measurements, chronological and geographical arrangements, one-way and two-way tables.
- **Frequency tables:** non-overlapping class boundaries, modest integer observations, stated interval convention, and frequencies that sum to the stated number of observations.

Avoid city-specific distractors, fabricated institutional claims, and vague wording such as “best source” unless the stem supplies a criterion.

## 5. Audit notes before implementation

- The exact boundary convention must always appear in stems that use exclusive class intervals.
- Do not call an enumerator-filled form a questionnaire in the generator.
- Do not label counts as continuous variables or measurements as discrete counts.
- No chart-rendering contract is included because DI-009/010 have explicit existing ownership.
- Permanent QL IDs, canonical-problem ID and release ID remain unassigned pending repository checkout and adapter review.

## 6. Lifecycle target

English controlled review only. Preserve the established Statistics package locks: no Question Bank writes, test/mock eligibility, public publication, automatic student publication, localization or production release.

## Source

- Staff Selection Commission, *Combined Graduate Level Examination 2026 notification*, §13.11.6, Paper-II (Statistics): https://ssc.gov.in/api/attachment/uploads/masterData/NoticeBoards/Notice_of_adv_cgl_2026.pdf
