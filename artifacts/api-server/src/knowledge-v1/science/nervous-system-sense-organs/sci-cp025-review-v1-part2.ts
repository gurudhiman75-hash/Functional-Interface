import type { KnowledgeV1Difficulty } from "../../types";
export type SciCp025ReviewSpec = readonly [number, KnowledgeV1Difficulty, string, string, readonly [string,string,string], string, readonly string[]];
export const PART_2: readonly SciCp025ReviewSpec[] = [
  [
    3,
    "Medium",
    "Damage to the cerebellum would most directly affect:",
    "Balance and coordination",
    [
      "Formation of urine",
      "Digestion of starch",
      "Secretion of bile"
    ],
    "The cerebellum fine-tunes muscular movements and helps maintain balance.",
    [
      "CEREBELLUM-DAMAGE"
    ]
  ],
  [
    3,
    "Medium",
    "Which brain region plays an important role in temperature regulation and hunger?",
    "Hypothalamus",
    [
      "Medulla only",
      "Cerebellum",
      "Occipital bone"
    ],
    "The hypothalamus helps regulate body temperature, hunger, thirst and several homeostatic functions.",
    [
      "HYPOTHALAMUS-HOMEOSTASIS"
    ]
  ],
  [
    3,
    "Hard",
    "A person can understand a command but has great difficulty coordinating a smooth hand movement. Which part is most likely affected?",
    "Cerebellum",
    [
      "Medulla oblongata",
      "Retina",
      "Spinal nerve root only"
    ],
    "Understanding depends largely on the cerebrum, while smooth coordination of movement depends strongly on the cerebellum.",
    [
      "CEREBELLUM-COORDINATION-REASONING"
    ]
  ],
  [
    4,
    "Easy",
    "The spinal cord is protected by the:",
    "Vertebral column",
    [
      "Rib cage",
      "Skull only",
      "Pelvic girdle"
    ],
    "The spinal cord runs through the vertebral canal and is protected by the vertebral column.",
    [
      "SPINAL-CORD-PROTECTION"
    ]
  ],
  [
    4,
    "Easy",
    "A rapid automatic response to a stimulus is called a:",
    "Reflex action",
    [
      "Hormonal response",
      "Voluntary action",
      "Growth response"
    ],
    "A reflex action is a quick, automatic response that occurs without conscious planning.",
    [
      "REFLEX-ACTION"
    ]
  ],
  [
    4,
    "Medium",
    "Which structure often coordinates a simple withdrawal reflex?",
    "Spinal cord",
    [
      "Liver",
      "Cerebellum only",
      "Pituitary gland"
    ],
    "Many simple reflexes are integrated in the spinal cord, allowing a rapid response before conscious awareness.",
    [
      "REFLEX-SPINAL-CORD"
    ]
  ],
  [
    4,
    "Medium",
    "Which sequence correctly describes a simple reflex arc?",
    "Receptor → Sensory neuron → Spinal cord → Motor neuron → Effector",
    [
      "Effector → Motor neuron → Receptor → Brain",
      "Receptor → Motor neuron → Sensory neuron → Muscle",
      "Spinal cord → Receptor → Sensory neuron → Effector"
    ],
    "A reflex begins at a receptor, travels through a sensory neuron to the CNS, and returns through a motor neuron to an effector.",
    [
      "REFLEX-ARC-SEQUENCE"
    ]
  ],
  [
    4,
    "Medium",
    "Why can the hand withdraw from a hot object before the person feels pain consciously?",
    "The spinal cord can trigger the reflex before the brain processes the sensation",
    [
      "The skin has no sensory nerves",
      "The brain does not receive the signal",
      "Muscles act without any nerve signal"
    ],
    "The spinal cord can produce the withdrawal response quickly, while sensory information continues to the brain for conscious perception.",
    [
      "REFLEX-BEFORE-AWARENESS"
    ]
  ],
  [
    4,
    "Hard",
    "If a sensory neuron in a withdrawal reflex is cut, what is the most direct effect?",
    "The stimulus signal cannot reach the spinal cord normally",
    [
      "The motor neuron becomes stronger",
      "The muscle contracts continuously",
      "The receptor produces more hormones"
    ],
    "The sensory neuron carries information from the receptor to the CNS. Cutting it interrupts the incoming limb of the reflex arc.",
    [
      "REFLEX-SENSORY-NEURON-CUT"
    ]
  ],
  [
    5,
    "Easy",
    "A nerve that carries impulses from a receptor toward the CNS is a:",
    "Sensory nerve",
    [
      "Motor nerve",
      "Mixed nerve",
      "Autonomic gland"
    ],
    "Sensory nerves carry impulses from receptors to the central nervous system.",
    [
      "SENSORY-NERVE"
    ]
  ],
  [
    5,
    "Easy",
    "A nerve that carries impulses from the CNS to muscles is a:",
    "Motor nerve",
    [
      "Sensory nerve",
      "Optic receptor",
      "Endocrine nerve"
    ],
    "Motor nerves carry commands from the CNS to effectors such as skeletal muscles.",
    [
      "MOTOR-NERVE"
    ]
  ],
  [
    5,
    "Medium",
    "A mixed nerve contains:",
    "Both sensory and motor fibres",
    [
      "Only sensory fibres",
      "Only motor fibres",
      "Only endocrine cells"
    ],
    "Mixed nerves carry both incoming sensory impulses and outgoing motor impulses.",
    [
      "MIXED-NERVE"
    ]
  ],
  [
    5,
    "Medium",
    "Which system controls involuntary functions such as changes in heart rate and gut movement?",
    "Autonomic nervous system",
    [
      "Somatic nervous system only",
      "Skeletal system",
      "Endocrine pancreas only"
    ],
    "The autonomic nervous system regulates many involuntary activities of internal organs.",
    [
      "AUTONOMIC-SYSTEM"
    ]
  ],
  [
    5,
    "Medium",
    "Which division controls voluntary movement of skeletal muscles?",
    "Somatic nervous system",
    [
      "Autonomic nervous system",
      "Endocrine system",
      "Lymphatic system"
    ],
    "The somatic nervous system carries motor commands to skeletal muscles and supports voluntary movement.",
    [
      "SOMATIC-SYSTEM"
    ]
  ],
  [
    5,
    "Hard",
    "A person can feel a touch on the hand but cannot voluntarily move the same hand. Which pathway is more likely damaged?",
    "Motor pathway",
    [
      "Sensory pathway",
      "Retinal pathway",
      "Auditory pathway"
    ],
    "Preserved sensation suggests the sensory pathway still works, while loss of voluntary movement points to a motor-pathway problem.",
    [
      "SENSORY-MOTOR-DISCRIMINATION"
    ]
  ]
] as const;
