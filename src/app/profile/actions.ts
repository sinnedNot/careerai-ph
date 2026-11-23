
"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

const profileSchema = z.object({
  fullName: z.string().trim().min(2, "Full name must be at least 2 characters."),
  degreeProgram: z.string().trim().min(2, "Please enter your degree program."),
  yearLevel: z.enum([
    "1st Year",
    "2nd Year",
    "3rd Year",
    "4th Year",
    "5th Year",
    "Graduate",
  ]),
  aiKnowledgeLevel: z.enum([
    "Beginner",
    "Intermediate",
    "Advanced",
  ]),
});

export type ProfileState = {
  error?: string;
  success?: string;
};

export async function updateProfile(
  _previousState: ProfileState,
  formData: FormData
): Promise<ProfileState> {
  const parsed = profileSchema.safeParse({
    fullName: formData.get("fullName"),
    degreeProgram: formData.get("degreeProgram"),
    yearLevel: formData.get("yearLevel"),
    aiKnowledgeLevel: formData.get("aiKnowledgeLevel"),
  });

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Please check your information.",
    };
  }

  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      error: "Your session has expired. Please log in again.",
    };
  }

  const { error } = await supabase
    .from("profiles")
    .upsert(
      {
        id: user.id,
        full_name: parsed.data.fullName,
        degree_program: parsed.data.degreeProgram,
        year_level: parsed.data.yearLevel,
        ai_knowledge_level: parsed.data.aiKnowledgeLevel,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" }
    );

  if (error) {
    console.error("Profile update failed:", error.message);

    return {
      error: "Unable to save your profile. Please try again.",
    };
  }

  revalidatePath("/profile");
  revalidatePath("/dashboard");

  return {
    success: "Your profile has been saved successfully!",
  };
}
