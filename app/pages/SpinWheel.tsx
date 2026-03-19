import React, { useState, useRef, useEffect } from 'react';
import { RotateCw, Trash2, Plus, Trophy, Info } from 'lucide-react';

interface Winner {
  name: string;
  index: number;
}

const SpinWheel: React.FC = () => {
  const [names, setNames] = useState<string[]>(['Budi', 'Ani', 'Cici', 'Dedi', 'Ega']);
  const [rawNames, setRawNames] = useState('');
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState<Winner | null>(null);
  const [rotation, setRotation] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 1. Fungsi Menggambar Roda
  const drawWheel = () => {
    const canvas = canvasRef.current;
    if (!canvas || names.length === 0) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = canvas.width / 2 - 10;
    const sliceAngle = (2 * Math.PI) / names.length;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    names.forEach((name, i) => {
      const angle = i * sliceAngle;

      // Gambar Potongan (Slice)
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, angle, angle + sliceAngle);
      ctx.fillStyle = `hsl(${(i * 360) / names.length}, 70%, 60%)`;
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.2)';
      ctx.stroke();

      // Gambar Teks Nama
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(angle + sliceAngle / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = 'white';
      ctx.font = 'bold 12px Inter, sans-serif';
      // Potong nama jika terlalu panjang
      const displayName = name.length > 12 ? name.substring(0, 10) + '..' : name;
      ctx.fillText(displayName, radius - 20, 5);
      ctx.restore();
    });

    // Titik Tengah Roda
    ctx.beginPath();
    ctx.arc(centerX, centerY, 15, 0, 2 * Math.PI);
    ctx.fillStyle = '#1e293b';
    ctx.fill();
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    ctx.stroke();
  };

  useEffect(() => {
    drawWheel();
  }, [names]);

  // 2. Logika Putar
  const spin = () => {
    if (isSpinning || names.length < 2) return;

    setIsSpinning(true);
    setWinner(null);

    // Putar minimal 5-10 kali + random derajat
    const extraDegree = Math.floor(Math.random() * 360);
    const totalRotation = rotation + (1800 + extraDegree);
    setRotation(totalRotation);

    // Hitung pemenang setelah animasi selesai (4 detik)
    setTimeout(() => {
      const actualDegree = totalRotation % 360;
      const sliceAngle = 360 / names.length;

      // Canvas menggambar mulai dari sudut 0 (kanan/jam 3)
      // Jarum kita ada di atas (jam 12 = 270 deg)
      // Rumus penyesuaian:
      const winningIndex = Math.floor((360 - (actualDegree % 360) + 270) % 360 / sliceAngle) % names.length;

      setWinner({
        name: names[winningIndex],
        index: winningIndex
      });
      setIsSpinning(false);
    }, 4000);
  };

  // 3. Logika Input & Hapus
  const handleBulkAdd = () => {
    const parsed = rawNames.split('\n').map(n => n.trim()).filter(n => n !== '');
    if (parsed.length < 2) {
      alert("Masukkan minimal 2 nama!");
      return;
    }
    setNames(parsed);
    setRawNames('');
    setRotation(0);
  };

  const removeWinner = () => {
    if (winner) {
      setNames(prev => prev.filter((_, i) => i !== winner.index));
      setWinner(null);
      setRotation(0);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white dark:bg-slate-900 rounded-2xl shadow-lg">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black italic tracking-tighter flex items-center gap-2">
          <RotateCw className="text-orange-500" /> Spin Wheel
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

        {/* SISI KIRI: VISUAL RODA */}
        <div className="flex flex-col items-center justify-center space-y-8">
          <div className="relative">
            {/* Indikator Jarum (Top) */}
            <div
              className="absolute -top-4 left-1/2 -translate-x-1/2 z-20 w-6 h-10 bg-red-600 shadow-xl"
              style={{ clipPath: 'polygon(50% 100%, 0 0, 100% 0)' }}
            ></div>

            <canvas
              ref={canvasRef}
              width={350}
              height={350}
              style={{
                transform: `rotate(${rotation}deg)`,
                transition: 'transform 4s cubic-bezier(0.15, 0, 0.15, 1)'
              }}
              className="rounded-full border-[10px] border-white dark:border-slate-800 shadow-[0_0_50px_rgba(0,0,0,0.1)] dark:shadow-none"
            />
          </div>

          <button
            onClick={spin}
            disabled={isSpinning || names.length < 2}
            className="w-full max-w-xs py-5 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-[2rem] font-black text-lg shadow-xl shadow-orange-500/30 active:scale-95 transition-all disabled:opacity-30 uppercase tracking-widest"
          >
            {isSpinning ? 'Mencari Pemenang...' : 'Putar Sekarang'}
          </button>
        </div>

        {/* SISI KANAN: INPUT & LIST */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block mb-3">
              Input Daftar Nama (Satu per baris)
            </label>
            <textarea
              value={rawNames}
              onChange={(e) => setRawNames(e.target.value)}
              placeholder="Contoh:&#10;Andi&#10;Budi&#10;Caca"
              className="w-full h-44 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:ring-2 ring-orange-500 outline-none resize-none text-sm transition-all"
            />
            <button
              onClick={handleBulkAdd}
              className="mt-3 w-full py-3 bg-slate-900 dark:bg-slate-800 text-white rounded-xl text-xs font-bold hover:bg-slate-800 dark:hover:bg-slate-700 transition-all uppercase tracking-wider"
            >
              Update Roda
            </button>
          </div>

          <div className="px-2">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 flex items-center gap-2">
              Peserta Aktif <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">{names.length}</span>
            </h4>
            <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
              {names.map((name, i) => (
                <div
                  key={i}
                  className="px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold shadow-sm flex items-center gap-2 animate-in fade-in slide-in-from-bottom-1"
                >
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: `hsl(${(i * 360) / names.length}, 70%, 60%)` }}></span>
                  {name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* POPUP PEMENANG */}
      {winner && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 backdrop-blur-md p-6 animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] text-center shadow-2xl border border-slate-200 dark:border-slate-800 max-w-sm w-full animate-in zoom-in duration-300">
            <div className="w-20 h-20 bg-yellow-100 dark:bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trophy size={40} className="text-yellow-500 animate-bounce" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Selamat Kepada</p>
            <h3 className="text-4xl font-black mt-2 mb-8 text-slate-900 dark:text-white break-words">
              {winner.name}
            </h3>

            <div className="space-y-3">
              <button
                onClick={removeWinner}
                className="w-full py-4 bg-orange-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-orange-700 transition-all shadow-lg shadow-orange-500/20 active:scale-95"
              >
                <Trash2 size={18} /> Hapus & Lanjut
              </button>
              <button
                onClick={() => setWinner(null)}
                className="w-full py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl font-bold hover:bg-slate-200 transition-all active:scale-95"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpinWheel;