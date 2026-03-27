$token = $env:GITHUB_TOKEN
$owner = "VishalStudios"
$repo = "VishalStudios"
$branch = "main"

if (-not $token) {
    throw "Set the GITHUB_TOKEN environment variable before running this script."
}

function Update-GitHubFile($filePath, $content) {
    if (!$content) { Write-Host "Content is empty for $filePath. Skipping..."; return }
    $apiUrl = "https://api.github.com/repos/$owner/$repo/contents/$filePath"
    $headers = @{
        "Authorization" = "token $token"
        "Accept" = "application/vnd.github+json"
    }

    try {
        $fileInfo = Invoke-RestMethod -Uri $apiUrl -Method Get -Headers $headers -ErrorAction Stop
        $sha = $fileInfo.sha
    } catch {
        $sha = $null
    }

    $base64Content = [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes($content))

    $body = @{
        message = "Finalize Vercel monorepo structure and cleaning"
        content = $base64Content
        branch  = $branch
    }
    if ($sha) { $body.sha = $sha }

    Invoke-RestMethod -Uri $apiUrl -Method Put -Headers $headers -Body (ConvertTo-Json $body)
}

function Delete-GitHubFile($filePath) {
    $apiUrl = "https://api.github.com/repos/$owner/$repo/contents/$filePath"
    $headers = @{
        "Authorization" = "token $token"
        "Accept" = "application/vnd.github+json"
    }

    try {
        $fileInfo = Invoke-RestMethod -Uri $apiUrl -Method Get -Headers $headers -ErrorAction Stop
        $sha = $fileInfo.sha
        if ($sha) {
            $body = @{
                message = "Cleaning up redundant config"
                sha = $sha
                branch = $branch
            }
            Invoke-RestMethod -Uri $apiUrl -Method Delete -Headers $headers -Body (ConvertTo-Json $body)
            Write-Host "Deleted $filePath from GitHub."
        }
    } catch {
        Write-Host "$filePath not found on GitHub. Skipping delete."
    }
}

# 1. Root vercel.json
$vercelJson = Get-Content "vercel.json" -Raw
Write-Host "Updating root vercel.json..."
Update-GitHubFile "vercel.json" $vercelJson

# 2. Cleanup redundant configs
Delete-GitHubFile "frontend/vercel.json"
Delete-GitHubFile "backend/vercel.json"

Write-Host "All files updated on GitHub. Vercel deployment should start automatically."
