import { useState, useEffect } from "react";
import { ScheduleBlock } from "../types/task";
import { storage } from "../utils/storage";
import { generateSchedule } from "../utils/ai-helper";
import { generateICalFile } from "../utils/ical-export";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Download, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";

export function MySchedule() {
  const [weekSchedule, setWeekSchedule] = useState<Map<string, ScheduleBlock[]>>(new Map());
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(getWeekStart(new Date()));

  useEffect(() => {
    loadOrGenerateWeekSchedule();
  }, [currentWeekStart]);

  function getWeekStart(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day;
    return new Date(d.setDate(diff));
  }

  function getWeekDays(weekStart: Date): Date[] {
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + i);
      return date;
    });
  }

  const loadOrGenerateWeekSchedule = () => {
    const tasks = storage.getTasks();
    const preferences = storage.getPreferences();
    const context = storage.getContext();
    
    const weekDays = getWeekDays(currentWeekStart);
    const scheduleMap = new Map<string, ScheduleBlock[]>();
    
    weekDays.forEach(day => {
      const dayKey = day.toDateString();
      const daySchedule = generateSchedule(tasks, preferences, context, day);
      scheduleMap.set(dayKey, daySchedule);
    });
    
    setWeekSchedule(scheduleMap);
  };

  const generateNewSchedule = () => {
    loadOrGenerateWeekSchedule();
    toast.success("Weekly schedule generated!");
  };

  const exportToGoogleCalendar = () => {
    const allBlocks: ScheduleBlock[] = [];
    weekSchedule.forEach(blocks => allBlocks.push(...blocks));
    
    if (allBlocks.length === 0) {
      toast.error("Generate a schedule first!");
      return;
    }
    generateICalFile(allBlocks, "weekly-schedule.ics");
    toast.success("Calendar file downloaded! Import it to Google Calendar.");
  };

  const goToPreviousWeek = () => {
    const newStart = new Date(currentWeekStart);
    newStart.setDate(newStart.getDate() - 7);
    setCurrentWeekStart(newStart);
  };

  const goToNextWeek = () => {
    const newStart = new Date(currentWeekStart);
    newStart.setDate(newStart.getDate() + 7);
    setCurrentWeekStart(newStart);
  };

  const goToCurrentWeek = () => {
    setCurrentWeekStart(getWeekStart(new Date()));
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      study: "bg-blue-500 border-blue-600",
      work: "bg-purple-500 border-purple-600",
      health: "bg-green-500 border-green-600",
      passion: "bg-pink-500 border-pink-600",
      chores: "bg-yellow-500 border-yellow-600",
      social: "bg-orange-500 border-orange-600",
      personal: "bg-teal-500 border-teal-600",
      break: "bg-gray-400 border-gray-500",
      sleep: "bg-indigo-600 border-indigo-700",
      meal: "bg-emerald-500 border-emerald-600",
      other: "bg-gray-500 border-gray-600",
    };
    return colors[category] || colors.other;
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const weekDays = getWeekDays(currentWeekStart);
  const hours = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div className="p-8 h-full flex flex-col">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-3xl font-bold text-purple-900">Weekly Schedule</h2>
            <p className="text-gray-600 mt-1">AI-powered schedule optimized for your goals</p>
          </div>
          
          <div className="flex gap-3">
            <Button
              onClick={generateNewSchedule}
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Regenerate Schedule
            </Button>

            <Button
              onClick={exportToGoogleCalendar}
              variant="outline"
              className="border-purple-300 text-purple-700 hover:bg-purple-50"
            >
              <Download className="w-4 h-4 mr-2" />
              Export to Google Calendar
            </Button>
          </div>
        </div>

        {/* Week Navigation */}
        <div className="flex items-center justify-between bg-white rounded-lg shadow-md p-4">
          <Button variant="ghost" onClick={goToPreviousWeek}>
            <ChevronLeft className="w-5 h-5" />
          </Button>
          
          <div className="text-center">
            <p className="text-lg font-semibold">
              {weekDays[0].toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
              {" - "}
              {weekDays[6].toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </p>
            <Button variant="link" onClick={goToCurrentWeek} className="text-sm text-purple-600">
              Go to Current Week
            </Button>
          </div>
          
          <Button variant="ghost" onClick={goToNextWeek}>
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 bg-white rounded-xl shadow-lg overflow-hidden flex flex-col">
        {/* Day Headers */}
        <div className="grid grid-cols-8 border-b border-gray-200 bg-gray-50">
          <div className="p-3 border-r border-gray-200"></div>
          {weekDays.map((day, index) => {
            const isToday = day.toDateString() === new Date().toDateString();
            return (
              <div
                key={index}
                className={`p-3 text-center border-r border-gray-200 ${
                  isToday ? "bg-purple-100" : ""
                }`}
              >
                <div className={`font-semibold ${isToday ? "text-purple-700" : "text-gray-700"}`}>
                  {day.toLocaleDateString("en-US", { weekday: "short" })}
                </div>
                <div className={`text-sm ${isToday ? "text-purple-600" : "text-gray-500"}`}>
                  {day.getDate()}
                </div>
              </div>
            );
          })}
        </div>

        {/* Calendar Body */}
        <div className="flex-1 overflow-auto">
          <div className="grid grid-cols-8 relative">
            {/* Time Column */}
            <div className="border-r border-gray-200">
              {hours.map((hour) => (
                <div
                  key={hour}
                  className="h-20 border-b border-gray-200 px-2 py-1 text-xs text-gray-500 bg-gray-50"
                >
                  {new Date(0, 0, 0, hour).toLocaleTimeString("en-US", {
                    hour: "numeric",
                    hour12: true,
                  })}
                </div>
              ))}
            </div>

            {/* Day Columns */}
            {weekDays.map((day, dayIndex) => {
              const dayKey = day.toDateString();
              const daySchedule = weekSchedule.get(dayKey) || [];
              const isToday = day.toDateString() === new Date().toDateString();

              return (
                <div
                  key={dayIndex}
                  className={`border-r border-gray-200 relative ${
                    isToday ? "bg-purple-50/30" : ""
                  }`}
                >
                  {/* Hour Grid Lines */}
                  {hours.map((hour) => (
                    <div
                      key={hour}
                      className="h-20 border-b border-gray-100"
                    ></div>
                  ))}

                  {/* Schedule Blocks */}
                  <div className="absolute inset-0 pointer-events-none">
                    {daySchedule.map((block) => {
                      const startHour = block.startTime.getHours();
                      const startMinute = block.startTime.getMinutes();
                      const endHour = block.endTime.getHours();
                      const endMinute = block.endTime.getMinutes();
                      
                      const topPosition = (startHour + startMinute / 60) * 80; // 80px per hour
                      const duration = (endHour - startHour) + (endMinute - startMinute) / 60;
                      const height = duration * 80;

                      return (
                        <div
                          key={block.id}
                          className={`absolute left-1 right-1 rounded-md shadow-sm border-l-4 p-2 pointer-events-auto overflow-hidden ${getCategoryColor(
                            block.category
                          )} text-white`}
                          style={{
                            top: `${topPosition}px`,
                            height: `${Math.max(height, 20)}px`,
                          }}
                        >
                          <div className="text-xs font-semibold truncate">
                            {block.title}
                          </div>
                          <div className="text-xs opacity-90 truncate">
                            {formatTime(block.startTime)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
