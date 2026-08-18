import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ToolWorkspace } from "@/components/ToolWorkspace";

export const Route = createFileRoute("/notes")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer — WorkFlow AI" },
      {
        name: "description",
        content:
          "Turn messy meeting notes or transcripts into a structured summary with decisions, action items and owners.",
      },
      { property: "og:title", content: "Meeting Notes Summarizer — WorkFlow AI" },
      {
        property: "og:description",
        content: "AI summaries of meetings with decisions, owners, deadlines and follow-ups.",
      },
    ],
  }),
  component: NotesPage,
});

function NotesPage() {
  return (
    <AppShell
      title="Meeting Notes Summarizer"
      description="From raw notes to decisions and action items"
    >
      <ToolWorkspace
        outputTitle="Meeting summary"
        submitLabel="Summarize meeting"
        systemPrompt="You are a meticulous executive assistant. Summarize meetings faithfully using only the information supplied. Never invent attendees, decisions, dates or owners; write 'not specified' when information is missing. Use markdown with the sections: Summary, Key Decisions, Action Items (owner — task — due date), Risks & Open Questions, Suggested Follow-ups."
        fields={[
          { name: "title", label: "Meeting title", type: "text", placeholder: "e.g. Q3 roadmap review" },
          { name: "attendees", label: "Attendees", type: "text", placeholder: "Comma separated (optional)" },
          { name: "notes", label: "Raw notes or transcript", type: "textarea", required: true, rows: 12, placeholder: "Paste your notes or transcript here" },
          { name: "detail", label: "Summary detail", type: "select", options: ["Concise", "Balanced", "Detailed"] },
        ]}
        initialValues={{ title: "", attendees: "", notes: "", detail: "Balanced" }}
        buildPrompt={(v) =>
          `Summarize the following meeting.\n\nTitle: ${v.title || "not specified"}\nAttendees: ${v.attendees || "not specified"}\nDetail level: ${v.detail}\n\nNotes/transcript:\n"""\n${v.notes}\n"""`
        }
      />
    </AppShell>
  );
}
