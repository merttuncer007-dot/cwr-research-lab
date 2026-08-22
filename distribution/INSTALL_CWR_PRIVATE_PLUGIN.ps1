[CmdletBinding()]
param(
    [switch]$SkipCodexRegistration,
    [switch]$VerifyOnly
)

$ErrorActionPreference = 'Stop'

$bundleRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
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

[Environment]::SetEnvironmentVariable('CWR_LAB_ROOT', $labRoot, 'User')
$env:CWR_LAB_ROOT = $labRoot
Write-Host "CWR_LAB_ROOT ayarlandı: $labRoot"

if (-not $SkipCodexRegistration) {
    $codex = Get-Command codex -ErrorAction SilentlyContinue
    if (-not $codex) {
        throw 'Codex komutu bulunamadı. ChatGPT/Codex masaüstü uygulamasını kurun veya -SkipCodexRegistration kullanın.'
    }

    & $codex.Source plugin marketplace add $bundleRoot
    if ($LASTEXITCODE -ne 0) {
        throw "Yerel marketplace eklenemedi (çıkış kodu $LASTEXITCODE)."
    }

    & $codex.Source plugin add 'cwr-research-lab@personal'
    if ($LASTEXITCODE -ne 0) {
        throw "CWR plugin kurulamadı (çıkış kodu $LASTEXITCODE)."
    }
}

Write-Host ''
Write-Host 'CWR Research Lab özel plugin kurulumu tamamlandı.'
Write-Host 'ChatGPT/Codex masaüstü uygulamasını tamamen kapatıp yeniden açın ve yeni bir task başlatın.'
Write-Host 'Bu işlem public Plugins Directory üzerinde yayın veya paylaşım yapmadı.'
