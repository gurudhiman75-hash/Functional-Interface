import type { KnowledgeV1Difficulty } from "../../types";
export type SciCp029ReviewSpec = readonly [number, KnowledgeV1Difficulty, string, string, readonly [string,string,string], string, readonly string[]];
export const PART_2: readonly SciCp029ReviewSpec[] = [
  [
    3,
    "Medium",
    "Why is safe drinking water especially important in preventing cholera?",
    "The bacterium often spreads through contaminated water",
    [
      "Cholera spreads only by mosquito bite",
      "Cholera is caused by vitamin deficiency",
      "Water destroys all antibodies"
    ],
    "Cholera commonly spreads when water or food is contaminated with Vibrio cholerae.",
    [
      "CHOLERA-WATER"
    ]
  ],
  [
    3,
    "Medium",
    "Tuberculosis most often affects which organ?",
    "Lungs",
    [
      "Kidneys only",
      "Skin only",
      "Pancreas"
    ],
    "Pulmonary tuberculosis primarily affects the lungs, although other organs can also be involved.",
    [
      "TB-LUNGS"
    ]
  ],
  [
    3,
    "Hard",
    "A patient has a bacterial disease and receives an appropriate antibiotic. Why can the same drug not be assumed to cure influenza?",
    "Influenza is caused by a virus, not a bacterium",
    [
      "Viruses are larger than all bacteria",
      "Antibiotics work only against fungi",
      "Influenza is caused by a mineral deficiency"
    ],
    "Antibiotics target bacterial structures or processes and do not treat viral infections such as influenza.",
    [
      "ANTIBIOTIC-BACTERIA-VS-VIRUS"
    ]
  ],
  [
    4,
    "Easy",
    "AIDS is caused by:",
    "HIV",
    [
      "Salmonella Typhi",
      "Plasmodium",
      "Vibrio cholerae"
    ],
    "Human immunodeficiency virus, or HIV, damages the immune system and can lead to AIDS.",
    [
      "AIDS-HIV"
    ]
  ],
  [
    4,
    "Easy",
    "Polio is caused by a:",
    "Virus",
    [
      "Bacterium",
      "Protozoan",
      "Fungus"
    ],
    "Poliomyelitis is caused by poliovirus.",
    [
      "POLIO-VIRUS"
    ]
  ],
  [
    4,
    "Medium",
    "Measles is best described as a:",
    "Viral disease",
    [
      "Bacterial disease",
      "Deficiency disease",
      "Protozoan disease"
    ],
    "Measles is caused by the measles virus and is highly contagious.",
    [
      "MEASLES-VIRAL"
    ]
  ],
  [
    4,
    "Medium",
    "Which disease is spread by Aedes mosquitoes and is caused by a virus?",
    "Dengue",
    [
      "Malaria",
      "Typhoid",
      "Tuberculosis"
    ],
    "Dengue is caused by dengue viruses and is transmitted by Aedes mosquitoes.",
    [
      "DENGUE-AEDES-VIRUS"
    ]
  ],
  [
    4,
    "Medium",
    "HIV weakens the body chiefly by attacking cells important for:",
    "Immune defence",
    [
      "Bone mineralization",
      "Bile storage",
      "Urine formation"
    ],
    "HIV infects important immune cells, especially CD4 T cells, reducing the body's ability to fight infections.",
    [
      "HIV-IMMUNE-CELLS"
    ]
  ],
  [
    4,
    "Hard",
    "Why can antibiotics fail to help a person with an uncomplicated common viral cold?",
    "The illness is caused by viruses, which antibiotics do not target",
    [
      "Antibiotics work only above normal body temperature",
      "Viruses are vitamins",
      "Antibiotics always increase viral growth directly"
    ],
    "Antibiotics act against bacteria, not the viruses that cause most common colds.",
    [
      "VIRAL-COLD-ANTIBIOTICS"
    ]
  ],
  [
    5,
    "Easy",
    "Malaria is caused by:",
    "Plasmodium",
    [
      "Salmonella",
      "HIV",
      "Vibrio"
    ],
    "Malaria is caused by protozoan parasites of the genus Plasmodium.",
    [
      "MALARIA-PLASMODIUM"
    ]
  ],
  [
    5,
    "Easy",
    "The mosquito that transmits malaria to humans is the female:",
    "Anopheles mosquito",
    [
      "Aedes mosquito only",
      "Culex mosquito only",
      "Housefly"
    ],
    "Female Anopheles mosquitoes transmit Plasmodium parasites between humans.",
    [
      "MALARIA-ANOPHELES"
    ]
  ],
  [
    5,
    "Medium",
    "Which mosquito is an important vector of dengue?",
    "Aedes",
    [
      "Anopheles only",
      "Sandfly",
      "Tsetse fly"
    ],
    "Aedes mosquitoes, especially Aedes aegypti, are major dengue vectors.",
    [
      "DENGUE-AEDES"
    ]
  ],
  [
    5,
    "Medium",
    "Why does eliminating stagnant water help control dengue?",
    "It reduces breeding sites of Aedes mosquitoes",
    [
      "It kills all viruses in human blood",
      "It prevents vitamin deficiency",
      "It increases antibody production immediately"
    ],
    "Aedes mosquitoes commonly breed in small collections of standing water, so removing them reduces vector numbers.",
    [
      "DENGUE-STAGNANT-WATER"
    ]
  ],
  [
    5,
    "Medium",
    "Malaria is classified as vector-borne because:",
    "A mosquito carries the parasite from one host to another",
    [
      "It spreads only through food",
      "It is caused by a vitamin deficiency",
      "It never involves a pathogen"
    ],
    "The mosquito is the vector that transmits Plasmodium parasites between people.",
    [
      "MALARIA-VECTOR-BORNE"
    ]
  ],
  [
    5,
    "Hard",
    "A town controls mosquitoes effectively but makes no change to drinking-water sanitation. Which disease should fall more directly as a result?",
    "Dengue",
    [
      "Cholera",
      "Typhoid from contaminated water",
      "Scurvy"
    ],
    "Dengue depends on mosquito transmission, so mosquito control directly interrupts its transmission cycle.",
    [
      "VECTOR-CONTROL-REASONING"
    ]
  ]
] as const;
