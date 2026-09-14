export type HisCp011Fact=readonly[id:string,explanation:string,sourceIds:readonly string[]];

export const HIS_CP011_SOURCES_V1=[
  {id:"NIOS-HISTORY-315-LESSON15-EIGHTEENTH",label:"NIOS History 315 Lesson 15 — Understanding Eighteenth Century India",url:"https://digital.nios.ac.in/content/315en/315_History_Eng_Lesson15.pdf"},
  {id:"NCERT-OUR-PASTS-III-TRADE-TERRITORY",label:"NCERT Our Pasts III — From Trade to Territory",url:"https://www.ncert.nic.in/textbook/pdf/hess202.pdf"},
] as const;

export const HIS_CP011_SOURCE_IDS_V1=new Set(HIS_CP011_SOURCES_V1.map(s=>s.id));
const L15=["NIOS-HISTORY-315-LESSON15-EIGHTEENTH"] as const;
const L15N=["NIOS-HISTORY-315-LESSON15-EIGHTEENTH","NCERT-OUR-PASTS-III-TRADE-TERRITORY"] as const;

export const HIS_CP011_FACTS_V1:readonly HisCp011Fact[]=[
  ["post-1707-weakened-centre","After Aurangzeb died in 1707, Mughal central authority weakened and many provincial governors and regional powers asserted greater independence.",L15],
  ["post-bahadur-shah-compromise","Bahadur Shah I generally followed a policy of compromise with several powerful nobles and regional chiefs.",L15],
  ["post-jahandar-zulfiqar","Under Jahandar Shah, his wazir Zulfiqar Khan exercised unusually great executive power.",L15],
  ["post-sayyid-brothers","Farrukh Siyar owed his accession to the Sayyid brothers, Abdullah Khan and Husain Ali Khan, who then became dominant at court.",L15],
  ["post-muhammad-shah-nobles","During Muhammad Shah's reign, powerful nobles increasingly influenced appointments and state affairs while the emperor's effective authority declined.",L15],
  ["post-symbolic-mughal","Many eighteenth-century regional rulers still accepted Mughal titles or symbolic authority even while exercising substantial independence.",L15],
  ["post-nizam-hyderabad","Nizam-ul-Mulk left the Mughal court and established an autonomous political base in Hyderabad in 1724.",L15],
  ["post-maratha-northward","As Mughal authority weakened, Maratha forces expanded northward into areas such as Malwa, Gujarat and Bundelkhand.",L15],

  ["maratha-shivaji-bhonsle","Shivaji Bhonsle was the most powerful early Maratha figure from the Bhonsle clan.",L15],
  ["maratha-shahu-succeeded","Shahu succeeded Rajaram in 1708 and became a central figure in the revival of Maratha power.",L15],
  ["maratha-shahu-reign","Shahu's reign lasted until 1749 and saw the growing political importance of the Peshwas.",L15],
  ["maratha-peshwa-meaning","The Peshwa was the chief minister in the Maratha state.",L15],
  ["maratha-balaji-vishwanath","Balaji Vishwanath was an important Peshwa who helped Shahu secure his position.",L15],
  ["maratha-bajirao-i","Baji Rao I served as Peshwa from 1720 to 1740 and greatly strengthened Maratha power.",L15],
  ["maratha-peshwa-ascendancy","Under Shahu, the Peshwas came to exercise much of the effective central authority in the Maratha state.",L15],
  ["maratha-bureaucratisation","Balaji Vishwanath and Baji Rao I made Maratha administration more organised and bureaucratic.",L15],
  ["maratha-chauth","Chauth was one of the important tribute claims collected by the Marathas from territories outside their core areas.",L15],
  ["maratha-sardeshmukhi","Sardeshmukhi was another important Maratha tribute claim collected alongside chauth.",L15],
  ["maratha-revenue-continuity","Maratha revenue administration retained several terms and practices derived from the Mughal system.",L15],
  ["maratha-confederacy-loose","The Maratha Confederacy was a loose political arrangement rather than a tightly centralised unitary state.",L15N],
  ["maratha-angria-fleet","The Angria clan controlled an important Maratha naval force on the western coast.",L15],
  ["maratha-bhonsle-nagpur","The Bhonsles of Nagpur formed one important branch of the wider Maratha political network.",L15N],
  ["maratha-raghuji","Raghuji Bhonsle of Nagpur led Maratha incursions into Bengal and Bihar during the eighteenth century.",L15],
  ["maratha-gaikwad-baroda","The Gaikwads became the leading Maratha house in Baroda and gained a large share of revenue rights in Gujarat.",L15N],
  ["maratha-holkar-indore","The Holkars established their main political base at Indore.",L15N],
  ["maratha-malhar-holkar","Malhar Rao Holkar consolidated Holkar power in Malwa and at Indore during the eighteenth century.",L15],
  ["maratha-ahilyabai","Ahilya Bai ruled the Holkar domains from 1765 to 1794 and strengthened their position.",L15],
  ["maratha-sindhia-gwalior","The Sindhias became a major Maratha house in north and central India, later centred at Gwalior.",L15N],
  ["maratha-mahadji","Mahadji Sindhia rebuilt Sindhia influence after 1761 and became a major power in north Indian politics.",L15],
  ["maratha-mahadji-regent","Shah Alam II gave Mahadji Sindhia the position of deputy regent in the Mughal political system.",L15],
  ["maratha-post-panipat-survival","Maratha political power continued after the Third Battle of Panipat, with houses such as the Sindhias, Holkars, Gaikwads and Bhonsles remaining important.",L15N],

  ["sikh-banda-aftermath","The suppression of Banda Bahadur did not end Sikh resistance to Mughal authority.",L15],
  ["sikh-amritsar-centre","Amritsar became an important centre of Sikh political and religious activity in the 1720s and 1730s.",L15],
  ["sikh-kapur-singh","Kapur Singh helped consolidate a revenue-cum-military system among Sikh groups.",L15],
  ["sikh-zakariya-khan","Zakariya Khan, governor of Lahore, tried to suppress Sikh political expansion before his death in 1745.",L15],
  ["sikh-jassa-ahluwalia","Jassa Singh Ahluwalia emerged as an important Sikh warrior-leader and later founded the kingdom of Kapurthala.",L15],
  ["sikh-abdali-opposition","The Sikhs provided the main sustained opposition to Ahmad Shah Abdali's attempts to hold Punjab during his later campaigns.",L15],
  ["sikh-lahore-mid1760s","By the mid-1760s, Sikh authority had been established over Lahore.",L15],
  ["sikh-chieftain-confederation","By the 1770s, Punjab contained a broad confederation of many Sikh chieftains rather than a single centralised Sikh monarchy.",L15],
  ["sikh-nabha-patiala","Some Sikh chiefdoms, including Nabha and Patiala, later developed into princely states.",L15],
  ["sikh-mughal-practices","Sikh chiefdoms continued some Mughal administrative practices, including the use of jagir assignments.",L15],
  ["sikh-ranjit-sukerchakia","Ranjit Singh was the grandson of Charhat Singh Sukerchakia and emerged from one of the Sikh chiefdoms.",L15],
  ["sikh-ranjit-lahore","Ranjit Singh captured Lahore in 1799 and made it the centre of his growing state.",L15],

  ["regional-bengal-murshid","Murshid Quli Khan became virtually independent in Bengal while still sending tribute to the Mughal emperor.",L15],
  ["regional-bengal-alivardi","Alivardi Khan took control of Bengal in 1739.",L15],
  ["regional-bengal-prosperity","The Bengal Nawabs promoted agriculture, trade and industry and brought a period of political stability.",L15],
  ["regional-awadh-saadat","Saadat Khan Burhan-ul-Mulk built an autonomous power base in Awadh and made the provincial leadership hereditary.",L15],
  ["regional-awadh-successors","Safdar Jang and Asaf-ud-Daula continued the political importance and administrative stability of Awadh.",L15],
  ["regional-jaipur-jaisingh","Sawai Jai Singh strengthened Jaipur in the early eighteenth century and became one of the most important Rajput rulers of the region.",L15],
  ["regional-bharatpur-surajmal","Suraj Mal of Bharatpur strengthened Jat power and used a modified form of Mughal revenue administration.",L15],

  ["invasion-nadir-iran","Nadir Shah, ruler of Iran, invaded India in 1738–39 and exposed the weakness of Mughal power.",L15],
  ["invasion-abdali-punjab","Ahmad Shah Abdali repeatedly campaigned in Punjab during the 1750s and 1760s.",L15],
  ["invasion-panipat-1761","In the Third Battle of Panipat in 1761, Ahmad Shah Abdali defeated the Maratha forces.",L15N],
  ["invasion-panipat-setback","The Third Battle of Panipat was a major setback to Maratha expansion in north India, but it did not permanently end Maratha political power.",L15N],
  ["invasion-sikh-maratha-resistance","Both Sikh and Maratha forces resisted Afghan influence in Punjab, though Sikh resistance became especially important over time.",L15],

  ["continuity-regional-diversity","Eighteenth-century regional states differed greatly in their origins, resources and political structures.",L15],
  ["continuity-mughal-legitimacy","Regional rulers often used Mughal titles, honours and imperial symbols to strengthen their own legitimacy.",L15],
  ["continuity-fiscal-practices","Mughal-derived administrative and fiscal practices continued in several Maratha, Sikh and regional states.",L15],
  ["continuity-decentralisation","The period after 1707 saw political decentralisation as regional powers gained strength while the Mughal emperor retained symbolic importance.",L15],
  ["continuity-1707-1761","The years from 1707 to 1761 marked a major phase of transition from Mughal central dominance toward stronger regional political orders.",L15],
];

export const HIS_CP011_FACT_BY_ID_V1=new Map(HIS_CP011_FACTS_V1.map(f=>[f[0],f]));