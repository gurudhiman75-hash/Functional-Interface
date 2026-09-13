import { generateGeoPhy001Cp003ReviewBatchV4 } from "./geo-phy-001-cp003-review-generator-v4";
import type { GeoPhy001Cp003ReviewQuestion } from "./geo-phy-001-cp003-review-types";

function simpler(text: string) {
  return text
    .replace(/major physiographic division/gi, "region")
    .replace(/physiographic division/gi, "region")
    .replace(/major physiographic region/gi, "region")
    .replace(/physiographic region/gi, "region")
    .replace(/major regional divisions/gi, "main parts")
    .replace(/major regional section/gi, "part")
    .replace(/regional division of the Northern Plains/gi, "plain")
    .replace(/regional division/gi, "plain")
    .replace(/regional section/gi, "part")
    .replace(/physiographic unit/gi, "region")
    .replace(/was formed by extensive alluvial deposition by/gi, "was formed by alluvium deposited by")
    .replace(/is composed mainly of river-deposited alluvium accumulated over millions of years/gi, "is mainly made of alluvium deposited by rivers")
    .replace(/Fertile alluvial soil, abundant water and favourable conditions for intensive agriculture are major features of which region\?/gi, "Which region has fertile alluvial soil and plenty of river water?")
    .replace(/is primarily a depositional plain rather than an ancient crystalline tableland/gi, "was formed mainly by river deposits rather than old crystalline rocks")
    .replace(/were built by enormous quantities of alluvium deposited by/gi, "were formed by alluvium deposited by")
    .replace(/are a vast depositional surface formed by layers of alluvium laid down by Himalayan river systems over a very long period/gi, "were formed over time by alluvium deposited by Himalayan rivers")
    .replace(/combine fertile alluvial soils with abundant river water and favourable climatic conditions, making them one of India's most productive agricultural regions/gi, "have fertile alluvial soil and plenty of river water, so farming is highly productive")
    .replace(/These four belts describe relief and alluvial differences within the Northern Plains:/gi, "These four belts are parts of the Northern Plains:")
    .replace(/are regionally divided into/gi, "are divided into")
    .replace(/are depositional landforms built by river deposits/gi, "were formed by river deposits")
    .replace(/are depositional landforms built by river-borne sediments/gi, "were formed by river deposits")
    .replace(/are mainly depositional landforms/gi, "were formed mainly by river deposits")
    .replace(/The ancient crystalline tableland is the Peninsular Plateau\./gi, "The Peninsular Plateau is made mainly of old crystalline rocks.")
    .replace(/Doabs are prominent in/gi, "Doabs are common in")
    .replace(/whose interfluves are known as doabs/gi, "where the land between two rivers is called a doab")
    .replace(/which were formed by the Indus river system and its tributaries/gi, "which were formed mainly by the Indus and its tributaries")
    .replace(/Which plain forms the eastern part of the Northern Plains\?/gi, "Which plain is in the eastern part of the Northern Plains?")
    .replace(/Which of the following statements correctly describes/gi, "Which statement correctly describes")
    .replace(/pebbly ground/gi, "ground made of pebbles")
    .replace(/pebbly belt/gi, "belt of pebbles")
    .replace(/porous ground/gi, "ground through which water can pass")
    .replace(/porous and streams often disappear there/gi, "a belt where streams often disappear")
    .replace(/older alluvium found on higher land/gi, "older alluvium on higher land")
    .replace(/newer alluvium found in floodplains/gi, "newer alluvium in floodplains")
    .replace(/Bhangar is renewed almost every year by floods/gi, "Bhangar gets fresh alluvium almost every year from floods")
    .replace(/newer alluvium renewed almost every year by river floods/gi, "newer alluvium that gets fresh deposits almost every year from floods")
    .replace(/newer alluvium renewed almost every year by floods/gi, "newer alluvium that gets fresh deposits almost every year from floods")
    .replace(/newer alluvium renewed every year/gi, "newer alluvium that gets fresh deposits every year")
    .replace(/younger floodplain alluvium renewed by fresh deposits/gi, "newer floodplain alluvium that gets fresh deposits")
    .replace(/renewed by recent floods/gi, "given fresh deposits by recent floods")
    .replace(/repeatedly renewed by fresh deposits/gi, "gets fresh deposits repeatedly")
    .replace(/renewed frequently by floods/gi, "given fresh alluvium by floods")
    .replace(/renewed by floods/gi, "given fresh alluvium by floods")
    .replace(/receives fresh alluvium during floods/gi, "gets fresh alluvium during floods")
    .replace(/receives fresh alluvium from floods/gi, "gets fresh alluvium from floods")
    .replace(/receives fresh flood deposits repeatedly/gi, "gets fresh alluvium from floods")
    .replace(/is not renewed as often/gi, "does not get fresh alluvium as often")
    .replace(/is not regularly renewed by present-day flooding/gi, "does not get fresh alluvium regularly from floods")
    .replace(/is less frequently renewed/gi, "gets fresh alluvium less often")
    .replace(/whereas/gi, "while")
    .replace(/primarily in Assam/gi, "mainly in Assam")
    .replace(/lies primarily in Assam/gi, "lies mainly in Assam")
    .replace(/characteristically associated with/gi, "commonly found in")
    .replace(/are commonly associated with/gi, "are commonly found in")
    .replace(/frequently renewed/gi, "often given fresh alluvium")
    .replace(/river-borne alluvium/gi, "alluvium carried by rivers")
    .replace(/ancient crystalline rocks characterise/gi, "old crystalline rocks are typical of")
    .replace(/occupies the broad central sector/gi, "forms the central part")
    .replace(/older alluvial terrace above the floodplain/gi, "older alluvium on higher land")
    .replace(/annual or frequent flood renewal is characteristic of Khadar/gi, "Khadar gets fresh alluvium from floods")
    .replace(/calcareous deposits known as kankar/gi, "kankar deposits")
    .replace(/calcareous kankar deposits/gi, "kankar deposits")
    .replace(/How many statements are correct\?/gi, "How many of these statements are correct?")
    .replace(/Which statement\(s\) is\/are correct\?/gi, "Which statement(s) is/are correct?")
    .replace(/\s{2,}/g, " ")
    .trim();
}

export function generateGeoPhy001Cp003ReviewBatchV5(): GeoPhy001Cp003ReviewQuestion[] {
  return generateGeoPhy001Cp003ReviewBatchV4().map((question) => {
    const stem = simpler(question.stem);
    const options = question.options.map(simpler);
    const canonicalAnswer = simpler(question.canonicalAnswer);
    const correctIndex = options.indexOf(canonicalAnswer);
    if (correctIndex < 0) throw new Error(`Simplified answer missing for ${question.questionId}`);
    return {
      ...question,
      questionId: question.questionId.replace("-V4-", "-V5-"),
      stem,
      options,
      canonicalAnswer,
      correctIndex,
      explanation: simpler(question.explanation),
    };
  });
}
