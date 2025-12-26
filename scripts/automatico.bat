@echo off
echo ========================================
echo  COLETA AUTOMATICA DE INDICADORES
echo ========================================
cd ..
call venv\Scripts\activate
python scripts/integrador.py
pause
