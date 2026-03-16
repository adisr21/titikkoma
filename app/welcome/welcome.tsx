import { Link } from "react-router";
import { Users, Home, Timer, FileText, Quote } from "lucide-react";

export function Welcome() {
  return (
    <div className="max-w-5xl mx-auto space-y-10">

      {/* Header */}
      <header className="space-y-2">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Home className="text-blue-500" size={28} />
          Titikkoma Tools
        </h1>
        <p className="text-gray-500">
          Simple productivity tools for writing, study, and teamwork.
        </p>
      </header>

      {/* Tools Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

        <ToolCard
          title="Group Picker"
          description="Randomly divide names into fair groups."
          icon={<Users className="text-blue-500" />}
          href="/group-picker"
        />

        <ToolCard
          title="Deadline Tracker"
          description="Track upcoming deadlines and tasks."
          icon={<Timer className="text-red-500" />}
          href="/deadline-widget"
        />

        <ToolCard
          title="Paraphrase Checker"
          description="Check similarity between two texts."
          icon={<FileText className="text-green-500" />}
          href="/paraphrase-checker"
        />

        <ToolCard
          title="Citation Generator"
          description="Generate citations in various formats."
          icon={<Quote className="text-purple-500" />}
          href="/citation-generator"
        />

      </div>
    </div>
  );
}

function ToolCard({
  title,
  description,
  icon,
  href,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
}) {
  return (
    <Link
      to={href}
      className="group border rounded-xl p-5 hover:shadow-lg transition"
    >
      <div className="flex items-center gap-3 mb-3">
        {icon}
        <h3 className="font-semibold">{title}</h3>
      </div>

      <p className="text-sm text-gray-500">{description}</p>
    </Link>
  );
}