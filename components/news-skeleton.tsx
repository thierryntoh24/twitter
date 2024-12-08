import React from "react";

export default function NewsSkeleton() {
  return (
    <div className="border border-gray-200 rounded-xl flex-col hidden xl:flex mx-4">
      <div className="my-2 mx-4 w-16 h-4 bg-gray-200 rounded-full"></div>
      <div className="py-2 px-4 flex flex-col gap-1">
        <div className="h-4 bg-gray-200 rounded-full"></div>
        <div className="h-4 bg-gray-200 rounded-full"></div>
        <div className="h-4 w-10 bg-gray-200 rounded-full"></div>
      </div>
      <div className="py-2 px-4 flex flex-col gap-1">
        <div className="h-4 bg-gray-200 rounded-full"></div>
        <div className="h-4 bg-gray-200 rounded-full"></div>
        <div className="h-4 w-10 bg-gray-200 rounded-full"></div>
      </div>
      <div className="py-2 px-4 flex flex-col gap-1">
        <div className="h-4 bg-gray-200 rounded-full"></div>
        <div className="h-4 bg-gray-200 rounded-full"></div>
        <div className="h-4 w-10 bg-gray-200 rounded-full"></div>
      </div>
      <div className="my-2 mx-4 w-16 h-4 bg-gray-200 rounded-full"></div>
    </div>
  );
}
