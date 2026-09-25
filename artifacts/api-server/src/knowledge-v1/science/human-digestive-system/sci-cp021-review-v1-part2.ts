import type { KnowledgeV1Difficulty } from "../../types";
export type SciCp021ReviewSpec = readonly [number, KnowledgeV1Difficulty, string, string, readonly [string,string,string], string, readonly string[]];
export const PART_2: readonly SciCp021ReviewSpec[] = [
  [
    3,
    "Medium",
    "The mucus lining of the stomach protects it from:",
    "Acid and digestive enzymes",
    [
      "Absorbed oxygen",
      "Bile stored in the gallbladder",
      "Saliva from the mouth"
    ],
    "Mucus forms a protective layer over the stomach wall, reducing damage from hydrochloric acid and protein-digesting enzymes. Without this barrier, the stomach's own secretions could injure its tissues.",
    [
      "STOMACH-MUCUS"
    ]
  ],
  [
    3,
    "Medium",
    "Why is hydrochloric acid important in the stomach?",
    "It provides an acidic medium for pepsin and helps kill many microbes",
    [
      "It emulsifies fats into droplets",
      "It absorbs glucose into blood",
      "It produces bile pigments"
    ],
    "Hydrochloric acid creates the low pH needed for pepsin to act and also helps destroy many microbes entering with food.",
    [
      "STOMACH-ACID-FUNCTION"
    ]
  ],
  [
    3,
    "Hard",
    "If the stomach becomes much less acidic than normal, which digestive process is most directly reduced?",
    "Pepsin activity on proteins",
    [
      "Salivary amylase activity in the mouth",
      "Bile production by the liver",
      "Water absorption in the large intestine"
    ],
    "Pepsin requires an acidic medium for effective protein digestion. A large rise in stomach pH therefore reduces its activity. The enzyme's shape and activity are best maintained in strongly acidic conditions.",
    [
      "STOMACH-PH-PEPSIN"
    ]
  ],
  [
    4,
    "Easy",
    "Which is the largest gland in the human body?",
    "Liver",
    [
      "Pancreas",
      "Salivary gland",
      "Thyroid"
    ],
    "The liver is the largest gland in the human body and performs many metabolic functions, including production of bile. It also processes nutrients, stores glycogen and detoxifies many substances.",
    [
      "LIVER-LARGEST-GLAND"
    ]
  ],
  [
    4,
    "Easy",
    "Bile is produced by the:",
    "Liver",
    [
      "Gallbladder",
      "Pancreas",
      "Stomach"
    ],
    "Bile is produced by liver cells. It is then stored and concentrated in the gallbladder before release into the small intestine.",
    [
      "BILE-PRODUCED-LIVER"
    ]
  ],
  [
    4,
    "Medium",
    "What is the chief function of the gallbladder?",
    "Store and concentrate bile",
    [
      "Produce digestive enzymes",
      "Absorb amino acids",
      "Secrete hydrochloric acid"
    ],
    "The gallbladder stores and concentrates bile made by the liver and releases it into the small intestine when needed. It does not make bile; bile production occurs continuously in the liver.",
    [
      "GALLBLADDER-BILE-STORAGE"
    ]
  ],
  [
    4,
    "Medium",
    "How does bile help in the digestion of fats?",
    "Breaking large fat globules into smaller droplets",
    [
      "Converting proteins into amino acids directly",
      "Digesting starch into glucose",
      "Absorbing fats into blood"
    ],
    "Bile emulsifies fats, dividing large fat globules into small droplets. This increases the surface area available for lipase. Emulsification is physical breakdown and does not itself chemically digest fat.",
    [
      "BILE-EMULSIFICATION"
    ]
  ],
  [
    4,
    "Medium",
    "Besides emulsifying fats, bile also helps by:",
    "Making the intestinal medium less acidic",
    [
      "Making the stomach more acidic",
      "Digesting cellulose in humans",
      "Producing salivary amylase"
    ],
    "Bile is alkaline and helps neutralize the acidic food mixture entering the small intestine from the stomach. This creates a better pH for pancreatic and intestinal enzymes.",
    [
      "BILE-ALKALINE"
    ]
  ],
  [
    4,
    "Hard",
    "Why can bile aid fat digestion even though it contains no digestive enzyme?",
    "It emulsifies fat and improves the action of lipase",
    [
      "It changes fats directly into amino acids",
      "It converts glucose into glycogen in the intestine",
      "It replaces pancreatic juice completely"
    ],
    "Bile does not chemically digest fat itself. By emulsifying fat into small droplets, it gives lipase a much larger surface area to act on.",
    [
      "BILE-NO-ENZYME"
    ]
  ],
  [
    5,
    "Easy",
    "Pancreatic juice is released into the:",
    "Small intestine",
    [
      "Mouth",
      "Oesophagus",
      "Large intestine"
    ],
    "The pancreas releases digestive juice through a duct into the first part of the small intestine. Its enzymes then act on carbohydrates, proteins and fats in the intestinal lumen.",
    [
      "PANCREAS-JUICE-SMALL-INTESTINE"
    ]
  ],
  [
    5,
    "Easy",
    "Which pancreatic enzyme digests proteins?",
    "Trypsin",
    [
      "Amylase",
      "Lipase",
      "Pepsin"
    ],
    "Trypsin is a protein-digesting enzyme in pancreatic juice. It acts in the small intestine. It continues protein digestion after the stomach has begun the process.",
    [
      "PANCREAS-TRYPSIN"
    ]
  ],
  [
    5,
    "Medium",
    "Pancreatic lipase acts on:",
    "Fats",
    [
      "Starch",
      "Proteins",
      "Mineral salts"
    ],
    "Lipase breaks fats into fatty acids and glycerol. Pancreatic lipase acts in the small intestine. Bile first increases fat surface area, making lipase action more effective.",
    [
      "PANCREAS-LIPASE"
    ]
  ],
  [
    5,
    "Medium",
    "Pancreatic amylase helps digest:",
    "Starch",
    [
      "Fats",
      "Proteins",
      "Vitamins"
    ],
    "Pancreatic amylase continues carbohydrate digestion in the small intestine by acting on starch. This continues the carbohydrate digestion that began with salivary amylase.",
    [
      "PANCREAS-AMYLASE"
    ]
  ],
  [
    5,
    "Medium",
    "Pancreatic juice helps protect intestinal enzymes from stomach acid because it is generally:",
    "Alkaline",
    [
      "Strongly acidic",
      "Neutral and enzyme-free",
      "Rich in hydrochloric acid"
    ],
    "Pancreatic juice contains bicarbonate and is alkaline. It helps neutralize acidic chyme entering from the stomach. Neutralization protects the intestinal lining and creates suitable conditions for digestive enzymes.",
    [
      "PANCREAS-ALKALINE"
    ]
  ],
  [
    5,
    "Hard",
    "A blockage prevents pancreatic juice from entering the small intestine. Digestion of which nutrients is likely to be most widely affected?",
    "Carbohydrates, proteins and fats",
    [
      "Vitamins only",
      "Mineral salts only",
      "Water only"
    ],
    "Pancreatic juice contains amylase, protein-digesting enzymes and lipase. Blocking it therefore impairs digestion of all three major food groups. The missing bicarbonate also makes neutralization of acidic chyme less effective.",
    [
      "PANCREATIC-DUCT-BLOCKAGE"
    ]
  ]
] as const;
