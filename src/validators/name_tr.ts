import type { ValidationRule } from '../lib/types';

const SUSPICIOUS_PATTERNS = [
  /^([a-zA-Z])\1+$/i,           // "aaaaa", "bbbbb"
  /^(.{1,2})\1{2,}$/i,          // "abababab"
  /^[A-Za-z]{20,}$/,             // very long single word
];

export const nameTrValidator: ValidationRule = {
  validate(value: string) {
    const cleaned = value.trim();

    if (cleaned.length < 2) {
      return { valid: false, reason: 'İsim en az 2 karakter olmalıdır' };
    }

    if (cleaned.length > 100) {
      return { valid: false, reason: 'İsim 100 karakterden uzun olamaz' };
    }

    if (!/^[a-zA-ZğüşıöçĞÜŞİÖÇ\s\-']+$/.test(cleaned)) {
      return { valid: false, reason: 'İsim sadece harf, boşluk ve tire içerebilir' };
    }

    const words = cleaned.split(/\s+/);
    for (const word of words) {
      for (const pattern of SUSPICIOUS_PATTERNS) {
        if (pattern.test(word)) {
          return { valid: false, reason: 'İsim kalıbı gerçek görünmüyor (otomatik/rastgele olabilir)' };
        }
      }
    }

    const parts = cleaned.split(/\s+/);
    if (parts.length < 2) {
      return { valid: false, reason: 'Ad ve soyad giriniz' };
    }

    return { valid: true, reason: 'Geçerli isim' };
  },
};
