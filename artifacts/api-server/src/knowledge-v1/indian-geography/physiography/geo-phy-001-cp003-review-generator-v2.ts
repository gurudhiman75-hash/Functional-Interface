import { generateGeoPhy001Cp003ReviewBatchV1 } from "./geo-phy-001-cp003-review-generator-v1";
import type { GeoPhy001Cp003ReviewQuestion } from "./geo-phy-001-cp003-review-types";

function polishExplanation(text: string) {
  return text
    .replace(/^This pair is correct\.\s*/i, "")
    .replace(/^This pair is incorrect\.\s*/i, "")
    .replace(
      "The Punjab Plains occupy the western part of the Northern Plains. They were formed largely by the Indus and its tributaries, whose interfluves are known as doabs.",
      "The Punjab Plains form the western part of the Northern Plains. They are mainly associated with the Indus and its tributaries. Land between two rivers is called a doab.",
    )
    .replace(
      "The Ganga Plain extends between the Ghaggar and Teesta rivers and forms the largest central section of the Northern Plains.",
      "The Ganga Plain extends from the Ghaggar to the Teesta and forms the central part of the Northern Plains.",
    )
    .replace(
      "The Brahmaputra Plain occupies the easternmost major section of the Northern Plains and lies primarily in Assam.",
      "The Brahmaputra Plain is the easternmost major section of the Northern Plains and lies mainly in Assam.",
    )
    .replace(
      "In the Bhabar belt, streams deposit pebbles and often disappear into the porous surface. This narrow belt lies along the Shiwalik foothills.",
      "Bhabar is a narrow pebble belt near the Shiwalik foothills. Streams often disappear into its porous surface.",
    )
    .replace(
      "The Bhabar is the narrow belt immediately south of the Shiwaliks. The Terai begins farther south where streams re-emerge.",
      "Bhabar lies just south of the Shiwaliks. Terai lies immediately south of Bhabar, where streams re-emerge.",
    )
    .replace(
      "In the Terai, streams that disappear in the Bhabar re-emerge, producing a wet, swampy and marshy belt.",
      "In the Terai, streams re-emerge and make the land wet and marshy.",
    )
    .replace(
      "The Terai lies south of the Bhabar. Its high moisture and re-emerging streams historically supported dense forests and abundant wildlife.",
      "Terai lies south of Bhabar. Re-emerging streams make it wet and marshy.",
    )
    .replace(
      "Bhangar is the older alluvium, generally found on slightly elevated terraces. It commonly contains calcareous kankar deposits.",
      "Bhangar is older alluvium found on slightly higher land. It often contains kankar.",
    )
    .replace(
      "Khadar is the newer floodplain alluvium. Fresh deposits are laid down repeatedly by floods, making it generally very fertile.",
      "Khadar is newer floodplain alluvium. Floods regularly deposit fresh, fertile soil there.",
    )
    .replace(
      "Bhabar is a porous pebble belt along the Shiwalik foothills, so streams commonly disappear into its surface.",
      "Bhabar is a porous pebble belt near the Shiwalik foothills where streams often disappear.",
    )
    .replace(
      "The Terai is the wet belt south of the Bhabar where underground streams re-emerge and create marshy conditions.",
      "Terai is the wet belt south of Bhabar where streams re-emerge.",
    )
    .replace(
      "Bhangar represents older alluvium and commonly contains kankar, unlike Khadar which is renewed by recent floods.",
      "Bhangar is older alluvium and often contains kankar. Khadar is newer alluvium.",
    )
    .replace(
      "Khadar is the newer alluvium of active floodplains and is replenished frequently by fresh river deposits.",
      "Khadar is newer alluvium that is regularly renewed by floods.",
    )
    .replace("Statement I is correct:", "I is correct:")
    .replace("Statement II is incorrect because", "II is incorrect because")
    .replace("Statement II is incorrect:", "II is incorrect:")
    .replace("Both statements are correct. The Terai lies south of the Bhabar and becomes wet and marshy where underground streams return to the surface.", "Both are correct. Terai lies south of Bhabar, where streams re-emerge and make the land wet and marshy.")
    .replace("Both statements are correct. Bhangar represents older alluvial terraces, while Khadar is the younger floodplain alluvium renewed by fresh deposits.", "Both are correct. Bhangar is older alluvium; Khadar is newer alluvium renewed by floods.")
    .replace("Both statements are correct. Khadar receives fresh flood deposits repeatedly, while the older Bhangar commonly contains calcareous kankar.", "Both are correct. Khadar receives fresh flood deposits, while Bhangar often contains kankar.")
    .replace("All three statements are correct. Bhabar is the porous foothill belt; immediately south lies the Terai, where streams re-emerge and create wetter conditions.", "All three are correct. Bhabar is the porous foothill belt, and Terai lies just south of it where streams re-emerge.")
    .replace("Statements 1 and 2 are correct. Statement 3 is incorrect because annual or frequent flood renewal is characteristic of Khadar, not Bhangar.", "Statements 1 and 2 are correct. Statement 3 is wrong because Khadar, not Bhangar, is renewed by floods.")
    .replace("Statements 1 and 2 are correct. Statement 3 is incorrect: the western Indus-dominated section is the Punjab Plains; the Ganga Plain occupies the broad central sector.", "Statements 1 and 2 are correct. Statement 3 is wrong: Punjab Plains form the western section, while Ganga Plain is central.")
    .replace("Statements 1 and 2 are correct. Statement 3 is incorrect because older alluvial terraces are Bhangar; the Terai is a wet marshy belt south of Bhabar.", "Statements 1 and 2 are correct. Statement 3 is wrong: Bhangar is older alluvium; Terai is a wet belt south of Bhabar.")
    .replace("Statements 1 and 2 are correct. Statement 3 is incorrect: ancient crystalline rocks characterise the Peninsular Plateau, whereas the Northern Plains are built mainly of deposited alluvium.", "Statements 1 and 2 are correct. Statement 3 is wrong: the Northern Plains are mainly made of deposited alluvium, not ancient crystalline rock.")
    .replace("Statements 1 and 2 are correct. Statement 3 is incorrect because Bhangar is the older alluvium and Khadar is the newer floodplain alluvium.", "Statements 1 and 2 are correct. Statement 3 is wrong: Bhangar is older and Khadar is newer.");
}

const simplifiedStems = new Map<string, string>([
  ["Which major physiographic division of India was formed by extensive alluvial deposition by the Indus, Ganga and Brahmaputra river systems?", "Which physiographic division was formed by alluvium deposited by the Indus, Ganga and Brahmaputra systems?"],
  ["Which major physiographic division is composed mainly of river-deposited alluvium accumulated over millions of years?", "Which physiographic division is mainly made of river-deposited alluvium?"],
  ["Fertile alluvial soil, abundant water and favourable conditions for intensive agriculture are major features of which physiographic division?", "Which physiographic division is known for fertile alluvial soil and abundant river water?"],
  ["Bhabar, Terai, Bhangar and Khadar are relief divisions of which major physiographic region?", "Bhabar, Terai, Bhangar and Khadar are parts of which physiographic division?"],
  ["Punjab Plains, Ganga Plain and Brahmaputra Plain are the major regional divisions of which physiographic unit?", "Punjab, Ganga and Brahmaputra Plains are regional divisions of which physiographic unit?"],
  ["Which physiographic division is primarily a depositional plain rather than an ancient crystalline tableland?", "Which physiographic division is a depositional plain formed by river sediments?"],
  ["Which regional division forms the western part of the Northern Plains and is associated mainly with the Indus and its tributaries?", "Which plain forms the western part of the Northern Plains and is mainly associated with the Indus system?"],
  ["Which regional division of the Northern Plains extends broadly between the Ghaggar and Teesta rivers?", "Which plain extends from the Ghaggar to the Teesta?"],
  ["The broad plain drained mainly by the Ganga and its tributaries is known as which of the following?", "Which plain is drained mainly by the Ganga and its tributaries?"],
  ["Which regional division of the Northern Plains lies primarily in Assam?", "Which plain of the Northern Plains lies mainly in Assam?"],
  ["The easternmost major regional section of the Northern Plains is which of the following?", "Which is the easternmost major section of the Northern Plains?"],
  ["In which belt do Himalayan streams often disappear into a porous bed of pebbles near the foothills?", "In which belt do streams disappear into porous pebble beds near the Himalayan foothills?"],
  ["The wet and formerly thickly forested belt lying south of the Bhabar is known as which of the following?", "Which wet and marshy belt lies south of Bhabar?"],
  ["Which term refers to the older alluvium of the Northern Plains, often containing kankar deposits?", "Which term refers to older alluvium that often contains kankar?"],
  ["Which term refers to the newer alluvium renewed almost every year by river floods?", "Which term refers to newer alluvium renewed by floods?"],
  ["Which of the following correctly compares the position of Bhabar and Terai?", "Which statement correctly compares the location of Bhabar and Terai?"],
  ["Which statement correctly compares the renewal of Bhangar and Khadar deposits?", "Which statement correctly compares Bhangar and Khadar deposits?"],
  ["Which statement correctly compares the Punjab Plains and Brahmaputra Plain?", "Which statement correctly compares the Punjab and Brahmaputra Plains?"],
  ["Which statement correctly compares Bhangar and Khadar in terms of age?", "Which statement correctly compares the age of Bhangar and Khadar?"],
]);

function simplifyStem(stem: string) {
  const exact = simplifiedStems.get(stem);
  if (exact) return exact;
  return stem
    .replace(/^Which of the following statements correctly describes /, "Which statement correctly describes ")
    .replace(/^Which regional division of the Northern Plains /, "Which regional plain ")
    .replace(/^Which of the following correctly /, "Which option correctly ");
}

export function generateGeoPhy001Cp003ReviewBatchV2(): GeoPhy001Cp003ReviewQuestion[] {
  return generateGeoPhy001Cp003ReviewBatchV1().map((question) => ({
    ...question,
    questionId: question.questionId.replace("-V1-", "-V2-"),
    stem: simplifyStem(question.stem),
    explanation: polishExplanation(question.explanation),
  }));
}
