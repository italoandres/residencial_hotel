@echo off
echo ========================================
echo   Sistema Residencial Hortel
echo ========================================
echo.
echo Iniciando API...
echo.
cd api
start cmd /k "node server.js"
echo.
echo ========================================
echo   API iniciada em http://localhost:3000
echo ========================================
echo.
echo Aguarde 2 segundos...
timeout /t 2 /nobreak >nul
echo.
echo Abrindo painel administrativo...
cd ..
start "" "web\painel-simples.html"
echo.
echo ========================================
echo   Sistema iniciado com sucesso!
echo ========================================
echo.
echo Credenciais de login:
echo   Email: admin@residencialhortel.com
echo   Senha: admin123
echo.
echo Pressione qualquer tecla para sair...
pause >nul
