import { NextResponse } from "next/server";

import { postRequestGroup } from "@/shared/api/group/postRequest";

export const POST = async (req: Request) => {
  const data = await req.json();

  try {
    if (!data?.serverAddress?.trim())
      return NextResponse.json(
        { error: "Enter server address in the settings!" },
        { status: 404 }
      );

    const groups = await postRequestGroup(data.serverAddress);

    return NextResponse.json(groups);
  } catch (error) {
    if (error instanceof Error) {
      console.error("Ошибка в API Route:", error.message);

      return NextResponse.json(
        { error: "Internal Server Error", details: error.message },
        { status: 500 }
      );
    }
  }
};
