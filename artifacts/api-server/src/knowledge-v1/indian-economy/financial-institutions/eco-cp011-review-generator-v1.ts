import type { KnowledgeV1Difficulty } from "../../types";
import { ecoCp011Fact } from "./eco-cp011-facts";
import type { EcoCp011ReviewQuestion } from "./eco-cp011-review-types";

const qlNames: Record<number, string> = {
  1: "DFI concept and long-term finance",
  2: "IFCI history and role",
  3: "NABARD history and role",
  4: "SIDBI history and role",
  5: "EXIM Bank history and role",
  6: "NHB history and role",
  7: "NaBFID history and infrastructure role",
  8: "Institution-to-sector matching",
  9: "NBFC basic concept and bank distinction",
  10: "Correctly matched institution and function",
  11: "Statement evaluation",
  12: "Mixed close institutional distinctions",
};

function difficultyForVariant(ql: number, row: number): KnowledgeV1Difficulty {
  if (ql === 1 || ql === 2) return row === 0 ? "Easy" : "Medium";
  if ([3, 4, 5, 6, 7, 8, 9].includes(ql)) return row === 0 ? "Easy" : row < 3 ? "Medium" : "Hard";
  if (ql === 10) return row < 2 ? "Medium" : "Hard";
  if (ql === 11) return row === 0 ? "Medium" : "Hard";
  return row === 0 ? "Medium" : "Hard";
}

function moveCorrect(options: string[], correct: string, target: number) {
  const index = options.indexOf(correct);
  if (index < 0) throw new Error(`Correct option missing: ${correct}`);
  [options[index], options[target]] = [options[target], options[index]];
  return options;
}

function sourceBundle(ids: string[]) {
  const facts = ids.map(ecoCp011Fact);
  return {
    sourceIds: [...new Set(facts.flatMap((fact) => fact.sourceIds))],
    sourceFactIds: [...new Set(facts.flatMap((fact) => fact.sourceFactIds))],
  };
}

type Case = {
  stem: string;
  correct: string;
  options: string[];
  explanation: string;
  factIds: string[];
};

const qlCases: Record<number, Case[]> = {
  1: [
    {
      stem: "What is the main purpose of a Development Financial Institution?",
      correct: "Provide or catalyse long-term development finance",
      options: ["Provide or catalyse long-term development finance", "Issue currency notes", "Collect income tax", "Run stock exchanges"],
      explanation: "A DFI is designed to fill long-term financing gaps in development-oriented sectors. It is not a currency-issuing or tax-collection institution.",
      factIds: ["dfi"],
    },
    {
      stem: "Why were DFIs important when commercial banks mainly focused on shorter-term finance?",
      correct: "Large development projects often need long-term funds",
      options: ["Large development projects often need long-term funds", "DFIs print money for projects", "DFIs replace all banks", "Long-term projects require no finance"],
      explanation: "Infrastructure and industrial projects often need finance for long periods before returns are realised. DFIs were created to help bridge that maturity gap.",
      factIds: ["dfi", "ifci-1948"],
    },
    {
      stem: "Which feature best separates a DFI from an ordinary retail-banking role?",
      correct: "Specialised development and long-term financing focus",
      options: ["Specialised development and long-term financing focus", "Only accepting salary accounts", "Only issuing debit cards", "Only handling cash withdrawals"],
      explanation: "The deciding feature is the specialised development-finance mandate. Ordinary retail banking focuses more directly on routine deposits, payments and loans to customers.",
      factIds: ["dfi"],
    },
  ],
  2: [
    {
      stem: "Which institution was established in 1948 as India's first Development Financial Institution?",
      correct: "IFCI",
      options: ["IFCI", "NABARD", "SIDBI", "NaBFID"],
      explanation: "IFCI was established on 1 July 1948 as India's first DFI. Its original purpose was to meet long-term finance needs of industry.",
      factIds: ["ifci-1948"],
    },
    {
      stem: "IFCI was originally created mainly to meet which need?",
      correct: "Long-term finance for industry",
      options: ["Long-term finance for industry", "Retail payment services", "Crop insurance only", "Currency-note printing"],
      explanation: "IFCI was created when long-term industrial finance was scarce. Its original development role was therefore tied to industry rather than ordinary retail banking.",
      factIds: ["ifci-1948", "dfi"],
    },
    {
      stem: "Which pair is correctly matched?",
      correct: "IFCI — first DFI in India",
      options: ["IFCI — first DFI in India", "SIDBI — banknote issuer", "NABARD — stock-market regulator", "NHB — export-import bank"],
      explanation: "IFCI was India's first Development Financial Institution. The other institutions have different sector-specific mandates.",
      factIds: ["ifci-1948", "sidbi-1990", "nabard-1982", "nhb-1988"],
    },
  ],
  3: [
    {
      stem: "NABARD was established in:",
      correct: "1982",
      options: ["1982", "1948", "1988", "1990"],
      explanation: "NABARD was established on 12 July 1982. Its mandate centres on agriculture and rural development.",
      factIds: ["nabard-1982"],
    },
    {
      stem: "Which sector is most directly associated with NABARD?",
      correct: "Agriculture and rural development",
      options: ["Agriculture and rural development", "Export-import trade", "Urban stock exchanges", "Telecom regulation"],
      explanation: "NABARD is the apex development institution for agriculture and rural development. Its work includes rural credit, refinance and institutional development.",
      factIds: ["nabard-1982"],
    },
    {
      stem: "A rural cooperative bank needs refinance support for agricultural lending. Which institution is most directly relevant?",
      correct: "NABARD",
      options: ["NABARD", "EXIM Bank", "NHB", "NaBFID"],
      explanation: "NABARD provides refinance and institutional support to eligible lenders serving rural and agricultural sectors. That fits this case directly.",
      factIds: ["nabard-refinance"],
    },
    {
      stem: "Which statement best describes NABARD's refinance role?",
      correct: "It supports eligible rural lending institutions that extend credit onward",
      options: ["It supports eligible rural lending institutions that extend credit onward", "It prints currency for rural banks", "It regulates stock exchanges", "It finances only overseas exports"],
      explanation: "Refinance means NABARD supplies funds to eligible lending institutions against qualifying rural credit. The lender then serves the final borrowers.",
      factIds: ["nabard-refinance", "nabard-1982"],
    },
  ],
  4: [
    {
      stem: "SIDBI was set up in:",
      correct: "1990",
      options: ["1990", "1982", "1988", "2021"],
      explanation: "SIDBI was set up on 2 April 1990. It is the principal financial institution for promotion, financing and development of MSMEs.",
      factIds: ["sidbi-1990"],
    },
    {
      stem: "SIDBI is most closely associated with which sector?",
      correct: "Micro, Small and Medium Enterprises",
      options: ["Micro, Small and Medium Enterprises", "Foreign-exchange reserves", "Housing regulation only", "Agricultural procurement"],
      explanation: "SIDBI's statutory development mandate is centred on the MSME sector. It supports both finance and development of smaller enterprises.",
      factIds: ["sidbi-1990"],
    },
    {
      stem: "An institution wants to refinance lenders and also provide direct finance to MSMEs. Which institution's mandate fits best?",
      correct: "SIDBI",
      options: ["SIDBI", "NABARD", "NHB", "EXIM Bank"],
      explanation: "SIDBI uses both indirect and direct financing channels for MSMEs. This is part of its wider promotion, financing and development mandate.",
      factIds: ["sidbi-role"],
    },
    {
      stem: "Which feature best distinguishes SIDBI from NABARD?",
      correct: "SIDBI focuses on MSMEs, while NABARD focuses on agriculture and rural development",
      options: ["SIDBI focuses on MSMEs, while NABARD focuses on agriculture and rural development", "SIDBI issues currency, while NABARD mints coins", "SIDBI regulates stock markets, while NABARD regulates insurance", "There is no sectoral distinction"],
      explanation: "Both are development institutions, but their core sectoral mandates differ. SIDBI centres on MSMEs, while NABARD centres on agriculture and rural development.",
      factIds: ["sidbi-1990", "nabard-1982"],
    },
  ],
  5: [
    {
      stem: "Export-Import Bank of India began operations in:",
      correct: "1982",
      options: ["1982", "1948", "1988", "1990"],
      explanation: "The Export-Import Bank of India Act was enacted in 1981 and the Bank commenced operations in March 1982.",
      factIds: ["exim-1982"],
    },
    {
      stem: "What is the main sectoral role of EXIM Bank?",
      correct: "Financing and facilitating international trade",
      options: ["Financing and facilitating international trade", "Regulating mutual funds", "Financing only village cooperatives", "Issuing currency notes"],
      explanation: "EXIM Bank was created to finance, facilitate and promote India's foreign trade. It also coordinates institutions involved in export-import finance.",
      factIds: ["exim-role"],
    },
    {
      stem: "An Indian exporter needs specialised finance for an overseas project. Which institution is most directly relevant?",
      correct: "EXIM Bank",
      options: ["EXIM Bank", "NHB", "NABARD", "NaBFID"],
      explanation: "EXIM Bank specialises in supporting India's international trade and investment. Overseas export-related finance therefore fits its mandate.",
      factIds: ["exim-role"],
    },
    {
      stem: "Which statement correctly distinguishes EXIM Bank from SIDBI?",
      correct: "EXIM Bank focuses on international trade; SIDBI focuses on MSMEs",
      options: ["EXIM Bank focuses on international trade; SIDBI focuses on MSMEs", "EXIM Bank focuses on housing; SIDBI on infrastructure", "Both are currency issuers", "Both exist only to regulate commercial banks"],
      explanation: "EXIM Bank has a foreign-trade mandate, whereas SIDBI's core mandate is MSME promotion, financing and development.",
      factIds: ["exim-role", "sidbi-1990"],
    },
  ],
  6: [
    {
      stem: "National Housing Bank was set up in:",
      correct: "1988",
      options: ["1988", "1982", "1990", "2021"],
      explanation: "NHB was established on 9 July 1988 under the National Housing Bank Act, 1987.",
      factIds: ["nhb-1988"],
    },
    {
      stem: "NHB is primarily associated with development of which financial sector?",
      correct: "Housing finance",
      options: ["Housing finance", "Export finance", "Agricultural procurement", "Stock exchanges"],
      explanation: "NHB was created as an apex-level institution for housing finance. Its development role includes supporting housing-finance institutions and the housing-credit system.",
      factIds: ["nhb-role"],
    },
    {
      stem: "Which institution currently holds regulatory powers over Housing Finance Companies?",
      correct: "Reserve Bank of India",
      options: ["Reserve Bank of India", "National Housing Bank", "SIDBI", "NABARD"],
      explanation: "HFC regulatory powers were transferred from NHB to RBI with effect from 9 August 2019. NHB continues its housing-finance development role.",
      factIds: ["nhb-rbi-regulation", "nhb-role"],
    },
    {
      stem: "Which statement best reflects NHB's position after the 2019 regulatory change?",
      correct: "NHB remains a housing-finance development institution, while RBI regulates HFCs",
      options: ["NHB remains a housing-finance development institution, while RBI regulates HFCs", "NHB became the currency issuer", "NHB took over MSME finance from SIDBI", "NHB became the export-import regulator"],
      explanation: "The 2019 change moved HFC regulation to RBI, not NHB's entire housing-finance mandate. NHB still supports development and financing in the housing sector.",
      factIds: ["nhb-rbi-regulation", "nhb-role"],
    },
  ],
  7: [
    {
      stem: "NaBFID was set up under an Act passed in:",
      correct: "2021",
      options: ["2021", "1948", "1982", "1990"],
      explanation: "NaBFID was set up under the National Bank for Financing Infrastructure and Development Act, 2021.",
      factIds: ["nabfid-2021"],
    },
    {
      stem: "NaBFID is primarily focused on:",
      correct: "Long-term infrastructure finance",
      options: ["Long-term infrastructure finance", "Retail savings accounts", "Crop procurement", "Currency printing"],
      explanation: "NaBFID is a specialised DFI for infrastructure. Its central purpose is to address long-term infrastructure-financing gaps.",
      factIds: ["nabfid-role"],
    },
    {
      stem: "A large infrastructure project needs long-tenor specialised finance. Which institution is most directly aligned with this need?",
      correct: "NaBFID",
      options: ["NaBFID", "NHB", "SIDBI", "NABARD"],
      explanation: "NaBFID was specifically created to support long-term infrastructure financing. That makes it the closest institutional match.",
      factIds: ["nabfid-role", "nabfid-2021"],
    },
    {
      stem: "Besides financing projects, NaBFID also aims to support development of:",
      correct: "Bond and derivatives markets for infrastructure finance",
      options: ["Bond and derivatives markets for infrastructure finance", "Currency-note printing presses", "Agricultural mandis", "Retail current accounts"],
      explanation: "NaBFID's mandate includes developing financing instruments and deeper capital-market channels for infrastructure, not only making direct loans.",
      factIds: ["nabfid-role"],
    },
  ],
  8: [
    {
      stem: "Which institution-sector pair is correct?",
      correct: "NABARD — agriculture and rural development",
      options: ["NABARD — agriculture and rural development", "SIDBI — housing finance", "NHB — export finance", "EXIM Bank — village cooperatives"],
      explanation: "NABARD's core mandate is agriculture and rural development. The other institutions specialise in different sectors.",
      factIds: ["nabard-1982", "sidbi-1990", "nhb-role", "exim-role"],
    },
    {
      stem: "Which institution-sector pair is correct?",
      correct: "SIDBI — MSMEs",
      options: ["SIDBI — MSMEs", "NABARD — overseas exports", "NHB — infrastructure highways", "NaBFID — crop refinance"],
      explanation: "SIDBI is the principal financial institution for the MSME sector. The distractors deliberately swap the specialised mandates.",
      factIds: ["sidbi-1990", "nabard-1982", "nhb-role", "nabfid-role"],
    },
    {
      stem: "Which institution-sector pair is correct?",
      correct: "NHB — housing finance",
      options: ["NHB — housing finance", "EXIM Bank — rural refinance", "NABARD — export-import coordination", "SIDBI — HFC regulation"],
      explanation: "NHB is the specialised housing-finance development institution. EXIM Bank, NABARD and SIDBI serve different mandates.",
      factIds: ["nhb-role", "exim-role", "nabard-refinance", "sidbi-1990"],
    },
    {
      stem: "Which institution-sector pair is correct?",
      correct: "NaBFID — infrastructure finance",
      options: ["NaBFID — infrastructure finance", "NHB — MSME development", "SIDBI — agricultural refinance", "NABARD — export-import finance"],
      explanation: "NaBFID is the specialised DFI for infrastructure finance. The alternatives mismatch institutions with other sectors.",
      factIds: ["nabfid-role", "nhb-role", "sidbi-1990", "nabard-1982"],
    },
  ],
  9: [
    {
      stem: "An NBFC is best described as:",
      correct: "A company principally engaged in specified financial activities but not a banking company",
      options: ["A company principally engaged in specified financial activities but not a banking company", "Any manufacturing company", "A department of RBI", "A stock exchange only"],
      explanation: "NBFCs are companies whose principal business is financial activity such as lending or investment. They are not banking companies merely because they provide finance.",
      factIds: ["nbfc-basic"],
    },
    {
      stem: "Which activity can form part of an NBFC's principal financial business?",
      correct: "Loans and advances",
      options: ["Loans and advances", "Growing crops as principal business", "Manufacturing cars as principal business", "Operating a school as principal business"],
      explanation: "Lending and investment are core financial activities associated with NBFCs. A company whose principal business is ordinary agriculture or manufacturing is not an NBFC merely because it handles money.",
      factIds: ["nbfc-basic"],
    },
    {
      stem: "Why should an NBFC not automatically be called a commercial bank?",
      correct: "It is a non-banking financial company with a different legal and regulatory status",
      options: ["It is a non-banking financial company with a different legal and regulatory status", "It cannot conduct any financial activity", "It is always a government department", "It only finances exports"],
      explanation: "NBFCs perform important financial functions, but they are legally distinct from banking companies. Similar lending activity does not make the two institution types identical.",
      factIds: ["nbfc-bank-distinction"],
    },
    {
      stem: "Which statement is most accurate?",
      correct: "NBFCs may lend or invest, but their status is not the same as that of banking companies",
      options: ["NBFCs may lend or invest, but their status is not the same as that of banking companies", "Every company making a loan is a bank", "Every NBFC can issue currency", "NBFC and DFI always mean exactly the same thing"],
      explanation: "NBFC is a legal/regulatory category of non-banking financial companies. Some institutions can have development roles, but NBFC and DFI are not interchangeable terms.",
      factIds: ["nbfc-basic", "nbfc-bank-distinction", "dfi"],
    },
  ],
  10: [
    {
      stem: "Which pair is correctly matched?",
      correct: "EXIM Bank — international trade finance",
      options: ["EXIM Bank — international trade finance", "NABARD — housing finance", "NHB — MSME development", "SIDBI — infrastructure-only finance"],
      explanation: "EXIM Bank finances and facilitates India's international trade. The other pairings swap the sectoral mandates of specialised institutions.",
      factIds: ["exim-role", "nabard-1982", "nhb-role", "sidbi-1990"],
    },
    {
      stem: "Which pair is correctly matched?",
      correct: "SIDBI — MSME promotion, finance and development",
      options: ["SIDBI — MSME promotion, finance and development", "NaBFID — crop refinance", "NHB — export-import coordination", "NABARD — HFC regulation"],
      explanation: "SIDBI's principal mandate is MSME promotion, financing and development. The alternatives assign roles belonging to other institutions.",
      factIds: ["sidbi-role", "nabfid-role", "nhb-role", "nabard-1982"],
    },
    {
      stem: "Which pair is correctly matched?",
      correct: "IFCI — first DFI; NaBFID — specialised infrastructure DFI",
      options: ["IFCI — first DFI; NaBFID — specialised infrastructure DFI", "IFCI — housing regulator; NaBFID — export bank", "IFCI — rural refinance; NaBFID — currency issuer", "IFCI — MSME apex bank; NaBFID — cooperative bank"],
      explanation: "IFCI was India's first DFI, while NaBFID is the newer specialised DFI for infrastructure finance. Their development roles belong to different periods and sectoral needs.",
      factIds: ["ifci-1948", "nabfid-2021", "nabfid-role"],
    },
  ],
  11: [
    {
      stem: "Consider the statements: I. NABARD is associated with agriculture and rural development. II. SIDBI is associated with MSMEs. Which is correct?",
      correct: "Both I and II",
      options: ["I only", "II only", "Both I and II", "Neither I nor II"],
      explanation: "Statement I is correct because NABARD serves agriculture and rural development. Statement II is correct because SIDBI's principal mandate is the MSME sector.",
      factIds: ["nabard-1982", "sidbi-1990"],
    },
    {
      stem: "Consider the statements: I. NHB was set up in 1988. II. HFC regulatory powers remain exclusively with NHB today. Which is correct?",
      correct: "I only",
      options: ["I only", "II only", "Both I and II", "Neither I nor II"],
      explanation: "Statement I is correct: NHB was set up in 1988. Statement II is false because HFC regulatory powers were transferred to RBI in 2019.",
      factIds: ["nhb-1988", "nhb-rbi-regulation"],
    },
    {
      stem: "Consider the statements: I. NaBFID focuses on infrastructure finance. II. EXIM Bank's principal role is agricultural refinance. Which is correct?",
      correct: "I only",
      options: ["I only", "II only", "Both I and II", "Neither I nor II"],
      explanation: "Statement I is correct because NaBFID specialises in infrastructure finance. Statement II is false because EXIM Bank focuses on international trade, not agricultural refinance.",
      factIds: ["nabfid-role", "exim-role", "nabard-refinance"],
    },
  ],
  12: [
    {
      stem: "A small manufacturer needs MSME development finance, while a highway project needs long-term infrastructure finance. Which pairing fits best?",
      correct: "Manufacturer — SIDBI; highway — NaBFID",
      options: ["Manufacturer — SIDBI; highway — NaBFID", "Manufacturer — NHB; highway — NABARD", "Manufacturer — EXIM Bank; highway — SIDBI", "Manufacturer — NABARD; highway — NHB"],
      explanation: "SIDBI's mandate centres on MSMEs, while NaBFID specialises in infrastructure finance. The question tests sectoral fit rather than institution names alone.",
      factIds: ["sidbi-role", "nabfid-role"],
    },
    {
      stem: "A housing-finance institution seeks sector-development support, while an exporter seeks overseas trade finance. Which pairing fits best?",
      correct: "Housing finance — NHB; exporter — EXIM Bank",
      options: ["Housing finance — NHB; exporter — EXIM Bank", "Housing finance — NABARD; exporter — SIDBI", "Housing finance — NaBFID; exporter — NHB", "Housing finance — EXIM Bank; exporter — NABARD"],
      explanation: "NHB supports the housing-finance system, while EXIM Bank supports international trade. Their mandates are specialised and distinct.",
      factIds: ["nhb-role", "exim-role"],
    },
    {
      stem: "Which sequence is chronologically correct?",
      correct: "IFCI 1948 → NABARD/EXIM 1982 → NHB 1988 → SIDBI 1990 → NaBFID 2021",
      options: ["IFCI 1948 → NABARD/EXIM 1982 → NHB 1988 → SIDBI 1990 → NaBFID 2021", "NABARD 1948 → IFCI 1982 → SIDBI 1988 → NHB 1990 → NaBFID 2021", "IFCI 1948 → NHB 1982 → EXIM 1988 → NABARD 1990 → SIDBI 2021", "NaBFID 1948 → IFCI 1982 → NABARD 1988 → NHB 1990 → SIDBI 2021"],
      explanation: "IFCI came first in 1948; NABARD and EXIM Bank began in 1982; NHB followed in 1988, SIDBI in 1990 and NaBFID in 2021.",
      factIds: ["ifci-1948", "nabard-1982", "exim-1982", "nhb-1988", "sidbi-1990", "nabfid-2021"],
    },
    {
      stem: "Which statement best distinguishes a sector-specific DFI from an NBFC category?",
      correct: "A DFI describes a development-finance mandate, while NBFC describes a non-banking financial-company status",
      options: ["A DFI describes a development-finance mandate, while NBFC describes a non-banking financial-company status", "DFI and NBFC always mean exactly the same thing", "Every DFI must be a commercial bank", "Every NBFC is created by a special Act of Parliament"],
      explanation: "DFI refers to a development-oriented financing role, whereas NBFC is a legal/regulatory category for non-banking financial companies. The concepts can overlap in some cases but are not identical.",
      factIds: ["dfi", "nbfc-basic", "nbfc-bank-distinction"],
    },
  ],
};

export function generateEcoCp011ReviewV1(): EcoCp011ReviewQuestion[] {
  const questions: EcoCp011ReviewQuestion[] = [];
  for (const [qlKey, cases] of Object.entries(qlCases)) {
    const ql = Number(qlKey);
    cases.forEach((row, index) => {
      const target = (ql + index) % 4;
      const options = moveCorrect([...row.options], row.correct, target);
      const bundle = sourceBundle(row.factIds);
      questions.push({
        questionId: `ECO-CP-011-QL-${String(ql).padStart(3, "0")}-${String(index + 1).padStart(2, "0")}`,
        chapterId: "ECO-001",
        cpId: "ECO-CP-011",
        qlId: `ECO-QL-${String(ql).padStart(3, "0")}`,
        qlName: qlNames[ql],
        difficulty: difficultyForVariant(ql, index),
        stem: row.stem,
        options,
        correctIndex: options.indexOf(row.correct),
        canonicalAnswer: row.correct,
        explanation: row.explanation,
        sourceIds: bundle.sourceIds,
        sourceFactIds: bundle.sourceFactIds,
        reviewOnly: true,
        runtimeRegistered: false,
      });
    });
  }
  return questions;
}

export const ECO_CP011_REVIEW_V1 = generateEcoCp011ReviewV1();
