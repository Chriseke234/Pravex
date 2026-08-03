$ErrorActionPreference = "Continue"
$files = Get-ChildItem -Path "." -Include "*.tsx","*.ts" -Recurse |
    Where-Object { $_.FullName -notmatch "\\node_modules\\" -and $_.FullName -notmatch "\\.next\\" }

$pairs = @(
    ("Ironbridgemarket Institutional", "Iron Bridge Banking"),
    ("Ironbridgemarket", "Iron Bridge Banking"),
    ("IRONBRIDGEMARKET", "IRON BRIDGE BANKING"),
    ("ironbridgemarket_", "iron_bridge_banking_"),
    ("ironbridgemarket.com", "ironbridgebanking.com"),
    ("ironbridgemarket", "ironbridgebanking")
)

foreach ($file in $files) {
    $content = [System.IO.File]::ReadAllText($file.FullName, [System.Text.Encoding]::UTF8)
    $changed = $false
    foreach ($pair in $pairs) {
        $oldStr = $pair[0]
        $newStr = $pair[1]
        if ($content.Contains($oldStr)) {
            $content = $content.Replace($oldStr, $newStr)
            $changed = $true
        }
    }
    if ($changed) {
        [System.IO.File]::WriteAllText($file.FullName, $content, [System.Text.Encoding]::UTF8)
        Write-Host "Updated: $($file.Name)"
    }
}
Write-Host "Done - branding replacement complete."
