import { generateAlp001Question } from "../runtime";
import { alpCp005QlById } from "./task-registry";
import type { AlpLocale, GeneratedAlpQuestion } from "../types";

export function generateAlpCp005Question(qlId: string, seed = 0, locale: AlpLocale = "en-IN"): GeneratedAlpQuestion {
  alpCp005QlById(qlId);
  return generateAlp001Question(qlId, seed, locale);
}
