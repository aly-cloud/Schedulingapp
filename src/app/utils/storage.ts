import { Task, UserPreferences, UserContext, ScheduleBlock } from "../types/task";

const TASKS_KEY = "schedule_ai_tasks";
const PREFERENCES_KEY = "schedule_ai_preferences";
const CONTEXT_KEY = "schedule_ai_context";
const SCHEDULE_KEY = "schedule_ai_schedule";

export const storage = {
  // Tasks
  getTasks(): Task[] {
    const data = localStorage.getItem(TASKS_KEY);
    if (!data) return [];
    return JSON.parse(data, (key, value) => {
      if (key === "deadline" || key === "createdAt") {
        return value ? new Date(value) : undefined;
      }
      return value;
    });
  },

  saveTasks(tasks: Task[]): void {
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  },

  // Preferences
  getPreferences(): UserPreferences {
    const data = localStorage.getItem(PREFERENCES_KEY);
    if (!data) {
      return {
        scheduleStyle: "structured",
        learningStyle: "pomodoro",
        workStartTime: "09:00",
        workEndTime: "17:00",
        sleepTime: "23:00",
        wakeTime: "07:00",
        breakDuration: 15,
        pomodoroLength: 25,
        enableHealthReminders: true,
      };
    }
    return JSON.parse(data);
  },

  savePreferences(prefs: UserPreferences): void {
    localStorage.setItem(PREFERENCES_KEY, JSON.stringify(prefs));
  },

  // User Context
  getContext(): UserContext | null {
    const data = localStorage.getItem(CONTEXT_KEY);
    return data ? JSON.parse(data) : null;
  },

  saveContext(context: UserContext): void {
    localStorage.setItem(CONTEXT_KEY, JSON.stringify(context));
  },

  // Schedule
  getSchedule(): ScheduleBlock[] {
    const data = localStorage.getItem(SCHEDULE_KEY);
    if (!data) return [];
    return JSON.parse(data, (key, value) => {
      if (key === "startTime" || key === "endTime") {
        return new Date(value);
      }
      return value;
    });
  },

  saveSchedule(schedule: ScheduleBlock[]): void {
    localStorage.setItem(SCHEDULE_KEY, JSON.stringify(schedule));
  },
};
