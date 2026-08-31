import { ARG_CP001_ENGLISH_AUTHORITIES } from "./cp001-english-authorities.ts";
import { ARG_CP002_ENGLISH_EXPANSION } from "./cp002-english-expansion.ts";
import { ARG_CP002_EDITORIAL_REPLACEMENTS } from "./cp002-editorial-replacements.ts";

const replacementById = new Map(
  ARG_CP002_EDITORIAL_REPLACEMENTS.map((entry) => [entry.id, entry] as const),
);

const combined = [
  ...ARG_CP001_ENGLISH_AUTHORITIES,
  ...ARG_CP002_ENGLISH_EXPANSION,
].map((entry) => replacementById.get(entry.id) ?? entry);

export const ARG_ENGLISH_AUTHORITIES = Object.freeze(combined);
