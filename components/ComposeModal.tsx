import { User } from "@supabase/supabase-js";
import { Image } from "lucide-react";
import React, { useActionState, useState } from "react";
import ImageUpload from "./ImageUpload";
import { uploadPost } from "@/utils/supabase/actions";

type ComposeModalProps = {
  user: User;
  isOpen: boolean;
  onClose: () => void;
};

export default function ComposeModal({
  user,
  isOpen,
  onClose,
}: ComposeModalProps) {
  const [message, setMessage] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  // const [isPosting, setIsPosting] = useState(false);

  const initialState: { message: string | null } = { message: null };
  const [state, formAction, isPosting] = useActionState(
    uploadPost,
    initialState
  );

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // Enforce file type constraints
    const allowedExtensions = ["jpg", "jpeg", "png", "webp"];
    const fileExtension = file.name.toLowerCase().split(".").pop();

    if (
      !fileExtension ||
      !allowedExtensions.some((ext) => fileExtension.endsWith(ext))
    ) {
      alert("Please upload a valid image file (JPG, JPEG, PNG, or WEBP).");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert("File size exceeds 2MB. Please upload a smaller file.");
      return;
    }

    // Simulate upload process
    setLoading(true);
    const reader = new FileReader();
    reader.onload = () => {
      setTimeout(() => {
        setImagePreview(reader.result as string);
        setLoading(false);
        setImage(file);
      }, 2000); // Artificial delay
    };
    reader.readAsDataURL(file);
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  const handlePost = (e: FormData) => {
    // Prevent double clicks with a loading state
    if (isPosting) return;

    try {
      // Ensure user is logged in before attempting to post
      if (!user) {
        console.error("User not authenticated.");
        throw new Error("You must be logged in to post.");
      }
      // Attempt to upload the post
      formAction(e);

      // Reset the modal after successful post
      console.log("Post uploaded successfully:");
      resetModal();
    } catch (error) {
      console.error("Error posting:", error);
      // Optionally: Show an error message to the user
    }
  };

  const resetModal = () => {
    setMessage("");
    setImage(null);
    setImagePreview(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={resetModal}
    >
      <div
        className="bg-white w-full max-w-lg rounded-xl shadow-lg p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-4 mb-4">
          <h3 className="font-medium">New Thread</h3>
          <button
            onClick={resetModal}
            className="text-gray-500 hover:text-gray-700"
          >
            Cancel
          </button>
        </div>

        <form>
          {/* Compose Content */}
          <div className="flex items-start gap-2 max-h-96 overflow-scroll ">
            {/* Avatar */}
            <img
              src={user.user_metadata.picture} // Use user's avatar or fallback image
              alt="User Avatar"
              className="h-10 w-10 rounded-full object-cover"
            />

            {/* Input Fields */}
            <div className="flex-1 gap-3">
              {/* Text Field */}
              <textarea
                className="w-full border-0 outline-none rounded-lg text-gray-800 resize-none focus:text-black"
                placeholder="What’s new?"
                rows={3}
                name="message"
                value={message}
                onChange={handleMessageChange}
              ></textarea>

              <ImageUpload
                onImageChange={setImage}
                imagePreview={imagePreview}
                setImagePreview={setImagePreview}
                loading={loading}
              />
            </div>
          </div>

          {/* Post Button */}
          <div className="flex justify-between pt-2 mt-2 border-t border-gray-200 items-center">
            {/* Image Upload */}
            <div className="mt-3 flex items-center ">
              <input
                type="file"
                id="upload-image"
                accept=".jpg, .jpeg, .png, .webp"
                name="image"
                onChange={handleImageChange}
                className="hidden"
              />
              <label
                htmlFor="upload-image"
                className="cursor-pointer p-2 rounded-full hover:bg-blue-300 transition-colors"
              >
                <Image size={18} />
              </label>
            </div>

            <button
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition h-fit disabled:cursor-not-allowed disabled:bg-blue-400"
              disabled={isPosting || (!message.trim() && !image)}
              formAction={handlePost}
            >
              {isPosting ? "Posting..." : "Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
