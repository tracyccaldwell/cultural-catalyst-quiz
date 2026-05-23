import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const PayloadSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  archetype: z.string().min(1).max(64),
  catalystScore: z.number().min(0).max(30),
  leadershipLevel: z.number().min(1).max(5),
  levelSubscores: z.record(z.string(), z.number().min(0).max(10)),
  completedAt: z.string().min(1).max(64),
  source: z.string().min(1).max(64),
});

export const Route = createFileRoute("/api/public/submit-lead")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: unknown;
        try {
          body = await request.json();
        } catch {
          return new Response("Invalid JSON", { status: 400 });
        }

        const parsed = PayloadSchema.safeParse(body);
        if (!parsed.success) {
          return new Response("Invalid payload", { status: 400 });
        }

        const webhookUrl = process.env.CLICKFUNNELS_WEBHOOK_URL;
        if (!webhookUrl) {
          console.error("CLICKFUNNELS_WEBHOOK_URL is not configured");
          return new Response("Server not configured", { status: 503 });
        }

        try {
          const res = await fetch(webhookUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(parsed.data),
          });
          if (!res.ok) {
            console.error("ClickFunnels webhook failed", res.status);
            return new Response("Upstream error", { status: 502 });
          }
        } catch (err) {
          console.error("ClickFunnels webhook error", err);
          return new Response("Upstream error", { status: 502 });
        }

        return Response.json({ ok: true });
      },
    },
  },
});