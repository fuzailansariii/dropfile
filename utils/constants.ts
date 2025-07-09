// file validation
export const allowedTypes = [
  "application/pdf",
  "image/jpeg",
  "image/jpg",
  "image/png",
];
export const maxSize = 5 * 1024 * 1024;

export const FILE_UPLOAD_MESSAGES = {
  SIZE_ERROR: "File should be less than 5MB",
  TYPE_ERROR: "Only PDF, JPG, and PNG files are allowed",
  UPLOAD_ERROR: "Failed to upload file",
  FETCH_ERROR: "Failed to fetch files",
  CREATE_FOLDER_ERROR: "Failed to create folder",
};
