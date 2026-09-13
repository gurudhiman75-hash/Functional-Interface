export type PolCp004Source = {
  sourceId: string;
  sourceType: "official" | "judgment";
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
  {
    sourceId: "SCI-2024-ARTICLE31C-OPERATIVE",
    sourceType: "judgment",
    title: "Supreme Court Constitution Bench judgment confirming the operative pre-Forty-second-Amendment scope of Article 31C",
    url: "https://api.sci.gov.in/supremecourt/1992/78629/78629_1992_1_1501_57003_Judgement_05-Nov-2024.pdf",
    notes: "Used only for the current operative scope of Article 31C: protection remains tied to laws giving effect to Article 39(b) and 39(c), not the broader Forty-second-Amendment expansion struck down in Minerva Mills.",
  },
]);
