export type PolCp012Source = {
  sourceId: string;
  sourceType: "official";
  title: string;
  url: string;
  notes: string;
};

export const POL_CP012_SOURCES_V1: readonly PolCp012Source[] = Object.freeze([
  {
    sourceId: "LEGISLATIVE-DEPT-CONSTITUTION-2026",
    sourceType: "official",
    title: "The Constitution of India — Legislative Department (as on 1 May 2026)",
    url: "https://www.legislative.gov.in/static/uploads/2025/07/c9fe9c9b6840524844316f74bb1c556c.pdf",
    notes: "Primary constitutional text for Articles 124–147 and Article 32. The PDF footnotes identify the Ninety-Ninth Amendment/NJAC provisions as struck down.",
  },
  {
    sourceId: "SCI-SUPREME-COURT-JURISDICTION",
    sourceType: "official",
    title: "Supreme Court of India — Jurisdiction",
    url: "https://www.sci.gov.in/jurisdiction/",
    notes: "Official Supreme Court summary of original, appellate, special-leave, advisory, review and contempt jurisdiction.",
  },
  {
    sourceId: "DOJ-COLLEGIUM-NJAC-POSITION",
    sourceType: "official",
    title: "Department of Justice — Collegium/NJAC position",
    url: "https://www.doj.gov.in/static/uploads/2025/11/0420d9aef08a41515f6f92ac586189fe.pdf",
    notes: "Official Department of Justice material noting that the Ninety-Ninth Amendment and NJAC Act were declared unconstitutional and the prior collegium system became operative again.",
  },
]);
