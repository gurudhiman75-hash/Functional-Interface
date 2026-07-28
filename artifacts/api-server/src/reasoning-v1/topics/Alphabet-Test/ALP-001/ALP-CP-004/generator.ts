import { generateAlp001Question } from "../runtime";
import { alpCp004QlById } from "./task-registry";
import type { AlpLocale, GeneratedAlpQuestion } from "../types";

export function generateAlpCp004Question(qlId: string, seed = 0, locale: AlpLocale = "en-IN"): GeneratedAlpQuestion {
  alpCp004QlById(qlId);
  return generateAlp001Question(qlId, seed, locale);
}
