@echo off
REM Doble clic para abrir la pagina de Labrego con los ultimos cambios.
REM Baja la version mas reciente de GitHub, instala lo necesario y abre el navegador.
cd /d "%~dp0"
title Labrego - pagina web

echo.
echo  ==============================================
echo    LABREGO - abriendo la pagina
echo  ==============================================
echo.
echo  [1/3] Bajando los ultimos cambios de GitHub...
REM npm install a veces reescribe package-lock.json en Windows; ese cambio local
REM bloquearia el git pull, asi que se descarta antes de bajar la nueva version.
git restore package-lock.json 2>nul
git pull --ff-only
if errorlevel 1 (
  echo.
  echo  No se pudieron bajar los cambios.
  echo  Revisa tu conexion a internet o manda una captura de esta ventana.
  echo  Se abrira la version que ya tienes en el computador.
  echo.
  pause
)

echo.
echo  [2/3] Instalando lo necesario...
call npm install --no-fund --no-audit
if errorlevel 1 (
  echo.
  echo  Hubo un problema instalando. Manda una captura de esta ventana.
  pause
  exit /b 1
)

echo.
echo  [3/3] Abriendo la pagina en el navegador...
echo  Deja esta ventana abierta mientras usas la pagina. Para cerrarla: Ctrl + C
echo.
call npm run dev -- --open
pause
