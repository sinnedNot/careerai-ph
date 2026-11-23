
import { describe, expect, it } from "vitest";
import { roadmapSchema } from "./roadmap-schema";

describe("roadmapSchema", () => {
  it("accepts a valid learning roadmap", () => {
    const result = roadmapSchema.safeParse({
      title: "AI Skills for Future Auditors",
      items: [
        {
          stage: "Foundation",
          topic: "Introduction to AI",
          learningObjective:
            "Understand basic AI concepts and their applications.",
          practicalActivity:
            "Research examples of AI applications in auditing.",
          sequenceOrder: 1,
        },
        {
          stage: "Intermediate",
          topic: "AI-assisted Audit Analytics",
          learningObjective:
            "Understand how AI supports audit data analysis.",
          practicalActivity:
            "Analyze sample financial transactions for unusual patterns.",
          sequenceOrder: 2,
        },
        {
          stage: "Applied",
          topic: "AI in Risk Assessment",
          learningObjective:
            "Apply AI concepts to understand audit risk assessment.",
          practicalActivity:
            "Develop a simple case study showing AI-assisted risk assessment.",
          sequenceOrder: 3,
        },
      ],
    });

    expect(result.success).toBe(true);
  });

  it("rejects an invalid roadmap stage", () => {
    const result = roadmapSchema.safeParse({
      title: "AI Skills for Future Auditors",
      items: [
        {
          stage: "Beginner",
          topic: "Introduction to AI",
          learningObjective:
            "Understand basic AI concepts and their applications.",
          practicalActivity:
            "Research examples of AI applications in auditing.",
          sequenceOrder: 1,
        },
        {
          stage: "Intermediate",
          topic: "AI-assisted Audit Analytics",
          learningObjective:
            "Understand how AI supports audit data analysis.",
          practicalActivity:
            "Analyze sample financial transactions for unusual patterns.",
          sequenceOrder: 2,
        },
        {
          stage: "Applied",
          topic: "AI in Risk Assessment",
          learningObjective:
            "Apply AI concepts to understand audit risk assessment.",
          practicalActivity:
            "Develop a simple case study showing AI-assisted risk assessment.",
          sequenceOrder: 3,
        },
      ],
    });

    expect(result.success).toBe(false);
  });

  it("rejects a roadmap with fewer than three activities", () => {
    const result = roadmapSchema.safeParse({
      title: "AI Skills for Future Auditors",
      items: [
        {
          stage: "Foundation",
          topic: "Introduction to AI",
          learningObjective:
            "Understand basic AI concepts and their applications.",
          practicalActivity:
            "Research examples of AI applications in auditing.",
          sequenceOrder: 1,
        },
        {
          stage: "Intermediate",
          topic: "AI-assisted Audit Analytics",
          learningObjective:
            "Understand how AI supports audit data analysis.",
          practicalActivity:
            "Analyze sample financial transactions for unusual patterns.",
          sequenceOrder: 2,
        },
      ],
    });

    expect(result.success).toBe(false);
  });

  it("rejects a roadmap missing a required learning stage", () => {
    const result = roadmapSchema.safeParse({
      title: "AI Skills for Future Auditors",
      items: [
        {
          stage: "Foundation",
          topic: "Introduction to AI",
          learningObjective:
            "Understand basic AI concepts and their applications.",
          practicalActivity:
            "Research examples of AI applications in auditing.",
          sequenceOrder: 1,
        },
        {
          stage: "Foundation",
          topic: "AI Fundamentals",
          learningObjective:
            "Understand fundamental AI concepts.",
          practicalActivity:
            "Explore practical examples of AI fundamentals.",
          sequenceOrder: 2,
        },
        {
          stage: "Applied",
          topic: "AI in Risk Assessment",
          learningObjective:
            "Understand how AI supports audit risk assessment.",
          practicalActivity:
            "Develop a case study about AI-assisted risk assessment.",
          sequenceOrder: 3,
        },
      ],
    });

    expect(result.success).toBe(false);
  });

  it("rejects non-consecutive sequence numbers", () => {
    const result = roadmapSchema.safeParse({
      title: "AI Skills for Future Auditors",
      items: [
        {
          stage: "Foundation",
          topic: "Introduction to AI",
          learningObjective:
            "Understand basic AI concepts and their applications.",
          practicalActivity:
            "Research examples of AI applications in auditing.",
          sequenceOrder: 1,
        },
        {
          stage: "Intermediate",
          topic: "AI-assisted Audit Analytics",
          learningObjective:
            "Understand how AI supports audit data analysis.",
          practicalActivity:
            "Analyze sample financial transactions.",
          sequenceOrder: 3,
        },
        {
          stage: "Applied",
          topic: "AI in Risk Assessment",
          learningObjective:
            "Understand how AI supports audit risk assessment.",
          practicalActivity:
            "Develop a case study about AI-assisted risk assessment.",
          sequenceOrder: 4,
        },
      ],
    });

    expect(result.success).toBe(false);
  });

});
