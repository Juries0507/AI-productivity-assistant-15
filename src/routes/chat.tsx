import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Bot, Loader2, Send, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { chatWithAssistant } from "@/lib/ai.functions";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "AI Chatbot — WorkFlow AI" },
      {
        name: "description",
        content:
          "Chat with an AI workplace assistant to brainstorm, rewrite, plan and solve everyday professional tasks.",
      },
      { property: "og:title", content: "AI Chatbot — WorkFlow AI" },
      {
        property: "og:description",
        content: "A conversational AI assistant for everyday workplace tasks.",
      },
    ],
  }),
  component: ChatPage,
});

type Message = { role: "user" | "assistant"; content: string };

const suggestions = [
  "Rewrite this message to sound more confident",
  "Help me prepare an agenda for a 30-minute status meeting",
  "What questions should I ask in a vendor evaluation?",
];

function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const send = useServerFn(chatWithAssistant);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const submit = async (text: string) => {
    const content = text.trim();
    if (!content || loading) return;
    const next: Message[] = [...messages, { role: "user", content }];
    setMessages(next);
    setInput("");
    setLoading(true);
    setError(null);
    try {
      const res = await send({ data: { messages: next } });
      setMessages([...next, { role: "assistant", content: res.text }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "The assistant could not reply. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell title="AI Chatbot" description="Ask, iterate and refine with your AI assistant">
      <div className="surface-card flex h-[calc(100vh-14rem)] min-h-[30rem] flex-col">
        <div className="flex-1 space-y-4 overflow-y-auto p-5">
          {messages.length === 0 && (
            <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
              <span className="gradient-hero flex size-12 items-center justify-center rounded-2xl">
                <Bot className="size-6 text-primary-foreground" />
              </span>
              <p className="max-w-sm text-sm text-muted-foreground">
                Start a conversation about your work. Try one of these:
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => submit(s)}
                    className="rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}
            >
              <span
                className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${
                  m.role === "user" ? "bg-secondary text-secondary-foreground" : "gradient-hero text-primary-foreground"
                }`}
              >
                {m.role === "user" ? <User className="size-4" /> : <Bot className="size-4" />}
              </span>
              <div
                className={`max-w-[85%] rounded-xl px-4 py-3 text-sm leading-relaxed ${
                  m.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground"
                } [&_li]:my-1 [&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:my-1.5 [&_strong]:font-semibold [&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-5`}
              >
                <ReactMarkdown>{m.content}</ReactMarkdown>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" /> Thinking…
            </div>
          )}
          {error && (
            <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>
          )}
          <div ref={endRef} />
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            void submit(input);
          }}
          className="flex items-end gap-2 border-t border-border p-4"
        >
          <Textarea
            value={input}
            rows={1}
            placeholder="Ask your assistant anything about your work…"
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void submit(input);
              }
            }}
            className="max-h-40 min-h-11 flex-1 resize-none"
          />
          <Button type="submit" size="icon" disabled={loading || !input.trim()} aria-label="Send message">
            <Send className="size-4" />
          </Button>
        </form>
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        This assistant can make mistakes and has no access to your internal systems. Verify
        important information and avoid sharing confidential data.
      </p>
    </AppShell>
  );
}
