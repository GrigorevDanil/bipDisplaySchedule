import { NextResponse } from "next/server";

export const Unauthorized = () =>
  NextResponse.json({ error: "Unauthorized" }, { status: 401 });

export const InvalidData = (details: any) =>
  NextResponse.json(
    { error: "Invalid data", details: details },
    { status: 400 }
  );

export const InternalServerError = (error: any) => {
  const details = error instanceof Error ? error.message : "Unknown error";

  return NextResponse.json(
    {
      error: "Internal Server Error",
      details: details,
    },
    { status: 500 }
  );
};

export const Ok = (data: any) => NextResponse.json(data);
