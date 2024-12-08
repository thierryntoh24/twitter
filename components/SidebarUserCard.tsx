"use client";

import { useState } from "react";
import { useAuth } from "@/utils/context/AuthContext";
import Image from "next/image";

export function SidebarUserCard() {
  const [isPopupOpen, setPopupOpen] = useState(false);
  const { user, signOut } = useAuth();

  if (user) {
    return (
      <div className="relative flex items-center gap-3 p-3 bg-white rounded-full mt-auto">
        {/* User Avatar */}
        <Image
          src={user.user_metadata.picture}
          alt={user.user_metadata.name}
          width={40}
          height={40}
          className="rounded-full object-cover"
        />

        {/* User Info */}
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-900">
            {user.user_metadata.full_name}
          </span>
          <span className="text-xs text-gray-500">
            @{user.user_metadata.email}
          </span>
        </div>

        {/* Options Menu */}
        <div className="ml-auto">
          <button
            onClick={() => setPopupOpen((prev) => !prev)}
            className="text-gray-500 hover:text-gray-900 focus:outline-none"
          >
            &#x22EE; {/* Vertical Ellipsis */}
          </button>

          {isPopupOpen && (
            <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-md shadow-lg">
              <button
                onClick={signOut}
                className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return <></>;
}
