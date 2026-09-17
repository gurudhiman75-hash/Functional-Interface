import type { KnowledgeV1Difficulty } from "../../types";
import { ecoCp018Fact } from "./eco-cp018-facts";
import type { EcoCp018ReviewQuestion } from "./eco-cp018-review-types";

const qlNames: Record<number, string> = {
  1: "Industry and manufacturing in the economy",
  2: "Industrial Policy Resolution 1956",
  3: "New Industrial Policy 1991",
  4: "MSMEs and MSMED Act 2006",
  5: "Index of Industrial Production",
  6: "Eight Core Industries",
  7: "Industrial corridors",
  8: "Special Economic Zones",
  9: "Make in India",
  10: "Industrial location and infrastructure",
  11: "Capital, intermediate and consumer goods",
  12: "Mixed industry-policy distinctions",
};

type Case = {
  stem: string;
  correct: string;
  options: string[];
  explanation: string;
  factIds: string[];
  difficulty: KnowledgeV1Difficulty;
};

function sourceBundle(ids: string[]) {
  const facts = ids.map(ecoCp018Fact);
  return {
    sourceIds: [...new Set(facts.flatMap((fact) => fact.sourceIds))],
    sourceFactIds: [...new Set(facts.flatMap((fact) => fact.sourceFactIds))],
  };
}

const qlCases: Record<number, Case[]> = {
  1: [
    { stem: "Which activity is part of manufacturing?", correct: "Converting raw materials into finished or semi-finished goods", options: ["Converting raw materials into finished or semi-finished goods", "Only buying and selling shares", "Only collecting taxes", "Only providing bank deposits"], explanation: "Manufacturing changes raw materials or components into goods through production processes.", factIds: ["manufacturing"], difficulty: "Easy" },
    { stem: "How does industrial development support economic growth?", correct: "By raising value addition, employment and production capacity", options: ["By raising value addition, employment and production capacity", "By ending all services", "By replacing agriculture completely", "By fixing every market price"], explanation: "Industry adds value to inputs and creates production capacity and jobs.", factIds: ["industry-role"], difficulty: "Easy" },
    { stem: "Which link between industry and infrastructure is correct?", correct: "Industrial growth raises demand for power, transport and logistics", options: ["Industrial growth raises demand for power, transport and logistics", "Industry eliminates the need for transport", "Industrial growth reduces all power use", "Infrastructure has no role in industrial location"], explanation: "Industry depends on reliable power, transport and logistics, so industrial growth and infrastructure reinforce each other.", factIds: ["industry-role", "location-factors"], difficulty: "Medium" },
    { stem: "Which statement best distinguishes manufacturing from trade?", correct: "Manufacturing transforms inputs, while trade mainly exchanges goods", options: ["Manufacturing transforms inputs, while trade mainly exchanges goods", "Trade always creates physical goods", "Manufacturing only resells finished goods", "Both terms mean exactly the same activity"], explanation: "Manufacturing involves production or transformation. Trade mainly involves exchange or distribution of goods.", factIds: ["manufacturing"], difficulty: "Hard" },
  ],
  2: [
    { stem: "Which policy framework is closely linked with the mixed-economy industrial structure of the 1950s?", correct: "Industrial Policy Resolution, 1956", options: ["Industrial Policy Resolution, 1956", "New Industrial Policy, 1991", "SEZ Act, 2005", "MSMED Act, 2006"], explanation: "The 1956 Industrial Policy Resolution structured industries around public, mixed and private roles.", factIds: ["ipr-1956"], difficulty: "Easy" },
    { stem: "What was a major feature of the Industrial Policy Resolution, 1956?", correct: "A major role for the public sector in strategic and basic industries", options: ["A major role for the public sector in strategic and basic industries", "Abolition of industrial licensing for most industries", "Creation of Special Economic Zones", "Launch of Make in India"], explanation: "The 1956 framework gave the public sector an important role in strategic and basic industries.", factIds: ["ipr-1956", "public-sector-role"], difficulty: "Medium" },
    { stem: "Which statement best reflects India's mixed-economy industrial model?", correct: "Public and private enterprises operate together in different areas", options: ["Public and private enterprises operate together in different areas", "Only public enterprises are allowed", "Only private enterprises are allowed", "Industry is run only by foreign firms"], explanation: "A mixed economy allows both public and private enterprise, with their roles shaped by policy.", factIds: ["ipr-1956"], difficulty: "Medium" },
    { stem: "Which comparison between the 1956 and 1991 industrial policies is correct?", correct: "1956 stressed a larger public-sector role, while 1991 reduced controls and widened private participation", options: ["1956 stressed a larger public-sector role, while 1991 reduced controls and widened private participation", "1956 abolished licensing, while 1991 expanded it to all industries", "Both policies reserved every industry for the public sector", "1991 replaced private industry with central planning"], explanation: "The 1956 framework gave the State a larger industrial role. The 1991 policy reduced licensing and widened private participation.", factIds: ["ipr-1956", "nip-1991"], difficulty: "Hard" },
  ],
  3: [
    { stem: "What was a major feature of the New Industrial Policy of 1991?", correct: "Industrial licensing was abolished for most industries", options: ["Industrial licensing was abolished for most industries", "All industries were reserved for the public sector", "Private industry was prohibited", "SEZs were abolished"], explanation: "The 1991 policy removed compulsory licensing for most industries.", factIds: ["nip-1991", "delicensing"], difficulty: "Easy" },
    { stem: "What is meant by industrial delicensing?", correct: "Removing compulsory licences for most industries", options: ["Removing compulsory licences for most industries", "Closing all factories", "Selling all public enterprises", "Fixing every industrial price"], explanation: "Delicensing removes the need for prior industrial licences in most sectors.", factIds: ["delicensing"], difficulty: "Easy" },
    { stem: "Why did some industries remain under licensing after 1991?", correct: "Because of strategic, safety, social or environmental concerns", options: ["Because of strategic, safety, social or environmental concerns", "Because all private investment was banned", "Because IIP required licences", "Because MSMEs were prohibited"], explanation: "The 1991 policy retained licensing only for a limited set of sensitive industries.", factIds: ["nip-1991", "delicensing"], difficulty: "Medium" },
    { stem: "Which statement correctly distinguishes delicensing from disinvestment?", correct: "Delicensing reduces approval requirements, while disinvestment changes government ownership", options: ["Delicensing reduces approval requirements, while disinvestment changes government ownership", "Both mean closing factories", "Disinvestment means more industrial licences", "Delicensing means selling government shares"], explanation: "Delicensing changes regulation. Disinvestment changes the government's ownership stake.", factIds: ["delicensing", "nip-1991"], difficulty: "Hard" },
  ],
  4: [
    { stem: "Which law provides the main legal framework for micro, small and medium enterprises in India?", correct: "MSMED Act, 2006", options: ["MSMED Act, 2006", "SEZ Act, 2005", "RBI Act, 1934", "FRBM Act, 2003"], explanation: "The MSMED Act, 2006 provides the legal framework for micro, small and medium enterprises.", factIds: ["msmed-act"], difficulty: "Easy" },
    { stem: "Which sectors are covered by the MSMED Act framework?", correct: "Manufacturing and services", options: ["Manufacturing and services", "Agriculture only", "Mining only", "Government departments only"], explanation: "The MSMED Act recognises enterprises in both manufacturing and services.", factIds: ["msmed-act"], difficulty: "Easy" },
    { stem: "Why are MSMEs important to industrial development?", correct: "They support entrepreneurship, employment and supply chains", options: ["They support entrepreneurship, employment and supply chains", "They conduct monetary policy", "They issue currency", "They regulate stock exchanges"], explanation: "MSMEs support jobs, entrepreneurship and linkages with larger firms and markets.", factIds: ["msme-role"], difficulty: "Medium" },
    { stem: "Which statement about MSME classification is safest for Static GK?", correct: "Micro, small and medium are legal enterprise categories, while exact thresholds may change by notification", options: ["Micro, small and medium are legal enterprise categories, while exact thresholds may change by notification", "MSME thresholds can never change", "Only manufacturing firms can be MSMEs", "Every MSME is a public-sector unit"], explanation: "The three MSME categories are stable concepts, but numerical classification limits can change over time.", factIds: ["msmed-act"], difficulty: "Hard" },
  ],
  5: [
    { stem: "What does the Index of Industrial Production measure?", correct: "Short-term changes in the volume of industrial production", options: ["Short-term changes in the volume of industrial production", "Retail inflation only", "Agricultural prices only", "Foreign-exchange reserves"], explanation: "IIP tracks short-term changes in industrial production relative to a base period.", factIds: ["iip-definition"], difficulty: "Easy" },
    { stem: "Which sectors are covered by India's all-India IIP?", correct: "Mining, Manufacturing and Electricity", options: ["Mining, Manufacturing and Electricity", "Agriculture, Banking and Insurance", "Trade, Tourism and Transport only", "Education, Health and Banking"], explanation: "The all-India IIP covers Mining, Manufacturing and Electricity.", factIds: ["iip-sectors"], difficulty: "Easy" },
    { stem: "Which of the following is an IIP use-based category?", correct: "Capital goods", options: ["Capital goods", "Fiscal goods", "Monetary goods", "Tax goods"], explanation: "Capital goods are one of the official use-based categories in IIP.", factIds: ["iip-use-categories", "capital-goods"], difficulty: "Medium" },
    { stem: "Which statement correctly distinguishes IIP from GDP?", correct: "IIP tracks industrial production volume, while GDP measures value added across the economy", options: ["IIP tracks industrial production volume, while GDP measures value added across the economy", "IIP and GDP are the same index", "GDP measures only electricity output", "IIP measures only prices"], explanation: "IIP is a production-volume index for industry. GDP is a broader measure of economic value added.", factIds: ["iip-definition", "industry-role"], difficulty: "Hard" },
  ],
  6: [
    { stem: "Which of the following is one of India's Eight Core Industries?", correct: "Steel", options: ["Steel", "Textiles", "Automobiles", "Telecommunications"], explanation: "Steel is one of the Eight Core Industries.", factIds: ["core-eight"], difficulty: "Easy" },
    { stem: "Which set contains only Core Industries?", correct: "Coal, Steel, Cement and Electricity", options: ["Coal, Steel, Cement and Electricity", "Textiles, Steel, Tourism and Banking", "Automobiles, Cement, Insurance and Coal", "Software, Electricity, Retail and Steel"], explanation: "Coal, steel, cement and electricity are all part of the Eight Core Industries.", factIds: ["core-eight"], difficulty: "Medium" },
    { stem: "Which industry is NOT included among the Eight Core Industries?", correct: "Automobiles", options: ["Automobiles", "Coal", "Natural gas", "Fertilisers"], explanation: "Automobiles are not in the Eight Core Industries list.", factIds: ["core-eight"], difficulty: "Medium" },
    { stem: "How are the Eight Core Industries related to IIP?", correct: "They form an important subset of industrial production covered within IIP", options: ["They form an important subset of industrial production covered within IIP", "They replace IIP completely", "They measure only service-sector output", "They are unrelated to industrial production"], explanation: "The Core Industries are a major subset of industrial production and carry substantial weight in IIP.", factIds: ["core-eight", "core-iip-link"], difficulty: "Hard" },
  ],
  7: [
    { stem: "What is the main purpose of an industrial corridor?", correct: "To link industrial nodes with transport and logistics infrastructure", options: ["To link industrial nodes with transport and logistics infrastructure", "To regulate bank deposits", "To distribute foodgrains", "To fix tax rates"], explanation: "Industrial corridors combine production centres with transport, logistics and urban infrastructure.", factIds: ["industrial-corridor"], difficulty: "Easy" },
    { stem: "Which freight corridor forms the transport backbone of the Delhi-Mumbai Industrial Corridor?", correct: "Western Dedicated Freight Corridor", options: ["Western Dedicated Freight Corridor", "Eastern Dedicated Freight Corridor", "Konkan Railway only", "North-South Metro Corridor"], explanation: "DMIC was planned around the Western Dedicated Freight Corridor.", factIds: ["dmic"], difficulty: "Medium" },
    { stem: "Which statement best distinguishes an industrial corridor from a single industrial estate?", correct: "A corridor links multiple industrial nodes through large transport and logistics networks", options: ["A corridor links multiple industrial nodes through large transport and logistics networks", "A corridor is only one factory site", "An industrial estate always covers several States", "Both terms always mean the same physical area"], explanation: "Industrial corridors connect multiple nodes through major infrastructure, while an estate is usually a more localised industrial area.", factIds: ["industrial-corridor", "location-factors"], difficulty: "Hard" },
  ],
  8: [
    { stem: "Which law provides the statutory framework for Special Economic Zones in India?", correct: "Special Economic Zones Act, 2005", options: ["Special Economic Zones Act, 2005", "MSMED Act, 2006", "RBI Act, 1934", "FRBM Act, 2003"], explanation: "The SEZ Act, 2005 provides the legal framework for establishment and management of SEZs.", factIds: ["sez-act"], difficulty: "Easy" },
    { stem: "What is a central objective of Special Economic Zones?", correct: "Promoting exports and investment", options: ["Promoting exports and investment", "Conducting monetary policy", "Fixing MSP", "Managing public debt"], explanation: "Export promotion is a central objective of the SEZ framework.", factIds: ["sez-act", "sez-concept"], difficulty: "Medium" },
    { stem: "Which statement correctly distinguishes an SEZ from an industrial corridor?", correct: "An SEZ is a specially governed economic area, while a corridor links multiple industrial nodes through infrastructure", options: ["An SEZ is a specially governed economic area, while a corridor links multiple industrial nodes through infrastructure", "Both are only railway lines", "An SEZ is a bank, while a corridor is a tax", "Industrial corridors exist only inside SEZs"], explanation: "SEZ refers to a defined policy area. An industrial corridor is a wider infrastructure-led network of industrial nodes.", factIds: ["sez-concept", "industrial-corridor"], difficulty: "Hard" },
  ],
  9: [
    { stem: "In which year was the Make in India initiative launched?", correct: "2014", options: ["2014", "1991", "2005", "2017"], explanation: "Make in India was launched on 25 September 2014.", factIds: ["make-in-india"], difficulty: "Easy" },
    { stem: "What is a major objective of Make in India?", correct: "Promoting manufacturing and investment in India", options: ["Promoting manufacturing and investment in India", "Replacing all private firms", "Ending exports", "Conducting monetary policy"], explanation: "Make in India aims to strengthen manufacturing and attract investment and innovation.", factIds: ["make-in-india"], difficulty: "Medium" },
    { stem: "Which statement best distinguishes Make in India from the 1991 delicensing reform?", correct: "Make in India promotes manufacturing and investment, while delicensing removed industrial approval barriers", options: ["Make in India promotes manufacturing and investment, while delicensing removed industrial approval barriers", "Both are exactly the same policy", "Make in India created the IIP", "Delicensing created SEZs in 2005"], explanation: "The two belong to different policy phases. One promotes manufacturing investment, while the other reduced licensing controls.", factIds: ["make-in-india", "delicensing"], difficulty: "Hard" },
  ],
  10: [
    { stem: "Which factor is important in deciding industrial location?", correct: "Access to power, transport and markets", options: ["Access to power, transport and markets", "Only the colour of factory buildings", "Only the number of banks in the country", "Only the national currency symbol"], explanation: "Industrial location depends heavily on inputs, infrastructure, labour, transport and access to markets.", factIds: ["location-factors"], difficulty: "Easy" },
    { stem: "Why can better logistics improve industrial competitiveness?", correct: "It can reduce delays and the cost of moving inputs and finished goods", options: ["It can reduce delays and the cost of moving inputs and finished goods", "It eliminates the need for production", "It automatically fixes prices", "It replaces skilled labour"], explanation: "Efficient logistics reduce time and transport costs across industrial supply chains.", factIds: ["location-factors", "industrial-corridor"], difficulty: "Medium" },
    { stem: "Which location choice is most suitable for a power-intensive industry?", correct: "A location with reliable and adequate power supply", options: ["A location with reliable and adequate power supply", "A place with no transport links", "A location far from all inputs and markets by design", "A site chosen only for tourist traffic"], explanation: "Power-intensive industries need dependable electricity as a major production input.", factIds: ["location-factors"], difficulty: "Hard" },
  ],
  11: [
    { stem: "Which of the following is a capital good?", correct: "Industrial machinery", options: ["Industrial machinery", "Packaged food for final consumption", "A household soap bar", "A cinema ticket"], explanation: "Capital goods are used to produce other goods or services, such as industrial machinery.", factIds: ["capital-goods"], difficulty: "Easy" },
    { stem: "What is an intermediate good?", correct: "An input used to produce another good", options: ["An input used to produce another good", "A final service only", "A tax payment", "A currency note"], explanation: "Intermediate goods enter further production before becoming final goods.", factIds: ["intermediate-goods"], difficulty: "Easy" },
    { stem: "Which item is best classified as a consumer durable?", correct: "Refrigerator", options: ["Refrigerator", "Coal used in a power plant", "Steel sheet used in a factory", "Industrial lathe machine"], explanation: "A refrigerator is a final consumer good used repeatedly over time.", factIds: ["consumer-durables"], difficulty: "Medium" },
    { stem: "Which statement correctly distinguishes capital goods from intermediate goods?", correct: "Capital goods help produce output over time, while intermediate goods are used up in further production", options: ["Capital goods help produce output over time, while intermediate goods are used up in further production", "Both terms mean only final consumer goods", "Intermediate goods are never used by industry", "Capital goods are always raw food products"], explanation: "Capital goods provide productive capacity over time. Intermediate goods become inputs into further production.", factIds: ["capital-goods", "intermediate-goods"], difficulty: "Hard" },
  ],
  12: [
    { stem: "Which sequence is chronologically correct?", correct: "Industrial Policy Resolution 1956 → New Industrial Policy 1991 → SEZ Act 2005 → MSMED Act 2006 → Make in India 2014", options: ["Industrial Policy Resolution 1956 → New Industrial Policy 1991 → SEZ Act 2005 → MSMED Act 2006 → Make in India 2014", "New Industrial Policy 1991 → Industrial Policy Resolution 1956 → Make in India 2014 → SEZ Act 2005 → MSMED Act 2006", "SEZ Act 2005 → Industrial Policy Resolution 1956 → MSMED Act 2006 → New Industrial Policy 1991 → Make in India 2014", "Make in India 2014 → MSMED Act 2006 → SEZ Act 2005 → New Industrial Policy 1991 → Industrial Policy Resolution 1956"], explanation: "These milestones occurred in 1956, 1991, 2005, 2006 and 2014 respectively.", factIds: ["ipr-1956", "nip-1991", "sez-act", "msmed-act", "make-in-india"], difficulty: "Hard" },
    { stem: "Which combination is correctly matched?", correct: "IIP—industrial production; ICI—core industries; MSMED Act—MSME framework", options: ["IIP—industrial production; ICI—core industries; MSMED Act—MSME framework", "IIP—retail inflation; ICI—bank credit; MSMED Act—monetary policy", "IIP—tax revenue; ICI—exports only; MSMED Act—public debt", "IIP—crop insurance; ICI—fiscal deficit; MSMED Act—SEZ regulation"], explanation: "IIP measures industrial production, ICI tracks the Eight Core Industries, and the MSMED Act governs the MSME framework.", factIds: ["iip-definition", "core-eight", "msmed-act"], difficulty: "Medium" },
    { stem: "Which statement correctly separates the three policy tools?", correct: "Delicensing reduces approvals, SEZs create special economic areas, and corridors build connected industrial infrastructure", options: ["Delicensing reduces approvals, SEZs create special economic areas, and corridors build connected industrial infrastructure", "All three mean sale of public shares", "All three are monetary-policy tools", "SEZs and corridors are only statistical indices"], explanation: "The three tools address regulation, special economic areas and infrastructure respectively.", factIds: ["delicensing", "sez-concept", "industrial-corridor"], difficulty: "Hard" },
    { stem: "Which statement best describes India's industrial-policy shift over time?", correct: "Policy moved from a larger State-led role toward fewer controls, more private participation and infrastructure-led manufacturing support", options: ["Policy moved from a larger State-led role toward fewer controls, more private participation and infrastructure-led manufacturing support", "Industrial policy has always prohibited private enterprise", "All industrial controls increased after 1991", "Industrial development stopped after the 1956 policy"], explanation: "The broad shift has been from heavier State direction toward liberalisation, private participation and investment-supporting infrastructure.", factIds: ["ipr-1956", "nip-1991", "industrial-corridor", "make-in-india"], difficulty: "Hard" },
  ],
};

function rotateOptions(options: string[], targetIndex: number) {
  const correct = options[0];
  const rest = options.slice(1);
  const out = [...rest];
  out.splice(targetIndex, 0, correct);
  return out;
}

const questions: EcoCp018ReviewQuestion[] = [];
let serial = 0;
for (let ql = 1; ql <= 12; ql += 1) {
  const cases = qlCases[ql];
  for (let row = 0; row < cases.length; row += 1) {
    const item = cases[row];
    const correctIndex = serial % 4;
    const options = rotateOptions(item.options, correctIndex);
    const sources = sourceBundle(item.factIds);
    questions.push({
      questionId: `ECO-CP-018-Q${String(serial + 1).padStart(3, "0")}`,
      chapterId: "ECO-001",
      cpId: "ECO-CP-018",
      qlId: `ECO-CP-018-QL-${String(ql).padStart(2, "0")}`,
      qlName: qlNames[ql],
      difficulty: item.difficulty,
      stem: item.stem,
      options,
      correctIndex,
      canonicalAnswer: item.correct,
      explanation: item.explanation,
      sourceIds: sources.sourceIds,
      sourceFactIds: sources.sourceFactIds,
      reviewOnly: true,
      runtimeRegistered: false,
    });
    serial += 1;
  }
}

export const ECO_CP018_REVIEW_V1 = questions;
