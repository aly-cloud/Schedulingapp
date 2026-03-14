import { useState, useEffect } from "react";
import { ScheduleBlock } from "../types/task";
import { storage } from "../utils/storage";
import { generateSchedule } from "../utils/ai-helper";
import { generateICalFile } from "../utils/ical-export";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Calendar, Download, Sparkles, RefreshCw } from "lucide-react";
import { toast } from "sonner";

export function MySchedule() {
  const [schedule, setSchedule] = useState<ScheduleBlock[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    loadSchedule();
  }, []);

  const loadSchedule = () => {
    const saved = storage.getSchedule();
    if (saved.length > 0) {
      setSchedule(saved);
    }
  };

  const generateNewSchedule = () => {
    const tasks = storage.getTasks();
    const preferences = storage.getPreferences();
    const context = storage.getContext();

    const newSchedule = generateSchedule(tasks, preferences, context, selectedDate);
    setSchedule(newSchedule);
    storage.saveSchedule(newSchedule);
    toast.success("Schedule generated!");
  };

  const exportToGoogleCalendar = () => {
    if (schedule.length === 0) {
      toast.error("Generate a schedule first!");
      return;
    }
    generateICalFile(schedule, "my-schedule.ics");
    toast.success("Calendar file downloaded! Import it to Google Calendar.");
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      study: "bg-blue-500",
      work: "bg-purple-500",
      health: "bg-green-500",
      passion: "bg-pink-500",
      chores: "bg-yellow-500",
      social: "bg-orange-500",
      personal: "bg-teal-500",
      break: "bg-gray-400",
      sleep: "bg-indigo-600",
      meal: "bg-emerald-500",
      other: "bg-gray-500",
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

  const groupedByHour = schedule.reduce((acc, block) => {
    const hour = block.startTime.getHours();
    if (!acc[hour]) acc[hour] = [];
    acc[hour].push(block);
    return acc;
  }, {} as Record<number, ScheduleBlock[]>);

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-purple-900">My Schedule</h2>

      {/* Actions */}
      <div className="space-y-2 mb-6">
        <Button
          onClick={generateNewSchedule}
          className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Generate AI Schedule
        </Button>

        {schedule.length > 0 && (
          <Button
            onClick={exportToGoogleCalendar}
            variant="outline"
            className="w-full border-purple-300 text-purple-700 hover:bg-purple-50"
          >
            <Download className="w-4 h-4 mr-2" />
            Export to Google Calendar
          </Button>
        )}
      </div>

      {/* Date Selector */}
      <div className="bg-white rounded-xl shadow-md p-4 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-purple-600" />
            <span className="font-medium">
              {selectedDate.toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSelectedDate(new Date())}
            className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Schedule Timeline */}
      {schedule.length > 0 ? (
        <div className="space-y-1">
          {Object.entries(groupedByHour)
            .sort(([a], [b]) => Number(a) - Number(b))
            .map(([hour, blocks]) => (
              <div key={hour} className="flex gap-2">
                <div className="w-16 text-sm text-gray-500 font-medium pt-2">
                  {new Date(0, 0, 0, Number(hour)).toLocaleTimeString("en-US", {
                    hour: "numeric",
                    hour12: true,
                  })}
                </div>

                <div className="flex-1 space-y-1">
                  {blocks.map((block) => {
                    const durationMinutes = Math.round(
                      (block.endTime.getTime() - block.startTime.getTime()) / 60000
                    );

                    return (
                      <div
                        key={block.id}
                        className="bg-white rounded-lg shadow-sm border-l-4 p-3"
                        style={{
                          borderLeftColor: getCategoryColor(block.category).replace(
                            "bg-",
                            "#"
                          ),
                        }}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-medium text-sm">{block.title}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {formatTime(block.startTime)} - {formatTime(block.endTime)} •{" "}
                              {durationMinutes} min
                            </p>
                            {block.description && (
                              <p className="text-xs text-gray-600 mt-1">
                                {block.description}
                              </p>
                            )}
                          </div>
                          <Badge
                            className={`${getCategoryColor(block.category)} text-white text-xs`}
                          >
                            {block.category}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500 bg-white rounded-xl shadow-md">
          <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p className="font-medium">No schedule yet</p>
          <p className="text-sm mt-1">Generate your AI-powered schedule to get started!</p>
        </div>
      )}
    </div>
  );
}
