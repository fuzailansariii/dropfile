import { db } from "@/lib/db";
import { files } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
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
        { status: 400 }
      );
    }

    const [file] = await db
      .select()
      .from(files)
      .where(and(eq(files.id, fileId), eq(files.userId, userId)));
    if (!file) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }
    if (!file.isTrashed) {
      return NextResponse.json(
        {
          error: "File must be moved to trash before permanent deletion",
        },
        { status: 400 }
      );
    }

    // if file exist then delete it.
    await db
      .delete(files)
      .where(and(eq(files.id, fileId), eq(files.userId, userId)));

    return NextResponse.json(
      { message: "File deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error deleting file", error.message);
    return NextResponse.json(
      { error: "Internal server error", errorMessage: error.message },
      { status: 500 }
    );
  }
}
