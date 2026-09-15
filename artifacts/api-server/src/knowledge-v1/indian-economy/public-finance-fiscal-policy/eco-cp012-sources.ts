export const ECO_CP012_SOURCES_V1 = Object.freeze([
  {
    id: "NCERT-GOVT-BUDGET",
    authority: "NCERT",
    title: "Introductory Macroeconomics — Government Budget and the Economy",
    url: "https://www.ncert.nic.in/textbook/pdf/leec105.pdf",
    notes: "Covers revenue/capital receipts and expenditure, deficit concepts, public debt and fiscal-policy basics.",
  },
  {
    id: "GOI-BUDGET-EXPLANATORY",
    authority: "Ministry of Finance, Government of India",
    title: "Budget at a Glance — Explanatory Notes",
    url: "https://www.indiabudget.gov.in/budget_archive/ub2010-11/bag/bag8.htm",
    notes: "Defines revenue deficit, fiscal deficit and primary deficit in official Budget terminology.",
  },
  {
    id: "GOI-KEY-BUDGET",
    authority: "Ministry of Finance, Government of India",
    title: "Key to Budget Documents",
    url: "https://www.indiabudget.gov.in/budget2024-25%28I%29/doc/Key_to_Budget_Document_2024.pdf",
    notes: "Explains revenue and capital budgets, including capital receipts and capital expenditure classifications.",
  },
  {
    id: "FRBM-ACT",
    authority: "Department of Economic Affairs, Ministry of Finance",
    title: "Fiscal Responsibility and Budget Management Act, 2003",
    url: "https://dea.gov.in/acts-policies/fiscal-responsibility-and-budget-management-act-2003",
    notes: "Provides the statutory fiscal-responsibility framework: sustainability, transparency, debt/deficit discipline and medium-term fiscal policy.",
  },
] as const);

export const ECO_CP012_SOURCE_IDS_V1 = ECO_CP012_SOURCES_V1.map((source) => source.id);
