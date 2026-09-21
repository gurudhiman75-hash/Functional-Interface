import type { KnowledgeV1Difficulty } from "../../types";
export type SciCp026ReviewSpec = readonly [number, KnowledgeV1Difficulty, string, string, readonly [string,string,string], string, readonly string[]];
export const PART_1: readonly SciCp026ReviewSpec[] = [
  [
    1,
    "Easy",
    "Hormones are chemical messengers secreted by:",
    "Endocrine glands",
    [
      "Bones",
      "Red blood cells",
      "Digestive fibres"
    ],
    "Endocrine glands release hormones into the blood, which carries them to target organs or tissues. Unlike exocrine glands, endocrine glands do not send their products through ducts.",
    [
      "HORMONES-ENDOCRINE-GLANDS"
    ]
  ],
  [
    1,
    "Easy",
    "Endocrine glands are called ductless glands because they:",
    "Release hormones directly into the blood",
    [
      "Have no blood supply",
      "Produce only digestive juices",
      "Store hormones in ducts"
    ],
    "Endocrine glands do not use ducts. Their hormones enter nearby blood vessels and travel through the circulation. This allows hormones to reach distant organs through the circulation.",
    [
      "ENDOCRINE-DUCTLESS"
    ]
  ],
  [
    1,
    "Medium",
    "A hormone affects only certain cells because those cells have:",
    "Specific receptors for that hormone",
    [
      "More red blood cells",
      "Thicker cell walls",
      "More water"
    ],
    "Target cells respond to a hormone only if they possess the appropriate receptor. Cells without the matching receptor usually show little or no direct response.",
    [
      "HORMONE-TARGET-RECEPTORS"
    ]
  ],
  [
    1,
    "Medium",
    "How do hormones usually reach distant target organs?",
    "Through the bloodstream",
    [
      "Through xylem",
      "Through the alimentary canal",
      "Through the spinal cord only"
    ],
    "Hormones are carried in blood from the gland that secretes them to target tissues elsewhere in the body. The blood distributes the signal widely, but only responsive target cells act on it.",
    [
      "HORMONE-BLOOD-TRANSPORT"
    ]
  ],
  [
    1,
    "Medium",
    "Compared with nerve impulses, hormonal responses are often:",
    "Slower in onset but longer lasting",
    [
      "Always faster and shorter",
      "Restricted to neurons only",
      "Independent of target receptors"
    ],
    "Hormones travel through the blood and may act for longer periods, while nerve signals are usually faster and brief. Endocrine control is therefore well suited to sustained regulation such as growth and metabolism.",
    [
      "HORMONE-VS-NERVE-TIMING"
    ]
  ],
  [
    1,
    "Hard",
    "A chemical is released by a gland into blood and changes the activity of only cells bearing a matching receptor. This chemical is best described as a:",
    "Hormone",
    [
      "Digestive enzyme",
      "Antibody",
      "Neurotransmitter confined to one synapse"
    ],
    "Hormones are blood-borne chemical messengers that act on cells with suitable receptors. Its defining features are secretion, transport and receptor-specific action.",
    [
      "HORMONE-DEFINITION-REASONING"
    ]
  ],
  [
    2,
    "Easy",
    "Which gland is often called the master gland of the endocrine system?",
    "Pituitary gland",
    [
      "Thyroid gland",
      "Adrenal gland",
      "Pancreas"
    ],
    "The pituitary is often called the master gland because several of its hormones regulate other endocrine glands. It is itself regulated closely by the hypothalamus.",
    [
      "PITUITARY-MASTER"
    ]
  ],
  [
    2,
    "Easy",
    "Growth hormone is secreted by the:",
    "Pituitary gland",
    [
      "Thyroid gland",
      "Pancreas",
      "Adrenal medulla"
    ],
    "Growth hormone is produced by the anterior pituitary and influences growth of bones and other tissues. Its effects are partly mediated through growth-promoting factors produced in other tissues.",
    [
      "GROWTH-HORMONE-PITUITARY"
    ]
  ],
  [
    2,
    "Medium",
    "Growth hormone has an important role in:",
    "Growth of bones and body tissues",
    [
      "Formation of bile",
      "Blood clotting",
      "Urine storage"
    ],
    "Growth hormone supports normal growth, especially during childhood and adolescence. It also influences protein synthesis and metabolism during growth. Normal growth therefore depends on adequate hormone action while the skeleton is still developing.",
    [
      "GH-GROWTH"
    ]
  ],
  [
    2,
    "Medium",
    "Excess growth hormone during childhood can lead to:",
    "Gigantism",
    [
      "Dwarfism from GH deficiency",
      "Goitre",
      "Diabetes insipidus"
    ],
    "Too much growth hormone before the growth plates close can cause excessive height, called gigantism. The effect occurs because long bones can still lengthen before growth plates close.",
    [
      "GH-EXCESS-GIGANTISM"
    ]
  ],
  [
    2,
    "Medium",
    "Deficiency of growth hormone in childhood may cause:",
    "Pituitary dwarfism",
    [
      "Gigantism",
      "Hyperthyroidism",
      "Excess insulin secretion"
    ],
    "Too little growth hormone during childhood can result in proportionate short stature called pituitary dwarfism. Body proportions are generally preserved in classic pituitary growth-hormone deficiency.",
    [
      "GH-DEFICIENCY-DWARFISM"
    ]
  ],
  [
    2,
    "Hard",
    "A child has normal nutrition and thyroid function but shows markedly reduced linear growth due to a hormone deficiency. Which hormone is the strongest candidate?",
    "Growth hormone",
    [
      "Adrenaline",
      "Insulin",
      "Thyroxine only"
    ],
    "When nutrition and thyroid function are normal, deficient pituitary growth hormone can directly reduce childhood growth. The clue is reduced linear growth despite adequate nutrition and normal thyroid status.",
    [
      "GH-DEFICIENCY-REASONING"
    ]
  ],
  [
    3,
    "Easy",
    "Which hormone is secreted by the thyroid gland?",
    "Thyroxine",
    [
      "Insulin",
      "Adrenaline",
      "Growth hormone"
    ],
    "The thyroid gland secretes thyroid hormones, commonly represented in general science by thyroxine. These hormones influence metabolism, growth and development throughout the body.",
    [
      "THYROID-THYROXINE"
    ]
  ],
  [
    3,
    "Easy",
    "Which mineral is required for normal synthesis of thyroid hormone?",
    "Iodine",
    [
      "Iron",
      "Calcium only",
      "Sodium only"
    ],
    "Iodine is an essential component of thyroid hormones such as thyroxine. Without enough iodine, the gland cannot synthesize normal amounts of thyroid hormone.",
    [
      "IODINE-THYROID"
    ]
  ],
  [
    3,
    "Medium",
    "Iodine deficiency can cause enlargement of the thyroid gland known as:",
    "Goitre",
    [
      "Diabetes mellitus",
      "Gigantism",
      "Anaemia"
    ],
    "When iodine intake is too low, the thyroid may enlarge as it tries to produce adequate thyroid hormone. Persistent stimulation can enlarge the gland while hormone production remains inadequate.",
    [
      "IODINE-GOITRE"
    ]
  ]
] as const;
