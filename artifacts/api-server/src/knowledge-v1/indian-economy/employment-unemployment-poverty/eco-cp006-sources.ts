export const ECO_CP006_SOURCES_V1 = Object.freeze([
  {
    id: "NCERT-IED-EMPLOYMENT",
    authority: "National Council of Educational Research and Training",
    title: "Indian Economic Development — Employment: Growth, Informalisation and Other Issues",
    url: "https://ncert.nic.in/textbook.php?keec1=gl-5",
    notes: "Static concepts around workers, employment status, unemployment and employment structure.",
  },
  {
    id: "MOSPI-PLFS-CONCEPTS",
    authority: "Ministry of Statistics and Programme Implementation",
    title: "Periodic Labour Force Survey — Concepts and Definitions",
    url: "https://mospi.gov.in/sites/default/files/publication_reports/Annual_Report_PLFS_2019_20F1.pdf",
    notes: "Official definitions of labour force, LFPR, WPR and unemployment rate.",
  },
  {
    id: "NCERT-POVERTY-CHALLENGE",
    authority: "National Council of Educational Research and Training",
    title: "Poverty as a Challenge",
    url: "https://ncert.nic.in/textbook/pdf/iess203.pdf",
    notes: "Poverty-line concept, multidimensional deprivation and anti-poverty strategy including MGNREGA.",
  },
  {
    id: "NITI-POVERTY-HISTORY",
    authority: "NITI Aayog",
    title: "National Multidimensional Poverty Index — History of Poverty Measurement",
    url: "https://www.niti.gov.in/node/868",
    notes: "History of poverty measurement and expert groups led by Alagh, Lakdawala, Tendulkar and Rangarajan.",
  },
] as const);

export const ECO_CP006_SOURCE_IDS_V1 = ECO_CP006_SOURCES_V1.map((source) => source.id);
