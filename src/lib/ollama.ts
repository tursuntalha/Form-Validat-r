import type { FormField } from './types';

const API_URL = 'http://localhost:3001/api/generate';

const FEW_SHOT_PROMPT = `You are FormForge AI. Given a user's form description in Turkish or English, generate a JSON array of form fields.

Example 1:
User: "Bir kira sözleşmesi formu yap: kiracı adı, TC kimlik numarası, kira bedeli (TL), başlangıç tarihi, depozito bedeli, ev adresi"
Response: [
  {"field": "tenant_name", "type": "text", "label": "Kiracı Adı", "required": true, "validator": "name_tr"},
  {"field": "tc_id", "type": "text", "label": "TC Kimlik No", "required": true, "validator": "tc_kimlik"},
  {"field": "monthly_rent", "type": "number", "label": "Aylık Kira (TL)", "required": true, "min": 0},
  {"field": "start_date", "type": "date", "label": "Başlangıç Tarihi", "required": true},
  {"field": "deposit", "type": "number", "label": "Depozito Bedeli", "required": true, "min": 0},
  {"field": "address", "type": "textarea", "label": "Ev Adresi", "required": true, "minLength": 10}
]

Example 2:
User: "Make a contact form: name, email, phone, message"
Response: [
  {"field": "name", "type": "text", "label": "Name", "required": true, "validator": "name_tr"},
  {"field": "email", "type": "email", "label": "Email Address", "required": true},
  {"field": "phone", "type": "text", "label": "Phone", "required": false, "validator": "phone_tr"},
  {"field": "message", "type": "textarea", "label": "Message", "required": true, "minLength": 20}
]

Supported types: text, email, number, date, textarea, select, checkbox, radio
Supported validators: tc_kimlik, iban_tr, phone_tr, email, name_tr

Respond with ONLY the JSON array, no other text.

User: `;

export interface GenerateResult {
  fields: FormField[];
  error?: string;
}

export async function generateForm(description: string): Promise<GenerateResult> {
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'qwen2.5:7b',
        prompt: FEW_SHOT_PROMPT + description,
        temperature: 0.2,
      }),
    });

    if (!res.ok) throw new Error('Server error');

    const data = await res.json();
    const text = data.response.trim();
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) throw new Error('No JSON in response');

    const fields: FormField[] = JSON.parse(jsonMatch[0]);
    return { fields: fields.map((f) => ({ ...f, id: f.field + '_' + Math.random().toString(36).slice(2, 8) })) };
  } catch (e) {
    return { fields: [], error: e instanceof Error ? e.message : 'Failed to generate form' };
  }
}

export async function validateWithAI(values: Record<string, string>): Promise<{
  results: { field: string; score: number; reason: string }[];
}> {
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'qwen2.5:7b',
        prompt: `You are a form validator. For each field value below, give a suspicion score (0-1) and a short reason. Respond ONLY with a JSON array of {"field": string, "score": number, "reason": string}.

Field values to validate:
${Object.entries(values).map(([k, v]) => `${k}: "${v}"`).join('\n')}`,
        temperature: 0.1,
      }),
    });
    if (!res.ok) throw new Error('Server error');
    const data = await res.json();
    const text = data.response.trim();
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) throw new Error('No JSON');
    return { results: JSON.parse(jsonMatch[0]) };
  } catch {
    return { results: Object.keys(values).map((field) => ({ field, score: 0, reason: 'AI validation unavailable' })) };
  }
}
