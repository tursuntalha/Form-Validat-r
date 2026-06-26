import type { ValidationRule } from '../lib/types';

export const phoneTrValidator: ValidationRule = {
  validate(value: string) {
    const cleaned = value.replace(/[\s\-\(\)]/g, '');

    // Accept formats: 05xxxxxxxxx, +905xxxxxxxxx, 0212xxxxxxx
    const mobilePattern = /^(0|(\+)?90)5\d{9}$/;
    const landlinePattern = /^(0|(\+)?90)[2-4]\d{9}$/;

    if (mobilePattern.test(cleaned)) {
      return { valid: true, reason: 'Geçerli GSM numarası' };
    }

    if (landlinePattern.test(cleaned)) {
      return { valid: true, reason: 'Geçerli sabit hat numarası' };
    }

    return {
      valid: false,
      reason: 'Geçerli bir Türk telefon numarası giriniz (05xx xxx xx xx)',
    };
  },
};
