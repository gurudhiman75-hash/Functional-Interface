export type PolCp003Source = {
  sourceId: string;
  sourceType: "official" | "statute";
  title: string;
  url: string;
  notes: string;
};

export const POL_CP003_SOURCES_V1: readonly PolCp003Source[] = Object.freeze([
  {
    sourceId: "LEGISLATIVE-DEPT-CONSTITUTION-2025",
    sourceType: "official",
    title: "The Constitution of India — Legislative Department (updated through the 106th Amendment)",
    url: "https://www.legislative.gov.in/static/uploads/2025/07/359f70a69695affb9d72f8393102bd2e.pdf",
    notes: "Primary constitutional text for the Preamble, Part I (Articles 1–4) and Part II (Articles 5–11).",
  },
  {
    sourceId: "CONSTITUTION-42ND-AMENDMENT-1976",
    sourceType: "statute",
    title: "The Constitution (Forty-second Amendment) Act, 1976",
    url: "https://www.legislative.gov.in/static/uploads/2025/07/9f820a53b6e6840a459bde27eb5d24e5.pdf",
    notes: "Primary authority for adding SOCIALIST and SECULAR to the Preamble and substituting unity and integrity of the Nation.",
  },
]);
