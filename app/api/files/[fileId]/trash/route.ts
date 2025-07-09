import { db } from "@/lib/db";
import { files } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  props: { params: Promise<{ fileId: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { fileId } = await props.params;
    if (!fileId) {
      return NextResponse.json(
        { error: "FileId is required" },
        { status: 401 }
      );
    }

    const [file] = await db
      .select()
      .from(files)
      .where(and(eq(files.id, fileId), eq(files.userId, userId)));

    if (!file) {
      return NextResponse.json({ error: "file not found" }, { status: 404 });
    }

    const updateFiles = await db
      .update(files)
      .set({ isTrashed: !file.isTrashed })
      .where(and(eq(files.id, fileId), eq(files.userId, userId)))
      .returning();

    const updatedFile = updateFiles[0];
    return NextResponse.json({ file: updatedFile });
  } catch (error) {
    return NextResponse.json(
      { error: "Error during updating the file" },
      { status: 500 }
    );
  }
}
