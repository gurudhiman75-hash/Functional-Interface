import type { KnowledgeV1Difficulty } from "../../types";
export type SciCp030ReviewSpec = readonly [number, KnowledgeV1Difficulty, string, string, readonly [string,string,string], string, readonly string[]];
export const PART_4: readonly SciCp030ReviewSpec[] = [
  [
    8,
    "Medium",
    "Older fossils are generally found in:",
    "Deeper undisturbed rock layers",
    [
      "Only the top soil",
      "Younger layers above all other fossils",
      "Living tissues"
    ],
    "In undisturbed sedimentary sequences, deeper layers are usually older than layers above them. This principle of superposition allows relative dating when rock layers have not been overturned.",
    [
      "FOSSIL-STRATA"
    ]
  ],
  [
    8,
    "Medium",
    "Transitional fossils are important because they can show:",
    "Intermediate features between major groups",
    [
      "That inheritance does not occur",
      "Only acquired traits",
      "That all species are identical"
    ],
    "Transitional forms can contain combinations of features that help connect evolutionary lineages. Such combinations can help show how major structural changes accumulated during evolutionary transitions.",
    [
      "TRANSITIONAL-FOSSILS"
    ]
  ],
  [
    8,
    "Hard",
    "A fossil species in older rock shares several structural features with a younger group but lacks some later specializations. What can this suggest?",
    "The older species may represent an earlier stage in an evolutionary lineage",
    [
      "The younger group cannot be related",
      "Rock layers determine genes directly",
      "Evolution always occurs within one lifetime"
    ],
    "A sequence of related features through time can support an evolutionary relationship. The interpretation is strongest when anatomy, age and other fossil evidence fit the same lineage pattern.",
    [
      "FOSSIL-LINEAGE-REASONING"
    ]
  ],
  [
    9,
    "Easy",
    "Structures with the same basic origin but different functions are called:",
    "Homologous structures",
    [
      "Analogous structures",
      "Vestigial structures only",
      "Acquired traits"
    ],
    "Homologous structures share a common structural origin despite serving different functions. Human arms, whale flippers and bat wings are classic examples built from the same underlying limb plan.",
    [
      "HOMOLOGOUS-DEFINITION"
    ]
  ],
  [
    9,
    "Easy",
    "Structures with similar functions but different evolutionary origins are called:",
    "Analogous structures",
    [
      "Homologous structures",
      "Genes",
      "Alleles"
    ],
    "Analogous structures perform similar functions but evolved independently. Similarity of function alone does not prove close ancestry because similar solutions can evolve independently.",
    [
      "ANALOGOUS-DEFINITION"
    ]
  ],
  [
    9,
    "Medium",
    "The forelimbs of humans, whales and bats are examples of:",
    "Homologous structures",
    [
      "Analogous structures only",
      "No evolutionary relationship",
      "Vestigial organs"
    ],
    "These forelimbs share the same basic bone plan but are adapted for different functions. The shared pattern of humerus, radius, ulna and other bones points to inheritance from a common ancestor.",
    [
      "FORELIMB-HOMOLOGOUS"
    ]
  ],
  [
    9,
    "Medium",
    "Wings of birds and insects are often used as an example of:",
    "Analogous structures",
    [
      "Homologous forelimbs in all details",
      "Vestigial structures",
      "Identical genes"
    ],
    "Bird and insect wings serve flight but have very different structural origins. Flight evolved independently in the two groups, producing similar function without the same anatomical origin.",
    [
      "WINGS-ANALOGOUS"
    ]
  ],
  [
    9,
    "Medium",
    "A vestigial structure is one that:",
    "Has reduced function compared with its ancestral form",
    [
      "Has no evolutionary history",
      "Must be harmful",
      "Is acquired during exercise"
    ],
    "Vestigial structures are reduced remnants of features that were more functional in ancestors. Examples can retain little present function while still revealing features inherited from ancestors.",
    [
      "VESTIGIAL-DEFINITION"
    ]
  ],
  [
    9,
    "Hard",
    "Why do homologous structures support common ancestry more strongly than analogous structures?",
    "They share an underlying structural plan inherited from a common ancestor",
    [
      "They always perform identical functions",
      "They are always vestigial",
      "They occur only in unrelated species"
    ],
    "Homology reflects shared ancestry, while analogy can arise independently through similar selective pressures. Shared developmental and anatomical patterns are harder to explain by independent adaptation alone.",
    [
      "HOMOLOGY-COMMON-ANCESTRY"
    ]
  ],
  [
    10,
    "Hard",
    "A population faces a new environmental stress. Which condition is necessary for natural selection to change the population over generations?",
    "Individuals must differ in heritable traits that affect survival or reproduction",
    [
      "Every individual must acquire the same trait during life",
      "The environment must create identical mutations in all organisms",
      "Reproduction must stop while the stress continues"
    ],
    "Natural selection needs heritable variation. If some inherited differences affect survival or reproduction, their frequencies can change across generations. Selection can only change the population if the useful differences are inherited and influence reproductive success.",
    [
      "VARIATION-RAW-MATERIAL"
    ]
  ],
  [
    10,
    "Medium",
    "A trait is inherited but gives no survival or reproductive advantage in a particular environment. What follows?",
    "Natural selection may not strongly favour it",
    [
      "It must disappear immediately",
      "It always becomes dominant",
      "It cannot be inherited"
    ],
    "Selection depends on how a trait affects reproductive success in a particular environment. A heritable trait can persist neutrally if it neither improves nor reduces reproductive success in that environment.",
    [
      "NEUTRAL-TRAIT-SELECTION"
    ]
  ],
  [
    10,
    "Medium",
    "Which sequence best describes evolution by natural selection?",
    "Heritable variation → differential survival/reproduction → change in trait frequency",
    [
      "Need → instant mutation → inheritance",
      "Exercise → acquired trait → guaranteed inheritance",
      "No variation → rapid selection"
    ],
    "Selection changes populations when heritable differences affect reproductive success. Repeated differential reproduction makes advantageous heritable variants more common over successive generations.",
    [
      "SELECTION-SEQUENCE"
    ]
  ],
  [
    10,
    "Medium",
    "Why does evolution occur in populations rather than in individual organisms?",
    "Allele frequencies change across generations",
    [
      "Individuals rewrite all genes during life",
      "Every individual becomes a new species",
      "Evolution requires no reproduction"
    ],
    "Evolution is a change in inherited characteristics of populations over generations. Individuals may change during life, but evolution specifically refers to inherited population-level change across generations.",
    [
      "POPULATION-EVOLUTION"
    ]
  ],
  [
    10,
    "Hard",
    "A pesticide kills most insects, but a few with a heritable resistance trait survive and reproduce. What happens if the same pesticide is used repeatedly?",
    "Resistance is likely to become more common",
    [
      "All resistance disappears",
      "Every insect becomes susceptible",
      "The pesticide becomes a vitamin"
    ],
    "Repeated selection favours resistant insects, increasing the frequency of resistance alleles. Continued pesticide pressure repeatedly removes susceptible insects and leaves resistant individuals to reproduce.",
    [
      "PESTICIDE-RESISTANCE-EVOLUTION"
    ]
  ],
  [
    10,
    "Hard",
    "Two species have very similar homologous limb bones but use the limbs differently. Which conclusion is best supported?",
    "They may share a common ancestor despite different adaptations",
    [
      "They must live in the same habitat",
      "They evolved independently with no relationship",
      "Their genes must be identical"
    ],
    "Shared homologous structures suggest common ancestry, while functional differences reflect divergence and adaptation. Different functions can evolve from the same ancestral structure as populations adapt to different environments.",
    [
      "HOMOLOGY-INTEGRATED"
    ]
  ]
] as const;
