@echo off
setlocal
title CWR Research Lab - Ozel Plugin Kurulumu

"%SystemRoot%\System32\WindowsPowerShell\v1.0\powershell.exe" -NoLogo -NoProfile -ExecutionPolicy Bypass -File "%~dp0INSTALL_CWR_PRIVATE_PLUGIN.ps1"
set "CWR_EXIT=%ERRORLEVEL%"

echo.
if not "%CWR_EXIT%"=="0" (
    echo CWR plugin kurulumu tamamlanamadi. Hata kodu: %CWR_EXIT%
    echo Yukaridaki hata metnini ChatGPT veya Codex'e gosterin.
) else (
    echo CWR plugin kurulumu tamamlandi.
    echo Codex araclari gorunmuyorsa yeni bir task acin.
)
pause
exit /b %CWR_EXIT%

