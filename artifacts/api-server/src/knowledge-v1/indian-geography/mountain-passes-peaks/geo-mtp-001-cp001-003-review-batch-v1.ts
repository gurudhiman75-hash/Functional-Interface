import { buildQl, finalizeCp, auditCp } from "./geo-mtp-001-review-builder";
const r=(stem:string,answer:string,d1:string,d2:string,d3:string,explanation:string,sourceFactId:string)=>({stem,answer,distractors:[d1,d2,d3] as const,explanation,sourceFactId});

export const GEO_MTP_001_CP001_QLS=Object.freeze([
buildQl("NATHU-LA","Nathu La",[
r("Nathu La is located in which state?","Sikkim","Himachal Pradesh","Uttarakhand","Arunachal Pradesh","Nathu La is a major Himalayan pass in Sikkim.","MTP-NATHU-1"),
r("Nathu La lies on the route toward which neighbouring country?","China","Nepal","Bangladesh","Sri Lanka","The pass connects Sikkim with the Tibetan region of China.","MTP-NATHU-2"),
r("Which mountain range contains Nathu La?","Eastern Himalaya","Aravalli","Western Ghats","Vindhya","Nathu La lies in the eastern Himalayan region.","MTP-NATHU-3"),
r("Consider the statements: I. Nathu La is in Sikkim. II. It lies on the India-China frontier. Which is correct?","Both I and II are correct","Only I is correct","Only II is correct","Neither I nor II is correct","Both are standard locational facts.","MTP-NATHU-4"),
r("A major pass in Sikkim connects toward Tibet. Which one is it?","Nathu La","Shipki La","Zoji La","Rohtang Pass","The Sikkim-Tibet clue identifies Nathu La.","MTP-NATHU-5")
]),
buildQl("SHIPKI-LA","Shipki La",[
r("Shipki La is located in which state?","Himachal Pradesh","Sikkim","Uttarakhand","Arunachal Pradesh","Shipki La is a high Himalayan pass in Himachal Pradesh.","MTP-SHIPKI-1"),
r("Which river enters India near the Shipki La region?","Sutlej","Brahmaputra","Teesta","Mahanadi","The Sutlej enters India from Tibet in the Shipki La region.","MTP-SHIPKI-2"),
r("Shipki La lies on India's boundary with which country?","China","Bhutan","Myanmar","Bangladesh","The pass lies on the Himachal Pradesh-Tibet frontier.","MTP-SHIPKI-3"),
r("Consider the statements: I. Shipki La is in Himachal Pradesh. II. The Sutlej enters India near this region. Which is correct?","Both I and II are correct","Only I is correct","Only II is correct","Neither I nor II is correct","Both are correct.","MTP-SHIPKI-4"),
r("A pass in Himachal Pradesh lies near the route by which the Sutlej enters India. Which pass is it?","Shipki La","Nathu La","Bomdi La","Lipulekh Pass","The river-state clue identifies Shipki La.","MTP-SHIPKI-5")
]),
buildQl("ZOJI-LA","Zoji La",[
r("Zoji La connects the Kashmir Valley with which region?","Ladakh","Malwa","Konkan","Bastar","Zoji La is the key mountain route between Kashmir and Ladakh.","MTP-ZOJI-1"),
r("Which road corridor uses Zoji La?","Srinagar-Leh route","Delhi-Jaipur route","Mumbai-Pune route","Chennai-Bengaluru route","Zoji La lies on the Srinagar-Leh axis.","MTP-ZOJI-2"),
r("Which mountain system contains Zoji La?","Himalaya","Aravalli","Satpura","Western Ghats","The pass lies in the western Himalayan region.","MTP-ZOJI-3"),
r("Consider the statements: I. Zoji La links Kashmir and Ladakh. II. It lies on the Srinagar-Leh route. Which is correct?","Both I and II are correct","Only I is correct","Only II is correct","Neither I nor II is correct","Both statements are correct.","MTP-ZOJI-4"),
r("A pass on the Srinagar-Leh route provides access from Kashmir to Ladakh. Which pass is it?","Zoji La","Nathu La","Shipki La","Bomdi La","The Srinagar-Leh clue identifies Zoji La.","MTP-ZOJI-5")
]),
buildQl("ROHTANG-PASS","Rohtang Pass",[
r("Rohtang Pass is located in which state?","Himachal Pradesh","Sikkim","Uttarakhand","Arunachal Pradesh","Rohtang is a major pass in Himachal Pradesh.","MTP-ROHTANG-1"),
r("Rohtang Pass connects Kullu Valley with which region?","Lahaul-Spiti","Kashmir Valley","Brahmaputra Valley","Malwa Plateau","Rohtang historically provided access from Kullu to Lahaul-Spiti.","MTP-ROHTANG-2"),
r("Which mountain region contains Rohtang Pass?","Himalaya","Aravalli","Nilgiri","Satpura","Rohtang lies in the Himachal Himalaya.","MTP-ROHTANG-3"),
r("Consider the statements: I. Rohtang is in Himachal Pradesh. II. It links Kullu with Lahaul-Spiti. Which is correct?","Both I and II are correct","Only I is correct","Only II is correct","Neither I nor II is correct","Both facts are correct.","MTP-ROHTANG-4"),
r("A high pass in Himachal Pradesh historically links Kullu with Lahaul-Spiti. Which one is it?","Rohtang Pass","Nathu La","Zoji La","Lipulekh Pass","The Kullu-Lahaul clue identifies Rohtang.","MTP-ROHTANG-5")
]),
buildQl("LIPULEKH-PASS","Lipulekh Pass",[
r("Lipulekh Pass is located in which state?","Uttarakhand","Sikkim","Himachal Pradesh","Arunachal Pradesh","Lipulekh lies in the Kumaon Himalaya of Uttarakhand.","MTP-LIPU-1"),
r("Lipulekh Pass lies near India's boundary with which two countries?","China and Nepal","Bhutan and Bangladesh","Myanmar and China","Pakistan and Afghanistan","The pass lies near the India-China-Nepal tri-junction region.","MTP-LIPU-2"),
r("Which pilgrimage route is closely linked with Lipulekh Pass?","Kailash-Mansarovar route","Amarnath route","Jagannath route","Sabarimala route","Lipulekh has long been used on the Kailash-Mansarovar route.","MTP-LIPU-3"),
r("Consider the statements: I. Lipulekh is in Uttarakhand. II. It is linked with the Kailash-Mansarovar route. Which is correct?","Both I and II are correct","Only I is correct","Only II is correct","Neither I nor II is correct","Both are correct.","MTP-LIPU-4"),
r("A Himalayan pass in Uttarakhand is used on the Kailash-Mansarovar route. Which pass is it?","Lipulekh Pass","Nathu La","Shipki La","Zoji La","The pilgrimage-route clue identifies Lipulekh.","MTP-LIPU-5")
])
]);
export const GEO_MTP_001_CP001_REVIEW_BATCH_V1=finalizeCp(1,GEO_MTP_001_CP001_QLS);
export function auditGeoMtp001Cp001ReviewBatchV1(){return auditCp(1,GEO_MTP_001_CP001_QLS,GEO_MTP_001_CP001_REVIEW_BATCH_V1);}

export const GEO_MTP_001_CP002_QLS=Object.freeze([
buildQl("BOMDI-LA","Bomdi La",[
r("Bomdi La is located in which state?","Arunachal Pradesh","Sikkim","Himachal Pradesh","Uttarakhand","Bomdi La is a Himalayan pass in Arunachal Pradesh.","MTP-BOMDI-1"),
r("Bomdi La is linked with which broad region?","Western Arunachal Himalaya","Kashmir Valley","Thar Desert","Konkan Coast","The pass lies in the western part of Arunachal Pradesh's Himalayan region.","MTP-BOMDI-2"),
r("Which neighbouring country lies north of Bomdi La's region?","China","Bangladesh","Sri Lanka","Maldives","Arunachal Pradesh shares its northern frontier with China.","MTP-BOMDI-3"),
r("Consider the statements: I. Bomdi La is in Arunachal Pradesh. II. It lies in the eastern Himalayan region. Which is correct?","Both I and II are correct","Only I is correct","Only II is correct","Neither I nor II is correct","Both statements are correct.","MTP-BOMDI-4"),
r("A Himalayan pass in Arunachal Pradesh lies on routes toward the Tibetan frontier. Which pass is it?","Bomdi La","Rohtang Pass","Shipki La","Zoji La","The Arunachal clue identifies Bomdi La.","MTP-BOMDI-5")
]),
buildQl("BANihAL-PASS","Banihal Pass",[
r("Banihal Pass is located in which Union Territory?","Jammu and Kashmir","Ladakh","Delhi","Chandigarh","Banihal lies in the Jammu and Kashmir Himalayan region.","MTP-BANI-1"),
r("Banihal Pass historically connected the Jammu region with which valley?","Kashmir Valley","Kullu Valley","Brahmaputra Valley","Narmada Valley","Banihal provided an important route through the Pir Panjal toward Kashmir.","MTP-BANI-2"),
r("Which range is closely linked with Banihal Pass?","Pir Panjal","Aravalli","Satpura","Nilgiri","Banihal lies in the Pir Panjal range.","MTP-BANI-3"),
r("Consider the statements: I. Banihal is in the Pir Panjal. II. It provides access toward the Kashmir Valley. Which is correct?","Both I and II are correct","Only I is correct","Only II is correct","Neither I nor II is correct","Both are correct.","MTP-BANI-4"),
r("A pass through the Pir Panjal historically linked Jammu with the Kashmir Valley. Which pass is it?","Banihal Pass","Nathu La","Bomdi La","Shipki La","The Pir Panjal clue identifies Banihal.","MTP-BANI-5")
]),
buildQl("KHARDUNG-LA","Khardung La",[
r("Khardung La is located in which Union Territory?","Ladakh","Jammu and Kashmir","Delhi","Puducherry","Khardung La lies in Ladakh north of Leh.","MTP-KHAR-1"),
r("Khardung La provides access from Leh toward which valley?","Nubra Valley","Kashmir Valley","Kullu Valley","Doon Valley","The pass is a major route from Leh toward Nubra.","MTP-KHAR-2"),
r("Which broad mountain region contains Khardung La?","Ladakh region of the Himalaya-Karakoram system","Western Ghats","Aravalli","Eastern Ghats","Khardung La lies in Ladakh's high mountain terrain.","MTP-KHAR-3"),
r("Consider the statements: I. Khardung La is near Leh. II. It leads toward Nubra Valley. Which is correct?","Both I and II are correct","Only I is correct","Only II is correct","Neither I nor II is correct","Both are standard location facts.","MTP-KHAR-4"),
r("A high pass north of Leh gives access toward Nubra Valley. Which one is it?","Khardung La","Rohtang Pass","Nathu La","Banihal Pass","The Leh-Nubra clue identifies Khardung La.","MTP-KHAR-5")
]),
buildQl("CHANG-LA","Chang La",[
r("Chang La is located in which Union Territory?","Ladakh","Jammu and Kashmir","Chandigarh","Delhi","Chang La is a high pass in Ladakh.","MTP-CHANG-1"),
r("Chang La lies on the route from Leh toward which lake region?","Pangong Tso","Wular Lake","Chilika Lake","Loktak Lake","The Leh-Pangong route crosses Chang La.","MTP-CHANG-2"),
r("Which broad setting describes Chang La?","High-altitude Ladakh mountain pass","Coastal gap","Desert plain crossing","River delta route","Chang La is a high mountain pass in Ladakh.","MTP-CHANG-3"),
r("Consider the statements: I. Chang La is in Ladakh. II. It lies on a route toward Pangong Tso. Which is correct?","Both I and II are correct","Only I is correct","Only II is correct","Neither I nor II is correct","Both are correct.","MTP-CHANG-4"),
r("A high pass on the Leh-Pangong route is called what?","Chang La","Zoji La","Nathu La","Shipki La","The Leh-Pangong clue identifies Chang La.","MTP-CHANG-5")
]),
buildQl("JELEP-LA","Jelep La",[
r("Jelep La is located in which state?","Sikkim","Uttarakhand","Himachal Pradesh","Arunachal Pradesh","Jelep La lies in Sikkim near the India-China frontier.","MTP-JELEP-1"),
r("Jelep La historically formed a trade route toward which region?","Tibet","Maldives","Sri Lanka","Bangladesh delta","The pass was used on routes between Sikkim and Tibet.","MTP-JELEP-2"),
r("Which mountain region contains Jelep La?","Eastern Himalaya","Western Ghats","Aravalli","Satpura","Jelep La lies in the eastern Himalayan region.","MTP-JELEP-3"),
r("Consider the statements: I. Jelep La is in Sikkim. II. It is historically linked with Tibet trade routes. Which is correct?","Both I and II are correct","Only I is correct","Only II is correct","Neither I nor II is correct","Both statements are correct.","MTP-JELEP-4"),
r("A historic Sikkim-Tibet pass in the eastern Himalaya is called what?","Jelep La","Banihal Pass","Rohtang Pass","Lipulekh Pass","The Sikkim-Tibet clue identifies Jelep La.","MTP-JELEP-5")
])
]);
export const GEO_MTP_001_CP002_REVIEW_BATCH_V1=finalizeCp(2,GEO_MTP_001_CP002_QLS);
export function auditGeoMtp001Cp002ReviewBatchV1(){return auditCp(2,GEO_MTP_001_CP002_QLS,GEO_MTP_001_CP002_REVIEW_BATCH_V1);}

export const GEO_MTP_001_CP003_QLS=Object.freeze([
buildQl("KANCHENJUNGA","Kanchenjunga",[
r("Kanchenjunga is located on the boundary of India and which country?","Nepal","Bhutan","China","Myanmar","Kanchenjunga lies on the India-Nepal boundary in the eastern Himalaya.","MTP-KAN-1"),
r("Which Indian state is linked with Kanchenjunga?","Sikkim","Uttarakhand","Himachal Pradesh","Arunachal Pradesh","The peak rises along Sikkim's western boundary.","MTP-KAN-2"),
r("Which mountain system contains Kanchenjunga?","Himalaya","Aravalli","Western Ghats","Satpura","Kanchenjunga is one of the great Himalayan peaks.","MTP-KAN-3"),
r("Consider the statements: I. Kanchenjunga is linked with Sikkim. II. It lies on the India-Nepal boundary. Which is correct?","Both I and II are correct","Only I is correct","Only II is correct","Neither I nor II is correct","Both are correct.","MTP-KAN-4"),
r("A major Himalayan peak on Sikkim's western boundary is shared with Nepal. Which peak is it?","Kanchenjunga","Nanda Devi","Anamudi","Guru Shikhar","The Sikkim-Nepal clue identifies Kanchenjunga.","MTP-KAN-5")
]),
buildQl("NANDA-DEVI","Nanda Devi",[
r("Nanda Devi is located in which state?","Uttarakhand","Sikkim","Himachal Pradesh","Kerala","Nanda Devi is a major Himalayan peak in Uttarakhand.","MTP-NANDA-1"),
r("Which mountain system contains Nanda Devi?","Himalaya","Aravalli","Western Ghats","Eastern Ghats","The peak lies in the Garhwal Himalaya.","MTP-NANDA-2"),
r("Which protected area shares the peak's name?","Nanda Devi National Park","Gir National Park","Keibul Lamjao National Park","Simlipal National Park","The Nanda Devi National Park surrounds the high mountain landscape.","MTP-NANDA-3"),
r("Consider the statements: I. Nanda Devi is in Uttarakhand. II. It lies in the Himalaya. Which is correct?","Both I and II are correct","Only I is correct","Only II is correct","Neither I nor II is correct","Both are correct.","MTP-NANDA-4"),
r("A major Himalayan peak in Uttarakhand gives its name to a national park. Which peak is it?","Nanda Devi","Kanchenjunga","Anamudi","Doddabetta","The Uttarakhand-park clue identifies Nanda Devi.","MTP-NANDA-5")
]),
buildQl("ANAMUDI","Anamudi",[
r("Anamudi is located in which state?","Kerala","Tamil Nadu","Karnataka","Rajasthan","Anamudi lies in Kerala's Western Ghats.","MTP-ANA-1"),
r("Which mountain system contains Anamudi?","Western Ghats","Himalaya","Aravalli","Vindhya","Anamudi rises in the southern Western Ghats.","MTP-ANA-2"),
r("Anamudi is located near which hill region?","Anaimalai-High Ranges region","Pir Panjal","Kumaon Himalaya","Shillong Plateau","The peak lies in the high ranges of Kerala's Western Ghats.","MTP-ANA-3"),
r("Consider the statements: I. Anamudi is in Kerala. II. It belongs to the Western Ghats. Which is correct?","Both I and II are correct","Only I is correct","Only II is correct","Neither I nor II is correct","Both are correct.","MTP-ANA-4"),
r("A major peak in Kerala rises in the Western Ghats. Which peak is it?","Anamudi","Nanda Devi","Kanchenjunga","Guru Shikhar","The Kerala-Western Ghats clue identifies Anamudi.","MTP-ANA-5")
]),
buildQl("GURU-SHIKHAR","Guru Shikhar",[
r("Guru Shikhar is located in which state?","Rajasthan","Gujarat","Madhya Pradesh","Maharashtra","Guru Shikhar lies at Mount Abu in Rajasthan.","MTP-GURU-1"),
r("Which mountain range contains Guru Shikhar?","Aravalli","Satpura","Western Ghats","Himalaya","Guru Shikhar is the highest point of the Aravalli range.","MTP-GURU-2"),
r("Guru Shikhar is near which hill station?","Mount Abu","Shimla","Ooty","Darjeeling","The peak rises in the Mount Abu area.","MTP-GURU-3"),
r("Consider the statements: I. Guru Shikhar is in Rajasthan. II. It belongs to the Aravalli. Which is correct?","Both I and II are correct","Only I is correct","Only II is correct","Neither I nor II is correct","Both are correct.","MTP-GURU-4"),
r("A peak near Mount Abu forms the highest point of the Aravalli range. Which peak is it?","Guru Shikhar","Anamudi","Nanda Devi","Doddabetta","The Mount Abu-Aravalli clue identifies Guru Shikhar.","MTP-GURU-5")
]),
buildQl("DODDABETTA","Doddabetta",[
r("Doddabetta is located in which state?","Tamil Nadu","Kerala","Karnataka","Rajasthan","Doddabetta lies in the Nilgiri Hills of Tamil Nadu.","MTP-DOD-1"),
r("Which hill range contains Doddabetta?","Nilgiri Hills","Aravalli","Pir Panjal","Shivalik","Doddabetta is a prominent Nilgiri peak.","MTP-DOD-2"),
r("Doddabetta is near which hill station?","Ooty","Shimla","Gangtok","Mount Abu","The peak rises near Ooty in the Nilgiri Hills.","MTP-DOD-3"),
r("Consider the statements: I. Doddabetta is in Tamil Nadu. II. It lies in the Nilgiri Hills. Which is correct?","Both I and II are correct","Only I is correct","Only II is correct","Neither I nor II is correct","Both are correct.","MTP-DOD-4"),
r("A prominent peak near Ooty lies in the Nilgiri Hills. Which peak is it?","Doddabetta","Guru Shikhar","Nanda Devi","Kanchenjunga","The Ooty-Nilgiri clue identifies Doddabetta.","MTP-DOD-5")
])
]);
export const GEO_MTP_001_CP003_REVIEW_BATCH_V1=finalizeCp(3,GEO_MTP_001_CP003_QLS);
export function auditGeoMtp001Cp003ReviewBatchV1(){return auditCp(3,GEO_MTP_001_CP003_QLS,GEO_MTP_001_CP003_REVIEW_BATCH_V1);}
