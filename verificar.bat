@echo off
chcp 65001 >nul
echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                                                              ║
echo ║        🔍 VERIFICAÇÃO DO SISTEMA RESIDENCIAL HORTEL 🔍       ║
echo ║                                                              ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.
echo Verificando sistema...
echo.

REM Verificar Node.js
echo [1/6] Verificando Node.js...
node --version >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Node.js instalado
    node --version
) else (
    echo ❌ Node.js NÃO instalado
    echo    Instale em: https://nodejs.org
)
echo.

REM Verificar pasta api
echo [2/6] Verificando pasta api...
if exist "api" (
    echo ✅ Pasta api existe
) else (
    echo ❌ Pasta api NÃO encontrada
)
echo.

REM Verificar node_modules
echo [3/6] Verificando dependências...
if exist "api\node_modules" (
    echo ✅ Dependências instaladas
) else (
    echo ❌ Dependências NÃO instaladas
    echo    Execute: cd api ^&^& npm install
)
echo.

REM Verificar .env
echo [4/6] Verificando arquivo .env...
if exist "api\.env" (
    echo ✅ Arquivo .env existe
) else (
    echo ❌ Arquivo .env NÃO encontrado
    echo    Copie api\.env.example para api\.env
    echo    E configure suas credenciais do Supabase
)
echo.

REM Verificar painel
echo [5/6] Verificando painel administrativo...
if exist "web\painel-simples.html" (
    echo ✅ Painel administrativo existe
) else (
    echo ❌ Painel NÃO encontrado
)
echo.

REM Verificar documentação
echo [6/6] Verificando documentação...
set doc_count=0
if exist "README.md" set /a doc_count+=1
if exist "COMO_USAR.md" set /a doc_count+=1
if exist "INDEX.md" set /a doc_count+=1
if exist "RESUMO_EXECUTIVO.md" set /a doc_count+=1
if exist "ARQUITETURA.md" set /a doc_count+=1
if exist "TROUBLESHOOTING.md" set /a doc_count+=1
if exist "CHECKLIST.md" set /a doc_count+=1

echo ✅ %doc_count%/7 documentos encontrados
echo.

echo ════════════════════════════════════════════════════════════════
echo.
echo 📊 RESUMO DA VERIFICAÇÃO
echo.

REM Contar sucessos
set success=0
node --version >nul 2>&1
if %errorlevel% equ 0 set /a success+=1
if exist "api" set /a success+=1
if exist "api\node_modules" set /a success+=1
if exist "api\.env" set /a success+=1
if exist "web\painel-simples.html" set /a success+=1
if %doc_count% geq 5 set /a success+=1

echo Total de verificações: 6
echo Verificações OK: %success%
echo.

if %success% equ 6 (
    echo ✅ SISTEMA PRONTO PARA USO!
    echo.
    echo Para iniciar:
    echo   1. Execute: INICIAR.bat
    echo   2. Ou siga: COMO_USAR.md
) else (
    echo ⚠️  SISTEMA PRECISA DE CONFIGURAÇÃO
    echo.
    echo Próximos passos:
    if not exist "api\node_modules" (
        echo   1. cd api
        echo   2. npm install
    )
    if not exist "api\.env" (
        echo   3. Copie api\.env.example para api\.env
        echo   4. Configure credenciais do Supabase
    )
    echo.
    echo Consulte: COMO_USAR.md ou api\INSTALACAO.md
)

echo.
echo ════════════════════════════════════════════════════════════════
echo.
echo 📚 DOCUMENTAÇÃO DISPONÍVEL:
echo.
if exist "INDEX.md" echo    • INDEX.md - Índice completo
if exist "COMO_USAR.md" echo    • COMO_USAR.md - Guia de uso
if exist "RESUMO_EXECUTIVO.md" echo    • RESUMO_EXECUTIVO.md - Visão geral
if exist "ARQUITETURA.md" echo    • ARQUITETURA.md - Arquitetura
if exist "TROUBLESHOOTING.md" echo    • TROUBLESHOOTING.md - Solução de problemas
if exist "CHECKLIST.md" echo    • CHECKLIST.md - Checklist
if exist "INICIO.txt" echo    • INICIO.txt - Guia visual
echo.
echo ════════════════════════════════════════════════════════════════
echo.
pause
