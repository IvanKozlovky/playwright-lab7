@echo off
cd /d "%~dp0"
echo === 1/4 npm install ===
call npm install
echo === 2/4 playwright install chromium ===
call npx playwright install chromium
echo === 3/4 playwright test ===
call npx playwright test
echo === 4/4 show report (Ctrl+C to stop) ===
call npx playwright show-report
pause
