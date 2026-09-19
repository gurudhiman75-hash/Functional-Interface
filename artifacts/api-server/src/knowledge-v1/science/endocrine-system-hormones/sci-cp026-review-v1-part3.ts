import type { KnowledgeV1Difficulty } from "../../types";
export type SciCp026ReviewSpec = readonly [number, KnowledgeV1Difficulty, string, string, readonly [string,string,string], string, readonly string[]];
export const PART_3: readonly SciCp026ReviewSpec[] = [
  [
    6,
    "Easy",
    "Which hormone is produced in the testes?",
    "Testosterone",
    [
      "Oestrogen",
      "Progesterone",
      "Thyroxine"
    ],
    "The testes secrete testosterone, which contributes to male reproductive development and secondary sexual characteristics.",
    [
      "TESTOSTERONE-TESTES"
    ]
  ],
  [
    6,
    "Easy",
    "Which hormone is strongly associated with female secondary sexual characteristics?",
    "Oestrogen",
    [
      "Insulin",
      "Adrenaline",
      "Growth hormone"
    ],
    "Oestrogen, produced largely by the ovaries, supports female reproductive development and secondary sexual characteristics.",
    [
      "OESTROGEN-SECONDARY-CHARACTERS"
    ]
  ],
  [
    6,
    "Medium",
    "Progesterone helps support the:",
    "Uterine lining during the reproductive cycle",
    [
      "Formation of red blood cells only",
      "Secretion of saliva",
      "Contraction of the pupil"
    ],
    "Progesterone helps maintain the uterine lining, especially after ovulation and during early pregnancy.",
    [
      "PROGESTERONE-UTERINE-LINING"
    ]
  ],
  [
    6,
    "Medium",
    "Testosterone contributes to which change at puberty in males?",
    "Development of secondary sexual characteristics",
    [
      "Reduction in muscle mass",
      "Loss of body hair",
      "Cessation of reproductive-organ growth"
    ],
    "Testosterone promotes changes such as deeper voice, facial hair and increased muscle development during puberty.",
    [
      "TESTOSTERONE-PUBERTY"
    ]
  ],
  [
    6,
    "Medium",
    "Ovarian hormones include:",
    "Oestrogen and progesterone",
    [
      "Insulin and glucagon",
      "Adrenaline and thyroxine",
      "Growth hormone and ADH"
    ],
    "The ovaries produce oestrogen and progesterone, both important in female reproductive physiology.",
    [
      "OVARIAN-HORMONES"
    ]
  ],
  [
    6,
    "Hard",
    "A hormone from the ovaries rises after ovulation and helps maintain the uterine lining. Which hormone is it?",
    "Progesterone",
    [
      "Adrenaline",
      "Insulin",
      "Growth hormone"
    ],
    "Progesterone rises after ovulation and helps prepare and maintain the uterine lining.",
    [
      "PROGESTERONE-AFTER-OVULATION"
    ]
  ],
  [
    7,
    "Easy",
    "ADH helps control the body's:",
    "Water balance",
    [
      "Blood group",
      "Hearing",
      "Vision"
    ],
    "Antidiuretic hormone increases water reabsorption by the kidneys and helps regulate body-water balance.",
    [
      "ADH-WATER-BALANCE"
    ]
  ],
  [
    7,
    "Easy",
    "Oxytocin is closely associated with:",
    "Uterine contractions during childbirth",
    [
      "Lowering blood glucose",
      "Increasing metabolic rate",
      "Forming red blood cells"
    ],
    "Oxytocin stimulates uterine contractions during labour and also helps milk ejection after childbirth.",
    [
      "OXYTOCIN-LABOUR"
    ]
  ],
  [
    7,
    "Medium",
    "When ADH level rises, urine usually becomes:",
    "More concentrated",
    [
      "More dilute",
      "Free of urea",
      "Rich in glucose"
    ],
    "Higher ADH increases water reabsorption in the kidneys, producing a smaller volume of more concentrated urine.",
    [
      "ADH-CONCENTRATED-URINE"
    ]
  ],
  [
    7,
    "Medium",
    "A fall in ADH generally causes:",
    "More water to be lost in urine",
    [
      "More water to be reabsorbed",
      "Blood glucose to fall directly",
      "Thyroid hormone to rise immediately"
    ],
    "Low ADH reduces water reabsorption, so urine volume increases.",
    [
      "LOW-ADH-WATER-LOSS"
    ]
  ],
  [
    7,
    "Medium",
    "Melatonin is secreted by the pineal gland and helps regulate:",
    "Sleep-wake cycles",
    [
      "Blood glucose after meals",
      "Blood clotting",
      "Digestion of fats"
    ],
    "Melatonin helps coordinate daily biological rhythms, especially the sleep-wake cycle.",
    [
      "MELATONIN-SLEEP"
    ]
  ],
  [
    7,
    "Hard",
    "A person produces unusually large amounts of dilute urine because the kidneys are not conserving water properly. Deficiency of which hormone could explain this?",
    "ADH",
    [
      "Insulin",
      "Adrenaline",
      "Thyroxine"
    ],
    "ADH promotes water reabsorption in the kidneys. Too little ADH can cause excessive dilute urine.",
    [
      "ADH-DEFICIENCY-POLYURIA"
    ]
  ],
  [
    8,
    "Easy",
    "Which system usually produces the faster response to a stimulus?",
    "Nervous system",
    [
      "Endocrine system",
      "Skeletal system",
      "Digestive system"
    ],
    "Nervous responses are generally faster because electrical impulses travel rapidly along neurons.",
    [
      "NERVOUS-FASTER"
    ]
  ],
  [
    8,
    "Easy",
    "Hormones are generally transported through the:",
    "Blood",
    [
      "Airways",
      "Bile ducts",
      "Spinal canal only"
    ],
    "Endocrine hormones enter the bloodstream and travel to their target tissues.",
    [
      "HORMONES-THROUGH-BLOOD"
    ]
  ],
  [
    8,
    "Medium",
    "Negative feedback helps maintain homeostasis by:",
    "Reducing a change once the desired level is restored",
    [
      "Amplifying every change without limit",
      "Stopping all hormone secretion permanently",
      "Preventing target cells from having receptors"
    ],
    "Negative feedback counteracts deviations and helps restore internal conditions toward a set range.",
    [
      "NEGATIVE-FEEDBACK"
    ]
  ]
] as const;
