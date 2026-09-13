import type { KnowledgeV1Difficulty } from "../../types";
import { GEO_PHY_001_CP008_FACTS_V1 as facts } from "./geo-phy-001-cp008-facts";
import type { GeoPhy001Cp008ReviewQuestion } from "./geo-phy-001-cp008-review-types";

const qlNames: Record<string, string> = {
  "GEO-PHY-001-QL-064": "Aravali location, direction and Guru Shikhar",
  "GEO-PHY-001-QL-065": "Vindhya-Satpura-Narmada relations",
  "GEO-PHY-001-QL-066": "Western and Eastern Ghats basic identification",
  "GEO-PHY-001-QL-067": "Western vs Eastern Ghats comparison",
  "GEO-PHY-001-QL-068": "Nilgiri, Anaimalai and Cardamom Hills",
  "GEO-PHY-001-QL-069": "Important peaks and range associations",
  "GEO-PHY-001-QL-070": "Mahadev, Maikal, Kaimur and Sahyadri associations",
  "GEO-PHY-001-QL-071": "Correct and incorrect hill-range-peak associations",
  "GEO-PHY-001-QL-072": "Multi-statement hills, ranges and peaks synthesis",
};

type Row = readonly [string, string, readonly string[], readonly string[]];

const rowsByQl: Record<number, readonly Row[]> = {
  64: [
    ["Which range extends from Gujarat towards Delhi in a southwest-to-northeast direction?", "Aravali Range", ["Aravali Range", "Satpura Range", "Eastern Ghats", "Kaimur Range"], ["aravali-trend"]],
    ["Which range is known for highly eroded, broken hills in northwestern India?", "Aravali Range", ["Aravali Range", "Western Ghats", "Satpura Range", "Mahadev Hills"], ["aravali-trend"]],
    ["Guru Shikhar is the highest peak of which range?", "Aravali Range", ["Aravali Range", "Nilgiri Hills", "Satpura Range", "Eastern Ghats"], ["guru-shikhar"]],
    ["Guru Shikhar is located in which state?", "Rajasthan", ["Rajasthan", "Madhya Pradesh", "Odisha", "Kerala"], ["guru-shikhar"]],
    ["Which pair is correctly matched?", "Aravali — southwest to northeast", ["Aravali — southwest to northeast", "Satpura — Gujarat to Delhi", "Eastern Ghats — Mount Abu", "Nilgiri — Rajasthan"], ["aravali-trend"]],
    ["Which peak is associated with the Mount Abu area?", "Guru Shikhar", ["Guru Shikhar", "Anamudi", "Doddabetta", "Mahendragiri"], ["guru-shikhar"]],
  ],
  65: [
    ["The Narmada valley lies between which two ranges?", "Vindhya and Satpura", ["Vindhya and Satpura", "Aravali and Nilgiri", "Western and Eastern Ghats", "Kaimur and Cardamom"], ["narmada-between"]],
    ["Which range lies north of the Narmada valley?", "Vindhya Range", ["Vindhya Range", "Satpura Range", "Cardamom Hills", "Nilgiri Hills"], ["narmada-between"]],
    ["Which range lies south of the Narmada valley?", "Satpura Range", ["Satpura Range", "Vindhya Range", "Aravali Range", "Eastern Ghats"], ["narmada-between"]],
    ["A river valley has Vindhya to its north and Satpura to its south. Which river valley is it?", "Narmada valley", ["Narmada valley", "Godavari valley", "Mahanadi valley", "Kaveri valley"], ["narmada-between"]],
    ["Which sequence from north to south is correct?", "Vindhya — Narmada — Satpura", ["Vindhya — Narmada — Satpura", "Satpura — Narmada — Vindhya", "Narmada — Vindhya — Satpura", "Vindhya — Satpura — Narmada"], ["narmada-between"]],
    ["Which statement is correct?", "Narmada lies between Vindhya and Satpura", ["Narmada lies between Vindhya and Satpura", "Narmada lies north of both Vindhya and Satpura", "Satpura lies north of Vindhya", "Vindhya lies south of Satpura"], ["narmada-between"]],
  ],
  66: [
    ["Which mountain system forms the western edge of the Deccan Plateau?", "Western Ghats", ["Western Ghats", "Eastern Ghats", "Aravali Range", "Vindhya Range"], ["deccan-edges"]],
    ["Which mountain system forms the eastern edge of the Deccan Plateau?", "Eastern Ghats", ["Eastern Ghats", "Western Ghats", "Satpura Range", "Aravali Range"], ["deccan-edges"]],
    ["Which Ghats are generally higher?", "Western Ghats", ["Western Ghats", "Eastern Ghats", "Both are of the same height", "Neither forms highlands"], ["western-higher"]],
    ["Which Ghats are more continuous?", "Western Ghats", ["Western Ghats", "Eastern Ghats", "Both are equally broken", "Neither forms a continuous belt"], ["western-continuous"]],
    ["Which Ghats are discontinuous and cut by rivers flowing towards the Bay of Bengal?", "Eastern Ghats", ["Eastern Ghats", "Western Ghats", "Aravali Hills", "Satpura Range"], ["eastern-discontinuous"]],
    ["Which name is commonly used for the Western Ghats?", "Sahyadri", ["Sahyadri", "Kaimur", "Maikal", "Vindhya"], ["sahyadri"]],
  ],
  67: [
    ["Why are the Eastern Ghats less continuous than the Western Ghats?", "Rivers cut across them on their way to the Bay of Bengal", ["Rivers cut across them on their way to the Bay of Bengal", "They are completely covered by sand dunes", "They lie entirely below sea level", "They are separated by the Narmada valley"], ["eastern-discontinuous"]],
    ["Which comparison is correct?", "Western Ghats are higher and more continuous than Eastern Ghats", ["Western Ghats are higher and more continuous than Eastern Ghats", "Eastern Ghats are higher and more continuous than Western Ghats", "Both Ghats are equally continuous", "Western Ghats are lower and more broken"], ["western-higher", "western-continuous", "eastern-discontinuous"]],
    ["A mountain wall is crossed mainly through passes. Which system does this describe?", "Western Ghats", ["Western Ghats", "Eastern Ghats", "Aravali Range", "Kaimur Range"], ["western-continuous"]],
    ["Which statement best describes the Eastern Ghats?", "They are discontinuous and cut by major rivers", ["They are discontinuous and cut by major rivers", "They form a continuous wall crossed only by passes", "They are higher than the Western Ghats", "They run from Gujarat towards Delhi"], ["eastern-discontinuous", "western-higher"]],
    ["Which pair is correctly matched?", "Western Ghats — more continuous", ["Western Ghats — more continuous", "Eastern Ghats — higher", "Eastern Ghats — continuous wall", "Western Ghats — cut by east-flowing rivers"], ["western-continuous", "western-higher", "eastern-discontinuous"]],
    ["Which pair correctly shows the edges of the Deccan Plateau?", "Western Ghats — west; Eastern Ghats — east", ["Western Ghats — west; Eastern Ghats — east", "Eastern Ghats — west; Western Ghats — east", "Aravali — west; Satpura — east", "Vindhya — west; Nilgiri — east"], ["deccan-edges"]],
  ],
  68: [
    ["Where do the Western and Eastern Ghats meet in southern India?", "Nilgiri Hills", ["Nilgiri Hills", "Aravali Hills", "Kaimur Range", "Mahadev Hills"], ["nilgiri-meeting"]],
    ["Which hills lie south of the Nilgiris as part of the Western Ghats system?", "Anaimalai Hills", ["Anaimalai Hills", "Kaimur Hills", "Aravali Hills", "Mahadev Hills"], ["anaimalai-cardamom"]],
    ["Which hills form a southern section of the Western Ghats system?", "Cardamom Hills", ["Cardamom Hills", "Kaimur Hills", "Aravali Hills", "Vindhya Range"], ["anaimalai-cardamom"]],
    ["Which set contains only hills linked with the southern Western Ghats?", "Nilgiri, Anaimalai and Cardamom", ["Nilgiri, Anaimalai and Cardamom", "Aravali, Kaimur and Mahadev", "Vindhya, Kaimur and Aravali", "Satpura, Aravali and Kaimur"], ["nilgiri-meeting", "anaimalai-cardamom"]],
    ["Which statement about the Nilgiri Hills is correct?", "They lie at the meeting zone of the Western and Eastern Ghats", ["They lie at the meeting zone of the Western and Eastern Ghats", "They form the northern end of the Aravali Range", "They lie north of the Narmada valley", "They are an eastern extension of Vindhya"], ["nilgiri-meeting"]],
    ["Moving south from the Nilgiris along the Western Ghats system, which hills are encountered?", "Anaimalai and Cardamom Hills", ["Anaimalai and Cardamom Hills", "Kaimur and Mahadev Hills", "Aravali and Vindhya ranges", "Mahadev and Maikal ranges"], ["anaimalai-cardamom"]],
  ],
  69: [
    ["Anamudi is associated with which mountain system?", "Western Ghats", ["Western Ghats", "Eastern Ghats", "Aravali Range", "Satpura Range"], ["anamudi"]],
    ["Doddabetta is the highest peak of which hills?", "Nilgiri Hills", ["Nilgiri Hills", "Aravali Hills", "Cardamom Hills", "Mahadev Hills"], ["doddabetta"]],
    ["Mahendragiri is associated with which mountain system?", "Eastern Ghats", ["Eastern Ghats", "Western Ghats", "Aravali Range", "Satpura Range"], ["mahendragiri"]],
    ["Which peak is correctly matched with the Aravali Range?", "Guru Shikhar", ["Guru Shikhar", "Anamudi", "Doddabetta", "Mahendragiri"], ["guru-shikhar"]],
    ["Which pair is correctly matched?", "Doddabetta — Nilgiri Hills", ["Doddabetta — Nilgiri Hills", "Anamudi — Aravali Range", "Mahendragiri — Western Ghats", "Guru Shikhar — Eastern Ghats"], ["doddabetta", "anamudi", "mahendragiri", "guru-shikhar"]],
    ["Which peak is in Kerala and forms part of the Western Ghats?", "Anamudi", ["Anamudi", "Guru Shikhar", "Mahendragiri", "Doddabetta"], ["anamudi"]],
  ],
  70: [
    ["Mahadev Hills are linked with which highland system?", "Satpura system", ["Satpura system", "Aravali system", "Eastern Ghats", "Nilgiri system"], ["mahadev-maikal"]],
    ["Maikal Range is linked with which highland system?", "Satpura system", ["Satpura system", "Aravali system", "Western Ghats", "Eastern Ghats"], ["mahadev-maikal"]],
    ["Kaimur Range is an eastern extension of which system?", "Vindhyan system", ["Vindhyan system", "Aravali system", "Western Ghats", "Nilgiri system"], ["kaimur-vindhya"]],
    ["Sahyadri is another name used for which mountain system?", "Western Ghats", ["Western Ghats", "Eastern Ghats", "Satpura Range", "Kaimur Range"], ["sahyadri"]],
    ["Which pair is correctly matched?", "Kaimur — Vindhyan system", ["Kaimur — Vindhyan system", "Mahadev — Aravali system", "Maikal — Eastern Ghats", "Sahyadri — Eastern Ghats"], ["kaimur-vindhya", "mahadev-maikal", "sahyadri"]],
    ["Which set contains only features linked with the Satpura highland system?", "Mahadev Hills and Maikal Range", ["Mahadev Hills and Maikal Range", "Kaimur Range and Aravali Hills", "Nilgiri and Cardamom Hills", "Sahyadri and Eastern Ghats"], ["mahadev-maikal"]],
  ],
  71: [
    ["Which pair is incorrectly matched?", "Anamudi — Eastern Ghats", ["Anamudi — Eastern Ghats", "Doddabetta — Nilgiri Hills", "Guru Shikhar — Aravali Range", "Mahendragiri — Eastern Ghats"], ["anamudi", "doddabetta", "guru-shikhar", "mahendragiri"]],
    ["Which pair is correctly matched?", "Sahyadri — Western Ghats", ["Sahyadri — Western Ghats", "Kaimur — Satpura system", "Guru Shikhar — Nilgiri Hills", "Mahendragiri — Aravali Range"], ["sahyadri", "kaimur-vindhya", "guru-shikhar", "mahendragiri"]],
    ["Which association is incorrect?", "Kaimur — Western Ghats", ["Kaimur — Western Ghats", "Mahadev — Satpura system", "Maikal — Satpura system", "Nilgiri — meeting zone of the Ghats"], ["kaimur-vindhya", "mahadev-maikal", "nilgiri-meeting"]],
    ["Which pair is correctly matched?", "Cardamom Hills — southern Western Ghats", ["Cardamom Hills — southern Western Ghats", "Aravali — eastern edge of Deccan Plateau", "Eastern Ghats — more continuous than Western Ghats", "Vindhya — south of the Narmada"], ["anaimalai-cardamom", "deccan-edges", "western-continuous", "narmada-between"]],
    ["Which association is incorrect?", "Eastern Ghats — higher than Western Ghats", ["Eastern Ghats — higher than Western Ghats", "Western Ghats — more continuous", "Nilgiri — southern meeting zone of the Ghats", "Guru Shikhar — Aravali Range"], ["western-higher", "western-continuous", "nilgiri-meeting", "guru-shikhar"]],
    ["Which pair is correctly matched?", "Mahendragiri — Eastern Ghats", ["Mahendragiri — Eastern Ghats", "Doddabetta — Aravali Range", "Anamudi — Kaimur Range", "Guru Shikhar — Cardamom Hills"], ["mahendragiri", "doddabetta", "anamudi", "guru-shikhar"]],
  ],
  72: [
    ["Consider the following statements: I. Western Ghats are higher than Eastern Ghats. II. Western Ghats are more continuous. III. Eastern Ghats are cut by rivers. Which statements are correct?", "All three", ["All three", "I and II only", "II and III only", "I and III only"], ["western-higher", "western-continuous", "eastern-discontinuous"]],
    ["Consider the following statements: I. Narmada lies between Vindhya and Satpura. II. Vindhya lies south of Narmada. III. Satpura lies south of Narmada. Which statements are correct?", "I and III only", ["I and III only", "I and II only", "II and III only", "All three"], ["narmada-between"]],
    ["Consider the following statements: I. Nilgiri Hills lie at the meeting zone of the Ghats. II. Anaimalai and Cardamom Hills belong to the southern Western Ghats system. III. Guru Shikhar is a Nilgiri peak. Which statements are correct?", "I and II only", ["I and II only", "II and III only", "I and III only", "All three"], ["nilgiri-meeting", "anaimalai-cardamom", "guru-shikhar"]],
    ["Consider the following statements: I. Anamudi is linked with the Western Ghats. II. Doddabetta is linked with the Nilgiri Hills. III. Mahendragiri is linked with the Eastern Ghats. Which statements are correct?", "All three", ["All three", "I and II only", "II and III only", "I and III only"], ["anamudi", "doddabetta", "mahendragiri"]],
    ["Consider the following statements: I. Kaimur is linked with the Vindhyan system. II. Mahadev and Maikal are linked with the Satpura system. III. Sahyadri is a name used for the Eastern Ghats. Which statements are correct?", "I and II only", ["I and II only", "II and III only", "I and III only", "All three"], ["kaimur-vindhya", "mahadev-maikal", "sahyadri"]],
    ["Consider the following statements: I. Aravali trends southwest to northeast. II. Guru Shikhar is an Aravali peak. III. Eastern Ghats are more continuous than Western Ghats. Which statements are correct?", "I and II only", ["I and II only", "II and III only", "I and III only", "All three"], ["aravali-trend", "guru-shikhar", "western-continuous"]],
  ],
};

const factsById = new Map(facts.map((fact) => [fact.id, fact]));

function difficultyForQl(ql: number): KnowledgeV1Difficulty {
  if (ql <= 66) return "Easy";
  if (ql <= 71) return "Medium";
  return "Hard";
}

function rotateOptions(options: readonly string[], correctIndex: number): string[] {
  return options.map((_, index) => options[(index - correctIndex + options.length) % options.length]);
}

export function generateGeoPhy001Cp008ReviewBatchV1(): GeoPhy001Cp008ReviewQuestion[] {
  const output: GeoPhy001Cp008ReviewQuestion[] = [];
  let globalIndex = 0;

  for (let ql = 64; ql <= 72; ql += 1) {
    const qlId = `GEO-PHY-001-QL-${String(ql).padStart(3, "0")}`;
    const rows = rowsByQl[ql];
    if (!rows || rows.length !== 6) throw new Error(`CP008 QL${ql} must contain exactly six review rows`);

    for (const [stem, canonicalAnswer, rawOptions, factIds] of rows) {
      if (rawOptions.length !== 4 || rawOptions[0] !== canonicalAnswer) {
        throw new Error(`CP008 malformed row: ${stem}`);
      }
      const correctIndex = globalIndex % 4;
      const options = rotateOptions(rawOptions, correctIndex);
      const linkedFacts = factIds.map((id) => {
        const fact = factsById.get(id);
        if (!fact) throw new Error(`CP008 unknown fact id: ${id}`);
        return fact;
      });

      output.push({
        questionId: `GEO-PHY-001-CP008-Q${String(globalIndex + 1).padStart(3, "0")}`,
        chapterId: "GEO-PHY-001",
        cpId: "GEO-PHY-001-CP008",
        qlId,
        qlName: qlNames[qlId],
        difficulty: difficultyForQl(ql),
        stem,
        options,
        correctIndex,
        canonicalAnswer,
        explanation: linkedFacts.map((fact) => fact.fact).join(" "),
        sourceIds: [...new Set(linkedFacts.flatMap((fact) => fact.sourceIds))],
        sourceFactIds: [...new Set(linkedFacts.flatMap((fact) => fact.sourceFactIds))],
        reviewOnly: true,
        runtimeRegistered: false,
      });
      globalIndex += 1;
    }
  }

  return output;
}
