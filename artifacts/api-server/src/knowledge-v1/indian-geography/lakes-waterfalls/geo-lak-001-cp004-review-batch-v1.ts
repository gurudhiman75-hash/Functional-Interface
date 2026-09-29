import { buildQl, finalizeCp, auditCp } from "./geo-lak-001-review-builder";
const r=(stem:string,answer:string,d1:string,d2:string,d3:string,explanation:string,sourceFactId:string)=>({stem,answer,distractors:[d1,d2,d3] as const,explanation,sourceFactId});
export const GEO_LAK_001_CP004_QLS=Object.freeze([
buildQl("MATCH-LAKES","Match lakes with states/types",[
r("Which set is correctly matched?","Wular—Jammu and Kashmir; Loktak—Manipur; Chilika—Odisha","Wular—Odisha; Loktak—Rajasthan; Chilika—Manipur","All three—Kerala","All three—Ladakh","The state-lake relationships are correct.","LAK-INT-M1"),
r("Which set correctly matches lake and type?","Sambhar—saline; Chilika—brackish lagoon; Wular—freshwater","Sambhar—freshwater; Chilika—glacial; Wular—saline","All three—coastal lagoons","All three—impact craters","The three water bodies have distinct origins and water characteristics.","LAK-INT-M2"),
r("Which set correctly matches lake and feature?","Loktak—phumdis; Lonar—impact crater; Dal—houseboats","Loktak—salt production; Lonar—coral reef; Dal—desert dunes","All three—river deltas","All three—glacial lakes","The features are characteristic of the named lakes.","LAK-INT-M3"),
r("Which set correctly matches waterfalls with rivers?","Jog—Sharavathi; Chitrakote—Indravati; Dhuandhar—Narmada","Jog—Narmada; Chitrakote—Sharavathi; Dhuandhar—Indravati","All three—Kaveri","All three—Godavari","The waterfall-river pairs are correct.","LAK-INT-M4")
]),
buildQl("STATEMENT-LAKES","Multi-statement lake and waterfall geography",[
r("Consider the statements: I. Chilika is in Odisha. II. Pulicat spans Andhra Pradesh and Tamil Nadu. III. Sambhar is in Rajasthan. Which is correct?","I, II and III","I and II only","II and III only","I and III only","All three lake-location statements are correct.","LAK-INT-S1"),
r("Consider the statements: I. Loktak is known for phumdis. II. Lonar occupies an impact crater. Which is correct?","Both I and II are correct","Only I is correct","Only II is correct","Neither I nor II is correct","Both are defining features of the two lakes.","LAK-INT-S2"),
r("Consider the statements: I. Jog Falls is on the Sharavathi. II. Hundru Falls is on the Subarnarekha. Which is correct?","Both I and II are correct","Only I is correct","Only II is correct","Neither I nor II is correct","Both waterfall-river pairs are correct.","LAK-INT-S3"),
r("Consider the statements: I. Shivanasamudra is on the Kaveri. II. Hogenakkal is also on the Kaveri. Which is correct?","Both I and II are correct","Only I is correct","Only II is correct","Neither I nor II is correct","Both waterfalls are formed by the Kaveri system.","LAK-INT-S4")
]),
buildQl("CLUE-LAKES","Lake and waterfall clue identification",[
r("A lake in Manipur contains floating phumdis. Which lake is it?","Loktak","Wular","Sambhar","Pulicat","Phumdis are the defining clue for Loktak.","LAK-INT-C1"),
r("Which Odisha lagoon is open toward the Bay of Bengal?","Chilika","Dal","Wular","Lonar","The Odisha coastal-lagoon clue identifies Chilika.","LAK-INT-C2"),
r("A lake in Maharashtra occupies a meteorite-impact crater. Which one is it?","Lonar","Kolleru","Vembanad","Sambhar","The impact-crater clue identifies Lonar.","LAK-INT-C3"),
r("A waterfall on the Narmada lies near Bhedaghat. Which one is it?","Dhuandhar","Jog","Chitrakote","Hundru","The Narmada-Bhedaghat clue identifies Dhuandhar.","LAK-INT-C4")
]),
buildQl("INTEGRATED-LAKE-REASONING","Integrated lake/waterfall reasoning",[
r("Which comparison correctly distinguishes Chilika and Sambhar?","Chilika is a coastal lagoon, while Sambhar is an inland saline lake","Both are glacial lakes","Both are freshwater Himalayan lakes","Both are impact craters","The two lakes differ in setting and water type.","LAK-INT-R1"),
r("Which comparison correctly contrasts Wular and Kolleru?","Wular is linked with the Jhelum, while Kolleru lies between Krishna and Godavari deltas","Wular is in Rajasthan","Kolleru is in Ladakh","Both are coastal lagoons","The geographic relationships are distinct and correct.","LAK-INT-R2"),
r("Which combination correctly identifies plateau-region waterfalls?","Hundru—Chota Nagpur; Chitrakote—Bastar","Hundru—Kashmir; Chitrakote—Konkan","Both—Aravalli","Both—Nilgiri","The waterfalls are tied to plateau river systems in eastern-central India.","LAK-INT-R3"),
r("Which combination correctly identifies Kaveri waterfalls?","Shivanasamudra and Hogenakkal","Jog and Dhuandhar","Hundru and Chitrakote","Dudhsagar and Jog","Both Shivanasamudra and Hogenakkal are on the Kaveri.","LAK-INT-R4")
])
]);
export const GEO_LAK_001_CP004_REVIEW_BATCH_V1=finalizeCp(4,GEO_LAK_001_CP004_QLS);
export function auditGeoLak001Cp004ReviewBatchV1(){return auditCp(4,GEO_LAK_001_CP004_QLS,GEO_LAK_001_CP004_REVIEW_BATCH_V1);}
