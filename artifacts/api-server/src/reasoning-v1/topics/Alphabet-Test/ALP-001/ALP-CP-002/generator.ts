import { generateAlp001Question } from "../runtime";
import { alpCp002QlById } from "./task-registry";
import type { AlpLocale, GeneratedAlpQuestion } from "../types";

export function generateAlpCp002Question(qlId: string, seed = 0, locale: AlpLocale = "en-IN"): GeneratedAlpQuestion {
  alpCp002QlById(qlId);
  return generateAlp001Question(qlId, seed, locale);
}
