import { NextResponse } from "next/server";

import { postRequestGroup } from "@/shared/api/group/postRequest";

export const POST = async (req: Request) => {
  try {
    // Проверяем Content-Type заголовок
    const contentType = req.headers.get("content-type");

    if (!contentType?.includes("application/json")) {
      return NextResponse.json(
        { error: "Request must be JSON" },
        { status: 400 }
      );
    }

    // Пытаемся прочитать тело запроса
    let data;

    try {
      data = await req.json();
    } catch (e) {
      return NextResponse.json(
        { error: "Invalid JSON format" },
        { status: 400 }
      );
    }

    // Проверяем наличие обязательных полей
    if (!data?.serverAddress?.trim()) {
      return NextResponse.json(
        { error: "Enter server address in the settings!" },
        { status: 400 }
      );
    }

    const groups = await postRequestGroup(data.serverAddress);

    return NextResponse.json(groups);
  } catch (error) {
    console.error("Ошибка в API Route:", error);

    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
};
