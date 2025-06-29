import { NextResponse } from "next/server";

export const parseJsonRequest = async <T = any>(
  req: Request
): Promise<NextResponse | T> => {
  const contentType = req.headers.get("content-type");

  if (!contentType?.includes("application/json")) {
    return NextResponse.json(
      { error: "Request must be JSON" },
      { status: 400 }
    );
  }

  try {
    return await req.json();
  } catch (e) {
    return NextResponse.json({ error: "Invalid JSON format" }, { status: 400 });
  }
};
