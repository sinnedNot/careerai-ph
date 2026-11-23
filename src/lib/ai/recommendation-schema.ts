
import { z } from "zod";

export const recommendationSchema = z.object({
  recommendations: z
    .array(
      z.object({
        subjectName: z
          .string()
          .min(2)
          .max(100)
          .describe("The student's actual college subject."),

        classroomTopic: z
          .string()
          .min(2)
          .max(150)
          .describe("The specific classroom topic this recommendation builds on."),

        recommendedTopic: z
          .string()
          .min(3)
          .max(150)
          .describe("The AI-related skill or topic to learn."),

        relevanceExplanation: z
          .string()
          .min(20)
          .max(1000)
          .describe("Explain how the AI topic connects to the classroom topic."),

        careerApplication: z
          .string()
          .min(20)
          .max(1000)
          .describe("Explain how this skill may apply to the student's career interests."),

        recommendedTools: z
          .array(z.string().min(2).max(100))
          .max(5)
          .describe("Relevant AI tools or technologies to explore."),

        learningObjective: z
          .string()
          .min(10)
          .max(500)
          .describe("What the student should understand or be able to do."),

        practicalActivity: z
          .string()
          .min(10)
          .max(1000)
          .describe("A manageable, practical learning activity."),

        priority: z
          .enum(["high", "medium", "low"])
          .describe("The recommended learning priority."),
      })
    )
    .min(1)
    .max(5),
});

export type RecommendationOutput = z.infer<
  typeof recommendationSchema
>;
