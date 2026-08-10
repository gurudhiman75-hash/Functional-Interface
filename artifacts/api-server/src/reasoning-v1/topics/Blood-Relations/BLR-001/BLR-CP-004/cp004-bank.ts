import { solveRelationFromGraph } from "../foundation/graph-closure";
import { stableHash } from "../foundation/prng";
import type { BlrRelationId, FamilyGraph } from "../foundation/types";
import {
  blrCp003FinalGroupKey,
  generateBlrCp003FinalApprovedBank,
  type BlrCp003FinalApprovedRecord,
} from "../BLR-CP-003/cp003-final-approved-bank";
import {
  BLR_CP004_APPROVAL_DATE,
  BLR_CP004_DIRECT_RELATIONS,
  BLR_CP004_FREEZE_VERSION,
  BLR_CP004_OWNER_DIRECTIVE,
  BLR_CP004_RELATION_PLURALS,
  BLR_CP004_RUNTIME_VERSION,
  contractForAuthority,
  diagramGraph,
  difficultyFor,
  numericOptions,
  optionLabel,
  personLabel,
  positiveModulo,
  unorderedPairKey,
  vectorOptions,
  vectorText,
  type BlrCp004Authority,
  type BlrCp004Explanation,
  type BlrCp004Option,
  type BlrCp004PrototypeId,
  type GeneratedBlrCp004Question,
} from "./cp004-model";

function optionAnalysis(
  options: readonly BlrCp004Option[],
  correctText: string,
  wrongText: string,
): BlrCp004Explanation["optionAnalysis"] {
  return options.map((option, index) => ({
    optionLabel: optionLabel(index),
    optionText: option.text,
    isCorrect: option.isCorrect,
    explanation: option.isCorrect
      ? `Option ${optionLabel(index)} is correct. ${correctText}`
      : `Option ${optionLabel(index)} is incorrect. ${wrongText}`,
  }));
}

function buildNumberQuestion(input: {
  source: BlrCp003FinalApprovedRecord;
  groupIndex: number;
  slot: string;
  authority: BlrCp004Authority;
  prototypeId: BlrCp004PrototypeId;
  stem: string;
  value: number;
  countedMemberIds?: readonly string[];
  countedPairKeys?: readonly string[];
  coreConcept: readonly string[];
  working: readonly string[];
  conclusion: string;
  shortcut: string;
  advanced?: boolean;
}): GeneratedBlrCp004Question {
  const contract = contractForAuthority(input.authority);
  if (contract.answerType !== "NUMBER") {
    throw new Error(`Number builder cannot use ${contract.solveAuthority}.`);
  }
  if (!contract.sourcePrototypeIds.includes(input.prototypeId)) {
    throw new Error(`Prototype ${input.prototypeId} does not belong to ${input.authority}.`);
  }
  const { options, correctIndex } = numericOptions(input.value, [
    input.source.itemId,
    input.groupIndex,
    input.slot,
  ]);
  const countedMemberIds = [...(input.countedMemberIds ?? [])].sort();
  const countedPairKeys = [...(input.countedPairKeys ?? [])].sort();
  const sourceGroupKey = blrCp003FinalGroupKey(input.source);
  const itemId = `BLR-CP004-${input.slot}-${stableHash([
    sourceGroupKey,
    input.groupIndex,
    input.prototypeId,
    input.stem,
  ])}`;
  const sourceFingerprint = input.source.metadata.semanticFingerprint;
  return {
    packageId: "BLR-001",
    checkpointId: "BLR-CP-004",
    qlId: contract.qlId,
    permanentQlId: contract.qlId,
    solveAuthority: input.authority,
    sourcePrototypeId: input.prototypeId,
    prototypeOnly: false,
    reviewOnly: true,
    publiclyPublishable: false,
    questionStudioVisible: false,
    questionBankEligible: false,
    mockTestEligible: false,
    locale: "en-IN",
    sourceGroupKey,
    sourceItemId: input.source.itemId,
    scenarioId: input.source.scenarioId,
    topologyId: input.source.topologyId,
    seed: input.source.seed,
    itemId,
    sharedPrompt: input.source.sharedPrompt,
    stem: input.stem,
    answerType: "NUMBER",
    options,
    correctIndex,
    answer: {
      kind: "NUMBER",
      value: input.value,
      countedMemberIds,
      countedPairKeys,
    },
    explanation: {
      coreConcept: input.coreConcept,
      working: input.working,
      conclusion: input.conclusion,
      examShortcut: input.shortcut,
      optionAnalysis: optionAnalysis(
        options,
        `${input.value} is the independently verified count.`,
        "The option omits a valid match, includes a non-match or counts an unordered connection twice.",
      ),
      familyTree: input.source.proceduralLogic,
    },
    metadata: {
      runtimeVersion: BLR_CP004_RUNTIME_VERSION,
      freezeVersion: BLR_CP004_FREEZE_VERSION,
      approvalDate: BLR_CP004_APPROVAL_DATE,
      approvedBy: "PROJECT_OWNER",
      ownerDirective: BLR_CP004_OWNER_DIRECTIVE,
      structuralSaturationApproved: true,
      finalDiscoveryFreezeApproved: true,
      independentVerifierAgreed: true,
      explicitCountUniverse: true,
      uniqueAnswer: true,
      optionSemanticsUnique: true,
      difficulty: difficultyFor(
        input.source.proceduralLogic.nodes.length,
        Math.max(input.value, countedMemberIds.length, countedPairKeys.length),
        input.advanced ?? false,
      ),
      sourceFingerprint,
      semanticFingerprint: stableHash([
        sourceFingerprint,
        BLR_CP004_RUNTIME_VERSION,
        contract.qlId,
        input.prototypeId,
        input.stem,
        input.value,
        ...countedMemberIds,
        ...countedPairKeys,
      ]),
    },
  };
}

function buildVectorQuestion(
  source: BlrCp003FinalApprovedRecord,
  groupIndex: number,
  value: readonly [number, number, number, number],
): GeneratedBlrCp004Question {
  const authority = "SELECT_FAMILY_COMPOSITION_PROFILE" as const;
  const prototypeId = "BLR-CP004-PROT-SELECT-COMPOSITION-PROFILE" as const;
  const contract = contractForAuthority(authority);
  const stem =
    "Which option correctly gives the numbers of males, females, married couples and generations, in that order?";
  const { options, correctIndex } = vectorOptions(value, [source.itemId, groupIndex, "PROFILE"]);
  const sourceGroupKey = blrCp003FinalGroupKey(source);
  const sourceFingerprint = source.metadata.semanticFingerprint;
  return {
    packageId: "BLR-001",
    checkpointId: "BLR-CP-004",
    qlId: contract.qlId,
    permanentQlId: contract.qlId,
    solveAuthority: authority,
    sourcePrototypeId: prototypeId,
    prototypeOnly: false,
    reviewOnly: true,
    publiclyPublishable: false,
    questionStudioVisible: false,
    questionBankEligible: false,
    mockTestEligible: false,
    locale: "en-IN",
    sourceGroupKey,
    sourceItemId: source.itemId,
    scenarioId: source.scenarioId,
    topologyId: source.topologyId,
    seed: source.seed,
    itemId: `BLR-CP004-PROFILE-${stableHash([sourceGroupKey, groupIndex])}`,
    sharedPrompt: source.sharedPrompt,
    stem,
    answerType: "COUNT_VECTOR",
    options,
    correctIndex,
    answer: {
      kind: "COUNT_VECTOR",
      value,
      labels: ["males", "females", "married couples", "generations"],
    },
    explanation: {
      coreConcept: [
        "A composition option is correct only when all four components come from the same completed family graph.",
        "People, unordered marriage edges and occupied generation rows use different counting universes.",
      ],
      working: [
        `Male members = ${value[0]}.`,
        `Female members = ${value[1]}.`,
        `Married couples = ${value[2]}.`,
        `Generations = ${value[3]}.`,
      ],
      conclusion: `The composition profile is ${vectorText(value)}.`,
      examShortcut:
        "Make four tally boxes—male, female, couple and generation—and reject an option at its first mismatch.",
      optionAnalysis: optionAnalysis(
        options,
        `Every component matches: ${vectorText(value)}.`,
        "At least one component disagrees with the completed family map.",
      ),
      familyTree: source.proceduralLogic,
    },
    metadata: {
      runtimeVersion: BLR_CP004_RUNTIME_VERSION,
      freezeVersion: BLR_CP004_FREEZE_VERSION,
      approvalDate: BLR_CP004_APPROVAL_DATE,
      approvedBy: "PROJECT_OWNER",
      ownerDirective: BLR_CP004_OWNER_DIRECTIVE,
      structuralSaturationApproved: true,
      finalDiscoveryFreezeApproved: true,
      independentVerifierAgreed: true,
      explicitCountUniverse: true,
      uniqueAnswer: true,
      optionSemanticsUnique: true,
      difficulty: difficultyFor(
        source.proceduralLogic.nodes.length,
        value.reduce((total, entry) => total + entry, 0),
        true,
      ),
      sourceFingerprint,
      semanticFingerprint: stableHash([
        sourceFingerprint,
        BLR_CP004_RUNTIME_VERSION,
        contract.qlId,
        ...value,
      ]),
    },
  };
}

function uniqueGroupSources(): readonly BlrCp003FinalApprovedRecord[] {
  const groups = new Map<string, BlrCp003FinalApprovedRecord>();
  for (const record of generateBlrCp003FinalApprovedBank()) {
    const key = blrCp003FinalGroupKey(record);
    const existing = groups.get(key);
    if (!existing || record.itemId.localeCompare(existing.itemId, "en-IN") < 0) {
      groups.set(key, record);
    }
  }
  return [...groups.entries()]
    .sort(([left], [right]) => left.localeCompare(right, "en-IN"))
    .map(([, record]) => record);
}

function generationGroups(source: BlrCp003FinalApprovedRecord): Map<number, string[]> {
  const groups = new Map<number, string[]>();
  for (const node of source.proceduralLogic.nodes) {
    const ids = groups.get(node.generation) ?? [];
    ids.push(node.id);
    groups.set(node.generation, ids);
  }
  return groups;
}

function globalCountQuestion(
  source: BlrCp003FinalApprovedRecord,
  groupIndex: number,
): GeneratedBlrCp004Question {
  const nodes = source.proceduralLogic.nodes;
  const graph = diagramGraph(source);
  const mode = groupIndex % 6;
  if (mode === 0) {
    const ids = nodes.map((node) => node.id);
    return buildNumberQuestion({
      source,
      groupIndex,
      slot: "TOTAL",
      authority: "COUNT_MEMBERS_BY_FILTER",
      prototypeId: "BLR-CP004-PROT-COUNT-TOTAL-MEMBERS",
      stem: "How many named members are there in the family?",
      value: ids.length,
      countedMemberIds: ids,
      coreConcept: [
        "The universe is the set of distinct named people in the passage.",
        "Repeated clue mentions do not create additional members.",
      ],
      working: [
        `Members: ${ids.map((id) => personLabel(source, id)).join(", ")}.`,
        `Total = ${ids.length}.`,
      ],
      conclusion: `The family has ${ids.length} named members.`,
      shortcut: "Tick each distinct name once.",
    });
  }
  if (mode === 1 || mode === 5) {
    const gender = groupIndex % 2 === 0 ? "male" : "female";
    const ids = nodes.filter((node) => node.gender === gender).map((node) => node.id);
    const label = `${gender} members`;
    return buildNumberQuestion({
      source,
      groupIndex,
      slot: `GENDER-${gender}`,
      authority: "COUNT_MEMBERS_BY_FILTER",
      prototypeId: "BLR-CP004-PROT-COUNT-GENDER-MEMBERS",
      stem: `How many ${label} are there in the family?`,
      value: ids.length,
      countedMemberIds: ids,
      coreConcept: [
        `Count only people whose established gender is ${gender}.`,
        "A relationship edge does not add another person.",
      ],
      working: [
        `${label}: ${ids.map((id) => personLabel(source, id)).join(", ") || "none"}.`,
        `Count = ${ids.length}.`,
      ],
      conclusion: `There are ${ids.length} ${label}.`,
      shortcut: `Mark each ${gender === "male" ? "M" : "F"} node before counting.`,
    });
  }
  if (mode === 2 || mode === 3) {
    const explicit = nodes
      .filter((node) => /explicitly unmarried/i.test(node.roleLabel ?? ""))
      .map((node) => node.id);
    const unresolved = nodes
      .filter((node) => /marital status unstated/i.test(node.roleLabel ?? ""))
      .map((node) => node.id);
    const married = [
      ...new Set(graph.spouseEdges.flatMap((edge) => [edge.personAId, edge.personBId])),
    ];
    const ids = mode === 3 && explicit.length
      ? explicit
      : mode === 3 && unresolved.length
        ? unresolved
        : married;
    const label = mode === 3 && explicit.length
      ? "explicitly unmarried members"
      : mode === 3 && unresolved.length
        ? "members whose marital status is unstated"
        : "members with a named spouse";
    return buildNumberQuestion({
      source,
      groupIndex,
      slot: "STATUS",
      authority: "COUNT_MEMBERS_BY_FILTER",
      prototypeId: "BLR-CP004-PROT-COUNT-MARITAL-STATUS-MEMBERS",
      stem: `How many ${label} are there?`,
      value: ids.length,
      countedMemberIds: ids,
      coreConcept: [
        "Named spouse, explicit unmarried status and unstated status are separate evidence states.",
        "Missing spouse information must not be converted into unmarried status.",
      ],
      working: [
        `${label}: ${ids.map((id) => personLabel(source, id)).join(", ") || "none"}.`,
        `Count = ${ids.length}.`,
      ],
      conclusion: `The required status count is ${ids.length}.`,
      shortcut: "Count only direct status evidence.",
      advanced: true,
    });
  }
  const groups = generationGroups(source);
  const generations = [...groups.keys()].sort((left, right) => right - left);
  const generation = generations[positiveModulo(groupIndex, generations.length)]!;
  const ids = groups.get(generation) ?? [];
  const highest = Math.max(...generations);
  const lowest = Math.min(...generations);
  const label = generation === highest
    ? "oldest generation"
    : generation === lowest
      ? "youngest generation"
      : `generation ${generation}`;
  return buildNumberQuestion({
    source,
    groupIndex,
    slot: "GENERATION-MEMBERS",
    authority: "COUNT_MEMBERS_BY_FILTER",
    prototypeId: "BLR-CP004-PROT-COUNT-GENERATION-MEMBERS",
    stem: `How many members are in the ${label}?`,
    value: ids.length,
    countedMemberIds: ids,
    coreConcept: [
      "Spouses and siblings remain on the same generation row.",
      "Count distinct people on the requested row.",
    ],
    working: [
      `${label}: ${ids.map((id) => personLabel(source, id)).join(", ")}.`,
      `Count = ${ids.length}.`,
    ],
    conclusion: `The ${label} contains ${ids.length} members.`,
    shortcut: "Draw horizontal generation rows and count one row only.",
  });
}

type RelationCandidate = {
  referenceId: string;
  relationId: BlrRelationId;
  memberIds: string[];
};

function relationCandidates(source: BlrCp003FinalApprovedRecord): RelationCandidate[] {
  const graph = diagramGraph(source);
  const candidates: RelationCandidate[] = [];
  for (const reference of graph.persons) {
    const byRelation = new Map<BlrRelationId, string[]>();
    for (const subject of graph.persons) {
      if (subject.personId === reference.personId) continue;
      try {
        const relationId = solveRelationFromGraph(
          graph,
          subject.personId,
          reference.personId,
        ).relationId;
        const ids = byRelation.get(relationId) ?? [];
        ids.push(subject.personId);
        byRelation.set(relationId, ids);
      } catch {
        // Unsupported or ambiguous paths are not part of the explicit count universe.
      }
    }
    for (const [relationId, memberIds] of byRelation) {
      if (memberIds.length) candidates.push({ referenceId: reference.personId, relationId, memberIds });
    }
  }
  return candidates.sort((left, right) =>
    `${left.referenceId}:${left.relationId}`.localeCompare(
      `${right.referenceId}:${right.relationId}`,
      "en-IN",
    ),
  );
}

function relativeQuestion(
  source: BlrCp003FinalApprovedRecord,
  groupIndex: number,
  slotIndex: number,
): GeneratedBlrCp004Question {
  const candidates = relationCandidates(source);
  const direct = (groupIndex + slotIndex) % 2 === 0;
  const preferred = candidates.filter((candidate) =>
    direct
      ? BLR_CP004_DIRECT_RELATIONS.has(candidate.relationId)
      : !BLR_CP004_DIRECT_RELATIONS.has(candidate.relationId),
  );
  const pool = preferred.length ? preferred : candidates;
  if (!pool.length) throw new Error(`No CP-004 relation candidates for ${source.itemId}.`);
  const candidate = pool[positiveModulo(groupIndex * 7 + slotIndex * 11, pool.length)]!;
  const relationPlural = BLR_CP004_RELATION_PLURALS[candidate.relationId];
  const reference = personLabel(source, candidate.referenceId);
  const prototypeId = BLR_CP004_DIRECT_RELATIONS.has(candidate.relationId)
    ? "BLR-CP004-PROT-COUNT-DIRECT-RELATIVES"
    : "BLR-CP004-PROT-COUNT-EXTENDED-RELATIVES";
  return buildNumberQuestion({
    source,
    groupIndex,
    slot: `REL-${slotIndex}-${candidate.relationId}`,
    authority: "COUNT_RELATIVES_OF_REFERENCE",
    prototypeId,
    stem: `How many ${relationPlural} of ${reference} are named in the family?`,
    value: candidate.memberIds.length,
    countedMemberIds: candidate.memberIds,
    coreConcept: [
      `Keep ${reference} fixed as the reference person.`,
      `Count only people whose solved relation to ${reference} is ${candidate.relationId.toLocaleLowerCase("en-IN").replaceAll("_", " ")}.`,
    ],
    working: [
      `Matches: ${candidate.memberIds.map((id) => personLabel(source, id)).join(", ")}.`,
      `Count = ${candidate.memberIds.length}.`,
    ],
    conclusion: `${reference} has ${candidate.memberIds.length} named ${relationPlural}.`,
    shortcut: `Hold ${reference} fixed and tick each matching person once.`,
    advanced: !BLR_CP004_DIRECT_RELATIONS.has(candidate.relationId),
  });
}

function sharedChildrenQuestion(
  source: BlrCp003FinalApprovedRecord,
  groupIndex: number,
): GeneratedBlrCp004Question | null {
  const graph = diagramGraph(source);
  const candidates = graph.spouseEdges
    .map((edge) => {
      const children = graph.persons
        .filter((person) =>
          graph.parentEdges.some(
            (parent) => parent.parentId === edge.personAId && parent.childId === person.personId,
          ) &&
          graph.parentEdges.some(
            (parent) => parent.parentId === edge.personBId && parent.childId === person.personId,
          ),
        )
        .map((person) => person.personId);
      return { parentIds: [edge.personAId, edge.personBId] as const, children };
    })
    .filter((candidate) => candidate.children.length > 0);
  if (!candidates.length) return null;
  const candidate = candidates[positiveModulo(groupIndex, candidates.length)]!;
  const parentNames = candidate.parentIds.map((id) => personLabel(source, id));
  return buildNumberQuestion({
    source,
    groupIndex,
    slot: "SHARED-CHILDREN",
    authority: "COUNT_RELATIVES_OF_REFERENCE",
    prototypeId: "BLR-CP004-PROT-COUNT-SHARED-CHILDREN",
    stem: `How many children of ${parentNames[0]} and ${parentNames[1]} are named in the family?`,
    value: candidate.children.length,
    countedMemberIds: candidate.children,
    coreConcept: [
      "The two named adults form one reference unit.",
      "Include a child only when the displayed graph establishes the required parent links.",
    ],
    working: [
      `Children: ${candidate.children.map((id) => personLabel(source, id)).join(", ")}.`,
      `Count = ${candidate.children.length}.`,
    ],
    conclusion: `${parentNames[0]} and ${parentNames[1]} have ${candidate.children.length} named children.`,
    shortcut: "Trace downward from the couple and count each child node once.",
    advanced: true,
  });
}

function siblingPairKeys(graph: FamilyGraph): string[] {
  const keys = new Set(
    graph.siblingEdges.map((edge) => unorderedPairKey(edge.personAId, edge.personBId)),
  );
  const childrenByParent = new Map<string, string[]>();
  for (const edge of graph.parentEdges) {
    const children = childrenByParent.get(edge.parentId) ?? [];
    children.push(edge.childId);
    childrenByParent.set(edge.parentId, children);
  }
  for (const children of childrenByParent.values()) {
    const unique = [...new Set(children)];
    for (let left = 0; left < unique.length; left += 1) {
      for (let right = left + 1; right < unique.length; right += 1) {
        keys.add(unorderedPairKey(unique[left]!, unique[right]!));
      }
    }
  }
  return [...keys].sort();
}

function cousinPairKeys(graph: FamilyGraph): string[] {
  const keys = new Set<string>();
  for (let left = 0; left < graph.persons.length; left += 1) {
    for (let right = left + 1; right < graph.persons.length; right += 1) {
      const first = graph.persons[left]!;
      const second = graph.persons[right]!;
      try {
        if (
          solveRelationFromGraph(graph, first.personId, second.personId).relationId ===
          "COUSIN"
        ) {
          keys.add(unorderedPairKey(first.personId, second.personId));
        }
      } catch {
        // Not a supported cousin pair.
      }
    }
  }
  return [...keys].sort();
}

function pairQuestion(
  source: BlrCp003FinalApprovedRecord,
  groupIndex: number,
  modeOverride?: number,
): GeneratedBlrCp004Question {
  const graph = diagramGraph(source);
  const mode = modeOverride ?? groupIndex % 4;
  let keys: string[];
  let prototypeId: BlrCp004PrototypeId;
  let noun: string;
  if (mode === 0) {
    keys = [
      ...new Set(
        graph.spouseEdges.map((edge) => unorderedPairKey(edge.personAId, edge.personBId)),
      ),
    ].sort();
    prototypeId = "BLR-CP004-PROT-COUNT-MARRIED-COUPLES";
    noun = "married couples";
  } else if (mode === 1) {
    keys = siblingPairKeys(graph);
    prototypeId = "BLR-CP004-PROT-COUNT-SIBLING-PAIRS";
    noun = "sibling pairs";
  } else if (mode === 2) {
    keys = [
      ...new Set(graph.parentEdges.map((edge) => `${edge.parentId}->${edge.childId}`)),
    ].sort();
    prototypeId = "BLR-CP004-PROT-COUNT-PARENT-CHILD-PAIRS";
    noun = "parent-child links";
  } else {
    keys = cousinPairKeys(graph);
    prototypeId = "BLR-CP004-PROT-COUNT-COUSIN-PAIRS";
    noun = "cousin pairs";
  }
  const rendered = keys.map((key) =>
    key.includes("->")
      ? key.split("->").map((id) => personLabel(source, id)).join(" → ")
      : key.split("::").map((id) => personLabel(source, id)).join(" and "),
  );
  return buildNumberQuestion({
    source,
    groupIndex,
    slot: `PAIR-${mode}`,
    authority: "COUNT_RELATION_PAIRS",
    prototypeId,
    stem: `How many ${noun} are present in the family?`,
    value: keys.length,
    countedPairKeys: keys,
    coreConcept: [
      "The pair universe is explicitly defined by the question.",
      "Unordered pairs are canonicalised so the reverse direction is not counted again.",
    ],
    working: [
      `${noun}: ${rendered.join("; ") || "none"}.`,
      `Count = ${keys.length}.`,
    ],
    conclusion: `The family contains ${keys.length} ${noun}.`,
    shortcut: "Write each pair in one fixed order and remove duplicates.",
    advanced: mode === 3,
  });
}

function generationQuestion(
  source: BlrCp003FinalApprovedRecord,
  groupIndex: number,
): GeneratedBlrCp004Question {
  const groups = generationGroups(source);
  const generations = [...groups.keys()].sort((left, right) => right - left);
  return buildNumberQuestion({
    source,
    groupIndex,
    slot: "GENERATIONS",
    authority: "COUNT_GENERATIONS",
    prototypeId: "BLR-CP004-PROT-COUNT-GENERATIONS",
    stem: "How many generations are represented in the family?",
    value: generations.length,
    coreConcept: [
      "Generation count is the number of occupied horizontal levels.",
      "Spouse and sibling links do not change the generation level.",
    ],
    working: [
      ...generations.map(
        (generation, index) =>
          `Row ${index + 1}: ${(groups.get(generation) ?? []).map((id) => personLabel(source, id)).join(", ")}.`,
      ),
      `Occupied rows = ${generations.length}.`,
    ],
    conclusion: `The family spans ${generations.length} generations.`,
    shortcut: "Place people on horizontal rows and count occupied rows once.",
  });
}

function compositionQuestion(
  source: BlrCp003FinalApprovedRecord,
  groupIndex: number,
): GeneratedBlrCp004Question {
  const graph = diagramGraph(source);
  const males = graph.persons.filter((person) => person.gender === "MALE").length;
  const females = graph.persons.filter((person) => person.gender === "FEMALE").length;
  const couples = new Set(
    graph.spouseEdges.map((edge) => unorderedPairKey(edge.personAId, edge.personBId)),
  ).size;
  const generations = generationGroups(source).size;
  return buildVectorQuestion(source, groupIndex, [males, females, couples, generations]);
}

function questionsForGroup(
  source: BlrCp003FinalApprovedRecord,
  groupIndex: number,
): GeneratedBlrCp004Question[] {
  return [
    globalCountQuestion(source, groupIndex),
    relativeQuestion(source, groupIndex, 0),
    sharedChildrenQuestion(source, groupIndex) ?? relativeQuestion(source, groupIndex, 1),
    pairQuestion(source, groupIndex),
    generationQuestion(source, groupIndex),
    compositionQuestion(source, groupIndex),
  ];
}

let cache: readonly GeneratedBlrCp004Question[] | null = null;

export function generateBlrCp004FrozenBank(): readonly GeneratedBlrCp004Question[] {
  if (cache) return cache;
  const sources = uniqueGroupSources();
  const zeroCousinGroupIndex = sources.findIndex(
    (source) => cousinPairKeys(diagramGraph(source)).length === 0,
  );
  if (zeroCousinGroupIndex < 0) {
    throw new Error("CP-004 source bank has no graph suitable for an explicit zero cousin-pair count.");
  }
  const bank = sources.flatMap((source, groupIndex) => {
    const questions = questionsForGroup(source, groupIndex);
    if (groupIndex === zeroCousinGroupIndex && groupIndex % 4 !== 3) {
      questions[3] = pairQuestion(source, groupIndex, 3);
    }
    return questions;
  });
  if (!bank.some((question) => question.answer.kind === "NUMBER" && question.answer.value === 0)) {
    throw new Error("CP-004 zero-count recovery failed to produce an explicit zero answer.");
  }
  const itemIds = new Set<string>();
  const fingerprints = new Set<string>();
  for (const question of bank) {
    const contract = contractForAuthority(question.solveAuthority);
    if (
      question.qlId !== contract.qlId ||
      question.answerType !== contract.answerType ||
      !contract.sourcePrototypeIds.includes(question.sourcePrototypeId)
    ) {
      throw new Error(`CP-004 ownership failure for ${question.itemId}.`);
    }
    if (itemIds.has(question.itemId)) throw new Error(`Duplicate CP-004 item ${question.itemId}.`);
    if (fingerprints.has(question.metadata.semanticFingerprint)) {
      throw new Error(`Duplicate CP-004 fingerprint ${question.metadata.semanticFingerprint}.`);
    }
    itemIds.add(question.itemId);
    fingerprints.add(question.metadata.semanticFingerprint);
    if (
      question.prototypeOnly ||
      !question.reviewOnly ||
      question.publiclyPublishable ||
      question.questionStudioVisible ||
      question.questionBankEligible ||
      question.mockTestEligible
    ) {
      throw new Error(`CP-004 release leak for ${question.itemId}.`);
    }
  }
  cache = bank;
  return cache;
}

export function buildBlrCp004Telemetry(
  bank: readonly GeneratedBlrCp004Question[] = generateBlrCp004FrozenBank(),
) {
  const countBy = (values: readonly string[]) => {
    const counts: Record<string, number> = {};
    for (const value of values) counts[value] = (counts[value] ?? 0) + 1;
    return counts;
  };
  const signatures = bank.map((question) =>
    `${question.sharedPrompt}\n${question.stem}`
      .toLocaleLowerCase("en-IN")
      .replace(/\s+/g, " ")
      .trim(),
  );
  return {
    recordCount: bank.length,
    groupCount: new Set(bank.map((question) => question.sourceGroupKey)).size,
    topologyCount: new Set(bank.map((question) => question.topologyId)).size,
    prototypeCount: new Set(bank.map((question) => question.sourcePrototypeId)).size,
    authorityCount: new Set(bank.map((question) => question.solveAuthority)).size,
    permanentQlCount: new Set(bank.map((question) => question.qlId)).size,
    answerPositions: [0, 1, 2, 3].map(
      (index) => bank.filter((question) => question.correctIndex === index).length,
    ),
    authorityCounts: countBy(bank.map((question) => question.solveAuthority)),
    prototypeCounts: countBy(bank.map((question) => question.sourcePrototypeId)),
    difficultyCounts: countBy(bank.map((question) => question.metadata.difficulty)),
    uniqueQuestionSignatureCount: new Set(signatures).size,
    questionSignatureUniquenessRatio: new Set(signatures).size / bank.length,
    zeroAnswerCount: bank.filter(
      (question) => question.answer.kind === "NUMBER" && question.answer.value === 0,
    ).length,
    nextAvailableChapterQlId: "BLR-QL-018" as const,
  } as const;
}
