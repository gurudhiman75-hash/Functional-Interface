export const ECO_CP022_FACTS_V1 = [
  { id: "human-development-concept", sourceIds: ["UNDP-HUMAN-DEVELOPMENT","UNDP-HDR-1990"], text: "Human development focuses on enlarging people's choices, capabilities and opportunities rather than treating income growth as the sole end of development." },
  { id: "hdr-1990", sourceIds: ["UNDP-HDR-1990"], text: "The first global Human Development Report was published in 1990." },
  { id: "mahbub-ul-haq", sourceIds: ["UNDP-HUMAN-DEVELOPMENT"], text: "Mahbub ul Haq is closely associated with the human-development approach; Amartya Sen's capability approach strongly influenced it." },
  { id: "hdi-purpose", sourceIds: ["UNDP-HDI"], text: "HDI is a summary measure of average achievement in key dimensions of human development." },
  { id: "hdi-dimensions", sourceIds: ["UNDP-HDI"], text: "HDI has three dimensions: a long and healthy life, knowledge, and a decent standard of living." },
  { id: "hdi-health", sourceIds: ["UNDP-HDI"], text: "The health dimension of HDI is measured by life expectancy at birth." },
  { id: "hdi-education", sourceIds: ["UNDP-HDI"], text: "The education dimension uses mean years of schooling and expected years of schooling." },
  { id: "hdi-income", sourceIds: ["UNDP-HDI"], text: "The standard-of-living dimension of HDI uses GNI per capita." },
  { id: "hdi-geometric-mean", sourceIds: ["UNDP-HDI"], text: "HDI is calculated as the geometric mean of normalized indices for its three dimensions." },
  { id: "growth-vs-development", sourceIds: ["UNDP-HUMAN-DEVELOPMENT","UNDP-HDR-1990"], text: "Economic growth concerns expansion of output or income, while economic development is broader and includes improvements in human wellbeing and capabilities." },
  { id: "gni-per-capita", sourceIds: ["WB-GNI-PPP"], text: "GNI per capita is gross national income divided by population." },
  { id: "ppp", sourceIds: ["WB-GNI-PPP"], text: "Purchasing power parity adjusts for differences in price levels across countries and improves cross-country comparisons of material wellbeing." },
  { id: "lorenz-curve", sourceIds: ["WB-GINI"], text: "A Lorenz curve plots cumulative population shares against cumulative income or consumption shares." },
  { id: "gini", sourceIds: ["WB-GINI"], text: "The Gini index measures inequality; lower values indicate greater equality and higher values indicate greater inequality." },
  { id: "absolute-poverty", sourceIds: ["WB-POVERTY"], text: "Absolute poverty refers to deprivation against a fixed basic-needs or real-resource standard." },
  { id: "relative-poverty", sourceIds: ["WB-POVERTY"], text: "Relative poverty is defined in relation to the typical living standard or income distribution of a society." },
  { id: "mpi-purpose", sourceIds: ["UNDP-MPI"], text: "The global MPI identifies overlapping deprivations at household and individual level." },
  { id: "mpi-dimensions", sourceIds: ["UNDP-MPI"], text: "The global MPI uses three dimensions: health, education and standard of living." },
  { id: "mpi-incidence-intensity", sourceIds: ["UNDP-MPI"], text: "MPI reflects both the incidence of multidimensional poverty and the intensity of deprivation among poor people." },
  { id: "human-capital", sourceIds: ["UNDP-HUMAN-DEVELOPMENT"], text: "Education and health build human capabilities and productive potential, but human development is broader than productivity alone." },
] as const;

export const ECO_CP022_FACT_IDS_V1 = ECO_CP022_FACTS_V1.map((fact) => fact.id);
