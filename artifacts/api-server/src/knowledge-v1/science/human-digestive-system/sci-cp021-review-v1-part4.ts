import type { KnowledgeV1Difficulty } from "../../types";
export type SciCp021ReviewSpec = readonly [number, KnowledgeV1Difficulty, string, string, readonly [string,string,string], string, readonly string[]];
export const PART_4: readonly SciCp021ReviewSpec[] = [
  [
    8,
    "Medium",
    "Which statement about the large intestine is correct?",
    "It absorbs much of the remaining water from undigested material",
    [
      "It is the main site of protein digestion",
      "It produces bile",
      "It begins starch digestion with saliva"
    ],
    "The large intestine recovers much of the remaining water and some salts and helps form faeces. Most nutrient digestion and absorption occur earlier.",
    [
      "LARGE-INTESTINE-FUNCTION"
    ]
  ],
  [
    8,
    "Medium",
    "Excessive loss of water through frequent loose stools can lead to:",
    "Dehydration",
    [
      "Improved nutrient absorption",
      "Increased bile storage",
      "Higher saliva production only"
    ],
    "Frequent diarrhoeal stools can remove large amounts of water and salts from the body, causing dehydration. Replacing both water and electrolytes is therefore important during significant diarrhoea.",
    [
      "DIARRHOEA-DEHYDRATION"
    ]
  ],
  [
    8,
    "Hard",
    "If intestinal contents move unusually slowly through the large intestine, why may the stool become harder?",
    "More water is absorbed from it",
    [
      "More bile is produced in the colon",
      "Protein digestion becomes faster",
      "Saliva enters the large intestine"
    ],
    "Longer contact with the large-intestinal wall allows more water to be absorbed, making the faecal material drier and harder. This is one reason slow bowel movement can contribute to constipation.",
    [
      "COLON-SLOW-TRANSIT"
    ]
  ],
  [
    9,
    "Easy",
    "The final product of starch digestion that is commonly absorbed is:",
    "Glucose",
    [
      "Amino acid",
      "Glycerol",
      "Cellulose"
    ],
    "Starch is broken down through smaller carbohydrates to simple sugars such as glucose, which can be absorbed. Glucose is small and soluble enough to be absorbed through the intestinal wall.",
    [
      "STARCH-GLUCOSE"
    ]
  ],
  [
    9,
    "Medium",
    "Which nutrient-enzyme pair is correctly matched?",
    "Protein — protease",
    [
      "Fat — amylase",
      "Starch — lipase",
      "Protein — bile"
    ],
    "Proteases act on proteins, amylases on starch and lipases on fats. Enzyme names and their specific substrates are key to understanding digestive pathways.",
    [
      "ENZYME-SUBSTRATE-PROTEASE"
    ]
  ],
  [
    9,
    "Medium",
    "Which nutrient is digested by lipase?",
    "Fat",
    [
      "Protein",
      "Starch",
      "Mineral salts"
    ],
    "Lipase breaks fats into fatty acids and glycerol. It does not digest proteins or starch. Its products are small enough to be absorbed after further processing in the intestine.",
    [
      "ENZYME-SUBSTRATE-LIPASE"
    ]
  ],
  [
    9,
    "Medium",
    "Which nutrient begins chemical digestion in the mouth?",
    "Starch",
    [
      "Protein",
      "Fat as the main oral substrate",
      "Vitamins"
    ],
    "Salivary amylase begins starch digestion in the mouth. Protein digestion begins in the stomach. This early digestion continues later through pancreatic and intestinal enzymes.",
    [
      "STARCH-DIGESTION-MOUTH"
    ]
  ],
  [
    9,
    "Hard",
    "Which sequence correctly matches the main site where digestion begins for starch, protein and most fat digestion?",
    "Mouth, stomach, small intestine",
    [
      "Stomach, mouth, large intestine",
      "Small intestine, stomach, mouth",
      "Mouth, large intestine, stomach"
    ],
    "Starch digestion begins in the mouth, protein digestion in the stomach, and most fat digestion occurs in the small intestine.",
    [
      "DIGESTION-START-SITES"
    ]
  ],
  [
    9,
    "Hard",
    "A person produces normal bile and amylase but very little lipase. Which digestion will be most directly affected?",
    "Breakdown of fats into fatty acids and glycerol",
    [
      "Breakdown of starch into sugars",
      "Breakdown of proteins by pepsin",
      "Absorption of water in the colon"
    ],
    "Lipase is the enzyme that chemically digests fats. Bile can emulsify fats but cannot replace lipase's enzymatic action. Fat absorption may therefore fall even when emulsification by bile remains normal.",
    [
      "LIPASE-DEFICIENCY-FAT"
    ]
  ],
  [
    10,
    "Easy",
    "How does dietary fibre help normal bowel movement?",
    "Adding bulk to intestinal contents",
    [
      "Digesting proteins in the stomach",
      "Producing bile in the liver",
      "Absorbing glucose into blood"
    ],
    "Dietary fibre adds bulk and holds water in intestinal contents, which helps their movement through the bowel. The increased bulk stimulates intestinal movement and helps prevent constipation.",
    [
      "FIBRE-BOWEL-MOVEMENT"
    ]
  ],
  [
    10,
    "Medium",
    "Why is thorough chewing helpful for digestion?",
    "It increases surface area and mixes food with saliva",
    [
      "It completes all protein digestion",
      "It releases bile into the mouth",
      "It absorbs fats through the tongue"
    ],
    "Chewing breaks food into smaller pieces and mixes it with saliva. Both actions help later digestion proceed more efficiently. It also makes swallowing safer by producing a softer, more uniform bolus.",
    [
      "CHEWING-DIGESTION-BENEFIT"
    ]
  ],
  [
    10,
    "Medium",
    "If a person has normal pancreatic function but no salivary amylase, starch digestion can still continue because:",
    "Pancreatic amylase acts in the small intestine",
    [
      "Pepsin digests starch in the stomach",
      "Bile converts starch directly to glucose",
      "The large intestine secretes salivary enzymes"
    ],
    "Pancreatic amylase can continue starch digestion in the small intestine even if the oral stage is absent. The absence of salivary amylase delays rather than completely prevents starch digestion.",
    [
      "STARCH-PANCREATIC-BACKUP"
    ]
  ],
  [
    10,
    "Medium",
    "After surgical removal of the gallbladder, bile can still enter the small intestine because it is produced by the:",
    "Liver",
    [
      "Pancreas",
      "Stomach",
      "Large intestine"
    ],
    "The gallbladder stores bile but does not produce it. The liver continues making bile after gallbladder removal. Bile flows more continuously from the liver rather than being stored between meals.",
    [
      "GALLBLADDER-REMOVAL-BILE"
    ]
  ],
  [
    10,
    "Hard",
    "A patient has normal digestion in the stomach but very poor absorption of glucose and amino acids. Which structure is most likely damaged?",
    "Villi of the small intestine",
    [
      "Teeth",
      "Gallbladder",
      "Oesophageal muscles"
    ],
    "Glucose and amino acids are absorbed through the villi of the small intestine. Damage there can impair absorption even when digestion is normal.",
    [
      "DIGESTION-ABSORPTION-DISTINCTION"
    ]
  ],
  [
    10,
    "Hard",
    "Food reaches the small intestine with normal bile but without pancreatic juice. Which outcome is most likely?",
    "Digestion of several major nutrients remains incomplete",
    [
      "All digestion proceeds normally because bile contains all enzymes",
      "Only water absorption is affected",
      "Only chewing is affected"
    ],
    "Bile helps fat digestion physically, but pancreatic juice supplies major enzymes for carbohydrates, proteins and fats. Without it, digestion remains incomplete.",
    [
      "PANCREAS-MIXED-REASONING"
    ]
  ]
] as const;
