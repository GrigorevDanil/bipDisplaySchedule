import { exec } from "child_process";

import { NextResponse } from "next/server";

export async function POST(): Promise<NextResponse> {
  const ahkPath = "FullScreen.ahk";
  const ahkExe = "C:/Program Files/AutoHotkey/AutoHotkey.exe";

  return new Promise<NextResponse>((resolve) => {
    exec(`"${ahkExe}" "${ahkPath}"`, (error, stdout, stderr) => {
      if (error) {
        console.error("Ошибка запуска AHK:", error);
        resolve(
          NextResponse.json(
            {
              success: false,
              error: "Failed to run AHK script",
              details: error.message,
            },
            { status: 500 }
          )
        );

        return;
      }

      console.log("AHK запущен:", stdout);
      if (stderr) console.error("AHK stderr:", stderr);

      resolve(
        NextResponse.json(
          {
            success: true,
            message: "AHK script executed successfully",
            output: stdout,
          },
          { status: 200 }
        )
      );
    });
  });
}
