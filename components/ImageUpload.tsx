"use client";

import { useState } from "react";

interface ImageUploadProps {
  onImageChange: (file: File | null) => void;
  imagePreview: string | null;
  setImagePreview: React.Dispatch<React.SetStateAction<string | null>>;
  loading: boolean;
}

export default function ImageUpload({
  onImageChange,
  setImagePreview,
  imagePreview,
  loading,
}: ImageUploadProps) {
  const handleRemoveImage = () => {
    setImagePreview(null);
    onImageChange(null);
  };

  return (
    <div className="mt-4">
      {/* Loading Skeleton */}
      {loading && (
        <div className="w-full h-40 bg-gray-200 animate-pulse rounded-lg" />
      )}

      {/* Image Preview */}
      {imagePreview && !loading && (
        <div className="relative">
          <img
            src={imagePreview}
            alt="Preview"
            className="w-full h-auto rounded-lg"
          />
          <button
            onClick={handleRemoveImage}
            className="absolute top-2 right-2 bg-gray-700 text-white rounded-full p-1 hover:bg-gray-800"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
