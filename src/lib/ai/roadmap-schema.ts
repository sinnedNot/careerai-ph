
import { z } from "zod";

export const roadmapSchema = z
  .object({
    title: z.string().min(5).max(150),

    items: z
      .array(
        z.object({
          stage: z.enum([
            "Foundation",
            "Intermediate",
            "Applied",
          ]),

          topic: z.string().min(3).max(150),

          learningObjective: z.string().min(10).max(500),

          practicalActivity: z.string().min(10).max(1000),

          sequenceOrder: z.number().int().min(1),
        })
      )
      .min(3)
      .max(15),
  })
  .superRefine((roadmap, ctx) => {
    // Require all three learning stages.
    const requiredStages = [
  "Foundation",
  "Intermediate",
  "Applied",
] as const;

    const presentStages = new Set(
      roadmap.items.map((item) => item.stage)
    );

    for (const stage of requiredStages) {
      if (!presentStages.has(stage)) {
        ctx.addIssue({
          code: "custom",
          message: `Missing required roadmap stage: ${stage}`,
          path: ["items"],
        });
      }
    }

    // Require consecutive sequence numbers starting at 1.
    roadmap.items.forEach((item, index) => {
      const expectedOrder = index + 1;

      if (item.sequenceOrder !== expectedOrder) {
        ctx.addIssue({
          code: "custom",
          message: `Expected sequence order ${expectedOrder}, received ${item.sequenceOrder}.`,
          path: ["items", index, "sequenceOrder"],
        });
      }
    });
  });

export type RoadmapOutput = z.infer<typeof roadmapSchema>;
