import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ListChecks, Loader2, Wand2, RefreshCw, Copy, Check, Clock, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

export const Route = createFileRoute("/task-planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner — AI Workplace" },
      { name: "description", content: "Break down projects into actionable tasks with AI-powered planning." },
    ],
  }),
  component: TaskPlanner,
});

interface TaskPlanResult {
  phases: {
    name: string;
    tasks: {
      title: string;
      description: string;
      estimatedHours: number;
      priority: "high" | "medium" | "low";
      dependencies?: string[];
    }[];
  }[];
  milestones: { name: string; description: string; dueDate?: string }[];
  risks: string[];
}

function TaskPlanner() {
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [teamSize, setTeamSize] = useState("");
  const [priorities, setPriorities] = useState("");
  const [result, setResult] = useState<TaskPlanResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  async function generatePlan() {
    if (!projectName || !description) {
      toast.error("Please fill in project name and description");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectName,
          description,
          deadline: deadline || undefined,
          teamSize: teamSize ? parseInt(teamSize) : undefined,
          priorities: priorities ? priorities.split(",").map((s) => s.trim()) : undefined,
        }),
      });
      if (!res.ok) throw new Error("Failed to generate plan");
      const data = (await res.json()) as TaskPlanResult;
      setResult(data);
    } catch {
      toast.error("Failed to generate task plan. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function copyToClipboard() {
    if (!result) return;
    const text = [
      `Project: ${projectName}`,
      "",
      ...result.phases.map((phase) => [
        `## ${phase.name}`,
        ...phase.tasks.map((t) => `- [ ] ${t.title} (${t.priority}, ${t.estimatedHours}h)`),
        "",
      ]).flat(),
      "Milestones:",
      ...result.milestones.map((m) => `- ${m.name}`),
      "",
      "Risks:",
      ...result.risks.map((r) => `- ${r}`),
    ].join("\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("Copied to clipboard");
  }

  const priorityColor = {
    high: "bg-red-500/10 text-red-600 border-red-200",
    medium: "bg-amber-500/10 text-amber-600 border-amber-200",
    low: "bg-emerald-500/10 text-emerald-600 border-emerald-200",
  };

  const totalTasks = result?.phases.reduce((sum, p) => sum + p.tasks.length, 0) ?? 0;
  const totalHours = result?.phases.reduce((sum, p) => sum + p.tasks.reduce((s, t) => s + t.estimatedHours, 0), 0) ?? 0;

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <ListChecks className="h-6 w-6 text-amber-600" />
          AI Task Planner
        </h1>
        <p className="text-muted-foreground">Break down projects into actionable tasks with timelines and priorities.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Project Details</CardTitle>
          <CardDescription>Describe your project to generate a task plan</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="projectName">Project Name *</Label>
              <Input
                id="projectName"
                placeholder="e.g. Website Redesign"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="deadline">Deadline (optional)</Label>
              <Input
                id="deadline"
                placeholder="e.g. 2026-06-30"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Project Description *</Label>
            <Textarea
              id="description"
              placeholder="Describe the project scope, goals, and requirements..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="teamSize">Team Size (optional)</Label>
              <Input
                id="teamSize"
                type="number"
                placeholder="e.g. 5"
                value={teamSize}
                onChange={(e) => setTeamSize(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="priorities">Key Priorities (optional, comma-separated)</Label>
              <Input
                id="priorities"
                placeholder="e.g. Security, UX, Performance"
                value={priorities}
                onChange={(e) => setPriorities(e.target.value)}
              />
            </div>
          </div>
          <Button onClick={generatePlan} disabled={loading} className="w-full">
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Wand2 className="mr-2 h-4 w-4" />
            )}
            Generate Task Plan
          </Button>
        </CardContent>
      </Card>

      {result && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <ListChecks className="h-4 w-4" />
                {totalTasks} tasks
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                {totalHours}h estimated
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={copyToClipboard}>
                {copied ? <Check className="mr-2 h-3.5 w-3.5" /> : <Copy className="mr-2 h-3.5 w-3.5" />}
                Copy Plan
              </Button>
              <Button variant="outline" size="sm" onClick={() => { setResult(null); }}>
                <RefreshCw className="mr-2 h-3.5 w-3.5" />
                New Plan
              </Button>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-4">
              {result.phases.map((phase, pi) => (
                <Card key={pi}>
                  <CardHeader>
                    <CardTitle className="text-base">{phase.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {phase.tasks.map((task, ti) => (
                      <div key={ti} className="rounded-lg border p-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="h-4 w-4 rounded border border-muted-foreground/30" />
                            <span className="text-sm font-medium">{task.title}</span>
                          </div>
                          <Badge variant="outline" className={priorityColor[task.priority]}>
                            {task.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground pl-6">{task.description}</p>
                        <div className="flex items-center gap-3 pl-6 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {task.estimatedHours}h
                          </span>
                          {task.dependencies && task.dependencies.length > 0 && (
                            <span>Depends on: {task.dependencies.join(", ")}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Milestones</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {result.milestones.map((m, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <div className="mt-0.5 h-2 w-2 rounded-full bg-primary" />
                      <div>
                        <p className="text-sm font-medium">{m.name}</p>
                        <p className="text-xs text-muted-foreground">{m.description}</p>
                        {m.dueDate && <p className="text-xs text-primary">Due: {m.dueDate}</p>}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                  <CardTitle className="text-base">Risk Factors</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    {result.risks.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
