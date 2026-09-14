export type PolCp007Source = {
  sourceId: string;
  sourceType: "official";
  title: string;
  url: string;
  notes: string;
};

export const POL_CP007_SOURCES_V1: readonly PolCp007Source[] = Object.freeze([
  {
    sourceId: "LEGISLATIVE-DEPT-CONSTITUTION-2025",
    sourceType: "official",
    title: "The Constitution of India — Legislative Department (as on 11 November 2025)",
    url: "https://www.legislative.gov.in/static/uploads/2025/07/359f70a69695affb9d72f8393102bd2e.pdf",
    notes: "Primary constitutional text for Articles 52–62, 71–72, 74, 85, 111, 123 and related President provisions used in this CP.",
  },
]);
