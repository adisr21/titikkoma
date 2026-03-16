import { useState } from "react";
import { Link } from "react-router";
import { Button } from "./Button";
import { Home, Users, Timer } from "lucide-react";

export default function Sidebar() {
    const [open, setOpen] = useState(false);

    return (
        <div className="flex">
            {/* Mobile button */}
            <Button
                className="md:hidden fixed top-4 left-4 z-50 bg-gray-800 text-white p-2 rounded"
                onClick={() => setOpen(!open)}
            >
                ☰
            </Button>

            {/* Overlay */}
            {open && (
                <div
                    className="fixed inset-0 bg-black/50 md:hidden"
                    onClick={() => setOpen(false)}
                ></div>
            )}
            {/* Sidebar */}
            <aside
                className={`fixed md:static top-0 left-0 h-full w-64 bg-gray-900 text-white transform transition-transform duration-300 z-40
                ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
            >
                <nav className="p-4 mt-16 space-y-4 border-t border-r border-gray-700">
                    <Link to="/" className="block px-3 py-2 rounded hover:bg-gray-700">
                        <Home className="inline-block mr-2" /> Home
                    </Link>
                    <Link to="/group-picker" className="block px-3 py-2 rounded hover:bg-gray-700">
                         <Users className="inline-block mr-2" /> Group Picker
                    </Link>
                    <Link to="/deadline-widget" className="block px-3 py-2 rounded hover:bg-gray-700">
                        <Timer className="inline-block mr-2" /> Deadline Widget
                    </Link>
                    <Link to="/paraphrase-checker" className="block px-3 py-2 rounded hover:bg-gray-700">
                        <Timer className="inline-block mr-2" /> Paraphrase Checker
                    </Link>
                </nav>
            </aside>
        </div>

    );
}