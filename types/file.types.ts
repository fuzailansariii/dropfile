// Using Drizzle types
export type FileRecord = {
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
