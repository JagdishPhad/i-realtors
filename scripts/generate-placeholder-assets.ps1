#Requires -Version 5.1
<#
.SYNOPSIS
    Generates brand-coloured placeholder JPEGs for the seed property catalogue
    and the Open Graph cover image.

.DESCRIPTION
    The data layer in `src/data/properties.ts` points at files such as
    `public/images/properties/<slug>/cover.jpg`. This script creates those files
    so the site renders (and `next/image` optimises them) before the developer's
    approved renders are dropped in.

    Run:  powershell -ExecutionPolicy Bypass -File scripts/generate-placeholder-assets.ps1

.NOTES
    Replace the generated files with real renders before launch. Keep the same
    file names so `properties.ts` needs no changes.
#>
[CmdletBinding()]
param()

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

Add-Type -AssemblyName System.Drawing

$projectRoot = Split-Path -Parent $PSScriptRoot
$imageRoot = Join-Path $projectRoot 'public\images'

# Brand tokens (kept in sync with tailwind.config.ts / globals.css).
$bgDeep = [System.Drawing.ColorTranslator]::FromHtml('#020617')
$bgBase = [System.Drawing.ColorTranslator]::FromHtml('#0B132B')
$surface = [System.Drawing.ColorTranslator]::FromHtml('#1E293B')
$surfaceRaised = [System.Drawing.ColorTranslator]::FromHtml('#243349')
$gold = [System.Drawing.ColorTranslator]::FromHtml('#EAB308')
$goldDeep = [System.Drawing.ColorTranslator]::FromHtml('#D97706')
$inkMuted = [System.Drawing.ColorTranslator]::FromHtml('#94A3B8')

$projects = @(
    [pscustomobject]@{ Slug = 'montaire-balewadi'; Title = 'MONTAIRE'; Subtitle = 'Balewadi, Pune' }
    [pscustomobject]@{ Slug = 'arkaay-tower-tathawade'; Title = 'ARKAAY TOWER'; Subtitle = 'Tathawade, Pune' }
    [pscustomobject]@{ Slug = 'godrej-retreat-residences'; Title = 'GODREJ RETREAT'; Subtitle = 'Pune West' }
    [pscustomobject]@{ Slug = 'lodha-sylvan'; Title = 'LODHA SYLVAN'; Subtitle = 'Pune West' }
)

# Three variants per project so the gallery has visibly different panels.
$variants = @(
    [pscustomobject]@{ File = 'cover.jpg'; From = $bgBase; To = $surface; Accent = $gold }
    [pscustomobject]@{ File = 'gallery-2.jpg'; From = $bgDeep; To = $surfaceRaised; Accent = $goldDeep }
    [pscustomobject]@{ File = 'gallery-3.jpg'; From = $surface; To = $bgBase; Accent = $gold }
)

function New-BrandImage {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)] [string] $Path,
        [Parameter(Mandatory)] [string] $Title,
        [Parameter(Mandatory)] [string] $Subtitle,
        [Parameter(Mandatory)] [int] $Width,
        [Parameter(Mandatory)] [int] $Height,
        [Parameter(Mandatory)] [System.Drawing.Color] $From,
        [Parameter(Mandatory)] [System.Drawing.Color] $To,
        [Parameter(Mandatory)] [System.Drawing.Color] $Accent,
        [string] $Footnote = 'PLACEHOLDER ARTWORK - REPLACE WITH APPROVED RENDER'
    )

    $directory = Split-Path -Parent $Path
    if (-not (Test-Path -LiteralPath $directory)) {
        New-Item -ItemType Directory -Path $directory -Force | Out-Null
    }

    $bitmap = New-Object System.Drawing.Bitmap($Width, $Height)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::ClearTypeGridFit

    try {
        $rect = New-Object System.Drawing.Rectangle(0, 0, $Width, $Height)
        $gradient = New-Object System.Drawing.Drawing2D.LinearGradientBrush($rect, $From, $To, 35.0)
        $graphics.FillRectangle($gradient, $rect)
        $gradient.Dispose()

        # Accent glow + skyline silhouette keep the placeholders on-brand.
        $glow = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(38, $Accent))
        $graphics.FillEllipse($glow, [int]($Width * 0.55), [int](-$Height * 0.35), [int]($Width * 0.7), [int]($Width * 0.7))
        $glow.Dispose()

        $blockBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(150, $To))
        $barWidth = [int]($Width / 22)
        for ($i = 0; $i -lt 11; $i++) {
            $barHeight = [int]($Height * (0.12 + (0.055 * $i)))
            $x = [int]($Width * 0.5) + ($i * $barWidth)
            $graphics.FillRectangle($blockBrush, $x, $Height - $barHeight - [int]($Height * 0.18), $barWidth - 6, $barHeight)
        }
        $blockBrush.Dispose()

        $accentPen = New-Object System.Drawing.Pen($Accent, 3)
        $graphics.DrawLine($accentPen, [int]($Width * 0.06), [int]($Height * 0.2), [int]($Width * 0.26), [int]($Height * 0.2))
        $accentPen.Dispose()

        $titleFont = New-Object System.Drawing.Font('Segoe UI', [float][Math]::Max(20, $Height * 0.062), [System.Drawing.FontStyle]::Bold)
        $subtitleFont = New-Object System.Drawing.Font('Segoe UI', [float][Math]::Max(12, $Height * 0.032), [System.Drawing.FontStyle]::Regular)
        $footnoteFont = New-Object System.Drawing.Font('Segoe UI', [float][Math]::Max(10, $Height * 0.022), [System.Drawing.FontStyle]::Regular)

        $inkBrush = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml('#F8FAFC'))
        $accentBrush = New-Object System.Drawing.SolidBrush($Accent)
        $mutedBrush = New-Object System.Drawing.SolidBrush($inkMuted)

        $graphics.DrawString($Title, $titleFont, $inkBrush, [float]($Width * 0.06), [float]($Height * 0.28))
        $graphics.DrawString($Subtitle, $subtitleFont, $accentBrush, [float]($Width * 0.06), [float]($Height * 0.375))
        $graphics.DrawString($Footnote, $footnoteFont, $mutedBrush, [float]($Width * 0.06), [float]($Height * 0.88))

        $inkBrush.Dispose()
        $accentBrush.Dispose()
        $mutedBrush.Dispose()
        $titleFont.Dispose()
        $subtitleFont.Dispose()
        $footnoteFont.Dispose()

        $bitmap.Save($Path, [System.Drawing.Imaging.ImageFormat]::Jpeg)
    }
    finally {
        $graphics.Dispose()
        $bitmap.Dispose()
    }
}

$created = New-Object System.Collections.Generic.List[string]

foreach ($project in $projects) {
    foreach ($variant in $variants) {
        $target = Join-Path $imageRoot ("properties\{0}\{1}" -f $project.Slug, $variant.File)
        New-BrandImage -Path $target -Title $project.Title -Subtitle $project.Subtitle -Width 1600 -Height 1000 `
            -From $variant.From -To $variant.To -Accent $variant.Accent
        $created.Add($target)
    }
}

$ogPath = Join-Path $imageRoot 'og\og-cover.jpg'
New-BrandImage -Path $ogPath -Title 'I REALTORS' -Subtitle 'MahaRERA A52100000092 | Baner, Pune' -Width 1200 -Height 630 `
    -From $bgDeep -To $surface -Accent $gold -Footnote 'RERA-registered real estate consultancy - Baner, Pune'
$created.Add($ogPath)

Write-Host ("Generated {0} placeholder asset(s):" -f $created.Count)
$created | ForEach-Object { Write-Host (" - " + $_.Replace($projectRoot + '\', '')) }
