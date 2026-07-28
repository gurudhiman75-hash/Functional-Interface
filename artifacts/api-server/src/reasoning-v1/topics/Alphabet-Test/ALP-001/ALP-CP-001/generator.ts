import { generateAlp001Question } from "../runtime";
import { alpCp001QlById } from "./task-registry";
import type { AlpLocale, GeneratedAlpQuestion } from "../types";

export function generateAlpCp001Question(qlId: string, seed = 0, locale: AlpLocale = "en-IN"): GeneratedAlpQuestion {
  alpCp001QlById(qlId);
  return generateAlp001Question(qlId, seed, locale);
}
