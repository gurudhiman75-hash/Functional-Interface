import type { EEV2DetailMode } from "../../../../../../../../common/eev2/contracts";

export type RealQuestionDifficulty = "Easy" | "Medium" | "Hard";
export type RealQuestionProvenance = "OFFICIAL_EXAM" | "TRUSTED_PLATFORM";

export interface RealQuestionPilotItem {
  pilotId: string;
  questionText: string;
  source: {
    publisher: "Testbook";
    url: string;
    provenance: RealQuestionProvenance;
    exam?: string;
    held?: string;
  };
  difficulty: RealQuestionDifficulty;
  knownRate: number;
  knownValue: number;
  targetRate: number;
  detailMode: EEV2DetailMode;
  locale: "en";
  contextKind: "abstract";
  contextLabel: "number";
  semanticUnit: "abstract-number";
  reviewerNotes: readonly string[];
}

const modes: readonly EEV2DetailMode[] = ["short", "standard", "detailed"];

function item(
  index: number,
  questionText: string,
  slug: string,
  knownRate: number,
  knownValue: number,
  targetRate: number,
  difficulty: RealQuestionDifficulty,
  official?: { exam: string; held: string },
): RealQuestionPilotItem {
  return {
    pilotId: `QUAL-001-E0:${String(index).padStart(2, "0")}`,
    questionText,
    source: {
      publisher: "Testbook",
      url: `https://testbook.com/question-answer/${slug}`,
      provenance: official ? "OFFICIAL_EXAM" : "TRUSTED_PLATFORM",
      ...official,
    },
    difficulty,
    knownRate,
    knownValue,
    targetRate,
    detailMode: modes[(index - 1) % modes.length]!,
    locale: "en",
    contextKind: "abstract",
    contextLabel: "number",
    semanticUnit: "abstract-number",
    reviewerNotes: [
      "Question text is preserved from the visible source-page heading.",
      official
        ? "The source page explicitly marks this as previously asked in an official paper."
        : "The source page is a trusted-platform question-bank item; it does not state official-paper provenance.",
    ],
  };
}

export const REAL_QUESTION_PILOT_CORPUS: readonly RealQuestionPilotItem[] = [
  item(1, "1/6 of a number is 53. What is 57% of that number?", "16-of-a-number-is-53-what-is-57-of-that-number--634e1b899577774fff4f908b", 100 / 6, 53, 57, "Medium", { exam: "ACC 127 SER", held: "Aug 2022" }),
  item(2, "200% of a number is 140. Then what is 160% of that number?", "200-of-a-number-is-140-then-what-is-160-of-that--625da9cbe3277fe1252c7abe", 200, 140, 160, "Medium"),
  item(3, "20% of a number is 100. What is the value of 120% of that number?", "20-of-a-number-is-100-what-is-the-value-of-120--66328719cee6c4297bdfda45", 20, 100, 120, "Easy"),
  item(4, "20% of a number is 34. What is 50% of that number?", "20-of-a-number-is-34-what-is-50-of-that-number--69b3e29ae35703b58448fe9e", 20, 34, 50, "Easy"),
  item(5, "20% of a number is 800. What is 45% of that number?", "20-of-a-number-is-800-what-is-45-of-that-number--69533e64c213960026904258", 20, 800, 45, "Easy"),
  item(6, "25% of a number is 1320. Find 35% of the same number.", "25-of-a-number-is-1320-find-35-of-the-same-numb--6355799b56fef61ed42e49ca", 25, 1320, 35, "Easy"),
  item(7, "25% of a number is 60. What is the number?", "25-of-a-number-is-60-what-is-the-number--69ca12ba25bb042c0fd0ef8e", 25, 60, 100, "Easy"),
  item(8, "25% of a number is 650. What is 80% of that number?", "25-of-a-number-is-650-what-is-80-of-that-number--68ac54a5fba1f0043f8aa5fc", 25, 650, 80, "Easy"),
  item(9, "29.5% of a number is 0.59. What is that number?", "29-5-of-a-number-is-0-59-what-is-that-number--62b445a10988fe295480d36c", 29.5, 0.59, 100, "Hard"),
  item(10, "30% of a number is 33. What is the number?", "30-of-a-number-is-33-what-is-the-number--637a54b588a9035bce3df2d3", 30, 33, 100, "Easy"),
  item(11, "40% of a number is 750. What is 60% of that number?", "40-of-a-number-is-750-what-is-60-of-that-number--63bec923c3c3285229600190", 40, 750, 60, "Easy"),
  item(12, "44% of a number is 798.6. What is 63% of that number?", "44-of-a-number-is-798-6-what-is-63-of-that-numb--627f8a3340c069a8eb35862c", 44, 798.6, 63, "Hard"),
  item(13, "48% of a number is 1248. What is the number?", "48-of-a-number-is-1248-what-is-the-number--68fa3ac3e5f755e6918215cc", 48, 1248, 100, "Easy"),
  item(14, "61% of a number is 9028. What is 46% of that number?", "61-of-a-number-is-9028-what-is-46-of-that-numbe--6321f268c372cfcbc173f7e4", 61, 9028, 46, "Medium"),
  item(15, "75% of a number is 57. What is that number?", "75-of-a-number-is-57-what-is-that-number--62550e1b68b617e2f2205319", 75, 57, 100, "Easy"),
  item(16, "82% of a number is 738. What is 90% of that number?", "82-of-a-number-is-738-what-is-90-of-that-number--627e57fa677d59ef099a23a4", 82, 738, 90, "Medium"),
  item(17, "Five - sixth of a number is 1440. What will 45% of that number be?", "five-sixth-of-a-number-is-1440-what-will-45-of--682e34d7672411890c9dfeb9", (5 / 6) * 100, 1440, 45, "Medium"),
  item(18, "\\(\\frac{2}{3}\\) rd of a number is 26. Find out 25% of that number.", "frac23rd-of-a-number-is-26-find-out-25--653e7d3a495f4a38a19a83fd", (2 / 3) * 100, 26, 25, "Medium"),
  item(19, "\\(\\frac{2}{3}\\) rd of a number is 36. Find out 25% of that number.", "frac23rd-of-a-number-is-36-find-out-25--6596b42f4bb0f68d86b4b42a", (2 / 3) * 100, 36, 25, "Medium"),
  item(20, "If 12% of a number is 60, then find the number.", "if-12-of-a-number-is-60-then-find-the-number--633f04a3ecf4e44eef7903c2", 12, 60, 100, "Easy"),
  item(21, "If 15% of a number is 45, what is 40% of that number?", "if-15-of-a-number-is-45-what-is-40-of-that-numb--69943b61a6267982ff15358d", 15, 45, 40, "Easy"),
  item(22, "If 15 percent of a number is 120, then what will be the 180 percent of that number?", "if-15-percent-of-a-number-is-120-then-what-will-b--6666d9d8982447590579854d", 15, 120, 180, "Medium"),
  item(23, "If 20% of a number is 50, then what is that number?", "if-20-of-a-number-is-50-then-what-is-thatn--693803311e39157a95e39568", 20, 50, 100, "Easy"),
  item(24, "If 20% of a number is 80, find 30% of that number:", "if-20-of-a-number-is-80-find-30-of-that-number--67e419eacfd508e7d6ddef8e", 20, 80, 30, "Easy"),
  item(25, "If 20 percent of a number is 200, then what will be 37.5 percent of the same number?", "if-20-percent-of-a-number-is-200-then-what-will-b--63a549a3820a3e13a6ebc2c1", 20, 200, 37.5, "Medium"),
  item(26, "If 23.5% of a number is 11.75, then what is the number?", "if-23-5-of-a-number-is-11-75-then-what-is-the-nu--627ebbe7677d59ef09a413ab", 23.5, 11.75, 100, "Hard"),
  item(27, "If 24% of a number is 39, then what is the number?", "if-24-of-a-number-is-39-then-what-is-the-number--62b599abb640a91aa1476349", 24, 39, 100, "Medium"),
  item(28, "If 25% of a number is 15, then what is the number?", "if-25-of-a-number-is-15-then-what-is-the-number--6946b94cce58db12afaf10c2", 25, 15, 100, "Easy"),
  item(29, "If 25% of a number is 45, what is 75% of the same number?", "if-25-of-a-number-is-45-what-is-75-of-the-same--69ca0d2a897d4f7127d1c748", 25, 45, 75, "Easy"),
  item(30, "If 25% of a number is 80, what is 40% of that number?", "if-25-of-a-number-is-80-what-is-40-of-that-numb--699e7fdf8b586326710bfaf8", 25, 80, 40, "Easy"),
  item(31, "If 25 percent of a number is 60, then what is 120 percent of that number?", "if-25-percent-of-a-number-is-60-then-what-is-120--639184d6dc9fe60e4fde7278", 25, 60, 120, "Medium"),
  item(32, "If 2.5 percent of a number is 8, what is that number ?", "if-2-5-percent-of-a-number-is-8-what-is-that-numb--6930267a30d42fe47bcf1292", 2.5, 8, 100, "Medium"),
  item(33, "If 27.5% of a number is 11, then the number is:", "if-27-5-of-a-number-is-11-then-the-number-isnb--62b4a57c7e89d500161adf36", 27.5, 11, 100, "Medium"),
  item(34, "If 28% of a number is 20, then what is the value of 49% of the same number ?", "if-28-of-a-number-is-20-then-what-is-the-value-o--62791f1e4c574d5a0c62d7a0", 28, 20, 49, "Medium"),
  item(35, "If 30% of a number is 12.6, find the number?", "if-30-of-a-number-is-12-6-find-the-number--63709e94088371a808255c72", 30, 12.6, 100, "Medium"),
  item(36, "If 30% of a number is 23.7, what is the value of 60% of that number?", "if-30-of-a-number-is-23-7-what-is-the-value-of-6--6900083871822586d252f2d2", 30, 23.7, 60, "Medium"),
  item(37, "If 35% of a number is 63, then what is the number?", "if-35-of-a-number-is-63-then-what-is-thenu--64c75b1ef66d7ec74688e44f", 35, 63, 100, "Easy"),
  item(38, "If 40% of a number is 800 then the number is:", "if-40-of-a-number-is-800-then-the-number-is--6273f2c0b782188c45174b21", 40, 800, 100, "Easy"),
  item(39, "If 40% of a number is 80, what is the number?", "if-40-of-a-number-is-80-what-is-the-number--698721ecee4962da39965f36", 40, 80, 100, "Easy"),
  item(40, "If 50 percent of a number is 80, then what will be the 250 percent of that number?", "if-50-percent-of-a-number-is-80-then-what-will-be--64a18214532afb5e8b3275f0", 50, 80, 250, "Medium"),
  item(41, "If 5% of a number is 22.50, find the number.", "if-5-of-a-number-is-22-50-find-the-number--66ab9050fe14059666380be2", 5, 22.5, 100, "Medium"),
  item(42, "If 60% of a number is 48, what is the number?", "if-60-of-a-number-is-48-what-is-the-number--699f25e7464d24081ad1f627", 60, 48, 100, "Easy"),
  item(43, "If 70% of a number is 0.35, then find 120% of that number.", "if-70-of-a-number-is-0-35-then-find-120-of-that--66c891a701534ba2f3942892", 70, 0.35, 120, "Hard"),
  item(44, "If one­ - fourth of a number is 72, then what will be its two­ - thirds?", "if-one-fourth-of-a-number-is-72-then-what--66acb28892c897a4e2b3dba7", 25, 72, (2 / 3) * 100, "Medium"),
  item(45, "If one third of a number is 10, then what is 50% of that number?", "if-one-third-of-a-number-is-10-then-what-is-50-o--686f723955a96dc9db7b3e72", 100 / 3, 10, 50, "Medium"),
  item(46, "If two-third of a number is 84, then what is 45% of the number?", "if-two-third-of-a-number-is-84-then-what-is-45-o--648dbd226ffcbeda4cb91c8a", (2 / 3) * 100, 84, 45, "Medium"),
  item(47, "One half of a number is 96. What is 67% of this number?", "one-half-of-a-number-is-96-what-is-67-of-this-nu--68c25c7a48d9f7923f3f23dc", 50, 96, 67, "Medium"),
  item(48, "One-Seventh of a number is 51. What will be. 64% of that number?", "one-seventh-of-a-number-is-51-what-will-be--63b1c69e43ab9a1ea62d832a", 100 / 7, 51, 64, "Hard"),
  item(49, "One-third of a number is 22. What will be the 65% of that number?", "one-third-of-a-number-is-22-what-will-be-the-65--69975d6fab3b87266409ea2f", 100 / 3, 22, 65, "Medium"),
  item(50, "One-third of a number is 96. What will 40% of that number be?", "one-third-of-a-number-is-96-what-will-be-40-of-that--682e35a747a9357912788eca", 100 / 3, 96, 40, "Medium"),
] as const;

export const REAL_QUESTION_REVIEW_NOTES = {
  corpusSelection:
    "Exact-family questions were selected from Testbook's public question sitemap and frozen from each visible question heading.",
  provenanceLimitation:
    "Only one selected page explicitly states prior official-paper provenance. The remaining items are retained as trusted-platform questions, not represented as official PYQs.",
  contextLimitation:
    "The exact-family source pool is overwhelmingly abstract-number wording. It does not provide the requested money, count, or continuous-context distribution without expanding into different task kinds.",
  repairPolicy:
    "No question wording, language asset, realism policy, or production layer is changed by this pilot.",
} as const;
