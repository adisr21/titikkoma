import React, { useState } from "react";
import { Users, Shuffle } from "lucide-react";

const GroupPicker: React.FC = () => {
  const [rawNames, setRawNames] = useState<string>("");
  const [groupCount, setGroupCount] = useState<number>(2);
  const [resultGroups, setResultGroups] = useState<string[][]>([]);

  const generateGroups = () => {
    const names = rawNames
      .split("\n")
      .map((n) => n.trim())
      .filter((n) => n !== "");

    if (names.length < groupCount) {
      alert("Nama kurang dari jumlah kelompok!");
      return;
    }

    // Shuffle (Fisher-Yates)
    for (let i = names.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [names[i], names[j]] = [names[j], names[i]];
    }

    const groups: string[][] = Array.from({ length: groupCount }, () => []);

    names.forEach((name, i) => {
      groups[i % groupCount].push(name);
    });

    setResultGroups(groups);
  };

  return (
    <div className="flex-1 p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold flex items-center gap-2">
        <Users className="text-blue-500" /> AdilKelompok
      </h2>

      <textarea
        value={rawNames}
        onChange={(e) => setRawNames(e.target.value)}
        placeholder="Masukkan nama per baris..."
        className="w-full h-40 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 outline-none focus:ring-2 ring-blue-500 transition-all"
      />

      <div className="flex gap-4 items-center mt-4">
        <input
          type="number"
          value={groupCount}
          onChange={(e) => setGroupCount(Number(e.target.value))}
          className="w-24 p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800"
        />

        <button
          onClick={generateGroups}
          className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 flex justify-center items-center gap-2 transition-all active:scale-95 shadow-lg shadow-blue-500/20"
        >
          <Shuffle size={18} /> Bagi Kelompok
        </button>
      </div>

      {resultGroups.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {resultGroups.map((group, i) => (
            <div
              key={i}
              className="p-4 rounded-2xl border border-blue-100 dark:border-blue-900/30 bg-blue-50/50 dark:bg-blue-500/5"
            >
              <h4 className="font-bold text-blue-600 mb-2">
                Kelompok {i + 1}
              </h4>

              <ul className="text-sm space-y-1">
                {group.map((m, idx) => (
                  <li key={idx}>• {m}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GroupPicker;