@echo off

echo Starting Backend...
start "Backend Server" cmd /k "cd backend && uv run main.py"

echo Starting Frontend...
start "Frontend Server" cmd /k "cd frontend && npm run dev"

REM wait for frontend to be ready
timeout /t 3 > nul

echo Opening browser...
start http://localhost:5173

echo Done.