import { useState } from 'react';
import { Code2, Copy, Check } from 'lucide-react';
import type { FormField, ExportFormat } from '../lib/types';

interface Props {
  fields: FormField[];
}

export function ExportPanel({ fields }: Props) {
  const [format, setFormat] = useState<ExportFormat>('react');
  const [copied, setCopied] = useState(false);

  const generateCode = (): string => {
    switch (format) {
      case 'react':
        return generateReactJSX(fields);
      case 'json':
        return generateJSONSchema(fields);
      case 'html':
        return generateHTML(fields);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generateCode());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Code2 size={18} className="text-(--primary)" />
          <h3 className="font-semibold">Dışa Aktar</h3>
        </div>

        <div className="flex gap-1">
          {(['react', 'json', 'html'] as ExportFormat[]).map((f) => (
            <button
              key={f}
              onClick={() => setFormat(f)}
              className={`text-xs px-3 py-1.5 rounded-md border transition-colors ${
                format === f
                  ? 'bg-(--primary) text-white border-(--primary)'
                  : 'border-(--border) hover:bg-(--surface)'
              }`}
            >
              {f.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="relative">
        <pre className="rounded-xl border border-(--border) bg-gray-950 text-gray-100 p-4 overflow-x-auto text-xs leading-relaxed max-h-80 overflow-y-auto">
          <code>{generateCode()}</code>
        </pre>
        <button
          onClick={handleCopy}
          className="absolute top-2 right-2 p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors"
        >
          {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
        </button>
      </div>
    </div>
  );
}

function generateReactJSX(fields: FormField[]): string {
  const imports = `import { useForm } from 'react-hook-form';\nimport { z } from 'zod';\nimport { zodResolver } from '@hookform/resolvers/zod';\n\n`;
  const schemaName = 'FormSchema';
  const schemaProps = fields.map((f) => {
    let s = `${f.field}: z.string()`;
    if (f.required) s += '.min(1, "Bu alan zorunludur")';
    if (f.type === 'email') s += '.email("Geçerli bir e-posta girin")';
    if (f.type === 'number') s += '.regex(/^\\d+$/, "Sayı girin")';
    if (f.minLength) s += `.min(${f.minLength}, "En az ${f.minLength} karakter")`;
    return `  ${s}`;
  }).join(',\n');

  const formFields = fields.map((f) => {
    const typeMap: Record<string, string> = { email: 'email', number: 'number', date: 'date', textarea: 'textarea', select: 'select', checkbox: 'checkbox', radio: 'radio' };
    const inputType = typeMap[f.type] || 'text';
    return `        <div>
          <label>${f.label}${f.required ? ' *' : ''}</label>
          <input type="${inputType}" {...register("${f.field}")} />
          {errors.${f.field} && <p>{errors.${f.field}.message}</p>}
        </div>`;
  }).join('\n');

  return `${imports}const ${schemaName} = z.object({\n${schemaProps}\n});\n\ntype FormData = z.infer<typeof ${schemaName}>;\n\nexport function MyForm() {\n  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({\n    resolver: zodResolver(${schemaName}),\n  });\n\n  const onSubmit = (data: FormData) => console.log(data);\n\n  return (\n    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">\n${formFields}\n      <button type="submit">Gönder</button>\n    </form>\n  );\n}`;
}

function generateJSONSchema(fields: FormField[]): string {
  const properties = fields.map((f) => {
    const typeMap: Record<string, string> = { text: 'string', email: 'string', number: 'number', date: 'string', textarea: 'string', select: 'string', checkbox: 'boolean', radio: 'string' };
    const prop: Record<string, any> = { type: typeMap[f.type] || 'string', title: f.label };
    if (f.minLength) prop.minLength = f.minLength;
    const req = f.required ? `,\n      "${f.field}": ${JSON.stringify(prop)}` : `,\n      "${f.field}": ${JSON.stringify(prop)}`;
    return req;
  }).join('');

  return JSON.stringify({
    $schema: 'http://json-schema.org/draft-07/schema#',
    type: 'object',
    properties: Object.fromEntries(fields.map((f) => {
      const typeMap: Record<string, string> = { text: 'string', email: 'string', number: 'number', date: 'string', textarea: 'string', select: 'string', checkbox: 'boolean', radio: 'string' };
      const prop: Record<string, any> = { type: typeMap[f.type] || 'string', title: f.label };
      if (f.minLength) prop.minLength = f.minLength;
      return [f.field, prop];
    })),
    required: fields.filter((f) => f.required).map((f) => f.field),
  }, null, 2);
}

function generateHTML(fields: FormField[]): string {
  const htmlFields = fields.map((f) => {
    const typeMap: Record<string, string> = { text: 'text', email: 'email', number: 'number', date: 'date', textarea: 'textarea', select: 'select', checkbox: 'checkbox', radio: 'radio' };
    const inputType = typeMap[f.type] || 'text';
    const req = f.required ? ' required' : '';
    const validatorAttr = f.validator ? ` data-validator="${f.validator}"` : '';
    const minLen = f.minLength ? ` minlength="${f.minLength}"` : '';

    if (f.type === 'textarea') {
      return `    <div>
      <label for="${f.field}">${f.label}${f.required ? ' *' : ''}</label>
      <textarea id="${f.field}" name="${f.field}"${req}${minLen}${validatorAttr}></textarea>
    </div>`;
    }
    if (f.type === 'select') {
      const opts = (f.options || ['']).map((o) => `      <option value="${o}">${o}</option>`).join('\n');
      return `    <div>
      <label for="${f.field}">${f.label}${f.required ? ' *' : ''}</label>
      <select id="${f.field}" name="${f.field}"${req}${validatorAttr}>
${opts}
      </select>
    </div>`;
    }
    return `    <div>
      <label for="${f.field}">${f.label}${f.required ? ' *' : ''}</label>
      <input type="${inputType}" id="${f.field}" name="${f.field}"${req}${minLen}${validatorAttr} />
    </div>`;
  }).join('\n');

  return `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Generated Form</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 640px; margin: 2rem auto; padding: 0 1rem; }
    div { margin-bottom: 1rem; }
    label { display: block; font-weight: 500; margin-bottom: 0.25rem; }
    input, select, textarea { width: 100%; padding: 0.5rem; border: 1px solid #ccc; border-radius: 6px; }
    button { background: #6366f1; color: white; border: none; padding: 0.5rem 2rem; border-radius: 6px; cursor: pointer; }
  </style>
</head>
<body>
  <form>
${htmlFields}
    <button type="submit">Gönder</button>
  </form>
</body>
</html>`;
}
