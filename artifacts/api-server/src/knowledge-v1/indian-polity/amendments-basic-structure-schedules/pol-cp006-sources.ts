export type PolCp006Source = {
  sourceId: string;
  sourceType: "official" | "judgment";
  title: string;
  url: string;
  notes: string;
};

export const POL_CP006_SOURCES_V1: readonly PolCp006Source[] = Object.freeze([
  {
    sourceId: "LEGISLATIVE-DEPT-CONSTITUTION-2025",
    sourceType: "official",
    title: "The Constitution of India — Legislative Department (inclusive of the 106th Amendment)",
    url: "https://www.legislative.gov.in/static/uploads/2025/07/359f70a69695affb9d72f8393102bd2e.pdf",
    notes: "Primary authority for Article 368, constitutional Schedules and current constitutional text.",
  },
  {
    sourceId: "SCI-KESAVANANDA-1973",
    sourceType: "judgment",
    title: "His Holiness Kesavananda Bharati v. State of Kerala [1973] Supp SCR 1",
    url: "https://www.sci.gov.in/document/his-holiness-kesavananda-bharati-v-state-of-kerala-1973-supp-scr-1/",
    notes: "Primary Supreme Court authority for the basic structure doctrine.",
  },
  {
    sourceId: "SCI-BASIC-STRUCTURE-2022",
    sourceType: "judgment",
    title: "Supreme Court Constitution Bench discussion of basic structure, Minerva Mills and related cases",
    url: "https://api.sci.gov.in/supremecourt/2019/1827/1827_2019_1_1501_39619_Judgement_07-Nov-2022.pdf",
    notes: "Used for settled basic-structure features such as secularism and discussion of Minerva Mills.",
  },
  {
    sourceId: "SCI-ARTICLE31C-2024",
    sourceType: "judgment",
    title: "Supreme Court Constitution Bench judgment dated 5 November 2024",
    url: "https://api.sci.gov.in/supremecourt/1992/78629/78629_1992_1_1501_57003_Judgement_05-Nov-2024.pdf",
    notes: "Used for authoritative restatement of Kesavananda Bharati and Minerva Mills in the amendment/basic-structure context.",
  },
  {
    sourceId: "CONSTITUTION-106TH-AMENDMENT-2023",
    sourceType: "official",
    title: "The Constitution (One Hundred and Sixth Amendment) Act, 2023",
    url: "https://www.legislative.gov.in/static/uploads/2025/07/677f65dda7c606ba1d13b8430af70555.pdf",
    notes: "Primary authority for the 106th Amendment and its women-reservation provisions.",
  },
]);
