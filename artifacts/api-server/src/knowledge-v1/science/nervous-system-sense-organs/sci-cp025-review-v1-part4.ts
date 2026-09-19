import type { KnowledgeV1Difficulty } from "../../types";
export type SciCp025ReviewSpec = readonly [number, KnowledgeV1Difficulty, string, string, readonly [string,string,string], string, readonly string[]];
export const PART_4: readonly SciCp025ReviewSpec[] = [
  [
    8,
    "Medium",
    "Which inner-ear structure converts sound vibrations into nerve signals?",
    "Cochlea",
    [
      "Pinna",
      "Eustachian tube",
      "Eardrum"
    ],
    "The cochlea contains sensory hair cells that convert mechanical vibrations into electrical nerve signals.",
    [
      "COCHLEA-HEARING"
    ]
  ],
  [
    8,
    "Medium",
    "The semicircular canals are important for:",
    "Balance and detection of head movement",
    [
      "Hearing pitch only",
      "Vision in dim light",
      "Taste"
    ],
    "The semicircular canals detect rotational movement of the head and contribute to balance.",
    [
      "SEMICIRCULAR-CANALS"
    ]
  ],
  [
    8,
    "Hard",
    "A person hears normally but has difficulty maintaining balance after inner-ear damage. Which structure is most likely affected?",
    "Semicircular canals",
    [
      "Pinna",
      "Eardrum",
      "Auditory canal"
    ],
    "Normal hearing with impaired balance points to damage of vestibular structures such as the semicircular canals.",
    [
      "BALANCE-INNER-EAR"
    ]
  ],
  [
    9,
    "Easy",
    "Receptors for smell are located in the:",
    "Nasal cavity",
    [
      "Tongue only",
      "Middle ear",
      "Retina"
    ],
    "Olfactory receptors in the upper nasal cavity detect airborne chemical molecules.",
    [
      "SMELL-RECEPTORS"
    ]
  ],
  [
    9,
    "Medium",
    "Taste buds are found largely on the:",
    "Tongue",
    [
      "Cornea",
      "Eardrum",
      "Nasal hairs"
    ],
    "Taste buds on the tongue contain receptor cells that respond to dissolved chemicals in food.",
    [
      "TASTE-BUDS"
    ]
  ],
  [
    9,
    "Medium",
    "Which receptors in the skin detect pressure and touch?",
    "Mechanoreceptors",
    [
      "Photoreceptors",
      "Chemoreceptors only",
      "Osmoreceptors only"
    ],
    "Skin contains mechanoreceptors that respond to touch, pressure and vibration.",
    [
      "SKIN-MECHANORECEPTORS"
    ]
  ],
  [
    9,
    "Medium",
    "Why does food often seem less flavourful when the nose is blocked?",
    "Smell contributes strongly to flavour perception",
    [
      "Taste buds stop working completely",
      "The tongue loses all nerves",
      "Saliva cannot form"
    ],
    "Flavour depends on both taste and smell. Blocking airflow to olfactory receptors reduces the smell component.",
    [
      "SMELL-TASTE-FLAVOUR"
    ]
  ],
  [
    9,
    "Hard",
    "A person can taste sweetness and saltiness but cannot detect the aroma of food. Which sensory pathway is most likely impaired?",
    "Olfactory pathway",
    [
      "Optic pathway",
      "Auditory pathway",
      "Motor pathway to the hand"
    ],
    "Taste is intact, but loss of aroma perception points to the smell, or olfactory, pathway.",
    [
      "OLFACTORY-LOSS-REASONING"
    ]
  ],
  [
    9,
    "Hard",
    "Touching a hot surface activates temperature and pain receptors before the hand is withdrawn. Which sequence is correct?",
    "Receptor activation → Sensory signal → CNS processing → Motor response",
    [
      "Motor response → Receptor activation → CNS processing",
      "CNS processing → Receptor activation → Sensory signal",
      "Receptor activation → Hormone release only → Motor response"
    ],
    "Receptors detect the stimulus, sensory neurons carry the signal to the CNS, and motor pathways activate the muscles.",
    [
      "SENSORY-RESPONSE-SEQUENCE"
    ]
  ],
  [
    10,
    "Easy",
    "Which sense organ contains the retina?",
    "Eye",
    [
      "Ear",
      "Nose",
      "Tongue"
    ],
    "The retina is the light-sensitive layer at the back of the eye.",
    [
      "RETINA-EYE"
    ]
  ],
  [
    10,
    "Medium",
    "A receptor detects a change in the environment. What happens next in a typical nervous response?",
    "A sensory neuron carries the signal toward the CNS",
    [
      "A motor neuron carries the signal first to the receptor",
      "A hormone always reaches the brain before any nerve impulse",
      "The effector responds before the stimulus is detected"
    ],
    "After a receptor is stimulated, sensory neurons carry information toward the CNS for processing.",
    [
      "RECEPTOR-TO-CNS"
    ]
  ],
  [
    10,
    "Medium",
    "Why is the pupil smaller in bright light?",
    "The iris constricts it to reduce light entry",
    [
      "The retina pushes it closed",
      "The optic nerve becomes shorter",
      "The lens turns opaque"
    ],
    "In bright light, circular muscles of the iris reduce pupil size and limit the amount of light reaching the retina.",
    [
      "PUPIL-BRIGHT-LIGHT"
    ]
  ],
  [
    10,
    "Medium",
    "A person can hear a sound but cannot identify its meaning after a brain injury. Which statement is most accurate?",
    "The ear may detect sound normally while brain processing is impaired",
    [
      "The eardrum must be absent",
      "The cochlea must contain no fluid",
      "The pinna has stopped collecting sound"
    ],
    "Sensation begins in the ear, but interpretation occurs in the brain. Hearing can therefore be detected without normal recognition.",
    [
      "HEARING-BRAIN-PROCESSING"
    ]
  ],
  [
    10,
    "Hard",
    "A patient has intact leg muscles and motor nerves but cannot feel pinprick sensation in the leg. Which component is most likely affected?",
    "Sensory pathway",
    [
      "Motor pathway only",
      "Cerebellar motor output only",
      "Endocrine pathway"
    ],
    "Normal movement with absent sensation points to damage in the sensory pathway carrying signals toward the CNS.",
    [
      "SENSORY-PATHWAY-LOSS"
    ]
  ],
  [
    10,
    "Hard",
    "Why can damage to the spinal cord affect both sensation and movement below the injury?",
    "Ascending sensory and descending motor pathways both pass through it",
    [
      "The spinal cord produces all hormones",
      "The spinal cord supplies blood to every muscle directly",
      "All sense organs are located inside it"
    ],
    "The spinal cord carries sensory information upward and motor commands downward, so injury can disrupt both types of pathways.",
    [
      "SPINAL-CORD-MIXED-PATHWAYS"
    ]
  ]
] as const;
