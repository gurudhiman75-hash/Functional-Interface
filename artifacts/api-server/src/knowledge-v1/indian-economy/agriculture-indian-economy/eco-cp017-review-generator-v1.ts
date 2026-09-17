import type { KnowledgeV1Difficulty } from "../../types";
import { ecoCp017Fact } from "./eco-cp017-facts";
import type { EcoCp017ReviewQuestion } from "./eco-cp017-review-types";

const qlNames: Record<number, string> = {
  1: "Agriculture in the Indian economy",
  2: "Land reforms",
  3: "Green Revolution",
  4: "Crop seasons",
  5: "MSP and CACP",
  6: "Procurement, FCI and PDS",
  7: "Agricultural credit and NABARD",
  8: "Crop insurance and PMFBY",
  9: "Agricultural marketing and e-NAM",
  10: "Agricultural productivity",
  11: "Diversification and allied activities",
  12: "Mixed agricultural-economy distinctions",
};

type Case = {
  stem: string;
  correct: string;
  options: string[];
  explanation: string;
  factIds: string[];
};

function difficultyForVariant(ql: number, row: number): KnowledgeV1Difficulty {
  if ([1, 2, 3, 4].includes(ql)) return row < 2 ? "Easy" : row === 2 ? "Medium" : "Hard";
  if ([5, 6, 7, 8].includes(ql)) return row === 0 ? "Easy" : row < 3 ? "Medium" : "Hard";
  return row === 0 ? "Medium" : row === 1 ? "Medium" : "Hard";
}

function sourceBundle(ids: string[]) {
  const facts = ids.map(ecoCp017Fact);
  return {
    sourceIds: [...new Set(facts.flatMap((fact) => fact.sourceIds))],
    sourceFactIds: [...new Set(facts.flatMap((fact) => fact.sourceFactIds))],
  };
}

function rotateOptions(options: string[], correct: string, serial: number) {
  const wrong = options.filter((option) => option !== correct);
  const correctIndex = serial % 4;
  const out: string[] = [];
  let wi = 0;
  for (let i = 0; i < 4; i += 1) out.push(i === correctIndex ? correct : wrong[wi++]);
  return { options: out, correctIndex };
}

const qlCases: Record<number, Case[]> = {
  1: [
    {
      stem: "Which is an important economic role of agriculture in India?",
      correct: "Providing food, raw materials and rural livelihoods",
      options: ["Providing food, raw materials and rural livelihoods", "Issuing currency notes", "Regulating stock exchanges", "Managing customs duties"],
      explanation: "Agriculture supplies food and raw materials and supports a large rural economy. It also creates demand for many non-farm activities.",
      factIds: ["agri-role"],
    },
    {
      stem: "How does agriculture support the industrial sector?",
      correct: "By supplying raw materials and creating rural demand",
      options: ["By supplying raw materials and creating rural demand", "By fixing interest rates", "By issuing government securities", "By regulating imports"],
      explanation: "Many industries use agricultural raw materials. Rural incomes also create demand for manufactured goods.",
      factIds: ["agri-role"],
    },
    {
      stem: "Which link between agriculture and the wider economy is correct?",
      correct: "Higher farm income can increase demand for non-farm goods and services",
      options: ["Higher farm income can increase demand for non-farm goods and services", "Agriculture affects only food supply", "Farm output has no link with industry", "Agriculture cannot influence rural employment"],
      explanation: "Farm income affects purchasing power in rural areas. This can raise demand for non-farm goods and services.",
      factIds: ["agri-role"],
    },
    {
      stem: "Which change would most directly strengthen agriculture's link with the rest of the economy?",
      correct: "Higher productivity with stronger processing and market linkages",
      options: ["Higher productivity with stronger processing and market linkages", "Lower access to markets", "Less rural credit", "Weaker storage facilities"],
      explanation: "Productivity and market linkages connect farms with processing, trade and rural demand. Weak markets reduce these gains.",
      factIds: ["agri-role", "productivity"],
    },
  ],
  2: [
    {
      stem: "Which measure was part of land reforms in India?",
      correct: "Abolition of intermediaries",
      options: ["Abolition of intermediaries", "Creation of import quotas", "Bank nationalisation", "Currency devaluation"],
      explanation: "Abolition of intermediaries was a major land-reform measure. It aimed to bring cultivators closer to the State in the land system.",
      factIds: ["land-reforms"],
    },
    {
      stem: "What was the main purpose of land-ceiling laws?",
      correct: "To limit very large landholdings",
      options: ["To limit very large landholdings", "To fix crop prices", "To regulate bank lending", "To control imports"],
      explanation: "Land ceilings placed limits on the size of landholdings. Surplus land could then be identified for redistribution under reform laws.",
      factIds: ["land-reforms"],
    },
    {
      stem: "What is meant by consolidation of landholdings?",
      correct: "Combining fragmented plots into more workable holdings",
      options: ["Combining fragmented plots into more workable holdings", "Dividing every farm into smaller plots", "Fixing MSP for land", "Transferring farms to FCI"],
      explanation: "Consolidation reduces fragmentation by grouping scattered plots. This can make cultivation and investment easier.",
      factIds: ["land-reforms"],
    },
    {
      stem: "Which pair correctly matches a land reform with its purpose?",
      correct: "Tenancy reform—improving tenants' rights; consolidation—reducing fragmentation",
      options: ["Tenancy reform—improving tenants' rights; consolidation—reducing fragmentation", "Land ceiling—raising import duties; consolidation—fixing MSP", "Abolition of intermediaries—creating APMC mandis; tenancy reform—crop insurance", "Consolidation—bank nationalisation; land ceiling—currency reform"],
      explanation: "Tenancy reform deals with cultivators' tenancy rights. Consolidation deals with fragmented holdings.",
      factIds: ["land-reforms"],
    },
  ],
  3: [
    {
      stem: "Which input was central to the Green Revolution package?",
      correct: "High-yielding variety seeds",
      options: ["High-yielding variety seeds", "Only traditional seeds", "Gold-backed currency", "Import licensing"],
      explanation: "HYV seeds were a key part of the Green Revolution. Their gains depended on supporting inputs such as irrigation and fertilisers.",
      factIds: ["green-revolution"],
    },
    {
      stem: "Which crops benefited most in the early Green Revolution?",
      correct: "Wheat and rice",
      options: ["Wheat and rice", "Tea and coffee", "Rubber and jute", "Cotton and tobacco only"],
      explanation: "The early Green Revolution was strongest in wheat and rice. HYV technology spread first where irrigation and other inputs were available.",
      factIds: ["green-revolution"],
    },
    {
      stem: "Why was irrigation important to the Green Revolution?",
      correct: "HYV crops needed reliable water along with other inputs",
      options: ["HYV crops needed reliable water along with other inputs", "It replaced seeds completely", "It removed the need for fertilisers", "It made markets unnecessary"],
      explanation: "HYV technology performed best with reliable water and complementary inputs. Irrigation therefore supported higher and more stable yields.",
      factIds: ["green-revolution"],
    },
    {
      stem: "Which statement best describes an early limitation of the Green Revolution?",
      correct: "Benefits were stronger in well-irrigated regions and selected crops",
      options: ["Benefits were stronger in well-irrigated regions and selected crops", "It reduced foodgrain output everywhere", "It ended the use of modern inputs", "It affected only plantation crops"],
      explanation: "Early gains were concentrated where irrigation and modern inputs were easier to use. This created uneven regional and crop-wise benefits.",
      factIds: ["green-revolution", "green-revolution-effect"],
    },
  ],
  4: [
    {
      stem: "Which crop season is mainly linked with the monsoon?",
      correct: "Kharif",
      options: ["Kharif", "Rabi", "Zaid", "Perennial only"],
      explanation: "Kharif crops are mainly sown with the monsoon season. Paddy is a common example.",
      factIds: ["crop-seasons"],
    },
    {
      stem: "Which crop season is mainly associated with winter cultivation?",
      correct: "Rabi",
      options: ["Rabi", "Kharif", "Zaid", "Monsoon fallow"],
      explanation: "Rabi crops are mainly grown during the winter season. Wheat is a common example.",
      factIds: ["crop-seasons"],
    },
    {
      stem: "When is the Zaid season generally placed?",
      correct: "Between the Rabi and Kharif seasons",
      options: ["Between the Rabi and Kharif seasons", "Only during peak monsoon", "Only during winter", "After every five-year plan"],
      explanation: "Zaid is the short summer season between Rabi and Kharif. It is distinct from the main monsoon and winter crop seasons.",
      factIds: ["crop-seasons"],
    },
    {
      stem: "Which sequence of crop seasons is correct for a typical agricultural year?",
      correct: "Kharif → Rabi → Zaid",
      options: ["Kharif → Rabi → Zaid", "Rabi → Kharif → Rabi", "Zaid → Zaid → Kharif", "Kharif → Kharif → Rabi"],
      explanation: "Kharif is linked with the monsoon, Rabi with winter and Zaid with the short summer interval. This gives the usual seasonal order.",
      factIds: ["crop-seasons"],
    },
  ],
  5: [
    {
      stem: "Which body recommends Minimum Support Prices to the Government?",
      correct: "Commission for Agricultural Costs and Prices",
      options: ["Commission for Agricultural Costs and Prices", "Food Corporation of India", "NABARD", "NITI Aayog"],
      explanation: "CACP recommends MSPs after considering costs, demand-supply conditions and other factors. The Government fixes the MSPs.",
      factIds: ["cacp", "msp"],
    },
    {
      stem: "What is the main purpose of Minimum Support Price?",
      correct: "To provide price support against sharp market-price falls",
      options: ["To provide price support against sharp market-price falls", "To insure crops against weather loss", "To provide farm loans", "To regulate mandi licences"],
      explanation: "MSP is a price-support mechanism for covered crops. It is different from crop insurance and farm credit.",
      factIds: ["msp"],
    },
    {
      stem: "Who fixes MSP after considering CACP recommendations?",
      correct: "Government of India",
      options: ["Government of India", "FCI alone", "NABARD alone", "APMC committees"],
      explanation: "CACP makes recommendations, while the Government fixes MSP. The two roles should not be confused.",
      factIds: ["cacp", "msp"],
    },
    {
      stem: "Which statement correctly distinguishes MSP from procurement?",
      correct: "MSP is an announced support price, while procurement is actual purchase by designated agencies",
      options: ["MSP is an announced support price, while procurement is actual purchase by designated agencies", "MSP and procurement mean exactly the same thing", "Procurement is only a crop-insurance payment", "MSP is fixed by FCI after procurement"],
      explanation: "MSP is the announced support price. Procurement is the actual purchase of eligible produce by designated agencies under the procurement system.",
      factIds: ["msp", "procurement"],
    },
  ],
  6: [
    {
      stem: "Which institution is most closely linked with Central Pool foodgrain operations?",
      correct: "Food Corporation of India",
      options: ["Food Corporation of India", "SEBI", "SIDBI", "EXIM Bank"],
      explanation: "FCI is a key agency for procurement, storage, movement and distribution of foodgrains for the Central Pool.",
      factIds: ["fci", "procurement"],
    },
    {
      stem: "What is a major function of FCI?",
      correct: "Procurement and storage of foodgrains",
      options: ["Procurement and storage of foodgrains", "Setting the repo rate", "Regulating stock exchanges", "Issuing crop insurance policies"],
      explanation: "FCI procures, stores, moves and distributes foodgrains. These functions support food security and buffer-stock operations.",
      factIds: ["fci"],
    },
    {
      stem: "What is the main purpose of the Public Distribution System?",
      correct: "Distribution of foodgrains to eligible households",
      options: ["Distribution of foodgrains to eligible households", "Recommendation of MSP", "Agricultural refinance", "Registration of APMC traders"],
      explanation: "PDS is the distribution side of the public food system. It should not be confused with procurement from farmers.",
      factIds: ["pds"],
    },
    {
      stem: "Which sequence best represents the public food-management chain?",
      correct: "Procurement → storage/movement → public distribution",
      options: ["Procurement → storage/movement → public distribution", "Public distribution → MSP recommendation → monetary policy", "Crop insurance → procurement → repo rate", "NABARD refinance → customs duty → PDS"],
      explanation: "Foodgrains are procured, stored or moved, and then supplied through public distribution channels. These are linked but separate stages.",
      factIds: ["procurement", "fci", "pds"],
    },
  ],
  7: [
    {
      stem: "Which institution is the apex development bank for agriculture and rural development?",
      correct: "NABARD",
      options: ["NABARD", "SEBI", "EXIM Bank", "DICGC"],
      explanation: "NABARD is the apex development bank for agriculture and rural development. It supports credit and rural institutions.",
      factIds: ["nabard-credit"],
    },
    {
      stem: "What is an important credit function of NABARD?",
      correct: "Providing refinance to eligible rural financial institutions",
      options: ["Providing refinance to eligible rural financial institutions", "Issuing currency to farmers", "Fixing MSP", "Running APMC mandis"],
      explanation: "NABARD provides refinance support to eligible rural financial institutions. This helps strengthen the flow of agricultural and rural credit.",
      factIds: ["nabard-credit"],
    },
    {
      stem: "Which is a formal source of agricultural credit?",
      correct: "Regional Rural Bank",
      options: ["Regional Rural Bank", "Unregistered moneylender only", "Commodity speculator", "Retail wholesaler only"],
      explanation: "RRBs are part of the formal rural credit system. Commercial banks and cooperative credit institutions are other formal channels.",
      factIds: ["institutional-credit"],
    },
    {
      stem: "Which statement correctly distinguishes NABARD from a retail farm lender?",
      correct: "NABARD mainly supports the credit system through refinance and development, while banks usually make retail farm loans",
      options: ["NABARD mainly supports the credit system through refinance and development, while banks usually make retail farm loans", "NABARD alone gives every crop loan directly", "Commercial banks only refinance NABARD", "RRBs do not provide agricultural credit"],
      explanation: "NABARD's major role is refinance and institutional support. Retail farm credit is generally delivered through banks and other eligible lending institutions.",
      factIds: ["nabard-credit", "institutional-credit"],
    },
  ],
  8: [
    {
      stem: "What is the basic purpose of crop insurance?",
      correct: "To protect farmers against financial loss from covered crop damage",
      options: ["To protect farmers against financial loss from covered crop damage", "To fix MSP", "To provide fertiliser subsidies only", "To regulate APMC markets"],
      explanation: "Crop insurance transfers part of the financial risk from covered crop losses. It is a risk-protection tool, not a price-support system.",
      factIds: ["crop-insurance"],
    },
    {
      stem: "What is a major objective of PMFBY?",
      correct: "Providing financial support after covered crop losses",
      options: ["Providing financial support after covered crop losses", "Fixing all crop prices", "Replacing agricultural credit", "Running foodgrain procurement"],
      explanation: "PMFBY aims to support farmers after covered crop losses and help stabilise farm income.",
      factIds: ["pmfby"],
    },
    {
      stem: "Which risk-management tool is most directly used for crop-loss protection?",
      correct: "Crop insurance",
      options: ["Crop insurance", "MSP alone", "e-NAM trading", "Land consolidation"],
      explanation: "Crop insurance addresses production-loss risk. MSP mainly addresses price support, while e-NAM concerns marketing.",
      factIds: ["crop-insurance", "msp", "enam"],
    },
    {
      stem: "Which statement correctly distinguishes crop insurance from MSP?",
      correct: "Crop insurance covers specified production losses, while MSP provides price support for covered crops",
      options: ["Crop insurance covers specified production losses, while MSP provides price support for covered crops", "Both are only credit schemes", "MSP compensates every weather loss", "Crop insurance fixes mandi prices"],
      explanation: "Crop insurance addresses covered production losses. MSP is a price-support mechanism and does not insure the crop itself.",
      factIds: ["crop-insurance", "msp"],
    },
  ],
  9: [
    {
      stem: "What is e-NAM?",
      correct: "An electronic platform linking existing agricultural markets",
      options: ["An electronic platform linking existing agricultural markets", "A crop-insurance company", "A rural bank", "A foodgrain storage agency"],
      explanation: "e-NAM is a pan-India electronic trading platform. It networks existing APMC mandis through a common market system.",
      factIds: ["enam"],
    },
    {
      stem: "What is a major aim of e-NAM?",
      correct: "Improving transparent price discovery and market access",
      options: ["Improving transparent price discovery and market access", "Fixing the repo rate", "Issuing crop loans", "Replacing foodgrain storage"],
      explanation: "e-NAM aims to improve transparent trading and price discovery. It also widens market access through electronic integration.",
      factIds: ["enam"],
    },
    {
      stem: "Which statement correctly describes the relation between e-NAM and APMC mandis?",
      correct: "e-NAM networks participating APMC mandis rather than simply replacing all physical markets",
      options: ["e-NAM networks participating APMC mandis rather than simply replacing all physical markets", "e-NAM is a crop-insurance scheme", "APMC mandis are banks under NABARD", "e-NAM is the agency that fixes MSP"],
      explanation: "e-NAM is an electronic trading network built around participating agricultural markets. It is not the same as abolishing every physical mandi.",
      factIds: ["enam"],
    },
  ],
  10: [
    {
      stem: "Which measure can directly raise agricultural productivity?",
      correct: "Better seeds with reliable irrigation",
      options: ["Better seeds with reliable irrigation", "Less access to farm credit", "More fragmented holdings", "Weaker research support"],
      explanation: "Quality seeds and reliable irrigation can raise output per unit of land. Research, credit and suitable inputs also support productivity.",
      factIds: ["productivity"],
    },
    {
      stem: "Why can institutional credit improve farm productivity?",
      correct: "It can finance timely purchase of productive inputs and assets",
      options: ["It can finance timely purchase of productive inputs and assets", "It replaces rainfall", "It fixes market prices", "It eliminates all production risk"],
      explanation: "Timely formal credit can help farmers buy inputs and invest in productive assets. Credit alone cannot remove weather or market risk.",
      factIds: ["productivity", "institutional-credit"],
    },
    {
      stem: "Which combination is most likely to improve agricultural productivity?",
      correct: "Research, irrigation, quality seed and timely credit",
      options: ["Research, irrigation, quality seed and timely credit", "Fragmentation, weak storage and delayed credit", "Lower market access and poorer extension", "Less irrigation and fewer inputs"],
      explanation: "Productivity rises when technology, water, inputs and finance work together. Weak infrastructure limits the gains from any single input.",
      factIds: ["productivity"],
    },
  ],
  11: [
    {
      stem: "What is meant by agricultural diversification?",
      correct: "Expanding into additional crops and allied activities",
      options: ["Expanding into additional crops and allied activities", "Growing only one crop permanently", "Replacing agriculture with banking", "Ending all livestock activity"],
      explanation: "Diversification broadens farm and rural income sources. It can include horticulture, dairy, fisheries and other allied activities.",
      factIds: ["diversification"],
    },
    {
      stem: "How can dairy or fisheries help a farm household?",
      correct: "By adding income sources and spreading risk",
      options: ["By adding income sources and spreading risk", "By fixing MSP for all crops", "By replacing land reform", "By setting interest rates"],
      explanation: "Allied activities can provide income beyond field crops. This helps reduce dependence on a single source of farm income.",
      factIds: ["diversification"],
    },
    {
      stem: "Which strategy best reduces dependence on a single crop income?",
      correct: "Combining crops with suitable allied activities",
      options: ["Combining crops with suitable allied activities", "Relying on one crop only", "Avoiding all market links", "Reducing access to rural credit"],
      explanation: "Diversification spreads income across crops and allied activities. This can improve resilience when one activity performs poorly.",
      factIds: ["diversification"],
    },
  ],
  12: [
    {
      stem: "Which pair is correctly matched?",
      correct: "CACP—MSP recommendation; NABARD—rural credit support",
      options: ["CACP—MSP recommendation; NABARD—rural credit support", "FCI—crop insurance; e-NAM—currency issue", "NABARD—MSP fixation; CACP—foodgrain storage", "PDS—bank refinance; FCI—stock-market regulation"],
      explanation: "CACP recommends MSPs, while NABARD supports agricultural and rural credit institutions. Their functions are different.",
      factIds: ["cacp", "nabard-credit"],
    },
    {
      stem: "Consider the statements. I. FCI is linked with foodgrain procurement and storage. II. e-NAM is mainly a crop-insurance scheme. Which option is correct?",
      correct: "I only",
      options: ["I only", "II only", "Both I and II", "Neither I nor II"],
      explanation: "Statement I is correct. Statement II is false because e-NAM is an electronic agricultural marketing platform.",
      factIds: ["fci", "enam"],
    },
    {
      stem: "Which combination correctly matches the policy tool with the risk it mainly addresses?",
      correct: "MSP—price risk; crop insurance—production-loss risk; diversification—income concentration risk",
      options: ["MSP—price risk; crop insurance—production-loss risk; diversification—income concentration risk", "MSP—weather loss; crop insurance—market integration; diversification—currency risk", "e-NAM—crop failure; PDS—farm credit; NABARD—price fixing", "Land ceiling—market price risk; FCI—weather insurance; CACP—loan default"],
      explanation: "These tools address different problems. MSP supports prices, crop insurance covers specified production losses and diversification spreads income risk.",
      factIds: ["msp", "crop-insurance", "diversification"],
    },
  ],
};

export const ECO_CP017_REVIEW_V1: EcoCp017ReviewQuestion[] = [];
let serial = 0;
for (let ql = 1; ql <= 12; ql += 1) {
  qlCases[ql].forEach((row, rowIndex) => {
    serial += 1;
    const rotated = rotateOptions(row.options, row.correct, serial);
    const sources = sourceBundle(row.factIds);
    ECO_CP017_REVIEW_V1.push({
      questionId: `ECO-CP-017-Q${String(serial).padStart(3, "0")}`,
      chapterId: "ECO-001",
      cpId: "ECO-CP-017",
      qlId: `ECO-CP-017-QL-${String(ql).padStart(2, "0")}`,
      qlName: qlNames[ql],
      difficulty: difficultyForVariant(ql, rowIndex),
      stem: row.stem,
      options: rotated.options,
      correctIndex: rotated.correctIndex,
      canonicalAnswer: row.correct,
      explanation: row.explanation,
      sourceIds: sources.sourceIds,
      sourceFactIds: sources.sourceFactIds,
      reviewOnly: true,
      runtimeRegistered: false,
    });
  });
}
