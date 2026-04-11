@echo off
echo.
echo ===========================================
echo   A^&T Technical Services - Admin Launcher
echo ===========================================
echo.
echo Starting secure local server via PowerShell...
echo.

:: Run the PowerShell server script
:: This works on all Windows machines without Node or Python
powershell -ExecutionPolicy Bypass -Command "& { Start-Process 'http://localhost:3000/local-admin.html'; .\server.ps1 }"

pause
