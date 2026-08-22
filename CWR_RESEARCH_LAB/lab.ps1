param(
    [Parameter(Position = 0, Mandatory = $true)]
    [string]$Command,

    [Parameter(Position = 1, ValueFromRemainingArguments = $true)]
    [string[]]$CommandArgs
)

$PythonRuntime = 'C:\Users\mertt\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe'
$LabCli = Join-Path $PSScriptRoot 'cwr_lab.py'

if (-not (Test-Path -LiteralPath $PythonRuntime)) {
    throw "Bundled Python runtime not found: $PythonRuntime"
}

& $PythonRuntime $LabCli $Command @CommandArgs
exit $LASTEXITCODE
