import type { Route } from "./+types/deadline-widget-pages";
import DeadlineWidget from "../pages/DeadlineWidget";
import Sidebar from "~/components/Sidebar";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Deadline Widget - Titikkoma" },
    { name: "description", content: "Atur deadline tugasmu dengan mudah menggunakan Deadline Widget." },
  ];
}

export default function DeadlineWidgetPage() {
  return (
    <div className="flex min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 max-w-full">
      <Sidebar />
      <DeadlineWidget />
    </div>
  );
}