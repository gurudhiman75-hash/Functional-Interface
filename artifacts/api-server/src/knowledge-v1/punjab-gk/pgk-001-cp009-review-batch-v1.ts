import type { KnowledgeV1Difficulty } from "../types";
import { PGK_001_CP009_FACT_IDS, PGK_001_CP009_SOURCE_IDS } from "./pgk-001-cp009-facts";

export type Pgk001Cp009ReviewQuestion = Readonly<{
  questionId: string;
  qlId: string;
  qlName: string;
  difficulty: KnowledgeV1Difficulty;
  stem: string;
  options: readonly string[];
  correctIndex: number;
  canonicalAnswer: string;
  explanation: string;
  factIds: readonly string[];
  sourceIds: readonly string[];
  reviewOnly: true;
  runtimeRegistered: false;
}>;

export const PGK_001_CP009_QL_NAMES = Object.freeze({
  "PGK-001-QL-056": "Major industrial centres and products",
  "PGK-001-QL-057": "Ludhiana manufacturing profile",
  "PGK-001-QL-058": "Jalandhar manufacturing profile",
  "PGK-001-QL-059": "Mandi Gobindgarh and Batala metal industries",
  "PGK-001-QL-060": "Bathinda refinery and energy industry",
  "PGK-001-QL-061": "Cooperative economy: MARKFED and MILKFED",
  "PGK-001-QL-062": "PSIEC and economy-industry synthesis",
} as const);

type Row = readonly [KnowledgeV1Difficulty, string, readonly string[], string, string, readonly string[], readonly string[]];
const S = PGK_001_CP009_SOURCE_IDS;
const rows: readonly Row[] = [
  ["Easy", "Which Punjab city is a major centre for hosiery and bicycle manufacturing?", ["Ludhiana", "Jalandhar", "Bathinda", "Batala"], "Ludhiana", "Ludhiana is a major manufacturing centre for hosiery, knitwear and bicycles.", ["centre-ludhiana-hosiery-bicycles"], [S.ludhianaPlan]],
  ["Easy", "Which Punjab city is a major centre for sports-goods manufacturing?", ["Jalandhar", "Bathinda", "Mandi Gobindgarh", "Patiala"], "Jalandhar", "Jalandhar is one of Punjab's principal sports-goods manufacturing centres.", ["centre-jalandhar-sports-handtools"], [S.punjabIndustryPolicy, S.jalandharPlan]],
  ["Easy", "Which Punjab town is a major secondary-steel cluster?", ["Mandi Gobindgarh", "Abohar", "Pathankot", "Kapurthala"], "Mandi Gobindgarh", "Mandi Gobindgarh is a major secondary-steel cluster in Punjab, especially known for steel re-rolling.", ["centre-mandi-gobindgarh-secondary-steel"], [S.punjabIndustryPolicy, S.mandiGobindgarhPlan]],
  ["Easy", "Which Punjab city has a long-established casting-iron and machine-tools industry?", ["Batala", "Fazilka", "Barnala", "Rupnagar"], "Batala", "Batala has long been an important centre for casting iron and machine tools.", ["centre-batala-casting-machine-tools"], [S.batalaMunicipal]],
  ["Easy", "Guru Gobind Singh Refinery is located in which Punjab city?", ["Bathinda", "Ludhiana", "Amritsar", "Jalandhar"], "Bathinda", "Guru Gobind Singh Refinery is located at Bathinda.", ["centre-bathinda-refinery", "refinery-guru-gobind-singh-bathinda"], [S.hmel]],
  ["Medium", "Which city-industry pair is correctly matched?", ["Jalandhar — Sports goods", "Batala — Petroleum refining", "Bathinda — Hosiery", "Mandi Gobindgarh — Dairy processing"], "Jalandhar — Sports goods", "Jalandhar is a major sports-goods centre. Batala is noted for casting and machine tools, Bathinda has the refinery complex and Mandi Gobindgarh is a steel cluster.", ["centre-jalandhar-sports-handtools", "centre-batala-casting-machine-tools", "centre-bathinda-refinery", "centre-mandi-gobindgarh-secondary-steel"], [S.punjabIndustryPolicy, S.batalaMunicipal, S.hmel]],

  ["Easy", "Ludhiana is a major Punjab centre for which textile industry?", ["Hosiery and knitwear", "Silk reeling", "Jute milling", "Carpet weaving only"], "Hosiery and knitwear", "Hosiery and knitwear are among Ludhiana's best-established manufacturing industries.", ["centre-ludhiana-hosiery-bicycles"], [S.ludhianaPlan]],
  ["Easy", "Which industry is a major part of Ludhiana's manufacturing base?", ["Bicycles", "Petroleum refining", "Shipbuilding", "Tea processing"], "Bicycles", "Bicycle manufacturing is one of Ludhiana's major industrial activities.", ["centre-ludhiana-hosiery-bicycles"], [S.ludhianaPlan]],
  ["Easy", "Ludhiana manufactures which of the following engineering products on a large scale?", ["Sewing machines", "Marine engines", "Aircraft turbines", "Locomotives only"], "Sewing machines", "Sewing machines form part of Ludhiana's diversified engineering-manufacturing base.", ["centre-ludhiana-hosiery-bicycles"], [S.ludhianaPlan]],
  ["Medium", "Which sector forms part of Ludhiana's engineering industry?", ["Auto components", "Crude-oil refining", "Ship breaking", "Tea machinery only"], "Auto components", "Auto components are an important part of Ludhiana's engineering industry.", ["centre-ludhiana-hosiery-bicycles"], [S.ludhianaPlan]],
  ["Medium", "Which industry is NOT a core feature of Ludhiana's traditional manufacturing profile?", ["Secondary-steel re-rolling", "Hosiery", "Bicycles", "Sewing machines"], "Secondary-steel re-rolling", "Ludhiana is strong in hosiery, bicycles, sewing machines and engineering goods; secondary-steel re-rolling is centred much more strongly at Mandi Gobindgarh.", ["centre-ludhiana-hosiery-bicycles", "centre-mandi-gobindgarh-secondary-steel"], [S.ludhianaPlan, S.mandiGobindgarhPlan]],
  ["Hard", "Which set contains only major Ludhiana industries?", ["Hosiery, bicycles, sewing machines and auto components", "Sports goods, refinery, steel re-rolling and tanning", "Petrochemicals, shipbuilding, tea and jute", "Secondary steel, refinery, leather and sugar only"], "Hosiery, bicycles, sewing machines and auto components", "Ludhiana has a diversified manufacturing base that includes hosiery, bicycles, sewing machines and auto components.", ["centre-ludhiana-hosiery-bicycles"], [S.ludhianaPlan]],

  ["Easy", "Jalandhar is a major manufacturing centre for which goods?", ["Sports goods", "Petroleum products", "Railway locomotives", "Tea"], "Sports goods", "Sports-goods manufacturing is one of Jalandhar's best-established industries.", ["centre-jalandhar-sports-handtools"], [S.punjabIndustryPolicy, S.jalandharPlan]],
  ["Easy", "Which engineering industry is prominent in Jalandhar?", ["Hand tools", "Shipbuilding", "Aircraft assembly", "Oil refining"], "Hand tools", "Hand-tool manufacturing forms an important part of Jalandhar's industrial base.", ["centre-jalandhar-sports-handtools"], [S.jalandharPlan]],
  ["Medium", "Which industry is part of Jalandhar's traditional manufacturing profile?", ["Leather and tanning", "Crude-oil refining", "Steel re-rolling only", "Tea processing"], "Leather and tanning", "Leather and tanning are among Jalandhar's established industrial activities.", ["centre-jalandhar-sports-handtools"], [S.jalandharPlan]],
  ["Medium", "Jalandhar's industrial profile includes manufacturing of:", ["Surgical goods", "Petroleum coke only", "Railway coaches", "Paper pulp only"], "Surgical goods", "Surgical-goods manufacturing is part of Jalandhar's diversified industrial base.", ["centre-jalandhar-sports-handtools"], [S.jalandharPlan]],
  ["Medium", "Which industry is NOT a core feature of Jalandhar's traditional industrial profile?", ["Petroleum refining", "Sports goods", "Hand tools", "Leather goods"], "Petroleum refining", "Jalandhar is strong in sports goods, hand tools and leather-related industries; Punjab's major refinery complex is at Bathinda.", ["centre-jalandhar-sports-handtools", "centre-bathinda-refinery"], [S.jalandharPlan, S.hmel]],
  ["Hard", "Consider the following industries of Jalandhar:\nI. Sports goods\nII. Hand tools\nIII. Leather and tanning\nIV. Surgical goods\nWhich of the above are part of Jalandhar's manufacturing profile?", ["I and II only", "I, II and III only", "II, III and IV only", "I, II, III and IV"], "I, II, III and IV", "All four form part of Jalandhar's established manufacturing profile.", ["centre-jalandhar-sports-handtools"], [S.jalandharPlan]],

  ["Easy", "Mandi Gobindgarh is a major centre for which industry?", ["Secondary steel", "Sports goods", "Dairy processing", "Petroleum refining"], "Secondary steel", "Mandi Gobindgarh is a major secondary-steel cluster in Punjab, especially known for steel re-rolling.", ["centre-mandi-gobindgarh-secondary-steel"], [S.punjabIndustryPolicy]],
  ["Medium", "Which activity is central to Mandi Gobindgarh's steel industry?", ["Steel re-rolling", "Ship breaking", "Aluminium smelting only", "Copper mining"], "Steel re-rolling", "Steel re-rolling is a defining activity of the Mandi Gobindgarh industrial cluster.", ["centre-mandi-gobindgarh-secondary-steel"], [S.mandiGobindgarhPlan]],
  ["Easy", "Batala is a major Punjab centre for manufacturing:", ["Machine tools", "Petroleum products", "Sports shoes only", "Fertilizer only"], "Machine tools", "Machine-tools manufacturing has long been an important Batala industry.", ["centre-batala-casting-machine-tools"], [S.batalaMunicipal]],
  ["Easy", "Which metal-based industry is prominent in Batala?", ["Casting iron", "Gold mining", "Aluminium ore extraction", "Copper mining"], "Casting iron", "Casting iron is one of Batala's traditional industries.", ["centre-batala-casting-machine-tools"], [S.batalaMunicipal]],
  ["Medium", "Which town-industry pair is correctly matched?", ["Mandi Gobindgarh — Steel re-rolling", "Batala — Oil refining", "Mandi Gobindgarh — Sports goods", "Batala — Kinnow processing only"], "Mandi Gobindgarh — Steel re-rolling", "Mandi Gobindgarh is a major steel re-rolling centre, while Batala is noted for casting and machine tools.", ["centre-mandi-gobindgarh-secondary-steel", "centre-batala-casting-machine-tools"], [S.mandiGobindgarhPlan, S.batalaMunicipal]],
  ["Hard", "Which statement correctly distinguishes Mandi Gobindgarh from Batala?", ["Mandi Gobindgarh is a secondary-steel centre; Batala is a casting and machine-tools centre", "Mandi Gobindgarh is a sports-goods centre; Batala is an oil-refining centre", "Both towns are primarily dairy-processing centres", "Both towns are primarily textile centres"], "Mandi Gobindgarh is a secondary-steel centre; Batala is a casting and machine-tools centre", "Mandi Gobindgarh is centred on secondary steel and re-rolling, whereas Batala has a long-established casting and machine-tools base.", ["centre-mandi-gobindgarh-secondary-steel", "centre-batala-casting-machine-tools"], [S.punjabIndustryPolicy, S.batalaMunicipal]],

  ["Easy", "Guru Gobind Singh Refinery is located at:", ["Bathinda", "Batala", "Ludhiana", "Jalandhar"], "Bathinda", "Guru Gobind Singh Refinery is located at Bathinda in Punjab.", ["refinery-guru-gobind-singh-bathinda"], [S.hmel]],
  ["Easy", "Which company operates Guru Gobind Singh Refinery at Bathinda?", ["HPCL-Mittal Energy Limited", "Punjab Markfed", "MILKFED", "PSIEC"], "HPCL-Mittal Energy Limited", "HPCL-Mittal Energy Limited operates Guru Gobind Singh Refinery at Bathinda.", ["refinery-guru-gobind-singh-bathinda", "hmel-joint-venture"], [S.hmel]],
  ["Medium", "HMEL stands for:", ["HPCL-Mittal Energy Limited", "Hindustan Minerals Export Limited", "Haryana-Malwa Energy Limited", "Hydrocarbon Marketing Enterprise Limited"], "HPCL-Mittal Energy Limited", "HMEL stands for HPCL-Mittal Energy Limited.", ["hmel-joint-venture"], [S.hmel]],
  ["Medium", "HMEL was formed as a joint venture between HPCL and:", ["Mittal Energy Investments", "Punjab Markfed", "MILKFED", "PSIEC"], "Mittal Energy Investments", "HMEL was promoted by Hindustan Petroleum Corporation Limited and Mittal Energy Investments.", ["hmel-joint-venture"], [S.hmel]],
  ["Medium", "Which Punjab industrial complex combines petroleum refining with petrochemical production?", ["Guru Gobind Singh Refinery complex, Bathinda", "Mandi Gobindgarh steel cluster", "Batala machine-tools cluster", "Jalandhar sports-goods cluster"], "Guru Gobind Singh Refinery complex, Bathinda", "The Bathinda complex combines petroleum refining with petrochemical production.", ["centre-bathinda-refinery", "refinery-guru-gobind-singh-bathinda"], [S.hmel]],
  ["Hard", "Consider the following statements:\nI. Guru Gobind Singh Refinery is at Bathinda.\nII. HMEL operates the refinery.\nIII. HMEL was promoted by HPCL and Mittal Energy Investments.\nWhich of the statements given above are correct?", ["I only", "I and II only", "II and III only", "I, II and III"], "I, II and III", "All three statements correctly describe the Bathinda refinery and its operating company.", ["refinery-guru-gobind-singh-bathinda", "hmel-joint-venture"], [S.hmel]],

  ["Easy", "MARKFED stands for:", ["Punjab State Cooperative Supply and Marketing Federation Limited", "Punjab State Cooperative Milk Producers' Federation Limited", "Punjab Small Industries & Export Corporation Limited", "Punjab Agro Export Board"], "Punjab State Cooperative Supply and Marketing Federation Limited", "MARKFED is the Punjab State Cooperative Supply and Marketing Federation Limited.", ["markfed-fullform-1954"], [S.markfed]],
  ["Medium", "Punjab MARKFED was registered in which year?", ["1954", "1962", "1973", "1985"], "1954", "Punjab MARKFED was registered in 1954 as a cooperative marketing organisation.", ["markfed-fullform-1954"], [S.markfed]],
  ["Medium", "Which function is central to Punjab MARKFED?", ["Farm-input supply and marketing of agricultural produce", "Petroleum refining", "Sports-goods manufacturing", "Steel re-rolling"], "Farm-input supply and marketing of agricultural produce", "MARKFED serves farmers through input supply, procurement, processing and marketing activities.", ["markfed-fullform-1954"], [S.markfed]],
  ["Easy", "MILKFED stands for:", ["Punjab State Cooperative Milk Producers' Federation Limited", "Punjab State Cooperative Supply and Marketing Federation Limited", "Punjab Small Industries & Export Corporation Limited", "Milk Industries Finance and Export Department"], "Punjab State Cooperative Milk Producers' Federation Limited", "MILKFED is the Punjab State Cooperative Milk Producers' Federation Limited.", ["milkfed-fullform-1973-verka"], [S.milkfed]],
  ["Easy", "Which is the flagship dairy brand of Punjab MILKFED?", ["Verka", "Sohna", "Markfed", "PSIEC"], "Verka", "Verka is the flagship dairy brand of Punjab MILKFED.", ["milkfed-fullform-1973-verka"], [S.milkfed]],
  ["Medium", "Punjab MILKFED came into existence in which year?", ["1973", "1954", "1962", "1991"], "1973", "Punjab MILKFED came into existence in 1973 to strengthen dairy farming, milk procurement, processing and marketing.", ["milkfed-fullform-1973-verka"], [S.milkfed]],

  ["Easy", "PSIEC stands for:", ["Punjab Small Industries & Export Corporation Limited", "Punjab State Industrial Energy Corporation", "Punjab Sports Industries Export Council", "Punjab Small Irrigation and Engineering Corporation"], "Punjab Small Industries & Export Corporation Limited", "PSIEC stands for Punjab Small Industries & Export Corporation Limited.", ["psiec-fullform-1962-role"], [S.psiec]],
  ["Medium", "PSIEC was set up in which year?", ["1962", "1954", "1973", "1988"], "1962", "Punjab Small Industries & Export Corporation Limited was set up in 1962.", ["psiec-fullform-1962-role"], [S.psiec]],
  ["Medium", "What is a major role of PSIEC in Punjab?", ["Developing industrial focal points and infrastructure", "Operating the Bathinda refinery", "Managing milk cooperatives", "Running steel re-rolling mills"], "Developing industrial focal points and infrastructure", "PSIEC develops industrial infrastructure and focal points to support industrial growth in Punjab.", ["psiec-fullform-1962-role"], [S.psiec]],
  ["Hard", "Which institution-function pair is correctly matched?", ["MILKFED — Milk procurement and dairy marketing", "MARKFED — Petroleum refining", "PSIEC — Sports-goods manufacturing", "HMEL — Cooperative milk procurement"], "MILKFED — Milk procurement and dairy marketing", "MILKFED works in the cooperative dairy sector. MARKFED serves agricultural marketing, PSIEC develops industrial infrastructure and HMEL operates the Bathinda refinery.", ["markfed-fullform-1954", "milkfed-fullform-1973-verka", "psiec-fullform-1962-role", "hmel-joint-venture"], [S.markfed, S.milkfed, S.psiec, S.hmel]],
  ["Hard", "Which set is correctly matched?", ["Ludhiana — Hosiery; Jalandhar — Sports goods; Mandi Gobindgarh — Secondary steel; Batala — Machine tools", "Ludhiana — Refinery; Jalandhar — Secondary steel; Mandi Gobindgarh — Dairy; Batala — Sports goods", "Ludhiana — Tea; Jalandhar — Petroleum; Mandi Gobindgarh — Hosiery; Batala — Dairy", "Ludhiana — Jute; Jalandhar — Shipbuilding; Mandi Gobindgarh — Tea; Batala — Refinery"], "Ludhiana — Hosiery; Jalandhar — Sports goods; Mandi Gobindgarh — Secondary steel; Batala — Machine tools", "The first set correctly matches four major Punjab industrial centres with their characteristic industries.", ["centre-ludhiana-hosiery-bicycles", "centre-jalandhar-sports-handtools", "centre-mandi-gobindgarh-secondary-steel", "centre-batala-casting-machine-tools"], [S.ludhianaPlan, S.jalandharPlan, S.punjabIndustryPolicy, S.batalaMunicipal]],
  ["Hard", "Consider the following statements:\nI. Verka is the flagship brand of MILKFED.\nII. MARKFED was registered in 1954.\nIII. PSIEC develops industrial focal points.\nIV. Guru Gobind Singh Refinery is at Bathinda.\nWhich of the statements given above are correct?", ["I and II only", "I, II and III only", "II, III and IV only", "I, II, III and IV"], "I, II, III and IV", "All four statements correctly connect Punjab's cooperative and industrial institutions with their main roles or locations.", ["milkfed-fullform-1973-verka", "markfed-fullform-1954", "psiec-fullform-1962-role", "refinery-guru-gobind-singh-bathinda"], [S.milkfed, S.markfed, S.psiec, S.hmel]],
] as const;

function qlIdFor(index: number) { return `PGK-001-QL-${String(56 + Math.floor(index / 6)).padStart(3, "0")}` as keyof typeof PGK_001_CP009_QL_NAMES; }

export const PGK_001_CP009_REVIEW_BATCH_V1: readonly Pgk001Cp009ReviewQuestion[] = Object.freeze(rows.map((row, index) => {
  const [difficulty, stem, options, canonicalAnswer, explanation, factIds, sourceIds] = row;
  const correctIndex = options.indexOf(canonicalAnswer);
  if (correctIndex < 0) throw new Error(`CP009 row ${index + 1} is missing its canonical answer`);
  const qlId = qlIdFor(index);
  return Object.freeze({ questionId: `PGK-001-CP009-Q${String(index + 1).padStart(3, "0")}`, qlId, qlName: PGK_001_CP009_QL_NAMES[qlId], difficulty, stem, options: Object.freeze([...options]), correctIndex, canonicalAnswer, explanation, factIds: Object.freeze([...factIds]), sourceIds: Object.freeze([...sourceIds]), reviewOnly: true as const, runtimeRegistered: false as const });
}));

export function auditPgk001Cp009ReviewBatchV1() {
  const issues: string[] = [];
  const validFactIds = new Set(PGK_001_CP009_FACT_IDS);
  const stems = new Set<string>();
  const qlCounts = new Map<string, number>();
  const bannedLearnerTerms = ["associated with", "linked with", "known for", "closely related to", "government of punjab", "puda", "hmel website", "markfed website", "verka website", "psiec website", "official report", "the correct answer is", "the correct option", "the other options", "this question tests", "review batch", "generator", "identify it"];
  for (const question of PGK_001_CP009_REVIEW_BATCH_V1) {
    const stem = question.stem.trim().toLowerCase().replace(/\s+/g, " ");
    const learner = `${question.stem}\n${question.explanation}`.toLowerCase();
    if (stems.has(stem)) issues.push(`${question.questionId}: duplicate stem`);
    stems.add(stem);
    qlCounts.set(question.qlId, (qlCounts.get(question.qlId) ?? 0) + 1);
    if (question.options.length !== 4) issues.push(`${question.questionId}: expected four options`);
    if (new Set(question.options).size !== 4) issues.push(`${question.questionId}: options are not unique`);
    if (question.options[question.correctIndex] !== question.canonicalAnswer) issues.push(`${question.questionId}: answer/index mismatch`);
    if (!question.explanation.trim()) issues.push(`${question.questionId}: missing explanation`);
    if (!question.reviewOnly || question.runtimeRegistered) issues.push(`${question.questionId}: lifecycle guard broken`);
    for (const factId of question.factIds) if (!validFactIds.has(factId)) issues.push(`${question.questionId}: unknown fact ${factId}`);
    for (const banned of bannedLearnerTerms) if (learner.includes(banned)) issues.push(`${question.questionId}: learner leakage: ${banned}`);
    if (/\b(?:20\d{2}|19\d{2})[-–/]\d{2}\b/.test(learner)) issues.push(`${question.questionId}: year-range statistic leaked into learner text`);
  }
  for (const qlId of Object.keys(PGK_001_CP009_QL_NAMES)) if (qlCounts.get(qlId) !== 6) issues.push(`${qlId}: expected six questions`);
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues), questionCount: PGK_001_CP009_REVIEW_BATCH_V1.length });
}
