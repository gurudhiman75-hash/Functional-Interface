export type PolCp013Source = {
  sourceId: string;
  sourceType: "official";
  title: string;
  url: string;
  notes: string;
};

export const POL_CP013_SOURCES_V1: readonly PolCp013Source[] = Object.freeze([
  {
    sourceId: "LEGISLATIVE-DEPT-CONSTITUTION-2026",
    sourceType: "official",
    title: "The Constitution of India — Legislative Department (as on 1 May 2026)",
    url: "https://www.legislative.gov.in/static/uploads/2025/07/c9fe9c9b6840524844316f74bb1c556c.pdf",
    notes: "Primary constitutional source for Articles 214–237, Article 226 writ jurisdiction and subordinate judiciary rules.",
  },
  {
    sourceId: "SCI-SUPREME-COURT-JURISDICTION",
    sourceType: "official",
    title: "Supreme Court of India — Jurisdiction",
    url: "https://www.sci.gov.in/jurisdiction/",
    notes: "Official Supreme Court overview confirming High Court composition, appointment basics, retirement age, qualifications and Article 226 writ jurisdiction.",
  },
  {
    sourceId: "SCI-WRIT-DEFINITIONS",
    sourceType: "official",
    title: "Supreme Court of India judgment discussing principal constitutional writs",
    url: "https://api.sci.gov.in/jonew/judis/42.pdf",
    notes: "Official Supreme Court judgment used only for the standard functional meaning of habeas corpus, mandamus, prohibition, quo warranto and certiorari.",
  },
]);
