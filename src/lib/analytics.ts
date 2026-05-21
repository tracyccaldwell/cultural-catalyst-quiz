// Lightweight PostHog wrapper. No-ops if VITE_POSTHOG_KEY is not set.
let initialized = false;
let posthogPromise: Promise<typeof import("posthog-js").default | null> | null = null;

function loadPostHog() {
  if (typeof window === "undefined") return Promise.resolve(null);
  const key = import.meta.env.VITE_POSTHOG_KEY as string | undefined;
  if (!key) return Promise.resolve(null);
  if (posthogPromise) return posthogPromise;
  posthogPromise = import("posthog-js").then((mod) => {
    const ph = mod.default;
    if (!initialized) {
      ph.init(key, {
        api_host: (import.meta.env.VITE_POSTHOG_HOST as string) || "https://us.i.posthog.com",
        capture_pageview: true,
        person_profiles: "identified_only",
      });
      initialized = true;
    }
    return ph;
  });
  return posthogPromise;
}

export function track(event: string, props?: Record<string, unknown>) {
  loadPostHog().then((ph) => ph?.capture(event, props));
}

export function identify(distinctId: string, props?: Record<string, unknown>) {
  loadPostHog().then((ph) => ph?.identify(distinctId, props));
}

export async function hashEmail(email: string): Promise<string> {
  if (typeof crypto === "undefined" || !crypto.subtle) return email;
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(email.trim().toLowerCase()));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}