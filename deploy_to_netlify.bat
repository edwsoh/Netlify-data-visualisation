@echo off
echo Starting deployment to Netlify...
echo.
echo Ensure you are logged in by running: npx netlify login
echo.
echo Deploying...
cmd /c "npx netlify-cli deploy --dir=dist --prod"
pause
