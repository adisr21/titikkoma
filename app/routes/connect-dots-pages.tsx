import type { Route } from "./+types/connect-dots-pages";
import ConnectDots from "~/pages/ConnectDots";
import Sidebar from "~/components/Sidebar";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Connect Dots - Titikkoma" },
    { name: "description", content: "Selesaikan masalah dengan menghubungkan titik-titik yang tersebar!" },
  ];
}

export default function ConnectDotsPage() {
  return (
    <div className="flex min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200">
      <Sidebar />
      <div className="flex-1 p-6">
        <h2 className="text-2xl font-bold mb-4">
          Connect Dots
        </h2>
        <ConnectDots />
      </div>
    </div>
  );
}