@echo off
echo Starting Quality World with Thomas Website...
echo.
echo Using Node.js http-server on port 8000...
echo.
echo Open your browser and go to: http://localhost:8000
echo.
echo Press Ctrl+C to stop the server
echo.
cd /d "%~dp0"
http-server . -p 8000
