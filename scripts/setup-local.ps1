# Local one-shot setup: MySQL (Docker) + migrations + admin user
# Usage:
#   powershell -ExecutionPolicy Bypass -File scripts/setup-local.ps1
# Optional:
#   powershell -ExecutionPolicy Bypass -File scripts/setup-local.ps1 -Email "you@example.com" -Password "YourPassword123" -Name "DWO Admin"

param(
  [string]$Email = "nk.cil96@gmail.com",
  [string]$Password = "",
  [string]$Name = "DWO Admin"
)

$ErrorActionPreference = "Stop"
Set-Location (Split-Path -Parent $PSScriptRoot)

if (-not $Password) {
  $alphabet = 48..57 + 65..90 + 97..122
  $Password = -join ($alphabet | Get-Random -Count 16 | ForEach-Object { [char]$_ })
}

Write-Host "Checking Docker..."
docker info | Out-Null
if ($LASTEXITCODE -ne 0) {
  Write-Error "Docker Desktop is not running. Start it, wait until it is ready, then re-run this script."
}

Write-Host "Starting MySQL..."
docker compose up -d

Write-Host "Waiting for MySQL health..."
$ready = $false
for ($i = 0; $i -lt 40; $i++) {
  $status = docker inspect --format='{{.State.Health.Status}}' dwo-mysql 2>$null
  if ($status -eq "healthy") {
    $ready = $true
    break
  }
  Start-Sleep -Seconds 3
}

if (-not $ready) {
  Write-Error "MySQL did not become healthy in time. Check: docker compose logs mysql"
}

Write-Host "Applying migrations..."
npm run prisma:migrate:deploy

Write-Host "Creating admin user..."
npm run admin:create -- --email=$Email --password=$Password --name=$Name

Write-Host ""
Write-Host "Setup complete."
Write-Host "Admin login: http://localhost:3000/admin/login"
Write-Host "Email: $Email"
Write-Host "Password: $Password"
Write-Host "Keep this password safe."
