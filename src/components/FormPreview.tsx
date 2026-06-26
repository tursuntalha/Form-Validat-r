import type { FormField } from '../lib/types';

interface Props {
  fields: FormField[];
}

export function FormPreview({ fields }: Props) {
  return (
    <div className="space-y-4 p-4">
      {fields.map((field) => (
        <div key={field.id}>
          <label className="block text-sm font-medium mb-1">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          {field.type === 'textarea' ? (
            <textarea
              placeholder={field.placeholder || field.label}
              rows={3}
              className="w-full rounded-lg border border-(--border) px-3 py-2 text-sm bg-(--bg) outline-none focus:border-(--primary)"
            />
          ) : field.type === 'select' ? (
            <select className="w-full rounded-lg border border-(--border) px-3 py-2 text-sm bg-(--bg) outline-none focus:border-(--primary)">
              <option value="">Seçiniz...</option>
              {field.options?.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          ) : field.type === 'checkbox' ? (
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" className="rounded border-(--border)" />
              {field.label}
            </label>
          ) : field.type === 'radio' ? (
            <div className="space-y-1">
              {(field.options || ['Evet', 'Hayır']).map((opt) => (
                <label key={opt} className="flex items-center gap-2 text-sm">
                  <input type="radio" name={field.id} className="border-(--border)" />
                  {opt}
                </label>
              ))}
            </div>
          ) : (
            <input
              type={field.type}
              placeholder={field.placeholder || field.label}
              className="w-full rounded-lg border border-(--border) px-3 py-2 text-sm bg-(--bg) outline-none focus:border-(--primary)"
            />
          )}
        </div>
      ))}
    </div>
  );
}
