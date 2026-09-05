[System.Reflection.Assembly]::LoadWithPartialName("System.Drawing") | Out-Null

$bgPath = "C:\Users\guill\.gemini\antigravity\brain\c96d6a3f-56da-479c-b7b0-d74e9f955650\twitter_banner_clean_safe_1788618811782.jpg"
$outPath = "c:\Users\guill\Documents\GateMind\Berkshire Hoodaway\assets\twitter-banner.jpg"
$tokensDir = "c:\Users\guill\Documents\GateMind\Berkshire Hoodaway\assets\tokens"

$bg = [System.Drawing.Bitmap]::FromFile($bgPath)
$bmp = [System.Drawing.Bitmap]::new($bg.Width, $bg.Height)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

# Draw base background
$g.DrawImage($bg, 0, 0, $bg.Width, $bg.Height)

# Center of starry vault portal opening in 1376x768 image
$cx = 985
$cy = 360

# Token files in order
$tokenFiles = @(
    "microduck.png",
    "OPTIMUS.png",
    "AI.png",
    "CASHCAT.png",
    "ROBINCAT.png",
    "MOO.png",
    "CACHE.png",
    "GRASS.png",
    "BONER.png",
    "PONS.png"
)

# Position 7 tokens in outer ring, 3 in inner triangle
$outerCount = 7
$outerRadius = 115
$innerCount = 3
$innerRadius = 48

$allPositions = @()

for ($i = 0; $i -lt $outerCount; $i++) {
    $angle = ($i / $outerCount) * 2 * [Math]::PI - ([Math]::PI / 2)
    $x = $cx + $outerRadius * [Math]::Cos($angle)
    $y = $cy + $outerRadius * [Math]::Sin($angle)
    $allPositions += ,@($x, $y, 58, $tokenFiles[$i])
}

for ($i = 0; $i -lt $innerCount; $i++) {
    $angle = ($i / $innerCount) * 2 * [Math]::PI + ([Math]::PI / 6)
    $x = $cx + $innerRadius * [Math]::Cos($angle)
    $y = $cy + $innerRadius * [Math]::Sin($angle)
    $allPositions += ,@($x, $y, 54, $tokenFiles[$outerCount + $i])
}

$goldPen = [System.Drawing.Pen]::new([System.Drawing.Color]::FromArgb(255, 255, 215, 0), 2.5)
$emeraldPen = [System.Drawing.Pen]::new([System.Drawing.Color]::FromArgb(220, 16, 185, 129), 1.5)
$darkBrush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(245, 3, 10, 6))
$goldBrush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(255, 255, 215, 0))
$font = [System.Drawing.Font]::new("Segoe UI", 7, [System.Drawing.FontStyle]::Bold)
$sf = [System.Drawing.StringFormat]::new()
$sf.Alignment = [System.Drawing.StringAlignment]::Center
$sf.LineAlignment = [System.Drawing.StringAlignment]::Center

foreach ($item in $allPositions) {
    $x = [float]$item[0]
    $y = [float]$item[1]
    $size = [float]$item[2]
    $file = $item[3]
    $name = "$" + [System.IO.Path]::GetFileNameWithoutExtension($file)
    
    $left = $x - ($size / 2.0)
    $top = $y - ($size / 2.0)

    # Shadow
    $shadowBrush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(180, 0, 0, 0))
    $g.FillEllipse($shadowBrush, ($left + 3), ($top + 5), $size, $size)
    $shadowBrush.Dispose()

    # Dark background behind token
    $g.FillEllipse($darkBrush, $left, $top, $size, $size)

    # Load and draw exact token icon with circle clip
    $tokenPath = Join-Path $tokensDir $file
    if (Test-Path $tokenPath) {
        $img = [System.Drawing.Bitmap]::FromFile($tokenPath)
        
        $path = [System.Drawing.Drawing2D.GraphicsPath]::new()
        $path.AddEllipse($left, $top, $size, $size)
        
        $prevClip = $g.Clip
        $g.SetClip($path, [System.Drawing.Drawing2D.CombineMode]::Replace)
        $g.DrawImage($img, $left, $top, $size, $size)
        $g.Clip = $prevClip
        
        $path.Dispose()
        $img.Dispose()
    }

    # Gold and emerald rims
    $g.DrawEllipse($goldPen, $left, $top, $size, $size)
    $g.DrawEllipse($emeraldPen, ($left - 1.2), ($top - 1.2), ($size + 2.4), ($size + 2.4))

    # Ticker label pill
    $labelWidth = 58
    $labelHeight = 14
    $labelX = $x - ($labelWidth / 2.0)
    $labelY = $top + $size - 7
    
    $tagRect = [System.Drawing.RectangleF]::new($labelX, $labelY, $labelWidth, $labelHeight)
    $tagBg = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(245, 3, 10, 6))
    $tagBorder = [System.Drawing.Pen]::new([System.Drawing.Color]::FromArgb(255, 255, 215, 0), 1.0)
    
    $g.FillRectangle($tagBg, $tagRect)
    $g.DrawRectangle($tagBorder, $labelX, $labelY, $labelWidth, $labelHeight)
    $g.DrawString($name, $font, $goldBrush, $tagRect, $sf)

    $tagBg.Dispose()
    $tagBorder.Dispose()
}

# Clean up
$goldPen.Dispose()
$emeraldPen.Dispose()
$darkBrush.Dispose()
$goldBrush.Dispose()
$font.Dispose()
$sf.Dispose()
$g.Dispose()
$bg.Dispose()

# Save final composite
$bmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Jpeg)
$bmp.Dispose()

Write-Output "Perfect composite banner generated successfully!"

