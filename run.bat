@echo off
title Launcher Sistem Lab (React + Java API)
echo ========================================================
echo   Sistem Peminjaman Lab - Auto Build ^& Run
echo ========================================================
echo.

:: Pindah ke direktori tempat run.bat berada
cd /d "%~dp0"

set "MY_DIR=%~dp0"

:: --- MENCARI FOLDER APLIKASI ---
if exist "LabSystem_Portable" (
    set "APP_DIR=LabSystem_Portable"
) else if exist "LabSystem-JavaSystem" (
    set "APP_DIR=LabSystem-JavaSystem"
) else (
    echo [ERROR] Folder aplikasi tidak ditemukan!
    pause
    exit /b
)

:: --- MENCARI JDK & TOMCAT SECARA OTOMATIS (PORTABLE) ---
if exist "%MY_DIR%jdk21" set "MY_JAVA_HOME=%MY_DIR%jdk21"
if "%MY_JAVA_HOME%"=="" if exist "%MY_DIR%jdk" set "MY_JAVA_HOME=%MY_DIR%jdk"

if exist "%MY_DIR%apache-tomcat" set "MY_TOMCAT_DIR=%MY_DIR%apache-tomcat"
if "%MY_TOMCAT_DIR%"=="" if exist "%MY_DIR%tomcat" set "MY_TOMCAT_DIR=%MY_DIR%tomcat"
if "%MY_TOMCAT_DIR%"=="" if not "%CATALINA_HOME%"=="" set "MY_TOMCAT_DIR=%CATALINA_HOME%"

echo Mengecek folder JDK dan Tomcat...

:: Pengecekan JDK
if "%MY_JAVA_HOME%"=="" goto check_javac_path
goto check_jdk_folder

:check_javac_path
where javac >nul 2>&1
if errorlevel 1 goto err_no_jdk
echo [INFO] Menggunakan JDK bawaan sistem (PATH).
set "JAVA_HOME="
goto check_tomcat

:check_jdk_folder
if not exist "%MY_JAVA_HOME%\bin\javac.exe" goto err_jdk_not_found
set "JAVA_HOME=%MY_JAVA_HOME%"
set "PATH=%JAVA_HOME%\bin;%PATH%"
echo [INFO] Menggunakan JDK dari: "%JAVA_HOME%"
goto check_tomcat

:err_no_jdk
echo [ERROR] JDK tidak ditemukan! 
echo Silakan install JDK dan set JAVA_HOME, atau letakkan folder 'jdk21' satu folder dengan run.bat
pause
exit /b

:err_jdk_not_found
echo [ERROR] JDK tidak ditemukan di: "%MY_JAVA_HOME%"
pause
exit /b

:check_tomcat
if "%MY_TOMCAT_DIR%"=="" goto err_no_tomcat
if not exist "%MY_TOMCAT_DIR%\bin\catalina.bat" goto err_tomcat_not_found
echo [INFO] Menggunakan Tomcat dari: "%MY_TOMCAT_DIR%"
set "CATALINA_HOME=%MY_TOMCAT_DIR%"
goto start_build

:err_no_tomcat
echo [ERROR] Tomcat tidak ditemukan! 
echo Silakan install Tomcat dan set CATALINA_HOME, atau letakkan folder 'apache-tomcat' satu folder dengan run.bat
pause
exit /b

:err_tomcat_not_found
echo [ERROR] Tomcat tidak ditemukan di: "%MY_TOMCAT_DIR%" (catalina.bat tidak ada)
pause
exit /b

:start_build
:: -- FIX TOMCAT SETENV.BAT OVERRIDE --
:: Tomcat mungkin masih mengingat JAVA_HOME yang lama dari env system atau setenv.bat.
:: Kita buat/timpa setenv.bat agar selalu menunjuk ke folder portable saat ini.
if not "%JAVA_HOME%"=="" (
    echo set "JAVA_HOME=%JAVA_HOME%" > "%CATALINA_HOME%\bin\setenv.bat"
    echo set "JRE_HOME=%JAVA_HOME%" >> "%CATALINA_HOME%\bin\setenv.bat"
) else (
    if exist "%CATALINA_HOME%\bin\setenv.bat" del "%CATALINA_HOME%\bin\setenv.bat"
)

echo.
echo [STEP 1] Mengambil library servlet-api.jar dan GSON...
if not exist "%APP_DIR%\webapps\ROOT\WEB-INF\lib" mkdir "%APP_DIR%\webapps\ROOT\WEB-INF\lib"
copy /Y "%CATALINA_HOME%\lib\servlet-api.jar" "%APP_DIR%\webapps\ROOT\WEB-INF\lib\" >nul

echo Memastikan GSON library valid (Mendownload ulang jika korup)...
curl -s -L -o "%APP_DIR%\webapps\ROOT\WEB-INF\lib\gson-2.10.1.jar" "https://repo1.maven.org/maven2/com/google/code/gson/gson/2.10.1/gson-2.10.1.jar"

echo [STEP 2] Mengkompilasi API Java...
cd /d "%MY_DIR%%APP_DIR%\webapps\ROOT\WEB-INF"
dir /s /b *.java > sources.txt
javac -cp "lib\*;classes" -d classes @sources.txt

if errorlevel 1 (
    echo.
    echo [ERROR] Kompilasi gagal! Silakan cek pesan error di atas.
    cd /d "%MY_DIR%"
    pause
    exit /b
)
if exist sources.txt del sources.txt
cd /d "%MY_DIR%"

echo [STEP 3] Memindahkan file ke Tomcat (Deploy)...
rmdir /S /Q "%CATALINA_HOME%\webapps\ROOT" 2>nul
mkdir "%CATALINA_HOME%\webapps\ROOT"
xcopy /S /E /Y /Q "%APP_DIR%\webapps\ROOT\*" "%CATALINA_HOME%\webapps\ROOT\" >nul

echo.
echo ========================================================
echo SEMUA PROSES SELESAI! Menjalankan Tomcat...
echo Server Tomcat akan berjalan di terminal ini (Logs).
echo Buka browser: http://localhost:8080
echo ========================================================
echo.

call "%CATALINA_HOME%\bin\catalina.bat" run
pause
