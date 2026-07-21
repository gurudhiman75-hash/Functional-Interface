import { describe, expect, it } from 'vitest';

import { isoToLocalDateTimeInput, localDateTimeInputToIso } from './datetime';

describe('audit datetime-local conversion', () => {
  it('round-trips Asia/Kolkata values without UTC drift', () => {
    const offsetMinutes = -330;
    const iso = '2026-07-21T04:30:00.000Z';
    const local = isoToLocalDateTimeInput(iso, offsetMinutes);
    expect(local).toBe('2026-07-21T10:00');
    expect(localDateTimeInputToIso(local, offsetMinutes)).toBe(iso);
  });

  it('rejects invalid local calendar values', () => {
    expect(localDateTimeInputToIso('2026-02-31T10:00', -330)).toBeUndefined();
    expect(isoToLocalDateTimeInput('invalid', -330)).toBe('');
  });
});
