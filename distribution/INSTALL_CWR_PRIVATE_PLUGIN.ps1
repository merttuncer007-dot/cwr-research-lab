[CmdletBinding()]
param(
    [switch]$SkipCodexRegistration,
    [switch]$VerifyOnly,
    [string]$InstallRoot
)

$ErrorActionPreference = 'Stop'

$sourceBundleRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$bundleRoot = $sourceBundleRoot
$labRoot = Join-Path $bundleRoot 'CWR_RESEARCH_LAB'
$pluginRoot = Join-Path $bundleRoot 'plugins\cwr-research-lab'
$marketplacePath = Join-Path $bundleRoot '.agents\plugins\marketplace.json'
$manifestPath = Join-Path $bundleRoot 'MANIFEST_SHA256.txt'

foreach ($requiredPath in @(
    (Join-Path $labRoot 'data\lab.sqlite3'),
    (Join-Path $pluginRoot '.codex-plugin\plugin.json'),
    (Join-Path $pluginRoot '.mcp.json'),
    $marketplacePath,
    $manifestPath
)) {
    if (-not (Test-Path -LiteralPath $requiredPath)) {
        throw "Eksik kurulum bileşeni: $requiredPath"
    }
}

Write-Host 'CWR özel paket bütünlüğü doğrulanıyor...'
$failures = [System.Collections.Generic.List[string]]::new()
foreach ($line in Get-Content -LiteralPath $manifestPath) {
    if ([string]::IsNullOrWhiteSpace($line)) { continue }
    if ($line.Length -lt 67 -or $line.Substring(64, 2) -ne '  ') {
        $failures.Add("Geçersiz manifest satırı: $line")
        continue
    }
    $expected = $line.Substring(0, 64).ToUpperInvariant()
    $relative = $line.Substring(66).Replace('/', [System.IO.Path]::DirectorySeparatorChar)
    $target = Join-Path $bundleRoot $relative
    if (-not (Test-Path -LiteralPath $target)) {
        $failures.Add("Eksik dosya: $relative")
        continue
    }
    $actual = (Get-FileHash -Algorithm SHA256 -LiteralPath $target).Hash
    if ($actual -ne $expected) {
        $failures.Add("Hash uyuşmazlığı: $relative")
    }
}

if ($failures.Count -gt 0) {
    $failures | ForEach-Object { Write-Error $_ }
    throw 'Paket bütünlük doğrulaması başarısız. Kurulum durduruldu.'
}

if ($VerifyOnly) {
    Write-Host 'Paket bütünlüğü doğrulandı. -VerifyOnly nedeniyle kurulum yapılmadı.'
    return
}

if ([string]::IsNullOrWhiteSpace($InstallRoot)) {
    if ([string]::IsNullOrWhiteSpace($env:LOCALAPPDATA)) {
        throw 'LOCALAPPDATA bulunamadı; kalıcı özel plugin dizini seçilemiyor.'
    }
    $manifestHash = (Get-FileHash -Algorithm SHA256 -LiteralPath $manifestPath).Hash.Substring(0, 12).ToLowerInvariant()
    $InstallRoot = Join-Path $env:LOCALAPPDATA "CWR Research Lab\private-plugin\v0.1.0-$manifestHash"
}

$sourceResolved = (Resolve-Path -LiteralPath $sourceBundleRoot).Path
$installParent = Split-Path -Parent $InstallRoot
New-Item -ItemType Directory -Path $installParent -Force | Out-Null
New-Item -ItemType Directory -Path $InstallRoot -Force | Out-Null
$installResolved = (Resolve-Path -LiteralPath $InstallRoot).Path

if ($sourceResolved -ne $installResolved) {
    Write-Host "Paket kalıcı kullanıcı dizinine kopyalanıyor: $installResolved"
    foreach ($item in Get-ChildItem -LiteralPath $sourceResolved -Force) {
        Copy-Item -LiteralPath $item.FullName -Destination $installResolved -Recurse -Force
    }
}

$bundleRoot = $installResolved
$labRoot = Join-Path $bundleRoot 'CWR_RESEARCH_LAB'
$pluginRoot = Join-Path $bundleRoot 'plugins\cwr-research-lab'
$marketplacePath = Join-Path $bundleRoot '.agents\plugins\marketplace.json'

[Environment]::SetEnvironmentVariable('CWR_LAB_ROOT', $labRoot, 'User')
$env:CWR_LAB_ROOT = $labRoot
Write-Host "CWR_LAB_ROOT ayarlandı: $labRoot"

if (-not $SkipCodexRegistration) {
    $codex = Get-Command codex -ErrorAction SilentlyContinue
    if (-not $codex) {
        throw 'Codex komutu bulunamadı. ChatGPT/Codex masaüstü uygulamasını kurun veya -SkipCodexRegistration kullanın.'
    }

    & $codex.Source plugin marketplace add $bundleRoot
    $marketplaceExit = $LASTEXITCODE

    & $codex.Source plugin add 'cwr-research-lab@cwr-private'
    if ($LASTEXITCODE -ne 0) {
        throw "CWR plugin kurulamadı (çıkış kodu $LASTEXITCODE; marketplace add kodu $marketplaceExit)."
    }
}

Write-Host ''
Write-Host 'CWR Research Lab özel plugin kurulumu tamamlandı.'
Write-Host "Kalıcı paket yolu: $bundleRoot"
Write-Host 'Codex plugin araçlarını bu task içinde görmezse yeni bir task başlatın.'
Write-Host 'ChatGPT için geliştirici uygulaması ve kullanıcıya özel Secure MCP Tunnel bağlantısı ayrıca gerekir.'
Write-Host 'Bu işlem public Plugins Directory üzerinde yayın veya paylaşım yapmadı.'

