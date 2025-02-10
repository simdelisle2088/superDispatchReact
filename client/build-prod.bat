@echo off
echo Building Docker image for development...
docker build --build-arg ENV=prod -t dispatch:latest .
echo Docker image for development built successfully!
pause
