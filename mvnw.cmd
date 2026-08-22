@echo off
setlocal enabledelayedexpansion

set MAVEN_CMD_LINE_ARGS=%*

set MAVEN_PROJECT_BASEDIR=%~dp0
:strip
if "%MAVEN_PROJECT_BASEDIR:~-1%"=="\" set MAVEN_PROJECT_BASEDIR=%MAVEN_PROJECT_BASEDIR:~0,-1%& goto strip

set MAVEN_WPR_JAR=%MAVEN_PROJECT_BASEDIR%\.mvn\wrapper\maven-wrapper.jar

if exist "%MAVEN_WPR_JAR%" goto run

mkdir "%MAVEN_PROJECT_BASEDIR%\.mvn\wrapper" 2>NUL
set MAVEN_WPR_URL=https://repo.maven.apache.org/maven2/org/apache/maven/wrapper/maven-wrapper/3.2.0/maven-wrapper-3.2.0.jar

powershell -Command "[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; (New-Object Net.WebClient).DownloadFile('%MAVEN_WPR_URL%', '%MAVEN_WPR_JAR%')"

:run
java -Dmaven.multiModuleProjectDirectory="%MAVEN_PROJECT_BASEDIR%" -classpath "%MAVEN_WPR_JAR%" org.apache.maven.wrapper.MavenWrapperMain %MAVEN_CMD_LINE_ARGS%

if ERRORLEVEL 1 exit /b 1
