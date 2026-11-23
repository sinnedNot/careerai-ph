
import { describe, expect, it } from "vitest";
import { recommendationSchema } from "./recommendation-schema";

describe("recommendationSchema", () => {
  it("accepts a valid AI recommendation", () => {
    const result = recommendationSchema.safeParse({
      recommendations: [
        {
          subjectName: "Auditing",
          classroomTopic: "Internal Controls",
          recommendedTopic: "AI-assisted Audit Analytics",
          relevanceExplanation:
            "AI can help auditors analyze large datasets and identify unusual transactions.",
          careerApplication:
            "Auditors can use AI-assisted analytics to support risk assessment and audit planning.",
          recommendedTools: ["Python", "Excel"],
          learningObjective:
            "Understand how AI supports audit analytics.",
          practicalActivity:
            "Create a sample analysis of transaction data and identify unusual patterns.",
          priority: "high",
        },
      ],
    });

    expect(result.success).toBe(true);
  });

  it("rejects an invalid priority", () => {
    const result = recommendationSchema.safeParse({
      recommendations: [
        {
          subjectName: "Auditing",
          classroomTopic: "Internal Controls",
          recommendedTopic: "AI-assisted Audit Analytics",
          relevanceExplanation:
            "AI can help auditors analyze large datasets and identify unusual transactions.",
          careerApplication:
            "Auditors can use AI-assisted analytics to support risk assessment and audit planning.",
          recommendedTools: ["Python"],
          learningObjective:
            "Understand how AI supports audit analytics.",
          practicalActivity:
            "Analyze sample transaction data using an AI-assisted approach.",
          priority: "urgent",
        },
      ],
    });

    expect(result.success).toBe(false);
  });

  it("rejects more than five recommendations", () => {
    const recommendation = {
      subjectName: "Auditing",
      classroomTopic: "Internal Controls",
      recommendedTopic: "AI-assisted Audit Analytics",
      relevanceExplanation:
        "AI can help auditors analyze large datasets and identify unusual transactions.",
      careerApplication:
        "Auditors can use AI-assisted analytics to support risk assessment and audit planning.",
      recommendedTools: ["Python"],
      learningObjective:
        "Understand how AI supports audit analytics.",
      practicalActivity:
        "Analyze sample transaction data using an AI-assisted approach.",
      priority: "high" as const,
    };

    const result = recommendationSchema.safeParse({
      recommendations: Array(6).fill(recommendation),
    });

    expect(result.success).toBe(false);
  });
});
