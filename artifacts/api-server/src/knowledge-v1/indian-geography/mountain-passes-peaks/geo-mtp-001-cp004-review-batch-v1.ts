import { buildQl, finalizeCp, auditCp } from "./geo-mtp-001-review-builder";
const r=(stem:string,answer:string,d1:string,d2:string,d3:string,explanation:string,sourceFactId:string)=>({stem,answer,distractors:[d1,d2,d3] as const,explanation,sourceFactId});
export const GEO_MTP_001_CP004_QLS=Object.freeze([
buildQl("MATCH-PASSES","Match passes with states/regions",[
r("Which set is correctly matched?","Nathu La—Sikkim; Shipki La—Himachal Pradesh; Lipulekh—Uttarakhand","Nathu La—Uttarakhand; Shipki La—Sikkim; Lipulekh—Himachal Pradesh","All three—Ladakh","All three—Arunachal Pradesh","The pass-state relationships are correct.","MTP-INT-M1"),
r("Which set correctly matches pass and route?","Zoji La—Srinagar-Leh; Khardung La—Leh-Nubra; Chang La—Leh-Pangong","Zoji La—Leh-Nubra; Khardung La—Srinagar-Leh; Chang La—Kullu-Spiti","All three—Delhi-Jaipur","All three—Kolkata-Siliguri","The route-pass relationships are correct.","MTP-INT-M2"),
r("Which set correctly matches peak and state?","Nanda Devi—Uttarakhand; Anamudi—Kerala; Doddabetta—Tamil Nadu","Nanda Devi—Kerala; Anamudi—Rajasthan; Doddabetta—Sikkim","All three—Himachal Pradesh","All three—Ladakh","The peak-state relationships are correct.","MTP-INT-M3"),
r("Which set correctly matches peak and range?","Guru Shikhar—Aravalli; Doddabetta—Nilgiri; Anamudi—Western Ghats","Guru Shikhar—Himalaya; Doddabetta—Aravalli; Anamudi—Satpura","All three—Himalaya","All three—Eastern Ghats","The peak-range relationships are correct.","MTP-INT-M4")
]),
buildQl("STATEMENT-MOUNTAIN-REFERENCE","Multi-statement passes and peaks",[
r("Consider the statements: I. Nathu La is in Sikkim. II. Shipki La is in Himachal Pradesh. III. Lipulekh is in Uttarakhand. Which is correct?","I, II and III","I and II only","II and III only","I and III only","All three pass-state statements are correct.","MTP-INT-S1"),
r("Consider the statements: I. Zoji La links Kashmir and Ladakh. II. Banihal lies in the Pir Panjal. Which is correct?","Both I and II are correct","Only I is correct","Only II is correct","Neither I nor II is correct","Both route and range facts are correct.","MTP-INT-S2"),
r("Consider the statements: I. Kanchenjunga is linked with Sikkim. II. Nanda Devi is in Uttarakhand. Which is correct?","Both I and II are correct","Only I is correct","Only II is correct","Neither I nor II is correct","Both peak-state facts are correct.","MTP-INT-S3"),
r("Consider the statements: I. Anamudi is in the Western Ghats. II. Guru Shikhar is in the Aravalli. Which is correct?","Both I and II are correct","Only I is correct","Only II is correct","Neither I nor II is correct","Both range associations are correct.","MTP-INT-S4")
]),
buildQl("CLUE-PASSES-PEAKS","Pass and peak clue identification",[
r("A Sikkim pass lies on the India-China frontier and historic Tibet route. Which one is it?","Nathu La","Zoji La","Banihal Pass","Rohtang Pass","The Sikkim-China clue identifies Nathu La.","MTP-INT-C1"),
r("A pass on the Srinagar-Leh route provides access to Ladakh. Which one is it?","Zoji La","Shipki La","Bomdi La","Nathu La","The Srinagar-Leh clue identifies Zoji La.","MTP-INT-C2"),
r("A peak near Mount Abu is the highest point of the Aravalli. Which one is it?","Guru Shikhar","Anamudi","Nanda Devi","Doddabetta","The Mount Abu-Aravalli clue identifies Guru Shikhar.","MTP-INT-C3"),
r("A peak near Ooty lies in the Nilgiri Hills. Which one is it?","Doddabetta","Kanchenjunga","Nanda Devi","Guru Shikhar","The Ooty-Nilgiri clue identifies Doddabetta.","MTP-INT-C4")
]),
buildQl("INTEGRATED-MOUNTAIN-REASONING","Integrated pass/peak reasoning",[
r("Which comparison is correct?","Nathu La and Jelep La are in Sikkim, while Shipki La is in Himachal Pradesh","All three are in Ladakh","Shipki La is in Sikkim","Nathu La is in Uttarakhand","The state distribution of these passes is distinct.","MTP-INT-R1"),
r("Which comparison is correct?","Khardung La leads toward Nubra, while Chang La lies on the route toward Pangong","Both lead to Kashmir Valley","Both are in Sikkim","Both are in Himachal Pradesh","The passes serve different routes from Leh.","MTP-INT-R2"),
r("Which combination correctly identifies southern peaks?","Anamudi—Kerala; Doddabetta—Tamil Nadu","Anamudi—Sikkim; Doddabetta—Uttarakhand","Both—Rajasthan","Both—Himachal Pradesh","The two peaks are in the southern Western Ghats-Nilgiri region.","MTP-INT-R3"),
r("Which combination correctly identifies Himalayan peaks?","Kanchenjunga and Nanda Devi","Guru Shikhar and Doddabetta","Anamudi and Guru Shikhar","Doddabetta and Anamudi","Kanchenjunga and Nanda Devi are major Himalayan peaks.","MTP-INT-R4")
])
]);
export const GEO_MTP_001_CP004_REVIEW_BATCH_V1=finalizeCp(4,GEO_MTP_001_CP004_QLS);
export function auditGeoMtp001Cp004ReviewBatchV1(){return auditCp(4,GEO_MTP_001_CP004_QLS,GEO_MTP_001_CP004_REVIEW_BATCH_V1);}
