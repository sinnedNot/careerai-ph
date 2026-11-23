
"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

const careerSchema = z.object({
  careerName: z
    .string()
    .trim()
    .min(2, "Career name must be at least 2 characters.")
    .max(100, "Career name must not exceed 100 characters."),
});

export type CareerInterestState = {
  error?: string;
  success?: string;
};

export async function addCareerInterest(
  _previousState: CareerInterestState,
  formData: FormData
): Promise<CareerInterestState> {
  const parsed = careerSchema.safeParse({
    careerName: formData.get("careerName"),
  });

  if (!parsed.success) {
    return {
      error:
        parsed.error.issues[0]?.message ??
        "Please enter a valid career name.",
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

  const careerName = parsed.data.careerName;

  const { data: existingCareer, error: lookupError } = await supabase
    .from("career_interests")
    .select("id")
    .eq("user_id", user.id)
    .ilike("career_name", careerName)
    .limit(1)
    .maybeSingle();

  if (lookupError) {
    console.error("Career lookup failed:", lookupError.message);
    return { error: "Unable to check existing career interests." };
  }

  if (existingCareer) {
    return { error: "You've already added this career interest." };
  }

  const { error } = await supabase.from("career_interests").insert({
    user_id: user.id,
    career_name: careerName,
  });

  if (error) {
    console.error("Career interest insert failed:", error.message);
    return { error: "Unable to save this career interest. Please try again." };
  }

  revalidatePath("/career-interests");
  revalidatePath("/dashboard");

  return { success: "Career interest added successfully!" };
}

export async function deleteCareerInterest(
  careerId: string
): Promise<CareerInterestState> {
  const idSchema = z.string().uuid();
  const parsedId = idSchema.safeParse(careerId);

  if (!parsedId.success) {
    return { error: "Invalid career interest." };
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
    .from("career_interests")
    .delete()
    .eq("id", parsedId.data)
    .eq("user_id", user.id);

  if (error) {
    console.error("Career interest deletion failed:", error.message);
    return { error: "Unable to remove this career interest." };
  }

  revalidatePath("/career-interests");
  revalidatePath("/dashboard");

  return { success: "Career interest removed successfully!" };
}
