import { Outlet, Link, useLocation } from "react-router";
import { Brain, Calendar, ListTodo, Settings } from "lucide-react";

export function Layout() {
  const location = useLocation();

  const navItems = [
    { path: "/", icon: Brain, label: "Brain Dump" },
    { path: "/tasks", icon: ListTodo, label: "Tasks" },
    { path: "/schedule", icon: Calendar, label: "Schedule" },
    { path: "/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <div className="flex h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-white border-r border-purple-200 shadow-lg flex flex-col">
        <div className="p-6 border-b border-purple-200">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Schedule AI
          </h1>
          <p className="text-sm text-gray-600 mt-1">Your intelligent day planner</p>
        </div>

        <nav className="flex-1 p-4">
          <div className="space-y-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md"
                      : "text-gray-700 hover:bg-purple-50 hover:text-purple-600"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}