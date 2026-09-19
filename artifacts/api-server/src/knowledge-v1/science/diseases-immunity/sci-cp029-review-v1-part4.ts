import type { KnowledgeV1Difficulty } from "../../types";
export type SciCp029ReviewSpec = readonly [number, KnowledgeV1Difficulty, string, string, readonly [string,string,string], string, readonly string[]];
export const PART_4: readonly SciCp029ReviewSpec[] = [
  [
    8,
    "Medium",
    "A booster dose is given to some vaccines to:",
    "Strengthen or renew the immune response",
    [
      "Destroy red blood cells",
      "Reduce all antibody formation",
      "Replace antibiotics"
    ],
    "Boosters re-expose the immune system to antigen and can raise protective antibody and memory responses.",
    [
      "BOOSTER-DOSE"
    ]
  ],
  [
    8,
    "Medium",
    "Why can high vaccine coverage reduce disease spread even among some unvaccinated people?",
    "Fewer susceptible hosts are available for transmission",
    [
      "Vaccines sterilize all public surfaces",
      "Every unvaccinated person receives antibodies automatically",
      "Pathogens stop mutating completely"
    ],
    "When many people are immune, transmission chains are harder to sustain, indirectly reducing exposure of others.",
    [
      "COMMUNITY-IMMUNITY"
    ]
  ],
  [
    8,
    "Hard",
    "A vaccinated person encounters a pathogen years later and produces antibodies rapidly. Which cells are chiefly responsible for the faster response?",
    "Memory lymphocytes",
    [
      "Red blood cells",
      "Platelets",
      "Skin cells only"
    ],
    "Memory lymphocytes formed after vaccination recognize the antigen and drive a faster secondary immune response.",
    [
      "VACCINE-MEMORY-CELLS"
    ]
  ],
  [
    9,
    "Easy",
    "Antibiotics are used to treat infections caused by:",
    "Bacteria",
    [
      "Viruses only",
      "Vitamin deficiencies",
      "Genetic traits"
    ],
    "Antibiotics act against bacteria by targeting bacterial structures or processes.",
    [
      "ANTIBIOTICS-BACTERIA"
    ]
  ],
  [
    9,
    "Easy",
    "Antibiotics should not be expected to cure:",
    "Influenza",
    [
      "Bacterial pneumonia",
      "Typhoid",
      "Some bacterial skin infections"
    ],
    "Influenza is viral, and antibiotics do not act against influenza viruses.",
    [
      "ANTIBIOTICS-NOT-INFLUENZA"
    ]
  ],
  [
    9,
    "Medium",
    "Why is unnecessary use of antibiotics discouraged?",
    "It promotes selection of antibiotic-resistant bacteria",
    [
      "It makes all vaccines ineffective",
      "It causes viruses to become bacteria",
      "It removes every useful gene from the body"
    ],
    "Antibiotic exposure kills susceptible bacteria while resistant ones can survive and multiply.",
    [
      "ANTIBIOTIC-RESISTANCE-SELECTION"
    ]
  ],
  [
    9,
    "Medium",
    "Why should an antibiotic course be taken as prescribed?",
    "Incomplete or improper use can favour survival of less susceptible bacteria",
    [
      "Stopping early always strengthens immunity",
      "Antibiotics work only on the final day",
      "The medicine becomes a vaccine after completion"
    ],
    "Correct use improves treatment and reduces opportunities for resistant bacteria to survive and spread.",
    [
      "ANTIBIOTIC-COURSE"
    ]
  ],
  [
    9,
    "Medium",
    "Antibiotic resistance means that:",
    "Some bacteria can survive a drug that once killed or inhibited them",
    [
      "The patient's body becomes resistant to all medicine",
      "Viruses turn into bacteria",
      "Antibiotics lose their chemical identity"
    ],
    "Resistance is a property of bacteria that enables survival despite exposure to an antibiotic.",
    [
      "ANTIBIOTIC-RESISTANCE-DEFINITION"
    ]
  ],
  [
    9,
    "Hard",
    "A bacterial population contains a few resistant cells before treatment. After repeated inappropriate antibiotic use, resistant cells become common. What best explains this?",
    "Selection favours resistant bacteria that survive and reproduce",
    [
      "Antibiotics teach bacteria consciously",
      "All susceptible bacteria change into viruses",
      "Resistance is caused by vitamin deficiency"
    ],
    "Antibiotics create selection pressure: susceptible bacteria die, while resistant variants survive and leave more descendants.",
    [
      "RESISTANCE-SELECTION-REASONING"
    ]
  ],
  [
    10,
    "Hard",
    "A village reports repeated malaria cases after the rainy season. Which combined action would most directly interrupt transmission?",
    "Remove mosquito breeding sites and prevent mosquito bites",
    [
      "Use antibiotics for every fever",
      "Increase dietary protein and iron",
      "Improve handwashing but leave stagnant water"
    ],
    "Malaria depends on Anopheles mosquitoes for transmission. Reducing breeding sites and preventing bites directly interrupts the vector pathway.",
    [
      "MALARIA-PREVENTION"
    ]
  ],
  [
    10,
    "Medium",
    "A person washes hands before eating and drinks treated water. Which transmission route is being targeted most directly?",
    "Faecal-oral transmission",
    [
      "Genetic inheritance",
      "Mosquito transmission only",
      "Hormonal transmission"
    ],
    "Hand hygiene and safe water reduce ingestion of pathogens that spread through contaminated food and water.",
    [
      "HYGIENE-FAECAL-ORAL"
    ]
  ],
  [
    10,
    "Medium",
    "Why does covering the mouth and improving ventilation help reduce respiratory infections?",
    "They reduce release and accumulation of infectious respiratory particles",
    [
      "They increase vitamin levels",
      "They kill every pathogen instantly",
      "They replace vaccination"
    ],
    "Respiratory hygiene and ventilation reduce exposure to droplets and aerosols that may carry pathogens.",
    [
      "RESPIRATORY-PREVENTION"
    ]
  ],
  [
    10,
    "Medium",
    "A person has recovered from measles and later encounters the virus again. Which feature may provide faster protection?",
    "Immune memory",
    [
      "Higher dietary fat",
      "Extra platelets",
      "Lower body temperature"
    ],
    "Memory cells formed after the first infection can generate a quicker specific response during re-exposure.",
    [
      "MEASLES-MEMORY"
    ]
  ],
  [
    10,
    "Hard",
    "A community improves clean-water supply but does not control mosquitoes. Which pair is most likely to show different trends?",
    "Cholera may decrease while dengue may remain",
    [
      "Dengue decreases while cholera must increase",
      "Both diseases disappear completely",
      "Neither disease can change"
    ],
    "Clean water interrupts faecal-oral transmission of cholera, while dengue depends on mosquito vectors and needs separate control.",
    [
      "PREVENTION-ROUTE-REASONING"
    ]
  ],
  [
    10,
    "Hard",
    "A new bacterial strain spreads because it survives a commonly used antibiotic. Which combined response is most appropriate?",
    "Use antibiotics responsibly and apply infection-control measures",
    [
      "Use the same antibiotic for every illness",
      "Stop vaccination against unrelated diseases",
      "Treat viral infections with higher antibiotic doses"
    ],
    "Resistance is reduced by appropriate antibiotic use, while hygiene and infection control limit spread of resistant bacteria.",
    [
      "AMR-CONTROL-INTEGRATED"
    ]
  ]
] as const;
