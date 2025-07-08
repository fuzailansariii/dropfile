import { db } from "@/lib/db";
import { files } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import ImageKit from "imagekit";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

const imageKit = new ImageKit({
  publicKey: (process.env.IMAGEKIT_PUBLIC_KEY as string) || "",
  privateKey: (process.env.IMAGEKIT_PRIVATE_KEY as string) || "",
  urlEndpoint: (process.env.IMAGEKIT_URL_ENDPOINT as string) || "",
});

export async function POST(req: NextRequest) {
  try {
    // Check auth
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    // Grab the data from fromData
    const file = formData.get("file") as File;
    const formUserId = formData.get("userId") as string;
    const formParentId = formData.get("parentId") as string;

    // console.log("File received:", file?.name, file?.type);
    // console.log("Form userId:", formUserId, "| Clerk userId:", userId);
    // console.log("ParentId:", formParentId);

    if (formUserId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!file) {
      return NextResponse.json(
        { error: "No file was provided" },
        { status: 401 }
      );
    }

    // if file exist then
    if (formParentId) {
      const [parentFolder] = await db
        .select()
        .from(files)
        .where(
          and(
            eq(files.id, formParentId),
            eq(files.userId, formUserId),
            eq(files.isFolder, true)
          )
        );
      if (!parentFolder) {
        // console.log("Parent folder is not found");
        return NextResponse.json(
          { error: "Parent folder is not found" },
          { status: 404 }
        );
      }
    }

    if (!file.type.startsWith("image/") && file.type !== "application/pdf") {
      // console.log("Invalid file type:", file.type);
      return NextResponse.json(
        {
          error: "Only images and pdf are allowed to upload",
        },
        { status: 403 }
      );
    }

    // we need to convert it to the buffer before uploading it.
    const buffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(buffer);
    const folderPath = formParentId
      ? `/dropfile/${userId}/folder/${formParentId}`
      : `/dropfile/${userId}`;

    const originalFileName = file.name;
    const fileExtention = originalFileName.split(".").pop() || "";
    const uniqueFileName = `${uuidv4()}.${fileExtention}`;

    // console.log("Uploading to ImageKit:", uniqueFileName);

    const response = await imageKit.upload({
      file: fileBuffer,
      fileName: uniqueFileName,
      folder: folderPath,
      useUniqueFileName: false,
    });

    // console.log("Upload success", response);

    const fileData = {
      name: file.name,
      fileName: response.name,
      path: response.filePath,
      size: response.size,
      type: file.type,
      fileUrl: response.url,
      thumbnailUrl: response.thumbnailUrl,
      userId: userId,
      parentId: formParentId,
      isFolder: false,
      isStarred: false,
      isTrashed: false,
    };

    const newFile = await db.insert(files).values(fileData).returning();

    // console.log("Saved in DB", newFile);

    return NextResponse.json({ file: newFile }, { status: 201 });
  } catch (error: any) {
    // console.log("Upload API error", error);
    return NextResponse.json(
      { error: "failed to upload file" },
      { status: 500 }
    );
  }
}
