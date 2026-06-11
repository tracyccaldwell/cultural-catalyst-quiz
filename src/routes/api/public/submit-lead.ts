import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const PayloadSchema = z.object({
  name: z.string().trim().min(1).max(100),
  first_name: z.string().trim().min(1).max(100).optional(),
  email: z.string().trim().email().max(255),
  archetype: z.string().min(1).max(64),
  catalystScore: z.number().min(0).max(30),
  leadershipLevel: z.number().min(1).max(5),
  leadershiplevel_918ff1a682: z.number().min(1).max(5).optional(),
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

        const webhookUrl = process.env.ZAPIER_WEBHOOK_URL;
        if (!webhookUrl) {
          console.error("ZAPIER_WEBHOOK_URL is not configured");
          return new Response("Server not configured", { status: 503 });
        }

        const zapierPayload = {
          email_address: parsed.data.email,
          first_name: parsed.data.first_name ?? parsed.data.name,
          archetype: parsed.data.archetype,
          leadershiplevel_918ff1a682: parsed.data.leadershiplevel_918ff1a682 ?? parsed.data.leadershipLevel,
          catalystScore: parsed.data.catalystScore,
        };

        try {
          const res = await fetch(webhookUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(zapierPayload),
          });
          if (!res.ok) {
            console.error("Zapier webhook failed", res.status);
            return new Response("Upstream error", { status: 502 });
          }
        } catch (err) {
          console.error("Zapier webhook error", err);
          return new Response("Upstream error", { status: 502 });
        }

        return Response.json({ ok: true });
      },
    },
  },
});