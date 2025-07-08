"use client";
import { FileRecord } from "@/app/(pages)/dashboard/page";
import { Download, File, Folder, Star, Trash } from "lucide-react";
import Link from "next/link";

interface FileListProps {
  onClick?: (file: FileRecord) => void;
  files: FileRecord[];
}

export default function FileFolderList({ onClick, files }: FileListProps) {
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
              <button className="btn btn-square btn-ghost">
                <Star size={18} />
              </button>
              <button className="btn btn-square btn-ghost">
                <Trash size={18} />
              </button>
            </div>
          </li>
        </ul>
      ))}
    </div>
  );
}
