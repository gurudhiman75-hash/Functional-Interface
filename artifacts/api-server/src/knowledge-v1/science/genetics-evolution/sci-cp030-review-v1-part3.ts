import type { KnowledgeV1Difficulty } from "../../types";
export type SciCp030ReviewSpec = readonly [number, KnowledgeV1Difficulty, string, string, readonly [string,string,string], string, readonly string[]];
export const PART_3: readonly SciCp030ReviewSpec[] = [
  [
    6,
    "Easy",
    "Differences among individuals of the same species are called:",
    "Variations",
    [
      "Fossils",
      "Reflexes",
      "Deficiencies"
    ],
    "Variation refers to differences in characteristics among members of a species.",
    [
      "VARIATION-DEFINITION"
    ]
  ],
  [
    6,
    "Easy",
    "Which process produces new combinations of genes in offspring?",
    "Sexual reproduction",
    [
      "Binary fission only",
      "Digestion",
      "Respiration"
    ],
    "Sexual reproduction combines genetic material from two parents and creates new allele combinations.",
    [
      "SEXUAL-REPRODUCTION-VARIATION"
    ]
  ],
  [
    6,
    "Medium",
    "Which variation is most likely inherited?",
    "A variation caused by a change in DNA",
    [
      "A scar from an injury",
      "Muscle gain from exercise only",
      "A suntan"
    ],
    "Inherited variation must involve genetic information that can be passed through gametes.",
    [
      "INHERITED-VARIATION"
    ]
  ],
  [
    6,
    "Medium",
    "Why is a scar not usually inherited by offspring?",
    "It is an acquired change in body tissue, not a change in germ-line DNA",
    [
      "Scars contain no cells",
      "Offspring receive no genes from parents",
      "Only dominant traits are inherited"
    ],
    "Acquired body changes generally do not alter the genetic information in gametes.",
    [
      "ACQUIRED-SCAR-NOT-INHERITED"
    ]
  ],
  [
    6,
    "Medium",
    "Mutation can contribute to evolution because it:",
    "Creates new genetic variation",
    [
      "Always removes all genes",
      "Prevents reproduction",
      "Produces only harmful traits"
    ],
    "Mutations change DNA and can introduce new alleles into a population.",
    [
      "MUTATION-VARIATION"
    ]
  ],
  [
    6,
    "Hard",
    "A population shows no genetic variation for a trait. Why may natural selection have little effect on that trait?",
    "There are no alternative heritable forms for selection to favour",
    [
      "Selection creates any needed allele instantly",
      "All organisms become identical to the environment",
      "Genes are unnecessary for evolution"
    ],
    "Natural selection acts on existing heritable variation; without alternatives, differential survival cannot shift that trait.",
    [
      "NO-VARIATION-SELECTION"
    ]
  ],
  [
    7,
    "Easy",
    "Natural selection favours individuals that:",
    "Leave more surviving offspring under particular conditions",
    [
      "Are always physically largest",
      "Never show variation",
      "Choose their genes consciously"
    ],
    "Traits that improve survival and reproduction in a given environment can become more common over generations.",
    [
      "NATURAL-SELECTION-FITNESS"
    ]
  ],
  [
    7,
    "Easy",
    "A heritable feature that improves survival or reproduction in an environment is called an:",
    "Adaptation",
    [
      "Antibody",
      "Deficiency",
      "Mutation only"
    ],
    "An adaptation is an inherited feature that increases fitness in a particular environment.",
    [
      "ADAPTATION-DEFINITION"
    ]
  ],
  [
    7,
    "Medium",
    "Why can antibiotic resistance in bacteria be considered an example of natural selection?",
    "Resistant bacteria survive treatment and reproduce more",
    [
      "Antibiotics intentionally create useful traits",
      "All bacteria become resistant at the same moment",
      "Resistance is caused by exercise"
    ],
    "Antibiotics act as a selection pressure, favouring bacteria with resistance traits.",
    [
      "AMR-NATURAL-SELECTION"
    ]
  ],
  [
    7,
    "Medium",
    "If a drought favours plants with deeper roots, what may happen over many generations?",
    "Deep-root traits may become more common",
    [
      "All plants instantly grow identical roots",
      "Genes disappear from the population",
      "Shallow roots become dominant regardless of survival"
    ],
    "Plants with heritable deeper roots may survive and reproduce more successfully under drought conditions.",
    [
      "DROUGHT-SELECTION"
    ]
  ],
  [
    7,
    "Medium",
    "Natural selection acts directly on:",
    "Phenotypic differences that affect survival and reproduction",
    [
      "Future needs of organisms",
      "Traits organisms decide to acquire",
      "All genes equally regardless of effect"
    ],
    "Selection acts through differences in expressed traits and their effects on reproductive success.",
    [
      "SELECTION-PHENOTYPE"
    ]
  ],
  [
    7,
    "Hard",
    "A colour variation helps insects avoid predators on dark tree bark. If the trait is heritable, what is the likely long-term effect?",
    "The better-camouflaged colour may increase in frequency",
    [
      "Every insect changes colour during its lifetime and passes it on",
      "Predators stop evolving",
      "The allele must disappear"
    ],
    "Individuals with better camouflage may survive and reproduce more, increasing the frequency of the underlying allele.",
    [
      "CAMOUFLAGE-SELECTION"
    ]
  ],
  [
    8,
    "Easy",
    "Preserved remains or traces of ancient organisms are called:",
    "Fossils",
    [
      "Alleles",
      "Antibodies",
      "Hormones"
    ],
    "Fossils are preserved remains, impressions or traces of organisms from the past.",
    [
      "FOSSIL-DEFINITION"
    ]
  ],
  [
    8,
    "Easy",
    "Fossils are commonly found in:",
    "Sedimentary rocks",
    [
      "Fresh blood",
      "Living muscle only",
      "Pure metals"
    ],
    "Sedimentary rocks often preserve remains or impressions of organisms as layers accumulate.",
    [
      "FOSSILS-SEDIMENTARY"
    ]
  ],
  [
    8,
    "Medium",
    "Why are fossils useful in studying evolution?",
    "They provide evidence of organisms that lived in the past",
    [
      "They show that species never change",
      "They contain no biological information",
      "They prove every organism appeared at once"
    ],
    "Fossils allow comparison of past and present life forms and reveal changes through geological time.",
    [
      "FOSSIL-EVIDENCE"
    ]
  ]
] as const;
