
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateRoadmap } from "@/lib/ai/generate-roadmap";

export async function POST() {
  try {
    const supabase = await createClient();

    // Verify the signed-in student.
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Please log in to generate your roadmap." },
        { status: 401 }
      );
    }

    // Retrieve the student's profile.
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("degree_program, year_level, ai_knowledge_level")
      .eq("id", user.id)
      .single();

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

    // Retrieve career interests.
    const { data: interests, error: interestsError } = await supabase
      .from("career_interests")
      .select("career_name")
      .eq("user_id", user.id);

    if (interestsError) {
      throw new Error("Unable to retrieve career interests.");
    }

    if (!interests || interests.length === 0) {
      return NextResponse.json(
        { error: "Please add at least one career interest." },
        { status: 400 }
      );
    }

    // Retrieve saved recommendations.
    const { data: recommendations, error: recommendationsError } =
      await supabase
        .from("recommendations")
        .select(
          "subject_id, recommended_topic, learning_objective, practical_activity, priority"
        )
        .eq("user_id", user.id);

    if (recommendationsError) {
      throw new Error("Unable to retrieve saved recommendations.");
    }

    if (!recommendations || recommendations.length === 0) {
      return NextResponse.json(
        {
          error:
            "Generate AI recommendations before creating your roadmap.",
        },
        { status: 400 }
      );
    }

    // Ensure every recommendation references a valid subject.
    const subjectIds = [
      ...new Set(
        recommendations
          .map((item) => item.subject_id)
          .filter((id): id is string => Boolean(id))
      ),
    ];

    if (subjectIds.length !== recommendations.length &&
        recommendations.some((item) => !item.subject_id)) {
      return NextResponse.json(
        {
          error:
            "Some recommendations are missing their academic subject. Please generate new recommendations.",
        },
        { status: 400 }
      );
    }

    // Retrieve the student's subjects.
    const { data: subjects, error: subjectsError } = await supabase
      .from("subjects")
      .select("id, subject_name, current_topics")
      .eq("user_id", user.id)
      .in("id", subjectIds);

    if (subjectsError) {
      throw new Error("Unable to retrieve academic subjects.");
    }

    const subjectMap = new Map(
      (subjects ?? []).map((subject) => [subject.id, subject])
    );

    // Reject recommendations that cannot be matched to valid subjects.
    for (const item of recommendations) {
      const subject = item.subject_id
        ? subjectMap.get(item.subject_id)
        : undefined;

      if (!subject) {
        return NextResponse.json(
          {
            error:
              "A recommendation references an unavailable subject. Please generate new recommendations.",
          },
          { status: 400 }
        );
      }

      if (
        !subject.subject_name ||
        !subject.current_topics ||
        subject.current_topics.length === 0
      ) {
        return NextResponse.json(
          {
            error:
              "Please make sure every subject has a name and at least one classroom topic.",
          },
          { status: 400 }
        );
      }
    }

    // Prepare the AI input using verified student data.
    const roadmapInput = {
      degreeProgram: profile.degree_program,
      yearLevel: profile.year_level,
      aiKnowledgeLevel: profile.ai_knowledge_level,
      careerInterests: interests.map((item) => item.career_name),
      recommendations: recommendations.map((item) => {
        const subject = subjectMap.get(item.subject_id!)!;

        return {
          subjectName: subject.subject_name,
          classroomTopic: subject.current_topics.join(", "),
          recommendedTopic: item.recommended_topic,
          learningObjective: item.learning_objective,
          practicalActivity: item.practical_activity,
          priority: item.priority,
        };
      }),
    };

    // Generate the personalized roadmap.
    const result = await generateRoadmap(roadmapInput);

    // Save the roadmap.
    const { data: savedRoadmap, error: saveRoadmapError } =
      await supabase
        .from("learning_roadmaps")
        .insert({
          user_id: user.id,
          title: result.title,
          roadmap_content: result,
        })
        .select("id, title, created_at")
        .single();

    if (saveRoadmapError || !savedRoadmap) {
      console.error(
        "Saving roadmap failed:",
        saveRoadmapError?.message
      );

      throw new Error("Unable to save the generated roadmap.");
    }

    // Prepare the roadmap items.
    const roadmapItems = result.items.map((item) => ({
      roadmap_id: savedRoadmap.id,
      user_id: user.id,
      stage: item.stage,
      topic: item.topic,
      learning_objective: item.learningObjective,
      practical_activity: item.practicalActivity,
      sequence_order: item.sequenceOrder,
      completed: false,
    }));

    // Save all roadmap items.
    const { data: savedItems, error: saveItemsError } =
      await supabase
        .from("roadmap_items")
        .insert(roadmapItems)
        .select();

    if (saveItemsError || !savedItems) {
      console.error(
        "Saving roadmap items failed:",
        saveItemsError?.message
      );

      // Remove the incomplete roadmap and verify cleanup.
      const { error: cleanupError } = await supabase
        .from("learning_roadmaps")
        .delete()
        .eq("id", savedRoadmap.id)
        .eq("user_id", user.id);

      if (cleanupError) {
        console.error(
          "Incomplete roadmap cleanup failed:",
          cleanupError.message
        );
      }

      throw new Error("Unable to save roadmap activities.");
    }

    return NextResponse.json({
      message: "Learning roadmap generated successfully.",
      roadmap: savedRoadmap,
      items: savedItems,
    });
  } catch (error) {
    console.error(
      "Roadmap generation failed:",
      error instanceof Error ? error.message : "Unknown error"
    );

    return NextResponse.json(
      {
        error:
          "Unable to generate your learning roadmap. Please try again.",
      },
      { status: 500 }
    );
  }
}
