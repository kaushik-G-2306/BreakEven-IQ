@echo off
echo ============================================================
echo   Fixing PowerPoint ActiveX Control Insertion Issue
echo ============================================================
echo.

:: 1. Reset Killbit for Microsoft WebBrowser
reg add "HKCU\SOFTWARE\Microsoft\Office\16.0\Common\COM Compatibility\{8856F961-340A-11D0-A96B-00C04FD705A2}" /v "Compatibility Flags" /t REG_DWORD /d 0 /f >nul 2>&1
reg add "HKLM\SOFTWARE\Microsoft\Office\16.0\Common\COM Compatibility\{8856F961-340A-11D0-A96B-00C04FD705A2}" /v "Compatibility Flags" /t REG_DWORD /d 0 /f >nul 2>&1
reg add "HKLM\SOFTWARE\WOW6432Node\Microsoft\Office\16.0\Common\COM Compatibility\{8856F961-340A-11D0-A96B-00C04FD705A2}" /v "Compatibility Flags" /t REG_DWORD /d 0 /f >nul 2>&1

:: 2. Office 365 / Office 2021 Security Unblocks
reg add "HKCU\SOFTWARE\Microsoft\Office\16.0\Common\Security" /v "DisableAllActiveX" /t REG_DWORD /d 0 /f >nul 2>&1
reg add "HKCU\SOFTWARE\Microsoft\Office\16.0\Common\Security" /v "UFIControls" /t REG_DWORD /d 1 /f >nul 2>&1
reg add "HKCU\SOFTWARE\Microsoft\Office\16.0\PowerPoint\Security" /v "PromptingLevel" /t REG_DWORD /d 1 /f >nul 2>&1

echo [SUCCESS] PowerPoint ActiveX restrictions have been successfully removed!
echo.
echo IMPORTANT:
echo 1. Close Microsoft PowerPoint completely.
echo 2. Re-open PowerPoint and insert Microsoft WebBrowser.
echo ============================================================
pause
