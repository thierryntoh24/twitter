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

export async function uploadPost(
  postContent?: string,
  image?: File | null
): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  let imagePath: string | null = null;

  try {
    if (image) {
      const { data, error } = await supabase.storage
        .from("post-photos")
        .upload(`${user.id}/${image.name}`, image);

      if (error) {
        console.error("Error uploading file:", error);
        throw error;
      }

      imagePath = data.path;
      console.log("File uploaded successfully:", data.path);
    }

    if (image) {
      const { error } = await supabase.from("posts").insert({
        content: postContent,
        image: imagePath,
        author: user.id,
      });

      if (error) {
        console.error("Error uploading content:", error);
        throw error;
      }

      console.log("Post uploaded successfully:", { postContent, imagePath });
    }
  } catch (error) {
    console.error("Error uploading post:", error);
    throw error;
  }
}
