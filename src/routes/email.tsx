import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ToolWorkspace } from "@/components/ToolWorkspace";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — WorkFlow AI" },
      {
        name: "description",
        content:
          "Generate professional workplace emails with the right tone, length and call to action, then edit before sending.",
      },
      { property: "og:title", content: "Smart Email Generator — WorkFlow AI" },
      {
        property: "og:description",
        content: "AI-drafted professional emails with structured prompts and editable output.",
      },
    ],
  }),
  component: EmailPage,
});

function EmailPage() {
  return (
    <AppShell
      title="Smart Email Generator"
      description="Draft clear, professional emails in seconds"
    >
      <ToolWorkspace
        outputTitle="Email draft"
        submitLabel="Generate email"
        systemPrompt="You are an expert business communication writer. Write clear, concise, professional emails. Return a subject line followed by the email body in markdown. Never invent facts, names, dates or numbers that were not provided; use clearly marked placeholders like [date] instead."
        fields={[
          { name: "recipient", label: "Recipient & relationship", type: "text", required: true, placeholder: "e.g. Client, Head of Operations" },
          { name: "purpose", label: "Purpose of the email", type: "textarea", required: true, rows: 4, placeholder: "What do you need to communicate or request?" },
          { name: "points", label: "Key points to include", type: "textarea", rows: 4, placeholder: "One point per line (optional)" },
          { name: "tone", label: "Tone", type: "select", options: ["Professional", "Friendly", "Formal", "Persuasive", "Apologetic", "Direct"] },
          { name: "length", label: "Length", type: "select", options: ["Short", "Medium", "Detailed"] },
        ]}
        initialValues={{ recipient: "", purpose: "", points: "", tone: "Professional", length: "Medium" }}
        buildPrompt={(v) =>
          `Write a workplace email.\n\nRecipient: ${v['recipient']}\nPurpose: ${v['purpose']}\nKey points:\n${v['points'] || "(none provided)"}\nTone: ${v['tone']}\nLength: ${v['length']}\n\nReturn:\n**Subject:** <subject line>\n\nThen the email body with a suitable greeting and sign-off using [Your name].`
        }
      />
    </AppShell>
  );
}
