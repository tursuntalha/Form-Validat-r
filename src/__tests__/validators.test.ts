import { describe, it, expect } from 'vitest';
import { tcKimlikValidator } from '../validators/tc_kimlik';
import { ibanTrValidator } from '../validators/iban_tr';
import { phoneTrValidator } from '../validators/phone_tr';
import { emailValidator } from '../validators/email';
import { nameTrValidator } from '../validators/name_tr';

describe('tcKimlikValidator', () => {
  it('should validate a correct TC Kimlik No', () => {
    // Known valid TCKN: 10000000146
    const result = tcKimlikValidator.validate('10000000146');
    expect(result.valid).toBe(true);
  });

  it('should reject short number', () => {
    expect(tcKimlikValidator.validate('12345').valid).toBe(false);
  });

  it('should reject number starting with 0', () => {
    expect(tcKimlikValidator.validate('01234567890').valid).toBe(false);
  });

  it('should reject non-numeric', () => {
    expect(tcKimlikValidator.validate('1234567890a').valid).toBe(false);
  });
});

describe('ibanTrValidator', () => {
  it('should validate a correct TR IBAN', () => {
    // Known valid TR IBAN
    const result = ibanTrValidator.validate('TR330006100519786457841326');
    expect(result.valid).toBe(true);
  });

  it('should reject invalid IBAN', () => {
    expect(ibanTrValidator.validate('TR123456789012345678901234').valid).toBe(false);
  });

  it('should handle formatted IBAN with spaces', () => {
    expect(ibanTrValidator.validate('TR33 0006 1005 1978 6457 8413 26').valid).toBe(true);
  });
});

describe('phoneTrValidator', () => {
  it('should validate mobile phone', () => {
    expect(phoneTrValidator.validate('05321234567').valid).toBe(true);
  });

  it('should validate with +90 prefix', () => {
    expect(phoneTrValidator.validate('+905321234567').valid).toBe(true);
  });

  it('should reject invalid phone', () => {
    expect(phoneTrValidator.validate('12345').valid).toBe(false);
  });
});

describe('emailValidator', () => {
  it('should validate correct email', () => {
    expect(emailValidator.validate('test@example.com').valid).toBe(true);
  });

  it('should reject email without @', () => {
    expect(emailValidator.validate('test').valid).toBe(false);
  });

  it('should reject email without domain', () => {
    expect(emailValidator.validate('test@').valid).toBe(false);
  });
});

describe('nameTrValidator', () => {
  it('should validate real name', () => {
    expect(nameTrValidator.validate('Talha Tursun').valid).toBe(true);
  });

  it('should reject single word', () => {
    expect(nameTrValidator.validate('Talha').valid).toBe(false);
  });

  it('should reject repetitive pattern', () => {
    expect(nameTrValidator.validate('Aaaa Bbbb').valid).toBe(false);
  });

  it('should reject too short', () => {
    expect(nameTrValidator.validate('A').valid).toBe(false);
  });
});
