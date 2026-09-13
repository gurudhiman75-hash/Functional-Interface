import type { KnowledgeV1Difficulty } from "../../types";
import { GEO_PHY_001_CP007_FACTS_V1 as facts } from "./geo-phy-001-cp007-facts";
import type { GeoPhy001Cp007ReviewQuestion } from "./geo-phy-001-cp007-review-types";

const qlNames: Record<string, string> = {
  "GEO-PHY-001-QL-055": "Major island groups and sea location",
  "GEO-PHY-001-QL-056": "Lakshadweep location and coral origin",
  "GEO-PHY-001-QL-057": "Kavaratti, Pitti and Lakshadweep facts",
  "GEO-PHY-001-QL-058": "Andaman and Nicobar location and arrangement",
  "GEO-PHY-001-QL-059": "Ten Degree Channel and north-south division",
  "GEO-PHY-001-QL-060": "Submarine-mountain origin and Barren Island",
  "GEO-PHY-001-QL-061": "Lakshadweep vs Andaman and Nicobar comparison",
  "GEO-PHY-001-QL-062": "Correct and incorrect island associations",
  "GEO-PHY-001-QL-063": "Multi-statement island synthesis",
};

type Row = readonly [string, string, readonly string[], readonly string[]];

const rowsByQl: Record<number, readonly Row[]> = {
  55: [
    ["Which are the two major island groups of India?", "Lakshadweep and Andaman and Nicobar", ["Lakshadweep and Andaman and Nicobar", "Lakshadweep and Maldives", "Andaman and Sri Lanka", "Nicobar and Maldives"], ["major-groups"]],
    ["Lakshadweep lies in which sea?", "Arabian Sea", ["Arabian Sea", "Bay of Bengal", "Andaman Sea", "Laccadive Sea only"], ["lakshadweep-location"]],
    ["The Andaman and Nicobar Islands lie mainly in which water body?", "Bay of Bengal", ["Bay of Bengal", "Arabian Sea", "Gulf of Kachchh", "Gulf of Khambhat"], ["andaman-location"]],
    ["Which island group lies close to the Malabar Coast?", "Lakshadweep", ["Lakshadweep", "Andaman Islands", "Nicobar Islands", "Sri Lanka"], ["lakshadweep-location"]],
    ["Which Indian island group forms a long chain in the Bay of Bengal?", "Andaman and Nicobar Islands", ["Andaman and Nicobar Islands", "Lakshadweep", "Diu group", "Gulf of Mannar islands"], ["andaman-location"]],
    ["Which pair is correctly matched?", "Lakshadweep — Arabian Sea", ["Lakshadweep — Arabian Sea", "Lakshadweep — Bay of Bengal", "Andaman and Nicobar — Arabian Sea", "Pitti — Bay of Bengal"], ["lakshadweep-location", "andaman-location"]],
  ],
  56: [
    ["Lakshadweep is mainly made up of which type of islands?", "Coral islands", ["Coral islands", "River islands", "Glacial islands", "Lava plateaus"], ["lakshadweep-coral"]],
    ["Which Indian island group is known for its coral origin?", "Lakshadweep", ["Lakshadweep", "Andaman and Nicobar", "Majuli", "Sriharikota"], ["lakshadweep-coral"]],
    ["Lakshadweep lies close to which coast of India?", "Malabar Coast", ["Malabar Coast", "Coromandel Coast", "Northern Circar", "Konkan Coast"], ["lakshadweep-location"]],
    ["Which island group is both in the Arabian Sea and of coral origin?", "Lakshadweep", ["Lakshadweep", "Andaman and Nicobar", "Nicobar only", "Andaman only"], ["lakshadweep-location", "lakshadweep-coral"]],
    ["Which description best fits Lakshadweep?", "Small coral islands near the Malabar Coast", ["Small coral islands near the Malabar Coast", "Large volcanic islands in the Bay of Bengal", "River islands in the Ganga", "Rocky islands off the Coromandel Coast"], ["lakshadweep-location", "lakshadweep-coral"]],
    ["Which statement about Lakshadweep is correct?", "It lies in the Arabian Sea near the Malabar Coast", ["It lies in the Arabian Sea near the Malabar Coast", "It lies east of the Andaman Islands", "It is a chain of Himalayan peaks", "It lies inside the Ganga delta"], ["lakshadweep-location"]],
  ],
  57: [
    ["What is the administrative headquarters of Lakshadweep?", "Kavaratti", ["Kavaratti", "Port Blair", "Minicoy", "Pitti"], ["kavaratti"]],
    ["Pitti island is known for which protected area?", "Bird sanctuary", ["Bird sanctuary", "Tiger reserve", "National desert park", "Mangrove biosphere reserve"], ["pitti"]],
    ["Kavaratti belongs to which island group?", "Lakshadweep", ["Lakshadweep", "Andaman", "Nicobar", "Gulf of Mannar"], ["kavaratti", "lakshadweep-location"]],
    ["Which pair is correctly matched?", "Kavaratti — administrative headquarters of Lakshadweep", ["Kavaratti — administrative headquarters of Lakshadweep", "Kavaratti — active volcano", "Kavaratti — bird sanctuary island", "Kavaratti — Nicobar settlement"], ["kavaratti"]],
    ["Which pair is correctly matched?", "Pitti — bird sanctuary", ["Pitti — bird sanctuary", "Pitti — active volcano", "Pitti — administrative headquarters", "Pitti — Ten Degree Channel"], ["pitti"]],
    ["Which two facts belong to Lakshadweep?", "Kavaratti headquarters and Pitti bird sanctuary", ["Kavaratti headquarters and Pitti bird sanctuary", "Port Blair headquarters and Barren coral reef", "Ten Degree Channel and Coromandel Coast", "Barren volcano and Northern Circar"], ["kavaratti", "pitti"]],
  ],
  58: [
    ["The Andaman and Nicobar Islands form a long chain in which direction?", "North to south", ["North to south", "East to west", "Northwest to southeast only", "In a circular pattern"], ["andaman-location"]],
    ["Which island group is larger and more numerous than Lakshadweep?", "Andaman and Nicobar Islands", ["Andaman and Nicobar Islands", "Pitti islands", "Kavaratti group", "Malabar islands"], ["size-number"]],
    ["Which island group is more widely scattered?", "Andaman and Nicobar Islands", ["Andaman and Nicobar Islands", "Lakshadweep only", "Pitti only", "Kavaratti only"], ["size-number"]],
    ["Which description best fits the Andaman and Nicobar Islands?", "A long north-south chain in the Bay of Bengal", ["A long north-south chain in the Bay of Bengal", "A small coral group near the Malabar Coast", "A river-island group in Assam", "A coastal plain beside the Arabian Sea"], ["andaman-location"]],
    ["A large, scattered island chain in the Bay of Bengal refers to:", "Andaman and Nicobar Islands", ["Andaman and Nicobar Islands", "Lakshadweep", "Kavaratti", "Pitti"], ["andaman-location", "size-number"]],
    ["Which feature is associated with the Andaman and Nicobar Islands?", "Thick forest cover", ["Thick forest cover", "Cold desert climate", "Large inland sand dunes", "Black-soil lava plateau"], ["equatorial-forest"]],
  ],
  59: [
    ["Which channel separates the Andaman group from the Nicobar group?", "Ten Degree Channel", ["Ten Degree Channel", "Palk Strait", "Nine Degree Channel", "Duncan Passage"], ["ten-degree"]],
    ["In the Andaman and Nicobar chain, which group lies to the north?", "Andaman", ["Andaman", "Nicobar", "Lakshadweep", "Minicoy"], ["north-south"]],
    ["In the Andaman and Nicobar chain, which group lies to the south?", "Nicobar", ["Nicobar", "Andaman", "Lakshadweep", "Kavaratti"], ["north-south"]],
    ["A ship moving directly from the Andaman group to the Nicobar group crosses which channel?", "Ten Degree Channel", ["Ten Degree Channel", "Palk Strait", "Gulf of Mannar", "Nine Degree Channel"], ["ten-degree", "north-south"]],
    ["Which pair is correctly matched?", "Ten Degree Channel — Andaman and Nicobar", ["Ten Degree Channel — Andaman and Nicobar", "Palk Strait — Andaman and Nicobar", "Nine Degree Channel — Andaman and Nicobar division", "Gulf of Kachchh — Andaman and Nicobar"], ["ten-degree"]],
    ["Which statement is correct?", "Andaman lies north of Nicobar", ["Andaman lies north of Nicobar", "Nicobar lies north of Andaman", "Lakshadweep separates Andaman and Nicobar", "Pitti lies between Andaman and Nicobar"], ["north-south"]],
  ],
  60: [
    ["The Andaman and Nicobar Islands are considered raised parts of:", "Submarine mountains", ["Submarine mountains", "River deltas", "Coral reefs only", "Coastal sand bars"], ["submarine-mountains"]],
    ["Which island is associated with an active volcano?", "Barren Island", ["Barren Island", "Kavaratti", "Pitti", "Minicoy"], ["barren-island"]],
    ["Barren Island belongs to which island group?", "Andaman and Nicobar Islands", ["Andaman and Nicobar Islands", "Lakshadweep", "Gulf of Mannar islands", "Diu group"], ["barren-island", "andaman-location"]],
    ["Which origin is associated with the Andaman and Nicobar Islands?", "Elevated parts of submarine mountains", ["Elevated parts of submarine mountains", "Only river deposition", "Only coral growth", "Glacial deposition"], ["submarine-mountains"]],
    ["Which feature helps distinguish Andaman and Nicobar from coral Lakshadweep?", "Submarine-mountain origin", ["Submarine-mountain origin", "Small coral-island origin", "Location near Malabar Coast", "Kavaratti headquarters"], ["submarine-mountains", "lakshadweep-coral"]],
    ["Which pair is correctly matched?", "Barren Island — active volcano", ["Barren Island — active volcano", "Barren Island — bird sanctuary", "Barren Island — Lakshadweep headquarters", "Barren Island — coral island near Malabar Coast"], ["barren-island"]],
  ],
  61: [
    ["Which comparison is correct?", "Lakshadweep is coral; Andaman and Nicobar are linked with submarine mountains", ["Lakshadweep is coral; Andaman and Nicobar are linked with submarine mountains", "Both groups are river-made islands", "Both groups lie in the Arabian Sea", "Lakshadweep is volcanic; Andaman and Nicobar are glacial"], ["lakshadweep-coral", "submarine-mountains"]],
    ["Which comparison of location is correct?", "Lakshadweep — Arabian Sea; Andaman and Nicobar — Bay of Bengal", ["Lakshadweep — Arabian Sea; Andaman and Nicobar — Bay of Bengal", "Lakshadweep — Bay of Bengal; Andaman and Nicobar — Arabian Sea", "Both — Arabian Sea", "Both — Bay of Bengal"], ["lakshadweep-location", "andaman-location"]],
    ["Which island group is smaller and made of coral islands?", "Lakshadweep", ["Lakshadweep", "Andaman and Nicobar", "Nicobar only", "Andaman only"], ["lakshadweep-coral", "size-number"]],
    ["Which island group is larger, more numerous and more scattered?", "Andaman and Nicobar Islands", ["Andaman and Nicobar Islands", "Lakshadweep", "Kavaratti", "Pitti"], ["size-number"]],
    ["Which island group has an equatorial climate and thick forests?", "Andaman and Nicobar Islands", ["Andaman and Nicobar Islands", "Lakshadweep only", "Pitti only", "Kavaratti only"], ["equatorial-forest"]],
    ["Which set correctly contrasts the two island groups?", "Lakshadweep: Arabian Sea and coral; Andaman and Nicobar: Bay of Bengal and submarine mountains", ["Lakshadweep: Arabian Sea and coral; Andaman and Nicobar: Bay of Bengal and submarine mountains", "Lakshadweep: Bay of Bengal and volcanic; Andaman and Nicobar: Arabian Sea and coral", "Both: Arabian Sea and coral", "Both: Bay of Bengal and river-made"], ["lakshadweep-location", "lakshadweep-coral", "andaman-location", "submarine-mountains"]],
  ],
  62: [
    ["Which pair is incorrectly matched?", "Lakshadweep — Bay of Bengal", ["Lakshadweep — Bay of Bengal", "Kavaratti — Lakshadweep headquarters", "Pitti — bird sanctuary", "Barren Island — active volcano"], ["lakshadweep-location", "kavaratti", "pitti", "barren-island"]],
    ["Which pair is correctly matched?", "Andaman and Nicobar — Bay of Bengal", ["Andaman and Nicobar — Bay of Bengal", "Lakshadweep — Bay of Bengal", "Kavaratti — Nicobar group", "Pitti — active volcano"], ["andaman-location", "lakshadweep-location", "kavaratti", "pitti"]],
    ["Which association is incorrect?", "Kavaratti — active volcano", ["Kavaratti — active volcano", "Lakshadweep — coral islands", "Ten Degree Channel — Andaman and Nicobar", "Pitti — bird sanctuary"], ["kavaratti", "lakshadweep-coral", "ten-degree", "pitti"]],
    ["Which pair is correctly matched?", "Andaman — north; Nicobar — south", ["Andaman — north; Nicobar — south", "Andaman — south; Nicobar — north", "Lakshadweep — Bay of Bengal", "Barren Island — Lakshadweep"], ["north-south", "lakshadweep-location", "barren-island"]],
    ["Which association is incorrect?", "Pitti — administrative headquarters of Lakshadweep", ["Pitti — administrative headquarters of Lakshadweep", "Kavaratti — administrative headquarters of Lakshadweep", "Barren Island — active volcano", "Lakshadweep — coral islands"], ["pitti", "kavaratti", "barren-island", "lakshadweep-coral"]],
    ["Which pair is correctly matched?", "Andaman and Nicobar — elevated parts of submarine mountains", ["Andaman and Nicobar — elevated parts of submarine mountains", "Lakshadweep — submarine mountain chain", "Barren Island — bird sanctuary", "Kavaratti — Ten Degree Channel"], ["submarine-mountains", "lakshadweep-coral", "barren-island", "kavaratti"]],
  ],
  63: [
    ["Consider the following statements: 1. Lakshadweep lies in the Arabian Sea. 2. It is made of small coral islands. 3. Kavaratti is its administrative headquarters. Which statements are correct?", "All three", ["1 and 2 only", "2 and 3 only", "1 and 3 only", "All three"], ["lakshadweep-location", "lakshadweep-coral", "kavaratti"]],
    ["Consider the following statements: I. Andaman lies north of Nicobar. II. Lakshadweep lies in the Bay of Bengal. III. Ten Degree Channel separates Andaman and Nicobar. Which statements are correct?", "I and III only", ["I and II only", "II and III only", "I and III only", "All three"], ["north-south", "lakshadweep-location", "ten-degree"]],
    ["Consider the following statements: I. Pitti has a bird sanctuary. II. Barren Island is associated with an active volcano. III. Kavaratti is in the Nicobar group. Which statements are correct?", "I and II only", ["I only", "II and III only", "I and II only", "All three"], ["pitti", "barren-island", "kavaratti"]],
    ["Consider the following statements: I. Andaman and Nicobar lie in the Bay of Bengal. II. They are considered raised parts of submarine mountains. III. Lakshadweep is larger and more numerous than Andaman and Nicobar. Which statements are correct?", "I and II only", ["I and II only", "II and III only", "I and III only", "All three"], ["andaman-location", "submarine-mountains", "size-number"]],
    ["Consider the following statements: I. Lakshadweep is a coral island group. II. Andaman and Nicobar have thick forest cover. III. Both island groups lie in the Arabian Sea. Which statements are correct?", "I and II only", ["I only", "II only", "I and II only", "All three"], ["lakshadweep-coral", "equatorial-forest", "andaman-location"]],
    ["Consider the following statements: 1. Andaman and Nicobar form a north-south chain. 2. The Nicobar group lies south of the Andaman group. 3. Barren Island is associated with active volcanism. Which statements are correct?", "All three", ["1 and 2 only", "2 and 3 only", "1 and 3 only", "All three"], ["andaman-location", "north-south", "barren-island"]],
  ],
};

function fact(key: string) {
  const row = facts.find((item) => item.id === key);
  if (!row) throw new Error(`Unknown CP007 fact: ${key}`);
  return row;
}

function difficulty(ql: number): KnowledgeV1Difficulty {
  if (ql <= 57) return "Easy";
  if (ql <= 62) return "Medium";
  return "Hard";
}

function positionOptions(pool: readonly string[], correct: string, target: number): string[] {
  const options = [...pool];
  if (options.length !== 4 || new Set(options).size !== 4) throw new Error("Each CP007 row needs four distinct options");
  const current = options.indexOf(correct);
  if (current < 0) throw new Error(`Correct answer missing from options: ${correct}`);
  [options[current], options[target]] = [options[target], options[current]];
  return options;
}

function makeQuestion(ql: number, item: number, globalIndex: number): GeoPhy001Cp007ReviewQuestion {
  const qlId = `GEO-PHY-001-QL-${String(ql).padStart(3, "0")}`;
  const [stem, answer, pool, factKeys] = rowsByQl[ql][item];
  const target = globalIndex % 4;
  const provenance = factKeys.map(fact);
  return {
    questionId: `GEO-PHY-001-CP007-Q${String(globalIndex + 1).padStart(3, "0")}`,
    chapterId: "GEO-PHY-001",
    cpId: "GEO-PHY-001-CP007",
    qlId,
    qlName: qlNames[qlId],
    difficulty: difficulty(ql),
    stem,
    options: positionOptions(pool, answer, target),
    correctIndex: target,
    canonicalAnswer: answer,
    explanation: provenance.map((row) => row.fact).join(" "),
    sourceIds: [...new Set(provenance.flatMap((row) => row.sourceIds))],
    sourceFactIds: [...new Set(provenance.flatMap((row) => row.sourceFactIds))],
    reviewOnly: true,
    runtimeRegistered: false,
  };
}

export function generateGeoPhy001Cp007ReviewBatchV1(): GeoPhy001Cp007ReviewQuestion[] {
  const questions: GeoPhy001Cp007ReviewQuestion[] = [];
  for (let ql = 55; ql <= 63; ql += 1) {
    for (let item = 0; item < 6; item += 1) questions.push(makeQuestion(ql, item, questions.length));
  }
  return questions;
}
