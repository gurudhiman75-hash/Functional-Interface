export type PolCp004Source = {
  sourceId: string;
  sourceType: "official";
  title: string;
  url: string;
  notes: string;
};

export const POL_CP004_SOURCES_V1: readonly PolCp004Source[] = Object.freeze([
  {
    sourceId: "LEGISLATIVE-DEPT-CONSTITUTION-2025",
    sourceType: "official",
    title: "The Constitution of India — Legislative Department (updated through the 106th Amendment)",
    url: "https://www.legislative.gov.in/static/uploads/2025/07/359f70a69695affb9d72f8393102bd2e.pdf",
    notes: "Primary authority for Part III, Articles 12–35, and Article 300A where the present status of the right to property is contrasted with Fundamental Rights.",
  },
]);
