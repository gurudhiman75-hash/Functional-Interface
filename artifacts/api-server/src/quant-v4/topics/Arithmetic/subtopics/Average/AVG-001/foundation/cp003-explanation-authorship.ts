import type { Avg001QuestionPackage } from "./types";

type Lang = "en" | "hi" | "pa";
type Key =
  | "number" | "reading" | "test" | "salary" | "machine" | "parcel" | "sales" | "price"
  | "personWeight" | "familyAge" | "playerAge" | "teacherAge" | "childAge" | "workerAge"
  | "studentAge" | "cricket" | "classCount" | "teamCount" | "workerCount" | "machineCount";
type Words = { one: string; many: string; total: string; average: string; added: string; removed: string; replacement: string; count: string };

const EN: Record<Key, Words> = {
  number: { one: "number", many: "numbers", total: "sum", average: "average", added: "added number", removed: "removed number", replacement: "replacement number", count: "original number count" },
  reading: { one: "reading", many: "readings", total: "reading total", average: "average reading", added: "added reading", removed: "removed reading", replacement: "replacement reading", count: "original reading count" },
  test: { one: "test score", many: "test scores", total: "total marks", average: "average score", added: "next-test score", removed: "excluded score", replacement: "corrected score", count: "original test count" },
  salary: { one: "employee salary", many: "employee salaries", total: "salary total", average: "average salary", added: "new employee's salary", removed: "departing employee's salary", replacement: "replacement employee's salary", count: "original employee count" },
  machine: { one: "machine output", many: "machine outputs", total: "total output", average: "average output", added: "new machine's output", removed: "removed machine's output", replacement: "replacement machine's output", count: "original machine count" },
  parcel: { one: "parcel weight", many: "parcel weights", total: "total parcel weight", average: "average parcel weight", added: "new parcel's weight", removed: "removed parcel's weight", replacement: "replacement parcel's weight", count: "original parcel count" },
  sales: { one: "one day's sales", many: "daily sales figures", total: "sales total", average: "average daily sales", added: "next day's sales", removed: "excluded day's sales", replacement: "replacement sales figure", count: "original day count" },
  price: { one: "item price", many: "item prices", total: "price total", average: "average price", added: "new item's price", removed: "removed item's price", replacement: "replacement price", count: "original item count" },
  personWeight: { one: "person's weight", many: "individual weights", total: "total weight", average: "average weight", added: "new person's weight", removed: "departing person's weight", replacement: "replacement weight", count: "original person count" },
  familyAge: { one: "family member's age", many: "family members' ages", total: "combined age", average: "average family age", added: "joining member's age", removed: "departing member's age", replacement: "new member's age", count: "original family size" },
  playerAge: { one: "player's age", many: "players' ages", total: "combined player age", average: "average player age", added: "joining player's age", removed: "departing player's age", replacement: "new player's age", count: "original player count" },
  teacherAge: { one: "teacher's age", many: "teachers' ages", total: "combined age", average: "average teacher age", added: "joining teacher's age", removed: "departing teacher's age", replacement: "new teacher's age", count: "original teacher count" },
  childAge: { one: "child's age", many: "family members' ages", total: "combined age", average: "average family age", added: "child's age", removed: "child's age", replacement: "child's age", count: "original family size" },
  workerAge: { one: "worker's age", many: "workers' ages", total: "combined worker age", average: "average worker age", added: "joining worker's age", removed: "departing worker's age", replacement: "new worker's age", count: "original worker count" },
  studentAge: { one: "student's age", many: "students' ages", total: "combined student age", average: "average student age", added: "joining student's age", removed: "departing student's age", replacement: "new student's age", count: "original student count" },
  cricket: { one: "innings score", many: "innings scores", total: "run total", average: "batting average", added: "next-innings score", removed: "removed innings score", replacement: "replacement score", count: "original innings count" },
  classCount: { one: "student score", many: "student scores", total: "class total", average: "class average", added: "new student's score", removed: "leaving student's score", replacement: "student score", count: "original student count" },
  teamCount: { one: "player score", many: "player scores", total: "team total", average: "team average", added: "new player's score", removed: "leaving player's score", replacement: "player score", count: "original player count" },
  workerCount: { one: "worker output", many: "worker outputs", total: "workforce total", average: "average worker output", added: "new worker's output", removed: "leaving worker's output", replacement: "worker output", count: "original worker count" },
  machineCount: { one: "machine output", many: "machine outputs", total: "plant output total", average: "average machine output", added: "new machine's output", removed: "removed machine's output", replacement: "machine output", count: "original machine count" },
};

const HI: Record<Key, Words> = {
  number: { one: "संख्या", many: "संख्याओं", total: "योग", average: "औसत", added: "जोड़ी गई संख्या", removed: "हटाई गई संख्या", replacement: "प्रतिस्थापन संख्या", count: "संख्याओं की प्रारंभिक संख्या" },
  reading: { one: "माप", many: "दर्ज मापों", total: "मापों के कुल", average: "औसत माप", added: "जोड़ा गया माप", removed: "हटाया गया माप", replacement: "प्रतिस्थापन माप", count: "मापों की प्रारंभिक संख्या" },
  test: { one: "परीक्षा-अंक", many: "परीक्षा-अंकों", total: "कुल अंकों", average: "अंकों का औसत", added: "अगली परीक्षा के अंक", removed: "हटाए गए अंक", replacement: "संशोधित अंक", count: "परीक्षाओं की प्रारंभिक संख्या" },
  salary: { one: "कर्मचारी का वेतन", many: "कर्मचारियों के वेतनों", total: "कुल वेतन", average: "औसत वेतन", added: "नए कर्मचारी का वेतन", removed: "जाने वाले कर्मचारी का वेतन", replacement: "नए कर्मचारी का वेतन", count: "कर्मचारियों की प्रारंभिक संख्या" },
  machine: { one: "मशीन का उत्पादन", many: "मशीनों के उत्पादन", total: "कुल उत्पादन", average: "औसत उत्पादन", added: "नई मशीन का उत्पादन", removed: "हटाई गई मशीन का उत्पादन", replacement: "नई मशीन का उत्पादन", count: "मशीनों की प्रारंभिक संख्या" },
  parcel: { one: "पार्सल का वजन", many: "पार्सलों के वजन", total: "कुल वजन", average: "औसत पार्सल-वजन", added: "नए पार्सल का वजन", removed: "हटाए गए पार्सल का वजन", replacement: "नए पार्सल का वजन", count: "पार्सलों की प्रारंभिक संख्या" },
  sales: { one: "एक दिन की बिक्री", many: "दैनिक बिक्री राशियों", total: "कुल बिक्री", average: "औसत दैनिक बिक्री", added: "अगले दिन की बिक्री", removed: "हटाई गई बिक्री राशि", replacement: "नई बिक्री राशि", count: "दिनों की प्रारंभिक संख्या" },
  price: { one: "वस्तु की कीमत", many: "वस्तुओं की कीमतों", total: "कीमतों के कुल", average: "औसत कीमत", added: "नई वस्तु की कीमत", removed: "हटाई गई कीमत", replacement: "प्रतिस्थापन कीमत", count: "वस्तुओं की प्रारंभिक संख्या" },
  personWeight: { one: "व्यक्ति का वजन", many: "व्यक्तियों के वजन", total: "कुल वजन", average: "औसत वजन", added: "नए व्यक्ति का वजन", removed: "जाने वाले व्यक्ति का वजन", replacement: "प्रतिस्थापन वजन", count: "व्यक्तियों की प्रारंभिक संख्या" },
  familyAge: { one: "परिवार के सदस्य की आयु", many: "परिवार के सदस्यों की आयु", total: "कुल आयु", average: "परिवार की औसत आयु", added: "जुड़ने वाले सदस्य की आयु", removed: "जाने वाले सदस्य की आयु", replacement: "नए सदस्य की आयु", count: "परिवार के सदस्यों की प्रारंभिक संख्या" },
  playerAge: { one: "खिलाड़ी की आयु", many: "खिलाड़ियों की आयु", total: "खिलाड़ियों की कुल आयु", average: "खिलाड़ियों की औसत आयु", added: "जुड़ने वाले खिलाड़ी की आयु", removed: "जाने वाले खिलाड़ी की आयु", replacement: "नए खिलाड़ी की आयु", count: "खिलाड़ियों की प्रारंभिक संख्या" },
  teacherAge: { one: "शिक्षक की आयु", many: "शिक्षकों की आयु", total: "कुल आयु", average: "शिक्षकों की औसत आयु", added: "जुड़ने वाले शिक्षक की आयु", removed: "जाने वाले शिक्षक की आयु", replacement: "नए शिक्षक की आयु", count: "शिक्षकों की प्रारंभिक संख्या" },
  childAge: { one: "बच्चे की आयु", many: "परिवार के सदस्यों की आयु", total: "कुल आयु", average: "परिवार की औसत आयु", added: "बच्चे की आयु", removed: "बच्चे की आयु", replacement: "बच्चे की आयु", count: "परिवार के सदस्यों की प्रारंभिक संख्या" },
  workerAge: { one: "कर्मी की आयु", many: "कर्मियों की आयु", total: "कर्मियों की कुल आयु", average: "कर्मियों की औसत आयु", added: "जुड़ने वाले कर्मी की आयु", removed: "जाने वाले कर्मी की आयु", replacement: "नए कर्मी की आयु", count: "कर्मियों की प्रारंभिक संख्या" },
  studentAge: { one: "विद्यार्थी की आयु", many: "विद्यार्थियों की आयु", total: "विद्यार्थियों की कुल आयु", average: "विद्यार्थियों की औसत आयु", added: "जुड़ने वाले विद्यार्थी की आयु", removed: "जाने वाले विद्यार्थी की आयु", replacement: "नए विद्यार्थी की आयु", count: "विद्यार्थियों की प्रारंभिक संख्या" },
  cricket: { one: "पारी का स्कोर", many: "पारियों के स्कोर", total: "कुल रन", average: "बल्लेबाजी औसत", added: "अगली पारी का स्कोर", removed: "हटाई गई पारी का स्कोर", replacement: "प्रतिस्थापन स्कोर", count: "पारियों की प्रारंभिक संख्या" },
  classCount: { one: "विद्यार्थी का स्कोर", many: "विद्यार्थियों के अंकों", total: "कक्षा के कुल अंकों", average: "कक्षा का औसत", added: "नए विद्यार्थी के अंक", removed: "जाने वाले विद्यार्थी के अंक", replacement: "विद्यार्थी के अंक", count: "विद्यार्थियों की प्रारंभिक संख्या" },
  teamCount: { one: "खिलाड़ी का स्कोर", many: "खिलाड़ियों के स्कोर", total: "टीम के कुल रन", average: "टीम का औसत", added: "नए खिलाड़ी का स्कोर", removed: "जाने वाले खिलाड़ी का स्कोर", replacement: "खिलाड़ी का स्कोर", count: "खिलाड़ियों की प्रारंभिक संख्या" },
  workerCount: { one: "कर्मी का उत्पादन", many: "कर्मियों के उत्पादन", total: "कार्य-दल के कुल उत्पादन", average: "औसत कर्मी-उत्पादन", added: "नए कर्मी का उत्पादन", removed: "जाने वाले कर्मी का उत्पादन", replacement: "कर्मी का उत्पादन", count: "कर्मियों की प्रारंभिक संख्या" },
  machineCount: { one: "मशीन का उत्पादन", many: "मशीनों के उत्पादन", total: "संयंत्र के कुल उत्पादन", average: "औसत मशीन-उत्पादन", added: "नई मशीन का उत्पादन", removed: "हटाई गई मशीन का उत्पादन", replacement: "मशीन का उत्पादन", count: "मशीनों की प्रारंभिक संख्या" },
};

const PA: Record<Key, Words> = {
  number: { one: "ਸੰਖਿਆ", many: "ਸੰਖਿਆਵਾਂ", total: "ਜੋੜ", average: "ਔਸਤ", added: "ਜੋੜੀ ਗਈ ਸੰਖਿਆ", removed: "ਹਟਾਈ ਗਈ ਸੰਖਿਆ", replacement: "ਬਦਲੀ ਸੰਖਿਆ", count: "ਸੰਖਿਆਵਾਂ ਦੀ ਸ਼ੁਰੂਆਤੀ ਗਿਣਤੀ" },
  reading: { one: "ਮਾਪ", many: "ਦਰਜ ਮਾਪਾਂ", total: "ਮਾਪਾਂ ਦੇ ਕੁੱਲ", average: "ਔਸਤ ਮਾਪ", added: "ਜੋੜਿਆ ਮਾਪ", removed: "ਹਟਾਇਆ ਮਾਪ", replacement: "ਬਦਲੀ ਮਾਪ", count: "ਮਾਪਾਂ ਦੀ ਸ਼ੁਰੂਆਤੀ ਗਿਣਤੀ" },
  test: { one: "ਪ੍ਰੀਖਿਆ ਅੰਕ", many: "ਪ੍ਰੀਖਿਆ ਅੰਕਾਂ", total: "ਕੁੱਲ ਅੰਕਾਂ", average: "ਅੰਕਾਂ ਦੀ ਔਸਤ", added: "ਅਗਲੀ ਪ੍ਰੀਖਿਆ ਦੇ ਅੰਕ", removed: "ਹਟਾਏ ਗਏ ਅੰਕ", replacement: "ਸੋਧੇ ਹੋਏ ਅੰਕ", count: "ਪ੍ਰੀਖਿਆਵਾਂ ਦੀ ਸ਼ੁਰੂਆਤੀ ਗਿਣਤੀ" },
  salary: { one: "ਕਰਮਚਾਰੀ ਦੀ ਤਨਖਾਹ", many: "ਕਰਮਚਾਰੀਆਂ ਦੀਆਂ ਤਨਖਾਹਾਂ", total: "ਕੁੱਲ ਤਨਖਾਹ", average: "ਔਸਤ ਤਨਖਾਹ", added: "ਨਵੇਂ ਕਰਮਚਾਰੀ ਦੀ ਤਨਖਾਹ", removed: "ਜਾਣ ਵਾਲੇ ਕਰਮਚਾਰੀ ਦੀ ਤਨਖਾਹ", replacement: "ਨਵੇਂ ਕਰਮਚਾਰੀ ਦੀ ਤਨਖਾਹ", count: "ਕਰਮਚਾਰੀਆਂ ਦੀ ਸ਼ੁਰੂਆਤੀ ਗਿਣਤੀ" },
  machine: { one: "ਮਸ਼ੀਨ ਦਾ ਉਤਪਾਦਨ", many: "ਮਸ਼ੀਨਾਂ ਦੇ ਉਤਪਾਦਨ", total: "ਕੁੱਲ ਉਤਪਾਦਨ", average: "ਔਸਤ ਉਤਪਾਦਨ", added: "ਨਵੀਂ ਮਸ਼ੀਨ ਦਾ ਉਤਪਾਦਨ", removed: "ਹਟਾਈ ਗਈ ਮਸ਼ੀਨ ਦਾ ਉਤਪਾਦਨ", replacement: "ਨਵੀਂ ਮਸ਼ੀਨ ਦਾ ਉਤਪਾਦਨ", count: "ਮਸ਼ੀਨਾਂ ਦੀ ਸ਼ੁਰੂਆਤੀ ਗਿਣਤੀ" },
  parcel: { one: "ਪਾਰਸਲ ਦਾ ਵਜ਼ਨ", many: "ਪਾਰਸਲਾਂ ਦੇ ਵਜ਼ਨ", total: "ਕੁੱਲ ਵਜ਼ਨ", average: "ਔਸਤ ਪਾਰਸਲ-ਵਜ਼ਨ", added: "ਨਵੇਂ ਪਾਰਸਲ ਦਾ ਵਜ਼ਨ", removed: "ਹਟਾਏ ਪਾਰਸਲ ਦਾ ਵਜ਼ਨ", replacement: "ਨਵੇਂ ਪਾਰਸਲ ਦਾ ਵਜ਼ਨ", count: "ਪਾਰਸਲਾਂ ਦੀ ਸ਼ੁਰੂਆਤੀ ਗਿਣਤੀ" },
  sales: { one: "ਇੱਕ ਦਿਨ ਦੀ ਵਿਕਰੀ", many: "ਰੋਜ਼ਾਨਾ ਵਿਕਰੀ ਰਕਮਾਂ", total: "ਕੁੱਲ ਵਿਕਰੀ", average: "ਔਸਤ ਰੋਜ਼ਾਨਾ ਵਿਕਰੀ", added: "ਅਗਲੇ ਦਿਨ ਦੀ ਵਿਕਰੀ", removed: "ਹਟਾਈ ਗਈ ਵਿਕਰੀ ਰਕਮ", replacement: "ਨਵੀਂ ਵਿਕਰੀ ਰਕਮ", count: "ਦਿਨਾਂ ਦੀ ਸ਼ੁਰੂਆਤੀ ਗਿਣਤੀ" },
  price: { one: "ਵਸਤੂ ਦੀ ਕੀਮਤ", many: "ਵਸਤੂਆਂ ਦੀਆਂ ਕੀਮਤਾਂ", total: "ਕੀਮਤਾਂ ਦੇ ਕੁੱਲ", average: "ਔਸਤ ਕੀਮਤ", added: "ਨਵੀਂ ਵਸਤੂ ਦੀ ਕੀਮਤ", removed: "ਹਟਾਈ ਗਈ ਕੀਮਤ", replacement: "ਬਦਲੀ ਕੀਮਤ", count: "ਵਸਤੂਆਂ ਦੀ ਸ਼ੁਰੂਆਤੀ ਗਿਣਤੀ" },
  personWeight: { one: "ਵਿਅਕਤੀ ਦਾ ਵਜ਼ਨ", many: "ਵਿਅਕਤੀਆਂ ਦੇ ਵਜ਼ਨ", total: "ਕੁੱਲ ਵਜ਼ਨ", average: "ਔਸਤ ਵਜ਼ਨ", added: "ਨਵੇਂ ਵਿਅਕਤੀ ਦਾ ਵਜ਼ਨ", removed: "ਜਾਣ ਵਾਲੇ ਵਿਅਕਤੀ ਦਾ ਵਜ਼ਨ", replacement: "ਬਦਲੀ ਵਜ਼ਨ", count: "ਵਿਅਕਤੀਆਂ ਦੀ ਸ਼ੁਰੂਆਤੀ ਗਿਣਤੀ" },
  familyAge: { one: "ਪਰਿਵਾਰਕ ਮੈਂਬਰ ਦੀ ਉਮਰ", many: "ਪਰਿਵਾਰਕ ਮੈਂਬਰਾਂ ਦੀਆਂ ਉਮਰਾਂ", total: "ਕੁੱਲ ਉਮਰ", average: "ਪਰਿਵਾਰ ਦੀ ਔਸਤ ਉਮਰ", added: "ਸ਼ਾਮਲ ਹੋਏ ਮੈਂਬਰ ਦੀ ਉਮਰ", removed: "ਜਾਣ ਵਾਲੇ ਮੈਂਬਰ ਦੀ ਉਮਰ", replacement: "ਨਵੇਂ ਮੈਂਬਰ ਦੀ ਉਮਰ", count: "ਪਰਿਵਾਰਕ ਮੈਂਬਰਾਂ ਦੀ ਸ਼ੁਰੂਆਤੀ ਗਿਣਤੀ" },
  playerAge: { one: "ਖਿਡਾਰੀ ਦੀ ਉਮਰ", many: "ਖਿਡਾਰੀਆਂ ਦੀਆਂ ਉਮਰਾਂ", total: "ਖਿਡਾਰੀਆਂ ਦੀ ਕੁੱਲ ਉਮਰ", average: "ਖਿਡਾਰੀਆਂ ਦੀ ਔਸਤ ਉਮਰ", added: "ਸ਼ਾਮਲ ਹੋਏ ਖਿਡਾਰੀ ਦੀ ਉਮਰ", removed: "ਜਾਣ ਵਾਲੇ ਖਿਡਾਰੀ ਦੀ ਉਮਰ", replacement: "ਨਵੇਂ ਖਿਡਾਰੀ ਦੀ ਉਮਰ", count: "ਖਿਡਾਰੀਆਂ ਦੀ ਸ਼ੁਰੂਆਤੀ ਗਿਣਤੀ" },
  teacherAge: { one: "ਅਧਿਆਪਕ ਦੀ ਉਮਰ", many: "ਅਧਿਆਪਕਾਂ ਦੀਆਂ ਉਮਰਾਂ", total: "ਕੁੱਲ ਉਮਰ", average: "ਅਧਿਆਪਕਾਂ ਦੀ ਔਸਤ ਉਮਰ", added: "ਸ਼ਾਮਲ ਹੋਏ ਅਧਿਆਪਕ ਦੀ ਉਮਰ", removed: "ਜਾਣ ਵਾਲੇ ਅਧਿਆਪਕ ਦੀ ਉਮਰ", replacement: "ਨਵੇਂ ਅਧਿਆਪਕ ਦੀ ਉਮਰ", count: "ਅਧਿਆਪਕਾਂ ਦੀ ਸ਼ੁਰੂਆਤੀ ਗਿਣਤੀ" },
  childAge: { one: "ਬੱਚੇ ਦੀ ਉਮਰ", many: "ਪਰਿਵਾਰਕ ਮੈਂਬਰਾਂ ਦੀਆਂ ਉਮਰਾਂ", total: "ਕੁੱਲ ਉਮਰ", average: "ਪਰਿਵਾਰ ਦੀ ਔਸਤ ਉਮਰ", added: "ਬੱਚੇ ਦੀ ਉਮਰ", removed: "ਬੱਚੇ ਦੀ ਉਮਰ", replacement: "ਬੱਚੇ ਦੀ ਉਮਰ", count: "ਪਰਿਵਾਰਕ ਮੈਂਬਰਾਂ ਦੀ ਸ਼ੁਰੂਆਤੀ ਗਿਣਤੀ" },
  workerAge: { one: "ਕਾਮੇ ਦੀ ਉਮਰ", many: "ਕਾਮਿਆਂ ਦੀਆਂ ਉਮਰਾਂ", total: "ਕਾਮਿਆਂ ਦੀ ਕੁੱਲ ਉਮਰ", average: "ਕਾਮਿਆਂ ਦੀ ਔਸਤ ਉਮਰ", added: "ਸ਼ਾਮਲ ਹੋਏ ਕਾਮੇ ਦੀ ਉਮਰ", removed: "ਜਾਣ ਵਾਲੇ ਕਾਮੇ ਦੀ ਉਮਰ", replacement: "ਨਵੇਂ ਕਾਮੇ ਦੀ ਉਮਰ", count: "ਕਾਮਿਆਂ ਦੀ ਸ਼ੁਰੂਆਤੀ ਗਿਣਤੀ" },
  studentAge: { one: "ਵਿਦਿਆਰਥੀ ਦੀ ਉਮਰ", many: "ਵਿਦਿਆਰਥੀਆਂ ਦੀਆਂ ਉਮਰਾਂ", total: "ਵਿਦਿਆਰਥੀਆਂ ਦੀ ਕੁੱਲ ਉਮਰ", average: "ਵਿਦਿਆਰਥੀਆਂ ਦੀ ਔਸਤ ਉਮਰ", added: "ਸ਼ਾਮਲ ਹੋਏ ਵਿਦਿਆਰਥੀ ਦੀ ਉਮਰ", removed: "ਜਾਣ ਵਾਲੇ ਵਿਦਿਆਰਥੀ ਦੀ ਉਮਰ", replacement: "ਨਵੇਂ ਵਿਦਿਆਰਥੀ ਦੀ ਉਮਰ", count: "ਵਿਦਿਆਰਥੀਆਂ ਦੀ ਸ਼ੁਰੂਆਤੀ ਗਿਣਤੀ" },
  cricket: { one: "ਪਾਰੀ ਦਾ ਸਕੋਰ", many: "ਪਾਰੀਆਂ ਦੇ ਸਕੋਰ", total: "ਕੁੱਲ ਦੌੜਾਂ", average: "ਬੱਲੇਬਾਜ਼ੀ ਔਸਤ", added: "ਅਗਲੀ ਪਾਰੀ ਦਾ ਸਕੋਰ", removed: "ਹਟਾਈ ਪਾਰੀ ਦਾ ਸਕੋਰ", replacement: "ਬਦਲੀ ਸਕੋਰ", count: "ਪਾਰੀਆਂ ਦੀ ਸ਼ੁਰੂਆਤੀ ਗਿਣਤੀ" },
  classCount: { one: "ਵਿਦਿਆਰਥੀ ਦਾ ਸਕੋਰ", many: "ਵਿਦਿਆਰਥੀਆਂ ਦੇ ਅੰਕਾਂ", total: "ਜਮਾਤ ਦੇ ਕੁੱਲ ਅੰਕਾਂ", average: "ਜਮਾਤ ਦੀ ਔਸਤ", added: "ਨਵੇਂ ਵਿਦਿਆਰਥੀ ਦੇ ਅੰਕ", removed: "ਜਾਣ ਵਾਲੇ ਵਿਦਿਆਰਥੀ ਦੇ ਅੰਕ", replacement: "ਵਿਦਿਆਰਥੀ ਦੇ ਅੰਕ", count: "ਵਿਦਿਆਰਥੀਆਂ ਦੀ ਸ਼ੁਰੂਆਤੀ ਗਿਣਤੀ" },
  teamCount: { one: "ਖਿਡਾਰੀ ਦਾ ਸਕੋਰ", many: "ਖਿਡਾਰੀਆਂ ਦੇ ਸਕੋਰ", total: "ਟੀਮ ਦੀਆਂ ਕੁੱਲ ਦੌੜਾਂ", average: "ਟੀਮ ਦੀ ਔਸਤ", added: "ਨਵੇਂ ਖਿਡਾਰੀ ਦਾ ਸਕੋਰ", removed: "ਜਾਣ ਵਾਲੇ ਖਿਡਾਰੀ ਦਾ ਸਕੋਰ", replacement: "ਖਿਡਾਰੀ ਦਾ ਸਕੋਰ", count: "ਖਿਡਾਰੀਆਂ ਦੀ ਸ਼ੁਰੂਆਤੀ ਗਿਣਤੀ" },
  workerCount: { one: "ਕਾਮੇ ਦਾ ਉਤਪਾਦਨ", many: "ਕਾਮਿਆਂ ਦੇ ਉਤਪਾਦਨ", total: "ਕਾਰਜ-ਦਲ ਦੇ ਕੁੱਲ ਉਤਪਾਦਨ", average: "ਔਸਤ ਕਾਮਾ-ਉਤਪਾਦਨ", added: "ਨਵੇਂ ਕਾਮੇ ਦਾ ਉਤਪਾਦਨ", removed: "ਜਾਣ ਵਾਲੇ ਕਾਮੇ ਦਾ ਉਤਪਾਦਨ", replacement: "ਕਾਮੇ ਦਾ ਉਤਪਾਦਨ", count: "ਕਾਮਿਆਂ ਦੀ ਸ਼ੁਰੂਆਤੀ ਗਿਣਤੀ" },
  machineCount: { one: "ਮਸ਼ੀਨ ਦਾ ਉਤਪਾਦਨ", many: "ਮਸ਼ੀਨਾਂ ਦੇ ਉਤਪਾਦਨ", total: "ਪਲਾਂਟ ਦੇ ਕੁੱਲ ਉਤਪਾਦਨ", average: "ਔਸਤ ਮਸ਼ੀਨ-ਉਤਪਾਦਨ", added: "ਨਵੀਂ ਮਸ਼ੀਨ ਦਾ ਉਤਪਾਦਨ", removed: "ਹਟਾਈ ਗਈ ਮਸ਼ੀਨ ਦਾ ਉਤਪਾਦਨ", replacement: "ਮਸ਼ੀਨ ਦਾ ਉਤਪਾਦਨ", count: "ਮਸ਼ੀਨਾਂ ਦੀ ਸ਼ੁਰੂਆਤੀ ਗਿਣਤੀ" },
};

function inList(id: number, list: number[]) { return list.includes(id); }

function keyFor(pkg: Avg001QuestionPackage): Key {
  const id = Number(pkg.questionLanguageId.slice(-3));
  if (id >= 197 && id <= 208) return "cricket";
  if (inList(id, [394, 398, 400, 404])) return "classCount";
  if (inList(id, [395, 399, 401, 405])) return "teamCount";
  if (inList(id, [396, 402])) return "workerCount";
  if (inList(id, [397, 403])) return "machineCount";
  if (inList(id, [123, 136, 148, 161, 174, 186])) return "number";
  if (inList(id, [135, 147, 156, 160, 196])) return "reading";
  if (inList(id, [124, 137, 149, 162, 175, 187, 192])) return "test";
  if (inList(id, [125, 138, 150, 163, 176, 188])) return "salary";
  if (inList(id, [126, 141, 151, 166, 179, 189])) return "machine";
  if (inList(id, [127, 152, 172, 190])) return "parcel";
  if (inList(id, [128, 140, 155, 165, 178, 195])) return "sales";
  if (inList(id, [153, 173, 185, 191])) return "price";
  if (inList(id, [139, 164, 177])) return "personWeight";
  if (inList(id, [129, 142, 144, 157, 167, 180, 182, 193])) return "familyAge";
  if (inList(id, [130, 143, 154, 168, 181])) return "playerAge";
  if (inList(id, [131, 158, 169, 194])) return "teacherAge";
  if (inList(id, [132, 133, 170])) return "childAge";
  if (inList(id, [134, 145, 159, 171, 183])) return "workerAge";
  return "studentAge";
}

function arithmetic(line: string) {
  return /\$\$|\\times|\\div|×|÷|(?:^|\s)(?:Old|New|Current|Required|Remaining|Target|Total|Difference|Value gap|Excess value)\b/i.test(line)
    || /(?:पुराना|नया|वर्तमान|लक्षित|बचा हुआ|कुल परिवर्तन|मान-अंतर|अतिरिक्त मान)/.test(line)
    || /(?:ਪੁਰਾਣਾ|ਨਵਾਂ|ਮੌਜੂਦਾ|ਲਕਸ਼ਿਤ|ਬਚਿਆ|ਕੁੱਲ ਬਦਲਾਅ|ਮੁੱਲ-ਅੰਤਰ|ਵਾਧੂ ਮੁੱਲ)/.test(line);
}

const CRICKET_EN = [
  "The next score must supply exactly the runs missing from the target total.",
  "Work with cumulative runs first; the batting average is only the final division.",
  "The target average fixes the run total required after the next innings.",
  "One more innings changes both the run total and the innings count.",
  "The requested score is the difference between the target and present aggregates.",
  "Translate each batting average into runs before comparing the two situations.",
  "Add the stated innings score to the existing run bank before averaging again.",
  "The extra innings contributes runs once and increases the divisor by one.",
  "The revised batting average comes from the combined run total over all innings.",
  "Keep the old runs intact, append the next score, and use the enlarged innings count.",
  "The desired average determines how many cumulative runs must exist after one more innings.",
  "Recompute the batting average only after the latest innings has been added to the total.",
];
const CRICKET_HI = [
  "अगली पारी का स्कोर लक्षित कुल रन में बची हुई कमी को ठीक-ठीक पूरा करेगा।",
  "पहले संचित रन पर काम करें; बल्लेबाजी औसत अंतिम भाग है।",
  "लक्षित औसत अगली पारी के बाद आवश्यक कुल रन तय करता है।",
  "एक और पारी से कुल रन और पारियों की संख्या दोनों बदलते हैं।",
  "आवश्यक स्कोर लक्षित और वर्तमान कुल रन का अंतर है।",
  "दोनों स्थितियों की तुलना से पहले बल्लेबाजी औसतों को कुल रन में बदलें।",
  "नया औसत लेने से पहले अगली पारी के रन पुराने कुल में जोड़ें।",
  "अतिरिक्त पारी एक बार रन जोड़ती है और भाजक को भी एक बढ़ाती है।",
  "संशोधित बल्लेबाजी औसत सभी पारियों के संयुक्त रन से निकलेगा।",
  "पुराने रन जस के तस रखें, अगला स्कोर जोड़ें और बढ़ी हुई पारी-संख्या लें।",
  "वांछित औसत बताता है कि एक और पारी के बाद कुल कितने रन होने चाहिए।",
  "नवीनतम पारी को कुल रन में शामिल करने के बाद ही बल्लेबाजी औसत दोबारा निकालें।",
];
const CRICKET_PA = [
  "ਅਗਲੀ ਪਾਰੀ ਦਾ ਸਕੋਰ ਲਕਸ਼ਿਤ ਕੁੱਲ ਦੌੜਾਂ ਵਿੱਚ ਬਚੀ ਘਾਟ ਨੂੰ ਠੀਕ ਪੂਰਾ ਕਰੇਗਾ।",
  "ਪਹਿਲਾਂ ਇਕੱਠੀਆਂ ਦੌੜਾਂ ਉੱਤੇ ਕੰਮ ਕਰੋ; ਬੱਲੇਬਾਜ਼ੀ ਔਸਤ ਅੰਤਿਮ ਭਾਗ ਹੈ।",
  "ਲਕਸ਼ਿਤ ਔਸਤ ਅਗਲੀ ਪਾਰੀ ਤੋਂ ਬਾਅਦ ਲੋੜੀਂਦੀਆਂ ਕੁੱਲ ਦੌੜਾਂ ਤੈਅ ਕਰਦੀ ਹੈ।",
  "ਇੱਕ ਹੋਰ ਪਾਰੀ ਨਾਲ ਕੁੱਲ ਦੌੜਾਂ ਅਤੇ ਪਾਰੀਆਂ ਦੀ ਗਿਣਤੀ ਦੋਵੇਂ ਬਦਲਦੇ ਹਨ।",
  "ਲੋੜੀਂਦਾ ਸਕੋਰ ਲਕਸ਼ਿਤ ਅਤੇ ਮੌਜੂਦਾ ਕੁੱਲ ਦੌੜਾਂ ਦਾ ਅੰਤਰ ਹੈ।",
  "ਦੋਵੇਂ ਸਥਿਤੀਆਂ ਦੀ ਤੁਲਨਾ ਤੋਂ ਪਹਿਲਾਂ ਬੱਲੇਬਾਜ਼ੀ ਔਸਤਾਂ ਨੂੰ ਕੁੱਲ ਦੌੜਾਂ ਵਿੱਚ ਬਦਲੋ।",
  "ਨਵੀਂ ਔਸਤ ਲੈਣ ਤੋਂ ਪਹਿਲਾਂ ਅਗਲੀ ਪਾਰੀ ਦੀਆਂ ਦੌੜਾਂ ਪੁਰਾਣੇ ਕੁੱਲ ਵਿੱਚ ਜੋੜੋ।",
  "ਵਾਧੂ ਪਾਰੀ ਇੱਕ ਵਾਰ ਦੌੜਾਂ ਜੋੜਦੀ ਹੈ ਅਤੇ ਭਾਜਕ ਵੀ ਇੱਕ ਵਧਾਉਂਦੀ ਹੈ।",
  "ਸੋਧੀ ਬੱਲੇਬਾਜ਼ੀ ਔਸਤ ਸਾਰੀਆਂ ਪਾਰੀਆਂ ਦੀਆਂ ਮਿਲੀਆਂ ਦੌੜਾਂ ਤੋਂ ਨਿਕਲੇਗੀ।",
  "ਪੁਰਾਣੀਆਂ ਦੌੜਾਂ ਜਿਉਂ ਦੀ ਤਿਉਂ ਰੱਖੋ, ਅਗਲਾ ਸਕੋਰ ਜੋੜੋ ਅਤੇ ਵਧੀ ਪਾਰੀ-ਗਿਣਤੀ ਵਰਤੋ।",
  "ਚਾਹੀਦੀ ਔਸਤ ਦੱਸਦੀ ਹੈ ਕਿ ਇੱਕ ਹੋਰ ਪਾਰੀ ਤੋਂ ਬਾਅਦ ਕੁੱਲ ਕਿੰਨੀਆਂ ਦੌੜਾਂ ਹੋਣੀਆਂ ਚਾਹੀਦੀਆਂ ਹਨ।",
  "ਨਵੀਂ ਪਾਰੀ ਨੂੰ ਕੁੱਲ ਦੌੜਾਂ ਵਿੱਚ ਸ਼ਾਮਲ ਕਰਨ ਤੋਂ ਬਾਅਦ ਹੀ ਬੱਲੇਬਾਜ਼ੀ ਔਸਤ ਮੁੜ ਕੱਢੋ।",
];

function opening(pkg: Avg001QuestionPackage, lang: Lang, w: Words) {
  const mode = pkg.solveMode;
  const id = Number(pkg.questionLanguageId.slice(-3));
  if (mode === "findInningsValueOrNewCricketAverage") return (lang === "en" ? CRICKET_EN : lang === "hi" ? CRICKET_HI : CRICKET_PA)[id - 197]!;
  const alternate = id % 2 === 0;

  if (lang === "en") {
    if (mode === "findNewAverageAfterAddition") return alternate ? `The incoming ${w.one} is one fresh observation, so both the ${w.total} and the count change.` : `Do not add the new ${w.one} directly to the old average; first rebuild the ${w.total}.`;
    if (mode === "findNewAverageAfterRemoval") return alternate ? `Removing one ${w.one} changes the ${w.total} and leaves one fewer observation.` : `The outgoing ${w.one} must be removed from the ${w.total}, not subtracted from the average itself.`;
    if (mode === "findNewAverageAfterReplacement") return alternate ? `A replacement keeps the count fixed, so only the swap's effect on the ${w.total} matters.` : `Treat this as “minus the old ${w.one}, plus the new one” while retaining the same divisor.`;
    if (mode === "findAddedMemberValueFromShift") return alternate ? `The unknown ${w.added} is the difference between the enlarged group's ${w.total} and the original ${w.total}.` : `Build the old and new ${w.total}s separately; their gap belongs to the single added ${w.one}.`;
    if (mode === "findRemovedMemberValueFromShift") return alternate ? `The removed ${w.one} is the gap between the old ${w.total} and the ${w.total} left behind.` : `Compare the full group with the smaller group; the lost contribution identifies the outgoing ${w.one}.`;
    if (mode === "findReplacementValueFromShift") return alternate ? `With the count fixed, the change in ${w.average} gives the exact change required in the replacement ${w.one}.` : `The two ${w.total}s differ only because one ${w.one} was exchanged, so their difference isolates the unknown.`;
    if (mode === "findOriginalCountFromJoiningMemberShift") return alternate ? `The new ${w.one} lies above the old ${w.average}; that excess is spread across the enlarged group.` : `The incoming ${w.one}'s excess over the old ${w.average} pays for the stated rise in every new group place.`;
    return alternate ? `After one ${w.one} leaves, its gap from the old ${w.average} explains the change across those who remain.` : `The departing ${w.one}'s distance from the old ${w.average} is redistributed over the smaller group.`;
  }
  if (lang === "hi") {
    if (mode === "findNewAverageAfterAddition") return alternate ? `नया ${w.one} एक अतिरिक्त प्रेक्षण है, इसलिए ${w.total} और संख्या दोनों बदलेंगे।` : `नए ${w.one} को सीधे पुराने औसत में न जोड़ें; पहले पुराना ${w.total} बनाना होगा।`;
    if (mode === "findNewAverageAfterRemoval") return alternate ? `एक ${w.one} हटने से ${w.total} बदलता है और प्रेक्षणों की संख्या एक कम होती है।` : `जाने वाले ${w.one} को औसत से नहीं, ${w.total} से हटाना होगा।`;
    if (mode === "findNewAverageAfterReplacement") return alternate ? `प्रतिस्थापन में संख्या स्थिर रहती है; केवल अदला-बदली का ${w.total} पर प्रभाव देखना है।` : `इसे “पुराना ${w.one} घटाएँ, नया जोड़ें” मानें और भाजक वही रखें।`;
    if (mode === "findAddedMemberValueFromShift") return alternate ? `अज्ञात ${w.added}, बढ़े हुए समूह के ${w.total} और पुराने ${w.total} का अंतर है।` : `पुराने और नए ${w.total} अलग निकालें; उनका अंतर अकेले जोड़े गए ${w.one} का योगदान है।`;
    if (mode === "findRemovedMemberValueFromShift") return alternate ? `हटाया गया ${w.one}, पुराने ${w.total} और शेष ${w.total} का अंतर है।` : `पूरे और छोटे समूह की तुलना करें; खोया हुआ योगदान जाने वाले ${w.one} को बताएगा।`;
    if (mode === "findReplacementValueFromShift") return alternate ? `संख्या स्थिर है, इसलिए ${w.average} में परिवर्तन से प्रतिस्थापन ${w.one} में आवश्यक बदलाव मिलता है।` : `दोनों ${w.total} केवल एक ${w.one} की अदला-बदली से अलग हैं; यही अंतर अज्ञात मान देगा।`;
    if (mode === "findOriginalCountFromJoiningMemberShift") return alternate ? `नए ${w.one} का मान पुराने ${w.average} से अधिक है; यह अतिरिक्त मान बढ़े समूह में फैलता है।` : `आने वाले ${w.one} की पुराने ${w.average} पर बढ़त, हर नए समूह-स्थान की औसत-वृद्धि पूरी करती है।`;
    return alternate ? `एक ${w.one} के जाने पर पुराने ${w.average} से उसका अंतर शेष समूह में आए परिवर्तन को समझाता है।` : `जाने वाले ${w.one} की पुराने ${w.average} से दूरी छोटे समूह में पुनः वितरित होती है।`;
  }
  if (mode === "findNewAverageAfterAddition") return alternate ? `ਨਵਾਂ ${w.one} ਇੱਕ ਵਾਧੂ ਮੁੱਲ ਹੈ, ਇਸ ਲਈ ${w.total} ਅਤੇ ਗਿਣਤੀ ਦੋਵੇਂ ਬਦਲਣਗੇ।` : `ਨਵੇਂ ${w.one} ਨੂੰ ਸਿੱਧਾ ਪੁਰਾਣੀ ਔਸਤ ਵਿੱਚ ਨਾ ਜੋੜੋ; ਪਹਿਲਾਂ ਪੁਰਾਣਾ ${w.total} ਬਣਾਓ।`;
  if (mode === "findNewAverageAfterRemoval") return alternate ? `ਇੱਕ ${w.one} ਹਟਣ ਨਾਲ ${w.total} ਬਦਲਦਾ ਹੈ ਅਤੇ ਮੁੱਲਾਂ ਦੀ ਗਿਣਤੀ ਇੱਕ ਘੱਟ ਹੁੰਦੀ ਹੈ।` : `ਜਾਣ ਵਾਲੇ ${w.one} ਨੂੰ ਔਸਤ ਵਿੱਚੋਂ ਨਹੀਂ, ${w.total} ਵਿੱਚੋਂ ਹਟਾਉਣਾ ਹੈ।`;
  if (mode === "findNewAverageAfterReplacement") return alternate ? `ਬਦਲੀ ਵਿੱਚ ਗਿਣਤੀ ਸਥਿਰ ਰਹਿੰਦੀ ਹੈ; ਸਿਰਫ਼ ਅਦਲਾ-ਬਦਲੀ ਦਾ ${w.total} ਉੱਤੇ ਅਸਰ ਦੇਖਣਾ ਹੈ।` : `ਇਸ ਨੂੰ “ਪੁਰਾਣਾ ${w.one} ਘਟਾਓ, ਨਵਾਂ ਜੋੜੋ” ਸਮਝੋ ਅਤੇ ਭਾਜਕ ਉਹੀ ਰੱਖੋ।`;
  if (mode === "findAddedMemberValueFromShift") return alternate ? `ਅਣਜਾਣ ${w.added}, ਵਧੇ ਸਮੂਹ ਦੇ ${w.total} ਅਤੇ ਪੁਰਾਣੇ ${w.total} ਦਾ ਅੰਤਰ ਹੈ।` : `ਪੁਰਾਣਾ ਅਤੇ ਨਵਾਂ ${w.total} ਵੱਖ ਕੱਢੋ; ਉਨ੍ਹਾਂ ਦਾ ਅੰਤਰ ਜੋੜੇ ${w.one} ਦਾ ਹਿੱਸਾ ਹੈ।`;
  if (mode === "findRemovedMemberValueFromShift") return alternate ? `ਹਟਾਇਆ ${w.one}, ਪੁਰਾਣੇ ${w.total} ਅਤੇ ਬਾਕੀ ${w.total} ਦਾ ਅੰਤਰ ਹੈ।` : `ਪੂਰੇ ਅਤੇ ਛੋਟੇ ਸਮੂਹ ਦੀ ਤੁਲਨਾ ਕਰੋ; ਗੁੰਮ ਹਿੱਸਾ ਜਾਣ ਵਾਲਾ ${w.one} ਦੱਸੇਗਾ।`;
  if (mode === "findReplacementValueFromShift") return alternate ? `ਗਿਣਤੀ ਸਥਿਰ ਹੈ, ਇਸ ਲਈ ${w.average} ਵਿੱਚ ਬਦਲਾਅ ਤੋਂ ਬਦਲੀ ${w.one} ਵਿੱਚ ਲੋੜੀਂਦਾ ਬਦਲਾਅ ਮਿਲਦਾ ਹੈ।` : `ਦੋਵੇਂ ${w.total} ਸਿਰਫ਼ ਇੱਕ ${w.one} ਦੀ ਅਦਲਾ-ਬਦਲੀ ਕਰਕੇ ਵੱਖ ਹਨ; ਇਹ ਅੰਤਰ ਅਣਜਾਣ ਮੁੱਲ ਦੇਵੇਗਾ।`;
  if (mode === "findOriginalCountFromJoiningMemberShift") return alternate ? `ਨਵੇਂ ${w.one} ਦਾ ਮੁੱਲ ਪੁਰਾਣੀ ${w.average} ਤੋਂ ਵੱਧ ਹੈ; ਇਹ ਵਾਧੂ ਹਿੱਸਾ ਵਧੇ ਸਮੂਹ ਵਿੱਚ ਫੈਲਦਾ ਹੈ।` : `ਆਉਣ ਵਾਲੇ ${w.one} ਦੀ ਪੁਰਾਣੀ ${w.average} ਉੱਤੇ ਵਧਤ ਹਰ ਨਵੀਂ ਥਾਂ ਦੀ ਔਸਤ-ਵਾਧਾ ਪੂਰਾ ਕਰਦੀ ਹੈ।`;
  return alternate ? `ਇੱਕ ${w.one} ਦੇ ਜਾਣ ਉੱਤੇ ਪੁਰਾਣੀ ${w.average} ਤੋਂ ਉਸ ਦਾ ਅੰਤਰ ਬਾਕੀ ਸਮੂਹ ਦੇ ਬਦਲਾਅ ਨੂੰ ਸਮਝਾਉਂਦਾ ਹੈ।` : `ਜਾਣ ਵਾਲੇ ${w.one} ਦੀ ਪੁਰਾਣੀ ${w.average} ਤੋਂ ਦੂਰੀ ਛੋਟੇ ਸਮੂਹ ਵਿੱਚ ਮੁੜ ਵੰਡੀ ਜਾਂਦੀ ਹੈ।`;
}

function method(pkg: Avg001QuestionPackage, lang: Lang, w: Words) {
  const mode = pkg.solveMode;
  const years = Number(pkg.parameters.values.yearsElapsed ?? pkg.parameters.values.elapsedYears ?? 0);
  const age = years > 0 ? (lang === "en" ? `First advance every existing age by ${years} years. ` : lang === "hi" ? `पहले प्रत्येक पुरानी आयु में ${years} वर्ष जोड़ें। ` : `ਪਹਿਲਾਂ ਹਰ ਪੁਰਾਣੀ ਉਮਰ ਵਿੱਚ ${years} ਸਾਲ ਜੋੜੋ। `) : "";

  if (lang === "en") {
    if (mode === "findNewAverageAfterAddition") return `${age}Turn the old ${w.average} into the ${w.total}, add the incoming ${w.one}, and divide by the enlarged count.`;
    if (mode === "findNewAverageAfterRemoval") return `${age}Turn the old ${w.average} into the ${w.total}, subtract the outgoing ${w.one}, and divide by the remaining count.`;
    if (mode === "findNewAverageAfterReplacement") return `${age}Adjust the old ${w.total} by “minus old, plus new”; the count does not change.`;
    if (mode === "findAddedMemberValueFromShift") return `${age}New ${w.total} minus old ${w.total} gives the ${w.added}.`;
    if (mode === "findRemovedMemberValueFromShift") return `${age}Old ${w.total} minus remaining ${w.total} gives the ${w.removed}.`;
    if (mode === "findReplacementValueFromShift") return `${age}Use the change in ${w.total} to move from the known replacement value to the unknown one.`;
    if (mode === "findInningsValueOrNewCricketAverage") return pkg.parameters.answerType === "AVERAGE" ? `Add the next score to the existing ${w.total}, then divide by the enlarged innings count.` : `Compute the target ${w.total} and subtract the current ${w.total}.`;
    if (mode === "findOriginalCountFromJoiningMemberShift") return `Divide the incoming value's excess by the average rise, then remove the new member's place.`;
    return `Divide the departing value's gap by the average change, then restore the departing member's place.`;
  }
  if (lang === "hi") {
    if (mode === "findNewAverageAfterAddition") return `${age}पुराने ${w.average} को ${w.total} में बदलें, नया ${w.one} जोड़ें और बढ़ी हुई संख्या से भाग दें।`;
    if (mode === "findNewAverageAfterRemoval") return `${age}पुराने ${w.average} से ${w.total} निकालें, जाने वाला ${w.one} घटाएँ और शेष संख्या से भाग दें।`;
    if (mode === "findNewAverageAfterReplacement") return `${age}पुराने ${w.total} में “पुराना घटाएँ, नया जोड़ें”; संख्या नहीं बदलेगी।`;
    if (mode === "findAddedMemberValueFromShift") return `${age}नए ${w.total} में से पुराना ${w.total} घटाने पर ${w.added} मिलेगा।`;
    if (mode === "findRemovedMemberValueFromShift") return `${age}पुराने ${w.total} में से शेष ${w.total} घटाने पर ${w.removed} मिलेगा।`;
    if (mode === "findReplacementValueFromShift") return `${age}${w.total} में परिवर्तन को ज्ञात प्रतिस्थापन मान से जोड़कर अज्ञात मान निकालें।`;
    if (mode === "findInningsValueOrNewCricketAverage") return pkg.parameters.answerType === "AVERAGE" ? `अगली पारी के रन पुराने ${w.total} में जोड़कर बढ़ी हुई पारी-संख्या से भाग दें।` : `लक्षित ${w.total} निकालकर वर्तमान ${w.total} घटाएँ।`;
    if (mode === "findOriginalCountFromJoiningMemberShift") return `अतिरिक्त मान को औसत-वृद्धि से भाग दें और नए सदस्य का एक स्थान घटाएँ।`;
    return `मान-अंतर को औसत-परिवर्तन से भाग दें और जाने वाले सदस्य का एक स्थान वापस जोड़ें।`;
  }
  if (mode === "findNewAverageAfterAddition") return `${age}ਪੁਰਾਣੀ ${w.average} ਨੂੰ ${w.total} ਵਿੱਚ ਬਦਲੋ, ਨਵਾਂ ${w.one} ਜੋੜੋ ਅਤੇ ਵਧੀ ਗਿਣਤੀ ਨਾਲ ਭਾਗ ਦਿਓ।`;
  if (mode === "findNewAverageAfterRemoval") return `${age}ਪੁਰਾਣੀ ${w.average} ਤੋਂ ${w.total} ਕੱਢੋ, ਜਾਣ ਵਾਲਾ ${w.one} ਘਟਾਓ ਅਤੇ ਬਾਕੀ ਗਿਣਤੀ ਨਾਲ ਭਾਗ ਦਿਓ।`;
  if (mode === "findNewAverageAfterReplacement") return `${age}ਪੁਰਾਣੇ ${w.total} ਵਿੱਚ “ਪੁਰਾਣਾ ਘਟਾਓ, ਨਵਾਂ ਜੋੜੋ”; ਗਿਣਤੀ ਨਹੀਂ ਬਦਲੇਗੀ।`;
  if (mode === "findAddedMemberValueFromShift") return `${age}ਨਵੇਂ ${w.total} ਵਿੱਚੋਂ ਪੁਰਾਣਾ ${w.total} ਘਟਾਉਣ ਉੱਤੇ ${w.added} ਮਿਲੇਗਾ।`;
  if (mode === "findRemovedMemberValueFromShift") return `${age}ਪੁਰਾਣੇ ${w.total} ਵਿੱਚੋਂ ਬਾਕੀ ${w.total} ਘਟਾਉਣ ਉੱਤੇ ${w.removed} ਮਿਲੇਗਾ।`;
  if (mode === "findReplacementValueFromShift") return `${age}${w.total} ਦੇ ਬਦਲਾਅ ਨੂੰ ਜਾਣੇ ਬਦਲੀ ਮੁੱਲ ਨਾਲ ਜੋੜ ਕੇ ਅਣਜਾਣ ਮੁੱਲ ਕੱਢੋ।`;
  if (mode === "findInningsValueOrNewCricketAverage") return pkg.parameters.answerType === "AVERAGE" ? `ਅਗਲੀ ਪਾਰੀ ਦੀਆਂ ਦੌੜਾਂ ਪੁਰਾਣੇ ${w.total} ਵਿੱਚ ਜੋੜ ਕੇ ਵਧੀ ਪਾਰੀ-ਗਿਣਤੀ ਨਾਲ ਭਾਗ ਦਿਓ।` : `ਲਕਸ਼ਿਤ ${w.total} ਕੱਢ ਕੇ ਮੌਜੂਦਾ ${w.total} ਘਟਾਓ।`;
  if (mode === "findOriginalCountFromJoiningMemberShift") return `ਵਾਧੂ ਮੁੱਲ ਨੂੰ ਔਸਤ-ਵਾਧੇ ਨਾਲ ਭਾਗ ਦਿਓ ਅਤੇ ਨਵੇਂ ਮੈਂਬਰ ਦੀ ਇੱਕ ਥਾਂ ਘਟਾਓ।`;
  return `ਮੁੱਲ-ਅੰਤਰ ਨੂੰ ਔਸਤ-ਬਦਲਾਅ ਨਾਲ ਭਾਗ ਦਿਓ ਅਤੇ ਜਾਣ ਵਾਲੇ ਮੈਂਬਰ ਦੀ ਇੱਕ ਥਾਂ ਵਾਪਸ ਜੋੜੋ।`;
}

function label(pkg: Avg001QuestionPackage, lang: Lang, w: Words) {
  const mode = pkg.solveMode;
  if (/findNewAverage/.test(mode)) return w.average;
  if (mode === "findAddedMemberValueFromShift") return w.added;
  if (mode === "findRemovedMemberValueFromShift") return w.removed;
  if (mode === "findInningsValueOrNewCricketAverage") return pkg.parameters.answerType === "AVERAGE" ? w.average : w.added;
  if (/findOriginalCount/.test(mode)) return w.count;
  const old = String(pkg.parameters.values.replacementTarget ?? "new") === "old";
  if (!old) return w.replacement;
  return lang === "en" ? `original ${w.one}` : lang === "hi" ? `पुराना ${w.one}` : `ਪੁਰਾਣਾ ${w.one}`;
}

export function applyAvg001Cp003ExplanationAuthorship(pkg: Avg001QuestionPackage): Avg001QuestionPackage {
  if (pkg.canonicalProblemId !== "AVG-CP-003") return pkg;
  const lang: Lang = pkg.language === "hi" || pkg.language === "pa" ? pkg.language : "en";
  const key = keyFor(pkg);
  const words = (lang === "en" ? EN : lang === "hi" ? HI : PA)[key];
  const math = pkg.explanation.lines.filter(arithmetic);
  const working = math.some((line) => line.includes(pkg.answer)) ? math : [...math, pkg.reasoningEvidence.decisiveCalculation];
  const result = label(pkg, lang, words);
  const finalLine = lang === "en" ? `Therefore, the ${result} is ${pkg.answer}.` : lang === "hi" ? `अतः ${result} ${pkg.answer} है।` : `ਇਸ ਲਈ ${result} ${pkg.answer} ਹੈ।`;
  const lines = [opening(pkg, lang, words), method(pkg, lang, words), ...working.slice(0, 4), finalLine].filter(Boolean).slice(0, 8);
  return {
    ...pkg,
    explanation: { lines },
    traceability: {
      ...pkg.traceability,
      cp003ExplanationAuthorship: "AVG-CP-003 context-authored explanations v1",
      cp003ExplanationContext: key,
    },
  };
}
