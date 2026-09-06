import { deterministicPick, deterministicShuffle } from "../deterministic";
import { assertKnowledgeQuestionValid } from "../question-validation";
import {
  COM001_STORAGE_DEVICE_PROFILES,
  solveStorageProfileConstraints,
  type Com001StorageProfileConstraints,
} from "./com001-storage-device-profiles";
import { generateCom001ReviewQuestion } from "./com001-review-synthesis";
import type { Com001ReviewQuestion } from "./com001-review-types";

export type Com001HumanReviewV2Candidate = Com001ReviewQuestion & {
  humanReviewV2: {
    status: "REMEDIATED_CANDIDATE" | "UNCHANGED_FROM_V1" | "BLOCKED_PENDING_MODEL";
    reason: string;
  };
};

function withReviewStatus(
  question: Com001ReviewQuestion,
  status: Com001HumanReviewV2Candidate["humanReviewV2"]["status"],
  reason: string,
): Com001HumanReviewV2Candidate {
  return {
    ...question,
    questionId: `${question.questionId}-V2CANDIDATE`,
    humanReviewV2: { status, reason },
  };
}

function extractQl002Layer(stem: string) {
  return stem.match(/classified as (.+)\?$/u)?.[1]
    ?? stem.match(/belongs to (.+)\?$/u)?.[1]
    ?? stem.match(/^Identify the (.+) item from/u)?.[1];
}

function remediateQl002(question: Com001ReviewQuestion) {
  const layer = extractQl002Layer(question.stem);
  if (!layer) throw new Error(`${question.questionId}: unable to extract QL-002 layer`);
  return withReviewStatus(
    {
      ...question,
      explanation: `The correct classification for ${question.canonicalAnswer} is ${layer}. The other options belong to different memory or storage categories.`,
    },
    "REMEDIATED_CANDIDATE",
    "Grammar-safe explanation avoids subject-verb agreement errors for labels such as CPU registers.",
  );
}

function extractQl003Entity(stem: string) {
  return stem.match(/main function of (.+)\?$/u)?.[1]
    ?? stem.match(/purpose of (.+)\?$/u)?.[1]
    ?? stem.match(/^(.+) is primarily used for which/u)?.[1];
}

function remediateQl003(question: Com001ReviewQuestion) {
  const entity = extractQl003Entity(question.stem);
  if (!entity) throw new Error(`${question.questionId}: unable to extract QL-003 entity`);
  return withReviewStatus(
    {
      ...question,
      explanation: `${entity} ${question.canonicalAnswer}. Therefore, this option correctly states its main function.`,
    },
    "REMEDIATED_CANDIDATE",
    "Removes malformed 'is used to stores/holds' constructions while retaining question-specific explanation.",
  );
}

type Ql007TemplateV2 = {
  templateId: string;
  stem: string;
  constraints: Com001StorageProfileConstraints;
  explanation: (answer: string) => string;
};

const MAGNETIC_TAPE_BACKUP_TEMPLATE: Ql007TemplateV2 = {
  templateId: "magnetic-tape-backup",
  stem: "Which storage medium uses sequential access and is commonly used for backup and archival storage?",
  constraints: {
    medium: "magnetic",
    accessPattern: "sequential",
    removable: true,
    requiredRoles: ["backup", "archive"],
  },
  explanation: (answer) => `${answer} is sequential-access magnetic storage commonly used for backup and archiving. Therefore, ${answer} is correct.`,
};

const WORM_ARCHIVE_TEMPLATE: Ql007TemplateV2 = {
  templateId: "worm-archive",
  stem: "Which optical storage medium is designed for write-once archival retention?",
  constraints: {
    medium: "optical",
    removable: true,
    requiredRoles: ["archive", "write-once-retention"],
  },
  explanation: (answer) => `${answer} is designed for write-once retention and archival use. Therefore, ${answer} is correct.`,
};

const USB_BACKUP_TEMPLATE: Ql007TemplateV2 = {
  templateId: "usb-portable-backup",
  stem: "Which removable solid-state storage device supports random access and can be used to keep portable backup copies?",
  constraints: {
    medium: "solid-state",
    accessPattern: "random",
    removable: true,
    requiredRoles: ["backup"],
  },
  explanation: (answer) => `${answer} is removable solid-state storage with random access and can be used for portable backup copies. Therefore, ${answer} is correct.`,
};

// Magnetic tape receives the largest share because target-exam evidence directly
// tests its sequential-access/backup characteristics. WORM and USB remain
// secondary surfaces so the QL does not collapse to a one-object loop.
const QL007_TEMPLATES_V2: Ql007TemplateV2[] = [
  MAGNETIC_TAPE_BACKUP_TEMPLATE,
  MAGNETIC_TAPE_BACKUP_TEMPLATE,
  MAGNETIC_TAPE_BACKUP_TEMPLATE,
  WORM_ARCHIVE_TEMPLATE,
  USB_BACKUP_TEMPLATE,
];

const QL007_SURFACE_PROFILE_IDS = new Set([
  "storage-profile-magnetic-tape",
  "storage-profile-usb-flash",
  "storage-profile-worm-optical",
  "storage-profile-floppy",
  "storage-profile-sd-card",
]);

function generateQl007V2(seed: string): Com001HumanReviewV2Candidate {
  const template = deterministicPick(QL007_TEMPLATES_V2, `${seed}:template`);
  const matches = solveStorageProfileConstraints(template.constraints);
  if (matches.length !== 1) {
    throw new Error(`COM-001 QL-007 V2 ${template.templateId} resolved to ${matches.length} profiles`);
  }
  const target = matches[0]!;
  if (!QL007_SURFACE_PROFILE_IDS.has(target.profileId)) {
    throw new Error(`COM-001 QL-007 V2 target ${target.profileId} is not learner-surface eligible`);
  }
  const distractors = deterministicShuffle(
    COM001_STORAGE_DEVICE_PROFILES.filter(
      (profile) => profile.profileId !== target.profileId && QL007_SURFACE_PROFILE_IDS.has(profile.profileId),
    ),
    `${seed}:distractors`,
  ).slice(0, 3);
  if (distractors.length !== 3) throw new Error("COM-001 QL-007 V2 requires three familiar distractors");

  const records = deterministicShuffle(
    [
      { text: target.label, correct: true },
      ...distractors.map((profile) => ({ text: profile.label, correct: false })),
    ],
    `${seed}:options`,
  );
  const options = records.map((entry) => entry.text);
  const correctIndex = records.findIndex((entry) => entry.correct);
  const explanation = template.explanation(target.label);
  assertKnowledgeQuestionValid({
    stem: template.stem,
    explanation,
    options,
    correctIndex,
    canonicalAnswer: target.label,
  });

  return {
    questionId: `COM001-V2CANDIDATE-COM-001-QL-007-${seed}`,
    qlId: "COM-001-QL-007",
    stem: template.stem,
    options,
    correctIndex,
    canonicalAnswer: target.label,
    explanation,
    sourceIds: [...new Set(target.sourceRefs.map((entry) => entry.sourceId))],
    sourceFactIds: [],
    solverAuthority: "STORAGE_PROFILE_CONSTRAINTS",
    reviewOnly: true,
    runtimeRegistered: false,
    humanReviewV2: {
      status: "REMEDIATED_CANDIDATE",
      reason: "Uses PYQ-like backup/archive wording, excludes RDX from learner-facing options, and weights the SSC-backed magnetic-tape surface most heavily.",
    },
  };
}

export function generateCom001HumanReviewV2Candidate(input: { qlId: string; seed: string }) {
  if (input.qlId === "COM-001-QL-007") return generateQl007V2(input.seed);

  const v1 = generateCom001ReviewQuestion(input);
  if (input.qlId === "COM-001-QL-002") return remediateQl002(v1);
  if (input.qlId === "COM-001-QL-003") return remediateQl003(v1);
  if (input.qlId === "COM-001-QL-009") {
    return withReviewStatus(
      v1,
      "BLOCKED_PENDING_MODEL",
      "V2 must add an explicit SSC/traditional 1024-based exam convention alongside strict SI/IEC standards facts before QL-009 can be promoted.",
    );
  }
  return withReviewStatus(v1, "UNCHANGED_FROM_V1", "Wave 1 human review passed this QL without learner-facing changes.");
}
