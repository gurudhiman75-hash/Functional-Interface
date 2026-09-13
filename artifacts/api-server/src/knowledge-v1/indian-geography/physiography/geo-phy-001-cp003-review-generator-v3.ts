import { generateGeoPhy001Cp003ReviewBatchV2 } from "./geo-phy-001-cp003-review-generator-v2";
import type { GeoPhy001Cp003ReviewQuestion } from "./geo-phy-001-cp003-review-types";

function simplify(text: string) {
  return text
    .replace(/occupies the easternmost major section of the Northern Plains and lies primarily in Assam/gi, "forms the eastern part of the Northern Plains, mainly in Assam")
    .replace(/forms the easternmost major regional section of the Northern Plains/gi, "forms the eastern part of the Northern Plains")
    .replace(/forms the easternmost major section of the Northern Plains/gi, "forms the eastern part of the Northern Plains")
    .replace(/the easternmost major regional section of the Northern Plains/gi, "the eastern part of the Northern Plains")
    .replace(/the easternmost major section/gi, "the eastern part")
    .replace(/extends across a broad east–west belt and is drained by the Ganga and its tributaries/gi, "is the broad central plain drained by the Ganga and its tributaries")
    .replace(/calcareous kankar deposits/gi, "kankar deposits")
    .replace(/calcareous deposits known as kankar/gi, "kankar deposits")
    .replace(/active floodplains/gi, "river floodplains")
    .replace(/active floodplain/gi, "river floodplain")
    .replace(/is replenished frequently by fresh river deposits/gi, "receives fresh alluvium from floods")
    .replace(/is replenished by fresh flood deposits/gi, "receives fresh alluvium from floods")
    .replace(/receives fresh deposits repeatedly/gi, "receives fresh alluvium during floods")
    .replace(/fresh deposits are laid down repeatedly by floods/gi, "floods deposit fresh alluvium here")
    .replace(/underground streams return to the surface/gi, "streams re-emerge")
    .replace(/streams that disappear in the Bhabar re-emerge/gi, "streams re-emerge after passing through the Bhabar")
    .replace(/interfluves are known as doabs/gi, "land between two rivers is called a doab")
    .replace(/whose interfluves are known as doabs/gi, "where land between two rivers is called a doab")
    .replace(/a depositional landform built by river-borne sediments rather than an old crystalline tableland/gi, "a plain built by river deposits, not an old rocky plateau")
    .replace(/formed by the interplay of the Indus, Ganga and Brahmaputra river systems and their tributaries depositing alluvium over a vast basin/gi, "formed by alluvium deposited by the Indus, Ganga and Brahmaputra river systems")
    .replace(/were built by river-borne alluvium/gi, "were formed by river deposits")
    .replace(/older alluvial deposits, often on higher terraces/gi, "older alluvium found on higher land")
    .replace(/older, slightly elevated alluvial terraces above the floodplains/gi, "older alluvium on slightly higher land")
    .replace(/is less frequently renewed by present-day river floods than Khadar/gi, "is not renewed by floods as often as Khadar")
    .replace(/generally very fertile because fresh alluvium is deposited repeatedly/gi, "is very fertile because floods bring fresh alluvium")
    .replace(/high moisture and re-emerging streams historically supported dense forests and abundant wildlife/gi, "its wet conditions supported thick forests and wildlife")
    .replace(/a wet, swampy and marshy region/gi, "a wet and marshy region")
    .replace(/wet, swampy and marshy/gi, "wet and marshy")
    .replace(/porous pebble belt/gi, "pebbly belt")
    .replace(/porous bed of pebbles/gi, "pebbly ground")
    .replace(/porous surface/gi, "porous ground")
    .replace(/slightly elevated terraces/gi, "slightly higher land")
    .replace(/broadly between/gi, "between")
    .replace(/Which of the following correctly compares/gi, "Which statement correctly compares")
    .replace(/Which of the following\?/g, "Which of the following?")
    .replace(/\s{2,}/g, " ")
    .trim();
}

export function generateGeoPhy001Cp003ReviewBatchV3(): GeoPhy001Cp003ReviewQuestion[] {
  return generateGeoPhy001Cp003ReviewBatchV2().map((question) => {
    const options = question.options.map(simplify);
    const canonicalAnswer = simplify(question.canonicalAnswer);
    const correctIndex = options.indexOf(canonicalAnswer);
    if (correctIndex < 0) throw new Error(`Simplified answer missing for ${question.questionId}`);
    return {
      ...question,
      questionId: question.questionId.replace("-V2-", "-V3-"),
      stem: simplify(question.stem),
      options,
      canonicalAnswer,
      correctIndex,
      explanation: simplify(question.explanation),
    };
  });
}
