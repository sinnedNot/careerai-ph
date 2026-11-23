
"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const registrationSchema = z
  .object({
    fullName: z.string().trim().min(2, "Full name must be at least 2 characters."),
    email: z.string().trim().email("Please enter a valid email address."),
    password: z.string().min(8, "Password must be at least 8 characters."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export type RegistrationState = {
  error?: string;
  success?: string;
};

export async function registerStudent(
  _previousState: RegistrationState,
  formData: FormData
): Promise<RegistrationState> {
  const parsed = registrationSchema.safeParse({
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Please check your input.",
    };
  }

  const { fullName, email, password } = parsed.data;
  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
      emailRedirectTo: `${
        process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
      }/auth/callback`,
    },
  });

  if (error) {
    return {
      error: error.message,
    };
  }

  return {
    success:
      "Registration submitted. If email confirmation is enabled, please check your inbox for a verification link.",
  };
}
