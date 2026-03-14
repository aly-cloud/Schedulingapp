import { useState, useEffect } from "react";
import { Task, TaskPriority, TaskDuration } from "../types/task";
import { storage } from "../utils/storage";
import { categorizeTasks } from "../utils/ai-helper";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Plus, Sparkles, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";

export function BrainDump() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  useEffect(() => {
    setTasks(storage.getTasks());
  }, []);

  const addTask = () => {
    if (!newTaskTitle.trim()) return;

    const task: Task = {
      id: Date.now().toString(),
      title: newTaskTitle,
      category: "other",
      priority: "medium",
      duration: "medium",
      estimatedMinutes: 60,
      isLongTerm: false,
      completed: false,
      createdAt: new Date(),
    };

    const updatedTasks = [...tasks, task];
    setTasks(updatedTasks);
    storage.saveTasks(updatedTasks);
    setNewTaskTitle("");
    toast.success("Task added!");
  };

  const aiOrganize = () => {
    const categorized = categorizeTasks(tasks);
    setTasks(categorized);
    storage.saveTasks(categorized);
    toast.success("Tasks organized with AI!");
  };

  const deleteTask = (id: string) => {
    const updatedTasks = tasks.filter(t => t.id !== id);
    setTasks(updatedTasks);
    storage.saveTasks(updatedTasks);
    setSelectedTask(null);
    toast.success("Task deleted");
  };

  const updateTask = (task: Task) => {
    const updatedTasks = tasks.map(t => t.id === task.id ? task : t);
    setTasks(updatedTasks);
    storage.saveTasks(updatedTasks);
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      study: "from-blue-400 to-blue-600",
      work: "from-purple-400 to-purple-600",
      health: "from-green-400 to-green-600",
      passion: "from-pink-400 to-pink-600",
      chores: "from-yellow-400 to-yellow-600",
      social: "from-orange-400 to-orange-600",
      personal: "from-teal-400 to-teal-600",
      other: "from-gray-400 to-gray-600",
    };
    return colors[category] || colors.other;
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-6">
        <h2 className="text-3xl font-bold mb-2 text-purple-900">Brain Dump</h2>
        <p className="text-gray-600 mb-4">
          Add all your tasks - AI will help organize them!
        </p>

        {/* Input */}
        <div className="flex gap-2 mb-4 max-w-2xl">
          <Input
            placeholder="Add a task..."
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addTask()}
            className="flex-1 h-12 text-lg"
          />
          <Button onClick={addTask} size="lg" className="bg-purple-600 hover:bg-purple-700 h-12 px-6">
            <Plus className="w-5 h-5 mr-2" />
            Add Task
          </Button>
        </div>

        {/* AI Organize Button */}
        {tasks.length > 0 && (
          <Button
            onClick={aiOrganize}
            size="lg"
            className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 mb-4"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Organize
          </Button>
        )}
      </div>

      {/* Task Bubbles */}
      <div className="relative min-h-[600px] bg-white rounded-xl shadow-lg p-8">
        <AnimatePresence>
          {tasks.map((task, index) => {
            const radius = 200;
            const angle = (index * 360) / tasks.length;
            const x = Math.cos((angle * Math.PI) / 180) * radius;
            const y = Math.sin((angle * Math.PI) / 180) * radius;

            return (
              <motion.div
                key={task.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: 1,
                  opacity: 1,
                  x: tasks.length > 1 ? x : 0,
                  y: tasks.length > 1 ? y : 0,
                }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                drag
                dragConstraints={{ left: -300, right: 300, top: -300, bottom: 300 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedTask(task)}
                className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer`}
              >
                <div
                  className={`
                    px-6 py-4 rounded-full shadow-lg
                    bg-gradient-to-br ${getCategoryColor(task.category)}
                    text-white font-medium text-base
                    min-w-[140px] max-w-[200px]
                    text-center
                    border-2 border-white/30
                  `}
                >
                  {task.title}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Task Detail Sheet */}
      {selectedTask && (
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          className="fixed inset-x-0 bottom-0 bg-white rounded-t-3xl shadow-2xl p-8 max-w-2xl mx-auto border-t-4 border-purple-500"
        >
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-2xl font-semibold">{selectedTask.title}</h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => deleteTask(selectedTask.id)}
              className="text-red-500 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-6 h-6" />
            </Button>
          </div>

          <div className="space-y-6">
            {/* Category */}
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">
                Category
              </label>
              <select
                value={selectedTask.category}
                onChange={(e) =>
                  updateTask({ ...selectedTask, category: e.target.value as any })
                }
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="study">Study</option>
                <option value="work">Work</option>
                <option value="health">Health</option>
                <option value="passion">Passion</option>
                <option value="chores">Chores</option>
                <option value="social">Social</option>
                <option value="personal">Personal</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Priority */}
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">
                Priority
              </label>
              <div className="flex gap-2">
                {(["high", "medium", "low"] as TaskPriority[]).map((p) => (
                  <button
                    key={p}
                    onClick={() => updateTask({ ...selectedTask, priority: p })}
                    className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                      selectedTask.priority === p
                        ? "bg-purple-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Duration */}
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">
                Estimated Time
              </label>
              <Input
                type="number"
                value={selectedTask.estimatedMinutes}
                onChange={(e) =>
                  updateTask({
                    ...selectedTask,
                    estimatedMinutes: parseInt(e.target.value) || 0,
                  })
                }
                min={5}
                step={5}
                placeholder="Minutes"
              />
            </div>

            {/* Long-term toggle */}
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                Long-term goal
              </label>
              <input
                type="checkbox"
                checked={selectedTask.isLongTerm}
                onChange={(e) =>
                  updateTask({ ...selectedTask, isLongTerm: e.target.checked })
                }
                className="w-5 h-5 text-purple-600 rounded"
              />
            </div>

            <Button
              onClick={() => setSelectedTask(null)}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              Done
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}