import type {
  ExamProfileId,
  OptionMetadata,
} from "../core/generator-engine";
import type { QuantMotif } from "../motifs/types";
import {
  createReasoningStep,
  ReasoningStep,
  shuffle,
} from "../shared";

type FamilyGender =
  | "male"
  | "female";

type FamilyMember = {
  id: string;
  name: string;
  gender: FamilyGender;
  fatherId?: string;
  motherId?: string;
  spouseId?: string;
};

type BloodRelationScenario = {
  members: Record<string, FamilyMember>;
  statements: string[];
  subjectId: string;
  targetId: string;
  relation: string;
  reasoningSteps: ReasoningStep[];
};

const MALE_NAMES = [
  "Aman",
  "Rohit",
  "Nitin",
  "Arjun",
  "Vikas",
  "Sameer",
  "Kunal",
  "Tarun",
  "Mohan",
  "Raghav",
];

const FEMALE_NAMES = [
  "Anita",
  "Riya",
  "Pooja",
  "Neha",
  "Kavya",
  "Meera",
  "Sana",
  "Isha",
  "Tina",
  "Nisha",
];

function pickUniqueNames(
  count: number,
) {
  const malePool = shuffle(
    MALE_NAMES,
  );
  const femalePool = shuffle(
    FEMALE_NAMES,
  );
  const names: Array<{
    name: string;
    gender: FamilyGender;
  }> = [];

  for (let index = 0; index < count; index++) {
    if (index % 2 === 0) {
      names.push({
        name:
          malePool.pop() ??
          `Male${index}`,
        gender: "male",
      });
    } else {
      names.push({
        name:
          femalePool.pop() ??
          `Female${index}`,
        gender: "female",
      });
    }
  }

  return shuffle(names);
}

function createFamilyMemberMap(): Record<
  string,
  FamilyMember
> {
  const pickedNames =
    pickUniqueNames(8);

  return {
    gf: {
      id: "gf",
      name: pickedNames[0]!.name,
      gender: "male" as const,
    },
    gm: {
      id: "gm",
      name: pickedNames[1]!.name,
      gender: "female" as const,
      spouseId: "gf",
    },
    father: {
      id: "father",
      name: pickedNames[2]!.name,
      gender: "male" as const,
      fatherId: "gf",
      motherId: "gm",
      spouseId: "mother",
    },
    mother: {
      id: "mother",
      name: pickedNames[3]!.name,
      gender: "female" as const,
      spouseId: "father",
    },
    aunt: {
      id: "aunt",
      name: pickedNames[4]!.name,
      gender: "female" as const,
      fatherId: "gf",
      motherId: "gm",
      spouseId: "uncle",
    },
    uncle: {
      id: "uncle",
      name: pickedNames[5]!.name,
      gender: "male" as const,
      spouseId: "aunt",
    },
    child: {
      id: "child",
      name: pickedNames[6]!.name,
      gender:
        Math.random() > 0.5
          ? "male"
          : "female",
      fatherId: "father",
      motherId: "mother",
    },
    cousin: {
      id: "cousin",
      name: pickedNames[7]!.name,
      gender:
        Math.random() > 0.5
          ? "male"
          : "female",
      fatherId: "uncle",
      motherId: "aunt",
    },
  };
}

function relationByGender(
  maleLabel: string,
  femaleLabel: string,
  member: FamilyMember,
) {
  return member.gender === "male"
    ? maleLabel
    : femaleLabel;
}

function getParents(
  members: Record<string, FamilyMember>,
  memberId: string,
) {
  const member = members[memberId];

  if (!member) {
    return [];
  }

  return [
    member.fatherId,
    member.motherId,
  ].filter(
    (parentId): parentId is string =>
      Boolean(parentId),
  );
}

function isSibling(
  members: Record<string, FamilyMember>,
  firstId: string,
  secondId: string,
) {
  if (firstId === secondId) {
    return false;
  }

  const first = members[firstId];
  const second = members[secondId];

  return Boolean(
    first &&
      second &&
      first.fatherId &&
      first.fatherId ===
        second.fatherId &&
      first.motherId &&
      first.motherId ===
        second.motherId,
  );
}

function getBloodRelation(
  members: Record<string, FamilyMember>,
  subjectId: string,
  targetId: string,
) {
  const subject = members[subjectId];
  const target = members[targetId];

  if (!subject || !target) {
    return "relative";
  }

  if (subject.spouseId === targetId) {
    return relationByGender(
      "husband",
      "wife",
      subject,
    );
  }

  if (
    getParents(members, targetId).includes(
      subjectId,
    )
  ) {
    return relationByGender(
      "father",
      "mother",
      subject,
    );
  }

  if (
    getParents(members, subjectId).includes(
      targetId,
    )
  ) {
    return relationByGender(
      "son",
      "daughter",
      subject,
    );
  }

  if (
    isSibling(
      members,
      subjectId,
      targetId,
    )
  ) {
    return relationByGender(
      "brother",
      "sister",
      subject,
    );
  }

  const grandparents =
    getParents(members, targetId).flatMap(
      (parentId) =>
        getParents(
          members,
          parentId,
        ),
    );

  if (
    grandparents.includes(subjectId)
  ) {
    return relationByGender(
      "grandfather",
      "grandmother",
      subject,
    );
  }

  const subjectParents =
    getParents(members, subjectId);

  for (const parentId of subjectParents) {
    if (
      isSibling(
        members,
        parentId,
        targetId,
      )
    ) {
      return relationByGender(
        "nephew",
        "niece",
        subject,
      );
    }
  }

  const targetParents =
    getParents(members, targetId);

  for (const parentId of targetParents) {
    if (
      isSibling(
        members,
        subjectId,
        parentId,
      )
    ) {
      return relationByGender(
        "uncle",
        "aunt",
        subject,
      );
    }
  }

  if (
    subjectParents.some((parentId) =>
      targetParents.includes(parentId),
    )
  ) {
    return relationByGender(
      "brother",
      "sister",
      subject,
    );
  }

  if (
    subjectParents.length &&
    targetParents.length &&
    subjectParents.some((parentId) =>
      targetParents.some((targetParentId) =>
        isSibling(
          members,
          parentId,
          targetParentId,
        ),
      ),
    )
  ) {
    return "cousin";
  }

  return "relative";
}

function buildBloodRelationStatements(
  members: Record<string, FamilyMember>,
  motif: QuantMotif,
) {
  const father = members.father!;
  const mother = members.mother!;
  const child = members.child!;
  const aunt = members.aunt!;
  const uncle = members.uncle!;
  const cousin = members.cousin!;
  const gf = members.gf!;
  const gm = members.gm!;

  switch (motif.id) {
    case "direct_family_relation":
      return {
        statements: [
          `${father.name} is the father of ${child.name}.`,
        ],
        subjectId: "father",
        targetId: "child",
      };
    case "generation_gap_reasoning":
      return {
        statements: [
          `${gf.name} is the father of ${father.name}.`,
          `${father.name} is the father of ${child.name}.`,
        ],
        subjectId: "gf",
        targetId: "child",
      };
    case "gender_based_inference":
      return {
        statements: [
          `${child.name} is the ${relationByGender("son", "daughter", child)} of ${mother.name}.`,
          `${mother.name} is the sister of ${aunt.name}.`,
        ],
        subjectId: "child",
        targetId: "aunt",
      };
    case "conditional_family_inference":
      return {
        statements: [
          `${father.name} is the husband of ${mother.name}.`,
          `${aunt.name} is the sister of ${father.name}.`,
          `${cousin.name} is the child of ${aunt.name}.`,
        ],
        subjectId: "cousin",
        targetId: "mother",
      };
    case "circular_relation_chain":
      return {
        statements: [
          `${uncle.name} is the husband of ${aunt.name}.`,
          `${aunt.name} is the sister of ${father.name}.`,
          `${father.name} is the father of ${child.name}.`,
        ],
        subjectId: "uncle",
        targetId: "child",
      };
    case "indirect_relation_deduction":
    default:
      return {
        statements: [
          `${gm.name} is the mother of ${father.name}.`,
          `${father.name} is the father of ${child.name}.`,
          `${aunt.name} is the mother of ${cousin.name}.`,
          `${aunt.name} is the sister of ${father.name}.`,
        ],
        subjectId: "cousin",
        targetId: "child",
      };
  }
}

function buildBloodRelationReasoningSteps(
  members: Record<string, FamilyMember>,
  subjectId: string,
  targetId: string,
  motif: QuantMotif,
) {
  const subject = members[subjectId]!;
  const target = members[targetId]!;
  const steps: ReasoningStep[] = [
    createReasoningStep(
      "compare",
      `Track how ${subject.name} is connected to ${target.name} through the family chain.`,
    ),
  ];

  if (
    motif.inferenceStyle ===
    "conditional"
  ) {
    steps.push(
      createReasoningStep(
        "filter",
        "Use the condition or marriage clue before fixing the final blood relation.",
      ),
    );
  }

  if (
    motif.inferenceStyle === "hidden"
  ) {
    steps.push(
      createReasoningStep(
        "infer",
        "Infer the indirect family link created by the intermediate relatives.",
      ),
    );
  }

  steps.push(
    createReasoningStep(
      "compare",
      `Name the exact relation of ${subject.name} to ${target.name}.`,
    ),
  );

  return steps;
}

function buildBloodRelationDistractors(
  relation: string,
) {
  const distractorMap: Record<
    string,
    string[]
  > = {
    father: [
      "uncle",
      "brother",
      "grandfather",
    ],
    mother: [
      "aunt",
      "sister",
      "grandmother",
    ],
    son: [
      "brother",
      "nephew",
      "cousin",
    ],
    daughter: [
      "sister",
      "niece",
      "cousin",
    ],
    brother: [
      "cousin",
      "uncle",
      "son",
    ],
    sister: [
      "cousin",
      "aunt",
      "daughter",
    ],
    grandfather: [
      "father",
      "uncle",
      "brother",
    ],
    grandmother: [
      "mother",
      "aunt",
      "sister",
    ],
    uncle: [
      "father",
      "brother",
      "cousin",
    ],
    aunt: [
      "mother",
      "sister",
      "cousin",
    ],
    nephew: [
      "son",
      "brother",
      "cousin",
    ],
    niece: [
      "daughter",
      "sister",
      "cousin",
    ],
    cousin: [
      "brother",
      "nephew",
      "uncle",
    ],
    relative: [
      "cousin",
      "uncle",
      "brother",
    ],
  };

  return (
    distractorMap[relation] ?? [
      "cousin",
      "uncle",
      "brother",
    ]
  );
}

export function buildBloodRelationOptions(
  relation: string,
) {
  const distractors =
    buildBloodRelationDistractors(
      relation,
    );
  const optionMetadata: OptionMetadata[] =
    [
      {
        value: relation,
        isCorrect: true,
      },
      ...distractors.map(
        (distractor) => ({
          value: distractor,
          isCorrect: false,
          distractorType:
            "wrongIntermediateValue" as const,
          likelyMistake:
            "Stopped the family chain too early or chose a nearby relation.",
          reasoningTrap:
            "Common family-chain confusion trap.",
        }),
      ),
    ];
  const shuffled = shuffle(
    optionMetadata,
  );

  return {
    options: shuffled.map(
      (option) => option.value,
    ),
    correct: shuffled.findIndex(
      (option) => option.isCorrect,
    ),
    optionMetadata: shuffled,
  };
}

export function createBloodRelationScenario(
  motif: QuantMotif,
) {
  const members =
    createFamilyMemberMap();
  const scenario =
    buildBloodRelationStatements(
      members,
      motif,
    );
  const relation =
    getBloodRelation(
      members,
      scenario.subjectId,
      scenario.targetId,
    );

  return {
    members,
    ...scenario,
    relation,
    reasoningSteps:
      buildBloodRelationReasoningSteps(
        members,
        scenario.subjectId,
        scenario.targetId,
        motif,
      ),
  } satisfies BloodRelationScenario;
}

export function buildBloodRelationStem(
  scenario: ReturnType<
    typeof createBloodRelationScenario
  >,
  examProfile: ExamProfileId,
  wordingStyle:
    | "concise"
    | "balanced"
    | "inference-heavy",
) {
  const subject =
    scenario.members[
      scenario.subjectId
    ]!;
  const target =
    scenario.members[
      scenario.targetId
    ]!;
  const intro =
    wordingStyle === "concise"
      ? "In a family,"
      : wordingStyle ===
          "inference-heavy"
        ? "Study the following family clues carefully:"
        : "Consider the following family information:";

  void examProfile;

  return `${intro} ${scenario.statements.join(" ")} How is ${subject.name} related to ${target.name}?`;
}

export function buildBloodRelationExplanation(
  scenario: ReturnType<
    typeof createBloodRelationScenario
  >,
) {
  const subject =
    scenario.members[
      scenario.subjectId
    ]!;
  const target =
    scenario.members[
      scenario.targetId
    ]!;

  return `Track the chain in order. ${scenario.reasoningSteps
    .map((step) => step.detail)
    .join(" ")} Therefore, ${subject.name} is the ${scenario.relation} of ${target.name}.`;
}
