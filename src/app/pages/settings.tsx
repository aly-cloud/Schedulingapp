import { useState } from "react";
import { UserPreferences, UserContext as UserContextType } from "../types/task";
import { storage } from "../utils/storage";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Switch } from "../components/ui/switch";
import { Badge } from "../components/ui/badge";
import { X } from "lucide-react";
import { toast } from "sonner";

export function Settings() {
  const [preferences, setPreferences] = useState<UserPreferences>(
    storage.getPreferences()
  );

  const [context, setContext] = useState<UserContextType>(
    storage.getContext() || {
      occupation: "",
      goals: [],
      challenges: [],
      energyPeakTime: "morning",
      focusDuration: 45,
    }
  );

  const [goalInput, setGoalInput] = useState("");
  const [challengeInput, setChallengeInput] = useState("");

  const saveAll = () => {
    storage.savePreferences(preferences);
    storage.saveContext(context);
    toast.success("All preferences saved!");
  };

  const addGoal = () => {
    if (!goalInput.trim()) return;
    setContext({
      ...context,
      goals: [...context.goals, goalInput.trim()],
    });
    setGoalInput("");
  };

  const removeGoal = (index: number) => {
    setContext({
      ...context,
      goals: context.goals.filter((_, i) => i !== index),
    });
  };

  const addChallenge = () => {
    if (!challengeInput.trim()) return;
    setContext({
      ...context,
      challenges: [...context.challenges, challengeInput.trim()],
    });
    setChallengeInput("");
  };

  const removeChallenge = (index: number) => {
    setContext({
      ...context,
      challenges: context.challenges.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-purple-900">Preferences</h2>
        <p className="text-gray-600 mt-1">
          Customize your schedule and help AI understand you better
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Left Column - Schedule Settings */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4 text-purple-800">Schedule Settings</h3>
            
            {/* Schedule Style */}
            <div className="mb-6">
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
            <div className="mb-6">
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
            <div className="mb-6">
              <Label className="text-base font-semibold mb-3 block">Work Hours</Label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="workStart" className="text-sm">Start</Label>
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
                  <Label htmlFor="workEnd" className="text-sm">End</Label>
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
            </div>

            {/* Sleep Schedule */}
            <div className="mb-6">
              <Label className="text-base font-semibold mb-3 block">Sleep Schedule</Label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="wakeTime" className="text-sm">Wake Time</Label>
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
                  <Label htmlFor="sleepTime" className="text-sm">Sleep Time</Label>
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
            </div>

            {/* Pomodoro Settings */}
            {preferences.learningStyle === "pomodoro" && (
              <div className="mb-6">
                <Label className="text-base font-semibold mb-3 block">Pomodoro Settings</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="pomodoroLength" className="text-sm">Session (min)</Label>
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
                    <Label htmlFor="breakDuration" className="text-sm">Break (min)</Label>
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
          </div>
        </div>

        {/* Right Column - User Profile */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4 text-purple-800">Your Profile</h3>
            
            {/* Occupation */}
            <div className="mb-6">
              <Label htmlFor="occupation" className="text-base font-semibold">
                Occupation / Role
              </Label>
              <Input
                id="occupation"
                placeholder="e.g., College student, Software engineer, Parent"
                value={context.occupation}
                onChange={(e) =>
                  setContext({ ...context, occupation: e.target.value })
                }
                className="mt-2"
              />
            </div>

            {/* Goals */}
            <div className="mb-6">
              <Label className="text-base font-semibold block mb-2">Your Goals</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  placeholder="Add a goal..."
                  value={goalInput}
                  onChange={(e) => setGoalInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addGoal()}
                />
                <Button onClick={addGoal} size="sm">
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {context.goals.map((goal, index) => (
                  <Badge
                    key={index}
                    className="bg-purple-100 text-purple-800 pr-1"
                  >
                    {goal}
                    <button
                      onClick={() => removeGoal(index)}
                      className="ml-1 hover:bg-purple-200 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            {/* Challenges */}
            <div className="mb-6">
              <Label className="text-base font-semibold block mb-2">
                Your Challenges
              </Label>
              <div className="flex gap-2 mb-2">
                <Input
                  placeholder="Add a challenge..."
                  value={challengeInput}
                  onChange={(e) => setChallengeInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addChallenge()}
                />
                <Button onClick={addChallenge} size="sm">
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {context.challenges.map((challenge, index) => (
                  <Badge
                    key={index}
                    className="bg-orange-100 text-orange-800 pr-1"
                  >
                    {challenge}
                    <button
                      onClick={() => removeChallenge(index)}
                      className="ml-1 hover:bg-orange-200 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            {/* Energy Peak Time */}
            <div className="mb-6">
              <Label className="text-base font-semibold mb-3 block">
                When Are You Most Energetic?
              </Label>
              <div className="grid grid-cols-2 gap-2">
                {(["morning", "afternoon", "evening", "night"] as const).map((time) => (
                  <button
                    key={time}
                    onClick={() =>
                      setContext({ ...context, energyPeakTime: time })
                    }
                    className={`py-3 rounded-lg font-medium transition-colors ${
                      context.energyPeakTime === time
                        ? "bg-purple-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {time.charAt(0).toUpperCase() + time.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Focus Duration */}
            <div>
              <Label htmlFor="focusDuration" className="text-base font-semibold">
                Average Focus Duration (minutes)
              </Label>
              <p className="text-sm text-gray-600 mb-2">
                How long can you focus before needing a break?
              </p>
              <Input
                id="focusDuration"
                type="number"
                min={15}
                max={180}
                step={5}
                value={context.focusDuration}
                onChange={(e) =>
                  setContext({
                    ...context,
                    focusDuration: parseInt(e.target.value) || 45,
                  })
                }
              />
            </div>
          </div>
        </div>
      </div>

      {/* Save Button - Centered */}
      <div className="flex justify-center">
        <Button
          onClick={saveAll}
          size="lg"
          className="px-12 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 shadow-lg"
        >
          Save All Preferences
        </Button>
      </div>
    </div>
  );
}