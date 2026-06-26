import { useState } from 'react';
import { Shield, Info, Loader2 } from 'lucide-react';
import { validateWithAI } from '../lib/ollama';
import { tcKimlikValidator } from '../validators/tc_kimlik';
import { ibanTrValidator } from '../validators/iban_tr';
import { phoneTrValidator } from '../validators/phone_tr';
import { emailValidator } from '../validators/email';
import { nameTrValidator } from '../validators/name_tr';

const VALIDATORS: Record<string, typeof tcKimlikValidator> = {
  tc_kimlik: tcKimlikValidator,
  iban_tr: ibanTrValidator,
  phone_tr: phoneTrValidator,
  email: emailValidator,
  name_tr: nameTrValidator,
};

export function ValidationPanel() {
  const [input, setInput] = useState('');
  const [results, setResults] = useState<{ field: string; score: number; reason: string; valid?: boolean }[]>([]);
  const [loading, setLoading] = useState(false);

  const handleValidate = async () => {
    setLoading(true);
    let data: Record<string, string>;
    try {
      data = JSON.parse(input);
    } catch {
      // Try as simple key=value per line
      const lines = input.split('\n').filter(Boolean);
      data = {};
      for (const line of lines) {
        const [k, ...v] = line.split(':');
        if (k && v.length) data[k.trim()] = v.join(':').trim();
      }
    }

    const localResults = Object.entries(data).map(([field, value]) => {
      const validatorKey = field.toLowerCase().includes('tc') || field.toLowerCase().includes('kimlik')
        ? 'tc_kimlik'
        : field.toLowerCase().includes('iban')
        ? 'iban_tr'
        : field.toLowerCase().includes('telefon') || field.toLowerCase().includes('phone')
        ? 'phone_tr'
        : field.toLowerCase().includes('email') || field.toLowerCase().includes('eposta')
        ? 'email'
        : field.toLowerCase().includes('ad') || field.toLowerCase().includes('isim')
        ? 'name_tr'
        : null;

      if (validatorKey && VALIDATORS[validatorKey]) {
        const r = VALIDATORS[validatorKey].validate(value);
        return { field, score: r.valid ? 0 : 1, reason: r.reason, valid: r.valid };
      }
      return { field, score: 0, reason: 'No validator matched', valid: true };
    });

    // Also try AI validation
    try {
      const aiResults = await validateWithAI(data);
      const merged = localResults.map((lr) => {
        const ai = aiResults.results.find((r) => r.field === lr.field);
        if (ai) {
          return { ...lr, score: Math.max(lr.score, ai.score), reason: ai.reason };
        }
        return lr;
      });
      setResults(merged);
    } catch {
      setResults(localResults);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Shield size={18} className="text-(--primary)" />
        <h3 className="font-semibold">Semantik Validasyon</h3>
      </div>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder='JSON veya satır satır alan:değer girin&#10;Örn:&#10;{"isim": "Aaaaa Bbbbb", "tc_no": "12345678901"}&#10;veya:&#10;isim: Mehmet Yılmaz&#10;tc_no: 10000000146'
        rows={5}
        className="w-full rounded-xl border border-(--border) px-4 py-3 text-sm bg-(--bg) outline-none focus:border-(--primary) resize-none font-mono"
      />

      <button
        onClick={handleValidate}
        disabled={!input.trim() || loading}
        className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-(--primary) text-white text-sm font-medium hover:bg-(--primary-dark) disabled:opacity-50 transition-colors"
      >
        {loading ? <Loader2 size={16} className="animate-spin" /> : <Shield size={16} />}
        Doğrula
      </button>

      {results.length > 0 && (
        <div className="space-y-2">
          {results.map((r) => (
            <div
              key={r.field}
              className={`p-3 rounded-lg border text-sm ${
                r.valid === false
                  ? 'border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800'
                  : r.score > 0.5
                  ? 'border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-800'
                  : 'border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{r.field}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  r.valid === false ? 'bg-red-200 text-red-700' :
                  r.score > 0.5 ? 'bg-yellow-200 text-yellow-700' :
                  'bg-green-200 text-green-700'
                }`}>
                  {r.valid === false ? 'GEÇERSİZ' : r.score > 0.5 ? 'ŞÜPHELİ' : 'GEÇERLİ'}
                </span>
              </div>
              <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                <Info size={12} />
                {r.reason}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
