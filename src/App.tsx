import { useState } from 'react';
import { Sparkles, Shield, Code2, Plus, RotateCcw } from 'lucide-react';
import { NLInput } from './components/NLInput';
import { FieldList } from './components/FieldList';
import { FormPreview } from './components/FormPreview';
import { ValidationPanel } from './components/ValidationPanel';
import { ExportPanel } from './components/ExportPanel';
import type { FormField, Locale } from './lib/types';
import { generateForm } from './lib/ollama';

type Tab = 'builder' | 'validator' | 'export';

const TRANSLATIONS: Record<Locale, { builder: string; validator: string; export: string }> = {
  tr: { builder: 'Form Oluşturucu', validator: 'Validasyon', export: 'Dışa Aktar' },
  en: { builder: 'Form Builder', validator: 'Validation', export: 'Export' },
};

export default function App() {
  const [locale, setLocale] = useState<Locale>('tr');
  const [tab, setTab] = useState<Tab>('builder');
  const [fields, setFields] = useState<FormField[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const t = TRANSLATIONS[locale];

  const handleGenerate = async (text: string) => {
    setLoading(true);
    setError('');
    const result = await generateForm(text);
    if (result.error) {
      setError(result.error);
    } else {
      setFields(result.fields);
    }
    setLoading(false);
  };

  const toggleRequired = (id: string) => {
    setFields((prev) => prev.map((f) => f.id === id ? { ...f, required: !f.required } : f));
  };

  const changeType = (id: string, type: FormField['type']) => {
    setFields((prev) => prev.map((f) => f.id === id ? { ...f, type } : f));
  };

  const removeField = (id: string) => {
    setFields((prev) => prev.filter((f) => f.id !== id));
  };

  const reorder = (from: number, to: number) => {
    setFields((prev) => {
      const copy = [...prev];
      const [removed] = copy.splice(from, 1);
      copy.splice(to, 0, removed);
      return copy;
    });
  };

  const addManualField = () => {
    const newField: FormField = {
      id: 'field_' + Math.random().toString(36).slice(2, 8),
      field: 'new_field',
      type: 'text',
      label: locale === 'tr' ? 'Yeni Alan' : 'New Field',
      required: false,
    };
    setFields((prev) => [...prev, newField]);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-(--border) bg-(--surface) px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">
          Form<span className="text-(--primary)">Forge</span>
        </h1>
        <button
          onClick={() => setLocale((l) => (l === 'tr' ? 'en' : 'tr'))}
          className="text-xs px-3 py-1.5 rounded-md border border-(--border) hover:bg-(--surface) transition-colors"
        >
          {locale === 'tr' ? 'EN' : 'TR'}
        </button>
      </header>

      <div className="border-b border-(--border) px-6">
        <div className="flex gap-1">
          {(['builder', 'validator', 'export'] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                tab === t
                  ? 'border-(--primary) text-(--primary)'
                  : 'border-transparent text-gray-500 hover:text-(--fg)'
              }`}
            >
              {t === 'builder' && <Sparkles size={16} />}
              {t === 'validator' && <Shield size={16} />}
              {t === 'export' && <Code2 size={16} />}
              {TRANSLATIONS[locale][t]}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 p-6">
        {tab === 'builder' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <NLInput onGenerate={handleGenerate} loading={loading} />
              {error && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">
                  {error}
                </div>
              )}
              {fields.length > 0 && (
                <>
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-sm">Alanlar ({fields.length})</h3>
                    <button
                      onClick={addManualField}
                      className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-md border border-(--border) hover:bg-(--surface) transition-colors"
                    >
                      <Plus size={14} /> Alan Ekle
                    </button>
                  </div>
                  <FieldList
                    fields={fields}
                    onToggleRequired={toggleRequired}
                    onChangeType={changeType}
                    onRemove={removeField}
                    onReorder={reorder}
                  />
                </>
              )}
            </div>
            <div>
              <h3 className="font-semibold text-sm mb-3">Önizleme</h3>
              {fields.length > 0 ? (
                <div className="border border-(--border) rounded-xl overflow-hidden">
                  <FormPreview fields={fields} />
                </div>
              ) : (
                <div className="border border-dashed border-(--border) rounded-xl p-12 text-center text-sm text-gray-500">
                  Form alanları burada görünecek
                </div>
              )}
            </div>
          </div>
        )}

        {tab === 'validator' && (
          <div className="max-w-2xl">
            <ValidationPanel />
          </div>
        )}

        {tab === 'export' && (
          <div className="max-w-3xl">
            {fields.length > 0 ? (
              <ExportPanel fields={fields} />
            ) : (
              <div className="text-center text-sm text-gray-500 py-12">
                Önce bir form oluşturun.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
