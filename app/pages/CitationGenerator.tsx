import React, { useState, useMemo } from 'react';
import { Quote, Book, Globe, Newspaper, Copy, Check } from 'lucide-react';
import { TextInput } from '~/components/TextInput';

type SourceType = 'book' | 'website' | 'journal';
type CitationFormat = 'APA' | 'MLA';

const CitationGenerator: React.FC = () => {
  const [type, setType] = useState<SourceType>('book');
  const [format, setFormat] = useState<CitationFormat>('APA');
  const [copied, setCopied] = useState(false);

  // Form States
  const [author, setAuthor] = useState('');
  const [year, setYear] = useState('');
  const [title, setTitle] = useState('');
  const [publisher, setPublisher] = useState('');
  const [url, setUrl] = useState('');
  const [journal, setJournal] = useState('');

  const formattedCitation = useMemo(() => {
    const auth = author.trim() || '[Penulis]';
    const yr = year.trim() || '[Tahun]';
    const ttl = title.trim() || '[Judul]';
    const pub = publisher.trim() || '[Penerbit]';
    const link = url.trim() || '[URL]';
    const jrn = journal.trim() || '[Nama Jurnal]';

    if (format === 'APA') {
      if (type === 'book') return `${auth}. (${yr}). ${ttl}. ${pub}.`;
      if (type === 'website') return `${auth}. (${yr}). ${ttl}. Diambil dari ${link}`;
      if (type === 'journal') return `${auth}. (${yr}). ${ttl}. ${jrn}.`;
    } else {
      // Basic MLA Format
      if (type === 'book') return `${auth}. ${ttl}. ${pub}, ${yr}.`;
      if (type === 'website') return `${auth}. "${ttl}." ${link}. Diakses pada ${new Date().toLocaleDateString('id-ID')}.`;
      if (type === 'journal') return `${auth}. "${ttl}." ${jrn}, ${yr}.`;
    }
    return '';
  }, [type, format, author, year, title, publisher, url, journal]);

  const handleCopy = () => {
    if (!formattedCitation.includes('[')) {
      navigator.clipboard.writeText(formattedCitation);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } else {
      alert('Mohon lengkapi data terlebih dahulu!');
    }
  };

  return (
    <div className="flex-1 p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Quote className="text-blue-500" /> SitasiCepat
        </h2>
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-bold">
          <button
            onClick={() => setFormat('APA')}
            className={`px-3 py-1.5 rounded-lg transition-all ${format === 'APA' ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-500' : 'text-slate-400'}`}
          >APA</button>
          <button
            onClick={() => setFormat('MLA')}
            className={`px-3 py-1.5 rounded-lg transition-all ${format === 'MLA' ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-500' : 'text-slate-400'}`}
          >MLA</button>
        </div>
      </div>

      {/* Source Type Selector */}
      <div className="grid grid-cols-3 gap-2 mb-6">
        {(['book', 'website', 'journal'] as SourceType[]).map((t) => (
          <button
            key={t}
            onClick={() => setType(t)}
            className={`flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all ${
              type === t
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-500/10 text-blue-600'
              : 'border-slate-100 dark:border-slate-800 text-slate-400'
            }`}
          >
            {t === 'book' && <Book size={18} />}
            {t === 'website' && <Globe size={18} />}
            {t === 'journal' && <Newspaper size={18} />}
            <span className="text-[10px] uppercase font-black">{t}</span>
          </button>
        ))}
      </div>

      {/* Input Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="space-y-1">
          <TextInput
            label='Penulis'
            value={author}
            placeholder="Dahlan, R."
            onChange={(e) => setAuthor(e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <TextInput
            label='Tahun'
            value={year}
            placeholder="2026"
            onChange={(e) => setYear(e.target.value)}
          />
        </div>
        <div className="md:col-span-2 space-y-1">
          <TextInput
            label={`Judul ${type}`}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        {type === 'book' && (
          <div className="md:col-span-2 space-y-1">
            <TextInput
              label='Penerbit'
              value={publisher}
              onChange={(e) => setPublisher(e.target.value)}
            />
          </div>
        )}
        {type === 'website' && (
          <div className="md:col-span-2 space-y-1">
            <TextInput
              label='URL'
              value={url}
              placeholder="https://..."
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
        )}
        {type === 'journal' && (
          <div className="md:col-span-2 space-y-1">
            <TextInput
              label='Nama Jurnal'
              value={journal}
              onChange={(e) => setJournal(e.target.value)}
            />
          </div>
        )}
      </div>

      {/* Preview Section */}
      <div className="relative group">
        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border-2 border-dashed border-slate-200 dark:border-slate-800 transition-all group-hover:border-blue-500/50">
          <p className="text-sm font-serif italic pr-12 leading-relaxed">
            {formattedCitation}
          </p>
          <button
            onClick={handleCopy}
            className={`absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-xl transition-all ${
              copied ? 'bg-green-500 text-white' : 'bg-blue-600 text-white hover:scale-110 shadow-lg shadow-blue-500/30'
            }`}
          >
            {copied ? <Check size={18} /> : <Copy size={18} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CitationGenerator;

// CSS for tailwind (place in your global CSS)
// .input-field { @apply w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 outline-none focus:ring-2 ring-blue-500 transition-all text-sm; }