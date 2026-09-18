import { ENV_CP020_REVIEW_V1 } from "./env-cp020-review-generator-v1";
import type { EnvCp020ReviewQuestion } from "./env-cp020-review-types";

type Replacement = Pick<EnvCp020ReviewQuestion, "stem" | "options" | "correctIndex" | "explanation" | "sourceFactIds" | "sourceCpIds">;

const REPLACEMENTS: Record<string, Replacement> = {
  "ENV-CP020-V1-045": {
    stem: "Which set is fully correct?",
    options: [
      "Primary succession—bare substrate; NAPCC—national climate action",
      "Primary succession—soil already retained; NAPCC—wildlife trade",
      "Secondary succession—no soil; NAPCC—Ramsar listing",
      "Succession—pollution monitoring; NAPCC—tiger census",
    ],
    correctIndex: 0,
    explanation: "Primary succession begins on newly exposed substrate without developed soil, while NAPCC is India's national climate-action framework.",
    sourceFactIds: ["env-cp002-v2-primary", "env-cp014-v2-napcc-2008"],
    sourceCpIds: ["ENV-CP-002", "ENV-CP-014"],
  },
  "ENV-CP020-V1-046": {
    stem: "Which pair correctly links a project-assessment tool with a species-conservation programme?",
    options: [
      "EIA—tiger census; Project Elephant—ozone monitoring",
      "EIA—pre-approval impact assessment; Project Elephant—habitats and corridors",
      "EIA—Ramsar designation; Project Elephant—hazardous-waste control",
      "EIA—wildlife trade; Project Elephant—air-quality standards",
    ],
    correctIndex: 1,
    explanation: "EIA examines likely project impacts before approval, while Project Elephant protects elephants together with habitats and movement corridors.",
    sourceFactIds: ["env-cp015-v2-eia-purpose", "env-cp008-v2-elephant-protection"],
    sourceCpIds: ["ENV-CP-015", "ENV-CP-008"],
  },
  "ENV-CP020-V1-047": {
    stem: "Which pair is correctly matched?",
    options: [
      "Chipko—prior environmental clearance; NAPCC—tiger reserves",
      "Chipko—solar-energy programme; NAPCC—wildlife trade",
      "Chipko—tree protection; NAPCC—eight-mission climate framework",
      "Chipko—wetland treaty; NAPCC—elephant corridors",
    ],
    correctIndex: 2,
    explanation: "Chipko is a citizen-led tree-protection movement, while the original NAPCC framework was organised around eight core climate missions.",
    sourceFactIds: ["env-cp016-v2-chipko", "env-cp014-v2-eight-missions"],
    sourceCpIds: ["ENV-CP-016", "ENV-CP-014"],
  },
  "ENV-CP020-V1-048": {
    stem: "Which sequence correctly connects four different Environment GK layers?",
    options: [
      "Succession—wildlife trade; EIA—tiger monitoring; Project Elephant—solar mission; Silent Valley—Rajasthan",
      "Succession—ozone depletion; EIA—Ramsar listing; Project Elephant—air standards; Silent Valley—Karnataka",
      "Succession—mercury control; EIA—forest census; Project Elephant—wetland treaty; Silent Valley—Assam",
      "Succession—community change; EIA—project assessment; Project Elephant—corridors; Silent Valley—Kerala",
    ],
    correctIndex: 3,
    explanation: "The sequence correctly links an ecological process, project-impact assessment, elephant landscape conservation and a major Kerala environmental movement.",
    sourceFactIds: ["env-cp002-v2-succession", "env-cp015-v2-eia-purpose", "env-cp008-v2-elephant-corridor", "env-cp016-v2-silent-valley"],
    sourceCpIds: ["ENV-CP-002", "ENV-CP-015", "ENV-CP-008", "ENV-CP-016"],
  },
};

export function generateEnvCp020ReviewV2(): readonly EnvCp020ReviewQuestion[] {
  return Object.freeze(
    ENV_CP020_REVIEW_V1.map((q) => {
      const replacement = REPLACEMENTS[q.id];
      const next = replacement ? { ...q, ...replacement } : q;
      return Object.freeze({
        ...next,
        id: q.id.replace("V1", "V2"),
      }) as EnvCp020ReviewQuestion;
    }),
  );
}

export const ENV_CP020_REVIEW_V2 = generateEnvCp020ReviewV2();
