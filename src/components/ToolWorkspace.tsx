import { useServerFn } from "@tanstack/react-start";
import { Check, Copy, Loader2, RotateCcw, Sparkles } from "lucide-react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { generateContent } from "@/lib/ai.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type Field = {
  name: string;
  label: string;
  type: "text" | "textarea" | "select";
  placeholder?: string;
  options?: string[];
  required?: boolean;
  rows?: number;
};

export function ToolWorkspace({
  systemPrompt,
  buildPrompt,
  fields,
  initialValues,
  submitLabel = "Generate with AI",
  outputTitle = "AI draft",
}: {
  systemPrompt: string;
  buildPrompt: (values: Record<string, string>) => string;
  fields: Field[];
  initialValues: Record<string, string>;
  submitLabel?: string;
  outputTitle?: string;
}) {
  const [values, setValues] = useState<Record<string, string>>(initialValues);
  const [output, setOutput] = useState("");
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const generate = useServerFn(generateContent);

  const set = (name: string, value: string) => setValues((v) => ({ ...v, [name]: value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await generate({
        data: { systemPrompt, userPrompt: buildPrompt(values) },
      });
      setOutput(res.text);
      setEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copy = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
      <form onSubmit={onSubmit} className="surface-card h-fit space-y-4 p-5">
        <h2 className="text-sm font-semibold text-foreground">Structured prompt</h2>
        {fields.map((field) => (
          <div key={field.name} className="space-y-2">
            <Label htmlFor={field.name}>{field.label}</Label>
            {field.type === "textarea" && (
              <Textarea
                id={field.name}
                rows={field.rows ?? 6}
                required={field.required}
                placeholder={field.placeholder}
                value={values[field.name] ?? ""}
                onChange={(e) => set(field.name, e.target.value)}
              />
            )}
            {field.type === "text" && (
              <Input
                id={field.name}
                required={field.required}
                placeholder={field.placeholder}
                value={values[field.name] ?? ""}
                onChange={(e) => set(field.name, e.target.value)}
              />
            )}
            {field.type === "select" && (
              <Select value={values[field.name] ?? ""} onValueChange={(v) => set(field.name, v)}>
                <SelectTrigger id={field.name}>
                  <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent>
                  {field.options?.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        ))}
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Sparkles className="size-4" />
          )}
          {loading ? "Generating…" : submitLabel}
        </Button>
        {error && (
          <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>
        )}
      </form>

      <section className="surface-card flex min-h-[24rem] flex-col p-5">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-sm font-semibold text-foreground">{outputTitle}</h2>
          {output && (
            <div className="flex gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setEditing((e) => !e)}>
                <RotateCcw className="size-3.5" />
                {editing ? "Preview" : "Edit"}
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={copy}>
                {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                {copied ? "Copied" : "Copy"}
              </Button>
            </div>
          )}
        </div>

        {!output && !loading && (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center text-sm text-muted-foreground">
            <Sparkles className="size-6 text-primary" />
            Fill in the prompt fields and generate a draft. Everything stays editable.
          </div>
        )}
        {loading && !output && (
          <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
            <Loader2 className="mr-2 size-4 animate-spin" /> Drafting your content…
          </div>
        )}
        {output &&
          (editing ? (
            <Textarea
              value={output}
              onChange={(e) => setOutput(e.target.value)}
              className="min-h-[20rem] flex-1 font-mono text-sm"
            />
          ) : (
            <article className="prose prose-sm max-w-none flex-1 text-sm leading-relaxed text-foreground [&_h1]:mt-4 [&_h2]:mt-4 [&_h3]:mt-3 [&_li]:my-1 [&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:my-2 [&_strong]:font-semibold [&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-5">
              <ReactMarkdown>{output}</ReactMarkdown>
            </article>
          ))}
        {output && (
          <p className="mt-4 border-t border-border pt-3 text-xs text-muted-foreground">
            AI-generated draft — verify facts, names and commitments before use.
          </p>
        )}
      </section>
    </div>
  );
}
