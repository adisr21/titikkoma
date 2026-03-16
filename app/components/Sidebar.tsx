import { useState } from "react";
import { Link } from "react-router";
import { Button } from "./Button";

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
                <nav className="p-4 mt-16 space-y-4">
                    <Link to="/" className="block px-3 py-2 rounded hover:bg-gray-700">
                        Home
                    </Link>
                    <Link to="/group-picker" className="block px-3 py-2 rounded hover:bg-gray-700">
                        Group Picker
                    </Link>
                </nav>
            </aside>
        </div>

    );
}