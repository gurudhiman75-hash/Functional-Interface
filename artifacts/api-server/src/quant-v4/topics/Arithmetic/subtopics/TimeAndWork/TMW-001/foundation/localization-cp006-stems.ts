import { required } from "./cp001-helpers";
import type { TmwCp006GeneratedQuestion } from "./cp006-types";
import type { TmwLocalizedLanguage } from "./localization-types";
import {
  cp006Copy,
  cp006Days,
  cp006Dimensions,
  cp006EfficiencyRelation,
  cp006Hours,
  cp006HoursPerDay,
  cp006Number,
  cp006Resource,
  cp006WorkRelation,
} from "./localization-cp006-language";

function q(language:TmwLocalizedLanguage,hi:string,pa:string):string{return language==="hi"?hi:pa;}

export function renderTmwCp006LocalizedStem(source:TmwCp006GeneratedQuestion,language:TmwLocalizedLanguage):string{
  const p=source.parameters,a=p.stateA,b=p.stateB;
  const job=cp006Copy(p.context.jobPhrase,language);
  const singular=cp006Copy(p.context.resourceSingular,language);
  const plural=cp006Copy(p.context.resourcePlural,language);
  const output=cp006Copy(p.context.outputUnit,language);
  switch(source.solveMode){
    case "findRequiredResourceCount":return q(language,
      `एक परियोजना में ${cp006Resource(p,a.resources,language)} ${cp006HoursPerDay(a.hoursPerDay,language)} काम करके ${job} को ${cp006Days(a.days,language,true)} पूरा करते हैं। अब ${cp006WorkRelation(p,language)} को ${cp006Days(b.days,language,true)}, ${cp006HoursPerDay(b.hoursPerDay,language)} और ${cp006EfficiencyRelation(p,language)} पूरा करना है। कुल कितने ${plural} चाहिए?`,
      `ਇੱਕ ਪ੍ਰੋਜੈਕਟ ਵਿੱਚ ${cp006Resource(p,a.resources,language)} ${cp006HoursPerDay(a.hoursPerDay,language)} ਕੰਮ ਕਰਕੇ ${job} ਨੂੰ ${cp006Days(a.days,language,true)} ਪੂਰਾ ਕਰਦੇ ਹਨ। ਹੁਣ ${cp006WorkRelation(p,language)} ਨੂੰ ${cp006Days(b.days,language,true)}, ${cp006HoursPerDay(b.hoursPerDay,language)} ਅਤੇ ${cp006EfficiencyRelation(p,language)} ਪੂਰਾ ਕਰਨਾ ਹੈ। ਕੁੱਲ ਕਿੰਨੇ ${plural} ਚਾਹੀਦੇ ਹਨ?`);
    case "findRequiredDays":return q(language,
      `${cp006Resource(p,a.resources,language)} ${cp006HoursPerDay(a.hoursPerDay,language)} काम करके ${job} को ${cp006Days(a.days,language,true)} पूरा करते हैं। यदि ${cp006Resource(p,b.resources,language)} ${cp006HoursPerDay(b.hoursPerDay,language)} और ${cp006EfficiencyRelation(p,language)} काम करें, तो ${cp006WorkRelation(p,language)} कितने दिनों में पूरा होगा?`,
      `${cp006Resource(p,a.resources,language)} ${cp006HoursPerDay(a.hoursPerDay,language)} ਕੰਮ ਕਰਕੇ ${job} ਨੂੰ ${cp006Days(a.days,language,true)} ਪੂਰਾ ਕਰਦੇ ਹਨ। ਜੇ ${cp006Resource(p,b.resources,language)} ${cp006HoursPerDay(b.hoursPerDay,language)} ਅਤੇ ${cp006EfficiencyRelation(p,language)} ਕੰਮ ਕਰਨ, ਤਾਂ ${cp006WorkRelation(p,language)} ਕਿੰਨੇ ਦਿਨਾਂ ਵਿੱਚ ਪੂਰਾ ਹੋਵੇਗਾ?`);
    case "findRequiredDailyHours":return q(language,
      `${cp006Resource(p,a.resources,language)} ${cp006HoursPerDay(a.hoursPerDay,language)} काम करके ${job} को ${cp006Days(a.days,language,true)} पूरा करते हैं। ${cp006WorkRelation(p,language)} को ${cp006Days(b.days,language,true)} पूरा करने के लिए ${cp006Resource(p,b.resources,language)} को ${cp006EfficiencyRelation(p,language)} प्रतिदिन कितने घंटे काम करना होगा?`,
      `${cp006Resource(p,a.resources,language)} ${cp006HoursPerDay(a.hoursPerDay,language)} ਕੰਮ ਕਰਕੇ ${job} ਨੂੰ ${cp006Days(a.days,language,true)} ਪੂਰਾ ਕਰਦੇ ਹਨ। ${cp006WorkRelation(p,language)} ਨੂੰ ${cp006Days(b.days,language,true)} ਪੂਰਾ ਕਰਨ ਲਈ ${cp006Resource(p,b.resources,language)} ਨੂੰ ${cp006EfficiencyRelation(p,language)} ਹਰ ਦਿਨ ਕਿੰਨੇ ਘੰਟੇ ਕੰਮ ਕਰਨਾ ਪਵੇਗਾ?`);
    case "findRelativeEfficiency":return q(language,
      `${cp006Resource(p,a.resources,language)} ${cp006HoursPerDay(a.hoursPerDay,language)} काम करके ${job} को ${cp006Days(a.days,language,true)} पूरा करते हैं। दूसरी व्यवस्था में ${cp006Resource(p,b.resources,language)} ${cp006Days(b.days,language)} तक ${cp006HoursPerDay(b.hoursPerDay,language)} काम करके ${cp006WorkRelation(p,language)} पूरा करते हैं। उनकी प्रति-${singular} दक्षता मूल दक्षता की कितनी गुनी है?`,
      `${cp006Resource(p,a.resources,language)} ${cp006HoursPerDay(a.hoursPerDay,language)} ਕੰਮ ਕਰਕੇ ${job} ਨੂੰ ${cp006Days(a.days,language,true)} ਪੂਰਾ ਕਰਦੇ ਹਨ। ਦੂਜੀ ਵਿਵਸਥਾ ਵਿੱਚ ${cp006Resource(p,b.resources,language)} ${cp006Days(b.days,language)} ਤੱਕ ${cp006HoursPerDay(b.hoursPerDay,language)} ਕੰਮ ਕਰਕੇ ${cp006WorkRelation(p,language)} ਪੂਰਾ ਕਰਦੇ ਹਨ। ਉਨ੍ਹਾਂ ਦੀ ਪ੍ਰਤੀ-${singular} ਦੱਖਤਾ ਮੂਲ ਦੱਖਤਾ ਦੀ ਕਿੰਨੀ ਗੁਣੀ ਹੈ?`);
    case "findWorkQuantity":return q(language,
      `एक उत्पादन व्यवस्था में ${cp006Resource(p,a.resources,language)} ${cp006Number(a.days)} पालियों में ${cp006Number(a.work)} ${output} बनाते हैं। प्रति-${singular} प्रति-पाली उत्पादन समान रहे, तो ${cp006Resource(p,b.resources,language)} ${cp006Number(b.days)} पालियों में कितने ${output} बनाएँगे?`,
      `ਇੱਕ ਉਤਪਾਦਨ ਵਿਵਸਥਾ ਵਿੱਚ ${cp006Resource(p,a.resources,language)} ${cp006Number(a.days)} ਸ਼ਿਫ਼ਟਾਂ ਵਿੱਚ ${cp006Number(a.work)} ${output} ਬਣਾਉਂਦੇ ਹਨ। ਪ੍ਰਤੀ-${singular} ਪ੍ਰਤੀ-ਸ਼ਿਫ਼ਟ ਉਤਪਾਦਨ ਇੱਕੋ ਰਹੇ, ਤਾਂ ${cp006Resource(p,b.resources,language)} ${cp006Number(b.days)} ਸ਼ਿਫ਼ਟਾਂ ਵਿੱਚ ਕਿੰਨੇ ${output} ਬਣਾਉਣਗੇ?`);
    case "findWorkQuantityRatio":return q(language,
      `योजना I में ${cp006Resource(p,a.resources,language)} ${cp006Days(a.days,language)} तक ${cp006HoursPerDay(a.hoursPerDay,language)} काम करते हैं। योजना II में ${cp006Resource(p,b.resources,language)} ${cp006Days(b.days,language)} तक ${cp006HoursPerDay(b.hoursPerDay,language)} और ${cp006EfficiencyRelation(p,language)} काम करते हैं। योजना II और योजना I के कार्य का अनुपात क्या है?`,
      `ਯੋਜਨਾ I ਵਿੱਚ ${cp006Resource(p,a.resources,language)} ${cp006Days(a.days,language)} ਤੱਕ ${cp006HoursPerDay(a.hoursPerDay,language)} ਕੰਮ ਕਰਦੇ ਹਨ। ਯੋਜਨਾ II ਵਿੱਚ ${cp006Resource(p,b.resources,language)} ${cp006Days(b.days,language)} ਤੱਕ ${cp006HoursPerDay(b.hoursPerDay,language)} ਅਤੇ ${cp006EfficiencyRelation(p,language)} ਕੰਮ ਕਰਦੇ ਹਨ। ਯੋਜਨਾ II ਅਤੇ ਯੋਜਨਾ I ਦੇ ਕੰਮ ਦਾ ਅਨੁਪਾਤ ਕੀ ਹੈ?`);
    case "findAdditionalWorkersForDeadline":return q(language,
      `${cp006Resource(p,a.resources,language)} ${job} को ${cp006Days(a.days,language,true)} पूरा कर सकते हैं। इसे केवल ${cp006Days(b.days,language,true)} पूरा करने के लिए कितने अतिरिक्त ${plural} चाहिए?`,
      `${cp006Resource(p,a.resources,language)} ${job} ਨੂੰ ${cp006Days(a.days,language,true)} ਪੂਰਾ ਕਰ ਸਕਦੇ ਹਨ। ਇਸ ਨੂੰ ਸਿਰਫ਼ ${cp006Days(b.days,language,true)} ਪੂਰਾ ਕਰਨ ਲਈ ਕਿੰਨੇ ਵਾਧੂ ${plural} ਚਾਹੀਦੇ ਹਨ?`);
    case "findWorkersRemovedForDelay":return q(language,
      `${cp006Resource(p,a.resources,language)} ${job} को ${cp006Days(a.days,language,true)} पूरा कर सकते हैं। यदि समय-सीमा ${cp006Days(b.days,language)} कर दी जाए, तो कितने ${plural} हटाए जा सकते हैं?`,
      `${cp006Resource(p,a.resources,language)} ${job} ਨੂੰ ${cp006Days(a.days,language,true)} ਪੂਰਾ ਕਰ ਸਕਦੇ ਹਨ। ਜੇ ਸਮਾਂ-ਸੀਮਾ ${cp006Days(b.days,language)} ਕਰ ਦਿੱਤੀ ਜਾਵੇ, ਤਾਂ ਕਿੰਨੇ ${plural} ਹਟਾਏ ਜਾ ਸਕਦੇ ਹਨ?`);
    case "findOriginalWorkforceFromChangedSchedule":return q(language,
      `${job} को मूल योजना में ${cp006Days(a.days,language,true)} पूरा करना था। कर्मचारियों की संख्या घटाकर ${cp006Resource(p,b.resources,language)} करने पर काम ${cp006Days(b.days,language,true)} पूरा हुआ। मूल योजना में कितने ${plural} थे?`,
      `${job} ਨੂੰ ਮੂਲ ਯੋਜਨਾ ਵਿੱਚ ${cp006Days(a.days,language,true)} ਪੂਰਾ ਕਰਨਾ ਸੀ। ਕਰਮਚਾਰੀਆਂ ਦੀ ਗਿਣਤੀ ਘਟਾ ਕੇ ${cp006Resource(p,b.resources,language)} ਕਰਨ ਉੱਤੇ ਕੰਮ ${cp006Days(b.days,language,true)} ਪੂਰਾ ਹੋਇਆ। ਮੂਲ ਯੋਜਨਾ ਵਿੱਚ ਕਿੰਨੇ ${plural} ਸਨ?`);
    case "findRemainingDaysFromActualProgress":return q(language,
      `${cp006Resource(p,a.resources,language)} ने ${cp006Days(required(p.elapsedDays,"elapsedDays"),language)} में ${job} का केवल ${cp006Number(required(p.completedFraction,"completedFraction"))} भाग पूरा किया। उसी वास्तविक गति से शेष काम पूरा करने में और कितने दिन लगेंगे?`,
      `${cp006Resource(p,a.resources,language)} ਨੇ ${cp006Days(required(p.elapsedDays,"elapsedDays"),language)} ਵਿੱਚ ${job} ਦਾ ਸਿਰਫ਼ ${cp006Number(required(p.completedFraction,"completedFraction"))} ਹਿੱਸਾ ਪੂਰਾ ਕੀਤਾ। ਉਸੇ ਅਸਲ ਗਤੀ ਨਾਲ ਬਾਕੀ ਕੰਮ ਪੂਰਾ ਕਰਨ ਲਈ ਹੋਰ ਕਿੰਨੇ ਦਿਨ ਲੱਗਣਗੇ?`);
    case "findExtraWorkersFromPlannedVsActualProgress":return q(language,
      `${cp006Resource(p,a.resources,language)} को ${job} ${cp006Days(a.days,language,true)} पूरा करना था। ${cp006Days(required(p.elapsedDays,"elapsedDays"),language)} बाद केवल ${cp006Number(required(p.completedFraction,"completedFraction"))} भाग काम हुआ। वर्तमान प्रति-${singular} गति समान रहे, तो मूल समय-सीमा पूरी करने के लिए अभी कितने अतिरिक्त ${plural} चाहिए?`,
      `${cp006Resource(p,a.resources,language)} ਨੇ ${job} ${cp006Days(a.days,language,true)} ਪੂਰਾ ਕਰਨਾ ਸੀ। ${cp006Days(required(p.elapsedDays,"elapsedDays"),language)} ਬਾਅਦ ਸਿਰਫ਼ ${cp006Number(required(p.completedFraction,"completedFraction"))} ਹਿੱਸਾ ਕੰਮ ਹੋਇਆ। ਮੌਜੂਦਾ ਪ੍ਰਤੀ-${singular} ਗਤੀ ਇੱਕੋ ਰਹੇ, ਤਾਂ ਮੂਲ ਸਮਾਂ-ਸੀਮਾ ਪੂਰੀ ਕਰਨ ਲਈ ਹੁਣ ਕਿੰਨੇ ਵਾਧੂ ${plural} ਚਾਹੀਦੇ ਹਨ?`);
    case "findPercentWorkCompletedFromResourceHours":return q(language,
      `${cp006Resource(p,a.resources,language)} ${cp006HoursPerDay(a.hoursPerDay,language)} काम करके ${job} को ${cp006Days(a.days,language,true)} पूरा करते हैं। समान दक्षता पर ${cp006Resource(p,b.resources,language)} ${cp006HoursPerDay(b.hoursPerDay,language)} और ${cp006Days(b.days,language)} काम करें, तो कुल काम का कितने प्रतिशत भाग पूरा होगा?`,
      `${cp006Resource(p,a.resources,language)} ${cp006HoursPerDay(a.hoursPerDay,language)} ਕੰਮ ਕਰਕੇ ${job} ਨੂੰ ${cp006Days(a.days,language,true)} ਪੂਰਾ ਕਰਦੇ ਹਨ। ਇੱਕੋ ਦੱਖਤਾ ਉੱਤੇ ${cp006Resource(p,b.resources,language)} ${cp006HoursPerDay(b.hoursPerDay,language)} ਅਤੇ ${cp006Days(b.days,language)} ਕੰਮ ਕਰਨ, ਤਾਂ ਕੁੱਲ ਕੰਮ ਦਾ ਕਿੰਨਾ ਪ੍ਰਤੀਸ਼ਤ ਪੂਰਾ ਹੋਵੇਗਾ?`);
    case "findPercentScheduleDelay":return q(language,
      `${cp006Resource(p,a.resources,language)} ${job} को ${cp006Days(a.days,language,true)} पूरा कर सकते हैं। यदि केवल ${cp006Resource(p,b.resources,language)} उपलब्ध हों, तो पूरा होने का समय कितने प्रतिशत बढ़ेगा?`,
      `${cp006Resource(p,a.resources,language)} ${job} ਨੂੰ ${cp006Days(a.days,language,true)} ਪੂਰਾ ਕਰ ਸਕਦੇ ਹਨ। ਜੇ ਸਿਰਫ਼ ${cp006Resource(p,b.resources,language)} ਉਪਲਬਧ ਹੋਣ, ਤਾਂ ਪੂਰਾ ਹੋਣ ਦਾ ਸਮਾਂ ਕਿੰਨੇ ਪ੍ਰਤੀਸ਼ਤ ਵਧੇਗਾ?`);
    case "findOvertimeHoursForDeadline":return q(language,
      `${cp006Resource(p,a.resources,language)} ${cp006HoursPerDay(a.hoursPerDay,language)} काम करके ${job} को ${cp006Days(a.days,language,true)} पूरा करते हैं। संख्या घटकर ${cp006Resource(p,b.resources,language)} हो जाए और समय-सीमा वही रहे, तो प्रत्येक शेष ${singular} को प्रतिदिन कितने अतिरिक्त घंटे काम करना होगा?`,
      `${cp006Resource(p,a.resources,language)} ${cp006HoursPerDay(a.hoursPerDay,language)} ਕੰਮ ਕਰਕੇ ${job} ਨੂੰ ${cp006Days(a.days,language,true)} ਪੂਰਾ ਕਰਦੇ ਹਨ। ਗਿਣਤੀ ਘਟ ਕੇ ${cp006Resource(p,b.resources,language)} ਹੋ ਜਾਵੇ ਅਤੇ ਸਮਾਂ-ਸੀਮਾ ਉਹੀ ਰਹੇ, ਤਾਂ ਹਰ ਬਾਕੀ ${singular} ਨੂੰ ਹਰ ਦਿਨ ਕਿੰਨੇ ਵਾਧੂ ਘੰਟੇ ਕੰਮ ਕਰਨਾ ਪਵੇਗਾ?`);
    case "findShiftCountForProductionTarget":return q(language,
      `प्रत्येक ${singular} एक पाली में ${cp006Number(b.efficiency)} ${output} बनाता है। ${cp006Resource(p,b.resources,language)} को ${cp006Number(b.work)} ${output} बनाने के लिए कितनी पालियाँ चाहिए?`,
      `ਹਰ ${singular} ਇੱਕ ਸ਼ਿਫ਼ਟ ਵਿੱਚ ${cp006Number(b.efficiency)} ${output} ਬਣਾਉਂਦਾ ਹੈ। ${cp006Resource(p,b.resources,language)} ਨੂੰ ${cp006Number(b.work)} ${output} ਬਣਾਉਣ ਲਈ ਕਿੰਨੀਆਂ ਸ਼ਿਫ਼ਟਾਂ ਚਾਹੀਦੀਆਂ ਹਨ?`);
    case "findDimensionalWorkRatio":{
      const labels=required(p.dimensionLabels,"dimensionLabels");
      return q(language,
        `समान प्रकार के दो कार्यों में पहले के आयाम ${cp006Dimensions(required(p.dimensionsA,"dimensionsA"),labels,language)} और दूसरे के आयाम ${cp006Dimensions(required(p.dimensionsB,"dimensionsB"),labels,language)} हैं। कार्य संबंधित क्षेत्रफल या आयतन के समानुपाती है। दूसरे कार्य और पहले कार्य का अनुपात क्या है?`,
        `ਇੱਕੋ ਕਿਸਮ ਦੇ ਦੋ ਕੰਮਾਂ ਵਿੱਚ ਪਹਿਲੇ ਦੇ ਮਾਪ ${cp006Dimensions(required(p.dimensionsA,"dimensionsA"),labels,language)} ਅਤੇ ਦੂਜੇ ਦੇ ਮਾਪ ${cp006Dimensions(required(p.dimensionsB,"dimensionsB"),labels,language)} ਹਨ। ਕੰਮ ਸੰਬੰਧਿਤ ਖੇਤਰਫਲ ਜਾਂ ਆਇਤਨ ਦੇ ਅਨੁਪਾਤ ਵਿੱਚ ਹੈ। ਦੂਜੇ ਕੰਮ ਅਤੇ ਪਹਿਲੇ ਕੰਮ ਦਾ ਅਨੁਪਾਤ ਕੀ ਹੈ?`);
    }
    case "findWorkersForChangedDimensions":{
      const labels=required(p.dimensionLabels,"dimensionLabels");
      return q(language,
        `${cp006Resource(p,a.resources,language)} ${cp006Dimensions(required(p.dimensionsA,"dimensionsA"),labels,language)} आयाम वाले ${job} को ${cp006Days(a.days,language,true)} पूरा करते हैं। समान घंटे और दक्षता पर ${cp006Dimensions(required(p.dimensionsB,"dimensionsB"),labels,language)} आयाम वाला समान काम ${cp006Days(b.days,language,true)} पूरा करने के लिए कितने ${plural} चाहिए?`,
        `${cp006Resource(p,a.resources,language)} ${cp006Dimensions(required(p.dimensionsA,"dimensionsA"),labels,language)} ਮਾਪ ਵਾਲੇ ${job} ਨੂੰ ${cp006Days(a.days,language,true)} ਪੂਰਾ ਕਰਦੇ ਹਨ। ਇੱਕੋ ਘੰਟਿਆਂ ਅਤੇ ਦੱਖਤਾ ਉੱਤੇ ${cp006Dimensions(required(p.dimensionsB,"dimensionsB"),labels,language)} ਮਾਪ ਵਾਲਾ ਸਮਾਨ ਕੰਮ ${cp006Days(b.days,language,true)} ਪੂਰਾ ਕਰਨ ਲਈ ਕਿੰਨੇ ${plural} ਚਾਹੀਦੇ ਹਨ?`);
    }
    case "findDaysForChangedDimensions":{
      const labels=required(p.dimensionLabels,"dimensionLabels");
      return q(language,
        `${cp006Resource(p,a.resources,language)} ${cp006Dimensions(required(p.dimensionsA,"dimensionsA"),labels,language)} आयाम वाले ${job} को ${cp006Days(a.days,language,true)} पूरा करते हैं। ${cp006Resource(p,b.resources,language)} समान घंटे और दक्षता पर ${cp006Dimensions(required(p.dimensionsB,"dimensionsB"),labels,language)} आयाम वाला काम कितने दिनों में पूरा करेंगे?`,
        `${cp006Resource(p,a.resources,language)} ${cp006Dimensions(required(p.dimensionsA,"dimensionsA"),labels,language)} ਮਾਪ ਵਾਲੇ ${job} ਨੂੰ ${cp006Days(a.days,language,true)} ਪੂਰਾ ਕਰਦੇ ਹਨ। ${cp006Resource(p,b.resources,language)} ਇੱਕੋ ਘੰਟਿਆਂ ਅਤੇ ਦੱਖਤਾ ਉੱਤੇ ${cp006Dimensions(required(p.dimensionsB,"dimensionsB"),labels,language)} ਮਾਪ ਵਾਲਾ ਕੰਮ ਕਿੰਨੇ ਦਿਨਾਂ ਵਿੱਚ ਪੂਰਾ ਕਰਨਗੇ?`);
    }
    case "findResourceDurationAfterPopulationChange":return q(language,
      `एक राहत शिविर में ${cp006Number(required(p.initialPopulation,"initialPopulation"))} लोगों के लिए ${cp006Days(a.days,language)} का भोजन है। ${cp006Days(required(p.elapsedBeforePopulationChange,"elapsedBeforePopulationChange"),language)} बाद लोगों की संख्या ${cp006Number(required(p.changedPopulation,"changedPopulation"))} हो जाती है। बचा भोजन और कितने दिन चलेगा?`,
      `ਇੱਕ ਰਾਹਤ ਕੈਂਪ ਵਿੱਚ ${cp006Number(required(p.initialPopulation,"initialPopulation"))} ਲੋਕਾਂ ਲਈ ${cp006Days(a.days,language)} ਦਾ ਖਾਣਾ ਹੈ। ${cp006Days(required(p.elapsedBeforePopulationChange,"elapsedBeforePopulationChange"),language)} ਬਾਅਦ ਲੋਕਾਂ ਦੀ ਗਿਣਤੀ ${cp006Number(required(p.changedPopulation,"changedPopulation"))} ਹੋ ਜਾਂਦੀ ਹੈ। ਬਚਿਆ ਖਾਣਾ ਹੋਰ ਕਿੰਨੇ ਦਿਨ ਚੱਲੇਗਾ?`);
    case "findCompletionTimeAfterAbsenteeism":return q(language,
      `${cp006Resource(p,a.resources,language)} को ${job} ${cp006Days(a.days,language,true)} पूरा करना है। यदि ${cp006Number(required(p.absentPercent,"absentPercent"))}% कर्मचारी पूरे समय अनुपस्थित रहें, तो सक्रिय कर्मचारी काम कितने दिनों में पूरा करेंगे?`,
      `${cp006Resource(p,a.resources,language)} ਨੇ ${job} ${cp006Days(a.days,language,true)} ਪੂਰਾ ਕਰਨਾ ਹੈ। ਜੇ ${cp006Number(required(p.absentPercent,"absentPercent"))}% ਕਰਮਚਾਰੀ ਪੂਰੇ ਸਮੇਂ ਗੈਰਹਾਜ਼ਰ ਰਹਿਣ, ਤਾਂ ਸਰਗਰਮ ਕਰਮਚਾਰੀ ਕੰਮ ਕਿੰਨੇ ਦਿਨਾਂ ਵਿੱਚ ਪੂਰਾ ਕਰਨਗੇ?`);
    case "findCompletionWithBatchWorkerAdditions":return q(language,
      `${cp006Resource(p,a.resources,language)} ${job} को ${cp006Days(a.days,language,true)} पूरा कर सकते हैं। इसके बजाय पहले दिन ${cp006Number(required(p.initialBatchResources,"initialBatchResources"))} ${plural} शुरू करते हैं और हर अगले दिन की शुरुआत में ${cp006Number(required(p.batchAddition,"batchAddition"))} नए ${plural} जुड़ते हैं। काम कितने दिनों में पूरा होगा?`,
      `${cp006Resource(p,a.resources,language)} ${job} ਨੂੰ ${cp006Days(a.days,language,true)} ਪੂਰਾ ਕਰ ਸਕਦੇ ਹਨ। ਇਸ ਦੀ ਥਾਂ ਪਹਿਲੇ ਦਿਨ ${cp006Number(required(p.initialBatchResources,"initialBatchResources"))} ${plural} ਸ਼ੁਰੂ ਕਰਦੇ ਹਨ ਅਤੇ ਹਰ ਅਗਲੇ ਦਿਨ ਦੀ ਸ਼ੁਰੂਆਤ ਵਿੱਚ ${cp006Number(required(p.batchAddition,"batchAddition"))} ਨਵੇਂ ${plural} ਜੁੜਦੇ ਹਨ। ਕੰਮ ਕਿੰਨੇ ਦਿਨਾਂ ਵਿੱਚ ਪੂਰਾ ਹੋਵੇਗਾ?`);
    case "findEquivalentResourceTime":{
      const duration=p.context.resourceTimeUnit.endsWith("hours")?cp006Hours(a.days,language):cp006Days(a.days,language);
      return q(language,
        `${cp006Resource(p,a.resources,language)} ${duration} तक कार्यरत हैं। इसके बराबर कुल ${cp006Copy(p.context.resourceTimeUnit,language)} कितना है?`,
        `${cp006Resource(p,a.resources,language)} ${duration} ਤੱਕ ਕੰਮ ਕਰ ਰਹੇ ਹਨ। ਇਸ ਦੇ ਬਰਾਬਰ ਕੁੱਲ ${cp006Copy(p.context.resourceTimeUnit,language)} ਕਿੰਨਾ ਹੈ?`);
    }
  }
}
