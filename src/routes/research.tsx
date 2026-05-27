import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Loader2, Wand2, RefreshCw, Copy, Check, Lightbulb, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant — AI Workplace" },
      { name: "description", content: "Generate comprehensive research briefs on any topic with AI." },
    ],
  }),
  component: ResearchAssistant,
});

interface ResearchResult {
  overview: string;
  keyFindings: { title: string; description: string; significance: string }[];
  insights: string[];
  recommendations: string[];
  sources: string[];
  nextSteps: string[];
}

function ResearchAssistant() {
  const [topic, setTopic] = useState("");
  const [depth, setDepth] = useState("detailed");
  const [focus, setFocus] = useState("");
  const [questions, setQuestions] = useState("");
  const [result, setResult] = useState<ResearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [editableOverview, setEditableOverview] = useState("");

  async function research() {
    if (!topic.trim()) {
      toast.error("Please enter a research topic");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          depth,
          focus: focus || undefined,
          questions: questions ? questions.split("\n").map((s) => s.trim()).filter(Boolean) : undefined,
        }),
      });
      if (!res.ok) throw new Error("Failed to research");
      const data = (await res.json()) as ResearchResult;
      setResult(data);
      setEditableOverview(data.overview);
    } catch {
      toast.error("Failed to generate research. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function copyToClipboard() {
    if (!result) return;
    const text = [
      `Research: ${topic}`,
      "",
      "Overview:",
      editableOverview,
      "",
      "Key Findings:",
      ...result.keyFindings.map((f) => `${f.title}: ${f.description} (${f.significance})`),
      "",
      "Insights:",
      ...result.insights.map((i) => `- ${i}`),
      "",
      "Recommendations:",
      ...result.recommendations.map((r) => `- ${r}`),
      "",
      "Next Steps:",
      ...result.nextSteps.map((s) => `- ${s}`),
    ].join("\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("Copied to clipboard");
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Search className="h-6 w-6 text-violet-600" />
          AI Research Assistant
        </h1>
        <p className="text-muted-foreground">Generate comprehensive research briefs on any topic with structured insights.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Research Topic</CardTitle>
          <CardDescription>Define what you want to research</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="topic">Topic *</Label>
              <Input
                id="topic"
                placeholder="e.g. Remote work productivity trends, AI in healthcare, Sustainable packaging"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Research Depth</Label>
              <Select value={depth} onValueChange={setDepth}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="overview">Overview</SelectItem>
                  <SelectItem value="detailed">Detailed</SelectItem>
                  <SelectItem value="comprehensive">Comprehensive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="focus">Focus Area (optional)</Label>
              <Input
                id="focus"
                placeholder="e.g. Impact on small businesses"
                value={focus}
                onChange={(e) => setFocus(e.target.value)}
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="questions">Specific Questions (one per line, optional)</Label>
              <Textarea
                id="questions"
                placeholder="What are the main challenges?&#10;What are the latest statistics?&#10;Who are the key players?"
                value={questions}
                onChange={(e) => setQuestions(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <Button onClick={research} disabled={loading} className="w-full">
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Wand2 className="mr-2 h-4 w-4" />
            )}
            Generate Research Brief
          </Button>
        </CardContent>
      </Card>

      {result && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Research Results</h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={copyToClipboard}>
                {copied ? <Check className="mr-2 h-3.5 w-3.5" /> : <Copy className="mr-2 h-3.5 w-3.5" />}
                Copy Brief
              </Button>
              <Button variant="outline" size="sm" onClick={() => { setResult(null); setEditableOverview(""); }}>
                <RefreshCw className="mr-2 h-3.5 w-3.5" />
                New Research
              </Button>
            </div>
          </div>

          <Card>
            <CardHeader className="flex flex-row items-center gap-2">
              <BookOpen className="h-4 w-4 text-primary" />
              <CardTitle className="text-base">Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={editableOverview}
                onChange={(e) => setEditableOverview(e.target.value)}
                rows={6}
                className="resize-y"
              />
            </CardContent>
          </Card>

          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-amber-500" />
                  Key Findings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {result.keyFindings.map((f, i) => (
                  <div key={i} className="space-y-1">
                    <h4 className="text-sm font-semibold">{f.title}</h4>
                    <p className="text-sm text-muted-foreground">{f.description}</p>
                    <Badge variant="outline" className="text-xs">
                      {f.significance}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Key Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-1.5 text-sm text-muted-foreground">
                    {result.insights.map((insight, i) => (
                      <li key={i}>{insight}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-1.5 text-sm text-muted-foreground">
                    {result.recommendations.map((rec, i) => (
                      <li key={i}>{rec}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Sources & Areas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1.5">
                  {result.sources.map((s, i) => (
                    <Badge key={i} variant="secondary">{s}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Next Steps</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-1.5 text-sm text-muted-foreground">
                  {result.nextSteps.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
