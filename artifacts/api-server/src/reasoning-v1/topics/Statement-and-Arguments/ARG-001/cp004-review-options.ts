import type { ArgLocale } from "./types.ts";

export const ARG_CP004_OPTIONS: Readonly<Record<ArgLocale, readonly [string, string, string, string]>> = Object.freeze({
  "en-IN": Object.freeze([
    "Only argument I is strong",
    "Only argument II is strong",
    "Both arguments I and II are strong",
    "Neither argument I nor argument II is strong",
  ] as const),
  "hi-IN": Object.freeze([
    "केवल तर्क I मजबूत है",
    "केवल तर्क II मजबूत है",
    "तर्क I और II दोनों मजबूत हैं",
    "न तो तर्क I और न ही तर्क II मजबूत है",
  ] as const),
  "pa-IN": Object.freeze([
    "ਕੇਵਲ ਦਲੀਲ I ਮਜ਼ਬੂਤ ਹੈ",
    "ਕੇਵਲ ਦਲੀਲ II ਮਜ਼ਬੂਤ ਹੈ",
    "ਦਲੀਲ I ਅਤੇ II ਦੋਵੇਂ ਮਜ਼ਬੂਤ ਹਨ",
    "ਨਾ ਦਲੀਲ I ਅਤੇ ਨਾ ਹੀ ਦਲੀਲ II ਮਜ਼ਬੂਤ ਹੈ",
  ] as const),
});
