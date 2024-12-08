"use client";

import { useAuth } from "@/utils/context/AuthContext";
import { useState } from "react";
import ComposeModal from "./ComposeModal";

export default function Compose() {
  const { user } = useAuth(); // Access user from AuthContext
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  if (!user) return null; // Ensure the user is logged in before showing the compose component

  return (
    <div className="relative">
      {/* Post Compose Field */}
      <div
        onClick={handleOpen}
        className="flex items-center w-full px-6 py-3 border-b border-gray-200 cursor-pointer gap-4"
      >
        <img
          src={user.user_metadata.picture || "/default-avatar.png"} // Use user's avatar or fallback image
          alt="User Avatar"
          className="h-10 w-10 rounded-full object-cover"
        />
        <span className="text-gray-800">What’s new?</span>
      </div>

      <ComposeModal
        user={user}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </div>
  );
}
