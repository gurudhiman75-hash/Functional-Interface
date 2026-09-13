export type PolCp005Source = {
  sourceId: string;
  sourceType: "official" | "academic";
  title: string;
  url: string;
  notes: string;
};

export const POL_CP005_SOURCES_V1: readonly PolCp005Source[] = Object.freeze([
  {
    sourceId: "LEGISLATIVE-DEPT-CONSTITUTION-2025",
    sourceType: "official",
    title: "The Constitution of India — Legislative Department (updated through the 106th Amendment)",
    url: "https://www.legislative.gov.in/static/uploads/2025/07/359f70a69695affb9d72f8393102bd2e.pdf",
    notes: "Primary authority for Part IV Articles 36–51 and Part IVA Article 51A, including amendment footnotes.",
  },
  {
    sourceId: "CONSTITUTION-42ND-AMENDMENT-1976",
    sourceType: "official",
    title: "The Constitution (Forty-second Amendment) Act, 1976",
    url: "https://www.legislative.gov.in/static/uploads/2025/07/9f820a53b6e6840a459bde27eb5d24e5.pdf",
    notes: "Primary amendment authority for Article 39A, Article 43A, Article 48A and the original ten Fundamental Duties in Article 51A.",
  },
  {
    sourceId: "CONSTITUTION-86TH-AMENDMENT-2002",
    sourceType: "official",
    title: "The Constitution (Eighty-sixth Amendment) Act, 2002",
    url: "https://www.legislative.gov.in/static/uploads/2025/07/16970eb1a68d4fe46ac40acd783a6c34.pdf",
    notes: "Primary authority for the present Article 45 and Fundamental Duty Article 51A(k).",
  },
  {
    sourceId: "CONSTITUTION-97TH-AMENDMENT-2011",
    sourceType: "official",
    title: "The Constitution (Ninety-seventh Amendment) Act, 2011",
    url: "https://cdnbbsr.s3waas.gov.in/s380537a945c7aaa788ccfcdf1b99b5d8f/uploads/2023/03/2023030264.pdf",
    notes: "Primary amendment authority for Article 43B on co-operative societies.",
  },
]);
