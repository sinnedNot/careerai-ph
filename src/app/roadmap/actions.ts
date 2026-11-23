
"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

const progressSchema = z.object({
  itemId: z.string().uuid("Invalid roadmap item."),
  completed: z.boolean(),
});

export type ProgressState = {
  error?: string;
  success?: string;
};

export async function updateRoadmapProgress(
  itemId: string,
  completed: boolean
): Promise<ProgressState> {
  const parsed = progressSchema.safeParse({
    itemId,
    completed,
  });

  if (!parsed.success) {
    return {
      error: "Invalid roadmap activity information.",
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

  const { data, error } = await supabase
    .from("roadmap_items")
    .update({
      completed: parsed.data.completed,
    })
    .eq("id", parsed.data.itemId)
    .eq("user_id", user.id)
    .select("id")
    .maybeSingle();

  if (error) {
    console.error("Roadmap progress update failed:", error.message);

    return {
      error: "Unable to update your progress. Please try again.",
    };
  }

  if (!data) {
    return {
      error: "Roadmap activity not found.",
    };
  }

  revalidatePath("/roadmap");

  return {
    success: "Progress updated successfully.",
  };
}
