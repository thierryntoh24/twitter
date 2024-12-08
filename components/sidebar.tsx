import React from "react";
import { Home, Twitter } from "lucide-react";
import Link from "next/link";
import { defaultUrl } from "@/utils/utils";
import { LoginButtonComponent } from "./login-button-component";
import { SidebarUserCard } from "./SidebarUserCard";

export default function Sidebar() {
  return (
    <div className="sidebar-wrapper">
      <div className=" flex flex-col gap-2 p-6 border-r h-screen max-h-screen w-[18rem] overflow-hidden fixed top-0">
        <Link
          href={defaultUrl}
          className="cursor-pointer p-3 hover:bg-gray-100 rounded-full flex transition-all duration-200 w-fit"
        >
          <Twitter />
        </Link>
        <Link
          href={defaultUrl}
          className="cursor-pointer p-3 hover:bg-gray-100 rounded-full flex transition-all duration-200 gap-2 w-fit"
        >
          <Home />
          <span className=" hidden xl:block">Home</span>
        </Link>

        <LoginButtonComponent />
        <SidebarUserCard />
      </div>
    </div>
  );
}
