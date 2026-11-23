
import type { RecommendationOutput } from "@/lib/ai/recommendation-schema";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateRecommendations } from "@/lib/ai/generate-recommendations";

export async function POST() {
  try {
    const supabase = await createClient();

    // Authenticate the user.
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Please log in to generate recommendations." },
        { status: 401 }
      );
    }

    // Retrieve the user's profile, subjects, and career interests.
    const [
      { data: profile, error: profileError },
      { data: subjects, error: subjectsError },
      { data: careers, error: careersError },
    ] = await Promise.all([
      supabase
        .from("profiles")
        .select("degree_program, year_level, ai_knowledge_level")
        .eq("id", user.id)
        .single(),

      supabase
        .from("subjects")
        .select("id, subject_name, current_topics")
        .eq("user_id", user.id),

      supabase
        .from("career_interests")
        .select("career_name")
        .eq("user_id", user.id),
    ]);

    // Validate the student profile.
    if (profileError || !profile) {
      return NextResponse.json(
        { error: "Please complete your student profile first." },
        { status: 400 }
      );
    }

    if (
      !profile.degree_program ||
      !profile.year_level ||
      !profile.ai_knowledge_level
    ) {
      return NextResponse.json(
        { error: "Please complete all required profile fields." },
        { status: 400 }
      );
    }

    // Validate academic subjects.
    if (subjectsError || !subjects || subjects.length === 0) {
      return NextResponse.json(
        { error: "Please add at least one academic subject first." },
        { status: 400 }
      );
    }

    // Require classroom topics for every saved subject.
    if (
      subjects.some(
        (subject) =>
          !subject.current_topics ||
          subject.current_topics.length === 0
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Please add at least one classroom topic to every subject.",
        },
        { status: 400 }
      );
    }

    // Validate career interests.
    if (careersError || !careers || careers.length === 0) {
      return NextResponse.json(
        { error: "Please add at least one career interest first." },
        { status: 400 }
      );
    }

    // Generate AI recommendations.
    const result = await generateRecommendations({
      degreeProgram: profile.degree_program,
      yearLevel: profile.year_level,
      aiKnowledgeLevel: profile.ai_knowledge_level,
      careerInterests: careers.map(
        (career) => career.career_name
      ),
      subjects: subjects.map((subject) => ({
        subjectName: subject.subject_name,
        currentTopics: subject.current_topics ?? [],
      })),
    });

    // Validate AI-generated subjects and classroom topics.
    const subjectMap = new Map(
      subjects.map((subject) => [
        subject.subject_name.trim().toLowerCase(),
        subject,
      ])
    );

    const topicExists = (
      subject: (typeof subjects)[number],
      topic: string
    ) =>
      (subject.current_topics ?? []).some(
        (item: string) =>
          item.trim().toLowerCase() === topic.trim().toLowerCase()
      );

    const rows = result.recommendations.map(
      (item: RecommendationOutput["recommendations"][number]) => {
        const subject = subjectMap.get(
          item.subjectName.trim().toLowerCase()
        );

        if (!subject || !topicExists(subject, item.classroomTopic)) {
          throw new Error(
            "AI returned an unknown subject or classroom topic."
          );
        }

        return {
          user_id: user.id,
          subject_id: subject.id,
          recommended_topic: item.recommendedTopic,
          relevance_explanation: item.relevanceExplanation,
          career_application: item.careerApplication,
          recommended_tools: item.recommendedTools,
          learning_objective: item.learningObjective,
          practical_activity: item.practicalActivity,
          priority: item.priority,
        };
      }
    );

    // Save recommendations to Supabase.
    const {
      data: savedRecommendations,
      error: saveError,
    } = await supabase
      .from("recommendations")
      .insert(rows)
      .select();

    if (saveError || !savedRecommendations) {
      console.error("Saving recommendations failed:", {
        name: saveError?.name,
        message: saveError?.message,
      });

      return NextResponse.json(
        {
          error: "Unable to save recommendations. Please try again.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Recommendations generated successfully.",
      recommendations: result.recommendations,
    });
  } catch (error) {
    console.error(
      "Recommendation generation failed:",
      error instanceof Error ? error.message : "Unknown error"
    );

    return NextResponse.json(
      {
        error:
          "Unable to generate recommendations right now. Please try again.",
      },
      { status: 500 }
    );
  }
}
