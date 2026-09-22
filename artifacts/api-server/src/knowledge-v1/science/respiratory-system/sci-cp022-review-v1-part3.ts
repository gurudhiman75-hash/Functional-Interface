import type { KnowledgeV1Difficulty } from "../../types";
export type SciCp022ReviewSpec = readonly [number, KnowledgeV1Difficulty, string, string, readonly [string,string,string], string, readonly string[]];
export const PART_3: readonly SciCp022ReviewSpec[] = [
  [
    6,
    "Easy",
    "Which substance in red blood cells carries most of the oxygen?",
    "Haemoglobin",
    [
      "Plasma glucose",
      "Fibrin",
      "Platelets"
    ],
    "Haemoglobin binds oxygen in the lungs and carries it in red blood cells to body tissues. The iron-containing haem group binds oxygen reversibly for transport.",
    [
      "HAEMOGLOBIN-OXYGEN"
    ]
  ],
  [
    6,
    "Easy",
    "The compound formed when oxygen binds with haemoglobin is called:",
    "Oxyhaemoglobin",
    [
      "Carboxyhaemoglobin",
      "Bicarbonate",
      "Fibrinogen"
    ],
    "Oxygen combines reversibly with haemoglobin to form oxyhaemoglobin, especially in the lungs. The bond loosens in tissues where oxygen concentration is lower.",
    [
      "OXYHAEMOGLOBIN"
    ]
  ],
  [
    6,
    "Medium",
    "In what form is most carbon dioxide transported in the blood?",
    "Bicarbonate ions",
    [
      "Dissolved carbon dioxide in plasma",
      "Carbaminohaemoglobin",
      "Oxyhaemoglobin"
    ],
    "Much of the carbon dioxide entering blood is converted into bicarbonate ions and carried in the plasma. This conversion allows large amounts of carbon dioxide to be transported efficiently.",
    [
      "CO2-BICARBONATE"
    ]
  ],
  [
    6,
    "Medium",
    "Why does oxygen move from the blood into body tissues?",
    "Tissues have a lower oxygen level than oxygenated blood",
    [
      "Tissues contain no water",
      "Haemoglobin is absent from blood",
      "Carbon dioxide cannot diffuse"
    ],
    "Active tissues continually use oxygen, keeping their oxygen level lower than that of incoming blood and favouring diffusion into cells.",
    [
      "OXYGEN-TISSUE-DIFFUSION"
    ]
  ],
  [
    6,
    "Medium",
    "Carbon monoxide is dangerous because it:",
    "Binds strongly to haemoglobin and reduces oxygen transport",
    [
      "Increases oxygen binding without limit",
      "Acts as a digestive enzyme",
      "Converts alveoli into bronchi"
    ],
    "Carbon monoxide has a high affinity for haemoglobin and occupies oxygen-binding sites, reducing the blood's oxygen-carrying capacity. Even a relatively small exposure can therefore reduce oxygen delivery to tissues.",
    [
      "CO-HAEMOGLOBIN"
    ]
  ],
  [
    6,
    "Hard",
    "A person has healthy lungs but very low haemoglobin. Why may the person still feel breathless during exertion?",
    "The blood cannot carry enough oxygen efficiently",
    [
      "The nose cannot filter dust",
      "The diaphragm cannot change chest volume",
      "The alveoli stop containing air"
    ],
    "Even with normal gas exchange, too little haemoglobin reduces the amount of oxygen blood can transport to active tissues. The limitation is transport capacity rather than movement of oxygen across the alveoli.",
    [
      "LOW-HB-OXYGEN-TRANSPORT"
    ]
  ],
  [
    7,
    "Easy",
    "Aerobic respiration requires:",
    "Oxygen",
    [
      "Only nitrogen",
      "Bile",
      "Sunlight"
    ],
    "Aerobic respiration uses oxygen to release energy from food molecules such as glucose. It yields much more ATP from glucose than anaerobic respiration does.",
    [
      "AEROBIC-OXYGEN"
    ]
  ],
  [
    7,
    "Easy",
    "Anaerobic respiration in human muscle cells can produce:",
    "Lactic acid",
    [
      "Alcohol as the main human muscle product",
      "Urea directly",
      "Bile"
    ],
    "When oxygen supply is insufficient, muscle cells can release some energy anaerobically and form lactic acid. This pathway provides rapid ATP but is less efficient than aerobic respiration.",
    [
      "MUSCLE-ANAEROBIC-LACTIC"
    ]
  ],
  [
    7,
    "Medium",
    "Compared with anaerobic respiration, aerobic respiration generally releases:",
    "More energy from each glucose molecule",
    [
      "Less energy from each glucose molecule",
      "No usable energy",
      "Only heat and no ATP"
    ],
    "Aerobic respiration breaks down glucose more completely and therefore yields much more usable energy. Oxygen permits complete oxidation of glucose to carbon dioxide and water.",
    [
      "AEROBIC-MORE-ENERGY"
    ]
  ],
  [
    7,
    "Medium",
    "Most aerobic respiration in eukaryotic cells takes place in the:",
    "Mitochondria",
    [
      "Golgi apparatus",
      "Lysosomes",
      "Nucleus"
    ],
    "Mitochondria carry out major stages of aerobic respiration and produce most cellular ATP. Their inner membranes contain many enzymes involved in ATP production.",
    [
      "RESPIRATION-MITOCHONDRIA"
    ]
  ],
  [
    7,
    "Medium",
    "In yeast, anaerobic respiration can produce:",
    "Alcohol and carbon dioxide",
    [
      "Lactic acid only",
      "Oxygen and water only",
      "Protein and starch"
    ],
    "Yeast can respire anaerobically by fermentation, producing ethanol and carbon dioxide. This fermentation process is used in bread making and alcoholic-beverage production.",
    [
      "YEAST-ANAEROBIC"
    ]
  ],
  [
    7,
    "Hard",
    "During a short, very intense sprint, muscle cells may partly use anaerobic respiration because:",
    "Oxygen supply cannot immediately meet the high energy demand",
    [
      "The lungs cannot increase ventilation at all",
      "Muscle cells cannot use glucose aerobically",
      "Carbon dioxide production stops during exercise"
    ],
    "During intense exercise, energy demand can rise faster than oxygen delivery. Anaerobic pathways then contribute temporarily to ATP production. It helps supply energy until oxygen delivery catches up with muscular demand.",
    [
      "EXERCISE-ANAEROBIC"
    ]
  ],
  [
    8,
    "Easy",
    "During vigorous exercise, breathing rate usually:",
    "Increases",
    [
      "Decreases to zero",
      "Remains exactly unchanged",
      "Stops temporarily"
    ],
    "Working muscles use more oxygen and produce more carbon dioxide, so ventilation usually increases. The increase raises oxygen intake and speeds removal of carbon dioxide.",
    [
      "EXERCISE-BREATHING-RATE"
    ]
  ],
  [
    8,
    "Easy",
    "The main reason breathing becomes faster during exercise is to:",
    "Increase oxygen uptake and carbon dioxide removal",
    [
      "Increase bile secretion",
      "Reduce digestion of starch",
      "Stop cellular respiration"
    ],
    "Active muscles require more oxygen and produce more carbon dioxide, so breathing rate and depth rise to support gas exchange.",
    [
      "EXERCISE-VENTILATION-PURPOSE"
    ]
  ],
  [
    8,
    "Medium",
    "Why may breathing remain rapid for some time after exercise stops?",
    "Returning oxygen and carbon dioxide levels toward normal",
    [
      "Producing more food in the lungs",
      "Stopping blood circulation",
      "Preventing all cellular respiration"
    ],
    "Elevated breathing after exercise helps meet recovery needs and remove excess carbon dioxide while restoring normal internal conditions. Oxygen is also needed for several processes that restore muscle chemistry after intense activity.",
    [
      "POST-EXERCISE-BREATHING"
    ]
  ]
] as const;
