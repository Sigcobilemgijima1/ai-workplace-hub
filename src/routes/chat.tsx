import { createFileRoute } from "@tanstack/react-router";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import {
  MessageSquare,
  Send,
  Loader2,
  Bot,
  User,
  Copy,
  Check,
  RotateCcw,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "AI Chat — AI Workplace" },
      { name: "description", content: "Chat with AI to get workplace assistance." },
    ],
  }),
  component: ChatInterface,
});

const chatTransport = new DefaultChatTransport({ api: "/api/chat" });

function ChatInterface() {
  const { messages, sendMessage, status, error, reload } = useChat({
    transport: chatTransport,
  });
  const [input, setInput] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isLoading = status === "submitted" || status === "streaming";

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    textareaRef.current?.focus();
  }, [messages, status]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    const text = input.trim();
    setInput("");
    await sendMessage({ text });
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleSubmit(e);
    }
  }

  function copyMessage(text: string, id: string) {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    toast.success("Copied to clipboard");
  }

  return (
    <div className="mx-auto flex h-[calc(100vh-7rem)] max-w-4xl flex-col">
      <div className="mb-4 space-y-1">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <MessageSquare className="h-6 w-6 text-rose-600" />
          AI Chatbot
        </h1>
        <p className="text-muted-foreground">Ask anything and get AI-powered assistance in real time.</p>
      </div>

      <Card className="flex flex-1 flex-col overflow-hidden">
        <CardContent className="flex flex-1 flex-col p-0">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="flex h-full flex-col items-center justify-center text-center text-muted-foreground">
                <Bot className="h-12 w-12 mb-4 opacity-30" />
                <h3 className="text-lg font-semibold text-foreground">How can I help you today?</h3>
                <p className="max-w-sm mt-2 text-sm">
                  Ask me anything about workplace productivity — emails, meetings, tasks, research, or general advice.
                </p>
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-lg">
                  {[
                    "Help me write a follow-up email",
                    "Summarize this meeting for me",
                    "Plan my week ahead",
                    "Research trends in my industry",
                  ].map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => {
                        setInput(suggestion);
                        textareaRef.current?.focus();
                      }}
                      className="rounded-lg border bg-muted/50 px-3 py-2 text-left text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((message) => {
              const text = message.parts
                .filter((p) => p.type === "text")
                .map((p) => p.text)
                .join("");
              const isUser = message.role === "user";

              return (
                <div
                  key={message.id}
                  className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
                >
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                      isUser
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                  </div>
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      isUser
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground"
                    }`}
                  >
                    {isUser ? (
                      <p className="text-sm whitespace-pre-wrap">{text}</p>
                    ) : (
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        <ReactMarkdown>{text}</ReactMarkdown>
                      </div>
                    )}
                    <div className="mt-2 flex items-center gap-1">
                      <button
                        onClick={() => copyMessage(text, message.id)}
                        className="rounded p-1 text-xs opacity-0 transition-opacity hover:bg-black/5 group-hover:opacity-100"
                        style={{ opacity: copiedId === message.id ? 1 : undefined }}
                        title="Copy"
                      >
                        {copiedId === message.id ? (
                          <Check className="h-3 w-3" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="rounded-2xl bg-muted px-4 py-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Thinking...
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="flex gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                  <AlertTriangle className="h-4 w-4" />
                </div>
                <div className="rounded-2xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  <p>Something went wrong. {error.message || "Please try again."}</p>
                  <Button variant="outline" size="sm" className="mt-2" onClick={() => reload()}>
                    <RotateCcw className="mr-2 h-3 w-3" />
                    Retry
                  </Button>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          <div className="border-t bg-card p-4">
            <form onSubmit={handleSubmit} className="flex items-end gap-2">
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything..."
                rows={1}
                className="min-h-[44px] resize-none"
                disabled={isLoading}
              />
              <Button type="submit" disabled={isLoading || !input.trim()} size="icon" className="h-[44px] w-[44px] shrink-0">
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </form>
            <p className="mt-2 text-center text-[10px] text-muted-foreground">
              AI outputs are suggestions. Always review before use.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
