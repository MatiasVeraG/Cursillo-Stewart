@echo off
REM ================================================
REM  Servidor Local - Cursillo Stewart
REM ================================================
REM  Este script inicia un servidor local
REM  para probar la aplicación en tu navegador
REM ================================================

echo.
echo ========================================
echo   Cursillo Stewart - Servidor Local
echo ========================================
echo.

REM Verificar si PHP está instalado
php --version >nul 2>&1
if %errorlevel% equ 0 (
    echo PHP detectado! Iniciando servidor PHP...
    echo.
    echo Servidor iniciado en: http://localhost:8000
    echo.
    echo URLs disponibles:
    echo   - Inicio: http://localhost:8000/
    echo   - Panel Admin: http://localhost:8000/admin-modular.html
    echo   - Profesores: http://localhost:8000/profesores.html
    echo.
    echo Presiona Ctrl+C para detener el servidor
    echo.
    echo ========================================
    echo.
    php -S localhost:8000
    goto :end
)

REM Si no hay PHP, intentar con Python
python --version >nul 2>&1
if %errorlevel% equ 0 (
    echo Python detectado! Iniciando servidor HTTP...
    echo.
    echo IMPORTANTE: Python no ejecuta PHP
    echo Los datos de ingresantes se cargan desde localStorage
    echo.
    echo Servidor iniciado en: http://localhost:8000
    echo.
    echo URLs disponibles:
    echo   - Inicio: http://localhost:8000/
    echo   - Panel Admin: http://localhost:8000/admin-modular.html
    echo   - Profesores: http://localhost:8000/profesores.html
    echo.
    echo Presiona Ctrl+C para detener el servidor
    echo.
    echo ========================================
    echo.
    python -m http.server 8000
    goto :end
)

REM Si ninguno funciona
echo.
echo ========================================
echo   ERROR: PHP ni Python estan instalados
echo ========================================
echo.
echo Necesitas instalar al menos uno de estos:
echo.
echo PHP (Recomendado para funcionalidad completa):
echo   - Descarga: https://www.php.net/downloads
echo   - O instala XAMPP: https://www.apachefriends.org/
echo.
echo Python (Basico - sin soporte PHP):
echo   - Descarga: https://www.python.org/downloads/
echo   - Marca "Add Python to PATH" durante instalacion
echo.
pause

:end
