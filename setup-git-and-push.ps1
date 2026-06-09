# Buku Tamu - Git Setup and Push Script
# Run this script to initialize git repo and push to GitHub

# Colors for output
$green = 'Green'
$yellow = 'Yellow'
$red = 'Red'

Write-Host "================================" -ForegroundColor $green
Write-Host "Buku Tamu - Git Setup & Push" -ForegroundColor $green
Write-Host "================================" -ForegroundColor $green
Write-Host ""

# Check if Git is installed
Write-Host "Checking Git installation..." -ForegroundColor $yellow
$gitPath = "C:\Program Files\Git\cmd\git.exe"

if (Test-Path $gitPath) {
    Write-Host "✓ Git found at: $gitPath" -ForegroundColor $green
}
else {
    Write-Host "✗ Git not found. Please install Git first:" -ForegroundColor $red
    Write-Host "  Download from: https://git-scm.com/download/win" -ForegroundColor $yellow
    Write-Host ""
    Write-Host "After installing Git, run this script again." -ForegroundColor $yellow
    exit 1
}

# Set git executable
$env:Path += ";C:\Program Files\Git\cmd"

# Navigate to project directory
$projectDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $projectDir

Write-Host ""
Write-Host "Setting up Git repository..." -ForegroundColor $yellow

# Check if already initialized
if (Test-Path .\.git) {
    Write-Host "✓ Git repository already initialized" -ForegroundColor $green
}
else {
    Write-Host "Initializing new Git repository..." -ForegroundColor $yellow
    & git init
    Write-Host "✓ Git repository initialized" -ForegroundColor $green
}

Write-Host ""
Write-Host "Configuring Git..." -ForegroundColor $yellow

# Configure git user (if not already set)
$userName = & git config user.name
if ([string]::IsNullOrEmpty($userName)) {
    Write-Host "Enter your Git username:"
    $gitUser = Read-Host "Username"
    & git config user.name "$gitUser"
    Write-Host "✓ Git username set to: $gitUser" -ForegroundColor $green
}
else {
    Write-Host "✓ Git user already configured: $userName" -ForegroundColor $green
}

$userEmail = & git config user.email
if ([string]::IsNullOrEmpty($userEmail)) {
    Write-Host "Enter your Git email:"
    $gitEmail = Read-Host "Email"
    & git config user.email "$gitEmail"
    Write-Host "✓ Git email set to: $gitEmail" -ForegroundColor $green
}
else {
    Write-Host "✓ Git email already configured: $userEmail" -ForegroundColor $green
}

Write-Host ""
Write-Host "Adding files to Git..." -ForegroundColor $yellow

# Add all files
& git add .
Write-Host "✓ Files staged" -ForegroundColor $green

# Check git status
Write-Host ""
Write-Host "Current Git status:" -ForegroundColor $yellow
& git status

Write-Host ""
Write-Host "Creating initial commit..." -ForegroundColor $yellow

# Create commit if there are changes
$status = & git status --porcelain
if ($status) {
    & git commit -m "Initial commit: Buku Tamu application with professional 2-column design, backend API, and database setup"
    Write-Host "✓ Commit created" -ForegroundColor $green
}
else {
    Write-Host "✓ No changes to commit" -ForegroundColor $green
}

Write-Host ""
Write-Host "Setting up remote origin..." -ForegroundColor $yellow

# Check if remote already exists
$remoteUrl = & git config --get remote.origin.url
if ([string]::IsNullOrEmpty($remoteUrl)) {
    Write-Host "Adding remote: https://github.com/yourvz/bukutamu.git" -ForegroundColor $yellow
    & git remote add origin https://github.com/yourvz/bukutamu.git
    Write-Host "✓ Remote origin configured" -ForegroundColor $green
}
else {
    Write-Host "✓ Remote origin already set to: $remoteUrl" -ForegroundColor $green
}

Write-Host ""
Write-Host "Pushing to GitHub..." -ForegroundColor $yellow
Write-Host "Note: You may be prompted to authenticate with GitHub" -ForegroundColor $yellow

& git branch -M main
& git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✓ Successfully pushed to GitHub!" -ForegroundColor $green
    Write-Host "Repository: https://github.com/yourvz/bukutamu" -ForegroundColor $green
}
else {
    Write-Host ""
    Write-Host "✗ Push failed. Please check:" -ForegroundColor $red
    Write-Host "  1. GitHub account credentials" -ForegroundColor $yellow
    Write-Host "  2. Repository exists on GitHub" -ForegroundColor $yellow
    Write-Host "  3. Network connection" -ForegroundColor $yellow
}

Write-Host ""
Write-Host "================================" -ForegroundColor $green
Write-Host "Setup Complete!" -ForegroundColor $green
Write-Host "================================" -ForegroundColor $green
