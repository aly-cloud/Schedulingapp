import { useState, useEffect } from "react";
import { Task } from "../types/task";
import { storage } from "../utils/storage";
import { prioritizeTasks, groupTasksByCategory } from "../utils/ai-helper";
import { Checkbox } from "../components/ui/checkbox";
import { Badge } from "../components/ui/badge";
import { CheckCircle2, Circle, Clock } from "lucide-react";

export function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<"all" | "short-term" | "long-term">("all");

  useEffect(() => {
    const allTasks = storage.getTasks();
    setTasks(prioritizeTasks(allTasks));
  }, []);

  const toggleTask = (id: string) => {
    const updatedTasks = tasks.map((t) =>
      t.id === id ? { ...t, completed: !t.completed } : t
    );
    setTasks(updatedTasks);
    storage.saveTasks(updatedTasks);
  };

  const filteredTasks = tasks.filter((t) => {
    if (filter === "short-term") return !t.isLongTerm;
    if (filter === "long-term") return t.isLongTerm;
    return true;
  });

  const grouped = groupTasksByCategory(filteredTasks);

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      study: "bg-blue-100 text-blue-800",
      work: "bg-purple-100 text-purple-800",
      health: "bg-green-100 text-green-800",
      passion: "bg-pink-100 text-pink-800",
      chores: "bg-yellow-100 text-yellow-800",
      social: "bg-orange-100 text-orange-800",
      personal: "bg-teal-100 text-teal-800",
      other: "bg-gray-100 text-gray-800",
    };
    return colors[category] || colors.other;
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      high: "bg-red-100 text-red-800 border-red-300",
      medium: "bg-orange-100 text-orange-800 border-orange-300",
      low: "bg-blue-100 text-blue-800 border-blue-300",
    };
    return colors[priority];
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-4 text-purple-900">My Tasks</h2>

      {/* Filter */}
      <div className="flex gap-3 mb-6">
        {(["all", "short-term", "long-term"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              filter === f
                ? "bg-purple-600 text-white shadow-md"
                : "bg-white text-gray-700 hover:bg-purple-50 shadow-sm"
            }`}
          >
            {f === "all" ? "All Tasks" : f === "short-term" ? "Short-term" : "Long-term"}
          </button>
        ))}
      </div>

      {/* Grouped Tasks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Array.from(grouped.entries()).map(([category, categoryTasks]) => (
          <div key={category} className="bg-white rounded-xl shadow-md p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2 text-lg">
              <Badge className={`${getCategoryColor(category)} text-base px-3 py-1`}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </Badge>
              <span className="text-sm text-gray-500">
                ({categoryTasks.filter((t) => !t.completed).length} pending)
              </span>
            </h3>

            <div className="space-y-3">
              {categoryTasks.map((task) => (
                <div
                  key={task.id}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    task.completed
                      ? "bg-gray-50 border-gray-200 opacity-60"
                      : `${getPriorityColor(task.priority)} border-2`
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="pt-1">
                      <Checkbox
                        checked={task.completed}
                        onCheckedChange={() => toggleTask(task.id)}
                      />
                    </div>

                    <div className="flex-1">
                      <p
                        className={`font-medium ${
                          task.completed ? "line-through text-gray-500" : ""
                        }`}
                      >
                        {task.title}
                      </p>

                      <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                        <Clock className="w-3 h-3" />
                        <span>{task.estimatedMinutes} min</span>
                        {task.isLongTerm && (
                          <Badge variant="outline" className="text-xs">
                            Long-term
                          </Badge>
                        )}
                      </div>

                      {task.deadline && (
                        <p className="text-xs text-gray-500 mt-1">
                          Due: {task.deadline.toLocaleDateString()}
                        </p>
                      )}
                    </div>

                    <div className="pt-1">
                      {task.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      ) : (
                        <Circle className="w-5 h-5 text-gray-300" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {grouped.size === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p>No tasks yet. Start by adding some in the Brain Dump!</p>
          </div>
        )}
      </div>
    </div>
  );
}