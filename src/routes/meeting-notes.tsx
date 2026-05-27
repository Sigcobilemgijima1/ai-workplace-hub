import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { StickyNote, Loader2, Wand2, RefreshCw, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export const Route = createFileRoute("/meeting-notes")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer — AI Workplace" },
      { name: "description", content: "Transform raw meeting notes into structured summaries with action items." },
    ],
  }),
  component: MeetingNotes,
});

interface MeetingResult {
  summary: string;
  keyDecisions: string[];
  actionItems: { task: string; assignee?: string; dueDate?: string }[];
  participants: string[];
  followUp: string[];
}

function MeetingNotes() {
  const [notes, setNotes] = useState("");
  const [meetingType, setMeetingType] = useState("standup");
  const [detailLevel, setDetailLevel] = useState("standard");
  const [result, setResult] = useState<MeetingResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [editableSummary, setEditableSummary] = useState("");

  async function summarize() {
    if (!notes.trim()) {
      toast.error("Please enter meeting notes");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/meeting", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes, meetingType, detailLevel }),
      });
      if (!res.ok) throw new Error("Failed to summarize");
      const data = (await res.json()) as MeetingResult;
      setResult(data);
      setEditableSummary(data.summary);
    } catch {
      toast.error("Failed to summarize notes. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function copyToClipboard() {
    if (!result) return;
    const text = [
      `Summary: ${editableSummary}`,
      "",
      "Key Decisions:",
      ...result.keyDecisions.map((d) => `- ${d}`),
      "",
      "Action Items:",
      ...result.actionItems.map((a) => `- ${a.task}${a.assignee ? ` (${a.assignee})` : ""}${a.dueDate ? ` by ${a.dueDate}` : ""}`),
      "",
      "Follow-up:",
      ...result.followUp.map((f) => `- ${f}`),
    ].join("\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("Copied to clipboard");
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <StickyNote className="h-6 w-6 text-emerald-600" />
          Meeting Notes Summarizer
        </h1>
        <p className="text-muted-foreground">Transform raw notes into structured summaries with action items.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Meeting Notes</CardTitle>
            <CardDescription>Paste your raw meeting notes here</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Meeting Type</Label>
                <Select value={meetingType} onValueChange={setMeetingType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standup">Standup</SelectItem>
                    <SelectItem value="planning">Planning</SelectItem>
                    <SelectItem value="review">Review</SelectItem>
                    <SelectItem value="brainstorming">Brainstorming</SelectItem>
                    <SelectItem value="client">Client</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Detail Level</Label>
                <Select value={detailLevel} onValueChange={setDetailLevel}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="brief">Brief</SelectItem>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="detailed">Detailed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Raw Notes *</Label>
              <Textarea
                id="notes"
                placeholder="Paste your meeting notes here..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={12}
              />
            </div>
            <Button onClick={summarize} disabled={loading} className="w-full">
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Wand2 className="mr-2 h-4 w-4" />
              )}
              Summarize Notes
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base">Summary</CardTitle>
              <CardDescription>AI-generated meeting summary</CardDescription>
            </div>
            {result && (
              <Button variant="outline" size="icon" onClick={copyToClipboard}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {result ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Summary</Label>
                  <Textarea
                    value={editableSummary}
                    onChange={(e) => setEditableSummary(e.target.value)}
                    rows={4}
                    className="resize-y"
                  />
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>Key Decisions</Label>
                  <div className="flex flex-wrap gap-1.5">
                    {result.keyDecisions.map((d, i) => (
                      <Badge key={i} variant="secondary">{d}</Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Action Items</Label>
                  <div className="space-y-2">
                    {result.actionItems.map((a, i) => (
                      <div key={i} className="flex items-center gap-2 rounded-md border bg-muted/30 px-3 py-2">
                        <div className="h-4 w-4 rounded border border-muted-foreground/30" />
                        <div className="flex-1">
                          <p className="text-sm">{a.task}</p>
                          {(a.assignee || a.dueDate) && (
                            <p className="text-xs text-muted-foreground">
                              {a.assignee} {a.dueDate && `· ${a.dueDate}`}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Follow-up</Label>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    {result.followUp.map((f, i) => (
                      <li key={i}>{f}</li>
                    ))}
                  </ul>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button variant="outline" onClick={() => { setResult(null); setEditableSummary(""); }} className="flex-1">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    New Summary
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex h-64 flex-col items-center justify-center text-center text-muted-foreground">
                <StickyNote className="h-10 w-10 mb-3 opacity-30" />
                <p>Paste your meeting notes and click Summarize</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
