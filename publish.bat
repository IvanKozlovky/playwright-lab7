@echo off
cd /d "%~dp0"
git init -b main
git add .
git -c user.name="Ivan Kozlovskyi" -c user.email="ivankozlovskiiin@gmail.com" commit -m "Lab 7: Playwright tests"
git remote add origin https://github.com/IvanKozlovky/playwright-lab7.git
git push -u origin main
pause
