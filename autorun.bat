@echo off
set source="%~dp0run_dev.bat"
set shortcut="%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup\run_dev.lnk"

REM Создание ярлыка
powershell "$s=(New-Object -COMObject WScript.Shell).CreateShortcut('%shortcut%'); $s.TargetPath=%source%; $s.Save()"

if exist %shortcut% (
    echo success.
) else (
    echo error.
)
run_dev.bat
pause