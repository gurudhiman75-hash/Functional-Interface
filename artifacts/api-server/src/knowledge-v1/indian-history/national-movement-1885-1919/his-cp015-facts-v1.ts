export type HisCp015Fact=readonly[id:string,explanation:string,sourceIds:readonly string[]];

export const HIS_CP015_SOURCES_V1=Object.freeze([
  {id:"NIOS-HIS-315-L21",label:"NIOS History 315 Lesson 21 — Indian National Movement",url:"https://digital.nios.ac.in/content/315en/315_History_Eng_Lesson21.pdf"},
  {id:"NIOS-SS-213-L08",label:"NIOS Social Science 213 Lesson 8 — Indian National Movement",url:"https://digital.nios.ac.in/content/213en/Lesson-08.pdf"},
  {id:"GOI-IC-LUCKNOW-1916",label:"Ministry of Culture / Indian Culture Portal — Lucknow Pact of 1916",url:"https://amritmahotsav.nic.in/district-reopsitory-detail.htm?6264="},
] as const);
export const HIS_CP015_SOURCE_IDS_V1=new Set(HIS_CP015_SOURCES_V1.map(s=>s.id));

export const HIS_CP015_FACTS_V1:readonly HisCp015Fact[]=[
  ["inc-1885","The Indian National Congress was formed in December 1885.",["NIOS-HIS-315-L21"]],
  ["hume-role","A.O. Hume, a retired civil servant, played a major role in forming the Congress.",["NIOS-HIS-315-L21"]],
  ["wc-president","W.C. Bonnerji was the first president of the Indian National Congress.",["NIOS-SS-213-L08"]],
  ["inc-72","The first Congress session in 1885 had 72 delegates.",["NIOS-HIS-315-L21"]],
  ["regional-associations","Before the Congress, regional bodies such as the Indian Association, Poona Sarvajanik Sabha, Bombay Presidency Association and Madras Mahajan Sabha were active.",["NIOS-HIS-315-L21"]],
  ["common-platform","The Congress sought to provide a common political platform for Indians from different regions.",["NIOS-HIS-315-L21"]],

  ["moderate-period","The years 1885 to 1905 are commonly described as the Moderate phase of the Congress.",["NIOS-HIS-315-L21"]],
  ["moderate-method","Moderates relied mainly on petitions, speeches, newspapers and constitutional methods.",["NIOS-SS-213-L08"]],
  ["economic-critique","Early nationalists such as Dadabhai Naoroji developed an economic critique of colonial rule.",["NIOS-HIS-315-L21"]],
  ["council-reform","Moderates demanded wider legislative councils with greater Indian representation.",["NIOS-HIS-315-L21"]],
  ["ics-demand","Moderates demanded Indianization of the civil services and simultaneous ICS examinations in India and England.",["NIOS-HIS-315-L21"]],
  ["moderate-training","Despite limited immediate gains, Moderate politics helped create national awareness and political training.",["NIOS-SS-213-L08"]],

  ["partition-1905","Lord Curzon announced the partition of Bengal in 1905.",["NIOS-HIS-315-L21"]],
  ["swadeshi-aug7","The Swadeshi movement was formally proclaimed on 7 August 1905 at Calcutta Town Hall with a boycott resolution.",["NIOS-HIS-315-L21"]],
  ["partition-oct16","The partition of Bengal took effect on 16 October 1905, which was observed with protest and mourning.",["NIOS-HIS-315-L21"]],
  ["swadeshi-methods","Swadeshi protest included boycott of foreign goods, public meetings, processions, picketing and promotion of indigenous goods.",["NIOS-HIS-315-L21"]],
  ["swadeshi-spread","Tilak, Lajpat Rai, Ajit Singh, Bipin Chandra Pal and others helped spread Swadeshi beyond Bengal.",["NIOS-HIS-315-L21"]],
  ["swaraj-1906","At the 1906 Calcutta Congress, Dadabhai Naoroji declared self-government or swaraj as the goal.",["NIOS-HIS-315-L21"]],

  ["extremist-leaders","Bal Gangadhar Tilak, Lala Lajpat Rai and Bipin Chandra Pal were prominent radical nationalist leaders.",["NIOS-SS-213-L08"]],
  ["extremist-methods","Radical nationalists favoured mass protest, boycott and Swadeshi rather than relying mainly on petitions.",["NIOS-SS-213-L08"]],
  ["surat-1907","Differences between Moderates and Extremists led to the Congress split at Surat in 1907.",["NIOS-HIS-315-L21"]],
  ["partition-annulled","The partition of Bengal was annulled in 1911.",["NIOS-HIS-315-L21"]],
  ["capital-delhi","The British shifted the imperial capital from Calcutta to Delhi in 1911.",["NIOS-HIS-315-L21"]],
  ["secret-samitis","Several revolutionary secret organizations grew out of the samitis associated with the Swadeshi phase.",["NIOS-HIS-315-L21"]],

  ["league-1906","The All India Muslim League was founded on 30 December 1906 at Dacca.",["NIOS-SS-213-L08"]],
  ["salimullah","Nawab Salim Ullah Khan raised the idea of a Muslim political association at the Muhammadan Educational Conference in Dacca.",["NIOS-SS-213-L08"]],
  ["aga-khan","Aga Khan was chosen as an early president of the All India Muslim League.",["NIOS-SS-213-L08"]],
  ["league-objective","The League initially aimed to protect Muslim political interests and represent them to the government.",["NIOS-SS-213-L08"]],
  ["morley-minto","The Indian Councils Act of 1909 is commonly called the Morley-Minto Reforms.",["NIOS-SS-213-L08"]],
  ["separate-electorates","The 1909 reforms introduced separate electorates for Muslims.",["NIOS-SS-213-L08"]],

  ["khudiram-prafulla","Khudiram Bose and Prafulla Chaki carried out the Muzaffarpur bomb attempt in 1908.",["NIOS-HIS-315-L21"]],
  ["anushilan-yugantar","Anushilan and Yugantar were important revolutionary organizations in Bengal.",["NIOS-HIS-315-L21"]],
  ["rasbehari-sanyal","Ras Behari Bose and Sachindranath Sanyal built revolutionary networks across northern India.",["NIOS-HIS-315-L21"]],
  ["ghadar-1913","The Ghadar Movement began in San Francisco in 1913.",["NIOS-HIS-315-L21"]],
  ["ghadar-leaders","Sohan Singh Bhakna was a founder of the Ghadar Movement and Har Dayal was one of its prominent leaders.",["NIOS-HIS-315-L21"]],
  ["komagata-1914","The Komagata Maru incident of 1914 intensified anger among Indian nationalists abroad and in India.",["NIOS-HIS-315-L21"]],

  ["wwi-opportunity","Revolutionaries viewed the First World War, which began in 1914, as an opportunity to challenge British rule.",["NIOS-HIS-315-L21"]],
  ["ghadar-repression","Many returning Ghadar activists were arrested and planned military uprisings were suppressed.",["NIOS-HIS-315-L21"]],
  ["tilak-home-rule","Tilak set up his Home Rule League in April 1916.",["NIOS-HIS-315-L21"]],
  ["besant-home-rule","Annie Besant set up her Home Rule League in September 1916.",["NIOS-HIS-315-L21"]],
  ["home-rule-regions","Tilak's League worked mainly in Maharashtra and Karnataka, while Besant's League had a wider all-India reach from Adyar.",["NIOS-HIS-315-L21"]],
  ["home-rule-methods","Home Rule Leagues used lectures, pamphlets, discussions and reading rooms to spread political awareness.",["NIOS-HIS-315-L21"]],

  ["home-rule-goal","The Home Rule Movement demanded substantial self-government but did not formally demand complete independence.",["NIOS-HIS-315-L21"]],
  ["congress-reunion","Moderates and radicals came together again at the Lucknow Congress session of 1916.",["NIOS-SS-213-L08"]],
  ["lucknow-pact","The Congress and the Muslim League reached the Lucknow Pact in December 1916.",["GOI-IC-LUCKNOW-1916"]],
  ["lucknow-demands","The Lucknow Pact included demands for expanded elected legislatures and greater Indian participation in government.",["GOI-IC-LUCKNOW-1916"]],
  ["montagu-chelmsford","The Montagu-Chelmsford reforms of 1919 introduced dyarchy in the provinces.",["NIOS-SS-213-L08"]],
  ["gandhi-return","Mahatma Gandhi returned to India from South Africa in 1915.",["NIOS-SS-213-L08"]],

  ["satyagraha-south-africa","Gandhi developed satyagraha as a method of non-violent insistence on truth and justice during his South African struggle.",["NIOS-SS-213-L08"]],
  ["sabarmati-1916","Gandhi established the Sabarmati Ashram at Ahmedabad in 1916.",["NIOS-SS-213-L08"]],
  ["champaran-1917","Gandhi's first major satyagraha in India was at Champaran in 1917 against oppressive plantation conditions.",["NIOS-SS-213-L08"]],
  ["kheda","Gandhi supported peasants in Kheda who could not pay revenue after crop failure and epidemics.",["NIOS-SS-213-L08"]],
  ["ahmedabad-workers","Gandhi organized a movement among Ahmedabad cotton mill workers.",["NIOS-SS-213-L08"]],
  ["wwi-burdens","During the First World War, higher taxes, rents, prices and recruitment pressures increased popular discontent.",["NIOS-SS-213-L08"]],

  ["swadeshi-new-forms","The Swadeshi movement expanded nationalist protest through boycott, picketing, strikes and wider public mobilization.",["NIOS-HIS-315-L21"]],
  ["home-rule-revival","The Home Rule Movement gave the national movement a new political push after earlier methods had lost momentum.",["NIOS-HIS-315-L21"]],
  ["lucknow-selfgov","At Lucknow in 1916, Congress and League jointly pressed for self-government.",["NIOS-SS-213-L08"]],
  ["montagu-limits","Although the 1919 reforms expanded Indian participation, executive power remained heavily restricted.",["NIOS-HIS-315-L21"]],
  ["moderate-extremist-contrast","Moderates emphasized constitutional persuasion, while radical nationalists stressed mass action, boycott and Swadeshi.",["NIOS-SS-213-L08"]],
  ["pre1919-transition","By 1915–1918, Home Rule, revolutionary activity and Gandhi's early satyagrahas were reshaping nationalist politics before the mass phase after 1919.",["NIOS-HIS-315-L21","NIOS-SS-213-L08"]],
];
export const HIS_CP015_FACT_BY_ID_V1=new Map(HIS_CP015_FACTS_V1.map(f=>[f[0],f]));
