if (-NOT ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")) {
    Write-Error "This setup needs admin permissions. Please run powershell in Administrator Mode." -Category PermissionDenied
    throw "Please rerun script once in Administrator Mode."
}

$date = Get-Date -Format "MMddyyyy"
$psversion = $PSVersionTable.PSVersion.Major
$psversionge = 5;

if ($psversion -ge $psversionge){
    Write-Host "This script will work correctly due to having powershell v5 or greater." -ForegroundColor Green
} else {
    Write-Host "This script may not work correctly, please install Powershell v5 or greater. You have version" $psversion -ForegroundColor Yellow
    Write-Warning "Download the lastest verison of Powershell @ https://github.com/PowerShell/PowerShell#get-powershell"
    Start-Process https://github.com/PowerShell/PowerShell#get-powershell
    throw "Please close Powershell, install v5+ of Powershel from link above & rerun script once installed"
}

if (-not (Test-Path -path $env:LOCALAPPDATA\slack)) {
    Start-Process https://slack.com/downloads/windows
    throw "Slack install folder not found || Slack needs to be updated || Slack not Installed, Please install @ https://slack.com/downloads/windows"
}

try {
    Write-Host "Checking if Nodejs is installed" -ForegroundColor Green
    $npxversion = npx -v
    Write-Host "Nodejs is installed with npm/npx verison:" $npxversion -ForegroundColor Green
} catch {
    Write-Warning "NodeJS is required for this script to work"
    Write-Warning "Would you like to download NodeJS (Default is y | n will exit)" 
    $Readhost = Read-Host " Enter ( y / n ): " 
    Switch ($ReadHost) { 
        Y {Write-Host "Yes, Downloading NodeJS. Please close powershell & rerun once installed." -ForegroundColor Green; Start-Process https://nodejs.org/en/download/; throw "Please close powershell & rerun once installed."} 
        N {Write-Host "No, Skip Downloading"; throw "Theme will not be installed"} 
        Default {Write-Host "Yes, Downloading NodeJS. Please close powershell & rerun once installed." -ForegroundColor Green; Start-Process https://nodejs.org/en/download/; throw "Please close powershell & rerun once installed."} 
    }
}

Write-Warning "Installing Necessary Fonts for Theme, continuing install."

if (-not (Test-Path "C:\Windows\Fonts\Muli.ttf")){
    $SourceDir   = "C:\Windows\Temp\fontdl"
    $Source      = "C:\Windows\Temp\fontdl\*"
    $Destination = (New-Object -ComObject Shell.Application).Namespace(0x14)
    $TempFolder  = "C:\Windows\Temp\Fonts"

    New-Item $SourceDir -Type Directory -Force | Out-Null

    New-Item -ItemType Directory -Force -Path $SourceDir

    New-Item $TempFolder -Type Directory -Force | Out-Null

    Invoke-WebRequest -Uri "https://www.fontsquirrel.com/fonts/download/muli" -OutFile "C:\Windows\Temp\muli.zip"

    Expand-Archive C:\Windows\Temp\muli.zip -DestinationPath $SourceDir

    Get-ChildItem -Path $Source -Include '*.ttf','*.ttc','*.otf' -Recurse | ForEach-Object {
        If (-not(Test-Path "C:\Windows\Fonts\$($_.Name)")) {

            $Font = "$TempFolder\$($_.Name)"

            Write-Host "Installing Font" $Font -ForegroundColor Green

            Copy-Item $($_.FullName) -Destination $TempFolder

            $Destination.CopyHere($Font,0x10)

            Remove-Item $Font -Force

        }
    }
} else {
    Write-Host "Necessary Fonts are installed, continuing install." -ForegroundColor Green
}

Write-Warning "Do you know your Slack version? (Example: 4.0.0)"
$Readhost = Read-Host " Enter ( y / n ) " 
Switch ($ReadHost) {
    Y {Write-Host "Continuing install.." -ForegroundColor Green} 
    N {Write-Host "No, Will not install theme. Find your verison by opening slack, Click the Triple Bar -> Help -> About Slack"; throw "Theme will not be installed"} 
    Default {Write-Host "Continuing install.." -ForegroundColor Green} 
}

if (Test-Path -path $env:LOCALAPPDATA\slack) {
    Write-Host "Making a Backup of Slack Directory" -ForegroundColor Green
    Write-Host "Copying Files Please be Patient" -ForegroundColor Green
    Copy-Item $env:LOCALAPPDATA\slack -Destination $env:LOCALAPPDATA\slack-backup-$date -Recurse
    Write-Host "Back up can be found here:" $env:LOCALAPPDATA\slack-backup-$date -ForegroundColor Green

    $a = Read-Host "Enter the verison of Slack you're on (Open Slack -> Help -> About Slack, example: 4.0.0) "
    $b = "4.0.0"
    
    if ([version]('{0}.{1}.{2}' -f $a.split('.')) -ge [version]('{0}.{1}.{2}' -f $b.split('.'))) {
        Write-Host "Installing Slack Theme to version" $a -ForegroundColor Green
        Set-Location "$env:LOCALAPPDATA\slack\app-$a\resources"
        npx asar extract app.asar app.asar.unpackedcustom
        Set-Location "app.asar.unpackedcustom\dist"
        Add-Content .\ssb-interop.bundle.js "`ndocument.addEventListener('DOMContentLoaded', function() {
            // Fetch our CSS in parallel ahead of time
            const cssPath = 'https://raw.githubusercontent.com/caiceA/slack-raw/master/slack-4';
            let cssPromise = fetch(cssPath).then((response) => response.text());
               // Insert a style tag into the wrapper view
            cssPromise.then((css) => {
              let s = document.createElement('style');
              s.type = 'text/css';
              s.innerHTML = css;
              document.head.appendChild(s);
            });
          });"
        Set-Location "$env:LOCALAPPDATA\slack\app-$a\resources"
        npx asar pack app.asar.unpackedcustom app.asar
        Write-Host "SLACK THEME INSTALLED ON VERSION" $a -ForegroundColor Green
        Write-Host "PLEASE RESTART SLACK IF OPENED" $a -ForegroundColor Green
    }
    else {
        Write-Host "Installing Slack Theme to version" $a -ForegroundColor Green
        Set-Location "$env:LOCALAPPDATA\slack\app-$a\resources\app.asar.unpacked\src\static"
        Add-Content .\ssb-interop.js "`ndocument.addEventListener('DOMContentLoaded', function() {
            // Fetch our CSS in parallel ahead of time
            const cssPath = 'https://raw.githubusercontent.com/caiceA/slack-raw/master/slack-4';
            let cssPromise = fetch(cssPath).then((response) => response.text());
               // Insert a style tag into the wrapper view
            cssPromise.then((css) => {
              let s = document.createElement('style');
              s.type = 'text/css';
              s.innerHTML = css;
              document.head.appendChild(s);
            });
          });"
          Write-Host "SLACK THEME INSTALLED ON VERSION" $a -ForegroundColor Green
          Write-Host "PLEASE RESTART SLACK IF OPENED" $a -ForegroundColor Green
    }

} else {
    throw "Slack install folder not found || Slack not Installed || Slack needs to be updated"
}
