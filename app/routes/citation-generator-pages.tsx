import type { Route } from "./+types/citation-generator-pages";
import CitationGenerator from "~/pages/CitationGenerator";
import Sidebar from "~/components/Sidebar";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Citation Generator - Titikkoma" },
    { name: "description", content: "Buat kutipan dengan mudah menggunakan Citation Generator!" },
  ];
}

export default function CitationGeneratorPage() {
  return (
    <div className="flex min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200">
      <Sidebar />
      <CitationGenerator />
    </div>
  );
}