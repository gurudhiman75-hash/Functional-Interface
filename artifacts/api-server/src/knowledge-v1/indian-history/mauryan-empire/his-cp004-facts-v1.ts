export const HIS_CP004_SOURCES_V1=[
  ["NCERT-THEMES-I-KINGS-FARMERS-TOWNS","NCERT Themes in Indian History I — Kings, Farmers and Towns","https://ncert.nic.in/textbook/pdf/lehs102.pdf","textbook"],
  ["NIOS-HISTORY-315-LESSON30A-EARLY-STATES","NIOS History 315 — Lesson 30A: Evolution of State in India","https://digital.nios.ac.in/content/315en/315_History_Eng_Lesson30A.pdf","textbook"],
] as const;

type Fact=readonly[id:string,sentence:string,sourceIds:readonly string[]];

export const HIS_CP004_FACTS_V1:readonly Fact[]=[
  ["maur-founder","Chandragupta Maurya founded the Mauryan Empire after overthrowing the Nanda dynasty.",["NCERT-THEMES-I-KINGS-FARMERS-TOWNS","NIOS-HISTORY-315-LESSON30A-EARLY-STATES"]],
  ["maur-capital","Pataliputra was the imperial capital of the Mauryan Empire.",["NCERT-THEMES-I-KINGS-FARMERS-TOWNS","NIOS-HISTORY-315-LESSON30A-EARLY-STATES"]],
  ["maur-chandra-northwest","Chandragupta Maurya extended Mauryan control as far northwest as Afghanistan and Baluchistan.",["NCERT-THEMES-I-KINGS-FARMERS-TOWNS"]],
  ["maur-bindusara-expansion","Bindusara expanded Mauryan power into parts of central and southern India.",["NIOS-HISTORY-315-LESSON30A-EARLY-STATES"]],
  ["maur-ashoka-kalinga","Ashoka conquered Kalinga, in the region of present-day coastal Odisha.",["NCERT-THEMES-I-KINGS-FARMERS-TOWNS"]],
  ["maur-ruler-sequence","The main Mauryan ruler sequence is Chandragupta Maurya, Bindusara and then Ashoka.",["NCERT-THEMES-I-KINGS-FARMERS-TOWNS","NIOS-HISTORY-315-LESSON30A-EARLY-STATES"]],
  ["maur-duration","The Mauryan Empire lasted for roughly a century and a half.",["NCERT-THEMES-I-KINGS-FARMERS-TOWNS"]],
  ["maur-end-sunga","Mauryan rule ended around the second century BCE, followed in Magadha by the Shunga dynasty.",["NIOS-HISTORY-315-LESSON30A-EARLY-STATES"]],

  ["src-megasthenes","Megasthenes was a Greek ambassador at the court of Chandragupta Maurya, and his account survives only in fragments.",["NCERT-THEMES-I-KINGS-FARMERS-TOWNS"]],
  ["src-arthashastra","The Arthashastra is linked with Kautilya or Chanakya, who was traditionally regarded as Chandragupta Maurya's minister.",["NCERT-THEMES-I-KINGS-FARMERS-TOWNS"]],
  ["src-ashoka-inscriptions","Ashoka's rock and pillar inscriptions are among the most valuable records for studying the Mauryan period.",["NCERT-THEMES-I-KINGS-FARMERS-TOWNS"]],
  ["src-prinsep","James Prinsep deciphered Brahmi and Kharosthi in the 1830s.",["NCERT-THEMES-I-KINGS-FARMERS-TOWNS"]],
  ["src-piyadassi","Piyadassi means 'pleasant to behold' and appears as a title in inscriptions connected with Ashoka.",["NCERT-THEMES-I-KINGS-FARMERS-TOWNS"]],
  ["src-devanampiya","Devanampiya is a title used in Ashokan inscriptions and is commonly translated as 'beloved of the gods'.",["NCERT-THEMES-I-KINGS-FARMERS-TOWNS"]],
  ["src-epigraphy","Epigraphy is the study of inscriptions.",["NCERT-THEMES-I-KINGS-FARMERS-TOWNS"]],

  ["dhamma-kalinga-remorse","After the conquest of Kalinga, an Ashokan inscription expresses repentance over the suffering caused by the war and a stronger commitment to dhamma.",["NCERT-THEMES-I-KINGS-FARMERS-TOWNS"]],
  ["dhamma-elders","Ashoka's dhamma included respect for elders.",["NCERT-THEMES-I-KINGS-FARMERS-TOWNS"]],
  ["dhamma-generosity","Ashoka's dhamma encouraged generosity towards Brahmanas and people who had renounced worldly life.",["NCERT-THEMES-I-KINGS-FARMERS-TOWNS"]],
  ["dhamma-servants","Ashoka's dhamma called for kind treatment of slaves and servants.",["NCERT-THEMES-I-KINGS-FARMERS-TOWNS"]],
  ["dhamma-religions","Ashoka's dhamma promoted respect for religions and traditions other than one's own.",["NCERT-THEMES-I-KINGS-FARMERS-TOWNS"]],
  ["dhamma-mahamatta","Ashoka appointed officers called dhamma mahamattas to spread the message of dhamma.",["NCERT-THEMES-I-KINGS-FARMERS-TOWNS"]],
  ["dhamma-purpose","Ashoka presented dhamma as a way to support the well-being of people.",["NCERT-THEMES-I-KINGS-FARMERS-TOWNS"]],

  ["insc-stone-surfaces","Ashoka had messages inscribed on natural rocks and polished stone pillars.",["NCERT-THEMES-I-KINGS-FARMERS-TOWNS"]],
  ["insc-prakrit","Most Ashokan inscriptions were written in Prakrit.",["NCERT-THEMES-I-KINGS-FARMERS-TOWNS"]],
  ["insc-brahmi","Most Prakrit Ashokan inscriptions were written in the Brahmi script.",["NCERT-THEMES-I-KINGS-FARMERS-TOWNS"]],
  ["insc-kharosthi","Some Ashokan inscriptions in the northwest were written in Kharosthi.",["NCERT-THEMES-I-KINGS-FARMERS-TOWNS"]],
  ["insc-aramaic-greek","Aramaic and Greek were used in Ashokan inscriptions in the northwestern and Afghan regions.",["NCERT-THEMES-I-KINGS-FARMERS-TOWNS"]],
  ["insc-first-stone-messages","Ashoka was the first ruler to inscribe messages to subjects and officials on stone on such a wide scale.",["NCERT-THEMES-I-KINGS-FARMERS-TOWNS"]],

  ["admin-five-centres","The five major Mauryan political centres under Ashoka were Pataliputra, Taxila, Ujjayini, Tosali and Suvarnagiri.",["NCERT-THEMES-I-KINGS-FARMERS-TOWNS"]],
  ["admin-taxila-north","Taxila served as an important northern or northwestern provincial centre.",["NIOS-HISTORY-315-LESSON30A-EARLY-STATES"]],
  ["admin-ujjain-west","Ujjain or Ujjayini served as the western provincial centre.",["NIOS-HISTORY-315-LESSON30A-EARLY-STATES"]],
  ["admin-tosali-east","Tosali served as the eastern provincial centre.",["NIOS-HISTORY-315-LESSON30A-EARLY-STATES"]],
  ["admin-suvarnagiri-south","Suvarnagiri served as the southern provincial centre.",["NIOS-HISTORY-315-LESSON30A-EARLY-STATES"]],
  ["admin-kumara","A Mauryan province could be governed by a kumara, a royal prince acting as the king's representative.",["NIOS-HISTORY-315-LESSON30A-EARLY-STATES"]],
  ["admin-mahamatyas","The kumara was assisted by mahamatyas and a council of ministers.",["NIOS-HISTORY-315-LESSON30A-EARLY-STATES"]],
  ["admin-mantriparishad","At the imperial level, the emperor was assisted by the Mantriparishad, or council of ministers.",["NIOS-HISTORY-315-LESSON30A-EARLY-STATES"]],
  ["admin-nonuniform","Mauryan administration was not equally uniform or equally strong across every part of the empire.",["NCERT-THEMES-I-KINGS-FARMERS-TOWNS","NIOS-HISTORY-315-LESSON30A-EARLY-STATES"]],
  ["admin-strong-centres","Administrative control was strongest around Pataliputra and the provincial centres.",["NCERT-THEMES-I-KINGS-FARMERS-TOWNS"]],
  ["admin-routes","Land and river routes were vital for communication between the imperial centre and the provinces.",["NCERT-THEMES-I-KINGS-FARMERS-TOWNS"]],
  ["admin-trade-centres","Taxila and Ujjayini were located on important long-distance trade routes.",["NCERT-THEMES-I-KINGS-FARMERS-TOWNS"]],

  ["mil-six-subcommittees","Megasthenes described a military committee with six subcommittees.",["NCERT-THEMES-I-KINGS-FARMERS-TOWNS"]],
  ["mil-six-branches","The six military subcommittees dealt with the navy, transport and provisions, infantry, horses, chariots and elephants.",["NCERT-THEMES-I-KINGS-FARMERS-TOWNS"]],
  ["admin-official-taxes","Megasthenes described officials who collected taxes and supervised activities connected with land.",["NCERT-THEMES-I-KINGS-FARMERS-TOWNS"]],
  ["admin-official-occupations","Mauryan officials supervised occupational groups such as woodcutters, carpenters, blacksmiths and miners.",["NCERT-THEMES-I-KINGS-FARMERS-TOWNS"]],
  ["econ-trade-revenue","Trade was an important source of revenue for the Mauryan state.",["NIOS-HISTORY-315-LESSON30A-EARLY-STATES"]],
  ["econ-state-monopoly","The state kept special control over some goods such as weapons, armour, metals and gems.",["NIOS-HISTORY-315-LESSON30A-EARLY-STATES"]],

  ["symbol-lion-capital","The Lion Capital of Ashoka at Sarnath is the basis of India's State Emblem.",["NIOS-HISTORY-315-LESSON30A-EARLY-STATES"]],
  ["arch-nbpw","The Mauryan period is associated archaeologically with Northern Black Polished Ware.",["NIOS-HISTORY-315-LESSON30A-EARLY-STATES"]],
  ["empire-not-entire-subcontinent","The Mauryan Empire did not cover the entire Indian subcontinent.",["NCERT-THEMES-I-KINGS-FARMERS-TOWNS"]],
  ["empire-control-varied","Even within Mauryan frontiers, the degree of political control varied from region to region.",["NCERT-THEMES-I-KINGS-FARMERS-TOWNS"]],
  ["empire-post-mauryan-regions","By the second century BCE, new chiefdoms and kingdoms had emerged in several parts of the subcontinent.",["NCERT-THEMES-I-KINGS-FARMERS-TOWNS"]],
];

export const HIS_CP004_FACT_BY_ID_V1=new Map(HIS_CP004_FACTS_V1.map(f=>[f[0],f] as const));
export const HIS_CP004_SOURCE_IDS_V1=new Set<string>(HIS_CP004_SOURCES_V1.map(s=>s[0]));
