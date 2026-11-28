// Per-question native Hindi/Punjabi records for Indian Geography.
//
// These replace the word-dictionary fallback (`localizeText`), which produced
// output such as "सिंधुtry" for "industry". A record is used only while the
// English it was translated from is unchanged: `h` is an FNV-1a hash of the
// English stem and options, so an edited English item fails loudly instead of
// silently showing a stale translation.

export type IndianGeoNativeEntryV1 = readonly [stem: string, options: readonly string[], explanation: string];

export interface IndianGeoNativeRecordV1 {
  readonly h: string;
  readonly hi: IndianGeoNativeEntryV1;
  readonly pa: IndianGeoNativeEntryV1;
}

export type IndianGeoNativeRecordsV1 = Readonly<Record<string, IndianGeoNativeRecordV1>>;

export function indianGeoNativeSourceHashV1(stem: string, options: readonly string[]): string {
  let hash = 0x811c9dc5;
  for (const byte of new TextEncoder().encode(`${stem}\u0001${options.join("\u0001")}`)) {
    hash = Math.imul(hash ^ byte, 0x01000193) >>> 0;
  }
  return hash.toString(16).padStart(8, "0");
}
