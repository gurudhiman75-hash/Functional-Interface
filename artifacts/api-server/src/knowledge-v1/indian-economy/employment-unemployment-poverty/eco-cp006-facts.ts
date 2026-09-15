export type EcoCp006ConceptRow = {
  id: string;
  term: string;
  compactMeaning: string;
  sourceIds: readonly string[];
  sourceFactIds: readonly string[];
};

export type EcoCp006EmploymentScenario = {
  id: string;
  stem: string;
  answer: "Self-employed" | "Regular wage/salaried" | "Casual labour";
  explanation: string;
  sourceIds: readonly string[];
  sourceFactIds: readonly string[];
};

export type EcoCp006CommitteeRow = {
  id: string;
  committee: string;
  year: number;
  purpose: string;
  sourceIds: readonly string[];
  sourceFactIds: readonly string[];
};

const employmentSources = ["NCERT-IED-EMPLOYMENT", "MOSPI-PLFS-CONCEPTS"] as const;
const povertySources = ["NCERT-POVERTY-CHALLENGE", "NITI-POVERTY-HISTORY"] as const;

export const ECO_CP006_CONCEPT_ROWS_V1: readonly EcoCp006ConceptRow[] = Object.freeze([
  { id: "labour-force", term: "Labour force", compactMeaning: "persons who are employed plus persons who are unemployed but available for work", sourceIds: employmentSources, sourceFactIds: ["eco-cp006-labour-force"] },
  { id: "worker", term: "Worker", compactMeaning: "a person engaged in an economic activity for production of goods or services", sourceIds: employmentSources, sourceFactIds: ["eco-cp006-worker"] },
  { id: "unemployed", term: "Unemployed", compactMeaning: "a person without work who is available for work under the survey definition", sourceIds: employmentSources, sourceFactIds: ["eco-cp006-unemployed"] },
  { id: "lfpr", term: "Labour Force Participation Rate (LFPR)", compactMeaning: "labour force as a percentage of the population", sourceIds: ["MOSPI-PLFS-CONCEPTS"], sourceFactIds: ["eco-cp006-lfpr"] },
  { id: "wpr", term: "Worker Population Ratio (WPR)", compactMeaning: "employed persons as a percentage of the population", sourceIds: ["MOSPI-PLFS-CONCEPTS"], sourceFactIds: ["eco-cp006-wpr"] },
  { id: "ur", term: "Unemployment Rate (UR)", compactMeaning: "unemployed persons as a percentage of the labour force", sourceIds: ["MOSPI-PLFS-CONCEPTS"], sourceFactIds: ["eco-cp006-ur"] },
  { id: "seasonal-unemployment", term: "Seasonal unemployment", compactMeaning: "unemployment that occurs because work is available only during certain seasons", sourceIds: employmentSources, sourceFactIds: ["eco-cp006-seasonal-unemployment"] },
  { id: "disguised-unemployment", term: "Disguised unemployment", compactMeaning: "more workers are engaged than needed, so some can leave without reducing output", sourceIds: employmentSources, sourceFactIds: ["eco-cp006-disguised-unemployment"] },
  { id: "frictional-unemployment", term: "Frictional unemployment", compactMeaning: "short-term unemployment while people move between jobs or search for work", sourceIds: employmentSources, sourceFactIds: ["eco-cp006-frictional-unemployment"] },
  { id: "structural-unemployment", term: "Structural unemployment", compactMeaning: "unemployment caused by a mismatch between workers' skills or location and available jobs", sourceIds: employmentSources, sourceFactIds: ["eco-cp006-structural-unemployment"] },
  { id: "cyclical-unemployment", term: "Cyclical unemployment", compactMeaning: "unemployment caused by a fall in overall demand during an economic downturn", sourceIds: employmentSources, sourceFactIds: ["eco-cp006-cyclical-unemployment"] },
  { id: "absolute-poverty", term: "Absolute poverty", compactMeaning: "poverty judged against a minimum level needed to meet basic needs", sourceIds: povertySources, sourceFactIds: ["eco-cp006-absolute-poverty"] },
  { id: "relative-poverty", term: "Relative poverty", compactMeaning: "poverty judged by comparing a person's or group's resources with others in the same society", sourceIds: povertySources, sourceFactIds: ["eco-cp006-relative-poverty"] },
  { id: "multidimensional-poverty", term: "Multidimensional poverty", compactMeaning: "poverty measured through deprivations in several dimensions such as health, education and living standards", sourceIds: povertySources, sourceFactIds: ["eco-cp006-multidimensional-poverty"] },
  { id: "poverty-line", term: "Poverty line", compactMeaning: "a threshold used to identify people or households considered poor under a chosen method", sourceIds: povertySources, sourceFactIds: ["eco-cp006-poverty-line"] },
  { id: "headcount-ratio", term: "Poverty headcount ratio", compactMeaning: "the percentage of the population identified as poor under the chosen poverty threshold", sourceIds: povertySources, sourceFactIds: ["eco-cp006-headcount-ratio"] },
  { id: "mgnrega", term: "MGNREGA", compactMeaning: "a 2005 law providing a statutory rural employment guarantee of up to 100 days of wage employment to eligible households", sourceIds: ["NCERT-POVERTY-CHALLENGE"], sourceFactIds: ["eco-cp006-mgnrega"] },
]);

export const ECO_CP006_EMPLOYMENT_SCENARIOS_V1: readonly EcoCp006EmploymentScenario[] = Object.freeze([
  { id: "self-farmer", stem: "A farmer works on land operated by the family and does not receive a fixed salary from an employer.", answer: "Self-employed", explanation: "The person works in an enterprise operated by the household rather than for a separate employer.", sourceIds: employmentSources, sourceFactIds: ["eco-cp006-self-employed"] },
  { id: "self-shop", stem: "A person runs her own small grocery shop.", answer: "Self-employed", explanation: "She works in her own enterprise, so she is self-employed.", sourceIds: employmentSources, sourceFactIds: ["eco-cp006-self-employed"] },
  { id: "regular-clerk", stem: "A clerk works for the same office and receives a regular monthly salary.", answer: "Regular wage/salaried", explanation: "A continuing job with regular salary is regular wage or salaried employment.", sourceIds: employmentSources, sourceFactIds: ["eco-cp006-regular-salaried"] },
  { id: "regular-teacher", stem: "A teacher is employed by a school and receives a fixed monthly salary.", answer: "Regular wage/salaried", explanation: "The worker has a regular employer and receives a salary.", sourceIds: employmentSources, sourceFactIds: ["eco-cp006-regular-salaried"] },
  { id: "casual-construction", stem: "A construction worker is hired and paid only for the days on which work is available.", answer: "Casual labour", explanation: "The worker is hired on a casual basis and is paid for the work period rather than holding a regular salaried post.", sourceIds: employmentSources, sourceFactIds: ["eco-cp006-casual-labour"] },
  { id: "casual-farm", stem: "A farm worker is hired for a few days during harvesting and paid daily wages.", answer: "Casual labour", explanation: "Short-term hiring on daily wages is casual labour.", sourceIds: employmentSources, sourceFactIds: ["eco-cp006-casual-labour"] },
]);

export const ECO_CP006_COMMITTEE_ROWS_V1: readonly EcoCp006CommitteeRow[] = Object.freeze([
  { id: "alagh", committee: "Y. K. Alagh Task Force", year: 1979, purpose: "projections of minimum needs and effective consumption demand, including poverty-line estimation", sourceIds: ["NITI-POVERTY-HISTORY"], sourceFactIds: ["eco-cp006-alagh"] },
  { id: "lakdawala", committee: "Lakdawala Expert Group", year: 1993, purpose: "estimation of the proportion and number of poor", sourceIds: ["NITI-POVERTY-HISTORY"], sourceFactIds: ["eco-cp006-lakdawala"] },
  { id: "tendulkar", committee: "Tendulkar Expert Group", year: 2009, purpose: "review of the methodology for estimation of poverty", sourceIds: ["NITI-POVERTY-HISTORY"], sourceFactIds: ["eco-cp006-tendulkar"] },
  { id: "rangarajan", committee: "Rangarajan Expert Group", year: 2014, purpose: "review of the methodology for measurement of poverty", sourceIds: ["NITI-POVERTY-HISTORY"], sourceFactIds: ["eco-cp006-rangarajan"] },
]);
