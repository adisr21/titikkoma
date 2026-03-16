import type { Route } from "./+types/halo-lecturer-pages";
import HaloLecturer from "~/pages/HaloLecturer";
import Sidebar from "~/components/Sidebar";

export function meta({}: Route.MetaArgs) {
    return [
        { title: "Halo Dosen - Titikoma" },
        { name: "description", content: ""},
    ];
}

export default function HaloLecturerPage() {
    return (
        <div className="flex min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200">
            <Sidebar />
            <HaloLecturer />
        </div>
    );
}