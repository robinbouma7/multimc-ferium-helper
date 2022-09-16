@echo off
set /p commitmsg=bericht?
git commit -a -m "%commitmsg%"
pause