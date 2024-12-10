"use server";

import { PostgrestError } from "@supabase/supabase-js";
import { createClient } from "./supabase/server";
import { PostState, Post } from "./types";

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

  let imagePath: string | undefined = undefined;

  // Safely extract form data with optional chaining
  const message = formData.get("message") as string | undefined;
  const image = formData.get("image") as File | undefined;

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
  //       const shouldFail = Math.random() > 0; // 75% chance of failure
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

  // ---------------------

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
      let data: Omit<Post, "id" | "created_at"> = {
        content: message,
        image: imagePath,
        author: user.id,
        user_object: {
          name: user.user_metadata.name,
          email: user.email,
          avatar_url: user.user_metadata.avatar_url,
        },
      };

      const { error } = await supabase.from("posts").insert(data);

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

export async function fetchPosts() {
  const supabase = await createClient();

  let {
    data: posts,
    error,
  }: { data: Post[] | null; error: PostgrestError | null } = await supabase
    .from("posts")
    .select("*")
    .range(0, 9);

  return posts;
}
