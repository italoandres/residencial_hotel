@echo off
echo ========================================
echo VERIFICACAO PRE-DEPLOY
echo Sistema Hotel Residencial Hortel
echo ========================================
echo.

echo [1/5] Verificando estrutura de pastas...
if exist "api" (
    echo ✓ Pasta api encontrada
) else (
    echo ✗ Pasta api NAO encontrada
    goto :error
)

if exist "web" (
    echo ✓ Pasta web encontrada
) else (
    echo ✗ Pasta web NAO encontrada
    goto :error
)

echo.
echo [2/5] Verificando arquivos essenciais...
if exist "api\package.json" (
    echo ✓ api\package.json encontrado
) else (
    echo ✗ api\package.json NAO encontrado
    goto :error
)

if exist "api\src\server.js" (
    echo ✓ api\src\server.js encontrado
) else (
    echo ✗ api\src\server.js NAO encontrado
    goto :error
)

if exist "web\package.json" (
    echo ✓ web\package.json encontrado
) else (
    echo ✗ web\package.json NAO encontrado
    goto :error
)

if exist "web\index.html" (
    echo ✓ web\index.html encontrado
) else (
    echo ✗ web\index.html NAO encontrado
    goto :error
)

echo.
echo [3/5] Verificando arquivo .env do backend...
if exist "api\.env" (
    echo ✓ api\.env encontrado
    echo.
    echo Verificando variaveis essenciais...
    findstr /C:"SUPABASE_URL" api\.env >nul
    if %errorlevel% equ 0 (
        echo ✓ SUPABASE_URL configurada
    ) else (
        echo ✗ SUPABASE_URL NAO configurada
        goto :error
    )
    
    findstr /C:"SUPABASE_ANON_KEY" api\.env >nul
    if %errorlevel% equ 0 (
        echo ✓ SUPABASE_ANON_KEY configurada
    ) else (
        echo ✗ SUPABASE_ANON_KEY NAO configurada
        goto :error
    )
    
    findstr /C:"JWT_SECRET" api\.env >nul
    if %errorlevel% equ 0 (
        echo ✓ JWT_SECRET configurada
    ) else (
        echo ✗ JWT_SECRET NAO configurada
        goto :error
    )
) else (
    echo ✗ api\.env NAO encontrado
    echo.
    echo IMPORTANTE: Crie o arquivo api\.env com as variaveis necessarias
    goto :error
)

echo.
echo [4/5] Verificando Git...
git --version >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ Git instalado
) else (
    echo ✗ Git NAO instalado
    echo.
    echo Instale o Git: https://git-scm.com/download/win
    goto :error
)

echo.
echo [5/5] Verificando Node.js...
node --version >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ Node.js instalado
    node --version
) else (
    echo ✗ Node.js NAO instalado
    echo.
    echo Instale o Node.js: https://nodejs.org
    goto :error
)

echo.
echo ========================================
echo ✓ TUDO PRONTO PARA DEPLOY!
echo ========================================
echo.
echo Proximos passos:
echo 1. Leia o arquivo DEPLOY_RAPIDO.md
echo 2. Suba o codigo para o GitHub
echo 3. Configure o deploy no Render
echo.
pause
exit /b 0

:error
echo.
echo ========================================
echo ✗ VERIFICACAO FALHOU
echo ========================================
echo.
echo Corrija os problemas acima antes de fazer o deploy.
echo.
pause
exit /b 1
