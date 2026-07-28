import { generateAlp001Question } from "../runtime";
import { alpCp003QlById } from "./task-registry";
import type { AlpLocale, GeneratedAlpQuestion } from "../types";

export function generateAlpCp003Question(qlId: string, seed = 0, locale: AlpLocale = "en-IN"): GeneratedAlpQuestion {
  alpCp003QlById(qlId);
  return generateAlp001Question(qlId, seed, locale);
}
