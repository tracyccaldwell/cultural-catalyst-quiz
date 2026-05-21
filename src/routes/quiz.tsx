import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { z } from "zod";
import {
  CATALYST_QUESTIONS,
  FILTER_QUESTION,
  LEVEL_QUESTIONS,
  LIKERT_LABELS,
  resolveArchetype,
  scoreQuiz,
  type Likert,
} from "@/lib/quiz";
import { hashEmail, identify, track } from "@/lib/analytics";

export const Route = createFileRoute("/quiz")({
  component: QuizPage,
  head: () => ({ meta: [{ title: "Take the assessment | Cultural Catalysts" }] }),
});

const ALL_QUESTIONS = [
  { ...FILTER_QUESTION, part: 0 as const },
  ...CATALYST_QUESTIONS.map((q) => ({ ...q, part: 1 as const })),
  ...LEVEL_QUESTIONS.map((q) => ({ ...q, part: 2 as const })),
];
const TOTAL_STEPS = ALL_QUESTIONS.length + 1; // +1 for email gate

const leadSchema = z.object({
  name: z.string().trim().min(1, "Please enter your name").max(100),
  email: z.string().trim().email("Please enter a valid email").max(255),
});

function QuizPage() {
  const navigate = useNavigate();
  const [stepIdx, setStepIdx] = useState(0); // 0..ALL_QUESTIONS.length (last = gate)
  const [answers, setAnswers] = useState<Record<string, Likert>>({});
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const isGate = stepIdx === ALL_QUESTIONS.length;
  const currentQ = isGate ? null : ALL_QUESTIONS[stepIdx];
  const progress = ((stepIdx + 1) / TOTAL_STEPS) * 100;

  const partLabel = isGate
    ? "Almost there"
    : currentQ!.part === 0
      ? "Getting started"
      : currentQ!.part === 1
        ? "Part 1 · Cultural Catalyst"
        : "Part 2 · Levels of Leadership";

  const stepLabel = isGate
    ? `${TOTAL_STEPS} of ${TOTAL_STEPS}`
    : `${stepIdx + 1} of ${TOTAL_STEPS}`;

  function selectAnswer(value: Likert) {
    if (!currentQ) return;
    const next = { ...answers, [currentQ.id]: value };
    setAnswers(next);
    // Auto-advance after a short pause for feedback
    setTimeout(() => {
      if (stepIdx === CATALYST_QUESTIONS.length - 1) track("part1_completed");
      if (stepIdx === ALL_QUESTIONS.length - 1) track("part2_completed");
      setStepIdx((i) => i + 1);
    }, 180);
  }

  function goBack() {
    if (stepIdx === 0) return;
    setStepIdx((i) => i - 1);
  }

  const scores = useMemo(() => {
    const cat: Record<string, Likert> = {};
    const lvl: Record<string, Likert> = {};
    for (const q of CATALYST_QUESTIONS) if (answers[q.id]) cat[q.id] = answers[q.id];
    for (const q of LEVEL_QUESTIONS) if (answers[q.id]) lvl[q.id] = answers[q.id];
    const filter = (answers[FILTER_QUESTION.id] ?? 3) as Likert;
    return scoreQuiz(cat, lvl, filter);
  }, [answers]);

  async function handleSubmitLead(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const parsed = leadSchema.safeParse({ name, email });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Please check your details");
      return;
    }
    setSubmitting(true);
    const archetype = resolveArchetype(scores);
    const payload = {
      name: parsed.data.name,
      email: parsed.data.email,
      archetype,
      catalystScore: scores.catalystScore,
      leadershipLevel: scores.leadershipLevel,
      levelSubscores: scores.levelSubscores,
      completedAt: new Date().toISOString(),
      source: "culturalcatalysts-quiz",
    };

    const webhookUrl = import.meta.env.VITE_CLICKFUNNELS_WEBHOOK_URL as string | undefined;
    if (webhookUrl) {
      try {
        await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          mode: "no-cors",
        });
      } catch (err) {
        console.error("Webhook failed", err);
        track("webhook_failed", { archetype });
      }
    }

    try {
      const id = await hashEmail(parsed.data.email);
      identify(id, { archetype });
      track("email_submitted", { archetype });
    } catch {
      // ignore
    }

    navigate({
      to: "/result/$archetype",
      params: { archetype },
      search: {
        c: scores.catalystScore,
        l: scores.leadershipLevel,
      },
    });
  }

  return (
    <main className="min-h-screen px-6 py-10 sm:py-16">
      <div className="mx-auto max-w-xl">
        {/* Progress */}
        <div className="mb-10">
          <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-[color:var(--color-brand-ink-soft)]">
            <span>{partLabel}</span>
            <span>{stepLabel}</span>
          </div>
          <div className="mt-3 h-[2px] w-full overflow-hidden rounded-full bg-[color:var(--color-brand-line)]">
            <div
              className="h-full bg-[color:var(--color-brand-gold)] transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {currentQ ? (
          <div key={currentQ.id} className="animate-in fade-in duration-300">
            <h1 className="text-balance text-2xl leading-snug sm:text-3xl">
              {currentQ.text}
            </h1>
            <div className="mt-10 flex flex-col gap-3">
              {([1, 2, 3, 4, 5] as Likert[]).map((v) => {
                const selected = answers[currentQ.id] === v;
                return (
                  <button
                    key={v}
                    type="button"
                    onClick={() => selectAnswer(v)}
                    className={`group flex items-center justify-between rounded-full border px-6 py-4 text-left text-base transition ${
                      selected
                        ? "border-[color:var(--color-brand-gold)] bg-[color:var(--color-brand-gold)]/15 text-[color:var(--color-brand-ink)]"
                        : "border-[color:var(--color-brand-line)] bg-white/40 text-[color:var(--color-brand-ink)] hover:border-[color:var(--color-brand-gold)] hover:bg-white"
                    }`}
                  >
                    <span>{LIKERT_LABELS[v - 1]}</span>
                    <span
                      className={`flex h-6 w-6 items-center justify-center rounded-full border text-xs ${
                        selected
                          ? "border-[color:var(--color-brand-gold)] bg-[color:var(--color-brand-gold)] text-[color:var(--color-brand-ink)]"
                          : "border-[color:var(--color-brand-line)] text-[color:var(--color-brand-ink-soft)] group-hover:border-[color:var(--color-brand-gold)]"
                      }`}
                    >
                      {v}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmitLead} className="animate-in fade-in duration-300">
            <h1 className="text-balance text-3xl leading-snug sm:text-4xl">
              You're done. Where should we send your result?
            </h1>
            <p className="mt-4 text-[color:var(--color-brand-ink-soft)]">
              Add your name and email to reveal your Cultural Catalyst archetype and your
              current Maxwell level.
            </p>
            <div className="mt-10 space-y-5">
              <div>
                <label htmlFor="name" className="text-xs uppercase tracking-[0.2em] text-[color:var(--color-brand-ink-soft)]">
                  First name
                </label>
                <input
                  id="name"
                  type="text"
                  autoComplete="given-name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={100}
                  className="mt-2 w-full rounded-full border border-[color:var(--color-brand-line)] bg-white/70 px-6 py-4 text-base outline-none transition focus:border-[color:var(--color-brand-gold)] focus:bg-white"
                  placeholder="Jane"
                />
              </div>
              <div>
                <label htmlFor="email" className="text-xs uppercase tracking-[0.2em] text-[color:var(--color-brand-ink-soft)]">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  maxLength={255}
                  className="mt-2 w-full rounded-full border border-[color:var(--color-brand-line)] bg-white/70 px-6 py-4 text-base outline-none transition focus:border-[color:var(--color-brand-gold)] focus:bg-white"
                  placeholder="jane@example.com"
                />
              </div>
              {error ? (
                <p className="text-sm text-red-700">{error}</p>
              ) : null}
              <button
                type="submit"
                disabled={submitting}
                className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-[color:var(--color-brand-ink)] px-10 py-4 text-sm font-medium tracking-wide text-[color:var(--color-brand-bg)] transition hover:bg-[color:var(--color-brand-gold)] hover:text-[color:var(--color-brand-ink)] disabled:opacity-60"
              >
                {submitting ? "Revealing…" : "Reveal my result"}
              </button>
              <p className="text-center text-xs text-[color:var(--color-brand-ink-soft)]">
                We'll only use your email to share insights from Cultural Catalysts.
              </p>
            </div>
          </form>
        )}

        <div className="mt-12 flex items-center justify-between text-xs text-[color:var(--color-brand-ink-soft)]">
          <button
            type="button"
            onClick={goBack}
            disabled={stepIdx === 0}
            className="underline-offset-4 hover:underline disabled:opacity-30"
          >
            ← Back
          </button>
          {!isGate ? <span>Tap an answer to continue</span> : <span />}
        </div>
      </div>
    </main>
  );
}