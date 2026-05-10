export function normalizeTemplate(value: string) {
  return value.normalize("NFC");
}

export function ordinalEn(distance = 1) {
  if (distance === 1) return "immediate";
  if (distance === 2) return "second";
  if (distance === 3) return "third";
  return `${distance}th`;
}

export function ordinalHi(distance = 1) {
  if (distance === 1) return "ठीक";
  if (distance === 2) return "दूसरे";
  if (distance === 3) return "तीसरे";
  return `${distance}वें`;
}

export function ordinalPa(distance = 1) {
  if (distance === 1) return "ਤੁਰੰਤ";
  if (distance === 2) return "ਦੂਜੇ";
  if (distance === 3) return "ਤੀਜੇ";
  return `${distance}ਵੇਂ`;
}
