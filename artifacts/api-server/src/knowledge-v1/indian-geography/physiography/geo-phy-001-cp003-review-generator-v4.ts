import { generateGeoPhy001Cp003ReviewBatchV3 } from "./geo-phy-001-cp003-review-generator-v3";
import type { GeoPhy001Cp003ReviewQuestion } from "./geo-phy-001-cp003-review-types";

function simpleText(text: string) {
  return text
    .replace(/Which regional division forms the western part of the Northern Plains and is associated mainly with the Indus and its tributaries\?/gi, "Which plain forms the western part of the Northern Plains and is linked with the Indus system?")
    .replace(/Which regional division of the Northern Plains extends between the Ghaggar and Teesta rivers\?/gi, "Which plain lies between the Ghaggar and Teesta rivers?")
    .replace(/The broad plain drained mainly by the Ganga and its tributaries is known as which of the following\?/gi, "Which plain is mainly drained by the Ganga and its tributaries?")
    .replace(/Which regional division of the Northern Plains lies primarily in Assam\?/gi, "Which plain lies mainly in Assam?")
    .replace(/The eastern part of the Northern Plains is which of the following\?/gi, "Which plain forms the eastern part of the Northern Plains?")
    .replace(/Which narrow belt lies immediately south of the Shiwaliks and north of the Terai\?/gi, "Which belt lies between the Shiwaliks and the Terai?")
    .replace(/Which belt is characterised by streams re-emerging and creating wet and marshy conditions\?/gi, "In which belt do streams re-emerge and make the land wet and marshy?")
    .replace(/The wet and formerly thickly forested belt lying south of the Bhabar is known as which of the following\?/gi, "Which wet belt lies south of the Bhabar?")
    .replace(/Which term refers to the older alluvium of the Northern Plains, often containing kankar deposits\?/gi, "Which is the older alluvium of the Northern Plains and often contains kankar?")
    .replace(/Which term refers to the newer alluvium renewed almost every year by river floods\?/gi, "Which is the newer alluvium renewed by floods?")
    .replace(/Which statement correctly distinguishes/gi, "Which statement correctly shows the difference between")
    .replace(/Which statement correctly compares the position of/gi, "Which statement correctly shows the position of")
    .replace(/Which statement correctly compares the renewal of/gi, "Which statement correctly compares")
    .replace(/Which statement correctly compares the Punjab Plains and Brahmaputra Plain\?/gi, "Which statement correctly compares the Punjab and Brahmaputra Plains?")
    .replace(/Which statement correctly compares Bhangar and Khadar in terms of age\?/gi, "Which statement correctly compares the age of Bhangar and Khadar?")
    .replace(/The Punjab Plains occupy the western part of the Northern Plains\./gi, "The Punjab Plains are the western part of the Northern Plains.")
    .replace(/They were formed largely by the Indus and its tributaries, where land between two rivers is called a doab\./gi, "They were formed mainly by the Indus and its tributaries. Land between two rivers is called a doab.")
    .replace(/The Ganga Plain extends between the Ghaggar and Teesta rivers and forms the largest central section of the Northern Plains\./gi, "The Ganga Plain lies between the Ghaggar and Teesta rivers. It forms the central part of the Northern Plains.")
    .replace(/The Ganga Plain is the broad central part of the Northern Plains drained by the Ganga and its tributaries\./gi, "The Ganga Plain is mainly drained by the Ganga and its tributaries.")
    .replace(/The Brahmaputra Plain forms the eastern part of the Northern Plains and lies mainly in Assam\./gi, "The Brahmaputra Plain forms the eastern part of the Northern Plains. It lies mainly in Assam.")
    .replace(/The Brahmaputra Plain forms the eastern part of the Northern Plains\./gi, "The Brahmaputra Plain is the eastern part of the Northern Plains.")
    .replace(/In the Bhabar belt, streams deposit pebbles and often disappear into the porous ground\./gi, "In Bhabar, streams often disappear into pebbly ground.")
    .replace(/This narrow belt lies along the Shiwalik foothills\./gi, "It lies along the Shiwalik foothills.")
    .replace(/The Bhabar is the narrow belt immediately south of the Shiwaliks\./gi, "Bhabar lies just south of the Shiwaliks.")
    .replace(/The Terai begins farther south where streams re-emerge\./gi, "Terai lies farther south, where streams re-emerge.")
    .replace(/In the Terai, streams re-emerge after passing through the Bhabar, producing a wet and marshy belt\./gi, "In Terai, streams re-emerge and make the land wet and marshy.")
    .replace(/The Terai lies south of the Bhabar\./gi, "Terai lies south of Bhabar.")
    .replace(/Its wet conditions supported thick forests and wildlife\./gi, "It was once thickly forested and rich in wildlife.")
    .replace(/Bhangar is the older alluvium, generally found on slightly higher land\./gi, "Bhangar is older alluvium found on higher land.")
    .replace(/It commonly contains kankar deposits\./gi, "It often contains kankar.")
    .replace(/Khadar is the newer floodplain alluvium\./gi, "Khadar is newer alluvium found in floodplains.")
    .replace(/Fresh deposits are laid down repeatedly by floods, making it generally very fertile\./gi, "Floods bring fresh alluvium, so Khadar is very fertile.")
    .replace(/Bhabar is a pebbly belt along the Shiwalik foothills, so streams commonly disappear into its surface\./gi, "Bhabar is a pebbly belt near the Shiwaliks where streams often disappear.")
    .replace(/The Terai is the wet belt south of the Bhabar where streams re-emerge and create marshy conditions\./gi, "Terai is the wet belt south of Bhabar where streams re-emerge.")
    .replace(/Bhangar represents older alluvium and commonly contains kankar, unlike Khadar which is renewed by recent floods\./gi, "Bhangar is older alluvium and often contains kankar. Khadar is newer and renewed by floods.")
    .replace(/Khadar is the newer alluvium of river floodplains and receives fresh alluvium from floods\./gi, "Khadar is newer alluvium and receives fresh deposits during floods.")
    .replace(/The Punjab Plains were formed largely by the Indus and its tributaries and are well known for their doabs\./gi, "The Punjab Plains were formed mainly by the Indus and its tributaries. Doabs are common here.")
    .replace(/The Brahmaputra Plain occupies the eastern part of the Northern Plains and lies primarily in Assam\./gi, "The Brahmaputra Plain lies mainly in Assam and forms the eastern part of the Northern Plains.")
    .replace(/Bhabar is the porous pebble belt near the foothills where streams sink below the surface\. Immediately south, they re-emerge in the Terai, producing wet and marshy conditions\./gi, "In Bhabar, streams often disappear into pebbly ground. In Terai, they re-emerge and make the land marshy.")
    .replace(/Bhangar consists of older alluvial deposits, often on higher land\. Khadar occupies newer floodplains and receives fresh alluvium from floods\./gi, "Bhangar is older alluvium on higher land. Khadar is newer alluvium renewed by floods.")
    .replace(/Moving south from the Shiwaliks, the Bhabar comes first and the Terai follows immediately beyond it\./gi, "From the Shiwaliks southward, Bhabar comes first and Terai comes next.")
    .replace(/Khadar belongs to river floodplains and receives fresh deposits repeatedly\. Bhangar is older alluvium on higher surfaces and is less frequently renewed\./gi, "Khadar is renewed by floods. Bhangar is older alluvium and is not renewed as often.")
    .replace(/The Punjab Plains lie in the west of the Northern Plains, whereas the Brahmaputra Plain occupies the eastern part, mainly in Assam\./gi, "The Punjab Plains are in the west. The Brahmaputra Plain is in the east, mainly in Assam.")
    .replace(/Bhangar denotes the older alluvial deposits of the plains, while Khadar denotes the newer deposits of the river floodplains\./gi, "Bhangar is older alluvium. Khadar is newer alluvium.")
    .replace(/Statement I is correct:/gi, "Statement I is correct:")
    .replace(/Statement II is incorrect because/gi, "Statement II is incorrect because")
    .replace(/Both statements are correct\./gi, "Both statements are correct.")
    .replace(/How many of the statements given above are correct\?/gi, "How many statements are correct?")
    .replace(/Which of the statements given above is\/are correct\?/gi, "Which statement(s) is/are correct?")
    .replace(/\s{2,}/g, " ")
    .trim();
}

export function generateGeoPhy001Cp003ReviewBatchV4(): GeoPhy001Cp003ReviewQuestion[] {
  return generateGeoPhy001Cp003ReviewBatchV3().map((question) => {
    const stem = simpleText(question.stem);
    const options = question.options.map(simpleText);
    const canonicalAnswer = simpleText(question.canonicalAnswer);
    const correctIndex = options.indexOf(canonicalAnswer);
    if (correctIndex < 0) throw new Error(`Simplified answer missing for ${question.questionId}`);
    return {
      ...question,
      questionId: question.questionId.replace("-V3-", "-V4-"),
      stem,
      options,
      canonicalAnswer,
      correctIndex,
      explanation: simpleText(question.explanation),
    };
  });
}
