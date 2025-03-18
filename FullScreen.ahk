#SingleInstance Force
SetWorkingDir %A_ScriptDir%

processedWindows := Object()

CheckWindows:
; Получаем список всех окон
WinGet, windows, List

if (windows = 0) {
    ExitApp  ; Если окон нет, выходим
}

; Перебираем все окна
Loop, %windows%
{
    this_id := windows%A_Index%
    WinGetPos, x, y, width, height, ahk_id %this_id%
    
    ; Пропускаем свернутые окна и панель задач
    WinGet, winState, MinMax, ahk_id %this_id%
    WinGetClass, winClass, ahk_id %this_id%
    if (winState = -1 || winClass = "Shell_TrayWnd" || winClass = "Progman")
        continue
    
    ; Используем уникальный ID окна как ключ
    windowKey := this_id
    
    ; Проверяем, существует ли окно и еще не обработано
    IfWinExist, ahk_id %this_id%
    {
        if (processedWindows[windowKey] = "")
        {
            ; Определяем, на каком мониторе находится окно
            SysGet, MonitorCount, MonitorCount
            targetMonitor := 0
            Loop, %MonitorCount%
            {
                SysGet, Monitor, Monitor, %A_Index%
                if (x >= MonitorLeft && x < MonitorRight && y >= MonitorTop && y < MonitorBottom)
                {
                    targetMonitor := A_Index
                    break
                }
            }
            
            ; Пропускаем окна на основном мониторе (монитор 1)
            if (targetMonitor = 1)
                continue
            
            ; Активируем окно и отправляем F11 только для окон не на основном мониторе
            WinActivate, ahk_id %this_id%
            Sleep, 100
            Send {F11}
            Sleep, 100
            processedWindows[windowKey] := 1
        }
    }
}

; Завершаем скрипт после обработки всех окон
ExitApp
return

; Выход из скрипта по горячей клавише (на случай необходимости прервать)
^Esc::ExitApp