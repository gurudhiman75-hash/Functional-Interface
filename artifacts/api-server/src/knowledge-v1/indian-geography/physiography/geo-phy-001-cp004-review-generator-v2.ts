import {
  GEO_PHY_001_CP004_CENTRAL_HIGHLANDS_FACTS_V1 as central,
  GEO_PHY_001_CP004_DECCAN_FACTS_V1 as deccan,
  GEO_PHY_001_CP004_FOUNDATION_FACTS_V1 as foundation,
  GEO_PHY_001_CP004_GHATS_V1 as ghats,
} from "./geo-phy-001-cp004-facts";
import { generateGeoPhy001Cp004ReviewBatchV1 } from "./geo-phy-001-cp004-review-generator-v1";
import type { GeoPhy001Cp004ReviewQuestion } from "./geo-phy-001-cp004-review-types";

function withCorrectAt(options: string[], correct: string, target: number) {
  const unique = [...new Set([correct, ...options.filter((option) => option !== correct)])].slice(0, 4);
  if (unique.length !== 4) throw new Error(`Need four distinct options for ${correct}`);
  const current = unique.indexOf(correct);
  [unique[current], unique[target]] = [unique[target], unique[current]];
  return unique;
}

export function generateGeoPhy001Cp004ReviewBatchV2(): GeoPhy001Cp004ReviewQuestion[] {
  return generateGeoPhy001Cp004ReviewBatchV1().map((question, index) => {
    const next: GeoPhy001Cp004ReviewQuestion = {
      ...question,
      options: [...question.options],
      sourceIds: [...question.sourceIds],
      sourceFactIds: [...question.sourceFactIds],
    };

    const directStems = [
      "Which plateau is made mainly of old crystalline, igneous and metamorphic rocks?",
      "The breaking and drifting of Gondwana land is linked with the formation of which plateau?",
      "Broad, shallow valleys and rounded hills are common features of which plateau?",
      "The Central Highlands and the Deccan Plateau are the two broad parts of which plateau?",
      "Which plateau is part of India's oldest landmass and is much older than the young fold Himalayas?",
      "Which plateau is linked with both Gondwana land and old crystalline rocks?",
    ];

    if (index < 6) {
      next.stem = directStems[index];
      next.explanation = index === 5
        ? `${foundation[1].fact} ${foundation[0].fact}`
        : (index === 0 || index === 5 ? foundation[0].fact : index === 1 || index === 4 ? foundation[1].fact : index === 2 ? foundation[2].fact : foundation[3].fact);
      if (index === 5) next.sourceFactIds = [...new Set([...foundation[0].sourceFactIds, ...foundation[1].sourceFactIds])];
    }

    if (index === 11) {
      next.stem = "Which river drains the Chotanagpur Plateau?";
    }

    if (index === 19) {
      next.stem = "Which plateau lies south of the Narmada River and has the Satpura Range along its broad northern base?";
      next.canonicalAnswer = "Deccan Plateau";
      next.options = withCorrectAt(["Deccan Plateau", "Central Highlands", "Chotanagpur Plateau", "Malwa Plateau"], next.canonicalAnswer, next.correctIndex);
      next.explanation = `${deccan[0].fact} ${deccan[1].fact}`;
      next.sourceFactIds = [...new Set([...deccan[0].sourceFactIds, ...deccan[1].sourceFactIds])];
    }

    if (index === 22) {
      next.stem = "The Western Ghats and Eastern Ghats mark opposite edges of which plateau?";
      next.canonicalAnswer = "Deccan Plateau";
      next.options = withCorrectAt(["Deccan Plateau", "Central Highlands", "Chotanagpur Plateau", "Northern Plains"], next.canonicalAnswer, next.correctIndex);
      next.explanation = "The Western Ghats mark the western edge of the Deccan Plateau, while the Eastern Ghats mark its eastern edge.";
      next.sourceFactIds = [...new Set([...ghats[0].sourceFactIds, ...ghats[1].sourceFactIds])];
    }

    if (index === 23) {
      next.stem = "Which region lies mainly north of the Narmada River and includes a large part of the Malwa Plateau?";
      next.canonicalAnswer = "Central Highlands";
      next.options = withCorrectAt(["Central Highlands", "Deccan Plateau", "Western Ghats", "Eastern Ghats"], next.canonicalAnswer, next.correctIndex);
      next.explanation = central[0].fact;
      next.sourceFactIds = [...central[0].sourceFactIds];
    }

    return next;
  });
}
