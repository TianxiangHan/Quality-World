@echo off
echo Creating website backup...

REM Get current date and time
for /f "tokens=2 delims==" %%a in ('wmic OS Get localdatetime /value') do set "dt=%%a"
set "YY=%dt:~2,2%" & set "YYYY=%dt:~0,4%" & set "MM=%dt:~4,2%" & set "DD=%dt:~6,2%"
set "HH=%dt:~8,2%" & set "Min=%dt:~10,2%" & set "Sec=%dt:~12,2%"
set "timestamp=%YYYY%-%MM%-%DD%_%HH%-%Min%-%Sec%"

REM Create backup directory if it doesn't exist
if not exist "backups" mkdir backups

REM Create backup filename with timestamp
set "backupfile=backups\website-backup-%timestamp%.txt"

echo ===========================================>> %backupfile%
echo QUALITY WORLD WITH THOMAS - WEBSITE BACKUP>> %backupfile%
echo ===========================================>> %backupfile%
echo Backup Date: %YYYY%-%MM%-%DD% %HH%:%Min%:%Sec%>> %backupfile%
echo Automated Backup Created>> %backupfile%
echo.>> %backupfile%

echo ===========================================>> %backupfile%
echo PROJECT STRUCTURE>> %backupfile%
echo ===========================================>> %backupfile%
dir /s /b >> %backupfile%
echo.>> %backupfile%

echo ===========================================>> %backupfile%
echo FILE SIZES>> %backupfile%
echo ===========================================>> %backupfile%
dir /s >> %backupfile%

echo Website backup created: %backupfile%
echo.
echo To restore from this backup:
echo 1. Note the file structure and sizes
echo 2. Compare with current files
echo 3. Restore individual files as needed
echo.
pause

