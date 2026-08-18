import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ToolWorkspace } from "@/components/ToolWorkspace";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant — WorkFlow AI" },
      {
        name: "description",
        content:
          "Get structured research briefings with key findings, comparisons, risks and open questions for work topics.",
      },
      { property: "og:title", content: "AI Research Assistant — WorkFlow AI" },
      {
        property: "og:description",
        content: "Structured AI research briefings for professionals, with verification prompts.",
      },
    ],
  }),
  component: ResearchPage,
});

function ResearchPage() {
  return (
    <AppShell
      title="AI Research Assistant"
      description="Structured briefings on any work topic"
    >
      <ToolWorkspace
        outputTitle="Research brief"
        submitLabel="Research topic"
        systemPrompt="You are a research analyst. Produce a structured markdown brief with sections: Executive Summary, Key Findings, Considerations & Trade-offs, Risks, Open Questions, Suggested Next Steps. You have no live web access and no citations: never fabricate sources, statistics, quotes or dates. Clearly label uncertain or time-sensitive claims as 'needs verification'."
        fields={[
          { name: "topic", label: "Topic or question", type: "textarea", required: true, rows: 4, placeholder: "What do you want to understand?" },
          { name: "context", label: "Business context", type: "textarea", rows: 4, placeholder: "Industry, company size, current situation (optional)" },
          { name: "audience", label: "Audience", type: "select", options: ["Executive leadership", "Team members", "Client", "Technical team", "Myself"] },
          { name: "depth", label: "Depth", type: "select", options: ["Quick overview", "Standard brief", "In-depth analysis"] },
        ]}
        initialValues={{ topic: "", context: "", audience: "Executive leadership", depth: "Standard brief" }}
        buildPrompt={(v) =>
          `Research the following topic.\n\nTopic: ${v.topic}\nContext: ${v.context || "not specified"}\nAudience: ${v.audience}\nDepth: ${v.depth}`
        }
      />
    </AppShell>
  );
}
