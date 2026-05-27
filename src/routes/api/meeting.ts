import { createLovableAiGatewayProvider, getLovableAiGatewayResponseHeaders } from "@/lib/ai-gateway.server";
import { createFileRoute } from "@tanstack/react-router";
import { generateText, Output } from "ai";
import { z } from "zod";

const MeetingInput = z.object({
  notes: z.string().min(1),
  meetingType: z.enum(["standup", "planning", "review", "brainstorming", "client", "other"]),
  detailLevel: z.enum(["brief", "standard", "detailed"]),
});

export const Route = createFileRoute("/api/meeting")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = (await request.json()) as unknown;
        const data = MeetingInput.safeParse(body);
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
              summary: z.string(),
              keyDecisions: z.array(z.string()),
              actionItems: z.array(z.object({
                task: z.string(),
                assignee: z.string().optional(),
                dueDate: z.string().optional(),
              })),
              participants: z.array(z.string()),
              followUp: z.array(z.string()),
            }),
          }),
          prompt: `Summarize the following ${data.data.meetingType} meeting notes at a ${data.data.detailLevel} level of detail.

Meeting notes:
"""
${data.data.notes}
"""

Return a structured JSON summary with: summary, keyDecisions (array of strings), actionItems (array with task, optional assignee, optional dueDate), participants (array of strings), and followUp (array of strings).`,
        });

        return Response.json(output, {
          headers: getLovableAiGatewayResponseHeaders((output as unknown as { response?: { headers?: HeadersInit } })?.response?.headers),
        });
      },
    },
  },
});
