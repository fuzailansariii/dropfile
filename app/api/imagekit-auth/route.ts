import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import ImageKit from "imagekit";

const imageKit = new ImageKit({
  publicKey: (process.env.IMAGEKIT_PUBLIC_KEY as string) || "",
  privateKey: (process.env.IMAGEKIT_PRIVATE_KEY as string) || "",
  urlEndpoint: (process.env.IMAGEKIT_URL_ENDPOINT as string) || "",
});

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        { status: 401 }
      );
    }
    const authParams = imageKit.getAuthenticationParameters();
    return NextResponse.json(authParams);
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to generate authentication parameters",
      },
      { status: 500 }
    );
  }
}
