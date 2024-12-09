"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

export async function signOut() {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error("Unable to logout");
    // redirect("/error");
  }

  // window.location.reload(); // Optionally, refresh the page or handle routing

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signInWithGoogle() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  });

  if (error) {
    console.error("Google Sign In Error:", error);
    return;
  }

  redirect(data.url);
}

export async function signInWithEmailLink(email: string) {
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: true,
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/confirm`,
    },
  });

  if (error) {
    console.error("Email Sign In Error:", error);
    throw error;
  }
}

export async function getCurrentUser() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

export type UploadState = {
  errors?: Error | null;
  message?: string | null;
};

interface UploadData {
  message?: string;
  image?: File;
}

export async function uploadPost(prevState: any, formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { message: "You must sign in to be able to upload" };

  let imagePath: string | null = null;

  // Safely extract form data with optional chaining
  const message = formData.get("message") as string | null;
  const image = formData.get("image") as File | null;

  // Validate data
  const isMessageValid = message && message.trim() !== "";
  const isImageValid = image && image.name !== "undefined" && image.size > 0;

  // Log if one of the upload components is missing
  if (isMessageValid && !isImageValid) {
    console.log("No image provided with the message");
  }
  if (!isMessageValid && isImageValid) {
    console.log("No message provided with the image");
  }

  // If both are empty, return early
  if (!isMessageValid && !isImageValid) {
    return { message: "Please provide either a message or an image" };
  }

  try {
    // Upload image if present
    if (isImageValid) {
      const { data, error } = await supabase.storage
        .from("post-photos")
        .upload(`${user.id}/${image.name}`, image);

      if (error) {
        console.error("Error uploading image:", error);
        return { message: "Error uploading image." };
      }

      imagePath = data?.path || null;
      console.log("Image uploaded successfully:", imagePath);
    }

    // Insert post if there's a message or image
    if (isMessageValid || imagePath) {
      const { error } = await supabase.from("posts").insert({
        content: message || null,
        image: imagePath,
        author: user.id,
      });

      if (error) {
        console.error("Error uploading post content:", error);
        return { message: "Error uploading post content." };
      }

      console.log("Post uploaded successfully", {
        message: message || "No message",
        imagePath: imagePath || "No image",
      });
    }

    return { message: "Post uploaded successfully" };
  } catch (error) {
    console.error("Unexpected error:", error);
    return {
      message: "An unexpected error occurred while uploading the post.",
    };
  }
}
