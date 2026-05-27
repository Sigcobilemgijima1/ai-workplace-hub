import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";
import { createFileRoute } from "@tanstack/react-router";
import { generateText, Output } from "ai";
import { z } from "zod";

const EmailInput = z.object({
  recipient: z.string().min(1),
  subject: z.string().min(1),
  purpose: z.string().min(1),
  tone: z.enum(["professional", "friendly", "formal", "casual", "urgent"]),
  keyPoints: z.string().optional(),
});

export const Route = createFileRoute("/api/email")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = (await request.json()) as unknown;
        const data = EmailInput.safeParse(body);
        if (!data.success) {
          return new Response("Invalid input", { status: 400 });
        }

        const key = process.env.LOVABLE_API_KEY;
        if (!key) {
          return new Response("Missing LOVABLE_API_KEY", { status: 500 });
        }

        const gateway = createLovableAiGatewayProvider(key);
        const model = gateway("google/gemini-3.5-flash");

        const { output } = await generateText({
          model,
          output: Output.object({
            schema: z.object({
              subject: z.string(),
              body: z.string(),
              greeting: z.string(),
              closing: z.string(),
            }),
          }),
          prompt: `Write a ${data.data.tone} email to ${data.data.recipient} about: ${data.data.subject}. Purpose: ${data.data.purpose}. ${data.data.keyPoints ? `Key points to include: ${data.data.keyPoints}` : ""}

Return the email as structured JSON with subject, body, greeting, and closing fields.`,
        });

        return Response.json(output, {
          headers: getLovableAiGatewayResponseHeaders((output as unknown as { response?: { headers?: HeadersInit } })?.response?.headers),
        });
      },
    },
  },
});
