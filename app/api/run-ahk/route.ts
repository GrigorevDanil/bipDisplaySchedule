import { exec } from "child_process";
import { NextResponse } from "next/server";

export async function POST() {
  const ahkPath = "FullScreen.ahk"; // Укажите путь к вашему AHK-скрипту
  const ahkExe = "C:/Program Files/AutoHotkey/AutoHotkey.exe"; // Путь к AHK

  return new Promise((resolve) => {
    exec(`"${ahkExe}" "${ahkPath}"`, (error, stdout, stderr) => {
      if (error) {
        console.error("Ошибка запуска AHK:", error);
        resolve(
          NextResponse.json(
            { error: "Failed to run AHK script" },
            { status: 500 }
          )
        );
        return;
      }
      console.log("AHK запущен:", stdout);
      if (stderr) console.error("AHK stderr:", stderr);
      resolve(NextResponse.json({ message: "AHK script executed" }));
    });
  });
}
