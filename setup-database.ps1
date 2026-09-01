# EdTech Platform - Database Setup Script
# Run this AFTER PostgreSQL is installed to create DB, user, and seed data

param(
    [string]$PgPassword = "root@123",
    [string]$PgUser = "root",
    [string]$DbName = "edtech_db",
    [string]$PgBinPath = ""
)

# Auto-detect PostgreSQL bin path
if ($PgBinPath -eq "") {
    $versions = @(17, 16, 15, 14, 18)
    foreach ($v in $versions) {
        $path = "C:\Program Files\PostgreSQL\$v\bin"
        if (Test-Path "$path\psql.exe") {
            $PgBinPath = $path
            Write-Host "Found PostgreSQL $v at: $PgBinPath" -ForegroundColor Green
            break
        }
    }
}

if ($PgBinPath -eq "") {
    Write-Host "PostgreSQL bin not found! Please install PostgreSQL first." -ForegroundColor Red
    exit 1
}

$env:PGPASSWORD = "postgres"
$psql = "$PgBinPath\psql.exe"
$pgctl = "$PgBinPath\pg_ctl.exe"

Write-Host "=== EdTech Platform DB Setup ===" -ForegroundColor Cyan

# 1. Start PostgreSQL service if not running
Write-Host "[1/4] Checking PostgreSQL service..." -ForegroundColor Yellow
$service = Get-Service | Where-Object { $_.Name -like 'postgresql*' } | Select-Object -First 1
if ($service) {
    if ($service.Status -ne 'Running') {
        Start-Service $service.Name
        Start-Sleep 3
    }
    Write-Host "    PostgreSQL service '$($service.Name)' is running." -ForegroundColor Green
} else {
    Write-Host "    No Windows service found, trying pg_ctl..." -ForegroundColor Yellow
}

# 2. Create user (role) 'root' with password
Write-Host "[2/4] Creating database user '$PgUser'..." -ForegroundColor Yellow
$createUser = "DO `$`$ BEGIN IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = '$PgUser') THEN CREATE ROLE $PgUser WITH LOGIN SUPERUSER PASSWORD '$PgPassword'; END IF; END `$`$;"
& $psql -U postgres -c $createUser 2>&1
Write-Host "    User '$PgUser' ready." -ForegroundColor Green

# 3. Create database
Write-Host "[3/4] Creating database '$DbName'..." -ForegroundColor Yellow
$env:PGPASSWORD = "postgres"
$dbExists = & $psql -U postgres -tAc "SELECT 1 FROM pg_database WHERE datname='$DbName';" 2>&1
if ($dbExists -ne "1") {
    & $psql -U postgres -c "CREATE DATABASE $DbName OWNER $PgUser;" 2>&1
    Write-Host "    Database '$DbName' created." -ForegroundColor Green
} else {
    Write-Host "    Database '$DbName' already exists." -ForegroundColor Green
}

# 4. Run Prisma push & seed
Write-Host "[4/4] Running Prisma db push and seeding data..." -ForegroundColor Yellow
Set-Location "D:\edu\edtech-platform\backend\node-api"
$env:PGPASSWORD = ""
npx --no-install prisma db push --schema=..\..\database\prisma\schema.prisma --accept-data-loss
if ($LASTEXITCODE -eq 0) {
    Write-Host "    Prisma schema pushed!" -ForegroundColor Green
    node ..\..\database\prisma\seed.js
    if ($LASTEXITCODE -eq 0) {
        Write-Host "    Database seeded with demo data!" -ForegroundColor Green
    }
} else {
    Write-Host "    Prisma push failed. Check DATABASE_URL in .env" -ForegroundColor Red
}

Write-Host ""
Write-Host "=== SETUP COMPLETE ===" -ForegroundColor Green
Write-Host "Platform URLs:" -ForegroundColor Cyan
Write-Host "  Frontend:       http://localhost:3000" -ForegroundColor White
Write-Host "  Node.js API:    http://localhost:5000/api/health" -ForegroundColor White
Write-Host "  Python FastAPI: http://localhost:8000/docs" -ForegroundColor White
Write-Host ""
Write-Host "Demo Login Credentials:" -ForegroundColor Cyan
Write-Host "  Admin:       admin@edtech.com / Password123!" -ForegroundColor White
Write-Host "  Institution: institution@edtech.com / Password123!" -ForegroundColor White
Write-Host "  Mentor:      mentor@edtech.com / Password123!" -ForegroundColor White
Write-Host "  Parent:      parent@edtech.com / Password123!" -ForegroundColor White
Write-Host "  Student:     student@edtech.com / Password123!" -ForegroundColor White
