import type { Route } from "./+types/group-picker-pages";
import GroupPicker from "../pages/GroupPicker";
import Sidebar from "~/components/Sidebar";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "AdilKelompok - Titikkoma" },
    { name: "description", content: "Bagi kelompok secara adil dengan AdilKelompok!" },
  ];
}

export default function GroupPickerPage() {
  return (
    <div className="flex min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200">
      <Sidebar />
      <GroupPicker />
    </div>
  );
}