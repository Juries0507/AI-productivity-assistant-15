# AI Workplace Productivity Assistant

A single, integrated AI-powered platform that helps professionals automate everyday
workplace tasks — writing emails, summarising meetings, planning work, researching
topics and asking an in-app assistant — from one modern dashboard.

Built for **AI Skills Acceleration 14 (ASA 14) — CPT Week 14**.

## Project Overview

This is **one integrated application**, not several separate tools. A persistent
sidebar dashboard hosts five AI features that share the same design system, prompt
architecture and responsible-AI safeguards. Every feature turns a short structured
form into a well-engineered prompt, sends it to Lovable AI, and returns an output
the user can read, edit and copy.

## Features

| Feature | What it does |
| --- | --- |
| **Smart Email Generator** | Professional emails from a few inputs, with tone (formal, friendly, persuasive, apologetic…) and length control. |
| **Meeting Notes Summarizer** | Condenses long notes/transcripts into a summary plus decisions, action items with owners, and deadlines. |
| **AI Task Planner** | Builds daily/weekly schedules, prioritising work (MoSCoW) with time blocks and dependencies. |
| **AI Research Assistant** | Structured briefings on any topic: summary, key findings, insights, risks and recommendations. |
| **AI Chatbot Interface** | Conversational workplace assistant with message history and suggested prompts. |

## Prompt Engineering

Each tool uses a two-part prompt:

- A **system prompt** that fixes the assistant's role, output format and constraints
  (e.g. "You are an executive communication specialist… return only the email body").
- A **structured user prompt** assembled from labelled form fields (audience, tone,
  goal, context, deadlines), so the model receives explicit, unambiguous instructions
  rather than free-form text.

Outputs are rendered as Markdown and can be switched into an editable text view —
the human stays in control of the final wording.

## Responsible AI

- A persistent disclaimer in the sidebar and page footer on every screen.
- A per-output reminder to verify facts, names and commitments before use.
- Guidance not to submit confidential or personal data.
- Human-in-the-loop by design: every AI output is editable before it is used.
- API keys and prompts stay server-side; nothing sensitive is exposed to the browser.

## Design & UX

- Dashboard layout with fixed sidebar navigation (collapsible drawer on mobile).
- Fully responsive from small phones to wide desktops.
- Clean, professional SaaS aesthetic: light-blue and purple palette, Space Grotesk
  headings, Plus Jakarta Sans body text, soft card surfaces.
- Clear input (left) / output (right) split in every tool, with loading, error,
  copy and edit states.

## Tools Used

- **TanStack Start** (React 19 + Vite 7) — routing, SSR and typed server functions
- **TypeScript**
- **Tailwind CSS v4** — CSS-first design tokens
- **shadcn/ui** + **lucide-react** — UI components and icons
- **Lovable AI** via the **Vercel AI SDK** (`google/gemini-3.6-flash`)
- **react-markdown** — rendering AI output
- **Lovable** — build platform

## Project Structure

```text
src/
  components/
    AppShell.tsx        # dashboard shell: sidebar, header, disclaimers
    ToolWorkspace.tsx   # reusable prompt form + editable output panel
  lib/
    ai-gateway.server.ts  # Lovable AI provider (server only)
    ai.functions.ts       # generateContent / chatWithAssistant server functions
  routes/
    index.tsx     # dashboard
    email.tsx     # Smart Email Generator
    notes.tsx     # Meeting Notes Summarizer
    planner.tsx   # AI Task Planner
    research.tsx  # AI Research Assistant
    chat.tsx      # AI Chatbot Interface
```

## Setup Instructions

Requires Node.js 20+ and npm.

```sh
git clone <this-repository-url>
cd <repository-name>
npm install
npm run dev
```

The app runs at `http://localhost:8080`.

AI features need a `LOVABLE_API_KEY` environment variable, which Lovable provisions
automatically when the project runs on the platform.

## Team Members

- Add your name(s) here before submitting.
