@echo off
REM Start MongoDB server in a separate window
start "MongoDB Server" "C:\Program Files\MongoDB\Server\8.2\bin\mongod.exe" --dbpath "C:\data\db"

REM Wait a few seconds for MongoDB to start
timeout /t 5 /nobreak

REM Start Node app and show logs
node app.js

REM Keep the window open after app exits
pause
