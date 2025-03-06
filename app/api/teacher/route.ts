import { NextResponse } from "next/server";

import { postRequestTeacher } from "@/shared/api/teacher";

export const POST = async () => {
  try {
    const groups = await postRequestTeacher();

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
