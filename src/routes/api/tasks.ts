import { createLovableAiGatewayProvider, getLovableAiGatewayResponseHeaders } from "@/lib/ai-gateway.server";
import { createFileRoute } from "@tanstack/react-router";
import { generateText, Output } from "ai";
import { z } from "zod";

const TasksInput = z.object({
  projectName: z.string().min(1),
  description: z.string().min(1),
  deadline: z.string().optional(),
  teamSize: z.number().optional(),
  priorities: z.array(z.string()).optional(),
});

export const Route = createFileRoute("/api/tasks")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = (await request.json()) as unknown;
        const data = TasksInput.safeParse(body);
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
              phases: z.array(z.object({
                name: z.string(),
                tasks: z.array(z.object({
                  title: z.string(),
                  description: z.string(),
                  estimatedHours: z.number(),
                  priority: z.enum(["high", "medium", "low"]),
                  dependencies: z.array(z.string()).optional(),
                })),
              })),
              milestones: z.array(z.object({
                name: z.string(),
                description: z.string(),
                dueDate: z.string().optional(),
              })),
              risks: z.array(z.string()),
            }),
          }),
          prompt: `Create a task plan for the following project.

Project: ${data.data.projectName}
Description: ${data.data.description}
${data.data.deadline ? `Deadline: ${data.data.deadline}` : ""}
${data.data.teamSize ? `Team size: ${data.data.teamSize}` : ""}
${data.data.priorities && data.data.priorities.length > 0 ? `Key priorities: ${data.data.priorities.join(", ")}` : ""}

Return structured JSON with phases (each with name and tasks array containing title, description, estimatedHours, priority, optional dependencies), milestones (name, description, optional dueDate), and risks (array of strings).`,
        });

        return Response.json(output, {
          headers: getLovableAiGatewayResponseHeaders((output as unknown as { response?: { headers?: HeadersInit } })?.response?.headers),
        });
      },
    },
  },
});
