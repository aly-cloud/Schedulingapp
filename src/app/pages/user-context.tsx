import { useState, useEffect } from "react";
import { UserContext as UserContextType } from "../types/task";
import { storage } from "../utils/storage";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Badge } from "../components/ui/badge";
import { X } from "lucide-react";
import { toast } from "sonner";

export function UserContextPage() {
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

  const saveContext = () => {
    storage.saveContext(context);
    toast.success("Context saved! AI will use this to personalize your schedule.");
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h2 className="text-xl font-semibold mb-2 text-purple-900">
        Tell AI About You
      </h2>
      <p className="text-sm text-gray-600 mb-4">
        Help the AI understand your needs for better schedule recommendations
      </p>

      <div className="bg-white rounded-xl shadow-md p-6 space-y-6">
        {/* Occupation */}
        <div>
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
        <div>
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
                className="bg-purple-100 text-purple-800 pr-1 text-sm"
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
        <div>
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
                className="bg-orange-100 text-orange-800 pr-1 text-sm"
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
        <div>
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

        {/* Save Button */}
        <Button
          onClick={saveContext}
          className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
        >
          Save Context
        </Button>
      </div>
    </div>
  );
}