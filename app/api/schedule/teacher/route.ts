import { postRequestTeacherShedule } from "@/shared/api/schedule";
import { NextResponse } from "next/server";

interface TeacherRequestBody {
  teacher: string;
  date: string;
}

export const POST = async (request: Request) => {
  try {
    const body: TeacherRequestBody = await request.json();

    const date = new Date(body.date);
    if (isNaN(date.getTime())) {
      throw new Error("Invalid date format");
    }

    const schedule = await postRequestTeacherShedule(body.teacher, date);

    return NextResponse.json(schedule);
  } catch (error) {
    if (error instanceof Error) {
      console.error("Ошибка в Teacher API Route:", error.message);
      return NextResponse.json(
        { error: "Internal Server Error", details: error.message },
        { status: 500 }
      );
    }
    console.error("Неизвестная ошибка в Teacher API Route:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: "Unknown error" },
      { status: 500 }
    );
  }
};
