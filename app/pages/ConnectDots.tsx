import React, { useRef, useEffect, useState } from 'react';
import { RefreshCw, BrainCircuit, CheckCircle2 } from 'lucide-react';

interface Point {
  x: number; y: number; color: string; id: number; pairId: number;
}

interface Path {
  points: { x: number; y: number }[];
  color: string;
}

const COLORS = ['#ef4444', '#3b82f6', '#10b981'];

// Fungsi untuk mengecek apakah dua segmen garis (A-B) dan (C-D) berpotongan
const checkIntersection = (
  p1: { x: number; y: number },
  p2: { x: number; y: number },
  p3: { x: number; y: number },
  p4: { x: number; y: number }
) => {
  const det = (p2.x - p1.x) * (p4.y - p3.y) - (p4.x - p3.x) * (p2.y - p1.y);
  if (det === 0) return false; // Paralel

  const lambda = ((p4.y - p3.y) * (p4.x - p1.x) + (p3.x - p4.x) * (p4.y - p1.y)) / det;
  const gamma = ((p1.y - p2.y) * (p4.x - p1.x) + (p2.x - p1.x) * (p4.y - p1.y)) / det;

  return (0 < lambda && lambda < 1) && (0 < gamma && gamma < 1);
};

const ConnectDots: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dots, setDots] = useState<Point[]>([]);
  const [paths, setPaths] = useState<Path[]>([]);
  const [currentPath, setCurrentPath] = useState<{ x: number; y: number }[]>([]);
  const [activeColor, setActiveColor] = useState<string | null>(null);
  const [isWin, setIsWin] = useState(false);
  const [isLose, setIsLose] = useState(false);

  const initGame = () => {
    const newDots: Point[] = [];
    const size = 350; // Sesuaikan dengan width canvas
    COLORS.forEach((color, index) => {
      for (let i = 0; i < 2; i++) {
        newDots.push({
          x: Math.random() * (size - 100) + 50,
          y: Math.random() * (size - 100) + 50,
          color,
          id: index * 2 + i,
          pairId: index
        });
      }
    });
    setDots(newDots);
    setPaths([]);
    setIsLose(false);
    setIsWin(false);
  };

  useEffect(() => { initGame(); }, []);

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const drawLine = (points: { x: number; y: number }[], color: string) => {
      if (points.length < 2) return;
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }
      ctx.strokeStyle = color;
      ctx.lineWidth = 10;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();
    };

    paths.forEach(p => drawLine(p.points, p.color));
    if (activeColor) drawLine(currentPath, activeColor);

    dots.forEach(dot => {
      ctx.beginPath();
      ctx.arc(dot.x, dot.y, 18, 0, Math.PI * 2);
      ctx.fillStyle = dot.color;
      ctx.fill();
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 4;
      ctx.stroke();
    });
  };

  useEffect(() => { draw(); }, [dots, paths, currentPath, activeColor]);

  const getCoordinates = (e: any) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const handleStart = (e: any) => {
    const { x, y } = getCoordinates(e);
    // Cari apakah klik mengenai salah satu titik
    const startDot = dots.find(d => Math.sqrt((d.x - x)**2 + (d.y - y)**2) < 25);

    if (startDot) {
      setActiveColor(startDot.color);
      // Mulai jalur tepat dari tengah titik
      setCurrentPath([{ x: startDot.x, y: startDot.y }]);
      setPaths(prev => prev.filter(p => p.color !== startDot.color));
    }
  };

  const handleMove = (e: any) => {
    if (!activeColor) return;
    const { x, y } = getCoordinates(e);

    // OPTIMASI: Hanya simpan titik jika jarak geser > 3px untuk performa
    const lastPoint = currentPath[currentPath.length - 1];
    const dist = Math.sqrt((x - lastPoint.x)**2 + (y - lastPoint.y)**2);

    if (dist > 3) {
      setCurrentPath(prev => [...prev, { x, y }]);
    }
  };

  const handleEnd = (e: any) => {
  if (!activeColor || currentPath.length < 2) {
    setActiveColor(null);
    setCurrentPath([]);
    return;
  }

  const { x, y } = getCoordinates(e.changedTouches ? e.changedTouches[0] : e);

  const targetDot = dots.find(d =>
    d.color === activeColor &&
    Math.sqrt((d.x - x)**2 + (d.y - y)**2) < 35 &&
    Math.sqrt((d.x - currentPath[0].x)**2 + (d.y - currentPath[0].y)**2) > 20
  );

  if (targetDot) {
    const finalPoints = [...currentPath, { x: targetDot.x, y: targetDot.y }];

    // --- LOGIKA DETEKSI TABRAKAN ---
    let isIntersecting = false;

    // Cek jalur baru ini terhadap semua jalur yang sudah 'finish' di screen
    for (const existingPath of paths) {
      // Bandingkan setiap segmen di jalur baru (i)
      for (let i = 0; i < finalPoints.length - 1; i++) {
        // Dengan setiap segmen di jalur lama (j)
        for (let j = 0; j < existingPath.points.length - 1; j++) {
          if (checkIntersection(
            finalPoints[i], finalPoints[i+1],
            existingPath.points[j], existingPath.points[j+1]
          )) {
            isIntersecting = true;
            break;
          }
        }
        if (isIntersecting) break;
      }
      if (isIntersecting) break;
    }

    if (isIntersecting) {
      // JIKA TABRAKAN: Munculkan alert dan jangan simpan garisnya
      setIsLose(true);
    } else {
      // JIKA AMAN: Simpan ke paths
      const newPaths = [...paths, { points: finalPoints, color: activeColor }];
      setPaths(newPaths);

      if (newPaths.length === COLORS.length) {
        setIsWin(true);
      }
    }
  }

  setActiveColor(null);
  setCurrentPath([]);
};

  return (
    <div className="max-w-xl mx-auto p-6 bg-white dark:bg-slate-900 rounded-2xl shadow-lg select-none">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <BrainCircuit className="text-blue-500" /> Connect Dots
        </h2>
        <button onClick={initGame} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
          <RefreshCw size={20} />
        </button>
      </div>

      <div className="relative touch-none flex justify-center">
        <canvas
          ref={canvasRef}
          width={350}
          height={350}
          onMouseDown={handleStart}
          onMouseMove={handleMove}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          onTouchStart={handleStart}
          onTouchMove={handleMove}
          onTouchEnd={handleEnd}
          className="bg-white dark:bg-slate-950 rounded-[2.5rem] border-2 border-slate-200 dark:border-slate-800 shadow-xl cursor-crosshair w-full max-w-[350px]"
        />

        {isWin && (
          <div className="absolute inset-0 bg-emerald-500/90 rounded-[2.5rem] flex flex-col items-center justify-center text-white animate-in zoom-in duration-300 z-10">
             <CheckCircle2 size={64} className="mb-4" />
             <h3 className="text-3xl font-black italic">BERHASIL!</h3>
             <p className="mt-2 text-sm opacity-90 font-medium tracking-wide">Logika kamu mantap.</p>
             <button onClick={initGame} className="mt-8 px-8 py-3 bg-white text-emerald-600 rounded-2xl font-black shadow-lg hover:scale-105 transition-transform active:scale-95">
               Main Lagi
             </button>
          </div>
        )}
        { isLose && (
          <div className="absolute inset-0 bg-red-500/90 rounded-[2.5rem] flex flex-col items-center justify-center text-white animate-in zoom-in duration-300 z-10">
             <CheckCircle2 size={64} className="mb-4" />
             <h3 className="text-3xl font-black italic">KALAH!</h3>
             <p className="mt-2 text-sm opacity-90 font-medium tracking-wide">Garis kamu bersilangan.</p>
             <button onClick={initGame} className="mt-8 px-8 py-3 bg-white text-red-600 rounded-2xl font-black shadow-lg hover:scale-105 transition-transform active:scale-95">
               Coba Lagi
             </button>
          </div>
        )}
      </div>

      <div className="bg-blue-50 dark:bg-blue-500/10 p-4 rounded-2xl border border-blue-100 dark:border-blue-900/30">
        <p className="text-center text-xs text-blue-600 dark:text-blue-400 font-medium">
          💡 Hubungkan titik warna yang sama tanpa saling silang!
        </p>
      </div>
    </div>
  );
};

export default ConnectDots;