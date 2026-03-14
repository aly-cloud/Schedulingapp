import { useState, useEffect } from "react";
import { UserPreferences } from "../types/task";
import { storage } from "../utils/storage";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Switch } from "../components/ui/switch";
import { toast } from "sonner";

export function Settings() {
  const [preferences, setPreferences] = useState<UserPreferences>(
    storage.getPreferences()
  );

  const savePreferences = () => {
    storage.savePreferences(preferences);
    toast.success("Preferences saved!");
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-purple-900">Settings</h2>

      <div className="bg-white rounded-xl shadow-md p-6 space-y-6">
        {/* Schedule Style */}
        <div>
          <Label className="text-base font-semibold mb-3 block">Schedule Style</Label>
          <div className="flex gap-2">
            {(["structured", "flexible"] as const).map((style) => (
              <button
                key={style}
                onClick={() =>
                  setPreferences({ ...preferences, scheduleStyle: style })
                }
                className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
                  preferences.scheduleStyle === style
                    ? "bg-purple-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {style.charAt(0).toUpperCase() + style.slice(1)}
              </button>
            ))}
          </div>
          <p className="text-sm text-gray-600 mt-2">
            {preferences.scheduleStyle === "structured"
              ? "Tightly packed time blocks with minimal gaps"
              : "More flexible schedule with breathing room"}
          </p>
        </div>

        {/* Learning Style */}
        <div>
          <Label className="text-base font-semibold mb-3 block">Learning Style</Label>
          <select
            value={preferences.learningStyle}
            onChange={(e) =>
              setPreferences({
                ...preferences,
                learningStyle: e.target.value as any,
              })
            }
            className="w-full px-4 py-3 border rounded-lg bg-white"
          >
            <option value="pomodoro">Pomodoro (25min work, 5min break)</option>
            <option value="spaced-repetition">Spaced Repetition</option>
            <option value="time-blocking">Time Blocking</option>
            <option value="flow">Flow State (longer sessions)</option>
          </select>
        </div>

        {/* Work Hours */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="workStart">Work Start</Label>
            <Input
              id="workStart"
              type="time"
              value={preferences.workStartTime}
              onChange={(e) =>
                setPreferences({ ...preferences, workStartTime: e.target.value })
              }
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="workEnd">Work End</Label>
            <Input
              id="workEnd"
              type="time"
              value={preferences.workEndTime}
              onChange={(e) =>
                setPreferences({ ...preferences, workEndTime: e.target.value })
              }
              className="mt-1"
            />
          </div>
        </div>

        {/* Sleep Schedule */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="wakeTime">Wake Time</Label>
            <Input
              id="wakeTime"
              type="time"
              value={preferences.wakeTime}
              onChange={(e) =>
                setPreferences({ ...preferences, wakeTime: e.target.value })
              }
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="sleepTime">Sleep Time</Label>
            <Input
              id="sleepTime"
              type="time"
              value={preferences.sleepTime}
              onChange={(e) =>
                setPreferences({ ...preferences, sleepTime: e.target.value })
              }
              className="mt-1"
            />
          </div>
        </div>

        {/* Pomodoro Settings */}
        {preferences.learningStyle === "pomodoro" && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="pomodoroLength">Pomodoro Length (min)</Label>
              <Input
                id="pomodoroLength"
                type="number"
                min={15}
                max={60}
                step={5}
                value={preferences.pomodoroLength}
                onChange={(e) =>
                  setPreferences({
                    ...preferences,
                    pomodoroLength: parseInt(e.target.value) || 25,
                  })
                }
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="breakDuration">Break Duration (min)</Label>
              <Input
                id="breakDuration"
                type="number"
                min={5}
                max={30}
                step={5}
                value={preferences.breakDuration}
                onChange={(e) =>
                  setPreferences({
                    ...preferences,
                    breakDuration: parseInt(e.target.value) || 5,
                  })
                }
                className="mt-1"
              />
            </div>
          </div>
        )}

        {/* Health Reminders */}
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-base font-medium">Health Reminders</Label>
            <p className="text-sm text-gray-600">
              Get reminders for breaks, meals, and water
            </p>
          </div>
          <Switch
            checked={preferences.enableHealthReminders}
            onCheckedChange={(checked) =>
              setPreferences({ ...preferences, enableHealthReminders: checked })
            }
          />
        </div>

        {/* Save Button */}
        <Button
          onClick={savePreferences}
          className="w-full bg-purple-600 hover:bg-purple-700"
        >
          Save Preferences
        </Button>
      </div>
    </div>
  );
}
