"use client";
import Container from "@/components/container";
import Input from "@/components/input";
import React, { useRef, useState } from "react";

export default function Dashboard() {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      setFile(draggedFile);
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
      setFile(selectedFile);
      console.log("File selected via browse:", selectedFile);
    }
  };

  const clearFile = () => {
    setFile(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Container className="flex flex-col md:flex-row my-10 gap-10 px-5 items-center">
      {/* Upload section */}
      <div className="card bg-base-100 w-96 shadow-sm rounded-lg border">
        <div className="card-body items-center text-center space-y-5">
          <div className="space-x-3">
            <button className="btn btn-primary rounded-lg min-w-36">
              Create Folder
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="btn btn-primary rounded-lg min-w-36"
            >
              Add File
            </button>
          </div>
          {/* Drag and drop file */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center transition-colors duration-200
          ${isDragging ? "border-blue-500 " : "border-gray-300"}`}
          >
            <p className="text-lg text-gray-400 mb-2">
              Drag and drop your file here, or
            </p>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-primary cursor-pointer font-medium inline bg-transparent border-0 p-0 m-0"
            >
              browse
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={changeFile}
              accept=".pdf,.jpg,.jpeg,.png"
              className="file-input hidden"
            />
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
          {/* On selete file successfully */}
          {/*
          {file && (
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

      <div className="grow">World</div>
    </Container>
  );
}
