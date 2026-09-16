import type { EnvCp015ReviewQuestion } from "./env-cp015-review-types";

const P = [
  "India Code — Environment (Protection) Act, 1986",
  "India Code — Water (Prevention and Control of Pollution) Act, 1974",
  "India Code — Air (Prevention and Control of Pollution) Act, 1981",
  "India Code — Wild Life (Protection) Act, 1972",
  "India Code — Van (Sanrakshan Evam Samvardhan) Adhiniyam, 1980",
  "India Code — Biological Diversity Act, 2002",
  "India Code — National Green Tribunal Act, 2010",
  "Central Pollution Control Board mandate",
];

const q = (
  questionId: string,
  qlId: string,
  qlName: string,
  difficulty: "easy" | "medium" | "hard",
  stem: string,
  options: string[],
  correctIndex: number,
  explanation: string,
  provenance: string[],
): EnvCp015ReviewQuestion => ({
  questionId,
  chapterId: "ENV-001",
  cpId: "ENV-CP-015",
  qlId,
  qlName,
  difficulty,
  stem,
  options,
  correctIndex,
  canonicalAnswer: options[correctIndex],
  explanation,
  provenance,
});

export const ENV_CP015_QLS = [
  ["ENV-CP-015-QL-001", "Environment Protection Act basics"],
  ["ENV-CP-015-QL-002", "Water Act basics"],
  ["ENV-CP-015-QL-003", "Air Act basics"],
  ["ENV-CP-015-QL-004", "Wildlife protection law"],
  ["ENV-CP-015-QL-005", "Forest conservation law"],
  ["ENV-CP-015-QL-006", "Biological Diversity Act"],
  ["ENV-CP-015-QL-007", "National Green Tribunal"],
  ["ENV-CP-015-QL-008", "CPCB and SPCB roles"],
  ["ENV-CP-015-QL-009", "Act-year matching"],
  ["ENV-CP-015-QL-010", "Act-purpose matching"],
  ["ENV-CP-015-QL-011", "Institution and law application"],
  ["ENV-CP-015-QL-012", "Integrated environmental law reasoning"],
] as const;

const questions: EnvCp015ReviewQuestion[] = [
  q("ENV15-Q001", "ENV-CP-015-QL-001", "Environment Protection Act basics", "easy", "Which Act is commonly treated as India's broad umbrella law for environmental protection?", ["Environment (Protection) Act, 1986", "Water Act, 1974", "Air Act, 1981", "Biological Diversity Act, 2002"], 0, "The Environment (Protection) Act, 1986 gives the Central Government broad powers to protect and improve environmental quality, so it is often described as an umbrella environmental law.", [P[0]]),
  q("ENV15-Q002", "ENV-CP-015-QL-001", "Environment Protection Act basics", "medium", "The Environment (Protection) Act, 1986 mainly empowers which government to take broad measures for environmental protection?", ["District administration", "Central Government", "Municipal corporation", "Gram Sabha"], 1, "The Act gives broad environmental-protection powers to the Central Government, including power to take measures, issue directions and make rules within the Act.", [P[0]]),
  q("ENV15-Q003", "ENV-CP-015-QL-001", "Environment Protection Act basics", "medium", "Which objective best matches the Environment (Protection) Act, 1986?", ["Regulation of wildlife trade only", "Creation of pollution boards only", "Protection and improvement of the environment", "Settlement of forest rights"], 2, "The Act's central purpose is protection and improvement of the environment. It is broader than laws dealing only with water, air or wildlife.", [P[0]]),
  q("ENV15-Q004", "ENV-CP-015-QL-001", "Environment Protection Act basics", "hard", "A nationwide rule is needed under a broad law covering environmental quality beyond only air or water pollution. Which law is the best fit?", ["Air Act, 1981", "Water Act, 1974", "Wild Life (Protection) Act, 1972", "Environment (Protection) Act, 1986"], 3, "The Environment (Protection) Act, 1986 is the broadest fit because it provides an umbrella framework for protection and improvement of the environment.", [P[0]]),

  q("ENV15-Q005", "ENV-CP-015-QL-002", "Water Act basics", "easy", "Which law was enacted specifically to prevent and control water pollution?", ["Air Act, 1981", "Water (Prevention and Control of Pollution) Act, 1974", "NGT Act, 2010", "Biological Diversity Act, 2002"], 1, "The Water Act, 1974 focuses on prevention and control of water pollution and on maintaining or restoring the wholesomeness of water.", [P[1]]),
  q("ENV15-Q006", "ENV-CP-015-QL-002", "Water Act basics", "medium", "Maintaining or restoring the wholesomeness of water is an objective of which Act?", ["Wild Life (Protection) Act, 1972", "Environment (Protection) Act, 1986", "Water Act, 1974", "NGT Act, 2010"], 2, "This phrase belongs to the Water Act, 1974. The Act also provides the statutory framework for pollution-control boards dealing with water pollution.", [P[1]]),
  q("ENV15-Q007", "ENV-CP-015-QL-002", "Water Act basics", "medium", "The statutory pollution-control boards were originally established for water-pollution functions under which law?", ["Biological Diversity Act, 2002", "Water Act, 1974", "Forest conservation law, 1980", "NGT Act, 2010"], 1, "The Water Act, 1974 provides for boards for prevention and control of water pollution. These boards later also received functions under the Air Act.", [P[1], P[2]]),
  q("ENV15-Q008", "ENV-CP-015-QL-002", "Water Act basics", "hard", "A question asks for the law whose stated purpose combines pollution control with restoring water quality. Which is correct?", ["Air Act, 1981", "Environment (Protection) Act, 1986", "Biological Diversity Act, 2002", "Water Act, 1974"], 3, "The Water Act, 1974 specifically links prevention and control of water pollution with maintaining or restoring the wholesomeness of water.", [P[1]]),

  q("ENV15-Q009", "ENV-CP-015-QL-003", "Air Act basics", "easy", "Which Act deals specifically with prevention, control and abatement of air pollution?", ["Water Act, 1974", "Environment (Protection) Act, 1986", "Air (Prevention and Control of Pollution) Act, 1981", "NGT Act, 2010"], 2, "The Air Act, 1981 specifically addresses prevention, control and abatement of air pollution.", [P[2]]),
  q("ENV15-Q010", "ENV-CP-015-QL-003", "Air Act basics", "medium", "Under the Air Act, which bodies perform major air-pollution control functions at central and state levels?", ["CPCB and SPCBs", "NITI Aayog and Finance Commission", "National and State Biodiversity Authorities", "National Board and State Boards for Wildlife"], 0, "The Air Act assigns major air-pollution functions to the Central Pollution Control Board and State Pollution Control Boards.", [P[2], P[7]]),
  q("ENV15-Q011", "ENV-CP-015-QL-003", "Air Act basics", "medium", "Which function is most closely associated with the Central Pollution Control Board under the Air Act?", ["Approving all forest diversion", "Nationwide planning and technical guidance on air-pollution control", "Declaring every national park", "Deciding all environmental court cases"], 1, "CPCB has apex-level functions such as nationwide planning, technical assistance, data work and advice to the Central Government on air-pollution control.", [P[2], P[7]]),
  q("ENV15-Q012", "ENV-CP-015-QL-003", "Air Act basics", "hard", "A State Government needs advice on a state-level programme to control air pollution. Which body is the closest statutory match?", ["National Green Tribunal", "Central Zoo Authority", "State Pollution Control Board", "National Biodiversity Authority"], 2, "The State Pollution Control Board plans and implements state-level pollution-control programmes and advises the State Government.", [P[2], P[7]]),

  q("ENV15-Q013", "ENV-CP-015-QL-004", "Wildlife protection law", "easy", "Which law is India's principal statute for protection of wild animals, birds and plants?", ["Wild Life (Protection) Act, 1972", "Air Act, 1981", "Water Act, 1974", "NGT Act, 2010"], 0, "The Wild Life (Protection) Act, 1972 provides the main legal framework for protection of wild animals, birds and plants.", [P[3]]),
  q("ENV15-Q014", "ENV-CP-015-QL-004", "Wildlife protection law", "medium", "The statutory framework for national parks and wildlife sanctuaries is primarily linked to which Act?", ["Biological Diversity Act, 2002", "Environment (Protection) Act, 1986", "Wild Life (Protection) Act, 1972", "Air Act, 1981"], 2, "National parks and wildlife sanctuaries are statutory protected-area categories under the Wild Life (Protection) Act, 1972.", [P[3]]),
  q("ENV15-Q015", "ENV-CP-015-QL-004", "Wildlife protection law", "medium", "Which pairing is correct?", ["Wild Life (Protection) Act — air quality standards", "Wild Life (Protection) Act — wildlife and protected-area framework", "Wild Life (Protection) Act — water pollution boards", "Wild Life (Protection) Act — environmental tribunal"], 1, "The Wild Life (Protection) Act, 1972 is the core statute for wildlife protection and statutory protected-area categories.", [P[3]]),
  q("ENV15-Q016", "ENV-CP-015-QL-004", "Wildlife protection law", "hard", "A legal question concerns protection of wild animals and the statutory basis of a national park. Which law should be examined first?", ["NGT Act, 2010", "Water Act, 1974", "Biological Diversity Act, 2002", "Wild Life (Protection) Act, 1972"], 3, "The Wild Life (Protection) Act, 1972 directly governs wildlife protection and the statutory protected-area framework.", [P[3]]),

  q("ENV15-Q017", "ENV-CP-015-QL-005", "Forest conservation law", "easy", "The law historically known as the Forest (Conservation) Act was enacted in which year?", ["1972", "1974", "1980", "1986"], 2, "The forest-conservation law was enacted in 1980. Its current short title is Van (Sanrakshan Evam Samvardhan) Adhiniyam, 1980.", [P[4]]),
  q("ENV15-Q018", "ENV-CP-015-QL-005", "Forest conservation law", "medium", "What is the current short title of the law earlier known as the Forest (Conservation) Act, 1980?", ["Van (Sanrakshan Evam Samvardhan) Adhiniyam, 1980", "Indian Forest Act, 1927", "Forest Rights Act, 2006", "Environment (Protection) Act, 1986"], 0, "The current short title is Van (Sanrakshan Evam Samvardhan) Adhiniyam, 1980. The older name Forest (Conservation) Act, 1980 remains common in exam material.", [P[4]]),
  q("ENV15-Q019", "ENV-CP-015-QL-005", "Forest conservation law", "medium", "Which principle is central to the 1980 forest-conservation law for specified use of forest land?", ["State pollution-board consent alone", "Prior approval of the Central Government for specified decisions", "Approval of the National Green Tribunal in every case", "Approval of the National Biodiversity Authority in every case"], 1, "A core feature of the 1980 law is prior Central Government approval for specified dereservation or non-forest-use decisions involving covered forest land.", [P[4]]),
  q("ENV15-Q020", "ENV-CP-015-QL-005", "Forest conservation law", "hard", "Which statement best distinguishes the 1980 forest-conservation law from the Wild Life (Protection) Act, 1972?", ["Only the 1980 law creates national parks", "Only the wildlife law deals with any forest", "The 1980 law focuses on conservation controls over covered forest land, while the wildlife law provides the wildlife and protected-area framework", "Both laws have exactly the same purpose"], 2, "The 1980 law centres on conservation controls over covered forest land, while the Wild Life (Protection) Act focuses on wildlife protection and statutory protected areas.", [P[3], P[4]]),

  q("ENV15-Q021", "ENV-CP-015-QL-006", "Biological Diversity Act", "easy", "Which Act directly addresses conservation of biological diversity and sustainable use of its components?", ["Air Act, 1981", "Biological Diversity Act, 2002", "Water Act, 1974", "NGT Act, 2010"], 1, "The Biological Diversity Act, 2002 has conservation and sustainable use of biological diversity among its core objectives.", [P[5]]),
  q("ENV15-Q022", "ENV-CP-015-QL-006", "Biological Diversity Act", "medium", "Fair and equitable sharing of benefits from biological resources is a core objective of which law?", ["Wild Life (Protection) Act, 1972", "Environment (Protection) Act, 1986", "Biological Diversity Act, 2002", "Air Act, 1981"], 2, "The Biological Diversity Act links conservation and sustainable use with fair and equitable benefit sharing from biological resources and associated knowledge.", [P[5]]),
  q("ENV15-Q023", "ENV-CP-015-QL-006", "Biological Diversity Act", "medium", "Which set correctly states the three broad objectives of the Biological Diversity Act?", ["Conservation, sustainable use, fair and equitable benefit sharing", "Pollution control, forest diversion, environmental compensation", "Wildlife census, air standards, sewage treatment", "Climate mitigation, adaptation, carbon trading"], 0, "The Act's three broad objectives are conservation of biodiversity, sustainable use of its components and fair and equitable sharing of benefits.", [P[5]]),
  q("ENV15-Q024", "ENV-CP-015-QL-006", "Biological Diversity Act", "hard", "A dispute is mainly about access to biological resources and sharing benefits arising from their use. Which legal framework is most directly relevant?", ["Water Act, 1974", "Air Act, 1981", "Van (Sanrakshan Evam Samvardhan) Adhiniyam, 1980", "Biological Diversity Act, 2002"], 3, "Access and benefit-sharing questions fall most directly within the Biological Diversity Act, 2002 framework.", [P[5]]),

  q("ENV15-Q025", "ENV-CP-015-QL-007", "National Green Tribunal", "easy", "The National Green Tribunal was established under which Act?", ["National Green Tribunal Act, 2010", "Environment (Protection) Act, 1986", "Water Act, 1974", "Air Act, 1981"], 0, "The National Green Tribunal was established under the National Green Tribunal Act, 2010.", [P[6]]),
  q("ENV15-Q026", "ENV-CP-015-QL-007", "National Green Tribunal", "medium", "What is the main role of the National Green Tribunal?", ["Preparing the Union Budget", "Effective and expeditious disposal of specified environmental cases", "Declaring all wildlife sanctuaries", "Running pollution-control laboratories in every state"], 1, "The NGT is a specialized tribunal for effective and expeditious disposal of environmental cases within its statutory jurisdiction.", [P[6]]),
  q("ENV15-Q027", "ENV-CP-015-QL-007", "National Green Tribunal", "medium", "Which matter is expressly connected with the purpose of the NGT Act?", ["Election disputes", "Income-tax assessment", "Relief and compensation for environmental damage", "Inter-state river-water allocation in every form"], 2, "The NGT Act includes environmental protection, enforcement of environmental legal rights, and relief and compensation for damage to persons, property and the environment within its jurisdiction.", [P[6]]),
  q("ENV15-Q028", "ENV-CP-015-QL-007", "National Green Tribunal", "hard", "A specialized forum is needed for a covered dispute involving environmental damage and a claim for compensation. Which institution is the closest match?", ["CPCB", "National Biodiversity Authority", "State Wildlife Board", "National Green Tribunal"], 3, "The National Green Tribunal is the specialized judicial forum created for specified environmental disputes, including relief and compensation matters under its jurisdiction.", [P[6]]),

  q("ENV15-Q029", "ENV-CP-015-QL-008", "CPCB and SPCB roles", "easy", "Which body functions at the national level for pollution control?", ["State Pollution Control Board", "Central Pollution Control Board", "District Planning Committee", "National Board for Wildlife"], 1, "CPCB functions at the central or national level, while SPCBs perform corresponding pollution-control functions at the state level.", [P[7]]),
  q("ENV15-Q030", "ENV-CP-015-QL-008", "CPCB and SPCB roles", "medium", "Which body advises a State Government on prevention and control of air pollution?", ["CPCB only", "National Green Tribunal", "State Pollution Control Board", "National Biodiversity Authority"], 2, "Under the Air Act framework, the State Pollution Control Board advises the State Government and plans state-level pollution-control programmes.", [P[2], P[7]]),
  q("ENV15-Q031", "ENV-CP-015-QL-008", "CPCB and SPCB roles", "medium", "Technical assistance and guidance to State Pollution Control Boards is most closely associated with which body?", ["Central Pollution Control Board", "National Green Tribunal", "Central Zoo Authority", "Gram Sabha"], 0, "CPCB provides technical assistance and guidance to State Pollution Control Boards and also performs nationwide planning and coordination functions.", [P[7]]),
  q("ENV15-Q032", "ENV-CP-015-QL-008", "CPCB and SPCB roles", "hard", "Which comparison is correct?", ["CPCB is a tribunal; SPCB is a ministry", "CPCB works only on biodiversity; SPCB works only on forests", "Both bodies have identical territorial roles", "CPCB has national coordination/advisory functions, while SPCBs implement pollution-control functions at state level"], 3, "CPCB operates at the apex national level, while SPCBs perform state-level planning, implementation and advisory functions under the pollution-control framework.", [P[7]]),

  q("ENV15-Q033", "ENV-CP-015-QL-009", "Act-year matching", "easy", "Which Act-year pair is correct?", ["Water Act — 1974", "Air Act — 1972", "Environment Protection Act — 1981", "NGT Act — 2002"], 0, "The Water (Prevention and Control of Pollution) Act was enacted in 1974.", [P[1]]),
  q("ENV15-Q034", "ENV-CP-015-QL-009", "Act-year matching", "medium", "Arrange these laws from earliest to latest: Water Act, Air Act, Environment (Protection) Act.", ["Air → Water → Environment", "Water → Air → Environment", "Environment → Water → Air", "Water → Environment → Air"], 1, "The sequence is Water Act 1974, Air Act 1981 and Environment (Protection) Act 1986.", [P[0], P[1], P[2]]),
  q("ENV15-Q035", "ENV-CP-015-QL-009", "Act-year matching", "medium", "Which pair belongs to the 2000s or later?", ["Water Act and Air Act", "Wild Life Act and forest-conservation law", "Biological Diversity Act and NGT Act", "Air Act and Environment Protection Act"], 2, "The Biological Diversity Act is from 2002 and the National Green Tribunal Act from 2010.", [P[5], P[6]]),
  q("ENV15-Q036", "ENV-CP-015-QL-009", "Act-year matching", "hard", "Which chronological order is correct?", ["Air Act → Water Act → Wildlife Act → NGT Act", "Environment Protection Act → forest-conservation law → Air Act → Water Act", "Biological Diversity Act → Environment Protection Act → NGT Act → Water Act", "Wild Life Act → Water Act → forest-conservation law → Air Act → Environment Protection Act → Biological Diversity Act → NGT Act"], 3, "The correct order is 1972, 1974, 1980, 1981, 1986, 2002 and 2010 for these seven laws.", P.slice(0, 7)),

  q("ENV15-Q037", "ENV-CP-015-QL-010", "Act-purpose matching", "easy", "Which law-purpose pair is correct?", ["Air Act — control of air pollution", "Water Act — wildlife protection", "NGT Act — forest diversion approval", "Biological Diversity Act — sewage treatment only"], 0, "The Air Act, 1981 deals specifically with prevention, control and abatement of air pollution.", [P[2]]),
  q("ENV15-Q038", "ENV-CP-015-QL-010", "Act-purpose matching", "medium", "Which pair is incorrectly matched?", ["Water Act — water pollution control", "Biological Diversity Act — fair and equitable benefit sharing", "NGT Act — establishment of pollution-control boards", "Wild Life Act — protection of wild animals, birds and plants"], 2, "The NGT Act establishes the National Green Tribunal, not pollution-control boards. Pollution-control boards arise from the Water Act framework and also function under the Air Act.", [P[1], P[2], P[6]]),
  q("ENV15-Q039", "ENV-CP-015-QL-010", "Act-purpose matching", "medium", "Which law is most directly linked with Central approval for specified non-forest use of covered forest land?", ["Van (Sanrakshan Evam Samvardhan) Adhiniyam, 1980", "Water Act, 1974", "NGT Act, 2010", "Biological Diversity Act, 2002"], 0, "The 1980 forest-conservation law requires prior Central Government approval for specified decisions involving covered forest land.", [P[4]]),
  q("ENV15-Q040", "ENV-CP-015-QL-010", "Act-purpose matching", "hard", "Which combination is fully correct?", ["Water Act—1974—water pollution; Air Act—1981—air pollution", "Wild Life Act—1986—air pollution; NGT Act—1974—water quality", "Biological Diversity Act—1980—forest diversion; Air Act—2002—benefit sharing", "Environment Protection Act—2010—tribunal; Water Act—1986—umbrella law"], 0, "Water Act 1974 and Air Act 1981 are correctly matched with their respective pollution-control purposes. The other combinations mix years and statutory purposes.", [P[0], P[1], P[2], P[3], P[5], P[6]]),

  q("ENV15-Q041", "ENV-CP-015-QL-011", "Institution and law application", "easy", "Which institution should be matched with state-level pollution-control implementation?", ["National Green Tribunal", "State Pollution Control Board", "National Biodiversity Authority", "Central Zoo Authority"], 1, "SPCBs perform state-level pollution-control planning, implementation and advisory functions.", [P[7]]),
  q("ENV15-Q042", "ENV-CP-015-QL-011", "Institution and law application", "medium", "A technical guidance programme is to be coordinated nationally for State Pollution Control Boards. Which body is best placed for this role?", ["CPCB", "NGT", "State Wildlife Board", "District Magistrate"], 0, "CPCB has nationwide planning and coordination functions and provides technical assistance and guidance to State Pollution Control Boards.", [P[7]]),
  q("ENV15-Q043", "ENV-CP-015-QL-011", "Institution and law application", "medium", "Which institution is judicial rather than primarily regulatory or administrative?", ["CPCB", "SPCB", "National Green Tribunal", "Pollution-control laboratory"], 2, "The National Green Tribunal is a specialized tribunal. CPCB and SPCBs are pollution-control regulatory bodies rather than courts or tribunals.", [P[6], P[7]]),
  q("ENV15-Q044", "ENV-CP-015-QL-011", "Institution and law application", "hard", "A problem concerns nationwide pollution-control coordination, while another concerns adjudication of a covered environmental compensation claim. Which pairing is correct?", ["SPCB and Gram Sabha", "NGT and CPCB", "CPCB and NGT", "National Biodiversity Authority and SPCB"], 2, "CPCB is the better fit for nationwide pollution-control coordination; NGT is the specialized forum for covered environmental disputes and compensation claims.", [P[6], P[7]]),

  q("ENV15-Q045", "ENV-CP-015-QL-012", "Integrated environmental law reasoning", "easy", "Which law should be matched with biodiversity conservation, sustainable use and benefit sharing?", ["Biological Diversity Act, 2002", "Air Act, 1981", "Water Act, 1974", "NGT Act, 2010"], 0, "These are the three broad objectives of the Biological Diversity Act, 2002.", [P[5]]),
  q("ENV15-Q046", "ENV-CP-015-QL-012", "Integrated environmental law reasoning", "medium", "Consider the pairs: 1. Water Act—1974  2. Air Act—1981  3. NGT Act—2010. Which are correctly matched?", ["1 only", "1 and 2 only", "2 and 3 only", "1, 2 and 3"], 3, "All three pairs are correct: Water Act 1974, Air Act 1981 and National Green Tribunal Act 2010.", [P[1], P[2], P[6]]),
  q("ENV15-Q047", "ENV-CP-015-QL-012", "Integrated environmental law reasoning", "hard", "Which statement is correct?", ["The NGT is the apex pollution-control board", "The Environment Protection Act deals only with wildlife", "The 1980 forest-conservation law and the Wild Life Act have different legal focuses", "The Biological Diversity Act deals only with air pollution"], 2, "The 1980 forest-conservation law focuses on conservation controls over covered forest land, while the Wild Life Act focuses on wildlife protection and statutory protected areas.", [P[3], P[4]]),
  q("ENV15-Q048", "ENV-CP-015-QL-012", "Integrated environmental law reasoning", "hard", "Which sequence best matches issue to legal framework: water pollution; wildlife protection; biodiversity benefit sharing; environmental tribunal?", ["Air Act; Water Act; NGT Act; Wildlife Act", "Water Act; Wild Life Act; Biological Diversity Act; NGT Act", "Environment Protection Act; Air Act; forest-conservation law; Water Act", "NGT Act; Biological Diversity Act; Water Act; Air Act"], 1, "Water pollution maps to the Water Act, wildlife protection to the Wild Life Act, biodiversity benefit sharing to the Biological Diversity Act, and the environmental tribunal to the NGT Act.", [P[1], P[3], P[5], P[6]]),
];

export function getEnvCp015ReviewBatchV1(): EnvCp015ReviewQuestion[] {
  return questions.map((item) => ({ ...item, options: [...item.options], provenance: [...item.provenance] }));
}

export const ENV_CP015_REVIEW_META = {
  chapterId: "ENV-001",
  cpId: "ENV-CP-015",
  version: "V1",
  lifecycle: "REVIEW_CANDIDATE",
  runtimeRegistered: false,
  qlCount: 12,
  questionCount: 48,
  sourceVerificationDate: "2026-09-16",
} as const;
