import { Outlet, Link, useLocation } from "react-router";
import { Brain, Calendar, ListTodo, Settings, User } from "lucide-react";

export function Layout() {
  const location = useLocation();

  const navItems = [
    { path: "/", icon: Brain, label: "Dump" },
    { path: "/tasks", icon: ListTodo, label: "Tasks" },
    { path: "/schedule", icon: Calendar, label: "Schedule" },
    { path: "/context", icon: User, label: "Context" },
    { path: "/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-purple-200 px-4 py-3 shadow-sm">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Schedule AI
        </h1>
        <p className="text-sm text-gray-600">Your intelligent day planner</p>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto pb-20">
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-purple-200 px-2 py-2 shadow-lg">
        <div className="flex justify-around items-center max-w-lg mx-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all ${
                  isActive
                    ? "text-purple-600 bg-purple-100"
                    : "text-gray-600 hover:text-purple-600 hover:bg-purple-50"
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? "scale-110" : ""}`} />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
