import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Send, Copy, Check, Loader2, RefreshCw, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

export const Route = createFileRoute("/email-generator")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — AI Workplace" },
      { name: "description", content: "Generate professional emails with AI tailored to your recipients." },
    ],
  }),
  component: EmailGenerator,
});

interface EmailResult {
  subject: string;
  greeting: string;
  body: string;
  closing: string;
}

function EmailGenerator() {
  const [recipient, setRecipient] = useState("");
  const [subject, setSubject] = useState("");
  const [purpose, setPurpose] = useState("");
  const [tone, setTone] = useState("professional");
  const [keyPoints, setKeyPoints] = useState("");
  const [result, setResult] = useState<EmailResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [editableBody, setEditableBody] = useState("");
  const [editableSubject, setEditableSubject] = useState("");

  async function generate() {
    if (!recipient || !subject || !purpose) {
      toast.error("Please fill in all required fields");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipient, subject, purpose, tone, keyPoints: keyPoints || undefined }),
      });
      if (!res.ok) throw new Error("Failed to generate email");
      const data = (await res.json()) as EmailResult;
      setResult(data);
      setEditableSubject(data.subject);
      setEditableBody(data.body);
    } catch {
      toast.error("Failed to generate email. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function copyToClipboard() {
    const fullEmail = `${result?.greeting}\n\n${editableBody}\n\n${result?.closing}`;
    navigator.clipboard.writeText(fullEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("Copied to clipboard");
  }

  const toneOptions = [
    { value: "professional", label: "Professional" },
    { value: "friendly", label: "Friendly" },
    { value: "formal", label: "Formal" },
    { value: "casual", label: "Casual" },
    { value: "urgent", label: "Urgent" },
  ];

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Mail className="h-6 w-6 text-primary" />
          Smart Email Generator
        </h1>
        <p className="text-muted-foreground">Craft professional emails tailored to your recipients with AI.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Email Details</CardTitle>
            <CardDescription>Fill in the details for your email</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="recipient">Recipient *</Label>
              <Input
                id="recipient"
                placeholder="e.g. John Smith, Marketing Team, Client"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject">Subject Topic *</Label>
              <Input
                id="subject"
                placeholder="e.g. Project Update, Meeting Request, Follow-up"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="purpose">Purpose *</Label>
              <Textarea
                id="purpose"
                placeholder="Describe what you want to communicate..."
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tone">Tone</Label>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger id="tone">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {toneOptions.map((t) => (
                    <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="keyPoints">Key Points (optional)</Label>
              <Textarea
                id="keyPoints"
                placeholder="Any specific points you want included..."
                value={keyPoints}
                onChange={(e) => setKeyPoints(e.target.value)}
                rows={2}
              />
            </div>
            <Button onClick={generate} disabled={loading} className="w-full">
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Wand2 className="mr-2 h-4 w-4" />
              )}
              Generate Email
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base">Generated Email</CardTitle>
              <CardDescription>Review and edit the AI-generated email</CardDescription>
            </div>
            {result && (
              <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={copyToClipboard}>
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            )}
          </CardHeader>
          <CardContent>
            {result ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Subject</Label>
                  <Input
                    value={editableSubject}
                    onChange={(e) => setEditableSubject(e.target.value)}
                  />
                </div>
                <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
                  <p className="text-sm font-medium text-muted-foreground">{result.greeting}</p>
                  <Separator />
                  <Textarea
                    value={editableBody}
                    onChange={(e) => setEditableBody(e.target.value)}
                    rows={8}
                    className="resize-y"
                  />
                  <Separator />
                  <p className="text-sm font-medium text-muted-foreground">{result.closing}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => { setResult(null); setEditableBody(""); setEditableSubject(""); }} className="flex-1">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    New Email
                  </Button>
                  <Button onClick={generate} className="flex-1">
                    <Send className="mr-2 h-4 w-4" />
                    Regenerate
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex h-64 flex-col items-center justify-center text-center text-muted-foreground">
                <Mail className="h-10 w-10 mb-3 opacity-30" />
                <p>Fill in the details and click Generate to create your email</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
