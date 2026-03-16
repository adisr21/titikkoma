import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";
import Sidebar from "~/components/Sidebar";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Titikkoma Tools" },
    { name: "description", content: "Useful writing and productivity tools by Titikkoma." },
  ];
}

export default function Home() {
  return (
    <div className="flex min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200">
      <Sidebar />

      <main className="flex-1 p-6">
        <Welcome />
      </main>
    </div>
  );
}