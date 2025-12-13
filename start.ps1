Write-Host "Installing dependencies..." -ForegroundColor Green
npm install

if ($LASTEXITCODE -eq 0) {
    Write-Host "`nStarting development server..." -ForegroundColor Green
    npm run dev
} else {
    Write-Host "`nInstallation failed. Please check the error messages above." -ForegroundColor Red
    pause
}


