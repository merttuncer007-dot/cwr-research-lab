@echo off
setlocal
set "LAB_ROOT=%~dp0"
set "ENGINE=%~dp0..\plugins\cwr-research-lab\scripts\rehydration.mjs"

where node.exe >nul 2>nul
if errorlevel 1 (
  echo ERROR: Node.js 22.5 or newer is required to run the deterministic CWR rehydration engine. 1>&2
  exit /b 2
)

node.exe "%ENGINE%" --lab-root "%LAB_ROOT%" %*
exit /b %ERRORLEVEL%

