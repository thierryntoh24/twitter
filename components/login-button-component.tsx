"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import LoginModal from "./login-modal";
import { useRouter } from "next/navigation";
import { useAuth } from "@/utils/context/AuthContext";

export function LoginButtonComponent() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { user, signOut } = useAuth();

  // If user is logged in, don't show login button
  if (user) {
    return (
      <>
        <button
          onClick={signOut}
          className=" bg-red-500 text-white rounded-full hover:bg-red-600 transition-all duration-200 w-48 py-3 hidden xl:block"
        >
          Sign Out
        </button>
      </>
    );
  }

  // If no user, show login button that opens modal
  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className=" bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-all duration-200 w-48 py-3 hidden xl:block"
      >
        Login
      </button>

      <LoginModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
