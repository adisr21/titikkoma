import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router";
import { Hash, Home, Users, Timer, FileText, Quote, MessageSquare, Moon, Sun } from "lucide-react";

export default function Sidebar() {
  const [open, setOpen] = useState(false);

  // State untuk tema
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") === "dark" ||
             (!localStorage.getItem("theme") && window.matchMedia("(prefers-color-scheme: dark)").matches);
    }
    return true;
  });

  // Effect untuk update class di document element
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);
  return (
    <>
      {/* DESKTOP SIDEBAR */}
      <aside
        className={`fixed md:static top-0 left-0 h-full w-64 transition-all duration-300 z-40 border-r
        ${isDark ? "bg-slate-900 text-white border-slate-800" : "bg-white text-slate-900 border-slate-200"}
        ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <nav className="p-4 mt-16 space-y-4 border-r border-gray-700">
          <NavItem to="/" icon={<Home size={18} />} label="Home" isDark={isDark} />
          <NavItem to="/group-picker" icon={<Users size={18} />} label="Group Picker" isDark={isDark} />
          <NavItem to="/deadline-widget" icon={<Timer size={18} />} label="Deadline Widget" isDark={isDark} />
          <NavItem to="/paraphrase-checker" icon={<FileText size={18} />} label="Paraphrase Checker" isDark={isDark} />
          <NavItem to="/citation-generator" icon={<Quote size={18} />} label="Citation Generator" isDark={isDark} />
          <NavItem to="/halo-lecturer" icon={<MessageSquare size={18} />} label="Halo Lecturer" isDark={isDark} />
          <NavItem to="/word-counter" icon={<Hash size={18} />} label="Word Counter" isDark={isDark} />
          <NavItem to="/connect-dots" icon={<MessageSquare size={18} />} label="Connect Dots" isDark={isDark} />

          <hr className={`my-4 ${isDark ? "border-slate-800" : "border-slate-100"}`} />

          {/* THEME TOGGLE BUTTON SIDEBAR */}
          <button
            onClick={toggleTheme}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors
            ${isDark ? "hover:bg-slate-800 text-yellow-400" : "hover:bg-slate-100 text-blue-600"}`}
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
            <span className={isDark ? "text-white" : "text-slate-900"}>
              {isDark ? "Light Mode" : "Dark Mode"}
            </span>
          </button>
        </nav>
      </aside>

      {/* MOBILE FLOATING BOTTOM NAV */}
      <nav className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white rounded-full shadow-lg px-6 py-3 flex gap-6 items-center mt-20">
        <BottomItem to="/" icon={<Home size={20} />} />
        <BottomItem to="/group-picker" icon={<Users size={20} />} />
        <BottomItem to="/deadline-widget" icon={<Timer size={20} />} />
        <BottomItem to="/paraphrase-checker" icon={<FileText size={20} />} />
        <BottomItem to="/citation-generator" icon={<Quote size={20} />} />
        <BottomItem to="/halo-lecturer" icon={<MessageSquare size={20} />} />
        <BottomItem to="/word-counter" icon={<Hash size={20} />} />
        {/* Toggle Theme Mobile diletakkan di tengah atau ujung */}
        <button onClick={toggleTheme} className={`p-2 rounded-full ${isDark ? "text-yellow-400" : "text-blue-600"}`}>
           {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>

      </nav>
    </>
  );
}

function NavItem({ to, icon, label, isDark }: { to: string; icon: React.ReactNode; label: string; isDark: boolean }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
          isActive
            ? (isDark ? "bg-blue-600 text-white" : "bg-blue-50 text-blue-600 font-bold")
            : (isDark ? "hover:bg-slate-800 text-slate-400" : "hover:bg-slate-100 text-slate-600")
        }`
      }
    >
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </NavLink>
  );
}

function BottomItem({ to, icon }: { to: string; icon: React.ReactNode }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `p-2.5 rounded-xl transition-all ${isActive ? "bg-blue-600 text-white shadow-lg shadow-blue-500/50" : "text-slate-400"}`
      }
    >
      {icon}
    </NavLink>
  );
}
