[CmdletBinding()]
param(
    [string]$OutputPath,
    [switch]$Force
)

$ErrorActionPreference = 'Stop'

$repoRoot = Split-Path -Parent $PSScriptRoot
if (-not $OutputPath) {
    $OutputPath = Join-Path $repoRoot 'CWR_PRIVATE_PLUGIN_INSTALLER_v0_1_0_2026-08-23.zip'
}
$OutputPath = [System.IO.Path]::GetFullPath($OutputPath)

if (Test-Path -LiteralPath $OutputPath) {
    if (-not $Force) {
        throw "Cikti zaten var: $OutputPath. Bilerek yenilemek icin -Force kullanin."
    }
    Remove-Item -LiteralPath $OutputPath -Force
}

$tempRoot = Join-Path ([System.IO.Path]::GetTempPath()) ('cwr-private-plugin-' + [guid]::NewGuid().ToString('N'))
$bundleRoot = Join-Path $tempRoot 'CWR_PRIVATE_PLUGIN'
New-Item -ItemType Directory -Path $bundleRoot -Force | Out-Null

try {
    Copy-Item -LiteralPath (Join-Path $repoRoot '.agents') -Destination $bundleRoot -Recurse
    Copy-Item -LiteralPath (Join-Path $repoRoot 'plugins') -Destination $bundleRoot -Recurse
    Copy-Item -LiteralPath (Join-Path $repoRoot 'CWR_RESEARCH_LAB') -Destination $bundleRoot -Recurse
    Copy-Item -LiteralPath (Join-Path $repoRoot 'distribution\INSTALL_CWR_PRIVATE_PLUGIN.ps1') -Destination $bundleRoot
    Copy-Item -LiteralPath (Join-Path $repoRoot 'distribution\README_PRIVATE_INSTALL.txt') -Destination $bundleRoot

    $removableDirectories = Get-ChildItem -LiteralPath $bundleRoot -Recurse -Directory -Force |
        Where-Object { $_.Name -in @('__pycache__', '.validation-deps') } |
        Sort-Object FullName -Descending
    foreach ($directory in $removableDirectories) {
        $resolved = $directory.FullName
        if (-not $resolved.StartsWith($bundleRoot, [System.StringComparison]::OrdinalIgnoreCase)) {
            throw "Beklenmeyen gecici temizleme hedefi: $resolved"
        }
        Remove-Item -LiteralPath $resolved -Recurse -Force
    }

    $manifestPath = Join-Path $bundleRoot 'MANIFEST_SHA256.txt'
    $manifestLines = Get-ChildItem -LiteralPath $bundleRoot -Recurse -File -Force |
        Where-Object { $_.FullName -ne $manifestPath } |
        Sort-Object FullName |
        ForEach-Object {
            $relative = [System.IO.Path]::GetRelativePath($bundleRoot, $_.FullName).Replace('\', '/')
            $hash = (Get-FileHash -Algorithm SHA256 -LiteralPath $_.FullName).Hash
            "$hash  $relative"
        }
    [System.IO.File]::WriteAllLines($manifestPath, $manifestLines, [System.Text.UTF8Encoding]::new($false))

    $outputParent = Split-Path -Parent $OutputPath
    if (-not (Test-Path -LiteralPath $outputParent)) {
        New-Item -ItemType Directory -Path $outputParent -Force | Out-Null
    }

    tar.exe -a -cf $OutputPath -C $bundleRoot .
    if ($LASTEXITCODE -ne 0 -or -not (Test-Path -LiteralPath $OutputPath)) {
        throw 'ZIP olusturulamadi.'
    }

    $zipHash = (Get-FileHash -Algorithm SHA256 -LiteralPath $OutputPath).Hash
    $sidecar = "$OutputPath.sha256.txt"
    [System.IO.File]::WriteAllText(
        $sidecar,
        "$zipHash  $([System.IO.Path]::GetFileName($OutputPath))`r`n",
        [System.Text.UTF8Encoding]::new($false)
    )

    [pscustomobject]@{
        Zip = $OutputPath
        Bytes = (Get-Item -LiteralPath $OutputPath).Length
        SHA256 = $zipHash
        Sidecar = $sidecar
        ManifestFiles = $manifestLines.Count
    }
}
finally {
    if (Test-Path -LiteralPath $tempRoot) {
        $resolvedTemp = (Resolve-Path -LiteralPath $tempRoot).Path
        $expectedTempPrefix = [System.IO.Path]::GetFullPath([System.IO.Path]::GetTempPath())
        if (-not $resolvedTemp.StartsWith($expectedTempPrefix, [System.StringComparison]::OrdinalIgnoreCase)) {
            throw "Beklenmeyen gecici klasor: $resolvedTemp"
        }
        Remove-Item -LiteralPath $resolvedTemp -Recurse -Force
    }
}
