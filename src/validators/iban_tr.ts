import type { ValidationRule } from '../lib/types';

const IBAN_LENGTHS: Record<string, number> = { TR: 26 };

export const ibanTrValidator: ValidationRule = {
  validate(value: string) {
    const cleaned = value.replace(/\s/g, '').toUpperCase();

    if (!/^TR\d{24}$/.test(cleaned)) {
      return { valid: false, reason: 'IBAN, TR ile başlayan 26 karakter olmalıdır' };
    }

    // Move first 4 chars to end
    const rearranged = cleaned.slice(4) + cleaned.slice(0, 4);

    // Convert letters to numbers (A=10, B=11, ..., Z=35)
    const numeric = rearranged.split('').map((c) => {
      if (/[A-Z]/.test(c)) return (c.charCodeAt(0) - 55).toString();
      return c;
    }).join('');

    // Mod 97 check
    let remainder = 0;
    for (let i = 0; i < numeric.length; i++) {
      remainder = (remainder * 10 + parseInt(numeric[i], 10)) % 97;
    }

    if (remainder !== 1) {
      return { valid: false, reason: 'IBAN mod-97 doğrulaması başarısız' };
    }

    return { valid: true, reason: 'Geçerli IBAN' };
  },
};

export function formatIban(value: string): string {
  const cleaned = value.replace(/\s/g, '').toUpperCase();
  return cleaned.replace(/(.{4})/g, '$1 ').trim();
}
