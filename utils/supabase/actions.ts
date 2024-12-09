"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";
import { PostState } from "../types";

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

export async function uploadPost(
  prevState: PostState,
  formData: FormData
): Promise<PostState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user)
    return {
      message: "You must sign in to upload",
      success: false,
    };

  let imagePath: string | null = null;

  // Safely extract form data with optional chaining
  const message = formData.get("message") as string | null;
  const image = formData.get("image") as File | null;

  // Validate data
  const isMessageValid = message && message.trim() !== "";
  const isImageValid = image && image.name !== "undefined" && image.size > 0;

  // If both are empty, return early
  if (!isMessageValid && !isImageValid) {
    return {
      message: "Please provide either a message or an image",
      success: false,
    };
  }

  // // Simulate a delay and potential error for testing
  // try {
  //   await new Promise<PostState>((resolve, reject) => {
  //     setTimeout(() => {
  //       const shouldFail = Math.random() > 0.5; // 50% chance of failure
  //       if (shouldFail) {
  //         console.error("Simulated error during upload.");
  //         reject({ message: "Simulated error occurred." });
  //       } else {
  //         console.log("Simulated upload successful.");
  //         resolve({ message: "Simulated upload completed successfully." });
  //       }
  //     }, 2000); // 2 seconds delay
  //   });

  //   return {
  //     message: "Simulated upload successful.",
  //     success: true,
  //   };
  // } catch (error) {
  //   return {
  //     message: "Simulated error during upload.",
  //     success: false,
  //   };
  // }

  try {
    // Upload image if present
    if (isImageValid) {
      const { data, error } = await supabase.storage
        .from("post-photos")
        .upload(`${user.id}/${image.name}`, image);

      if (error) {
        console.error("Error uploading file:", error);

        return {
          message: "Error uploading file",
          success: false,
        };
      }

      imagePath = data.path;
      console.log("File uploaded successfully:", data.path);
    }

    // Insert post if there's a message or image
    if (isMessageValid || imagePath) {
      const { error } = await supabase.from("posts").insert({
        content: message || null,
        image: imagePath,
        author: user.id,
      });

      if (error) {
        console.error("Error uploading content:", error);

        return {
          message: "Error uploading content",
          success: false,
        };
      }
    }

    console.log("Post uploaded successfully", {
      message: message || "No message",
      imagePath: imagePath || "No image",
    });

    return {
      message: "Post uploaded successfully",
      success: true,
    };
  } catch (error) {
    console.error("Error uploading post:", error);

    return {
      message: "Error uploading post",
      success: false,
    };
  }
}
