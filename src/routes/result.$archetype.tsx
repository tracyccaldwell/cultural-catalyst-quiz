import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect } from "react";
import { z } from "zod";
import { ARCHETYPES, type Archetype } from "@/lib/quiz";
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

        <div className="mt-10 rounded-2xl border border-[color:var(--color-brand-line)] bg-white/60 p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--color-brand-gold)]">
            Your growth edge
          </p>
          <p className="mt-3 text-[color:var(--color-brand-ink)] leading-relaxed">{a.growth}</p>
        </div>

        <div className="mt-6 rounded-2xl border border-[color:var(--color-brand-line)] bg-white/60 p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--color-brand-gold)]">
            Resources for your growth
          </p>
          {archetype === "essential-leader" ? (
            <p className="mt-3 text-[color:var(--color-brand-ink)] leading-relaxed">
              Get clear on your cultural contribution and your ideal vision for your life through{" "}
              <a
                href="https://www.mindvalley.com/lifebook"
                onClick={() => track("resource_clicked", { archetype, type: "lifebook" })}
                className="underline underline-offset-4 hover:text-[color:var(--color-brand-gold)]"
              >
                Lifebook
              </a>
              .
            </p>
          ) : a.index <= 2 ? (
            <p className="mt-3 text-[color:var(--color-brand-ink)] leading-relaxed">
              Expand your leadership capacity through the{" "}
              <a
                href="https://bdea7q3yitht9z5kxk3xvkz4vh.hop.clickbank.net/"
                onClick={() => track("resource_clicked", { archetype, type: "world_tapping_circle" })}
                className="underline underline-offset-4 hover:text-[color:var(--color-brand-gold)]"
              >
                World Tapping Circle
              </a>
              .
            </p>
          ) : a.index <= 4 ? (
            <p className="mt-3 text-[color:var(--color-brand-ink)] leading-relaxed">
              Join our in-person leadership councils in Boulder, CO or online at{" "}
              <a
                href="https://www.culturalcatalysts.net/"
                onClick={() => track("resource_clicked", { archetype, type: "cultural_catalysts" })}
                className="underline underline-offset-4 hover:text-[color:var(--color-brand-gold)]"
              >
                culturalcatalysts.net
              </a>
              .
            </p>
          ) : (
            <p className="mt-3 text-[color:var(--color-brand-ink)] leading-relaxed">
              If you'd like to get involved, reach out directly at{" "}
              <a
                href="mailto:tracy@culturalcatalysts.net"
                onClick={() => track("resource_clicked", { archetype, type: "email_tracy" })}
                className="underline underline-offset-4 hover:text-[color:var(--color-brand-gold)]"
              >
                tracy@culturalcatalysts.net
              </a>
              .
            </p>
          )}
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
            Retake the quiz
          </Link>
        </div>
      </div>
    </main>
  );
}