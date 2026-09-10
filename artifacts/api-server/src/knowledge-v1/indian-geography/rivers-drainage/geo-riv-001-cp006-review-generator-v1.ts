import { deterministicShuffle } from "../../deterministic";
import { GEO_RIV_001_CP006_FACTS_V1 } from "./geo-riv-001-cp006-facts";
import type { GeoRiv001Cp006Difficulty, GeoRiv001Cp006ReviewQuestion } from "./geo-riv-001-cp006-review-types";

const QL_NAMES: Record<string, string> = {
  "GEO-RIV-001-QL-046": "Direct source, course and outfall association",
  "GEO-RIV-001-QL-047": "Reverse association",
  "GEO-RIV-001-QL-048": "Tributary and parent-river identification",
  "GEO-RIV-001-QL-049": "Bank-side identification",
  "GEO-RIV-001-QL-050": "Correct pair",
  "GEO-RIV-001-QL-051": "Incorrect pair",
  "GEO-RIV-001-QL-052": "River relation chain and comparison",
  "GEO-RIV-001-QL-053": "Statement I and II",
  "GEO-RIV-001-QL-054": "Multi-statement count",
};

function fact(id: string) {
  const full = `geo-riv-001-cp006-${id}`;
  const found = GEO_RIV_001_CP006_FACTS_V1.find((entry) => entry.factId === full);
  if (!found) throw new Error(`Missing CP006 fact ${id}`);
  return found;
}

function unique<T>(values: readonly T[]) { return [...new Set(values)]; }

function build(args: {
  qlId: string; key: string; stem: string; answer: string; pool: string[]; explanation: string;
  factIds: string[]; difficulty: GeoRiv001Cp006Difficulty;
  solverAuthority?: GeoRiv001Cp006ReviewQuestion["solverAuthority"];
}): GeoRiv001Cp006ReviewQuestion {
  const facts = args.factIds.map(fact);
  const distractors = deterministicShuffle(unique(args.pool.filter((value) => value !== args.answer)), `cp006:${args.key}:d`).slice(0, 3);
  if (distractors.length !== 3) throw new Error(`CP006 needs 3 distractors for ${args.key}`);
  const options = deterministicShuffle([args.answer, ...distractors], `cp006:${args.key}:o`);
  return {
    questionId: `GEO-RIV-001-CP006-V1-${args.qlId}-${args.key}`,
    chapterId: "GEO-RIV-001",
    cpId: "GEO-RIV-001-CP006",
    qlId: args.qlId,
    qlName: QL_NAMES[args.qlId],
    difficulty: args.difficulty,
    stem: args.stem,
    options,
    correctIndex: options.indexOf(args.answer),
    canonicalAnswer: args.answer,
    explanation: args.explanation,
    sourceIds: unique(facts.map((entry) => entry.source.sourceId)),
    sourceFactIds: facts.map((entry) => entry.factId),
    solverAuthority: args.solverAuthority ?? "CANONICAL_FACT_RELATION",
    reviewOnly: true,
    runtimeRegistered: false,
  };
}

const waterBodies = ["Gulf of Khambhat", "Arabian Sea", "Bay of Bengal", "Rann of Kutch", "Gulf of Kachchh"];
const places = ["Amarkantak", "Multai", "Ajmer", "Ahmedabad", "Bharuch", "Mangalore", "Mahabaleshwar"];
const rivers = ["Narmada", "Tapi", "Mahi", "Sabarmati", "Luni", "Netravati", "Godavari", "Krishna", "Cauvery"];

export function generateGeoRiv001Cp006ReviewQuestionsV1(): GeoRiv001Cp006ReviewQuestion[] {
  const q: GeoRiv001Cp006ReviewQuestion[] = [];
  const add = (x: Parameters<typeof build>[0]) => q.push(build(x));

  // QL046 — 7
  add({ qlId:"GEO-RIV-001-QL-046", key:"046-01", stem:"The Narmada originates at which place?", answer:"Amarkantak", pool:places, explanation:"The Narmada originates at Amarkantak in the Maikal hills of Madhya Pradesh.", factIds:["narmada-source","narmada-source-range"], difficulty:"Easy" });
  add({ qlId:"GEO-RIV-001-QL-046", key:"046-02", stem:"The Narmada drains into which gulf?", answer:"Gulf of Khambhat", pool:waterBodies, explanation:"The Narmada drains into the Gulf of Khambhat in the Arabian Sea near Bharuch.", factIds:["narmada-outfall","narmada-near-bharuch"], difficulty:"Easy" });
  add({ qlId:"GEO-RIV-001-QL-046", key:"046-03", stem:"The Tapi originates near which place?", answer:"Multai", pool:places, explanation:"The Tapi originates near Multai in Madhya Pradesh.", factIds:["tapi-source","tapi-source-state"], difficulty:"Easy" });
  add({ qlId:"GEO-RIV-001-QL-046", key:"046-04", stem:"The Sabarmati originates in which hill range?", answer:"Aravalli Hills", pool:["Aravalli Hills","Vindhya Range","Satpura Range","Maikal Hills","Western Ghats"], explanation:"The Sabarmati originates in the Aravalli Hills of Rajasthan.", factIds:["sabarmati-source","sabarmati-source-state"], difficulty:"Easy" });
  add({ qlId:"GEO-RIV-001-QL-046", key:"046-05", stem:"The Luni ultimately drains into which region?", answer:"Rann of Kutch", pool:waterBodies, explanation:"The Luni flows southwest from the Aravalli region and ultimately drains into the Rann of Kutch.", factIds:["luni-terminal","luni-source-range"], difficulty:"Easy" });
  add({ qlId:"GEO-RIV-001-QL-046", key:"046-06", stem:"The Netravati reaches the Arabian Sea near which city?", answer:"Mangalore", pool:places, explanation:"The Netravati flows westward and reaches the Arabian Sea near Mangalore.", factIds:["netravati-outfall","netravati-mangalore"], difficulty:"Medium" });
  add({ qlId:"GEO-RIV-001-QL-046", key:"046-07", stem:"Which river passes through Ahmedabad?", answer:"Sabarmati", pool:rivers, explanation:"The Sabarmati passes through Ahmedabad before reaching the Gulf of Khambhat.", factIds:["sabarmati-ahmedabad","sabarmati-outfall"], difficulty:"Easy" });

  // QL047 — 6
  add({ qlId:"GEO-RIV-001-QL-047", key:"047-01", stem:"Amarkantak is the source of which west-flowing river?", answer:"Narmada", pool:rivers, explanation:"The Narmada rises at Amarkantak in the Maikal hills.", factIds:["narmada-source"], difficulty:"Easy" });
  add({ qlId:"GEO-RIV-001-QL-047", key:"047-02", stem:"Multai is associated with the source of which river?", answer:"Tapi", pool:rivers, explanation:"The Tapi rises near Multai in Madhya Pradesh.", factIds:["tapi-source"], difficulty:"Easy" });
  add({ qlId:"GEO-RIV-001-QL-047", key:"047-03", stem:"Which river has its terminal drainage in the Rann of Kutch?", answer:"Luni", pool:rivers, explanation:"The Luni does not have the same open-sea outfall as the Narmada or Tapi; it drains into the Rann of Kutch.", factIds:["luni-terminal"], difficulty:"Medium" });
  add({ qlId:"GEO-RIV-001-QL-047", key:"047-04", stem:"Which river flows between the Vindhya and Satpura ranges?", answer:"Narmada", pool:rivers, explanation:"The Narmada flows westward between the Vindhya and Satpura ranges.", factIds:["narmada-between-ranges"], difficulty:"Medium" });
  add({ qlId:"GEO-RIV-001-QL-047", key:"047-05", stem:"Kumaradhara is a tributary of which river?", answer:"Netravati", pool:rivers, explanation:"Kumaradhara is a major left-bank tributary of the Netravati.", factIds:["netravati-kumaradhara","netravati-kumaradhara-bank"], difficulty:"Medium" });
  add({ qlId:"GEO-RIV-001-QL-047", key:"047-06", stem:"Which west-flowing river rises in the Aravalli Hills of Rajasthan and passes through Ahmedabad?", answer:"Sabarmati", pool:rivers, explanation:"The Sabarmati rises in the Aravalli Hills of Rajasthan and later passes through Ahmedabad.", factIds:["sabarmati-source","sabarmati-ahmedabad"], difficulty:"Medium" });

  // QL048 — 8
  const tribs:[string,string,string,string,GeoRiv001Cp006Difficulty][] = [
    ["Tawa","Narmada","narmada-tawa","Tawa is a tributary of the Narmada.","Easy"],
    ["Hiran","Narmada","narmada-hiran","Hiran is a tributary of the Narmada.","Easy"],
    ["Purna","Tapi","tapi-purna","Purna is a principal tributary of the Tapi.","Easy"],
    ["Girna","Tapi","tapi-girna","Girna is a major tributary of the Tapi.","Easy"],
    ["Som","Mahi","mahi-som","Som is a tributary of the Mahi.","Medium"],
    ["Anas","Mahi","mahi-anas","Anas is a tributary of the Mahi.","Medium"],
    ["Watrak","Sabarmati","sabarmati-watrak","Watrak is a tributary of the Sabarmati.","Medium"],
    ["Jojari","Luni","luni-jojari","Jojari is a tributary of the Luni.","Medium"],
  ];
  tribs.forEach(([river,parent,id,explanation,difficulty], i) => add({ qlId:"GEO-RIV-001-QL-048", key:`048-0${i+1}`, stem:`${river} is a tributary of which river?`, answer:parent, pool:rivers, explanation, factIds:[id], difficulty }));

  // QL049 — 6
  const banks:[string,string,string,string,string][] = [
    ["Tawa","Narmada","left-bank","narmada-tawa-bank","Tawa is a left-bank tributary of the Narmada."],
    ["Hiran","Narmada","right-bank","narmada-hiran-bank","Hiran is a right-bank tributary of the Narmada."],
    ["Purna","Tapi","left-bank","tapi-purna-bank","Purna joins the Tapi from the left bank."],
    ["Som","Mahi","right-bank","mahi-som-bank","Som joins the Mahi from the right bank."],
    ["Watrak","Sabarmati","left-bank","sabarmati-watrak-bank","Watrak joins the Sabarmati from the left bank."],
    ["Jojari","Luni","right-bank","luni-jojari-bank","Jojari is the notable right-bank tributary of the Luni."],
  ];
  banks.forEach(([river,parent,bank,id,explanation], i) => add({ qlId:"GEO-RIV-001-QL-049", key:`049-0${i+1}`, stem:`${river} joins the ${parent} from which bank?`, answer:bank, pool:["left-bank","right-bank","both banks","neither bank"], explanation, factIds:[id], difficulty:"Medium", solverAuthority:"RELATION_CLASS_COMPOSER" }));

  // QL050 — 7 correct pairs
  const correctPairs:[string,string,string[],GeoRiv001Cp006Difficulty][] = [
    ["Narmada — Amarkantak","The Narmada rises at Amarkantak.",["narmada-source"],"Easy"],
    ["Tapi — Multai","The Tapi rises near Multai.",["tapi-source"],"Easy"],
    ["Sabarmati — Ahmedabad","The Sabarmati passes through Ahmedabad.",["sabarmati-ahmedabad"],"Easy"],
    ["Luni — Rann of Kutch","The Luni ultimately drains into the Rann of Kutch.",["luni-terminal"],"Medium"],
    ["Tawa — Narmada","Tawa is a tributary of the Narmada.",["narmada-tawa"],"Medium"],
    ["Purna — Tapi","Purna is a tributary of the Tapi.",["tapi-purna"],"Medium"],
    ["Kumaradhara — Netravati","Kumaradhara is a tributary of the Netravati.",["netravati-kumaradhara"],"Medium"],
  ];
  const wrongPairPool = ["Narmada — Multai","Tapi — Amarkantak","Sabarmati — Rann of Kutch","Luni — Ahmedabad","Tawa — Tapi","Purna — Mahi","Kumaradhara — Sabarmati"];
  correctPairs.forEach(([answer,explanation,factIds,difficulty],i)=>add({qlId:"GEO-RIV-001-QL-050",key:`050-0${i+1}`,stem:"Which of the following pairs is correctly matched?",answer,pool:[answer,...wrongPairPool],explanation,factIds,difficulty,solverAuthority:"RELATION_CLASS_COMPOSER"}));

  // QL051 — 7 incorrect pairs
  const badPairs:[string,string,string[],GeoRiv001Cp006Difficulty][] = [
    ["Narmada — Multai","The Narmada rises at Amarkantak, not Multai.",["narmada-source","tapi-source"],"Medium"],
    ["Tapi — Amarkantak","The Tapi rises near Multai; Amarkantak is the source of the Narmada.",["tapi-source","narmada-source"],"Medium"],
    ["Mahi — Rann of Kutch","The Mahi drains into the Gulf of Khambhat; the Luni drains into the Rann of Kutch.",["mahi-outfall","luni-terminal"],"Medium"],
    ["Sabarmati — Mangalore","The Sabarmati passes through Ahmedabad; the Netravati reaches the sea near Mangalore.",["sabarmati-ahmedabad","netravati-mangalore"],"Medium"],
    ["Tawa — Tapi","Tawa is a tributary of the Narmada.",["narmada-tawa"],"Medium"],
    ["Som — Sabarmati","Som is a tributary of the Mahi.",["mahi-som"],"Medium"],
    ["Jojari — Narmada","Jojari is a tributary of the Luni.",["luni-jojari"],"Medium"],
  ];
  const truePairPool = correctPairs.map(([pair])=>pair);
  badPairs.forEach(([answer,explanation,factIds,difficulty],i)=>add({qlId:"GEO-RIV-001-QL-051",key:`051-0${i+1}`,stem:"Which of the following pairs is incorrectly matched?",answer,pool:[answer,...truePairPool],explanation,factIds,difficulty,solverAuthority:"RELATION_CLASS_COMPOSER"}));

  // QL052 — 4 chains/comparisons
  add({qlId:"GEO-RIV-001-QL-052",key:"052-01",stem:"Which sequence correctly traces the Narmada from source to outfall?",answer:"Amarkantak → between Vindhya and Satpura → Gulf of Khambhat",pool:["Amarkantak → between Vindhya and Satpura → Gulf of Khambhat","Multai → Aravalli Hills → Rann of Kutch","Amarkantak → Western Ghats → Bay of Bengal","Ajmer → Vindhya Range → Gulf of Khambhat"],explanation:"The Narmada rises at Amarkantak, flows west between the Vindhya and Satpura ranges, and drains into the Gulf of Khambhat.",factIds:["narmada-source","narmada-between-ranges","narmada-outfall"],difficulty:"Hard",solverAuthority:"RELATION_CHAIN_VERIFIER"});
  add({qlId:"GEO-RIV-001-QL-052",key:"052-02",stem:"Which pair consists of the two major west-flowing rift-valley rivers?",answer:"Narmada and Tapi",pool:["Narmada and Tapi","Godavari and Krishna","Mahanadi and Cauvery","Sabarmati and Luni"],explanation:"Narmada and Tapi are the two major west-flowing Peninsular rivers associated with rift valleys.",factIds:["rift-narmada","rift-tapi"],difficulty:"Hard",solverAuthority:"RELATION_CHAIN_VERIFIER"});
  add({qlId:"GEO-RIV-001-QL-052",key:"052-03",stem:"Which sequence is correctly matched?",answer:"Aravalli Hills → Sabarmati → Gulf of Khambhat",pool:["Aravalli Hills → Sabarmati → Gulf of Khambhat","Amarkantak → Tapi → Rann of Kutch","Multai → Narmada → Bay of Bengal","Western Ghats → Luni → Gulf of Khambhat"],explanation:"The Sabarmati rises in the Aravalli Hills of Rajasthan and drains into the Gulf of Khambhat.",factIds:["sabarmati-source","sabarmati-outfall"],difficulty:"Hard",solverAuthority:"RELATION_CHAIN_VERIFIER"});
  add({qlId:"GEO-RIV-001-QL-052",key:"052-04",stem:"Which river is correctly distinguished from the others by its terminal drainage?",answer:"Luni — Rann of Kutch",pool:["Luni — Rann of Kutch","Narmada — Bay of Bengal","Tapi — Bay of Bengal","Sabarmati — Bay of Bengal"],explanation:"The Luni has terminal drainage in the Rann of Kutch, whereas the Narmada, Tapi and Sabarmati are west-flowing systems connected to the Arabian Sea through the Gulf of Khambhat.",factIds:["luni-terminal","narmada-outfall","tapi-outfall","sabarmati-outfall"],difficulty:"Hard",solverAuthority:"RELATION_CHAIN_VERIFIER"});

  // QL053 — 5 Statement I/II
  const statementOptions=["Both I and II are correct","Only I is correct","Only II is correct","Both I and II are incorrect"];
  add({qlId:"GEO-RIV-001-QL-053",key:"053-01",stem:"Statement I: The Narmada rises at Amarkantak.\nStatement II: The Narmada drains into the Gulf of Khambhat.\nWhich option is correct?",answer:statementOptions[0],pool:statementOptions,explanation:"Both statements are correct. The Narmada rises at Amarkantak and drains into the Gulf of Khambhat.",factIds:["narmada-source","narmada-outfall"],difficulty:"Medium",solverAuthority:"STATEMENT_COMPOSITION_VERIFIER"});
  add({qlId:"GEO-RIV-001-QL-053",key:"053-02",stem:"Statement I: The Tapi rises near Multai.\nStatement II: Purna is a right-bank tributary of the Tapi.\nWhich option is correct?",answer:statementOptions[1],pool:statementOptions,explanation:"Statement I is correct. Purna is a left-bank tributary of the Tapi, so Statement II is incorrect.",factIds:["tapi-source","tapi-purna-bank"],difficulty:"Medium",solverAuthority:"STATEMENT_COMPOSITION_VERIFIER"});
  add({qlId:"GEO-RIV-001-QL-053",key:"053-03",stem:"Statement I: Som is a left-bank tributary of the Mahi.\nStatement II: Anas is a left-bank tributary of the Mahi.\nWhich option is correct?",answer:statementOptions[2],pool:statementOptions,explanation:"Som joins the Mahi from the right bank, while Anas joins it from the left bank. Only Statement II is correct.",factIds:["mahi-som-bank","mahi-anas-bank"],difficulty:"Medium",solverAuthority:"STATEMENT_COMPOSITION_VERIFIER"});
  add({qlId:"GEO-RIV-001-QL-053",key:"053-04",stem:"Statement I: The Luni drains into the Bay of Bengal.\nStatement II: Jojari is a left-bank tributary of the Luni.\nWhich option is correct?",answer:statementOptions[3],pool:statementOptions,explanation:"Both statements are incorrect. The Luni drains into the Rann of Kutch, and Jojari is its notable right-bank tributary.",factIds:["luni-terminal","luni-jojari-bank"],difficulty:"Medium",solverAuthority:"STATEMENT_COMPOSITION_VERIFIER"});
  add({qlId:"GEO-RIV-001-QL-053",key:"053-05",stem:"Statement I: The Sabarmati passes through Ahmedabad.\nStatement II: Watrak joins the Sabarmati from the left bank.\nWhich option is correct?",answer:statementOptions[0],pool:statementOptions,explanation:"Both statements are correct. The Sabarmati passes through Ahmedabad, and Watrak is a left-bank tributary.",factIds:["sabarmati-ahmedabad","sabarmati-watrak-bank"],difficulty:"Medium",solverAuthority:"STATEMENT_COMPOSITION_VERIFIER"});

  // QL054 — 4 count questions
  const countOptions=["One","Two","Three","None"];
  add({qlId:"GEO-RIV-001-QL-054",key:"054-01",stem:"Consider the following statements:\n1. Narmada rises at Amarkantak.\n2. Tapi rises near Multai.\n3. Luni drains into the Rann of Kutch.\nHow many statements are correct?",answer:"Three",pool:countOptions,explanation:"All three statements are correct.",factIds:["narmada-source","tapi-source","luni-terminal"],difficulty:"Hard",solverAuthority:"STATEMENT_COMPOSITION_VERIFIER"});
  add({qlId:"GEO-RIV-001-QL-054",key:"054-02",stem:"Consider the following statements:\n1. Tawa is a right-bank tributary of Narmada.\n2. Purna is a left-bank tributary of Tapi.\n3. Som is a right-bank tributary of Mahi.\nHow many statements are correct?",answer:"Two",pool:countOptions,explanation:"Purna is a left-bank tributary of Tapi and Som is a right-bank tributary of Mahi. Tawa is a left-bank tributary of Narmada. Therefore two statements are correct.",factIds:["narmada-tawa-bank","tapi-purna-bank","mahi-som-bank"],difficulty:"Hard",solverAuthority:"STATEMENT_COMPOSITION_VERIFIER"});
  add({qlId:"GEO-RIV-001-QL-054",key:"054-03",stem:"Consider the following statements:\n1. Sabarmati originates in the Aravalli Hills.\n2. Watrak is a right-bank tributary of Sabarmati.\n3. Netravati reaches the Arabian Sea near Mangalore.\nHow many statements are correct?",answer:"Two",pool:countOptions,explanation:"Statements 1 and 3 are correct. Watrak is a left-bank tributary of the Sabarmati, so Statement 2 is incorrect.",factIds:["sabarmati-source","sabarmati-watrak-bank","netravati-mangalore"],difficulty:"Hard",solverAuthority:"STATEMENT_COMPOSITION_VERIFIER"});
  add({qlId:"GEO-RIV-001-QL-054",key:"054-04",stem:"Consider the following statements:\n1. Narmada and Tapi are major west-flowing rift-valley rivers.\n2. Luni drains into the Gulf of Khambhat.\n3. Sabarmati passes through Ahmedabad.\nHow many statements are correct?",answer:"Two",pool:countOptions,explanation:"Statements 1 and 3 are correct. The Luni drains into the Rann of Kutch, not the Gulf of Khambhat.",factIds:["rift-narmada","rift-tapi","luni-terminal","sabarmati-ahmedabad"],difficulty:"Hard",solverAuthority:"STATEMENT_COMPOSITION_VERIFIER"});

  return q;
}
