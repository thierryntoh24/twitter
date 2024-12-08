import React from "react";

export default function NavBar({ title }: { title: string }) {
  return (
    <div className="h-14 w-full flex items-center border-b border-gray-200 px-6">
      <h1 className="font-medium">{title}</h1>
    </div>
  );
}
