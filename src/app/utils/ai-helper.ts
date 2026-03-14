import { Task, TaskCategory, TaskPriority, UserPreferences, UserContext, ScheduleBlock } from "../types/task";

// Mock AI categorization - groups similar tasks
export function categorizeTasks(tasks: Task[]): Task[] {
  return tasks.map(task => {
    const title = task.title.toLowerCase();
    
    // Simple keyword-based categorization
    if (title.includes("study") || title.includes("homework") || title.includes("exam") || 
        title.includes("learn") || title.includes("class") || title.includes("assignment")) {
      return { ...task, category: "study" };
    }
    if (title.includes("work") || title.includes("meeting") || title.includes("project") || 
        title.includes("deadline") || title.includes("presentation")) {
      return { ...task, category: "work" };
    }
    if (title.includes("gym") || title.includes("exercise") || title.includes("workout") || 
        title.includes("run") || title.includes("health") || title.includes("doctor")) {
      return { ...task, category: "health" };
    }
    if (title.includes("passion") || title.includes("hobby") || title.includes("art") || 
        title.includes("music") || title.includes("creative") || title.includes("practice")) {
      return { ...task, category: "passion" };
    }
    if (title.includes("clean") || title.includes("laundry") || title.includes("groceries") || 
        title.includes("cook") || title.includes("chore")) {
      return { ...task, category: "chores" };
    }
    if (title.includes("friend") || title.includes("call") || title.includes("hangout") || 
        title.includes("social") || title.includes("party")) {
      return { ...task, category: "social" };
    }
    
    return task;
  });
}

// Prioritize tasks based on deadline and importance
export function prioritizeTasks(tasks: Task[]): Task[] {
  return tasks.sort((a, b) => {
    // First by priority
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
    if (priorityDiff !== 0) return priorityDiff;
    
    // Then by deadline
    if (a.deadline && b.deadline) {
      return a.deadline.getTime() - b.deadline.getTime();
    }
    if (a.deadline) return -1;
    if (b.deadline) return 1;
    
    // Finally by created date
    return a.createdAt.getTime() - b.createdAt.getTime();
  });
}

// Generate schedule based on tasks and preferences
export function generateSchedule(
  tasks: Task[],
  preferences: UserPreferences,
  context: UserContext | null,
  targetDate: Date = new Date()
): ScheduleBlock[] {
  const schedule: ScheduleBlock[] = [];
  
  // Parse time strings
  const [wakeHour, wakeMin] = preferences.wakeTime.split(":").map(Number);
  const [sleepHour, sleepMin] = preferences.sleepTime.split(":").map(Number);
  const [workStartHour, workStartMin] = preferences.workStartTime.split(":").map(Number);
  const [workEndHour, workEndMin] = preferences.workEndTime.split(":").map(Number);
  
  // Set up day
  const day = new Date(targetDate);
  day.setHours(wakeHour, wakeMin, 0, 0);
  
  const dayEnd = new Date(targetDate);
  dayEnd.setHours(sleepHour, sleepMin, 0, 0);
  
  let currentTime = new Date(day);
  
  // Morning routine (1 hour)
  schedule.push({
    id: `morning-${Date.now()}`,
    title: "Morning Routine",
    category: "health",
    startTime: new Date(currentTime),
    endTime: new Date(currentTime.getTime() + 60 * 60 * 1000),
    description: "Wake up, breakfast, get ready",
  });
  currentTime = new Date(currentTime.getTime() + 60 * 60 * 1000);
  
  // Filter incomplete tasks
  const incompleteTasks = tasks.filter(t => !t.completed);
  const prioritized = prioritizeTasks(incompleteTasks);
  
  // Schedule tasks
  let taskIndex = 0;
  while (currentTime < dayEnd && taskIndex < prioritized.length) {
    const task = prioritized[taskIndex];
    
    // Add lunch break around noon
    const currentHour = currentTime.getHours();
    if (currentHour >= 12 && currentHour < 13 && !schedule.some(b => b.category === "meal" && b.title.includes("Lunch"))) {
      schedule.push({
        id: `lunch-${Date.now()}`,
        title: "Lunch Break",
        category: "meal",
        startTime: new Date(currentTime),
        endTime: new Date(currentTime.getTime() + 45 * 60 * 1000),
      });
      currentTime = new Date(currentTime.getTime() + 45 * 60 * 1000);
      continue;
    }
    
    // Check if we're in work hours for work tasks
    const isWorkHours = currentHour >= workStartHour && currentHour < workEndHour;
    
    // Schedule the task
    const taskDuration = task.estimatedMinutes * 60 * 1000;
    const endTime = new Date(currentTime.getTime() + taskDuration);
    
    if (endTime <= dayEnd) {
      schedule.push({
        id: `task-${task.id}-${Date.now()}`,
        taskId: task.id,
        title: task.title,
        category: task.category,
        startTime: new Date(currentTime),
        endTime: endTime,
        description: `Priority: ${task.priority}`,
      });
      
      currentTime = endTime;
      
      // Add break based on learning style
      if (preferences.learningStyle === "pomodoro" && task.estimatedMinutes >= preferences.pomodoroLength) {
        const breakEnd = new Date(currentTime.getTime() + preferences.breakDuration * 60 * 1000);
        schedule.push({
          id: `break-${Date.now()}`,
          title: "Break",
          category: "break",
          startTime: new Date(currentTime),
          endTime: breakEnd,
        });
        currentTime = breakEnd;
      }
      
      taskIndex++;
    } else {
      break;
    }
  }
  
  // Add dinner
  if (currentTime.getHours() < 19) {
    currentTime.setHours(19, 0, 0, 0);
  }
  schedule.push({
    id: `dinner-${Date.now()}`,
    title: "Dinner",
    category: "meal",
    startTime: new Date(currentTime),
    endTime: new Date(currentTime.getTime() + 60 * 60 * 1000),
  });
  currentTime = new Date(currentTime.getTime() + 60 * 60 * 1000);
  
  // Evening wind-down
  if (currentTime < dayEnd) {
    schedule.push({
      id: `evening-${Date.now()}`,
      title: "Wind Down",
      category: "health",
      startTime: new Date(currentTime),
      endTime: new Date(dayEnd),
      description: "Relax, prepare for bed",
    });
  }
  
  return schedule;
}

// Group tasks by category
export function groupTasksByCategory(tasks: Task[]): Map<TaskCategory | "other", Task[]> {
  const groups = new Map<TaskCategory | "other", Task[]>();
  
  tasks.forEach(task => {
    const category = task.category || "other";
    if (!groups.has(category)) {
      groups.set(category, []);
    }
    groups.get(category)!.push(task);
  });
  
  return groups;
}
