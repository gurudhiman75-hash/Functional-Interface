export const ECO_CP004_SOURCES_V1 = Object.freeze([
  {
    id: "NCERT-ECON-SYLLABUS-XI-XII",
    title: "NCERT Economics Syllabus Classes XI-XII",
    url: "https://www.ncert.nic.in/pdf/syllabus/08HGPES%20%28XI-XII%29.pdf",
    note: "Covers national income and related aggregates and the value added, income and expenditure methods.",
  },
  {
    id: "MOSPI-NAS-SOURCES-METHODS",
    title: "MoSPI Sources and Methods, National Accounts Statistics",
    url: "https://www.mospi.gov.in/sites/default/files/publication_reports/sources_method_2012%20%281%29.pdf",
    note: "Official definitions of GDP, GVA, intermediate consumption and national-accounting concepts.",
  },
  {
    id: "MOSPI-NAS-MANUAL",
    title: "MoSPI Manual on National Accounts Statistics",
    url: "https://www.mospi.gov.in/sites/default/files/publication_reports/national_accounta_0.pdf",
    note: "Official description of production, income and expenditure approaches to GDP.",
  },
  {
    id: "MOSPI-FAQ-NATIONAL-ACCOUNTS",
    title: "MoSPI FAQs on National Accounts and Base Year",
    url: "https://www.mospi.gov.in/faq",
    note: "Official explanation of GVA/GDP and the purpose of a base year and base revision.",
  },
] as const);

export const ECO_CP004_SOURCE_IDS_V1 = ECO_CP004_SOURCES_V1.map((source) => source.id);
