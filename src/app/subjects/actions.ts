
"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

const subjectSchema = z.object({
  subjectName: z
    .string()
    .trim()
    .min(2, "Subject name must be at least 2 characters.")
    .max(100, "Subject name must not exceed 100 characters."),
  topics: z
    .array(
      z.string().trim().min(2).max(150)
    )
    .max(30, "You can add up to 30 topics per subject."),
});

export type SubjectState = {
  error?: string;
  success?: string;
};

async function getAuthenticatedClient() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      error: "Your session has expired. Please log in again.",
    };
  }

  return { supabase, user };
}

export async function addSubject(
  _previousState: SubjectState,
  formData: FormData
): Promise<SubjectState> {
  const rawTopics = formData.getAll("topics");

  const parsed = subjectSchema.safeParse({
    subjectName: formData.get("subjectName"),
    topics: rawTopics.filter(
      (topic): topic is string => typeof topic === "string" && topic.trim().length > 0
    ),
  });

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Please check your subject details.",
    };
  }

  const auth = await getAuthenticatedClient();

if ("error" in auth) {
  return { error: auth.error };
}

const { supabase, user } = auth;

  const { data: existing, error: lookupError } = await supabase
    .from("subjects")
    .select("id")
    .eq("user_id", user.id)
    .ilike("subject_name", parsed.data.subjectName)
    .limit(1)
    .maybeSingle();

  if (lookupError) {
    console.error("Subject lookup failed:", lookupError.message);
    return { error: "Unable to check existing subjects." };
  }

  if (existing) {
    return { error: "You've already added this subject." };
  }

  const uniqueTopics = [...new Set(parsed.data.topics.map((topic) => topic.trim()))];

  const { error } = await supabase.from("subjects").insert({
    user_id: user.id,
    subject_name: parsed.data.subjectName,
    current_topics: uniqueTopics,
  });

  if (error) {
    console.error("Subject insert failed:", error.message);
    return { error: "Unable to save this subject. Please try again." };
  }

  revalidatePath("/subjects");
  revalidatePath("/dashboard");

  return { success: "Subject added successfully!" };
}

export async function updateSubject(
  subjectId: string,
  formData: FormData
): Promise<SubjectState> {
  const idSchema = z.string().uuid();
  const parsedId = idSchema.safeParse(subjectId);

  const parsed = subjectSchema.safeParse({
    subjectName: formData.get("subjectName"),
    topics: formData.getAll("topics").filter(
      (topic): topic is string => typeof topic === "string" && topic.trim().length > 0
    ),
  });

  if (!parsedId.success || !parsed.success) {
    return { error: "Please check the subject details." };
  }

  const auth = await getAuthenticatedClient();

if ("error" in auth) {
  return { error: auth.error };
}

const { supabase, user } = auth;

  const uniqueTopics = [...new Set(parsed.data.topics.map((topic) => topic.trim()))];

  const { error } = await supabase
    .from("subjects")
    .update({
      subject_name: parsed.data.subjectName,
      current_topics: uniqueTopics,
      updated_at: new Date().toISOString(),
    })
    .eq("id", parsedId.data)
    .eq("user_id", user.id);

  if (error) {
    console.error("Subject update failed:", error.message);
    return { error: "Unable to update this subject." };
  }

  revalidatePath("/subjects");
  revalidatePath("/dashboard");

  return { success: "Subject updated successfully!" };
}

export async function deleteSubject(
  subjectId: string
): Promise<SubjectState> {
  const parsedId = z.string().uuid().safeParse(subjectId);

  if (!parsedId.success) {
    return { error: "Invalid subject." };
  }

  const auth = await getAuthenticatedClient();

if ("error" in auth) {
  return { error: auth.error };
}

const { supabase, user } = auth;

  const { error } = await supabase
    .from("subjects")
    .delete()
    .eq("id", parsedId.data)
    .eq("user_id", user.id);

  if (error) {
    console.error("Subject deletion failed:", error.message);
    return { error: "Unable to delete this subject." };
  }

  revalidatePath("/subjects");
  revalidatePath("/dashboard");

  return { success: "Subject removed successfully!" };
}
