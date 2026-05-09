import type {
  ExamProfileId,
  OptionMetadata,
} from "../core/generator-engine";
import type { QuantMotif } from "../motifs/types";
import {
  createReasoningStep,
  random,
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
  generationLevel?: number;
  profession?: string;
  age?: number;
  fatherId?: string;
  motherId?: string;
  spouseId?: string;
};

type KinshipEdgeType =
  | "PARENT_OF"
  | "SPOUSE_OF"
  | "SIBLING_OF";

type KinshipEdge = {
  from: string;
  to: string;
  type: KinshipEdgeType;
  inferred?: boolean;
};

type BloodRelationScenario = {
  members: Record<string, FamilyMember>;
  statements: string[];
  subjectId: string;
  targetId: string;
  relation: string;
  reasoningSteps: ReasoningStep[];
  graph?: FamilyGraph;
  mermaid?: string;
  codedSymbols?: Record<string, string>;
  optionValues?: string[];
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

const RELATION_OPERATOR_MAP = {
  "+": "mother of",
  "-": "father of",
  "×": "brother of",
  "/": "sister of",
} as const;

export class FamilyGraph {
  readonly nodes = new Map<
    string,
    FamilyMember
  >();

  readonly edges: KinshipEdge[] = [];

  addNode(member: FamilyMember) {
    this.nodes.set(member.id, {
      ...member,
    });
  }

  addEdge(
    from: string,
    to: string,
    type: KinshipEdgeType,
    inferred = false,
  ) {
    if (
      !this.nodes.has(from) ||
      !this.nodes.has(to) ||
      from === to
    ) {
      return;
    }

    if (
      this.edges.some(
        (edge) =>
          edge.from === from &&
          edge.to === to &&
          edge.type === type,
      )
    ) {
      return;
    }

    this.edges.push({
      from,
      to,
      type,
      inferred,
    });

    if (
      type === "SPOUSE_OF" ||
      type === "SIBLING_OF"
    ) {
      this.edges.push({
        from: to,
        to: from,
        type,
        inferred,
      });
    }
  }

  inferImplicitEdges() {
    const spouseEdges =
      this.edges.filter(
        (edge) =>
          edge.type === "SPOUSE_OF",
      );
    const parentEdges =
      this.edges.filter(
        (edge) =>
          edge.type === "PARENT_OF",
      );

    for (const spouse of spouseEdges) {
      for (const parent of parentEdges) {
        if (spouse.to === parent.from) {
          this.addEdge(
            spouse.from,
            parent.to,
            "PARENT_OF",
            true,
          );
        }
      }
    }

    const members = [
      ...this.nodes.values(),
    ];
    for (const left of members) {
      for (const right of members) {
        if (left.id === right.id) {
          continue;
        }

        const sameParents =
          left.fatherId &&
          left.fatherId ===
            right.fatherId &&
          left.motherId &&
          left.motherId ===
            right.motherId;

        if (sameParents) {
          this.addEdge(
            left.id,
            right.id,
            "SIBLING_OF",
            true,
          );
        }
      }
    }
  }

  getParents(memberId: string) {
    return this.edges
      .filter(
        (edge) =>
          edge.type === "PARENT_OF" &&
          edge.to === memberId,
      )
      .map((edge) => edge.from);
  }

  hasEdge(
    from: string,
    to: string,
    type: KinshipEdgeType,
  ) {
    return this.edges.some(
      (edge) =>
        edge.from === from &&
        edge.to === to &&
        edge.type === type,
    );
  }

  validate() {
    const issues: string[] = [];

    for (const member of this.nodes.values()) {
      if (
        this.isAncestorOf(
          member.id,
          member.id,
        )
      ) {
        issues.push(
          `${member.name} cannot be their own ancestor.`,
        );
      }
    }

    for (const edge of this.edges) {
      const from = this.nodes.get(edge.from);
      const to = this.nodes.get(edge.to);

      if (!from || !to) {
        continue;
      }

      if (
        edge.type === "SIBLING_OF" &&
        from.generationLevel !==
          undefined &&
        to.generationLevel !==
          undefined &&
        from.generationLevel !==
          to.generationLevel
      ) {
        issues.push(
          "Siblings must share the same generation level.",
        );
      }

      if (
        edge.type === "SPOUSE_OF" &&
        from.gender === to.gender
      ) {
        issues.push(
          "Standard exam spouse edges require opposite genders.",
        );
      }
    }

    return {
      valid: issues.length === 0,
      issues,
    };
  }

  isAncestorOf(
    ancestorId: string,
    memberId: string,
    visited = new Set<string>(),
  ): boolean {
    if (visited.has(memberId)) {
      return false;
    }
    visited.add(memberId);

    const parents =
      this.getParents(memberId);
    if (parents.includes(ancestorId)) {
      return true;
    }

    return parents.some((parentId) =>
      this.isAncestorOf(
        ancestorId,
        parentId,
        visited,
      ),
    );
  }

  toMermaid() {
    const lines = [
      "```mermaid",
      "graph TD",
    ];

    for (const member of this.nodes.values()) {
      lines.push(
        `  ${member.id}["${member.name} (${member.gender === "male" ? "M" : "F"})"]`,
      );
    }

    for (const edge of this.edges) {
      if (
        edge.inferred ||
        (edge.type !== "PARENT_OF" &&
          edge.from > edge.to)
      ) {
        continue;
      }

      const label =
        edge.type === "PARENT_OF"
          ? "parent"
          : edge.type ===
              "SPOUSE_OF"
            ? "spouse"
            : "sibling";
      lines.push(
        `  ${edge.from} -->|${label}| ${edge.to}`,
      );
    }

    lines.push("```");
    return lines.join("\n");
  }
}

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
      generationLevel: 0,
    },
    gm: {
      id: "gm",
      name: pickedNames[1]!.name,
      gender: "female" as const,
      generationLevel: 0,
      spouseId: "gf",
    },
    father: {
      id: "father",
      name: pickedNames[2]!.name,
      gender: "male" as const,
      generationLevel: 1,
      fatherId: "gf",
      motherId: "gm",
      spouseId: "mother",
    },
    mother: {
      id: "mother",
      name: pickedNames[3]!.name,
      gender: "female" as const,
      generationLevel: 1,
      spouseId: "father",
    },
    aunt: {
      id: "aunt",
      name: pickedNames[4]!.name,
      gender: "female" as const,
      generationLevel: 1,
      fatherId: "gf",
      motherId: "gm",
      spouseId: "uncle",
    },
    uncle: {
      id: "uncle",
      name: pickedNames[5]!.name,
      gender: "male" as const,
      generationLevel: 1,
      spouseId: "aunt",
    },
    child: {
      id: "child",
      name: pickedNames[6]!.name,
      gender:
        random() > 0.5
          ? "male"
          : "female",
      generationLevel: 2,
      fatherId: "father",
      motherId: "mother",
    },
    cousin: {
      id: "cousin",
      name: pickedNames[7]!.name,
      gender:
        random() > 0.5
          ? "male"
          : "female",
      generationLevel: 2,
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

function createFamilyGraph(
  members: Record<string, FamilyMember>,
) {
  const graph = new FamilyGraph();

  for (const member of Object.values(
    members,
  )) {
    graph.addNode(member);
  }

  for (const member of Object.values(
    members,
  )) {
    if (member.fatherId) {
      graph.addEdge(
        member.fatherId,
        member.id,
        "PARENT_OF",
      );
    }
    if (member.motherId) {
      graph.addEdge(
        member.motherId,
        member.id,
        "PARENT_OF",
      );
    }
    if (member.spouseId) {
      graph.addEdge(
        member.id,
        member.spouseId,
        "SPOUSE_OF",
      );
    }
  }

  graph.inferImplicitEdges();
  return graph;
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
    case "rel-pointing":
      return {
        statements: [
          `Pointing to a photograph, ${mother.name} said, "He is the only son of my husband."`,
        ],
        subjectId: "child",
        targetId: "mother",
      };
    case "rel-chain":
      return {
        statements: [
          `${aunt.name} is the sister of ${father.name}.`,
          `${father.name} is the father of ${child.name}.`,
        ],
        subjectId: "aunt",
        targetId: "child",
      };
    case "rel-missing":
      return {
        statements: [
          `${gf.name} and ${gm.name} are a married couple.`,
          `${father.name} and ${aunt.name} are their children.`,
          `${father.name} is married to ${mother.name} and has one child, ${child.name}.`,
        ],
        subjectId: "father",
        targetId: "child",
      };
    case "rel-coded-eval":
      return {
        statements: [
          `In a coded relation language, $A + B$ means $A$ is mother of $B$, $A - B$ means $A$ is father of $B$, $A \\times B$ means $A$ is brother of $B$, and $A / B$ means $A$ is sister of $B$.`,
          `Evaluate $P \\times Q - R / S$.`,
        ],
        subjectId: "P",
        targetId: "S",
      };
    case "rel-coded-id":
      return {
        statements: [
          `In a coded relation language, $A + B$ means $A$ is mother of $B$, $A - B$ means $A$ is father of $B$, $A \\times B$ means $A$ is brother of $B$, and $A / B$ means $A$ is sister of $B$.`,
          `Which expression shows that $P$ is the grandmother of $T$?`,
        ],
        subjectId: "P",
        targetId: "T",
      };
    case "rel-puzzle-matrix":
      return {
        statements: [
          `${gf.name}, ${gm.name}, ${father.name}, ${mother.name}, ${child.name}, and ${cousin.name} belong to three generations.`,
          `There are two couples, and their professions are doctor, teacher, engineer, banker, artist, and lawyer.`,
          `${gf.name} is married to ${gm.name}; ${father.name} is married to ${mother.name}; ${child.name} is from the youngest generation.`,
        ],
        subjectId: "gf",
        targetId: "child",
      };
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
    "$P + Q - T$": [
      "$P - Q + T$",
      "$P + Q / T$",
      "$P / Q - T$",
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
  customDistractors?: string[],
) {
  const distractors =
    customDistractors ??
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
  if (motif.id === "rel-coded-id") {
    const relation = "$P + Q - T$";
    return {
      members: {},
      statements: [
        `In a coded relation language, $A + B$ means $A$ is mother of $B$, $A - B$ means $A$ is father of $B$, $A \\times B$ means $A$ is brother of $B$, and $A / B$ means $A$ is sister of $B$.`,
        `Which expression shows that $P$ is the grandmother of $T$?`,
      ],
      subjectId: "P",
      targetId: "T",
      relation,
      codedSymbols: RELATION_OPERATOR_MAP,
      optionValues: [
        "$P - Q + T$",
        "$P + Q / T$",
        "$P / Q - T$",
      ],
      reasoningSteps: [
        createReasoningStep(
          "transform",
          "$P + Q$ means $P$ is mother of $Q$.",
        ),
        createReasoningStep(
          "infer",
          "$Q - T$ means $Q$ is father of $T$; therefore $P$ is grandmother of $T$.",
        ),
      ],
    } satisfies BloodRelationScenario;
  }

  if (motif.id === "rel-coded-eval") {
    const relation = "uncle";
    return {
      members: {},
      statements: [
        `In a coded relation language, $A + B$ means $A$ is mother of $B$, $A - B$ means $A$ is father of $B$, $A \\times B$ means $A$ is brother of $B$, and $A / B$ means $A$ is sister of $B$.`,
        `Evaluate $P \\times Q - R / S$.`,
      ],
      subjectId: "P",
      targetId: "S",
      relation,
      codedSymbols: RELATION_OPERATOR_MAP,
      reasoningSteps: [
        createReasoningStep(
          "transform",
          "$P \\times Q$ means $P$ is brother of $Q$.",
        ),
        createReasoningStep(
          "transform",
          "$Q - R$ means $Q$ is father of $R$.",
        ),
        createReasoningStep(
          "infer",
          "$R / S$ means $R$ is sister of $S$, so $Q$ is also father of $S$ and $P$ is the uncle of $S$.",
        ),
      ],
    } satisfies BloodRelationScenario;
  }

  const members =
    createFamilyMemberMap();
  const graph =
    createFamilyGraph(members);
  const validation = graph.validate();

  if (!validation.valid) {
    throw new Error(
      `Invalid family graph: ${validation.issues.join("; ")}`,
    );
  }

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
    graph,
    mermaid: graph.toMermaid(),
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
  if (
    scenario.members &&
    Object.keys(scenario.members)
      .length === 0
  ) {
    return `${scenario.statements.join(" ")} What is the answer?`;
  }

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
  if (
    scenario.members &&
    Object.keys(scenario.members)
      .length === 0
  ) {
    return `${scenario.reasoningSteps
      .map((step) => step.detail)
      .join("\n")} Therefore, the answer is ${scenario.relation}.`;
  }

  const subject =
    scenario.members[
      scenario.subjectId
    ]!;
  const target =
    scenario.members[
      scenario.targetId
    ]!;

  return `Track the chain in order.\n${scenario.reasoningSteps
    .map((step) => step.detail)
    .join("\n")}\nTherefore, ${subject.name} is the ${scenario.relation} of ${target.name}.\n\nFamily tree:\n${scenario.mermaid ?? ""}`;
}
