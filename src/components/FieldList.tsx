import { useState } from 'react';
import type { FormField } from '../lib/types';
import { GripVertical, X } from 'lucide-react';

interface Props {
  fields: FormField[];
  onToggleRequired: (id: string) => void;
  onChangeType: (id: string, type: FormField['type']) => void;
  onRemove: (id: string) => void;
  onReorder: (from: number, to: number) => void;
}

const FIELD_TYPES: FormField['type'][] = [
  'text', 'email', 'number', 'date', 'textarea', 'select', 'checkbox', 'radio',
];

export function FieldList({ fields, onToggleRequired, onChangeType, onRemove, onReorder }: Props) {
  const [dragIdx, setDragIdx] = useState<number | null>(null);

  return (
    <div className="space-y-2">
      {fields.map((field, idx) => (
        <div
          key={field.id}
          draggable
          onDragStart={() => setDragIdx(idx)}
          onDragOver={(e) => { e.preventDefault(); }}
          onDrop={() => {
            if (dragIdx !== null && dragIdx !== idx) {
              onReorder(dragIdx, idx);
              setDragIdx(null);
            }
          }}
          className="flex items-center gap-2 p-3 rounded-lg border border-(--border) bg-(--bg) hover:border-(--primary)/50 transition-colors cursor-move"
        >
          <GripVertical size={16} className="text-gray-400 shrink-0" />

          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{field.label}</p>
            <p className="text-xs text-gray-500">
              {field.field} · {field.type}{field.validator ? ` · ${field.validator}` : ''}
            </p>
          </div>

          <button
            onClick={() => onToggleRequired(field.id)}
            className={`text-xs px-2 py-1 rounded-md border ${field.required ? 'bg-(--primary)/10 text-(--primary) border-(--primary)' : 'text-gray-400 border-(--border)'}`}
          >
            {field.required ? 'Zorunlu' : 'Opsiyonel'}
          </button>

          <select
            value={field.type}
            onChange={(e) => onChangeType(field.id, e.target.value as FormField['type'])}
            className="text-xs border border-(--border) rounded-md px-1 py-1 bg-(--bg) outline-none"
          >
            {FIELD_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>

          <button onClick={() => onRemove(field.id)} className="p-1 hover:bg-red-50 rounded transition-colors">
            <X size={14} className="text-red-400" />
          </button>
        </div>
      ))}
    </div>
  );
}
