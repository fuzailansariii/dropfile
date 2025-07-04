"use client";
import Container from "@/components/container";
import React, { useRef, useState } from "react";
import Button from "@/components/button";
import {
  File,
  FileIcon,
  FilePlus,
  FolderPlus,
  Star,
  Trash,
  Upload,
} from "lucide-react";
import { files } from "@/lib/db/schema";

// Using Drizzle types
type FileRecord = {
  id: string;
  name: string;
  path: string;
  size: number;
  type: string;
  fileUrl: string;
  thumbnailUrl: string | null;
  userId: string;
  parentId: string | null;
  isFolder: boolean;
  isStarred: boolean;
  isTrashed: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export default function Dashboard() {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<FileRecord[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [activeTabs, setActiveTabs] = useState<"all" | "starred" | "trash">(
    "all"
  );
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const createFolderModal = useRef<HTMLDialogElement>(null);

  const openModal = () => {
    if (createFolderModal.current) {
      createFolderModal.current.showModal();
    }
  };

  const closeModal = () => {
    if (createFolderModal.current) {
      createFolderModal.current.close();
    }
  };

  const allowedTypes = [
    "application/pdf",
    "image/jpeg",
    "image/jpg",
    "image/png",
  ];
  const maxSize = 5 * 1024 * 1024;

  const validateFile = (file: File): string | null => {
    if (file.size > maxSize) {
      return "File should be less than 5MB";
    }

    if (!allowedTypes.includes(file.type)) {
      return "Only PDF, JPG, and PNG files are allowed";
    }

    return null;
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const draggedFile = e.dataTransfer.files[0];

      const validationError = validateFile(draggedFile);
      if (validationError) {
        setError(validationError);
        return;
      }
      setError(null);
      // setFiles(draggedFile);
      console.log("File selected via drag and drop:", draggedFile);
    }
  };

  const changeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];

      const validationError = validateFile(selectedFile);
      if (validationError) {
        setError(validationError);
        return;
      }
      setError(null);
      // setFiles(selectedFile);
      console.log("File selected via browse:", selectedFile);
    }
  };

  const clearFile = () => {
    // setFiles(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Filter files based on the active tab
  const getFilteredFiles = () => {
    switch (activeTabs) {
      case "starred":
        return files.filter((file) => file.isStarred && !file.isTrashed);
      case "trash":
        return files.filter((file) => file.isTrashed);
      default:
        return files.filter((file) => !file.isTrashed);
    }
  };

  const filterFile = getFilteredFiles();

  return (
    <Container className="flex flex-col md:flex-row my-10 gap-10 px-5">
      {/* Upload section */}
      <div className="card w-96 shadow-sm rounded-xl bg-base-300 py-10">
        <div className="card-body items-center text-center space-y-5">
          {/* Buttons to create and add files */}

          <dialog className="modal" ref={createFolderModal}>
            <div className="modal-box">
              <form method="dialog" className="w-2/3 mx-auto py-7">
                <button
                  onClick={closeModal}
                  className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                >
                  ✕
                </button>
                <h3 className="font-bold text-lg">Create Folder</h3>
                <input
                  type="text"
                  placeholder="Folder Name"
                  className="w-full rounded-lg input input-bordered mt-4"
                />
                <button className="btn btn-secondary mt-5 w-full">
                  Create Folder
                </button>
              </form>
            </div>
          </dialog>

          <div className="space-x-3">
            <Button
              title="Create Folder"
              onClick={openModal}
              className="btn btn-primary rounded-lg min-w-36"
              startIcon={<FolderPlus size={"20"} />}
            ></Button>
            <Button
              type="button"
              title="New File"
              onClick={() => fileInputRef.current?.click()}
              className="btn btn-primary rounded-lg min-w-36"
              startIcon={<FilePlus size={"20"} />}
            />
          </div>
          {/* Drag and drop file */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center transition-colors duration-200
          ${isDragging ? "border-blue-500 " : "border-gray-300"}`}
          >
            {isUploading ? (
              <>
                <div className="loading loading-spinner loading-lg text-primary"></div>
                <p className="text-sm text-gray-500 mt-2">Uploading...</p>
              </>
            ) : (
              <>
                <Upload className="rounded-lg text-primary h-12 w-12" />
                <p className="text-sm text-gray-400 mb-2">
                  Drag and drop your file here, or
                </p>
                <Button
                  title="browse"
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-primary text-md underline cursor-pointer font-medium inline bg-transparent border-0 p-0 m-0"
                />

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={changeFile}
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="file-input hidden"
                />
              </>
            )}
            <p className="text-sm text-gray-500 mt-2">
              Only PDF, JPG, PNG, files are allowed. <br />
              Max size: 5MB.
            </p>
          </div>
          {/* error message */}
          {error && (
            <div className="alert alert-error">
              <span>{error}</span>
            </div>
          )}
          {/* On select file successfully */}
          {/* {file && (
            <div className="alert alert-success">
              <div className="flex justify-between items-center w-full">
                <span>File: {file.name}</span>
                <button onClick={clearFile} className="btn btn-sm btn-ghost">
                  ✕
                </button>
              </div>
            </div>
          )} */}
        </div>
      </div>

      {/* file section */}

      <div className="grow">
        {/* name of each tab group should be unique */}
        <div className="tabs tabs-lift">
          {/* All files tab */}
          <label
            className={`tab gap-2 ${activeTabs === "all" ? "tab-active" : ""}`}
          >
            <input
              type="radio"
              name="file_tabs"
              checked={activeTabs === "all"}
              onChange={() => setActiveTabs("all")}
            />
            <File size={"16"} />
            All Files ({files.filter((f) => !f.isTrashed).length})
          </label>
          <div className="tab-content bg-base-100 border-base-300 p-6">
            {activeTabs === "all" && (
              <div className="space-y-4">
                {filterFile.length === 0 ? (
                  <div className="text-center py-12">
                    <FileIcon
                      size={48}
                      className="mx-auto text-gray-300 mb-4"
                    />
                    <h3 className="text-lg font-medium text-gray-500 mb-2">
                      No files uploaded yet
                    </h3>
                    <p className="text-gray-400">
                      Upload your first file to get started
                    </p>
                  </div>
                ) : (
                  // connect with your file list component
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols>3 lg:grid-cols-4 gap-4">
                    <div>Files to upload here</div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* starred files tab */}
          <label
            className={`tab gap-2 ${
              activeTabs === "starred" ? "tab-active" : ""
            }`}
          >
            <input
              type="radio"
              name="file_tabs"
              checked={activeTabs === "starred"}
              onChange={() => setActiveTabs("starred")}
            />
            <Star size={"16"} />
            Starred ({files.filter((f) => f.isStarred).length})
          </label>
          <div className="tab-content bg-base-100 border-base-300 p-6">
            {activeTabs === "starred" && (
              <div>
                {filterFile.length === 0 ? (
                  <div className="text-center py-12">
                    <Star size={48} className="mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-500 mb-2">
                      No Starred file
                    </h3>
                    <p className="text-gray-400">
                      Star files to find them easily
                    </p>
                  </div>
                ) : (
                  <div>Hello World</div>
                )}
              </div>
            )}
          </div>

          <label
            className={`tab gap-2 ${
              activeTabs === "trash" ? "tab-active" : ""
            }`}
          >
            <input
              type="radio"
              name="file_tabs"
              checked={activeTabs === "trash"}
              onChange={() => setActiveTabs("trash")}
            />
            <Trash size={"16"} />
            Trash ({files.filter((f) => f.isTrashed).length})
          </label>
          <div className="tab-content bg-base-100 border-base-300 p-6">
            {activeTabs === "trash" && (
              <div>
                {filterFile.length === 0 ? (
                  <div className="text-center py-12">
                    <Trash size={48} className="mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-500 mb-2">
                      Trash is empty{" "}
                    </h3>
                    <p className="text-gray-400">
                      Deleted files will appear here{" "}
                    </p>
                  </div>
                ) : (
                  <div>Hello World</div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Container>
  );
}
