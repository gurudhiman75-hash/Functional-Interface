import type {
  ClockQuestion,
  ClockQuestionExplanation,
  ClockQuestionMedia,
  ClockQuestionOption,
} from './runtime/types';

export type ClockAuthoringLanguage = 'en' | 'hi' | 'pa';

function scenarioValue(question: ClockQuestion, key: string): string {
  const value = question.scenario[key];
  return value == null ? '' : String(value);
}

function translateDisplay(value: string, language: Exclude<ClockAuthoringLanguage, 'en'>): string {
  const gainLossMatch = value.trim().match(/^(gains?|loses?)\s+(.+)$/iu);
  if (gainLossMatch) {
    const direction = gainLossMatch[1]!.toLowerCase().startsWith('gain') ? 'GAIN' : 'LOSS';
    const amount = gainLossMatch[2]!
      .replace(/\bminutes?\b/giu, language === 'hi' ? 'मिनट' : 'ਮਿੰਟ')
      .replace(/\bseconds?\b/giu, language === 'hi' ? 'सेकंड' : 'ਸਕਿੰਟ');
    if (language === 'hi') return amount + (direction === 'GAIN' ? ' आगे' : ' पीछे');
    return amount + (direction === 'GAIN' ? ' ਅੱਗੇ' : ' ਪਿੱਛੇ');
  }

  const pastMatch = value.trim().match(/^(.+?)\s+minutes?\s+past\s+(\d{1,2})$/iu);
  if (pastMatch) {
    const amount = pastMatch[1]!;
    const hour = pastMatch[2]!;
    return language === 'hi'
      ? hour + ' बजकर ' + amount + ' मिनट'
      : hour + ' ਵੱਜ ਕੇ ' + amount + ' ਮਿੰਟ';
  }

  let out = value;
  const replacements: readonly [RegExp, string, string][] = [
    [/gain of /gi, 'बढ़त ', 'ਵਾਧਾ '],
    [/loss of /gi, 'कमी ', 'ਘਾਟਾ '],
    [/ per day/gi, ' प्रति दिन', ' ਪ੍ਰਤੀ ਦਿਨ'],
    [/minutes/gi, 'मिनट', 'ਮਿੰਟ'],
    [/minute/gi, 'मिनट', 'ਮਿੰਟ'],
    [/seconds/gi, 'सेकंड', 'ਸਕਿੰਟ'],
    [/second/gi, 'सेकंड', 'ਸਕਿੰਟ'],
    [/hours/gi, 'घंटे', 'ਘੰਟੇ'],
    [/hour/gi, 'घंटा', 'ਘੰਟਾ'],
    [/days later/gi, 'दिन बाद', 'ਦਿਨ ਬਾਅਦ'],
    [/day later/gi, 'दिन बाद', 'ਦਿਨ ਬਾਅਦ'],
    [/day \+/gi, 'दिन +', 'ਦਿਨ +'],
    [/day \-/gi, 'दिन -', 'ਦਿਨ -'],
    [/coincidence/gi, 'सुइयों का मिलना', 'ਸੂਈਆਂ ਦਾ ਮਿਲਣਾ'],
    [/coincident/gi, 'एक-दूसरे पर', 'ਇੱਕ-ਦੂਜੇ ਉੱਤੇ'],
    [/coincide/gi, 'एक-दूसरे पर', 'ਇੱਕ-ਦੂਜੇ ਉੱਤੇ'],
    [/right angle/gi, 'समकोण', 'ਸਮਕੋਣ'],
    [/opposite/gi, 'विपरीत', 'ਵਿਰੁੱਧ'],
    [/other/gi, 'अन्य', 'ਹੋਰ'],
    [/fast/gi, 'तेज़', 'ਤੇਜ਼'],
    [/slow/gi, 'धीमी', 'ਹੌਲੀ'],
    [/correct/gi, 'सही', 'ਸਹੀ'],
    [/Yes/gi, 'हाँ', 'ਹਾਂ'],
    [/No/gi, 'नहीं', 'ਨਹੀਂ'],
    [/Diagram option/gi, 'चित्र विकल्प', 'ਚਿੱਤਰ ਵਿਕਲਪ'],
  ];
  for (const [pattern, hi, pa] of replacements) {
    out = out.replace(pattern, language === 'hi' ? hi : pa);
  }
  return out;
}

function localizedEventLabel(
  eventType: string,
  language: Exclude<ClockAuthoringLanguage, 'en'>,
): string {
  const labels: Record<string, readonly [string, string]> = {
    COINCIDENCE: ['सुइयों के एक-दूसरे पर आने की घटना', 'ਸੂਈਆਂ ਦੇ ਇੱਕ-ਦੂਜੇ ਉੱਤੇ ਆਉਣ ਦੀ ਘਟਨਾ'],
    OPPOSITION: ['सुइयों के विपरीत होने की घटना', 'ਸੂਈਆਂ ਦੇ ਵਿਰੁੱਧ ਹੋਣ ਦੀ ਘਟਨਾ'],
    RIGHT_ANGLE: ['सुइयों के समकोण बनाने की घटना', 'ਸੂਈਆਂ ਦੇ ਸਮਕੋਣ ਬਣਾਉਣ ਦੀ ਘਟਨਾ'],
  };
  const value = labels[eventType] ?? ['घड़ी की घटना', 'ਘੜੀ ਦੀ ਘਟਨਾ'];
  return language === 'hi' ? value[0] : value[1];
}

function translatedOptions(
  options: readonly ClockQuestionOption[],
  language: Exclude<ClockAuthoringLanguage, 'en'>,
): ClockQuestionOption[] {
  return options.map((option) => ({
    ...option,
    display: translateDisplay(option.display, language),
    reason: '',
    answer: {
      ...option.answer,
      display: translateDisplay(option.answer.display, language),
    },
  }));
}

function localizeMedia(
  media: ClockQuestionMedia | undefined,
  language: Exclude<ClockAuthoringLanguage, 'en'>,
): ClockQuestionMedia | undefined {
  if (!media) return undefined;
  const aria = language === 'hi'
    ? 'घड़ी का प्रश्न-चित्र'
    : 'ਘੜੀ ਦਾ ਪ੍ਰਸ਼ਨ-ਚਿੱਤਰ';
  return {
    prompt: media.prompt ? { ...media.prompt, ariaLabel: aria } : undefined,
    options: media.options?.map((entry, index) => ({
      ...entry,
      asset: {
        ...entry.asset,
        ariaLabel: language === 'hi'
          ? 'घड़ी का विकल्प चित्र ' + (index + 1)
          : 'ਘੜੀ ਦਾ ਵਿਕਲਪ ਚਿੱਤਰ ' + (index + 1),
      },
    })),
  };
}

function makeLocalizedSurface(
  question: ClockQuestion,
  language: Exclude<ClockAuthoringLanguage, 'en'>,
): { stem: string; explanation: ClockQuestionExplanation } {
  const hi = language === 'hi';
  const a = translateDisplay(question.answer.display, language);
  const s = (key: string) => scenarioValue(question, key);
  const task = question.taskId;

  const surface = (
    stemHi: string,
    stemPa: string,
    ruleHi: string,
    rulePa: string,
    stepsHi: string[],
    stepsPa: string[],
  ) => ({
    stem: hi ? stemHi : stemPa,
    explanation: {
      given: hi ? 'दिए गए मानों को ध्यान से पढ़ें।' : 'ਦਿੱਤੇ ਹੋਏ ਮਾਨ ਧਿਆਨ ਨਾਲ ਪੜ੍ਹੋ।',
      rule: hi ? ruleHi : rulePa,
      working: hi ? stepsHi : stepsPa,
      validityCheck: hi
        ? 'उत्तर को स्वतंत्र गणना से भी मिलाया गया है।'
        : 'ਉੱਤਰ ਨੂੰ ਵੱਖਰੀ ਗਣਨਾ ਨਾਲ ਵੀ ਮਿਲਾਇਆ ਗਿਆ ਹੈ।',
      closestTrap: hi
        ? 'दिए गए समय, दिशा और अंतराल की शर्त को न बदलें।'
        : 'ਦਿੱਤੇ ਸਮੇਂ, ਦਿਸ਼ਾ ਅਤੇ ਅੰਤਰਾਲ ਦੀ ਸ਼ਰਤ ਨਾ ਬਦਲੋ।',
      answer: a,
    },
  });

  switch (task) {
    case 'HAND_HOUR_ROTATION':
      return surface(
        s('durationMinutes') + ' मिनट में घंटे की सुई कितने अंश घूमेगी?',
        s('durationMinutes') + ' ਮਿੰਟਾਂ ਵਿੱਚ ਘੰਟੇ ਵਾਲੀ ਸੂਈ ਕਿੰਨੇ ਡਿਗਰੀ ਘੁੰਮੇਗੀ?',
        'घंटे की सुई 1 मिनट में 0.5° घूमती है।',
        'ਘੰਟੇ ਵਾਲੀ ਸੂਈ 1 ਮਿੰਟ ਵਿੱਚ 0.5° ਘੁੰਮਦੀ ਹੈ।',
        ['कुल कोण = 0.5 × ' + s('durationMinutes') + '।', 'अतः उत्तर = ' + a + '।'],
        ['ਕੁੱਲ ਕੋਣ = 0.5 × ' + s('durationMinutes') + '।', 'ਇਸ ਲਈ ਉੱਤਰ = ' + a + '।'],
      );
    case 'MINUTE_SPACES_TO_ANGLE':
      return surface(
        'घड़ी के डायल पर ' + s('minuteSpaces') + ' मिनट-खानों के बीच कितने अंश का कोण होगा?',
        'ਘੜੀ ਦੇ ਡਾਇਲ ਉੱਤੇ ' + s('minuteSpaces') + ' ਮਿੰਟ-ਖਾਨਿਆਂ ਵਿਚਕਾਰ ਕਿੰਨੇ ਡਿਗਰੀ ਦਾ ਕੋਣ ਹੋਵੇਗਾ?',
        'एक मिनट-खाना 6° के बराबर होता है।',
        'ਇੱਕ ਮਿੰਟ-ਖਾਨਾ 6° ਦੇ ਬਰਾਬਰ ਹੁੰਦਾ ਹੈ।',
        [s('minuteSpaces') + ' × 6° = ' + a + '।'],
        [s('minuteSpaces') + ' × 6° = ' + a + '।'],
      );
    case 'SMALLER_ANGLE_AT_TIME':
      return surface(
        s('renderedTime') + ' पर घंटे और मिनट की सुइयों के बीच छोटा कोण कितना है?',
        s('renderedTime') + ' ਉੱਤੇ ਘੰਟੇ ਅਤੇ ਮਿੰਟ ਵਾਲੀਆਂ ਸੂਈਆਂ ਵਿਚਕਾਰ ਛੋਟਾ ਕੋਣ ਕਿੰਨਾ ਹੈ?',
        'मिनट की सुई 6° प्रति मिनट और घंटे की सुई 0.5° प्रति मिनट आगे बढ़ती है।',
        'ਮਿੰਟ ਵਾਲੀ ਸੂਈ 6° ਪ੍ਰਤੀ ਮਿੰਟ ਅਤੇ ਘੰਟੇ ਵਾਲੀ ਸੂਈ 0.5° ਪ੍ਰਤੀ ਮਿੰਟ ਅੱਗੇ ਵਧਦੀ ਹੈ।',
        ['दोनों सुइयों की सही स्थिति निकालकर छोटा अंतर लें।', 'उत्तर = ' + a + '।'],
        ['ਦੋਵੇਂ ਸੂਈਆਂ ਦੀ ਸਹੀ ਸਥਿਤੀ ਕੱਢ ਕੇ ਛੋਟਾ ਅੰਤਰ ਲਓ।', 'ਉੱਤਰ = ' + a + '।'],
      );
    case 'CLASSIFY_HAND_RELATION':
      return surface(
        s('time') + ' पर घंटे और मिनट की सुइयों की स्थिति क्या है?',
        s('time') + ' ਉੱਤੇ ਘੰਟੇ ਅਤੇ ਮਿੰਟ ਵਾਲੀਆਂ ਸੂਈਆਂ ਦੀ ਸਥਿਤੀ ਕੀ ਹੈ?',
        '0° पर सुइयाँ एक-दूसरे पर, 90° पर समकोण और 180° पर विपरीत होती हैं।',
        '0° ਉੱਤੇ ਸੂਈਆਂ ਇੱਕ-ਦੂਜੇ ਉੱਤੇ, 90° ਉੱਤੇ ਸਮਕੋਣ ਅਤੇ 180° ਉੱਤੇ ਵਿਰੁੱਧ ਹੁੰਦੀਆਂ ਹਨ।',
        ['सटीक छोटा कोण निकालकर स्थिति पहचानें।', 'उत्तर = ' + a + '।'],
        ['ਸਹੀ ਛੋਟਾ ਕੋਣ ਕੱਢ ਕੇ ਸਥਿਤੀ ਪਛਾਣੋ।', 'ਉੱਤਰ = ' + a + '।'],
      );
    case 'ONE_TIME_FOR_ANGLE_IN_HOUR':
      return surface(
        s('hour') + ':00 और ' + (Number(s('hour')) + 1) + ':00 के बीच वह पहला समय कौन-सा है जब घंटे और मिनट की सुइयों के बीच छोटा कोण ' + s('targetAngleDeg') + '° हो?',
        s('hour') + ':00 ਅਤੇ ' + (Number(s('hour')) + 1) + ':00 ਦੇ ਵਿਚਕਾਰ ਉਹ ਪਹਿਲਾ ਸਮਾਂ ਕਿਹੜਾ ਹੈ ਜਦੋਂ ਘੰਟੇ ਅਤੇ ਮਿੰਟ ਵਾਲੀਆਂ ਸੂਈਆਂ ਵਿਚਕਾਰ ਛੋਟਾ ਕੋਣ ' + s('targetAngleDeg') + '° ਹੋਵੇ?',
        'सापेक्ष चाल 5.5° प्रति मिनट लेकर कोण का समीकरण हल करें।',
        'ਸਾਪੇਖ ਚਾਲ 5.5° ਪ੍ਰਤੀ ਮਿੰਟ ਲੈ ਕੇ ਕੋਣ ਦਾ ਸਮੀਕਰਨ ਹੱਲ ਕਰੋ।',
        ['दोनों संभव कोण-शाखाओं की जाँच करें।', 'सही समय = ' + a + '।'],
        ['ਦੋਵੇਂ ਸੰਭਵ ਕੋਣ-ਸ਼ਾਖਾਵਾਂ ਦੀ ਜਾਂਚ ਕਰੋ।', 'ਸਹੀ ਸਮਾਂ = ' + a + '।'],
      );
    case 'COINCIDENCE_IN_HOUR':
      return surface(
        s('hour') + ':00 और ' + (Number(s('hour')) + 1) + ':00 के बीच घंटे और मिनट की सुइयाँ किस समय एक-दूसरे पर आएँगी?',
        s('hour') + ':00 ਅਤੇ ' + (Number(s('hour')) + 1) + ':00 ਦੇ ਵਿਚਕਾਰ ਘੰਟੇ ਅਤੇ ਮਿੰਟ ਵਾਲੀਆਂ ਸੂਈਆਂ ਕਿਸ ਸਮੇਂ ਇੱਕ-ਦੂਜੇ ਉੱਤੇ ਆਉਣਗੀਆਂ?',
        'सुइयों की सापेक्ष चाल 5.5° प्रति मिनट है।',
        'ਸੂਈਆਂ ਦੀ ਸਾਪੇਖ ਚਾਲ 5.5° ਪ੍ਰਤੀ ਮਿੰਟ ਹੈ।',
        ['दिए गए घंटे की सीमा में मिलने का समय निकालें।', 'उत्तर = ' + a + '।'],
        ['ਦਿੱਤੇ ਘੰਟੇ ਦੀ ਹੱਦ ਵਿੱਚ ਮਿਲਣ ਦਾ ਸਮਾਂ ਕੱਢੋ।', 'ਉੱਤਰ = ' + a + '।'],
      );
    case 'GAP_BETWEEN_SPECIAL_EVENTS': {
      const targetHi = s('targetEvent') === 'RIGHT_ANGLE'
        ? 'समकोण बनाने'
        : s('targetEvent') === 'OPPOSITION'
          ? 'विपरीत होने'
          : 'फिर से एक-दूसरे पर आने';
      const targetPa = s('targetEvent') === 'RIGHT_ANGLE'
        ? 'ਸਮਕੋਣ ਬਣਾਉਣ'
        : s('targetEvent') === 'OPPOSITION'
          ? 'ਵਿਰੁੱਧ ਹੋਣ'
          : 'ਫਿਰ ਇੱਕ-ਦੂਜੇ ਉੱਤੇ ਆਉਣ';
      return surface(
        '12:00 पर सुइयाँ एक-दूसरे पर हैं। अगली बार उनके ' + targetHi + ' तक कितना समय लगेगा?',
        '12:00 ਉੱਤੇ ਸੂਈਆਂ ਇੱਕ-ਦੂਜੇ ਉੱਤੇ ਹਨ। ਅਗਲੀ ਵਾਰ ਉਹਨਾਂ ਦੇ ' + targetPa + ' ਤੱਕ ਕਿੰਨਾ ਸਮਾਂ ਲੱਗੇਗਾ?',
        'दिए गए अगले संबंध तक पहुँचने के लिए सुइयों की सापेक्ष चाल 5.5° प्रति मिनट लें।',
        'ਦਿੱਤੇ ਅਗਲੇ ਸੰਬੰਧ ਤੱਕ ਪਹੁੰਚਣ ਲਈ ਸੂਈਆਂ ਦੀ ਸਾਪੇਖ ਚਾਲ 5.5° ਪ੍ਰਤੀ ਮਿੰਟ ਲਓ।',
        ['आवश्यक सापेक्ष कोण = ' + s('targetAngleDeg') + '°।', 'समय = ' + a + '।'],
        ['ਲੋੜੀਂਦਾ ਸਾਪੇਖ ਕੋਣ = ' + s('targetAngleDeg') + '°।', 'ਸਮਾਂ = ' + a + '।'],
      );
    }
    case 'COUNT_COINCIDENCES':
      return surface(
        s('durationHours') + ' घंटों में सुइयाँ कितनी बार एक-दूसरे पर आएँगी? शुरुआती 12:00 को गिनें, अंतिम क्षण को नहीं।',
        s('durationHours') + ' ਘੰਟਿਆਂ ਵਿੱਚ ਸੂਈਆਂ ਕਿੰਨੀ ਵਾਰ ਇੱਕ-ਦੂਜੇ ਉੱਤੇ ਆਉਣਗੀਆਂ? ਸ਼ੁਰੂ ਵਾਲਾ 12:00 ਗਿਣੋ, ਅੰਤਲਾ ਪਲ ਨਹੀਂ।',
        'दिए गए अंतराल में सभी सटीक मिलने की घटनाएँ गिनें।',
        'ਦਿੱਤੇ ਅੰਤਰਾਲ ਵਿੱਚ ਸਾਰੀਆਂ ਸਹੀ ਮਿਲਣ ਵਾਲੀਆਂ ਘਟਨਾਵਾਂ ਗਿਣੋ।',
        ['अंतराल की दोनों सीमाओं की शर्त लागू करें।', 'कुल = ' + a + '।'],
        ['ਅੰਤਰਾਲ ਦੀਆਂ ਦੋਵੇਂ ਹੱਦਾਂ ਦੀ ਸ਼ਰਤ ਲਾਗੂ ਕਰੋ।', 'ਕੁੱਲ = ' + a + '।'],
      );
    case 'NTH_OCCURRENCE':
      return surface(
        s('anchor') + ' के बाद ' + localizedEventLabel(s('eventType'), language) + ' की ' + s('occurrence') + 'वीं बार का समय क्या होगा?',
        s('anchor') + ' ਤੋਂ ਬਾਅਦ ' + localizedEventLabel(s('eventType'), language) + ' ਦੀ ' + s('occurrence') + 'ਵੀਂ ਵਾਰ ਦਾ ਸਮਾਂ ਕੀ ਹੋਵੇਗਾ?',
        'शुरुआती समय के बाद की घटनाओं को क्रम से गिनें।',
        'ਸ਼ੁਰੂਆਤੀ ਸਮੇਂ ਤੋਂ ਬਾਅਦ ਦੀਆਂ ਘਟਨਾਵਾਂ ਨੂੰ ਕ੍ਰਮ ਨਾਲ ਗਿਣੋ।',
        ['शुरुआती क्षण को पहली बाद वाली घटना न मानें।', 'उत्तर = ' + a + '।'],
        ['ਸ਼ੁਰੂਆਤੀ ਪਲ ਨੂੰ ਪਹਿਲੀ ਬਾਅਦ ਵਾਲੀ ਘਟਨਾ ਨਾ ਮੰਨੋ।', 'ਉੱਤਰ = ' + a + '।'],
      );
    case 'DISPLAYED_FROM_ACTUAL_ELAPSED':
      return surface(
        'एक घड़ी सुबह 8:00 बजे सही है और हर 24 वास्तविक घंटों में ' + s('dailyErrorMinutes') + ' मिनट आगे हो जाती है। ' + s('actualElapsedHours') + ' वास्तविक घंटों बाद वह क्या समय दिखाएगी?',
        'ਇੱਕ ਘੜੀ ਸਵੇਰੇ 8:00 ਵਜੇ ਸਹੀ ਹੈ ਅਤੇ ਹਰ 24 ਅਸਲ ਘੰਟਿਆਂ ਵਿੱਚ ' + s('dailyErrorMinutes') + ' ਮਿੰਟ ਅੱਗੇ ਹੋ ਜਾਂਦੀ ਹੈ। ' + s('actualElapsedHours') + ' ਅਸਲ ਘੰਟਿਆਂ ਬਾਅਦ ਉਹ ਕੀ ਸਮਾਂ ਦਿਖਾਏਗੀ?',
        'जितना वास्तविक समय बीता है, उसी अनुपात में बढ़त जोड़ें।',
        'ਜਿੰਨਾ ਅਸਲ ਸਮਾਂ ਬੀਤਿਆ ਹੈ, ਉਸੇ ਅਨੁਪਾਤ ਵਿੱਚ ਵਾਧਾ ਜੋੜੋ।',
        ['आंशिक दिन की बढ़त पहले निकालें।', 'दिखाया गया समय = ' + a + '।'],
        ['ਅਧੂਰੇ ਦਿਨ ਦਾ ਵਾਧਾ ਪਹਿਲਾਂ ਕੱਢੋ।', 'ਦਿਖਾਇਆ ਸਮਾਂ = ' + a + '।'],
      );
    case 'ERROR_AFTER_ACTUAL_DURATION':
      return surface(
        'एक घड़ी हर 24 घंटों में ' + s('errorMinutesPerDay') + ' मिनट ' + (s('direction') === 'GAIN' ? 'आगे' : 'पीछे') + ' होती है। ' + s('actualHours') + ' घंटों बाद उसकी त्रुटि कितनी होगी?',
        'ਇੱਕ ਘੜੀ ਹਰ 24 ਘੰਟਿਆਂ ਵਿੱਚ ' + s('errorMinutesPerDay') + ' ਮਿੰਟ ' + (s('direction') === 'GAIN' ? 'ਅੱਗੇ' : 'ਪਿੱਛੇ') + ' ਹੁੰਦੀ ਹੈ। ' + s('actualHours') + ' ਘੰਟਿਆਂ ਬਾਅਦ ਉਸ ਦੀ ਗਲਤੀ ਕਿੰਨੀ ਹੋਵੇਗੀ?',
        'घड़ी की त्रुटि समय के अनुपात में बढ़ती है।',
        'ਘੜੀ ਦੀ ਗਲਤੀ ਸਮੇਂ ਦੇ ਅਨੁਪਾਤ ਵਿੱਚ ਵਧਦੀ ਹੈ।',
        ['त्रुटि = दैनिक त्रुटि × बीते घंटे / 24।', 'उत्तर = ' + a + '।'],
        ['ਗਲਤੀ = ਰੋਜ਼ਾਨਾ ਗਲਤੀ × ਬੀਤੇ ਘੰਟੇ / 24।', 'ਉੱਤਰ = ' + a + '।'],
      );
    case 'INITIAL_OFFSET_CORRECT_RATE':
      return surface(
        'सुबह 8:00 बजे एक घड़ी ' + s('offsetMinutes') + ' मिनट ' + (s('offsetDirection') === 'BEHIND' ? 'पीछे' : 'आगे') + ' है। इसके बाद वह सही चाल से चलती है। ' + s('elapsedHours') + ' वास्तविक घंटों बाद क्या समय दिखाएगी?',
        'ਸਵੇਰੇ 8:00 ਵਜੇ ਇੱਕ ਘੜੀ ' + s('offsetMinutes') + ' ਮਿੰਟ ' + (s('offsetDirection') === 'BEHIND' ? 'ਪਿੱਛੇ' : 'ਅੱਗੇ') + ' ਹੈ। ਇਸ ਤੋਂ ਬਾਅਦ ਉਹ ਸਹੀ ਚਾਲ ਨਾਲ ਚਲਦੀ ਹੈ। ' + s('elapsedHours') + ' ਅਸਲ ਘੰਟਿਆਂ ਬਾਅਦ ਕੀ ਸਮਾਂ ਦਿਖਾਏਗੀ?',
        'सही चाल से चलने पर शुरुआती त्रुटि स्थिर रहती है।',
        'ਸਹੀ ਚਾਲ ਨਾਲ ਚੱਲਣ ਤੇ ਸ਼ੁਰੂਆਤੀ ਗਲਤੀ ਸਥਿਰ ਰਹਿੰਦੀ ਹੈ।',
        ['पहले सही समय निकालें, फिर वही स्थिर अंतर रखें।', 'उत्तर = ' + a + '।'],
        ['ਪਹਿਲਾਂ ਸਹੀ ਸਮਾਂ ਕੱਢੋ, ਫਿਰ ਉਹੀ ਸਥਿਰ ਅੰਤਰ ਰੱਖੋ।', 'ਉੱਤਰ = ' + a + '।'],
      );
    case 'DERIVE_RATE_FROM_OBSERVATIONS':
      return surface(
        'सुबह 8:00 बजे घड़ी ' + s('initialSlowMinutes') + ' मिनट पीछे है। 24 वास्तविक घंटों बाद वह ' + s('finalSlowMinutes') + ' मिनट पीछे है। घड़ी द्वारा दिखाए समय और वास्तविक समय का अनुपात क्या है?',
        'ਸਵੇਰੇ 8:00 ਵਜੇ ਘੜੀ ' + s('initialSlowMinutes') + ' ਮਿੰਟ ਪਿੱਛੇ ਹੈ। 24 ਅਸਲ ਘੰਟਿਆਂ ਬਾਅਦ ਉਹ ' + s('finalSlowMinutes') + ' ਮਿੰਟ ਪਿੱਛੇ ਹੈ। ਘੜੀ ਵੱਲੋਂ ਦਿਖਾਏ ਸਮੇਂ ਅਤੇ ਅਸਲ ਸਮੇਂ ਦਾ ਅਨੁਪਾਤ ਕੀ ਹੈ?',
        'चाल निकालने के लिए शुरुआती त्रुटि नहीं, त्रुटि में हुआ बदलाव लें।',
        'ਚਾਲ ਕੱਢਣ ਲਈ ਸ਼ੁਰੂਆਤੀ ਗਲਤੀ ਨਹੀਂ, ਗਲਤੀ ਵਿੱਚ ਆਇਆ ਬਦਲਾਅ ਲਓ।',
        ['24 घंटों में अतिरिक्त कमी निकालें।', 'दिखाया समय : वास्तविक समय = ' + a + '।'],
        ['24 ਘੰਟਿਆਂ ਵਿੱਚ ਵਾਧੂ ਘਾਟਾ ਕੱਢੋ।', 'ਦਿਖਾਇਆ ਸਮਾਂ : ਅਸਲ ਸਮਾਂ = ' + a + '।'],
      );
    case 'MULTIDAY_ACTUAL_FROM_DISPLAY':
      return surface(
        'एक घड़ी दिन 0 पर सुबह 6:00 बजे सही थी और हर वास्तविक दिन ' + s('errorMinutesPerDay') + ' मिनट ' + (s('direction') === 'GAIN' ? 'आगे' : 'पीछे') + ' होती है। जब वह ' + translateDisplay(s('displayedTarget'), language) + ' दिखाती है, तब वास्तविक समय क्या है?',
        'ਇੱਕ ਘੜੀ ਦਿਨ 0 ਉੱਤੇ ਸਵੇਰੇ 6:00 ਵਜੇ ਸਹੀ ਸੀ ਅਤੇ ਹਰ ਅਸਲ ਦਿਨ ' + s('errorMinutesPerDay') + ' ਮਿੰਟ ' + (s('direction') === 'GAIN' ? 'ਅੱਗੇ' : 'ਪਿੱਛੇ') + ' ਹੁੰਦੀ ਹੈ। ਜਦੋਂ ਉਹ ' + translateDisplay(s('displayedTarget'), language) + ' ਦਿਖਾਉਂਦੀ ਹੈ, ਤਾਂ ਅਸਲ ਸਮਾਂ ਕੀ ਹੈ?',
        'दिन का अंतर बनाए रखते हुए घड़ी की चाल के अनुपात का उल्टा प्रयोग करें।',
        'ਦਿਨਾਂ ਦਾ ਅੰਤਰ ਕਾਇਮ ਰੱਖਦੇ ਹੋਏ ਘੜੀ ਦੀ ਚਾਲ ਦੇ ਅਨੁਪਾਤ ਦਾ ਉਲਟਾ ਵਰਤੋ।',
        ['दिखाए समय को शुरुआती समय से अंतर में बदलें।', 'वास्तविक समय = ' + a + '।'],
        ['ਦਿਖਾਏ ਸਮੇਂ ਨੂੰ ਸ਼ੁਰੂਆਤੀ ਸਮੇਂ ਤੋਂ ਅੰਤਰ ਵਿੱਚ ਬਦਲੋ।', 'ਅਸਲ ਸਮਾਂ = ' + a + '।'],
      );
    case 'NEXT_CORRECT_READING':
      return surface(
        '12 घंटे वाली घड़ी को दिन 0 पर 12:00 बजे सही किया गया है। वह रोज़ ' + s('dailyErrorMinutes') + ' मिनट ' + (s('direction') === 'GAIN' ? 'आगे' : 'पीछे') + ' होती है। उसका डायल अगली बार सही समय कब दिखाएगा?',
        '12 ਘੰਟਿਆਂ ਵਾਲੀ ਘੜੀ ਨੂੰ ਦਿਨ 0 ਉੱਤੇ 12:00 ਵਜੇ ਸਹੀ ਕੀਤਾ ਗਿਆ ਹੈ। ਉਹ ਹਰ ਰੋਜ਼ ' + s('dailyErrorMinutes') + ' ਮਿੰਟ ' + (s('direction') === 'GAIN' ? 'ਅੱਗੇ' : 'ਪਿੱਛੇ') + ' ਹੁੰਦੀ ਹੈ। ਉਸ ਦਾ ਡਾਇਲ ਅਗਲੀ ਵਾਰ ਸਹੀ ਸਮਾਂ ਕਦੋਂ ਦਿਖਾਏਗਾ?',
        '12 घंटे के डायल पर अगली सही स्थिति तब आती है जब कुल त्रुटि पूरे 12 घंटे हो जाए।',
        '12 ਘੰਟਿਆਂ ਦੇ ਡਾਇਲ ਉੱਤੇ ਅਗਲੀ ਸਹੀ ਸਥਿਤੀ ਉਦੋਂ ਆਉਂਦੀ ਹੈ ਜਦੋਂ ਕੁੱਲ ਗਲਤੀ ਪੂਰੇ 12 ਘੰਟੇ ਹੋ ਜਾਵੇ।',
        ['दैनिक त्रुटि से 12 घंटे की कुल त्रुटि तक का समय निकालें।', 'उत्तर = ' + a + '।'],
        ['ਰੋਜ਼ਾਨਾ ਗਲਤੀ ਤੋਂ 12 ਘੰਟਿਆਂ ਦੀ ਕੁੱਲ ਗਲਤੀ ਤੱਕ ਦਾ ਸਮਾਂ ਕੱਢੋ।', 'ਉੱਤਰ = ' + a + '।'],
      );
    case 'COMPARE_TWO_FAULTY_CLOCKS':
      return surface(
        'दोपहर 12 बजे घड़ी A ' + s('leftInitialAhead') + ' मिनट आगे है और रोज़ ' + s('leftDailyGain') + ' मिनट आगे होती है। उसी समय घड़ी B ' + s('rightInitialBehind') + ' मिनट पीछे है और रोज़ ' + s('rightDailyLoss') + ' मिनट पीछे होती है। ' + s('elapsedHours') + ' वास्तविक घंटों बाद दोनों की रीडिंग में कितना अंतर होगा?',
        'ਦੁਪਹਿਰ 12 ਵਜੇ ਘੜੀ A ' + s('leftInitialAhead') + ' ਮਿੰਟ ਅੱਗੇ ਹੈ ਅਤੇ ਹਰ ਰੋਜ਼ ' + s('leftDailyGain') + ' ਮਿੰਟ ਹੋਰ ਅੱਗੇ ਹੁੰਦੀ ਹੈ। ਉਸੇ ਸਮੇਂ ਘੜੀ B ' + s('rightInitialBehind') + ' ਮਿੰਟ ਪਿੱਛੇ ਹੈ ਅਤੇ ਹਰ ਰੋਜ਼ ' + s('rightDailyLoss') + ' ਮਿੰਟ ਹੋਰ ਪਿੱਛੇ ਹੁੰਦੀ ਹੈ। ' + s('elapsedHours') + ' ਅਸਲ ਘੰਟਿਆਂ ਬਾਅਦ ਦੋਵਾਂ ਦੀ ਰੀਡਿੰਗ ਵਿੱਚ ਕਿੰਨਾ ਅੰਤਰ ਹੋਵੇਗਾ?',
        'दोनों घड़ियों की शुरुआती त्रुटि और चाल अलग-अलग लागू करें।',
        'ਦੋਵੇਂ ਘੜੀਆਂ ਦੀ ਸ਼ੁਰੂਆਤੀ ਗਲਤੀ ਅਤੇ ਚਾਲ ਵੱਖ-ਵੱਖ ਲਾਗੂ ਕਰੋ।',
        ['एक ही वास्तविक समय पर दोनों रीडिंग निकालें।', 'अंतर = ' + a + '।'],
        ['ਇੱਕੋ ਅਸਲ ਸਮੇਂ ਉੱਤੇ ਦੋਵੇਂ ਰੀਡਿੰਗਾਂ ਕੱਢੋ।', 'ਅੰਤਰ = ' + a + '।'],
      );
    case 'GAIN_FROM_COINCIDENCE_INTERVAL':
      return surface(
        'एक तेज़ घड़ी में घंटे और मिनट की सुइयाँ हर ' + translateDisplay(s('observedActualInterval'), language) + ' वास्तविक समय बाद मिलती हैं। 24 वास्तविक घंटों में घड़ी कितनी आगे होगी?',
        'ਇੱਕ ਤੇਜ਼ ਘੜੀ ਵਿੱਚ ਘੰਟੇ ਅਤੇ ਮਿੰਟ ਵਾਲੀਆਂ ਸੂਈਆਂ ਹਰ ' + translateDisplay(s('observedActualInterval'), language) + ' ਅਸਲ ਸਮੇਂ ਬਾਅਦ ਮਿਲਦੀਆਂ ਹਨ। 24 ਅਸਲ ਘੰਟਿਆਂ ਵਿੱਚ ਘੜੀ ਕਿੰਨੀ ਅੱਗੇ ਹੋਵੇਗੀ?',
        'सही घड़ी के मिलने के अंतराल की तुलना दिए गए वास्तविक अंतराल से करें।',
        'ਸਹੀ ਘੜੀ ਦੇ ਮਿਲਣ ਵਾਲੇ ਅੰਤਰਾਲ ਦੀ ਤੁਲਨਾ ਦਿੱਤੇ ਅਸਲ ਅੰਤਰਾਲ ਨਾਲ ਕਰੋ।',
        ['चाल का अनुपात निकालकर 24 घंटों तक बढ़त निकालें।', 'उत्तर = ' + a + '।'],
        ['ਚਾਲ ਦਾ ਅਨੁਪਾਤ ਕੱਢ ਕੇ 24 ਘੰਟਿਆਂ ਤੱਕ ਵਾਧਾ ਕੱਢੋ।', 'ਉੱਤਰ = ' + a + '।'],
      );
    case 'LOSS_FROM_COINCIDENCE_INTERVAL':
      return surface(
        'एक धीमी घड़ी में घंटे और मिनट की सुइयाँ हर ' + translateDisplay(s('observedActualInterval'), language) + ' वास्तविक समय बाद मिलती हैं। 24 वास्तविक घंटों में घड़ी कितनी पीछे होगी?',
        'ਇੱਕ ਹੌਲੀ ਘੜੀ ਵਿੱਚ ਘੰਟੇ ਅਤੇ ਮਿੰਟ ਵਾਲੀਆਂ ਸੂਈਆਂ ਹਰ ' + translateDisplay(s('observedActualInterval'), language) + ' ਅਸਲ ਸਮੇਂ ਬਾਅਦ ਮਿਲਦੀਆਂ ਹਨ। 24 ਅਸਲ ਘੰਟਿਆਂ ਵਿੱਚ ਘੜੀ ਕਿੰਨੀ ਪਿੱਛੇ ਹੋਵੇਗੀ?',
        'सही घड़ी के मिलने के अंतराल की तुलना दिए गए वास्तविक अंतराल से करें।',
        'ਸਹੀ ਘੜੀ ਦੇ ਮਿਲਣ ਵਾਲੇ ਅੰਤਰਾਲ ਦੀ ਤੁਲਨਾ ਦਿੱਤੇ ਅਸਲ ਅੰਤਰਾਲ ਨਾਲ ਕਰੋ।',
        ['चाल का अनुपात निकालकर 24 घंटों तक कमी निकालें।', 'उत्तर = ' + a + '।'],
        ['ਚਾਲ ਦਾ ਅਨੁਪਾਤ ਕੱਢ ਕੇ 24 ਘੰਟਿਆਂ ਤੱਕ ਘਾਟਾ ਕੱਢੋ।', 'ਉੱਤਰ = ' + a + '।'],
      );
    case 'DURATION_FOR_N_STRIKES':
      return surface(
        'एक घड़ी ' + s('strikes') + ' बार समान अंतराल पर बजती है और लगातार दो घंटियों के बीच ' + translateDisplay(s('gap'), language) + ' का अंतर है। पहली से आखिरी घंटी तक कितना समय लगेगा?',
        'ਇੱਕ ਘੜੀ ' + s('strikes') + ' ਵਾਰ ਬਰਾਬਰ ਅੰਤਰ ਨਾਲ ਵੱਜਦੀ ਹੈ ਅਤੇ ਲਗਾਤਾਰ ਦੋ ਘੰਟੀਆਂ ਵਿਚਕਾਰ ' + translateDisplay(s('gap'), language) + ' ਦਾ ਅੰਤਰ ਹੈ। ਪਹਿਲੀ ਤੋਂ ਆਖਰੀ ਘੰਟੀ ਤੱਕ ਕਿੰਨਾ ਸਮਾਂ ਲੱਗੇਗਾ?',
        'n बार बजने पर पहली से आखिरी तक n−1 अंतराल होते हैं।',
        'n ਵਾਰ ਵੱਜਣ ਉੱਤੇ ਪਹਿਲੀ ਤੋਂ ਆਖਰੀ ਤੱਕ n−1 ਅੰਤਰਾਲ ਹੁੰਦੇ ਹਨ।',
        ['अंतरालों की संख्या = ' + s('strikes') + ' − 1।', 'कुल समय = ' + a + '।'],
        ['ਅੰਤਰਾਲਾਂ ਦੀ ਗਿਣਤੀ = ' + s('strikes') + ' − 1।', 'ਕੁੱਲ ਸਮਾਂ = ' + a + '।'],
      );
    case 'TOTAL_STRIKES_12_HOURS':
      return surface(
        'एक सामान्य घंटी वाली घड़ी हर पूरे घंटे पर उस घंटे की संख्या के बराबर बार बजती है। एक पूरे 12 घंटे के चक्र में कुल कितनी बार बजेगी?',
        'ਇੱਕ ਆਮ ਘੰਟੀ ਵਾਲੀ ਘੜੀ ਹਰ ਪੂਰੇ ਘੰਟੇ ਉੱਤੇ ਉਸ ਘੰਟੇ ਦੀ ਗਿਣਤੀ ਦੇ ਬਰਾਬਰ ਵਾਰ ਵੱਜਦੀ ਹੈ। ਪੂਰੇ 12 ਘੰਟਿਆਂ ਦੇ ਇੱਕ ਚੱਕਰ ਵਿੱਚ ਕੁੱਲ ਕਿੰਨੀ ਵਾਰ ਵੱਜੇਗੀ?',
        '1 से 12 तक सभी घंटों की घंटियाँ जोड़ें।',
        '1 ਤੋਂ 12 ਤੱਕ ਹਰ ਘੰਟੇ ਦੀਆਂ ਘੰਟੀਆਂ ਜੋੜੋ।',
        ['कुल = 1+2+...+12 = 12 × 13 / 2 = ' + a + '।'],
        ['ਕੁੱਲ = 1+2+...+12 = 12 × 13 / 2 = ' + a + '।'],
      );
    case 'TOTAL_STRIKES_24_HOURS':
      return surface(
        'एक सामान्य घंटी वाली घड़ी हर पूरे घंटे पर उस घंटे की संख्या के बराबर बार बजती है। 24 घंटों में कुल कितनी बार बजेगी?',
        'ਇੱਕ ਆਮ ਘੰਟੀ ਵਾਲੀ ਘੜੀ ਹਰ ਪੂਰੇ ਘੰਟੇ ਉੱਤੇ ਉਸ ਘੰਟੇ ਦੀ ਗਿਣਤੀ ਦੇ ਬਰਾਬਰ ਵਾਰ ਵੱਜਦੀ ਹੈ। 24 ਘੰਟਿਆਂ ਵਿੱਚ ਕੁੱਲ ਕਿੰਨੀ ਵਾਰ ਵੱਜੇਗੀ?',
        '12 घंटे का क्रम दो बार दोहरता है।',
        '12 ਘੰਟਿਆਂ ਦਾ ਕ੍ਰਮ ਦੋ ਵਾਰ ਦੁਹਰਾਇਆ ਜਾਂਦਾ ਹੈ।',
        ['एक 12 घंटे का कुल = 1+2+...+12 = 78।', '24 घंटे = 2 × 78 = ' + a + '।'],
        ['ਇੱਕ 12 ਘੰਟਿਆਂ ਦਾ ਕੁੱਲ = 1+2+...+12 = 78।', '24 ਘੰਟੇ = 2 × 78 = ' + a + '।'],
      );
    case 'TOTAL_STRIKES_INCLUSIVE_RANGE':
      return surface(
        'एक सामान्य घंटी वाली घड़ी ' + s('startHour') + ' बजे से ' + s('endHour') + ' बजे तक, दोनों घंटों को शामिल करते हुए, कुल कितनी बार बजेगी?',
        'ਇੱਕ ਆਮ ਘੰਟੀ ਵਾਲੀ ਘੜੀ ' + s('startHour') + ' ਵਜੇ ਤੋਂ ' + s('endHour') + ' ਵਜੇ ਤੱਕ, ਦੋਵੇਂ ਘੰਟਿਆਂ ਨੂੰ ਸ਼ਾਮਲ ਕਰਦੇ ਹੋਏ, ਕੁੱਲ ਕਿੰਨੀ ਵਾਰ ਵੱਜੇਗੀ?',
        'दिए गए प्रत्येक घंटे की घंटियाँ जोड़ें और दोनों अंतिम घंटों को शामिल करें।',
        'ਦਿੱਤੇ ਹਰ ਘੰਟੇ ਦੀਆਂ ਘੰਟੀਆਂ ਜੋੜੋ ਅਤੇ ਦੋਵੇਂ ਅੰਤਲੇ ਘੰਟੇ ਸ਼ਾਮਲ ਕਰੋ।',
        ['हर घंटे का मान जोड़ने पर कुल = ' + a + '।'],
        ['ਹਰ ਘੰਟੇ ਦੀ ਗਿਣਤੀ ਜੋੜਨ ਤੇ ਕੁੱਲ = ' + a + '।'],
      );
    case 'MIRROR_FROM_ACTUAL':
      return surface(
        'घड़ी में ' + s('actualTime') + ' बजे हैं। सामने खड़े ऊर्ध्वाधर दर्पण में क्या समय दिखाई देगा?',
        'ਘੜੀ ਵਿੱਚ ' + s('actualTime') + ' ਵਜੇ ਹਨ। ਸਾਹਮਣੇ ਖੜ੍ਹੇ ਲੰਬਕਾਰੀ ਸ਼ੀਸ਼ੇ ਵਿੱਚ ਕਿਹੜਾ ਸਮਾਂ ਦਿਖਾਈ ਦੇਵੇਗਾ?',
        'ऊर्ध्वाधर दर्पण के लिए दर्पण समय = 12:00 − वास्तविक समय।',
        'ਲੰਬਕਾਰੀ ਸ਼ੀਸ਼ੇ ਲਈ ਸ਼ੀਸ਼ੇ ਦਾ ਸਮਾਂ = 12:00 − ਅਸਲ ਸਮਾਂ।',
        ['12:00 में से दिया समय घटाएँ।', 'दर्पण समय = ' + a + '।'],
        ['12:00 ਵਿੱਚੋਂ ਦਿੱਤਾ ਸਮਾਂ ਘਟਾਓ।', 'ਸ਼ੀਸ਼ੇ ਦਾ ਸਮਾਂ = ' + a + '।'],
      );
    case 'READ_TIME_FROM_DIAGRAM':
      return surface(
        'दिए गए घड़ी-चित्र में कौन-सा समय दिखाया गया है?',
        'ਦਿੱਤੇ ਘੜੀ-ਚਿੱਤਰ ਵਿੱਚ ਕਿਹੜਾ ਸਮਾਂ ਦਿਖਾਇਆ ਗਿਆ ਹੈ?',
        'लंबी सुई से मिनट और छोटी सुई की लगातार स्थिति से घंटा पढ़ें।',
        'ਲੰਮੀ ਸੂਈ ਤੋਂ ਮਿੰਟ ਅਤੇ ਛੋਟੀ ਸੂਈ ਦੀ ਲਗਾਤਾਰ ਸਥਿਤੀ ਤੋਂ ਘੰਟਾ ਪੜ੍ਹੋ।',
        ['दोनों सुइयों की स्थिति मिलाएँ।', 'समय = ' + a + '।'],
        ['ਦੋਵੇਂ ਸੂਈਆਂ ਦੀ ਸਥਿਤੀ ਮਿਲਾਓ।', 'ਸਮਾਂ = ' + a + '।'],
      );
    case 'READ_ANGLE_TYPE_FROM_DIAGRAM':
      return surface(
        'दिए गए घड़ी-चित्र में घंटे और मिनट की सुइयाँ कौन-सा संबंध बनाती हैं?',
        'ਦਿੱਤੇ ਘੜੀ-ਚਿੱਤਰ ਵਿੱਚ ਘੰਟੇ ਅਤੇ ਮਿੰਟ ਵਾਲੀਆਂ ਸੂਈਆਂ ਕਿਹੜਾ ਸੰਬੰਧ ਬਣਾਉਂਦੀਆਂ ਹਨ?',
        'सुइयों के बीच सटीक छोटा कोण देखकर संबंध पहचानें।',
        'ਸੂਈਆਂ ਵਿਚਕਾਰ ਸਹੀ ਛੋਟਾ ਕੋਣ ਵੇਖ ਕੇ ਸੰਬੰਧ ਪਛਾਣੋ।',
        ['0°, 90° और 180° विशेष स्थितियाँ हैं।', 'उत्तर = ' + a + '।'],
        ['0°, 90° ਅਤੇ 180° ਖਾਸ ਸਥਿਤੀਆਂ ਹਨ।', 'ਉੱਤਰ = ' + a + '।'],
      );
    case 'TIME_AFTER_HANDS_INTERCHANGED':
      return surface(
        'एक व्यक्ति शाम 5 बजे से 6 बजे के बीच घर से निकलता है और एक घंटे से कम समय में लौटता है। लौटने पर घंटे और मिनट की सुइयों की स्थितियाँ आपस में ठीक बदल चुकी हैं। वह कितनी देर बाहर रहा?',
        'ਇੱਕ ਵਿਅਕਤੀ ਸ਼ਾਮ 5 ਵਜੇ ਤੋਂ 6 ਵਜੇ ਦੇ ਵਿਚਕਾਰ ਘਰੋਂ ਨਿਕਲਦਾ ਹੈ ਅਤੇ ਇੱਕ ਘੰਟੇ ਤੋਂ ਘੱਟ ਸਮੇਂ ਵਿੱਚ ਵਾਪਸ ਆਉਂਦਾ ਹੈ। ਵਾਪਸੀ ਉੱਤੇ ਘੰਟੇ ਅਤੇ ਮਿੰਟ ਵਾਲੀਆਂ ਸੂਈਆਂ ਦੀਆਂ ਸਥਿਤੀਆਂ ਆਪਸ ਵਿੱਚ ਠੀਕ ਬਦਲ ਚੁੱਕੀਆਂ ਹਨ। ਉਹ ਕਿੰਨਾ ਸਮਾਂ ਬਾਹਰ ਰਿਹਾ?',
        'पहली अदला-बदली में दोनों सुइयों की कुल चाल 360° होती है।',
        'ਪਹਿਲੀ ਅਦਲਾ-ਬਦਲੀ ਵਿੱਚ ਦੋਵੇਂ ਸੂਈਆਂ ਦੀ ਕੁੱਲ ਚਾਲ 360° ਹੁੰਦੀ ਹੈ।',
        ['(6 + 0.5)t = 360।', 't = 720/13 मिनट = ' + a + '।'],
        ['(6 + 0.5)t = 360।', 't = 720/13 ਮਿੰਟ = ' + a + '।'],
      );
    default:
      throw new Error('No frozen CLK-001 localization surface for ' + task + '.');
  }
}

export function localizeClockAnchorQuestion(
  question: ClockQuestion,
  language: ClockAuthoringLanguage,
): ClockQuestion {
  if (language === 'en') return question;
  const locale = language === 'hi' ? 'hi-IN' : 'pa-IN';
  const surface = makeLocalizedSurface(question, language);
  const options = translatedOptions(question.options, language);
  const answerDisplay = translateDisplay(question.answer.display, language);
  return {
    ...question,
    locale,
    stem: surface.stem,
    media: localizeMedia(question.media, language),
    answer: { ...question.answer, display: answerDisplay },
    options,
    explanation: { ...surface.explanation, answer: answerDisplay },
  };
}
