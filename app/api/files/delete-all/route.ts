import { db } from "@/lib/db";
import { files } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { and, eq, isNotNull } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // get count of trashed files
    const trashedFiles = await db
      .select({ id: files.id })
      .from(files)
      .where(and(eq(files.userId, userId), isNotNull(files.isTrashed)));

    if (trashedFiles.length === 0) {
      return NextResponse.json(
        { message: "No trashed files found to delete" },
        { status: 200 }
      );
    }

    // Delete all trahsed files
    await db
      .delete(files)
      .where(and(eq(files.userId, userId), isNotNull(files.isTrashed)));

    return NextResponse.json(
      {
        message: `${trashedFiles.length} files deleted permanently`,
        deletedCount: trashedFiles.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Internal Server Error", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
