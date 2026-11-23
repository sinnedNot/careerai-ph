
import { generateText, Output } from "ai";
import { openai } from "@/lib/ai/openai";
import { recommendationSchema } from "@/lib/ai/recommendation-schema";

export type RecommendationInput = {
  degreeProgram: string;
  yearLevel: string;
  aiKnowledgeLevel: string;
  careerInterests: string[];
  subjects: {
    subjectName: string;
    currentTopics: string[];
  }[];
};

export async function generateRecommendations(
  input: RecommendationInput
) {
  const { output } = await generateText({
    model: openai("gpt-4o-mini"),
    output: Output.object({
      schema: recommendationSchema,
      name: "career_ai_recommendations",
      description:
        "Personalized AI learning recommendations connected to college subjects and career interests.",
    }),
    system: `
You are CareerAI PH, an educational career-readiness assistant
for Filipino college students.

Your job is to connect what students are learning in college
with relevant AI skills they can develop for their future careers.

Follow these rules:
1. Base recommendations on the actual subjects and classroom topics provided.
2. Explain the specific connection between each classroom topic
   and its recommended AI skill.
3. Connect recommendations to the student's stated career interests.
4. Consider the student's year level and existing AI knowledge.
5. Prioritize foundational skills before advanced applications
   when appropriate.
6. Suggest relevant tools or technologies, but do not invent
   tool capabilities.
7. Provide practical, achievable learning activities.
8. Avoid generic recommendations that could apply to any student.
9. Do not claim that learning a skill guarantees employment.
10. Return only recommendations supported by the student's
    supplied academic and career context.
`,
    prompt: `
Create personalized AI learning recommendations using this student data:

${JSON.stringify(input, null, 2)}

Generate between 1 and 5 recommendations.

Each recommendation must connect to a specific subject and
classroom topic supplied by the student.

Prioritize recommendations that are relevant to both the
student's current studies and career interests.
`,
    maxRetries: 1,
  });

  if (!output) {
    throw new Error("The AI did not return valid recommendations.");
  }

  return output;
}
