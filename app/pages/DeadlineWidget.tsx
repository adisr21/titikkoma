import React, { useState, useEffect } from "react";
import { Timer, Plus, Trash2 } from "lucide-react";

type Task = {
  id: number;
  name: string;
  deadline: string;
};

const DeadlineWidget: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const stored = localStorage.getItem("tt_tasks");
    return stored ? JSON.parse(stored) : [];
  });

  const [name, setName] = useState<string>("");
  const [date, setDate] = useState<string>("");

  // Load from localStorage (client only)
  useEffect(() => {
    const stored = localStorage.getItem("tt_tasks");
    if (stored) {
      setTasks(JSON.parse(stored));
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("tt_tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (!name || !date) return;

    const newTask: Task = {
      id: Date.now(),
      name,
      deadline: date,
    };

    const sortedTasks = [...tasks, newTask].sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());

    setTasks(sortedTasks);
    setName("");
    setDate("");
  };

  const deleteBtn = (id: number) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  return (
    <div className="flex-1 p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold flex items-center gap-2">
        <Timer className="text-red-500" /> H-Berapa?
      </h2>

      <div className="flex flex-col md:flex-row gap-3">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Tugas apa?"
          className="flex-1 p-3 rounded-xl border dark:border-slate-800 bg-slate-50 dark:bg-slate-950"
        />

        <input
          type="datetime-local"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="p-3 rounded-xl border dark:border-slate-800 bg-slate-50 dark:bg-slate-950"
        />

        <button
          onClick={addTask}
          className="bg-red-500 text-white px-6 py-3 rounded-xl hover:bg-red-600 transition-all active:scale-95"
        >
          <Plus />
        </button>
      </div>

      <div className="space-y-3 mt-6">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="flex justify-between items-center p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border dark:border-slate-700"
          >
            <div>
              <p className="font-bold">{task.name}</p>
              <p className="text-xs text-slate-500">
                {new Date(task.deadline).toLocaleString()}
              </p>
            </div>

            <button
              onClick={() => deleteBtn(task.id)}
              className="text-red-400 hover:text-red-600 transition-colors"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeadlineWidget;