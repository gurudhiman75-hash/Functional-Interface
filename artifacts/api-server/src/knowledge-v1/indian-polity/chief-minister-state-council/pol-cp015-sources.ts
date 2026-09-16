export const POL_CP015_SOURCES = Object.freeze([
  {
    sourceId: "LEGISLATIVE-DEPT-CONSTITUTION-2026",
    title: "The Constitution of India — As on 1st May, 2026",
    publisher: "Government of India, Ministry of Law and Justice, Legislative Department",
    url: "https://www.legislative.gov.in/static/uploads/2025/07/88cca69e868e50b217f855be2fb8bdba.pdf",
    scope: "Articles 163–167 and 177; Article 164(1A), 164(1B), 164(2)–(5)",
    accessedFor: "POL-CP-015",
  },
] as const);

export type PolCp015SourceId = (typeof POL_CP015_SOURCES)[number]["sourceId"];
