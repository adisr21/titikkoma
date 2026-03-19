import type { Route } from "./+types/spin-wheel-pages";
import SpinWheel from "~/pages/SpinWheel";
import Sidebar from "~/components/Sidebar";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Spin Wheel - Titikkoma" },
    { name: "description", content: "Putar roda keberuntungan dan temukan pemenangnya!" },
  ];
}

export default function SpinWheelPage() {
  return (
    <div className="flex min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200">
      <Sidebar />
      <div className="flex-1 p-6">
        <SpinWheel />
      </div>
    </div>
  );
}