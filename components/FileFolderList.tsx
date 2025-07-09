"use client";
import { FileRecord } from "@/types/file.types";
import axios from "axios";
import {
  Download,
  File,
  Folder,
  RotateCcw,
  Star,
  Trash,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import React from "react";

interface FileListProps {
  onClick?: (file: FileRecord) => void;
  files: FileRecord[];
  onAction?: (
    fileId: string,
    action: "star" | "unstar" | "trash" | "restore"
  ) => void;
}

export default function FileFolderList({
  onClick,
  files,
  onAction,
}: FileListProps) {
  const getFileExtension = (type: string): string => {
    const mapping: Record<string, string> = {
      "application/pdf": "PDF",
      "image/jpeg": "JPEG",
      "image/jpg": "JPG",
      "image/png": "PNG",
      "text/plain": "TXT",
    };

    return mapping[type] || "Unknown";
  };

  const sortedFiles = [...files].sort((a, b) => {
    if (a.isFolder === b.isFolder) return a.name.localeCompare(b.name);
    return a.isFolder ? -1 : 1;
  });

  // This function toggles the star status of a file and calls the onAction callback if
  const handleStarClick = async (file: FileRecord) => {
    console.log(
      "Clicking star for file:",
      file.id,
      "Current isStarred:",
      file.isStarred
    );
    if (file.isFolder) return;

    try {
      const response = await axios.patch(`/api/files/${file.id}/star`);
      if (response.status !== 200) {
        console.error("Failed to update star status:", response.data);
        return;
      }
      const updatedFile = response.data.file;
      const action = updatedFile.isStarred ? "star" : "unstar";
      onAction?.(file.id, action);
    } catch (error) {}
  };

  // This function handles the trashing or restoring of a file and calls the onAction callback if
  const trashFileHandler = async (file: FileRecord) => {
    try {
      const response = await axios.patch(`/api/files/${file.id}/trash`);
      if (response.status !== 200) {
        console.error("Failed to trash file:", response.data);
        return;
      }
      console.log("File deleted successfully:", response.data);
      const updateFile = response.data.file;
      const action = updateFile.isTrashed ? "trash" : "restore";
      onAction?.(file.id, action);
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  };

  return (
    <div>
      {sortedFiles.map((file, index) => (
        <ul key={index} className="list bg-base-100 rounded-box shadow-md">
          <li
            className={
              "list-row flex items-center justify-between p-2 cursor-pointer hover:bg-base-200"
            }
            onClick={() => file.isFolder && onClick?.(file)}
          >
            {" "}
            <div className="flex items-center gap-4">
              <div>
                {file.isFolder ? (
                  <Folder size={20} className="text-primary" />
                ) : (
                  <File size={20} className="text-secondary" />
                )}
              </div>
              <div className="flex flex-col">
                <h3 className="text-md font-semibold">{file.name}</h3>
                {!file.isFolder && (
                  <p className="text-xs text-gray-500">
                    {getFileExtension(file.type)} •{" "}
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                )}{" "}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {!file.isFolder && file.fileUrl && (
                <Link
                  href={file.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-square btn-ghost"
                  title="Download"
                >
                  <Download size={18} />
                </Link>
              )}

              {!file.isFolder && (
                <button
                  className="btn btn-square btn-ghost"
                  title={file.isStarred ? "Unstar" : "Star"}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStarClick(file);
                  }}
                >
                  <Star
                    size={18}
                    className={
                      file.isStarred ? "text-yellow-400" : "text-gray-400"
                    }
                    fill={file.isStarred ? "currentColor" : "none"}
                  />
                </button>
              )}
              <button
                className="btn btn-square btn-ghost"
                title={file.isStarred ? "Trash" : "Restore"}
                onClick={(e) => {
                  e.stopPropagation();
                  trashFileHandler(file);
                }}
              >
                {file.isTrashed ? (
                  <RotateCcw size={18} className="text-red-500" />
                ) : (
                  <Trash size={18} />
                )}
              </button>
              <button
                className="btn btn-square btn-ghost"
                title={file.isTrashed ? "Delete Permanently" : undefined}
              >
                {file.isTrashed && (
                  <span className="text-xs text-red-500">
                    <Trash2 size={18} />
                  </span>
                )}
              </button>
            </div>
          </li>
        </ul>
      ))}
    </div>
  );
}
