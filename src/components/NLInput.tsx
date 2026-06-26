import { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';

interface Props {
  onGenerate: (text: string) => void;
  loading: boolean;
}

export function NLInput({ onGenerate, loading }: Props) {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || loading) return;
    onGenerate(text.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <label className="block text-sm font-medium">
        Formunuzu Türkçe veya İngilizce anlatın
      </label>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder='Örn: "Bir kira sözleşmesi formu yap: kiracı adı, TC kimlik numarası, kira bedeli (TL), başlangıç tarihi, depozito bedeli, ev adresi"'
        rows={3}
        className="w-full rounded-xl border border-(--border) bg-(--bg) px-4 py-3 text-sm outline-none focus:border-(--primary) resize-none"
      />
      <button
        type="submit"
        disabled={!text.trim() || loading}
        className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-(--primary) text-white text-sm font-medium hover:bg-(--primary-dark) disabled:opacity-50 transition-colors"
      >
        {loading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
        {loading ? 'Oluşturuluyor...' : 'Formu Oluştur'}
      </button>
    </form>
  );
}
