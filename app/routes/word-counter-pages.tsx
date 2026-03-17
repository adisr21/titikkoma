import type { Route } from "./+types/word-counter-pages";
import WordCounter from "~/pages/WordCounter";
import Sidebar from "~/components/Sidebar";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Word Counter - Titikkoma" },
    { name: "description", content: "Hitung jumlah kata dengan mudah menggunakan Word Counter!" },
  ];
}

export default function WordCounterPage() {
  return (
    <div className="flex min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200">
      <Sidebar />
      <WordCounter />
    </div>
  );
}