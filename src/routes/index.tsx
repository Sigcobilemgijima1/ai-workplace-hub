import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Mail,
  StickyNote,
  ListChecks,
  Search,
  MessageSquare,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — AI Workplace Productivity Assistant" },
      { name: "description", content: "Your AI-powered productivity dashboard with email generation, meeting notes, task planning, research, and chat." },
      { property: "og:title", content: "Dashboard — AI Workplace Productivity Assistant" },
      { property: "og:description", content: "Your AI-powered productivity dashboard" },
    ],
  }),
  component: Dashboard,
});

const tools = [
  {
    title: "Smart Email Generator",
    description: "Draft professional emails tailored to recipients with the right tone.",
    icon: Mail,
    href: "/email-generator",
    color: "bg-blue-500/10 text-blue-600",
  },
  {
    title: "Meeting Notes Summarizer",
    description: "Transform raw notes into structured summaries with action items.",
    icon: StickyNote,
    href: "/meeting-notes",
    color: "bg-emerald-500/10 text-emerald-600",
  },
  {
    title: "AI Task Planner",
    description: "Break down projects into actionable tasks with timelines.",
    icon: ListChecks,
    href: "/task-planner",
    color: "bg-amber-500/10 text-amber-600",
  },
  {
    title: "AI Research Assistant",
    description: "Generate comprehensive research briefs on any topic.",
    icon: Search,
    href: "/research",
    color: "bg-violet-500/10 text-violet-600",
  },
  {
    title: "AI Chatbot",
    description: "Ask anything and get AI-powered assistance in real time.",
    icon: MessageSquare,
    href: "/chat",
    color: "bg-rose-500/10 text-rose-600",
  },
];

function Dashboard() {
  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Sparkles className="h-7 w-7 text-primary" />
          Welcome to AI Workplace
        </h1>
        <p className="text-muted-foreground text-lg">
          Automate your daily workplace tasks with AI-powered productivity tools.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <Link
            key={tool.title}
            to={tool.href}
            className="group block rounded-xl border bg-card p-6 transition-all hover:border-primary/30 hover:shadow-md hover:-translate-y-0.5"
          >
            <div className="flex items-start justify-between">
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${tool.color}`}>
                <tool.icon className="h-5 w-5" />
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary" />
            </div>
            <h3 className="mt-4 font-semibold">{tool.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{tool.description}</p>
          </Link>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Responsible AI</CardTitle>
          <CardDescription>
            Important guidelines for using AI-generated content in the workplace
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>
            AI outputs are generated suggestions and should always be reviewed before use.
            Verify facts, check for bias, and ensure outputs align with your organization&apos;s policies.
          </p>
          <p>
            Never share sensitive personal information, proprietary data, or confidential business
            information in AI prompts unless you have confirmed data handling policies with your organization.
          </p>
          <p>
            AI can make mistakes. Always use your professional judgment and critical thinking when
            applying AI-generated recommendations to important decisions.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
