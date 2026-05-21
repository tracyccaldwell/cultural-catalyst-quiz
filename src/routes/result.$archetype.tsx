import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect } from "react";
import { z } from "zod";
import { ARCHETYPES, ARCHETYPE_ORDER, LEVEL_NAMES, type Archetype } from "@/lib/quiz";
import { track } from "@/lib/analytics";

const searchSchema = z.object({
  c: z.coerce.number().min(0).max(30).optional(),
  l: z.coerce.number().min(1).max(5).optional(),
});

export const Route = createFileRoute("/result/$archetype")({
  validateSearch: searchSchema,
  beforeLoad: ({ params }) => {
    if (!(params.archetype in ARCHETYPES)) throw notFound();
  },
  component: ResultPage,
  head: ({ params }) => {
    const a = ARCHETYPES[params.archetype as Archetype];
    const name = a?.name ?? "Your result";
    return {
      meta: [
        { title: `${name} | Cultural Catalyst Quiz` },
        { name: "description", content: a?.description ?? "" },
        { property: "og:title", content: `I'm ${name} — Cultural Catalyst Quiz` },
        { property: "og:description", content: a?.tagline ?? "" },
      ],
    };
  },
});

function ResultPage() {
  const { archetype } = Route.useParams();
  const { c, l } = Route.useSearch();
  const a = ARCHETYPES[archetype as Archetype];

  useEffect(() => {
    track("result_viewed", { archetype, catalystScore: c, leadershipLevel: l });
  }, [archetype, c, l]);

  return (
    <main className="min-h-screen px-6 py-16 sm:py-24">
      <div className="mx-auto max-w-2xl">
        <p className="text-center text-xs uppercase tracking-[0.25em] text-[color:var(--color-brand-gold)]">
          You are
        </p>
        <h1 className="mt-4 text-center text-balance text-4xl leading-[1.05] sm:text-6xl">
          <em className="italic">{a.name}</em>
        </h1>
        <p className="mt-6 text-center text-lg text-[color:var(--color-brand-ink-soft)]">
          {a.tagline}
        </p>

        <div className="my-12 h-px w-full bg-[color:var(--color-brand-line)]" />

        <p className="text-lg leading-relaxed">{a.description}</p>

        {l ? (
          <div className="mt-10 rounded-2xl border border-[color:var(--color-brand-line)] bg-white/60 p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--color-brand-ink-soft)]">
              Your current Maxwell level
            </p>
            <p className="mt-2 text-2xl">
              <span className="font-serif italic">Level {l}</span> —{" "}
              {LEVEL_NAMES[l as 1 | 2 | 3 | 4 | 5]}
            </p>
            <p className="mt-4 text-[color:var(--color-brand-ink-soft)]">{a.growth}</p>
          </div>
        ) : null}

        {/* Archetype ladder */}
        <div className="mt-12">
          <p className="mb-4 text-xs uppercase tracking-[0.2em] text-[color:var(--color-brand-ink-soft)]">
            The six archetypes
          </p>
          <ol className="space-y-2">
            {ARCHETYPE_ORDER.map((key, i) => {
              const item = ARCHETYPES[key];
              const isMe = key === archetype;
              return (
                <li
                  key={key}
                  className={`flex items-center gap-4 rounded-full px-5 py-3 text-sm transition ${
                    isMe
                      ? "bg-[color:var(--color-brand-gold)]/20 text-[color:var(--color-brand-ink)]"
                      : "text-[color:var(--color-brand-ink-soft)]"
                  }`}
                >
                  <span className="font-mono text-xs">{i}</span>
                  <span className={isMe ? "font-medium" : ""}>{item.name}</span>
                </li>
              );
            })}
          </ol>
        </div>

        <div className="mt-14 flex flex-col items-center gap-4">
          <a
            href="https://www.culturalcatalysts.net/"
            onClick={() => track("cta_clicked", { archetype })}
            className="inline-flex items-center justify-center rounded-full bg-[color:var(--color-brand-ink)] px-10 py-4 text-sm font-medium tracking-wide text-[color:var(--color-brand-bg)] transition hover:bg-[color:var(--color-brand-gold)] hover:text-[color:var(--color-brand-ink)]"
          >
            Explore Cultural Catalysts
          </a>
          <Link to="/" className="text-xs text-[color:var(--color-brand-ink-soft)] underline-offset-4 hover:underline">
            Retake the assessment
          </Link>
        </div>
      </div>
    </main>
  );
}