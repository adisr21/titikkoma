import React, { useState, useMemo } from 'react';
import { Hash, Clock, BookOpen, FileText, Eraser, Info } from 'lucide-react';

interface TextStats {
  words: number;
  chars: number;
  sentences: number;
  readingTime: number;
}

const WordCounter: React.FC = () => {
  const [text, setText] = useState<string>('');

  const stats = useMemo((): TextStats => {
    const content = text.trim();
    if (!content) return { words: 0, chars: 0, sentences: 0, readingTime: 0 };

    const words = content.split(/\s+/).filter(Boolean).length;
    const chars = content.length;
    const sentences = content.split(/[.!?]+/).filter(Boolean).length;

    // Asumsi kecepatan baca rata-rata mahasiswa/dosen: 200 kata per menit
    const readingTime = Math.ceil(words / 200);

    return { words, chars, sentences, readingTime };
  }, [text]);

  const readingLevel = useMemo(() => {
    if (stats.words === 0) return { label: 'Kosong', color: 'text-slate-400' };

    const avgWordPerSentence = stats.words / (stats.sentences || 1);

    if (avgWordPerSentence > 25) return { label: 'Akademik Berat', color: 'text-red-500' };
    if (avgWordPerSentence > 15) return { label: 'Standar Menengah', color: 'text-blue-500' };
    return { label: 'Mudah Dipahami', color: 'text-emerald-500' };
  }, [stats]);

  const handleClear = () => {
    if (window.confirm('Bersihkan semua teks?')) {
      setText('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Hash className="text-purple-500" /> HitungKata
        </h2>
        <button
          onClick={handleClear}
          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-red-500 transition-all active:scale-90"
          title="Bersihkan Teks"
        >
          <Eraser size={20} />
        </button>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="stat-card">
          <FileText className="text-blue-500 mb-1" size={18} />
          <span className="text-2xl font-black">{stats.words}</span>
          <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Kata</span>
        </div>
        <div className="stat-card">
          <Hash className="text-purple-500 mb-1" size={18} />
          <span className="text-2xl font-black">{stats.chars}</span>
          <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Karakter</span>
        </div>
        <div className="stat-card">
          <Clock className="text-emerald-500 mb-1" size={18} />
          <span className="text-2xl font-black">{stats.readingTime}</span>
          <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Menit Baca</span>
        </div>
        <div className="stat-card">
          <BookOpen className={`${readingLevel.color} mb-1`} size={18} />
          <span className="text-sm font-bold leading-tight">{readingLevel.label}</span>
          <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Level Teks</span>
        </div>
      </div>

      {/* Text Area */}
      <div className="relative group">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Tempel atau ketik esaimu di sini..."
          className="w-full h-80 p-6 rounded-[2rem] bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 outline-none focus:ring-4 ring-purple-500/10 focus:border-purple-500 transition-all text-lg leading-relaxed resize-none shadow-inner"
        />

        {/* Floating Word Badge */}
        <div className="absolute bottom-4 right-6 px-3 py-1 bg-white dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700 text-[10px] font-black text-slate-400 uppercase tracking-tighter shadow-sm">
          {stats.words} Words
        </div>
      </div>

      {/* Pro Tip */}
      <div className="flex items-start gap-4 p-5 rounded-2xl bg-blue-50/50 dark:bg-blue-500/5 border border-blue-100 dark:border-blue-900/20">
        <div className="p-2 bg-blue-500 rounded-lg text-white">
          <Info size={16} />
        </div>
        <div className="space-y-1">
          <p className="text-xs font-bold text-blue-900 dark:text-blue-300">Tips Akademik</p>
          <p className="text-[11px] leading-relaxed text-blue-700/80 dark:text-blue-400/80">
            Dosen lebih menyukai kalimat yang efektif. Jika level teks Anda menunjukkan <strong>"Akademik Berat"</strong>, pertimbangkan untuk memecah kalimat yang terlalu panjang agar lebih mudah dipahami saat dibaca.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WordCounter;