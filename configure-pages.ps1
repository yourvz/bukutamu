# Configure GitHub Pages via REST API
$owner = "yourvz"
$repo = "bukutamu"
$token = $env:GITHUB_TOKEN

if (-not $token) {
    Write-Host "ERROR: GITHUB_TOKEN environment variable not set"
    Write-Host "Please set GitHub token first: `$env:GITHUB_TOKEN = 'your-token'"
    exit 1
}

$headers = @{
    "Authorization" = "token $token"
    "Accept" = "application/vnd.github.switcheroo-preview+json"
    "Content-Type" = "application/json"
}

$body = @{
    source = @{
        branch = "main"
        path = "/docs"
    }
} | ConvertTo-Json

Write-Host "Configuring GitHub Pages..."
Write-Host "Owner: $owner"
Write-Host "Repo: $repo"
Write-Host "Source: main branch, /docs folder"

$response = Invoke-WebRequest -Uri "https://api.github.com/repos/$owner/$repo/pages" `
    -Method POST `
    -Headers $headers `
    -Body $body `
    -ErrorAction SilentlyContinue

if ($response.StatusCode -eq 200 -or $response.StatusCode -eq 201) {
    Write-Host "✅ Success! GitHub Pages configured to serve from /docs folder"
    Write-Host $response.Content
} else {
    Write-Host "❌ Error: Status $($response.StatusCode)"
    Write-Host $response.Content
}
