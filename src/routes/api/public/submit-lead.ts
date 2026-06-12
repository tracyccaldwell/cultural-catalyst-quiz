import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const PayloadSchema = z
  .object({
    first_name: z.string().trim().min(1).max(100).optional(),
    name: z.string().trim().min(1).max(100).optional(),
    email: z.string().trim().email().max(255).optional(),
    email_address: z.string().trim().email().max(255).optional(),
    archetype: z.string().min(1).max(64),
    catalystScore: z.number().min(0).max(30),
    leadershiplevel_918ff1a682: z.number().min(1).max(5).optional(),
    leadershipLevel: z.number().min(1).max(5).optional(),
    levelSubscores: z.record(z.string(), z.number().min(0).max(10)),
    completedAt: z.string().min(1).max(64),
    source: z.string().min(1).max(64),
  })
  .transform((data, ctx) => {
    const email = data.email ?? data.email_address;
    const first_name = data.first_name ?? data.name;
    const leadershiplevel_918ff1a682 =
      data.leadershiplevel_918ff1a682 ?? data.leadershipLevel;

    if (!email) {
      ctx.addIssue({ code: "custom", path: ["email"], message: "Email is required" });
    }
    if (!first_name) {
      ctx.addIssue({ code: "custom", path: ["first_name"], message: "First name is required" });
    }
    if (!leadershiplevel_918ff1a682) {
      ctx.addIssue({
        code: "custom",
        path: ["leadershiplevel_918ff1a682"],
        message: "Leadership level is required",
      });
    }

    return {
      email: email ?? "",
      first_name: first_name ?? "",
      archetype: data.archetype,
      catalystScore: data.catalystScore,
      leadershiplevel_918ff1a682: leadershiplevel_918ff1a682 ?? 1,
    };
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
          email: parsed.data.email,
          first_name: parsed.data.first_name,
          archetype: parsed.data.archetype,
          catalystScore: parsed.data.catalystScore,
          leadershiplevel_918ff1a682: parsed.data.leadershiplevel_918ff1a682,
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