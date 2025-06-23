import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { files } from "@/lib/db/schema";

export async function POST(req: NextRequest) {
  try {
    // check if the user is authenticated or not
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    // if user is authenticated then
    // parse req.body
    const body = await req.json();
    const { imagekit, userId: bodyUserId } = body;
    if (bodyUserId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!imagekit || !imagekit.url) {
      return NextResponse.json(
        { error: "Invalid file uplaod data" },
        { status: 401 }
      );
    }
    const fileData = {
      name: imagekit.name || "untitled",
      path: imagekit.filePath || `/dropfile/${userId}/${imagekit.name}`,
      size: imagekit.size || 0,
      type: imagekit.fileType || "image",
      fileUrl: imagekit.url,
      thumbnailUrl: imagekit.thumbnailUrl || null,
      userId: userId,
      parentId: null,
      isFolder: false,
      isStarred: false,
      isTrashed: false,
    };

    const [newFile] = await db.insert(files).values(fileData).returning();
    return NextResponse.json(newFile);
  } catch (error) {
    return NextResponse.json(
      {
        error: "failed to save info to DB",
      },
      { status: 500 }
    );
  }
}
