import { deterministicShuffle } from "../../deterministic";
import type { KnowledgeV1Difficulty } from "../../types";
import { GEO_PHY_001_CP006_FACTS_V1 as facts } from "./geo-phy-001-cp006-facts";
import type { GeoPhy001Cp006ReviewQuestion } from "./geo-phy-001-cp006-review-types";

const qlNames: Record<string, string> = {
  "GEO-PHY-001-QL-046": "Coastal-plains framework and sea-side identification",
  "GEO-PHY-001-QL-047": "Western Coastal Plain location and basic form",
  "GEO-PHY-001-QL-048": "Konkan, Kannad and Malabar sections",
  "GEO-PHY-001-QL-049": "Eastern Coastal Plain location and basic form",
  "GEO-PHY-001-QL-050": "Northern Circar and Coromandel sections",
  "GEO-PHY-001-QL-051": "East-coast rivers and delta formation",
  "GEO-PHY-001-QL-052": "Chilika Lake associations",
  "GEO-PHY-001-QL-053": "Western–Eastern coastal comparison and backwaters",
  "GEO-PHY-001-QL-054": "Multi-statement Coastal Plains synthesis",
};

type Row = readonly [string, string, readonly string[], readonly string[]];

const rowsByQl: Record<number, readonly Row[]> = {
  46: [
    ["India's coastal plains lie along which two water bodies?", "Arabian Sea and Bay of Bengal", ["Arabian Sea and Bay of Bengal", "Arabian Sea and Indian Ocean only", "Bay of Bengal and Red Sea", "Indian Ocean and Caspian Sea"], ["coastal-strips"]],
    ["Which physical division includes the plains along India's western and eastern coasts?", "Coastal Plains", ["Coastal Plains", "Northern Plains", "Indian Desert", "Himalayan Mountains"], ["coastal-strips"]],
    ["The coastal plains of Peninsular India are found mainly on which sides?", "Western and eastern sides", ["Western and eastern sides", "Northern side only", "Northwestern side only", "Central plateau only"], ["coastal-strips"]],
    ["Which sea lies along India's western coastal plain?", "Arabian Sea", ["Arabian Sea", "Bay of Bengal", "Red Sea", "Caspian Sea"], ["coastal-strips", "west-location"]],
    ["Which water body lies along India's eastern coastal plain?", "Bay of Bengal", ["Bay of Bengal", "Arabian Sea", "Red Sea", "Mediterranean Sea"], ["coastal-strips", "east-form"]],
    ["Which description correctly identifies India's coastal plains?", "Plains along the Arabian Sea and Bay of Bengal", ["Plains along the Arabian Sea and Bay of Bengal", "A mountain belt along the northern border", "A desert west of the Aravali Hills", "A plateau south of the Narmada only"], ["coastal-strips"]],
  ],
  47: [
    ["The Western Coastal Plain lies between which two features?", "Western Ghats and Arabian Sea", ["Western Ghats and Arabian Sea", "Eastern Ghats and Bay of Bengal", "Aravali Hills and Arabian Sea", "Himalayas and Northern Plains"], ["west-location"]],
    ["How is the Western Coastal Plain generally described?", "Narrow", ["Narrow", "Very wide", "High and snow-covered", "Desert-like"], ["west-narrow"]],
    ["Which coastal plain lies between the Western Ghats and the Arabian Sea?", "Western Coastal Plain", ["Western Coastal Plain", "Eastern Coastal Plain", "Northern Plains", "Brahmaputra Plain"], ["west-location"]],
    ["The Western Coastal Plain is found on which sea?", "Arabian Sea", ["Arabian Sea", "Bay of Bengal", "Red Sea", "Black Sea"], ["west-location"]],
    ["Which pair correctly describes the Western Coastal Plain?", "Western Ghats — Arabian Sea", ["Western Ghats — Arabian Sea", "Eastern Ghats — Bay of Bengal", "Himalayas — Arabian Sea", "Aravali Hills — Bay of Bengal"], ["west-location"]],
    ["A narrow plain between the Western Ghats and the Arabian Sea is called the:", "Western Coastal Plain", ["Western Coastal Plain", "Eastern Coastal Plain", "Northern Plains", "Indian Desert"], ["west-location", "west-narrow"]],
  ],
  48: [
    ["Which is the northern section of the Western Coastal Plain?", "Konkan", ["Konkan", "Kannad Plain", "Malabar Coast", "Coromandel Coast"], ["west-sections", "konkan"]],
    ["Which is the central section of the Western Coastal Plain?", "Kannad Plain", ["Kannad Plain", "Konkan", "Malabar Coast", "Northern Circar"], ["west-sections", "kannad"]],
    ["Which is the southern section of the Western Coastal Plain?", "Malabar Coast", ["Malabar Coast", "Konkan", "Kannad Plain", "Northern Circar"], ["west-sections", "malabar"]],
    ["What is the correct north-to-south order on the Western Coastal Plain?", "Konkan — Kannad Plain — Malabar Coast", ["Konkan — Kannad Plain — Malabar Coast", "Malabar Coast — Kannad Plain — Konkan", "Kannad Plain — Konkan — Malabar Coast", "Konkan — Malabar Coast — Kannad Plain"], ["west-sections"]],
    ["The Mumbai–Goa stretch is identified in NCERT with which coastal section?", "Konkan", ["Konkan", "Malabar Coast", "Coromandel Coast", "Northern Circar"], ["konkan"]],
    ["Which section lies between the Konkan and the Malabar Coast?", "Kannad Plain", ["Kannad Plain", "Northern Circar", "Coromandel Coast", "Kachchh Coast"], ["west-sections", "kannad"]],
  ],
  49: [
    ["How is the Eastern Coastal Plain generally described?", "Wide and level", ["Wide and level", "Narrow and steep", "High and snow-covered", "Rocky desert"], ["east-form"]],
    ["Compared with the Western Coastal Plain, the Eastern Coastal Plain is generally:", "Wider", ["Wider", "Narrower", "Higher", "More mountainous"], ["east-form", "west-narrow"]],
    ["Which coastal plain is wide and level along the Bay of Bengal?", "Eastern Coastal Plain", ["Eastern Coastal Plain", "Western Coastal Plain", "Northern Plains", "Indian Desert"], ["east-form"]],
    ["The Eastern Coastal Plain lies along which water body?", "Bay of Bengal", ["Bay of Bengal", "Arabian Sea", "Red Sea", "Caspian Sea"], ["east-form"]],
    ["Which pair correctly describes the Eastern Coastal Plain?", "Bay of Bengal — wide and level plain", ["Bay of Bengal — wide and level plain", "Arabian Sea — wide eastern plain", "Western Ghats — snow-covered coast", "Aravali Hills — eastern delta plain"], ["east-form"]],
    ["Which coastal plain is broader and flatter than the western coastal plain?", "Eastern Coastal Plain", ["Eastern Coastal Plain", "Western Coastal Plain", "Konkan only", "Malabar Coast only"], ["east-form", "west-narrow"]],
  ],
  50: [
    ["What is the northern part of the Eastern Coastal Plain called?", "Northern Circar", ["Northern Circar", "Coromandel Coast", "Konkan", "Malabar Coast"], ["east-sections"]],
    ["What is the southern part of the Eastern Coastal Plain called?", "Coromandel Coast", ["Coromandel Coast", "Northern Circar", "Konkan", "Kannad Plain"], ["east-sections"]],
    ["What is the correct north-to-south order on the Eastern Coastal Plain?", "Northern Circar — Coromandel Coast", ["Northern Circar — Coromandel Coast", "Coromandel Coast — Northern Circar", "Konkan — Malabar Coast", "Malabar Coast — Konkan"], ["east-sections"]],
    ["The Coromandel Coast is a section of which coastal plain?", "Eastern Coastal Plain", ["Eastern Coastal Plain", "Western Coastal Plain", "Northern Plains", "Indian Desert"], ["east-sections", "east-form"]],
    ["The Northern Circar belongs to which coastal plain?", "Eastern Coastal Plain", ["Eastern Coastal Plain", "Western Coastal Plain", "Malabar Coast", "Konkan"], ["east-sections", "east-form"]],
    ["Which pair is correctly matched?", "Coromandel Coast — southern Eastern Coastal Plain", ["Coromandel Coast — southern Eastern Coastal Plain", "Konkan — southern Eastern Coastal Plain", "Northern Circar — western coastal section", "Malabar Coast — northern Eastern Coastal Plain"], ["east-sections"]],
  ],
  51: [
    ["Which group of rivers forms large deltas on India's eastern coast?", "Mahanadi, Godavari, Krishna and Kaveri", ["Mahanadi, Godavari, Krishna and Kaveri", "Narmada, Tapi, Luni and Sabarmati", "Indus, Jhelum, Chenab and Ravi", "Ganga, Yamuna, Ghaghara and Gomti"], ["east-deltas"]],
    ["Large river deltas are a major feature of which coastal plain?", "Eastern Coastal Plain", ["Eastern Coastal Plain", "Western Coastal Plain", "Konkan only", "Malabar Coast only"], ["east-deltas", "east-form"]],
    ["Which river is part of the major delta-forming group on the eastern coast?", "Godavari", ["Godavari", "Narmada", "Tapi", "Luni"], ["east-deltas"]],
    ["The Mahanadi forms a large delta on which coast?", "Eastern coast", ["Eastern coast", "Western coast", "Northern mountain front", "Indian Desert"], ["east-deltas"]],
    ["What is generally true of rivers crossing the Western Coastal Plain?", "They do not form deltas", ["They do not form deltas", "They form very large deltas", "They are all glacier-fed", "They all end in inland lakes"], ["west-no-deltas"]],
    ["Which comparison of coastal river mouths is correct?", "Large deltas are common on the east; western-coast rivers generally do not form deltas", ["Large deltas are common on the east; western-coast rivers generally do not form deltas", "Large deltas are common only on the west", "Neither coast has river deltas", "Western-coast rivers form all of India's largest deltas"], ["east-deltas", "west-no-deltas"]],
  ],
  52: [
    ["Chilika Lake is an important feature of which coast?", "Eastern coast", ["Eastern coast", "Western coast", "Northern Plains", "Indian Desert"], ["chilika-east"]],
    ["Chilika Lake is located in which state?", "Odisha", ["Odisha", "Kerala", "Goa", "Gujarat"], ["chilika-odisha"]],
    ["Chilika Lake lies south of which river delta?", "Mahanadi delta", ["Mahanadi delta", "Narmada estuary", "Tapi estuary", "Luni basin"], ["chilika-odisha"]],
    ["Which lake is identified by NCERT as India's largest salt-water lake?", "Chilika Lake", ["Chilika Lake", "Wular Lake", "Loktak Lake", "Dal Lake"], ["chilika-salt"]],
    ["Which pair of clues correctly describes Chilika Lake?", "Odisha — south of the Mahanadi delta", ["Odisha — south of the Mahanadi delta", "Kerala — north of the Narmada estuary", "Gujarat — south of the Godavari delta", "Goa — east of the Kaveri delta"], ["chilika-odisha"]],
    ["A large salt-water lake on the eastern coast of Odisha, south of the Mahanadi delta, is:", "Chilika Lake", ["Chilika Lake", "Wular Lake", "Sambhar Lake", "Loktak Lake"], ["chilika-east", "chilika-odisha", "chilika-salt"]],
  ],
  53: [
    ["Which comparison of India's two coasts is correct?", "Western coast — submerged; eastern coast — emergent", ["Western coast — submerged; eastern coast — emergent", "Western coast — emergent; eastern coast — submerged", "Both coasts — submerged", "Both coasts — emergent"], ["west-submerged", "east-emergent"]],
    ["Why does the western coast have good conditions for natural ports and harbours?", "It is a submerged coast", ["It is a submerged coast", "It is a high mountain coast", "It has the largest river deltas", "It is covered by desert dunes"], ["west-submerged"]],
    ["The kayals or backwaters are a well-known feature of which coast?", "Malabar Coast", ["Malabar Coast", "Konkan", "Northern Circar", "Coromandel Coast"], ["malabar-kayals", "malabar"]],
    ["Well-developed river deltas are especially associated with which coast?", "Eastern coast", ["Eastern coast", "Western coast", "Konkan only", "Arabian Sea islands"], ["east-emergent", "east-deltas"]],
    ["Which pair is correctly matched?", "Malabar Coast — kayals or backwaters", ["Malabar Coast — kayals or backwaters", "Konkan — major east-coast deltas", "Coromandel Coast — western submerged coast", "Northern Circar — Arabian Sea coast"], ["malabar-kayals"]],
    ["Which statement best compares the Western and Eastern Coastal Plains?", "The western plain is narrow and submerged; the eastern plain is broader and emergent", ["The western plain is narrow and submerged; the eastern plain is broader and emergent", "The western plain is broader and emergent; the eastern plain is narrow and submerged", "Both plains are equally narrow and submerged", "Both plains are mountain belts"], ["west-narrow", "west-submerged", "east-form", "east-emergent"]],
  ],
  54: [
    ["Consider the following statements: 1. The Western Coastal Plain lies between the Western Ghats and the Arabian Sea. 2. It is generally narrow. 3. Konkan is its northern section. How many statements are correct?", "All three", ["Only one", "Only two", "All three", "None"], ["west-location", "west-narrow", "konkan"]],
    ["Consider the following statements: 1. The Eastern Coastal Plain is wide and level. 2. Its northern part is called the Northern Circar. 3. Its southern part is called the Coromandel Coast. How many statements are correct?", "All three", ["Only one", "Only two", "All three", "None"], ["east-form", "east-sections"]],
    ["Consider the following statements: 1. Mahanadi, Godavari, Krishna and Kaveri form large deltas on the eastern coast. 2. Chilika is an eastern-coast feature. 3. Chilika lies in Odisha south of the Mahanadi delta. How many statements are correct?", "All three", ["Only one", "Only two", "All three", "None"], ["east-deltas", "chilika-east", "chilika-odisha"]],
    ["Consider the following statements: 1. The western coast is a submerged coast. 2. The eastern coast is an emergent coast. 3. Rivers crossing the Western Coastal Plain generally do not form deltas. How many statements are correct?", "All three", ["Only one", "Only two", "All three", "None"], ["west-submerged", "east-emergent", "west-no-deltas"]],
    ["Consider the following statements: 1. Malabar is the southern section of the Western Coastal Plain. 2. Malabar is known for kayals or backwaters. 3. Kannad Plain is the central western-coast section. How many statements are correct?", "All three", ["Only one", "Only two", "All three", "None"], ["malabar", "malabar-kayals", "kannad"]],
    ["Consider the following statements: 1. The Western Coastal Plain is generally narrow. 2. The Eastern Coastal Plain is wider and more level. 3. Large deltas of major rivers are common on the eastern coast. How many statements are correct?", "All three", ["Only one", "Only two", "All three", "None"], ["west-narrow", "east-form", "east-deltas"]],
  ],
};

function fact(key: string) {
  const row = facts.find((item) => item.id === key);
  if (!row) throw new Error(`Unknown CP006 fact: ${key}`);
  return row;
}

function difficulty(ql: number): KnowledgeV1Difficulty {
  if (ql <= 48) return "Easy";
  if (ql <= 53) return "Medium";
  return "Hard";
}

function fourOptions(pool: readonly string[], correct: string, seed: string, target: number) {
  const uniquePool = [...new Set(pool)];
  if (!uniquePool.includes(correct)) uniquePool.unshift(correct);
  const others = deterministicShuffle(uniquePool.filter((item) => item !== correct), `${seed}:others`).slice(0, 3);
  if (others.length !== 3) throw new Error(`Need three distractors for ${seed}`);
  const options = deterministicShuffle([correct, ...others], `${seed}:options`);
  const current = options.indexOf(correct);
  [options[current], options[target]] = [options[target], options[current]];
  return options;
}

function makeQuestion(ql: number, item: number, globalIndex: number): GeoPhy001Cp006ReviewQuestion {
  const qlId = `GEO-PHY-001-QL-${String(ql).padStart(3, "0")}`;
  const [stem, answer, pool, factKeys] = rowsByQl[ql][item];
  const target = globalIndex % 4;
  const provenance = factKeys.map(fact);
  return {
    questionId: `GEO-PHY-001-CP006-Q${String(globalIndex + 1).padStart(3, "0")}`,
    chapterId: "GEO-PHY-001",
    cpId: "GEO-PHY-001-CP006",
    qlId,
    qlName: qlNames[qlId],
    difficulty: difficulty(ql),
    stem,
    options: fourOptions(pool, answer, `${qlId}:${item}`, target),
    correctIndex: target,
    canonicalAnswer: answer,
    explanation: provenance.map((row) => row.fact).join(" "),
    sourceIds: [...new Set(provenance.flatMap((row) => row.sourceIds))],
    sourceFactIds: [...new Set(provenance.flatMap((row) => row.sourceFactIds))],
    reviewOnly: true,
    runtimeRegistered: false,
  };
}

export function generateGeoPhy001Cp006ReviewBatchV1(): GeoPhy001Cp006ReviewQuestion[] {
  const questions: GeoPhy001Cp006ReviewQuestion[] = [];
  for (let ql = 46; ql <= 54; ql += 1) {
    for (let item = 0; item < 6; item += 1) questions.push(makeQuestion(ql, item, questions.length));
  }
  return questions;
}
