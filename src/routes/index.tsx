import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { track } from "@/lib/analytics";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "What type of Cultural Catalyst are you? | Cultural Catalysts" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Quiz",
          name: "What type of Cultural Catalyst are you?",
          about:
            "Self-assessment combining cultural catalyst alignment with John Maxwell's 5 Levels of Leadership.",
          educationalLevel: "Professional",
          provider: {
            "@type": "Organization",
            name: "Cultural Catalysts",
            url: "https://www.culturalcatalysts.net/",
          },
        }),
      },
    ],
  }),
});

function Index() {
  useEffect(() => {
    track("landing_viewed");
  }, []);

  return (
    <main className="min-h-screen px-6 py-16 sm:py-24">
      <div className="mx-auto max-w-2xl text-center">
        <p className="mb-6 text-xs uppercase tracking-[0.25em] text-[color:var(--color-brand-gold)]">
          Cultural Catalysts · Free quiz
        </p>
        <h1 className="text-balance text-4xl leading-[1.05] sm:text-6xl">
          What type of <em className="italic">Cultural Catalyst</em> are you?
        </h1>
        <p className="mx-auto mt-8 max-w-xl text-lg leading-relaxed text-[color:var(--color-brand-ink-soft)]">
          A quiz to reveal your impact as a Cultural Catalyst and the key to
          your next level of leadership.
        </p>

        <ul className="mx-auto mt-10 grid max-w-md gap-3 text-left text-sm text-[color:var(--color-brand-ink-soft)]">
          <li className="flex gap-3">
            <span className="text-[color:var(--color-brand-gold)]">◆</span>
            <span>Takes about 4 minutes. No login.</span>
          </li>
          <li className="flex gap-3">
            <span className="text-[color:var(--color-brand-gold)]">◆</span>
            <span>Personalized archetype with your next growth step.</span>
          </li>
          <li className="flex gap-3">
            <span className="text-[color:var(--color-brand-gold)]">◆</span>
            <span>Built on Maxwell's 5 Levels framework.</span>
          </li>
        </ul>

        <div className="mt-12">
          <Link
            to="/quiz"
            onClick={() => track("quiz_started")}
            className="inline-flex items-center justify-center rounded-full bg-[color:var(--color-brand-ink)] px-10 py-4 text-sm font-medium tracking-wide text-[color:var(--color-brand-bg)] transition hover:bg-[color:var(--color-brand-gold)] hover:text-[color:var(--color-brand-ink)]"
          >
            Begin the assessment
          </Link>
          <p className="mt-4 text-xs text-[color:var(--color-brand-ink-soft)]">
            17 questions · ~4 minutes
          </p>
        </div>
      </div>
    </main>
  );
}
