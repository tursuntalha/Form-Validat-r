import type { ValidationRule } from '../lib/types';

export const tcKimlikValidator: ValidationRule = {
  validate(value: string) {
    const cleaned = value.replace(/\s/g, '');
    if (!/^\d{11}$/.test(cleaned)) {
      return { valid: false, reason: 'TC Kimlik No 11 haneli olmalıdır' };
    }

    const digits = cleaned.split('').map(Number);

    if (digits[0] === 0) {
      return { valid: false, reason: 'TC Kimlik No ilk hanesi 0 olamaz' };
    }

    const oddSum = digits[0] + digits[2] + digits[4] + digits[6] + digits[8];
    const evenSum = digits[1] + digits[3] + digits[5] + digits[7];
    const tenthDigit = (oddSum * 7 - evenSum) % 10;

    if (tenthDigit !== digits[9]) {
      return { valid: false, reason: 'TC Kimlik No 10. hane doğrulaması başarısız' };
    }

    const sumFirst10 = digits.slice(0, 10).reduce((a, b) => a + b, 0);
    const eleventhDigit = sumFirst10 % 10;

    if (eleventhDigit !== digits[10]) {
      return { valid: false, reason: 'TC Kimlik No 11. hane doğrulaması başarısız' };
    }

    return { valid: true, reason: 'Geçerli TC Kimlik No' };
  },
};
