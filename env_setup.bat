@echo off
echo ======================================
echo  environment setup -Playwright
echo ==========================



echo [1/7]install testdata,env vars,date/timehandling
call npm install dotenv @faker-js/faker luxon
if errorlevel 1 goto:error

echo [2/7]install schema validation, CSV, and Excel packages
call npm install ajv csv-parse xlsx
if errorlevel 1 goto:error

echo [3/7]install Playwright accessibility testing package
call npm install @axe-core/playwright
if errorlevel 1 goto:error

echo [4/7]install Allure reporting package
call npm install allure-playwright
if errorlevel 1 goto:error

echo [5/7]install Node.js TypeScript definitions
call npm install -D @types/node
if errorlevel 1 goto:error

echo [6/7]install Playwright browser binaries
call npx playwright install
if errorlevel 1 goto:error

echo [7/7]install Microsoft SQL Server package
call npm install mssql
if errorlevel 1 goto:error

echo Setup completed successfully.
goto:eof

:error
echo Setup failed. Check the command output above.
exit /b 1