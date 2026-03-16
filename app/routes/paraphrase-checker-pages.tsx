import type { Route } from "./+types/paraphrase-checker-pages";
import ParaphraseChecker from "~/pages/ParaphraseChecker";
import Sidebar from "~/components/Sidebar";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Paraphrase Checker - Titikkoma" },
    { name: "description", content: "Periksa keaslian teks dengan Paraphrase Checker!" },
  ];
}

export default function ParaphraseCheckerPage() {
  return (
    <div className="flex min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200">
      <Sidebar />
      <ParaphraseChecker />
    </div>
  );
}