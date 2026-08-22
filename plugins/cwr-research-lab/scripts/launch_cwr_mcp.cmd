@echo off
setlocal
set "PLUGIN_ROOT=%~dp0.."
set "SERVER=%PLUGIN_ROOT%\scripts\server.mjs"

if defined CODEX_MCP_NODE_PATH if exist "%CODEX_MCP_NODE_PATH%" (
  "%CODEX_MCP_NODE_PATH%" "%SERVER%" --stdio
  exit /b
)
if defined CODEX_BROWSER_USE_NODE_PATH if exist "%CODEX_BROWSER_USE_NODE_PATH%" (
  "%CODEX_BROWSER_USE_NODE_PATH%" "%SERVER%" --stdio
  exit /b
)
if defined CODEX_ELECTRON_RESOURCES_PATH if exist "%CODEX_ELECTRON_RESOURCES_PATH%\cua_node\bin\node.exe" (
  "%CODEX_ELECTRON_RESOURCES_PATH%\cua_node\bin\node.exe" "%SERVER%" --stdio
  exit /b
)
if defined CODEX_CLI_PATH for %%I in ("%CODEX_CLI_PATH%") do if exist "%%~dpIcua_node\bin\node.exe" (
  "%%~dpIcua_node\bin\node.exe" "%SERVER%" --stdio
  exit /b
)
if defined USERPROFILE if exist "%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe" (
  "%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe" "%SERVER%" --stdio
  exit /b
)
if defined LOCALAPPDATA for /d %%D in ("%LOCALAPPDATA%\OpenAI\Codex\runtimes\cua_node\*") do if exist "%%~fD\bin\node.exe" (
  "%%~fD\bin\node.exe" "%SERVER%" --stdio
  exit /b
)

where node >nul 2>&1
if not errorlevel 1 (
  node "%SERVER%" --stdio
  exit /b
)

echo CWR MCP could not find a Node runtime. Reinstall or update Codex. 1>&2
exit /b 127
