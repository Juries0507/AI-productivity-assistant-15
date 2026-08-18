import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ToolWorkspace } from "@/components/ToolWorkspace";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner — WorkFlow AI" },
      {
        name: "description",
        content:
          "Break goals into a prioritized, time-boxed task plan with milestones, dependencies and effort estimates.",
      },
      { property: "og:title", content: "AI Task Planner — WorkFlow AI" },
      {
        property: "og:description",
        content: "Turn goals into prioritized, realistic task plans you can edit and execute.",
      },
    ],
  }),
  component: PlannerPage,
});

function PlannerPage() {
  return (
    <AppShell title="AI Task Planner" description="Turn goals into a prioritized plan of action">
      <ToolWorkspace
        outputTitle="Task plan"
        submitLabel="Build plan"
        systemPrompt="You are a pragmatic project planner. Produce realistic, prioritized plans in markdown with sections: Objective, Priorities (MoSCoW), Task Plan (a table with task, priority, effort, suggested day/slot), Milestones, Dependencies & Risks. Keep the plan achievable within the stated time budget and flag when scope exceeds capacity."
        fields={[
          { name: "goal", label: "Goal or project", type: "textarea", required: true, rows: 4, placeholder: "What do you need to accomplish?" },
          { name: "tasks", label: "Known tasks or constraints", type: "textarea", rows: 5, placeholder: "One per line (optional)" },
          { name: "timeframe", label: "Timeframe", type: "select", options: ["Today", "This week", "Two weeks", "This month", "This quarter"] },
          { name: "capacity", label: "Available time per day", type: "text", placeholder: "e.g. 3 focused hours" },
          { name: "style", label: "Working style", type: "select", options: ["Deep work blocks", "Short sprints", "Meeting-heavy schedule"] },
        ]}
        initialValues={{ goal: "", tasks: "", timeframe: "This week", capacity: "", style: "Deep work blocks" }}
        buildPrompt={(v) =>
          `Create a task plan.\n\nGoal: ${v.goal}\nKnown tasks/constraints:\n${v.tasks || "(none provided)"}\nTimeframe: ${v.timeframe}\nDaily capacity: ${v.capacity || "not specified"}\nWorking style: ${v.style}`
        }
      />
    </AppShell>
  );
}
