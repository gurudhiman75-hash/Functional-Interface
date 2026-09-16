export type PolCp009Source = {
  sourceId: string;
  sourceType: "official";
  title: string;
  url: string;
  notes: string;
};

export const POL_CP009_SOURCES_V1: readonly PolCp009Source[] = Object.freeze([
  {
    sourceId: "LEGISLATIVE-DEPT-CONSTITUTION-2025",
    sourceType: "official",
    title: "The Constitution of India — Legislative Department (as on 11 November 2025)",
    url: "https://www.legislative.gov.in/static/uploads/2025/07/359f70a69695affb9d72f8393102bd2e.pdf",
    notes: "Primary constitutional text for Articles 74, 75, 77, 78, 88 and the Cabinet definition in Article 352(3).",
  },
]);
