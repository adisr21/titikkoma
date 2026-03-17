import React, { useEffect, useMemo, useState } from "react";
import { Users, Shuffle, Copy, Check, Share2, Link2 } from "lucide-react";
import { useSearchParams } from "react-router";
import { trackEvent } from "~/lib/analytics";

type SharePayload = {
  v: 1;
  groups: string[][];
};

const encodeSharePayload = (payload: SharePayload) => {
  const json = JSON.stringify(payload);
  const bytes = new TextEncoder().encode(json);
  let binary = "";

  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
};

const decodeSharePayload = (value: string): SharePayload | null => {
  try {
    const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
    const binary = atob(padded);
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    const payload = JSON.parse(new TextDecoder().decode(bytes)) as SharePayload;

    if (
      payload.v !== 1 ||
      !Array.isArray(payload.groups) ||
      payload.groups.some(
        (group) =>
          !Array.isArray(group) ||
          group.some((member) => typeof member !== "string")
      )
    ) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
};

const GroupPicker: React.FC = () => {
  const [rawNames, setRawNames] = useState<string>("");
  const [groupCount, setGroupCount] = useState<number>(2);
  const [resultGroups, setResultGroups] = useState<string[][]>([]);
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);
  const [shareError, setShareError] = useState<string>("");
  const [searchParams] = useSearchParams();

  const sharedPayload = useMemo(() => {
    const sharedValue = searchParams.get("share");
    return sharedValue ? decodeSharePayload(sharedValue) : null;
  }, [searchParams]);

  useEffect(() => {
    if (!sharedPayload) return;

    setResultGroups(sharedPayload.groups);
    setGroupCount(sharedPayload.groups.length);
    setRawNames(sharedPayload.groups.flat().join("\n"));
    trackEvent("group_share_opened", {
      groupCount: sharedPayload.groups.length,
      memberCount: sharedPayload.groups.flat().length,
    });
  }, [sharedPayload]);

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
    setCopied(false);
    setShared(false);
    setShareError("");
  };

  const shareUrl = useMemo(() => {
    if (typeof window === "undefined" || resultGroups.length === 0) return "";

    const payload = encodeSharePayload({ v: 1, groups: resultGroups });
    return `${window.location.origin}${window.location.pathname}?share=${payload}`;
  }, [resultGroups]);

  const handleCopyShareLink = async () => {
    if (!shareUrl) return;

    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setShared(false);
      setShareError("");
      trackEvent("group_share_clicked", {
        method: "copy_link",
        groupCount: resultGroups.length,
        memberCount: resultGroups.flat().length,
      });
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setShareError("Link gagal disalin. Coba bagikan manual.");
    }
  };

  const handleNativeShare = async () => {
    if (!shareUrl) return;

    if (!navigator.share) {
      await handleCopyShareLink();
      return;
    }

    try {
      await navigator.share({
        title: "Hasil AdilKelompok",
        text: "Ini hasil pembagian kelompok dari Titikkoma.",
        url: shareUrl,
      });

      setShared(true);
      setCopied(false);
      setShareError("");
      trackEvent("group_share_clicked", {
        method: "native_share",
        groupCount: resultGroups.length,
        memberCount: resultGroups.flat().length,
      });
      window.setTimeout(() => setShared(false), 2000);
    } catch {
      // Ignore cancellation so the flow stays quiet.
    }
  };

  return (
    <div className="flex-1 p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold flex items-center gap-2 mb-4">
        <Users className="text-blue-500" /> Group Picker
      </h2>
      <p className="text-gray-500 mb-6">
        Masukkan nama-nama yang ingin dibagi ke dalam kelompok, satu nama per baris. Tentukan jumlah kelompok, lalu klik "Bagi Kelompok" untuk melihat hasilnya!
      </p>

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

      {sharedPayload && (
        <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-500/10 dark:text-emerald-300">
          Link ini membuka hasil kelompok yang sudah dibagikan. Kamu bisa cek hasilnya atau acak ulang dengan daftar baru.
        </div>
      )}

      {resultGroups.length > 0 && (
        <div className="mt-6 pb-6">
          <div className="mb-4 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white/70 p-4 dark:border-slate-800 dark:bg-slate-900/70 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                Bagikan hasil kelompok ini ke teman sekelas
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Link akan membuka hasil yang sama persis tanpa perlu input ulang.
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                onClick={handleCopyShareLink}
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition-all hover:border-blue-300 hover:text-blue-600 dark:border-slate-700 dark:text-slate-200"
              >
                {copied ? <Check size={16} /> : <Link2 size={16} />}
                {copied ? "Link Tersalin" : "Salin Link"}
              </button>
              <button
                onClick={handleNativeShare}
                className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-blue-700"
              >
                {shared ? <Check size={16} /> : <Share2 size={16} />}
                {shared ? "Berhasil Dibagikan" : "Bagikan Hasil"}
              </button>
            </div>
          </div>

          {shareError && (
            <p className="mb-4 text-sm text-rose-500">{shareError}</p>
          )}

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {resultGroups.map((group, i) => (
              <div
                key={i}
                className="rounded-2xl border border-blue-100 bg-blue-50/50 p-4 dark:border-blue-900/30 dark:bg-blue-500/5"
              >
                <h4 className="mb-2 font-bold text-blue-600">
                  Kelompok {i + 1}
                </h4>

                <ul className="space-y-1 text-sm">
                  {group.map((m, idx) => (
                    <li key={idx}>• {m}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupPicker;
