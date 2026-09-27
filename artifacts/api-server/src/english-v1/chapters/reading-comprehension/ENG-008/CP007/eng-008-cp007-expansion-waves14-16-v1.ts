import{ENG008_WAVE14_BP_SPECS}from"../eng-008-expansion-wave14-v1";
import{ENG008_WAVE15_BP_SPECS}from"../eng-008-expansion-wave15-v1";
import{ENG008_WAVE16_BP_SPECS}from"../eng-008-expansion-wave16-v1";
const all=[...ENG008_WAVE14_BP_SPECS,...ENG008_WAVE15_BP_SPECS,...ENG008_WAVE16_BP_SPECS];
export const ENG008_CP007_EXPANSION_WAVES14_16_V1=all.map(s=>({
 id:`${s.id.split("-").pop()}-Q10`,passageId:s.id,genre:s.genre,familyId:"BP-F10" as const,difficulty:"medium" as const,
 targetText:s.keyword,prompt:"Which word best fits the blank in the passage?",correctAnswer:s.keyword,
 distractors:["unrelated","temporary","decorative"] as const,
 explanation:`The passage uses “${s.keyword}” to mean ${s.keywordMeaning}, so it is the word that best preserves the intended sense of the sentence.`,
 evidence:`${s.keyword} means ${s.keywordMeaning}`
}));
