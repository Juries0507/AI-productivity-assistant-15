import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Bot, CalendarCheck, Mail, NotebookPen, Search, ShieldCheck } from "lucide-react";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "WorkFlow AI — AI Workplace Productivity Assistant" },
      {
        name: "description",
        content:
          "Automate workplace tasks with AI: draft emails, summarize meetings, plan tasks, research topics and chat with an AI assistant.",
      },
      { property: "og:title", content: "WorkFlow AI — AI Workplace Productivity Assistant" },
      {
        property: "og:description",
        content:
          "Draft emails, summarize meetings, plan tasks and research faster with a professional AI workspace.",
      },
    ],
  }),
  component: Dashboard,
});

const tools = [
  {
    to: "/email",
    icon: Mail,
    title: "Smart Email Generator",
    text: "Professional emails in the right tone, ready to review and send.",
  },
  {
    to: "/notes",
    icon: NotebookPen,
    title: "Meeting Notes Summarizer",
    text: "Turn raw notes or transcripts into decisions and action items.",
  },
  {
    to: "/planner",
    icon: CalendarCheck,
    title: "AI Task Planner",
    text: "Break goals into prioritized, time-boxed plans you can execute.",
  },
  {
    to: "/research",
    icon: Search,
    title: "AI Research Assistant",
    text: "Structured briefings with key findings, risks and open questions.",
  },
  {
    to: "/chat",
    icon: Bot,
    title: "AI Chatbot",
    text: "Ask anything about your work and iterate in conversation.",
  },
] as const;

function Dashboard() {
  return (
    <AppShell
      title="Dashboard"
      description="Your AI workspace for everyday professional tasks"
    >
      <section className="gradient-hero mb-8 overflow-hidden rounded-2xl px-6 py-10 text-primary-foreground sm:px-10">
        <p className="text-xs font-medium uppercase tracking-widest opacity-80">
          AI Workplace Productivity Assistant
        </p>
        <h2 className="mt-3 max-w-2xl text-2xl font-semibold sm:text-3xl">
          Spend less time on busywork and more time on decisions
        </h2>
        <p className="mt-3 max-w-xl text-sm opacity-90">
          Five focused AI tools with structured prompts and fully editable outputs — built for
          professionals who need reliable, review-ready drafts.
        </p>
        <Link
          to="/email"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-background px-4 py-2.5 text-sm font-medium text-foreground transition-opacity hover:opacity-90"
        >
          Start with an email <ArrowRight className="size-4" />
        </Link>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {tools.map(({ to, icon: Icon, title, text }) => (
          <Link
            key={to}
            to={to}
            className="surface-card group p-5 transition-all hover:-translate-y-0.5 hover:border-primary/40"
          >
            <span className="flex size-10 items-center justify-center rounded-xl bg-secondary text-primary">
              <Icon className="size-5" />
            </span>
            <h3 className="mt-4 text-base font-semibold text-foreground">{title}</h3>
            <p className="mt-1.5 text-sm text-muted-foreground">{text}</p>
            <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
              Open tool <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        ))}
      </div>

      <section className="surface-card mt-8 flex gap-4 p-5">
        <ShieldCheck className="size-5 shrink-0 text-primary" />
        <div>
          <h3 className="text-sm font-semibold text-foreground">Responsible AI use</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Outputs are AI-generated and may contain errors or omissions. Keep a human in the loop,
            avoid entering confidential or personal data, and verify facts, figures and commitments
            before sharing anything externally.
          </p>
        </div>
      </section>
    </AppShell>
  );
}
