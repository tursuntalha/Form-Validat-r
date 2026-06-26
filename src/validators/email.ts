import type { ValidationRule } from '../lib/types';

export const emailValidator: ValidationRule = {
  validate(value: string) {
    const cleaned = value.trim().toLowerCase();

    if (!cleaned.includes('@')) {
      return { valid: false, reason: 'E-posta adresi @ işareti içermelidir' };
    }

    const parts = cleaned.split('@');
    if (parts.length !== 2 || parts[0].length === 0) {
      return { valid: false, reason: 'E-posta adresinin yerel kısmı boş olamaz' };
    }

    const domain = parts[1];
    if (!domain.includes('.')) {
      return { valid: false, reason: 'E-posta adresinin domain kısmı geçersiz' };
    }

    const tld = domain.split('.').pop() || '';
    if (tld.length < 2) {
      return { valid: false, reason: 'Üst seviye alan adı en az 2 karakter olmalıdır' };
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(cleaned)) {
      return { valid: false, reason: 'E-posta adresi formatı geçersiz' };
    }

    return { valid: true, reason: 'Geçerli e-posta adresi' };
  },
};
