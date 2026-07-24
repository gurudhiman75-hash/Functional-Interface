import { lexicalRelationDefinition } from "./relation-definitions";

export interface LexicalFact {
  id: string;
  left: string;
  right: string;
  relation: string;
  predicate: string;
  sourceCategory: string;
  answerCategory: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  locale: "en-IN";
  examSuitability: readonly ("SSC" | "BANKING" | "PUNJAB")[];
  version: string;
  status: "CURATED";
  verifiedAt: string;
  sourceType: "STANDARD_DICTIONARY" | "STANDARD_GENERAL_KNOWLEDGE";
}

const PAIRS: Record<string, readonly (readonly [string, string])[]> = {
  LEX_SYNONYM: [["Rapid","Swift"],["Brave","Courageous"],["Silent","Quiet"],["Ancient","Old"],["Begin","Commence"],["Abandon","Forsake"],["Accurate","Precise"],["Diligent","Industrious"],["Brief","Concise"],["Hostile","Unfriendly"],["Genuine","Authentic"],["Scarce","Rare"]],
  LEX_ANTONYM: [["Victory","Defeat"],["Ancient","Modern"],["Expand","Contract"],["Optimistic","Pessimistic"],["Permanent","Temporary"],["Transparent","Opaque"],["Generous","Stingy"],["Rigid","Flexible"],["Abundant","Scarce"],["Accept","Reject"],["Maximum","Minimum"],["Artificial","Natural"]],
  LEX_INTENSITY_UP: [["Warm","Hot"],["Cool","Cold"],["Dislike","Hate"],["Like","Love"],["Concerned","Anxious"],["Angry","Furious"],["Tired","Exhausted"],["Wet","Soaked"],["Hungry","Starving"],["Surprised","Astonished"],["Afraid","Terrified"],["Painful","Excruciating"]],
  LEX_INTENSITY_DOWN: [["Boiling","Hot"],["Freezing","Cold"],["Furious","Angry"],["Terrified","Afraid"],["Exhausted","Tired"],["Starving","Hungry"],["Ecstatic","Happy"],["Devastated","Sad"],["Astonished","Surprised"],["Soaked","Wet"],["Enormous","Large"],["Excruciating","Painful"]],
  LEX_CAUSE_EFFECT: [["Drought","Crop failure"],["Heavy rain","Flooding"],["Exercise","Fitness"],["Pollution","Illness"],["Friction","Heat"],["Vaccination","Immunity"],["Deforestation","Soil erosion"],["Overspeeding","Accident"],["Lack of sleep","Fatigue"],["Inflation","Price rise"],["Education","Awareness"],["Corrosion","Weakening"]],
  LEX_EFFECT_CAUSE: [["Flooding","Heavy rain"],["Fatigue","Lack of sleep"],["Rust","Oxidation"],["Unemployment","Economic slowdown"],["Dehydration","Water loss"],["Traffic jam","Road blockage"],["Soil erosion","Deforestation"],["Tooth decay","Poor oral hygiene"],["Burn","Heat"],["Obesity","Excess calorie intake"],["Power cut","Grid failure"],["Hearing loss","Loud noise exposure"]],
  LEX_CONDITION_SYMPTOM: [["Fever","High temperature"],["Anaemia","Fatigue"],["Dehydration","Thirst"],["Common cold","Runny nose"],["Migraine","Severe headache"],["Jaundice","Yellowing of skin"],["Asthma","Breathlessness"],["Allergy","Itching"],["Food poisoning","Vomiting"],["Conjunctivitis","Red eyes"],["Diabetes","Frequent urination"],["Arthritis","Joint pain"]],
  LEX_ACTION_RESULT: [["Study","Knowledge"],["Practice","Improvement"],["Save","Accumulation"],["Invest","Return"],["Pollinate","Fertilisation"],["Compress","Reduction in volume"],["Heat","Expansion"],["Cool","Contraction"],["Evaporate","Vapour"],["Condense","Liquid"],["Negotiate","Agreement"],["Plant","Growth"]],
  LEX_OBJECT_CHARACTERISTIC: [["Ice","Cold"],["Fire","Hot"],["Sugar","Sweet"],["Lemon","Sour"],["Coal","Black"],["Cotton","Soft"],["Glass","Transparent"],["Rubber","Elastic"],["Diamond","Hard"],["Feather","Light"],["Honey","Viscous"],["Magnet","Attractive"]],
  LEX_WORD_DEFINITION: [["Bilingual","Speaking two languages"],["Nocturnal","Active at night"],["Aquatic","Living in water"],["Herbivore","Plant-eating animal"],["Anonymous","Of unknown name"],["Transparent","Allowing light to pass through"],["Portable","Easy to carry"],["Fragile","Easily broken"],["Optimist","Person expecting good outcomes"],["Illiterate","Unable to read or write"],["Omnivore","Animal eating plants and meat"],["Dormant","Temporarily inactive"]],
  LEX_DEFICIENCY_MISSING_QUALITY: [["Illiteracy","Literacy"],["Blindness","Sight"],["Deafness","Hearing"],["Poverty","Wealth"],["Cowardice","Courage"],["Ignorance","Knowledge"],["Weakness","Strength"],["Dishonesty","Honesty"],["Impatience","Patience"],["Injustice","Justice"],["Disloyalty","Loyalty"],["Insecurity","Security"]],
  LEX_STUDY_SUBJECT: [["Botany","Plants"],["Zoology","Animals"],["Geology","Earth"],["Astronomy","Celestial bodies"],["Entomology","Insects"],["Ornithology","Birds"],["Seismology","Earthquakes"],["Meteorology","Atmosphere and weather"],["Ecology","Organisms and environment"],["Anthropology","Humans and societies"],["Numismatics","Coins"],["Etymology","Word origins"]],
};

function fill(template: string, left: string, right: string): string {
  return template.replace("{left}", left).replace("{right}", right);
}

export const ANA_CP002_FACTS: readonly LexicalFact[] = Object.entries(PAIRS).flatMap(
  ([relation, pairs], relationIndex) => {
    const definition = lexicalRelationDefinition(relation);
    return pairs.map(([left, right], pairIndex) => ({
      id: `ANA-LF-${String(relationIndex * 12 + pairIndex + 1).padStart(3, "0")}`,
      left, right, relation,
      predicate: fill(definition.predicateTemplate, left, right),
      sourceCategory: definition.sourceCategory,
      answerCategory: definition.answerCategory,
      difficulty: pairIndex < 5 ? "EASY" as const : pairIndex < 10 ? "MEDIUM" as const : "HARD" as const,
      locale: "en-IN" as const,
      examSuitability: ["SSC", "BANKING", "PUNJAB"] as const,
      version: "1.0.0",
      status: "CURATED" as const,
      verifiedAt: "2026-07-24",
      sourceType: relation.startsWith("LEX_") && ["LEX_SYNONYM","LEX_ANTONYM","LEX_INTENSITY_UP","LEX_INTENSITY_DOWN","LEX_WORD_DEFINITION","LEX_DEFICIENCY_MISSING_QUALITY"].includes(relation)
        ? "STANDARD_DICTIONARY" as const
        : "STANDARD_GENERAL_KNOWLEDGE" as const,
    }));
  },
);
