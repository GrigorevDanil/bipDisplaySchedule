import { NextResponse } from "next/server";

import { postRequestGroup } from "@/shared/api/group/postRequest";

export const POST = async () => {
  try {
    const groups = await postRequestGroup();

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
