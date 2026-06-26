export interface FormField {
  id: string;
  field: string;
  type: 'text' | 'email' | 'number' | 'date' | 'textarea' | 'select' | 'checkbox' | 'radio';
  label: string;
  required: boolean;
  validator?: string;
  options?: string[];
  min?: number;
  max?: number;
  minLength?: number;
  placeholder?: string;
}

export interface ValidationResult {
  field: string;
  label: string;
  value: string;
  valid: boolean;
  score: number;
  reason: string;
}

export type ExportFormat = 'react' | 'json' | 'html';
export type Locale = 'tr' | 'en';

export interface ValidationRule {
  validate(value: string): { valid: boolean; reason: string };
}
