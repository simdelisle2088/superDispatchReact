@echo off
echo Building Docker image for development...
docker build --build-arg ENV=dev -t dispatch-dev:latest .
echo Docker image for development built successfully!
pause
