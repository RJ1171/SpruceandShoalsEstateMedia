"use client";

import { useMemo, useState } from "react";

export function useUploadState() {
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const totalSize = useMemo(() => files.reduce((sum, file) => sum + file.size, 0), [files]);

  return {
    files,
    setFiles,
    isUploading,
    setIsUploading,
    totalSize
  };
}
