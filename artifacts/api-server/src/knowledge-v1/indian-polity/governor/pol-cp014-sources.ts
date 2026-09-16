export type PolCp014Source = {
  sourceId: string;
  sourceType: "official";
  title: string;
  url: string;
  notes: string;
};

export const POL_CP014_SOURCES_V1: readonly PolCp014Source[] = Object.freeze([
  {
    sourceId: "LEGISLATIVE-DEPT-CONSTITUTION-2026",
    sourceType: "official",
    title: "The Constitution of India — Legislative Department (as on 1 May 2026)",
    url: "https://www.legislative.gov.in/static/uploads/2025/07/c9fe9c9b6840524844316f74bb1c556c.pdf",
    notes: "Primary constitutional source for Articles 153–167, 174–176, 200–201 and 213.",
  },
]);
