import React, { useState, useMemo } from 'react';
import { MessageSquare, Send, Copy, Check, User, Phone, GraduationCap } from 'lucide-react';

type MessageType = 'ijin' | 'bimbingan' | 'revisi' | 'nilai';

interface TemplateConfig {
  label: string;
  getContent: (lecturer: string, name: string, id: string) => string;
}

const HaloLecturer: React.FC = () => {
  const [lecturerName, setLecturerName] = useState('');
  const [studentName, setStudentName] = useState('');
  const [studentID, setStudentID] = useState('');
  const [phone, setPhone] = useState('');
  const [type, setType] = useState<MessageType>('ijin');
  const [copied, setCopied] = useState(false);

  const templates: Record<MessageType, TemplateConfig> = {
    ijin: {
      label: 'Izin Kuliah',
      getContent: (l, n, i) => `Selamat pagi/siang Bapak/Ibu ${l || '[Nama Dosen]'},\n\nPerkenalkan nama saya ${n || '[Nama Kamu]'}, NIM ${i || '[NIM]'}. Mohon maaf mengganggu waktunya. Saya bermaksud memohon izin tidak dapat mengikuti perkuliahan hari ini dikarenakan [Sebutkan Alasan]. Terima kasih atas pengertian Bapak/Ibu.`
    },
    bimbingan: {
      label: 'Bimbingan',
      getContent: (l, n, i) => `Selamat pagi/siang Bapak/Ibu ${l || '[Nama Dosen]'},\n\nSaya ${n || '[Nama Kamu]'}, NIM ${i || '[NIM]'}. Mohon maaf mengganggu waktunya. Apabila Bapak/Ibu memiliki waktu luang, saya bermaksud untuk berkonsultasi terkait progres [Sebutkan Topik]. Kira-kira kapan saya bisa menemui Bapak/Ibu? Terima kasih.`
    },
    revisi: {
      label: 'Kirim Revisi',
      getContent: (l, n, i) => `Selamat pagi/siang Bapak/Ibu ${l || '[Nama Dosen]'},\n\nSaya ${n || '[Nama Kamu]'}, NIM ${i || '[NIM]'}. Berikut saya lampirkan hasil revisi tugas [Sebutkan Tugas] sesuai dengan arahan Bapak/Ibu sebelumnya. Mohon bimbingannya lebih lanjut. Terima kasih banyak.`
    },
    nilai: {
      label: 'Tanya Nilai',
      getContent: (l, n, i) => `Selamat pagi/siang Bapak/Ibu ${l || '[Nama Dosen]'},\n\nPerkenalkan saya ${n || '[Nama Kamu]'}, NIM ${i || '[NIM]'}. Mohon maaf mengganggu Bapak/Ibu. Saya ingin mengonfirmasi terkait nilai mata kuliah [Sebutkan Matkul] yang belum muncul. Mohon arahannya, Bapak/Ibu. Terima kasih.`
    }
  };

  const finalMessage = useMemo(() => {
    return templates[type].getContent(lecturerName, studentName, studentID);
  }, [type, lecturerName, studentName, studentID]);

  const handleCopy = () => {
    navigator.clipboard.writeText(finalMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendWA = () => {
    if (!phone) return alert('Masukkan nomor WhatsApp dosen!');

    // Clean and format phone number (08xxx -> 628xxx)
    let cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.startsWith('0')) {
      cleanPhone = '62' + cleanPhone.substring(1);
    }

    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(finalMessage)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6 animate-in fade-in duration-500">
      <h2 className="text-2xl font-bold flex items-center gap-2">
        <MessageSquare className="text-yellow-500" /> HaloDosen
      </h2>

      {/* Skenario Selector */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {(Object.keys(templates) as MessageType[]).map((t) => (
          <button
            key={t}
            onClick={() => setType(t)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap border transition-all ${
              type === t
              ? 'bg-green-600 border-green-600 text-white shadow-lg shadow-green-500/20'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400'
            }`}
          >
            {templates[t].label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Inputs */}
        <div className="space-y-4">
          <div className="relative">
            <User className="absolute left-3 top-3.5 text-slate-400" size={18} />
            <input
              value={lecturerName} onChange={(e) => setLecturerName(e.target.value)}
              placeholder="Nama Dosen" className="input-with-icon"
            />
          </div>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <GraduationCap className="absolute left-3 top-3.5 text-slate-400" size={18} />
              <input
                value={studentName} onChange={(e) => setStudentName(e.target.value)}
                placeholder="Nama Kamu" className="input-with-icon"
              />
            </div>
            <input
              value={studentID} onChange={(e) => setStudentID(e.target.value)}
              placeholder="NIM" className="w-1/3 p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 outline-none focus:ring-2 ring-green-500 text-sm"
            />
          </div>
          <div className="relative">
            <Phone className="absolute left-3 top-3.5 text-slate-400" size={18} />
            <input
              type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
              placeholder="No. WhatsApp (08...)" className="input-with-icon"
            />
          </div>
        </div>

        {/* Preview Area */}
        <div className="relative group">
          <div className="h-full min-h-[180px] p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm leading-relaxed whitespace-pre-wrap italic text-slate-600 dark:text-slate-400">
            {finalMessage}
          </div>
          <button
            onClick={handleCopy}
            className="absolute top-3 right-3 p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:text-green-500 transition-all"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
          </button>
        </div>
      </div>

      <button
        onClick="handleSendWA"
        className="w-full py-4 bg-green-600 hover:bg-green-700 text-white rounded-2xl font-bold flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-xl shadow-green-500/20"
      >
        <Send size={20} /> Kirim WhatsApp
      </button>

      <p className="text-[10px] text-center text-slate-400 uppercase tracking-widest">
        Pesan akan dikirim langsung tanpa menyimpan nomor kontak
      </p>
    </div>
  );
};

export default HaloLecturer;

// CSS Helper
// .input-with-icon { @apply w-full p-3 pl-10 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 outline-none focus:ring-2 ring-green-500 transition-all text-sm; }