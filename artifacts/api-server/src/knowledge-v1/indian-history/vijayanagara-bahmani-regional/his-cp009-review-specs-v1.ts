export const HIS_CP009_QL_NAMES_V1:Record<number,string>={
1:"Bahmani foundation and administration",
2:"Mahmud Gawan and Bahmani politics",
3:"Vijayanagara foundation and dynasties",
4:"Krishnadeva Raya and imperial decline",
5:"Vijayanagara military and amara-nayaka system",
6:"Bahmani-Vijayanagara rivalry",
7:"Jaunpur and Kashmir",
8:"Bengal, Gujarat and regional state formation",
9:"Chronology, matching and comparison",
10:"Multi-statement synthesis"
};

export type HisCp009Spec=readonly[ql:number,stem:string,answer:string,distractors:readonly[string,string,string],factIds:readonly string[]];

export const HIS_CP009_SPECS_V1:readonly HisCp009Spec[]=[
[1,"Who founded the Bahmani Sultanate?","Alauddin Hasan Bahman Shah",["Mahmud Gawan","Muhammad Shah I","Ahmad Shah Wali"],["bah-founder"]],
[1,"What was the first capital of the Bahmani Sultanate?","Gulbarga",["Bidar","Bijapur","Daulatabad"],["bah-capital"]],
[1,"Bahmani provinces were known by which term?","Taraf",["Iqta","Sarkar","Suba"],["bah-taraf"]],
[1,"Who governed a Bahmani province?","Tarafdar",["Amara-nayaka","Muqti","Shiqdar"],["bah-tarafdar"]],
[1,"What was khalisa land in the Bahmani state?","Land kept under direct royal control",["Land held only by village assemblies","Land assigned permanently to foreign traders","Land exempt from all state authority"],["bah-khalisa"]],
[1,"Which west-coast port became an important Bahmani acquisition?","Dabhol",["Calicut","Surat","Masulipatnam"],["bah-dabhol"]],

[2,"Mahmud Gawan originally came to the Deccan from which region?","Iran",["Arabia","Afghanistan","Anatolia"],["gawan-iran"]],
[2,"Which title meaning 'Chief of the Merchants' was given to Mahmud Gawan?","Malik-ut-Tujjar",["Khwaja-i-Jahan","Yavanarajya-sthapanacharya","Sultan-us-Sharq"],["gawan-malik"]],
[2,"Which high office did Mahmud Gawan hold in the Bahmani state?","Wazir",["Tarafdar of every province","Qazi of Delhi","Amara-nayaka"],["gawan-wazir"]],
[2,"How did Mahmud Gawan reduce the military power of provincial governors?","He placed most forts under centrally appointed qiladars",["He abolished all provincial forts","He gave every fort permanently to the tarafdar","He transferred the army to village councils"],["gawan-forts"]],
[2,"Which pair of ports was gained by the Bahmani state under Mahmud Gawan?","Goa and Dabhol",["Surat and Cambay","Calicut and Cochin","Chittagong and Satgaon"],["gawan-ports"]],
[2,"Which division within the Bahmani nobility weakened the kingdom?","Deccanis and Afaquis",["Sangamas and Saluvas","Sharqis and Lodis","Rayas and Nayakas"],["bah-factions"]],

[3,"Who are associated with the foundation of Vijayanagara?","Harihara and Bukka",["Krishnadeva Raya and Achyuta Raya","Rama Raya and Sadasiva Raya","Deva Raya II and Saluva Narasimha"],["vij-founders"]],
[3,"Vijayanagara was established on the banks of which river?","Tungabhadra",["Godavari","Narmada","Kaveri"],["vij-river"]],
[3,"Which was the first ruling dynasty of Vijayanagara?","Sangama",["Saluva","Tuluva","Aravidu"],["vij-sangama"]],
[3,"Which dynasty replaced the Sangamas?","Saluva",["Tuluva","Aravidu","Sharqi"],["vij-saluva"]],
[3,"Krishnadeva Raya belonged to which dynasty?","Tuluva",["Sangama","Saluva","Aravidu"],["vij-tuluva"]],
[3,"Which traveller is associated with an account of Vijayanagara?","Domingo Paes",["Ibn Battuta","Al-Biruni","Megasthenes"],["vij-travellers"]],

[4,"Which ruler is most closely associated with the height of Vijayanagara power in the early sixteenth century?","Krishnadeva Raya",["Harihara I","Saluva Narasimha","Sadasiva Raya"],["kdr-famous"]],
[4,"Who composed the Telugu work Amuktamalyada?","Krishnadeva Raya",["Ibrahim Shah Sharqi","Mahmud Gawan","Zain-ul-Abidin"],["kdr-amukta"]],
[4,"Which set of achievements belongs to Krishnadeva Raya's reign?","Raichur victory, pressure on Orissa and defeat of Bijapur",["Foundation of the Bahmani state, capture of Dabhol and division into tarafs","Annexation of Jaunpur, foundation of Ahmedabad and conquest of Kashmir","Foundation of the Sangama dynasty, conquest of Bengal and capture of Chittagong"],["kdr-expansion"]],
[4,"Which township near Vijayanagara was founded by Krishnadeva Raya?","Nagalapuram",["Ahmadabad","Bidar","Pandua"],["kdr-nagalapuram"]],
[4,"What weakened Vijayanagara after the death of Krishnadeva Raya?","Succession struggles and rebellious nayakas",["A complete end to overseas trade","Permanent peace among all Deccan states","Abolition of the military system"],["vij-postkdr"]],
[4,"Who became the dominant political figure at Vijayanagara before the battle of 1565?","Rama Raya",["Mahmud Gawan","Bahlol Lodi","Ghiyasuddin Azam Shah"],["vij-ramaraya"]],

[5,"Why were imported horses important to Vijayanagara rulers?","Effective warfare depended heavily on strong cavalry",["They were required for temple rituals only","They replaced all infantry in the empire","They were used mainly for agricultural ploughing"],["vij-horses"]],
[5,"Which statement best describes Vijayanagara's military adaptation?","It used firearms and employed Turkish and Portuguese specialists",["It rejected firearms and depended only on elephants","It prohibited foreign military specialists","It used naval forces but no artillery"],["vij-firearms"]],
[5,"Which ruler recruited Muslims into the Vijayanagara armed forces?","Deva Raya II",["Harihara I","Krishnadeva Raya","Rama Raya"],["vij-devaraya2"]],
[5,"What was the basic role of an amara-nayaka?","A military commander who administered assigned territory and maintained troops",["A hereditary village priest","A merchant appointed to control foreign trade","A court poet who supervised temples"],["vij-amaranayaka"]],
[5,"Which combination of duties belonged to amara-nayakas?","Revenue collection, agricultural expansion and maintenance of troops",["Foreign diplomacy, coin minting and royal succession","Judicial appeals, sea customs and palace rituals","Only temple worship and literary patronage"],["vij-nayaka-duties"]],
[5,"How did amara-nayakas formally show loyalty to the raya?","They sent tribute and appeared at court with gifts",["They issued coins in their own names every year","They elected the raya through village assemblies","They transferred all revenue directly to foreign merchants"],["vij-nayaka-loyalty"]],

[6,"The Raichur doab lies between which two rivers?","Krishna and Tungabhadra",["Godavari and Krishna","Narmada and Tapi","Kaveri and Vaigai"],["raichur-location"]],
[6,"Why was the Raichur doab repeatedly contested?","It was fertile and rich in valuable resources",["It was the only route to Kashmir","It had no agricultural value but controlled Delhi","It contained the main Bengal seaport"],["raichur-value"]],
[6,"Besides Raichur, which areas were important in Bahmani-Vijayanagara rivalry?","Marathwada and the Krishna-Godavari delta",["Punjab and Kashmir","Bengal and Bihar","Malwa and Rajasthan only"],["conflict-other"]],
[6,"Why did ports and coastal routes matter in the Deccan rivalry?","They were linked to overseas trade and the import of war horses",["They controlled Himalayan passes","They supplied only timber for village houses","They had no connection with military strength"],["conflict-trade"]],
[6,"Which interpretation best explains Bahmani-Vijayanagara warfare?","Territorial and economic interests were major causes",["It was caused only by religious differences","It was fought mainly over succession to the Delhi throne","It was caused by a dispute over the Bengal delta alone"],["conflict-notreligious"]],
[6,"What was one long-term effect of repeated Bahmani-Vijayanagara warfare?","Both powers were weakened while Portuguese influence grew on the coast",["The two states permanently united","The horse trade disappeared immediately","Delhi recovered direct control of the whole Deccan"],["conflict-cost"]],

[7,"Who established an independent power at Jaunpur after Delhi weakened?","Malik Sarwar",["Zafar Khan","Haji Ilyas Khan","Shamsuddin Shah"],["jaunpur-malik"]],
[7,"The rulers of Jaunpur were known as the ______ Sultans.","Sharqi",["Lodi","Ilyas Shahi","Muzaffarid"],["jaunpur-sharqi"]],
[7,"Which Jaunpur ruler was noted for scholarship and patronage of music and architecture?","Ibrahim Shah Sharqi",["Malik Sarwar","Sikandar Lodi","Ghiyasuddin Azam Shah"],["jaunpur-ibrahim"]],
[7,"Which ruler finally annexed Jaunpur and ended Sharqi rule?","Sikandar Lodi",["Bahlol Lodi","Firuz Tughlaq","Alauddin Khalji"],["jaunpur-end"]],
[7,"Who established Muslim rule in Kashmir in the fourteenth century?","Shamsuddin Shah",["Zain-ul-Abidin","Sikandar Lodi","Ahmad Shah of Gujarat"],["kashmir-shams"]],
[7,"Which ruler of Kashmir was popularly known as Bud Shah?","Zain-ul-Abidin",["Shamsuddin Shah","Sikandar Shah","Ibrahim Shah Sharqi"],["kashmir-bud","kashmir-zain"]],

[8,"Who founded the Ilyas Shah dynasty in Bengal?","Shams-ud-din Ilyas Shah",["Ghiyasuddin Azam Shah","Alauddin Hussain Shah","Zafar Khan"],["bengal-ilyas"]],
[8,"Which Bengal ruler maintained cordial relations with China?","Ghiyasuddin Azam Shah",["Shams-ud-din Ilyas Shah","Mahmud Begarha","Ahmad Shah of Gujarat"],["bengal-azam"]],
[8,"Which port was important in Bengal's trade with China?","Chittagong",["Dabhol","Goa","Cambay"],["bengal-chittagong"]],
[8,"Which pair served as important capitals of medieval Bengal?","Pandua and Gaur",["Gulbarga and Bidar","Ahmedabad and Champaner","Jaunpur and Delhi"],["bengal-capitals"]],
[8,"Who asserted independence in Gujarat and later took the title Muzaffar Shah?","Zafar Khan",["Malik Sarwar","Haji Ilyas Khan","Mahmud Gawan"],["gujarat-zafar"]],
[8,"Which ruler founded Ahmedabad?","Ahmad Shah",["Mahmud Begarha","Zafar Khan","Ibrahim Shah Sharqi"],["gujarat-ahmad"]],

[9,"Which sequence of Vijayanagara dynasties is correct?","Sangama → Saluva → Tuluva → Aravidu",["Saluva → Sangama → Aravidu → Tuluva","Tuluva → Sangama → Saluva → Aravidu","Sangama → Tuluva → Saluva → Aravidu"],["vij-sangama","vij-saluva","vij-tuluva","vij-aravidu"]],
[9,"Which set is fully matched?","Bahmani — Hasan Bahman Shah; Vijayanagara — Harihara and Bukka; Bengal — Ilyas Shah",["Bahmani — Harihara and Bukka; Vijayanagara — Ilyas Shah; Bengal — Hasan Bahman Shah","Bahmani — Ilyas Shah; Vijayanagara — Zafar Khan; Bengal — Harihara and Bukka","Bahmani — Zafar Khan; Vijayanagara — Hasan Bahman Shah; Bengal — Malik Sarwar"],["bah-founder","vij-founders","bengal-ilyas"]],
[9,"Which administrative matching is correct?","Taraf — province; tarafdar — provincial governor; amara-nayaka — territorial military commander",["Taraf — village; tarafdar — court poet; amara-nayaka — tax-free priest","Taraf — royal treasury; tarafdar — merchant; amara-nayaka — foreign traveller","Taraf — fort commander; tarafdar — village accountant; amara-nayaka — wazir"],["bah-taraf","bah-tarafdar","vij-amaranayaka"]],
[9,"Which ruler-achievement set is fully correct?","Mahmud Gawan — Goa and Dabhol; Krishnadeva Raya — Amuktamalyada; Ahmad Shah — Ahmedabad",["Mahmud Gawan — Amuktamalyada; Krishnadeva Raya — Ahmedabad; Ahmad Shah — Goa and Dabhol","Mahmud Gawan — Ahmedabad; Krishnadeva Raya — Jaunpur; Ahmad Shah — Chittagong","Mahmud Gawan — Pandua and Gaur; Krishnadeva Raya — Bud Shah; Ahmad Shah — Raichur doab"],["gawan-ports","kdr-amukta","gujarat-ahmad"]],
[9,"Which geographical-economic set is correct?","Raichur — Krishna-Tungabhadra; Chittagong — Bengal-China trade; Goa-Dabhol — western sea trade",["Raichur — Ganga-Yamuna; Chittagong — Gujarat trade; Goa-Dabhol — Kashmir routes","Raichur — Narmada-Tapi; Chittagong — Deccan cavalry centre; Goa-Dabhol — Jaunpur ports","Raichur — Kaveri-Vaigai; Chittagong — Malwa capital; Goa-Dabhol — Bengal capitals"],["raichur-location","bengal-chittagong","gawan-ports"]],
[9,"Which regional ruler-association is fully correct?","Zain-ul-Abidin — Kashmir; Mahmud Begarha — Gujarat; Ibrahim Shah Sharqi — Jaunpur",["Zain-ul-Abidin — Gujarat; Mahmud Begarha — Jaunpur; Ibrahim Shah Sharqi — Kashmir","Zain-ul-Abidin — Bengal; Mahmud Begarha — Kashmir; Ibrahim Shah Sharqi — Gujarat","Zain-ul-Abidin — Bahmani; Mahmud Begarha — Bengal; Ibrahim Shah Sharqi — Vijayanagara"],["kashmir-zain","gujarat-begarha","jaunpur-ibrahim"]],

[10,"Consider the statements about the Bahmani Sultanate: 1. Its first capital was Gulbarga. 2. Its provinces were called tarafs. 3. A taraf was governed by a tarafdar. Which are correct?","1, 2 and 3",["1 and 2 only","2 and 3 only","1 and 3 only"],["bah-capital","bah-taraf","bah-tarafdar"]],
[10,"Consider the statements about Mahmud Gawan: 1. He became wazir. 2. He tried to reduce the military power of tarafdars. 3. Bahmani forces gained Goa and Dabhol under his leadership. Which are correct?","1, 2 and 3",["1 and 2 only","2 and 3 only","1 and 3 only"],["gawan-wazir","gawan-forts","gawan-ports"]],
[10,"Consider the statements about Vijayanagara: 1. Harihara and Bukka are associated with its foundation. 2. Sangama was its first dynasty. 3. Krishnadeva Raya belonged to the Tuluva dynasty. Which are correct?","1, 2 and 3",["1 and 2 only","2 and 3 only","1 and 3 only"],["vij-founders","vij-sangama","vij-tuluva"]],
[10,"Consider the statements about Krishnadeva Raya and later Vijayanagara: 1. He wrote Amuktamalyada. 2. His reign saw major success in the Raichur region. 3. Rama Raya later became a dominant political figure before Talikota. Which are correct?","1, 2 and 3",["1 and 2 only","2 and 3 only","1 and 3 only"],["kdr-amukta","kdr-expansion","vij-ramaraya"]],
[10,"Consider the statements about regional kingdoms: 1. Zain-ul-Abidin was associated with Kashmir. 2. Ilyas Shah founded a ruling dynasty in Bengal. 3. Ahmad Shah founded Ahmedabad. Which are correct?","1, 2 and 3",["1 and 2 only","2 and 3 only","1 and 3 only"],["kashmir-zain","bengal-ilyas","gujarat-ahmad"]],
[10,"Consider the statements: 1. The Raichur doab was valuable for fertile land and resources. 2. Overseas trade and horse routes shaped Deccan rivalry. 3. Regional states also exchanged ideas despite political conflicts. Which are correct?","1, 2 and 3",["1 and 2 only","2 and 3 only","1 and 3 only"],["raichur-value","conflict-trade","regional-exchange"]],
];