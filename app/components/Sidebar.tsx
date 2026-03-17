import { useState } from "react";
import { Link, NavLink } from "react-router";
import { Hash, Home, Users, Timer, FileText, Quote, MessageSquare } from "lucide-react";

export default function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* DESKTOP SIDEBAR */}
      <aside
        className={`fixed md:static top-0 left-0 h-350 w-64 bg-gray-900 text-white transform transition-transform duration-300 z-40
        ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <nav className="p-4 mt-16 space-y-4 border-r border-gray-700">
          <NavItem to="/" icon={<Home size={18} />} label="Home" />
          <NavItem to="/group-picker" icon={<Users size={18} />} label="Group Picker" />
          <NavItem to="/deadline-widget" icon={<Timer size={18} />} label="Deadline Widget" />
          <NavItem to="/paraphrase-checker" icon={<FileText size={18} />} label="Paraphrase Checker" />
          <NavItem to="/citation-generator" icon={<Quote size={18} />} label="Citation Generator" />
          <NavItem to="/halo-lecturer" icon={<MessageSquare size={18} />} label="Halo Lecturer" />
          <NavItem to="/word-counter" icon={<Hash size={18} />} label="Word Counter" />
        </nav>
        {/* footer */}
        <div className="absolute top-300 bottom-4 left-4 right-4 text-sm text-gray-400 text-center">
          Built by <a href="https://adisr21.xyz" className="text-blue-400 hover:underline" target="_blank">Adi Sukarno.</a>
        </div>
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
      </nav>
    </>
  );
}

function NavItem({
  to,
  icon,
  label,
}: {
  to: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Link
      to={to}
      className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-700"
    >
      {icon}
      {label}
    </Link>
  );
}

function BottomItem({
  to,
  icon,
}: {
  to: string;
  icon: React.ReactNode;
}) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `p-2 rounded-full ${isActive ? "bg-blue-500" : "hover:bg-gray-700"}`
      }
    >
      {icon}
    </NavLink>
  );
}