import { createBrowserRouter } from "react-router";
import { BrainDump } from "./pages/brain-dump";
import { MySchedule } from "./pages/my-schedule";
import { Tasks } from "./pages/tasks";
import { Settings } from "./pages/settings";
import { UserContextPage } from "./pages/user-context";
import { Layout } from "./components/layout";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: BrainDump },
      { path: "schedule", Component: MySchedule },
      { path: "tasks", Component: Tasks },
      { path: "settings", Component: Settings },
      { path: "context", Component: UserContextPage },
    ],
  },
]);