import * as z from "zod";

export const createFolderSchema = z.object({
  folderName: z
    .string()
    .min(1, { message: "Folder name is required" })
    .min(4, { message: "Please enter at least 4 character" }),
});
