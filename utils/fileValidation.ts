import { allowedTypes, FILE_UPLOAD_MESSAGES, maxSize } from "./constants";

export const validateFile = (file: File): string | null => {
  if (file.size > maxSize) {
    return FILE_UPLOAD_MESSAGES.SIZE_ERROR;
  }

  if (!allowedTypes.includes(file.type)) {
    return FILE_UPLOAD_MESSAGES.TYPE_ERROR;
  }

  return null;
};
