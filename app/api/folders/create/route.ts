import { db } from "@/lib/db";
import { files } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq, and } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, userId: bodyUserId, parentId } = body;
    if (bodyUserId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!name || typeof name !== "string" || name.trim() === "") {
      return NextResponse.json(
        { error: "folder name is required" },
        { status: 400 }
      );
    }

    if (parentId) {
      const [parentFolder] = await db
        .select()
        .from(files)
        .where(
          and(
            eq(files.id, parentId),
            eq(files.userId, userId),
            eq(files.isFolder, true)
          )
        );
      if (!parentFolder) {
        return NextResponse.json(
          { error: "folder not found" },
          { status: 404 }
        );
      }
    }

    // create a folder in db.
    const folderData = {
      id: uuidv4(),
      name: name.trim(),
      path: `/folders/${userId}/${uuidv4()}`,
      size: 0,
      type: "folder",
      fileUrl: "",
      thumbnailUrl: "",
      userId,
      parentId,
      isFolder: true,
      isStarred: false,
      isTrashed: false,
    };

    const [newFolder] = await db.insert(files).values(folderData).returning();
    return NextResponse.json(
      {
        success: true,
        message: "folder created successfully",
        folder: newFolder,
      },
      { status: 201 }
    );
  } catch (error) {}
}
