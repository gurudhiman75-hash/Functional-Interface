export const ECO_CP013_SOURCES_V1 = Object.freeze([
  {
    id: "CONST-ART-112-117",
    authority: "Legislative Department, Government of India",
    title: "The Constitution of India — Articles 112 to 117",
    url: "https://www.legislative.gov.in/static/uploads/2025/07/359f70a69695affb9d72f8393102bd2e.pdf",
    notes: "Articles 112-117 cover the Annual Financial Statement, Demands for Grants, Appropriation Bills, supplementary/additional/excess grants, Vote on Account/Vote of Credit/Exceptional Grant and financial Bills.",
  },
  {
    id: "CONST-ART-266-267",
    authority: "Legislative Department, Government of India",
    title: "The Constitution of India — Articles 266 and 267",
    url: "https://www.legislative.gov.in/static/uploads/2025/07/359f70a69695affb9d72f8393102bd2e.pdf",
    notes: "Articles 266 and 267 provide the constitutional basis for the Consolidated Fund, Public Account and Contingency Fund.",
  },
  {
    id: "MOF-KEY-BUDGET-DOCS-2026",
    authority: "Ministry of Finance, Government of India",
    title: "Key to the Budget Documents 2026-2027",
    url: "https://www.indiabudget.gov.in/doc/Key_to_Budget_Document_2026.pdf",
    notes: "Official descriptions of AFS, Government funds, Demands for Grants, Finance Bill, Expenditure Budget, Receipt Budget, Expenditure Profile and Budget at a Glance. Current-year values are excluded from the static pool.",
  },
] as const);

export const ECO_CP013_SOURCE_IDS_V1 = ECO_CP013_SOURCES_V1.map((source) => source.id);
