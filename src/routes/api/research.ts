import { createLovableAiGatewayProvider, getLovableAiGatewayResponseHeaders } from "@/lib/ai-gateway.server";
import { createFileRoute } from "@tanstack/react-router";
import { generateText, Output } from "ai";
import { z } from "zod";

const ResearchInput = z.object({
  topic: z.string().min(1),
  depth: z.enum(["overview", "detailed", "comprehensive"]),
  focus: z.string().optional(),
  questions: z.array(z.string()).optional(),
});

export const Route = createFileRoute("/api/research")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = (await request.json()) as unknown;
        const data = ResearchInput.safeParse(body);
        if (!data.success) {
          return new Response("Invalid input", { status: 400 });
        }

        const key = process.env.LOVABLE_API_KEY;
        if (!key) {
          return new Response("Missing LOVABLE_API_KEY", { status: 500 });
        }

        const gateway = createLovableAiGatewayProvider(key);
        const model = gateway("google/gemini-2.5-pro");

        const { output } = await generateText({
          model,
          output: Output.object({
            schema: z.object({
              overview: z.string(),
              keyFindings: z.array(z.object({
                title: z.string(),
                description: z.string(),
                significance: z.string(),
              })),
              insights: z.array(z.string()),
              recommendations: z.array(z.string()),
              sources: z.array(z.string()),
              nextSteps: z.array(z.string()),
            }),
          }),
          prompt: `Research the following topic and provide a ${data.data.depth} analysis.

Topic: ${data.data.topic}
${data.data.focus ? `Focus area: ${data.data.focus}` : ""}
${data.data.questions && data.data.questions.length > 0 ? `Specific questions to address: ${data.data.questions.join("; ")}` : ""}

Return structured JSON with: overview (string), keyFindings (array with title, description, significance), insights (array of strings), recommendations (array of strings), sources (array of strings - these should be general knowledge areas, not specific URLs), and nextSteps (array of strings).`,
        });

        return Response.json(output, {
          headers: getLovableAiGatewayResponseHeaders((output as unknown as { response?: { headers?: HeadersInit } })?.response?.headers),
        });
      },
    },
  },
});
