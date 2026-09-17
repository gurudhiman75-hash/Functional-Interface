export type EcoCp001Source = {
  sourceId: string;
  title: string;
  publisher: string;
  sourceClass: "NCERT_TEXTBOOK" | "NCERT_REFERENCE";
  url: string;
  covers: readonly string[];
};

export const ECO_CP001_SOURCES_V1: readonly EcoCp001Source[] = Object.freeze([
  {
    sourceId: "NCERT-INTRO-MICRO-CH01",
    title: "Introductory Microeconomics — Chapter 1: Introduction",
    publisher: "NCERT",
    sourceClass: "NCERT_TEXTBOOK",
    url: "https://ncert.nic.in/textbook/pdf/leec201.pdf",
    covers: [
      "scarcity",
      "choice",
      "opportunity cost",
      "production possibilities",
      "economic activities",
      "market and planned allocation",
      "microeconomics",
    ],
  },
  {
    sourceId: "NCERT-ECON-SYLLABUS-XI-XII",
    title: "Economics Syllabus for Classes XI-XII",
    publisher: "NCERT",
    sourceClass: "NCERT_REFERENCE",
    url: "https://www.ncert.nic.in/pdf/syllabus/08HGPES%20%28XI-XII%29.pdf",
    covers: [
      "microeconomics",
      "central problems of an economy",
      "opportunity cost",
      "utility",
      "demand",
      "supply",
      "production",
    ],
  },
  {
    sourceId: "NCERT-FACTORS-PRODUCTION",
    title: "NCERT — Factors of Production",
    publisher: "NCERT",
    sourceClass: "NCERT_TEXTBOOK",
    url: "https://ncert.nic.in/textbook/pdf/hees107.pdf",
    covers: [
      "land",
      "labour",
      "capital",
      "entrepreneurship",
      "production inputs",
    ],
  },
]);

export const ECO_CP001_SOURCE_IDS_V1 = Object.freeze(
  ECO_CP001_SOURCES_V1.map((source) => source.sourceId),
);
