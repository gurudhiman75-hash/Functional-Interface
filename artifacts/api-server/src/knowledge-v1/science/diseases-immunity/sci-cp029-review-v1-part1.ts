import type { KnowledgeV1Difficulty } from "../../types";
export type SciCp029ReviewSpec = readonly [number, KnowledgeV1Difficulty, string, string, readonly [string,string,string], string, readonly string[]];
export const PART_1: readonly SciCp029ReviewSpec[] = [
  [
    1,
    "Easy",
    "A disease that can spread from one person to another is called:",
    "Communicable disease",
    [
      "Deficiency disease",
      "Genetic trait",
      "Nutritional disorder only"
    ],
    "Communicable diseases are caused by infectious agents and can spread directly or indirectly between hosts.",
    [
      "COMMUNICABLE-DEFINITION"
    ]
  ],
  [
    1,
    "Easy",
    "Which of the following is a non-communicable disease?",
    "Diabetes mellitus",
    [
      "Tuberculosis",
      "Measles",
      "Cholera"
    ],
    "Diabetes mellitus does not spread from one person to another and is classed as a non-communicable disease.",
    [
      "NONCOMMUNICABLE-DIABETES"
    ]
  ],
  [
    1,
    "Medium",
    "What distinguishes an infectious disease from a deficiency disease?",
    "It is caused by a pathogen",
    [
      "It always results from lack of vitamins",
      "It cannot spread",
      "It never produces fever"
    ],
    "Infectious diseases are caused by disease-producing organisms or agents, while deficiency diseases result from inadequate nutrients.",
    [
      "INFECTIOUS-VS-DEFICIENCY"
    ]
  ],
  [
    1,
    "Medium",
    "Which condition is best described as a deficiency disease?",
    "Scurvy",
    [
      "Typhoid",
      "Malaria",
      "Influenza"
    ],
    "Scurvy results from vitamin C deficiency rather than infection by a pathogen.",
    [
      "DEFICIENCY-SCURVY"
    ]
  ],
  [
    1,
    "Medium",
    "A disease is described as chronic when it:",
    "Persists for a long period",
    [
      "Always spreads by mosquitoes",
      "Lasts only a few hours",
      "Is caused only by bacteria"
    ],
    "Chronic diseases generally persist for long periods and may require prolonged management.",
    [
      "CHRONIC-DISEASE"
    ]
  ],
  [
    1,
    "Hard",
    "Two patients have fever. One has malaria and the other has heat exhaustion. Why is only the first classified as an infectious disease?",
    "Malaria is caused by a pathogen that can be transmitted",
    [
      "Any fever is infectious",
      "Heat exhaustion is caused by bacteria",
      "Malaria is a vitamin deficiency"
    ],
    "Malaria is caused by the protozoan Plasmodium and involves transmission by a vector. Heat exhaustion is not caused by a pathogen.",
    [
      "INFECTIOUS-REASONING"
    ]
  ],
  [
    2,
    "Easy",
    "An organism or agent that causes disease is called a:",
    "Pathogen",
    [
      "Antibody",
      "Vaccine",
      "Nutrient"
    ],
    "A pathogen is a disease-causing biological agent such as a bacterium, virus, fungus or protozoan.",
    [
      "PATHOGEN-DEFINITION"
    ]
  ],
  [
    2,
    "Easy",
    "Diseases spread by contaminated food or water are commonly called:",
    "Food- or water-borne diseases",
    [
      "Vector-borne diseases only",
      "Genetic diseases",
      "Deficiency diseases"
    ],
    "Some pathogens spread when contaminated food or water is consumed.",
    [
      "FOOD-WATER-BORNE"
    ]
  ],
  [
    2,
    "Medium",
    "A mosquito that transfers a pathogen from one person to another acts as a:",
    "Vector",
    [
      "Antibody",
      "Vaccine",
      "Antigen"
    ],
    "A vector carries a pathogen between hosts without itself being the main disease-causing agent.",
    [
      "VECTOR-DEFINITION"
    ]
  ],
  [
    2,
    "Medium",
    "Which route is most closely associated with influenza transmission?",
    "Respiratory droplets and aerosols",
    [
      "Mosquito bite",
      "Contaminated soil only",
      "Vitamin deficiency"
    ],
    "Influenza viruses spread efficiently through respiratory droplets and aerosols from infected people.",
    [
      "INFLUENZA-TRANSMISSION"
    ]
  ],
  [
    2,
    "Medium",
    "Which practice best reduces diseases spread by the faecal-oral route?",
    "Safe water, sanitation and hand hygiene",
    [
      "Sharing drinking cups",
      "Leaving food uncovered",
      "Avoiding sunlight only"
    ],
    "Clean water, sanitation and handwashing reduce contamination of food and water with infectious material.",
    [
      "FAECAL-ORAL-PREVENTION"
    ]
  ],
  [
    2,
    "Hard",
    "A disease does not spread through casual contact but is transmitted through infected blood and certain body fluids. Which prevention strategy is most relevant?",
    "Avoid unsafe needles and ensure screened blood",
    [
      "Use mosquito nets only",
      "Boil all vegetables only",
      "Increase dietary vitamin D"
    ],
    "Blood screening and safe injection practices reduce transmission of pathogens spread through infected blood.",
    [
      "BLOODBORNE-PREVENTION"
    ]
  ],
  [
    3,
    "Easy",
    "Tuberculosis is caused by a:",
    "Bacterium",
    [
      "Virus",
      "Protozoan",
      "Fungus"
    ],
    "Tuberculosis is caused by the bacterium Mycobacterium tuberculosis.",
    [
      "TB-BACTERIUM"
    ]
  ],
  [
    3,
    "Easy",
    "Cholera is commonly caused by the bacterium:",
    "Vibrio cholerae",
    [
      "Plasmodium vivax",
      "HIV",
      "Rhizobium"
    ],
    "Vibrio cholerae causes cholera, a severe diarrhoeal disease often linked with contaminated water.",
    [
      "CHOLERA-VIBRIO"
    ]
  ],
  [
    3,
    "Medium",
    "Typhoid fever is caused by:",
    "Salmonella Typhi",
    [
      "Mycobacterium tuberculosis",
      "Vibrio cholerae",
      "Plasmodium falciparum"
    ],
    "Typhoid fever is caused by the bacterium Salmonella Typhi.",
    [
      "TYPHOID-SALMONELLA"
    ]
  ]
] as const;
