import { NextResponse } from "next/server";

import { postRequestTime } from "@/shared/api/time";

interface RequestBody {
  date: string;
  serverAddress: string;
}

export const POST = async (request: Request) => {
  try {
    const body: RequestBody = await request.json();

    const date = new Date(body.date);

    if (isNaN(date.getTime())) {
      throw new Error("Invalid date format");
    }

    const groups = await postRequestTime(date, body.serverAddress);

    return NextResponse.json(groups);
  } catch (error) {
    if (error instanceof Error) {
      console.error("Ошибка в API Route:", error.message);

      return NextResponse.json(
        { error: "Internal Server Error", details: error.message },
        { status: 500 }
      );
    }
    // Обработка неизвестных ошибок
    console.error("Неизвестная ошибка в API Route:", error);

    return NextResponse.json(
      { error: "Internal Server Error", details: "Unknown error" },
      { status: 500 }
    );
  }
};
