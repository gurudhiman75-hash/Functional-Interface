import { CP014_PASSAGES } from "./CP014-authorities";
import { CP014_PASSAGE_EXPANSION_A } from "./CP014-passages-expansion-a";
import { CP014_PASSAGE_EXPANSION_B } from "./CP014-passages-expansion-b";
import { CP014_PASSAGE_EXPANSION_C } from "./CP014-passages-expansion-c";
import { CP014_PASSAGE_EXPANSION_D } from "./CP014-passages-expansion-d";

export const CP014_ALL_PASSAGES = Object.freeze([
  ...CP014_PASSAGES,
  ...CP014_PASSAGE_EXPANSION_A,
  ...CP014_PASSAGE_EXPANSION_B,
  ...CP014_PASSAGE_EXPANSION_C,
  ...CP014_PASSAGE_EXPANSION_D,
]);
