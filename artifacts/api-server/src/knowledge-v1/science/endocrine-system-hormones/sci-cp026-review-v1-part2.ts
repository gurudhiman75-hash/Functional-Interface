import type { KnowledgeV1Difficulty } from "../../types";
export type SciCp026ReviewSpec = readonly [number, KnowledgeV1Difficulty, string, string, readonly [string,string,string], string, readonly string[]];
export const PART_2: readonly SciCp026ReviewSpec[] = [
  [
    3,
    "Medium",
    "Thyroid hormones help regulate the body's:",
    "Metabolic rate",
    [
      "Blood clotting only",
      "Urine storage",
      "Vision only"
    ],
    "Thyroid hormones influence the rate at which cells use energy and therefore affect overall metabolism.",
    [
      "THYROID-METABOLISM"
    ]
  ],
  [
    3,
    "Medium",
    "Parathyroid hormone is important in regulating:",
    "Blood calcium level",
    [
      "Blood oxygen only",
      "Salivary amylase",
      "Pupil size"
    ],
    "Parathyroid hormone helps maintain calcium balance in the blood and body tissues.",
    [
      "PTH-CALCIUM"
    ]
  ],
  [
    3,
    "Hard",
    "A person has low iodine intake, reduced thyroid-hormone production and an enlarged thyroid. Which change best explains the enlargement?",
    "The thyroid is stimulated to work harder to compensate for low hormone output",
    [
      "The pancreas is producing excess insulin",
      "The adrenal gland has stopped secreting adrenaline",
      "The pituitary no longer releases any hormones"
    ],
    "Low thyroid hormone can increase stimulatory signals to the thyroid, causing the gland to enlarge when iodine remains insufficient.",
    [
      "GOITRE-FEEDBACK-REASONING"
    ]
  ],
  [
    4,
    "Easy",
    "Which hormone lowers blood glucose after a meal?",
    "Insulin",
    [
      "Glucagon",
      "Adrenaline",
      "Thyroxine"
    ],
    "Insulin helps cells take up glucose and promotes its storage, lowering blood-glucose concentration.",
    [
      "INSULIN-LOWERS-GLUCOSE"
    ]
  ],
  [
    4,
    "Easy",
    "Which cells of the pancreas secrete insulin?",
    "Beta cells",
    [
      "Alpha cells",
      "Red blood cells",
      "Acinar cells only"
    ],
    "Beta cells in the pancreatic islets secrete insulin.",
    [
      "BETA-CELLS-INSULIN"
    ]
  ],
  [
    4,
    "Medium",
    "Glucagon generally causes blood glucose to:",
    "Rise",
    [
      "Fall sharply",
      "Remain fixed at zero",
      "Convert directly into urea"
    ],
    "Glucagon raises blood glucose by promoting release of stored glucose, especially from the liver.",
    [
      "GLUCAGON-RAISES-GLUCOSE"
    ]
  ],
  [
    4,
    "Medium",
    "Insulin and glucagon work together to:",
    "Maintain blood-glucose balance",
    [
      "Control pupil size",
      "Regulate hearing",
      "Form blood clots"
    ],
    "Insulin lowers blood glucose while glucagon raises it, helping keep glucose within a suitable range.",
    [
      "INSULIN-GLUCAGON-BALANCE"
    ]
  ],
  [
    4,
    "Medium",
    "A lack of insulin most directly affects the body's ability to:",
    "Control blood glucose",
    [
      "Hear sound",
      "Clot blood",
      "Form urine in the kidneys"
    ],
    "Without enough insulin, blood glucose rises because cells cannot take up and store glucose normally.",
    [
      "INSULIN-DEFICIENCY-EFFECT"
    ]
  ],
  [
    4,
    "Hard",
    "Blood glucose rises after a carbohydrate-rich meal. Which immediate hormonal response helps restore it toward normal?",
    "Increased insulin secretion",
    [
      "Increased glucagon secretion",
      "Reduced insulin with increased glucagon",
      "Increased growth hormone only"
    ],
    "High blood glucose stimulates insulin release, which promotes glucose uptake and storage.",
    [
      "POSTMEAL-INSULIN-RESPONSE"
    ]
  ],
  [
    5,
    "Easy",
    "Adrenaline is secreted by the:",
    "Adrenal glands",
    [
      "Thyroid gland",
      "Pancreas",
      "Pituitary gland"
    ],
    "The adrenal glands, located above the kidneys, secrete adrenaline from the adrenal medulla.",
    [
      "ADRENALINE-ADRENAL"
    ]
  ],
  [
    5,
    "Easy",
    "Adrenaline is commonly associated with the:",
    "Fight-or-flight response",
    [
      "Digestion of starch",
      "Formation of urine",
      "Blood clotting"
    ],
    "Adrenaline prepares the body for rapid action during stress or danger.",
    [
      "ADRENALINE-FIGHT-FLIGHT"
    ]
  ],
  [
    5,
    "Medium",
    "During a sudden frightening situation, adrenaline can cause:",
    "Increased heart rate",
    [
      "Reduced blood flow to muscles",
      "Immediate sleep",
      "Complete stoppage of breathing"
    ],
    "Adrenaline increases heart rate and redirects resources toward organs needed for rapid action.",
    [
      "ADRENALINE-HEART-RATE"
    ]
  ],
  [
    5,
    "Medium",
    "Why does breathing rate rise during the fight-or-flight response?",
    "To increase oxygen delivery for increased activity",
    [
      "To lower oxygen supply to muscles",
      "To stop cellular respiration",
      "To reduce blood flow"
    ],
    "Adrenaline prepares tissues for intense activity, increasing oxygen demand and therefore ventilation.",
    [
      "ADRENALINE-BREATHING"
    ]
  ],
  [
    5,
    "Medium",
    "Adrenaline can raise blood glucose by promoting:",
    "Release of stored glucose",
    [
      "Conversion of glucose into urea",
      "Loss of glucose through sweat only",
      "Complete shutdown of liver metabolism"
    ],
    "Adrenaline helps mobilize stored energy, including glucose, for rapid use during stress.",
    [
      "ADRENALINE-GLUCOSE"
    ]
  ],
  [
    5,
    "Hard",
    "A person suddenly faces danger. Heart rate rises, breathing quickens and more glucose becomes available in blood. Which hormone best explains this combined response?",
    "Adrenaline",
    [
      "Insulin",
      "Thyroxine",
      "Oxytocin"
    ],
    "Adrenaline coordinates several rapid fight-or-flight changes, including increased heart rate, ventilation and energy availability.",
    [
      "ADRENALINE-INTEGRATED"
    ]
  ]
] as const;
