export type TaskCategory = 
  | "study"
  | "work"
  | "personal"
  | "health"
  | "passion"
  | "chores"
  | "social"
  | "other";

export type TaskPriority = "high" | "medium" | "low";

export type TaskDuration = "short" | "medium" | "long"; // short: <30min, medium: 30min-2hr, long: >2hr

export interface Task {
  id: string;
  title: string;
  category: TaskCategory;
  priority: TaskPriority;
  duration: TaskDuration;
  estimatedMinutes: number;
  isLongTerm: boolean;
  deadline?: Date;
  completed: boolean;
  createdAt: Date;
}

export interface UserPreferences {
  scheduleStyle: "structured" | "flexible";
  learningStyle: "pomodoro" | "spaced-repetition" | "time-blocking" | "flow";
  workStartTime: string; // HH:mm format
  workEndTime: string;
  sleepTime: string;
  wakeTime: string;
  breakDuration: number; // minutes
  pomodoroLength: number; // minutes
  enableHealthReminders: boolean;
}

export interface UserContext {
  occupation: string;
  goals: string[];
  challenges: string[];
  energyPeakTime: "morning" | "afternoon" | "evening" | "night";
  focusDuration: number; // average minutes before break needed
}

export interface ScheduleBlock {
  id: string;
  taskId?: string;
  title: string;
  category: TaskCategory | "break" | "sleep" | "meal";
  startTime: Date;
  endTime: Date;
  description?: string;
}
