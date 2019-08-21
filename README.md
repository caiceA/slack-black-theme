# Slack 4 Black Theme Night Mood
## The Black Theme you'll fall in love with 😍



# Theme Preview
<img width="1920" alt="screen shot 2018-09-09 at 22 27 00" src="https://user-images.githubusercontent.com/16766231/45268625-9052ec80-b47f-11e8-98d5-70c9fb188ea1.png">
<img width="1918" alt="Screenshot 2019-07-18 at 13 38 37" src="https://user-images.githubusercontent.com/16766231/61454517-68ff6280-a961-11e9-9a2b-aa929fb649c5.png">

# Mac/Linux Install

## Requirements
* Slack 4
* [Muli Font](https://www.fontsquirrel.com/fonts/download/muli)
  * Please download and install this Font on your computer.
* npm / node
  * It requires you have nodejs, npx and the asar package installed globally, you can install asar and npx with:
```
  npm i -g npx
  npm i -g asar
```
## Installation
1. Download from here [slack-4-sh.zip](http://neckcode.com/slack-dark-mode.sh.zip) and unpack zip
2. Open terminal and drag and drop .sh file to the terminal. After installation, restart Slack and enjoy.
```
Make sure you have Npm / Node already installed in your computer.
It requires you have nodejs and the asar package installed globally with npm i -g asar
```

# Windows Install

1. Please have [NodeJS](https://nodejs.org/en/download/) Installed.

2. They're fonts used in this theme and the script will download and install them if they are not in your fronts folder.

3. You must have Powershell 5.0, aka Windows 10 to get full compatibility. If you don't have Windows 10 install the latest [powershell](https://github.com/PowerShell/PowerShell#get-powershell) for windows.

4. When running this script always run powershell in **Adminstrator Mode**. Hit your windows start button then type `powershell`, right click powershell, then `Run as administrator`.

**Note:**

- These instructions are error handled in the script.
- Please restart/close powershell if you have installed NodeJS during this install. This will refresh your environment variables to which NodeJS/Windows uses for commands. If you have [Chocolatey](https://chocolatey.org/) installed just type `refreshenv` while in powershell and run the install command below without closing/restarting powershell.

## Install

To install theme just open powershell as administrator (Refer to #4 above) and run this command below.

`iex (new-object net.webclient).downloadstring('https://raw.githubusercontent.com/caiceA/slack-black-theme/master/slack-dark-mode.ps1')`

### Potential Errors

1. If you get an error when you try and run the install command above you might need to change the execution policy (i.e. enable Powershell). You need to be an administrator on your computer to do this.

    Open powershell(Refer to #4 above) and run this command: `Set-ExecutionPolicy RemoteSigned -scope CurrentUser`

2. If you happen to get this error. While the command `npx asar extract app.asar app.asar.unpackedcustom` has run:

```powershell
npm ERR! code ENOLOCAL
npm ERR! Could not install from "...\AppData\Roaming\npm-cache\_npx\*****" as it does not contain a package.json file.

npm ERR! A complete log of this run can be found in:
npm ERR!     "C:\Users\...\AppData\Roaming\npm-cache\_logs\**********-debug.log
Install for asar@latest failed with code 1"
```

Please enter this: `npm config set cache C:\tmp\nodejs\npm-cache --global` -- [Origin](https://github.com/zkat/npx/issues/146#issuecomment-384016791)

# Contributors

[caiceA](https://github.com/caiceA) - Maintainer & Designer


- [pseeth](https://github.com/pseeth)
- [jpmckearin](https://github.com/jpmckearin)
- [benjamhooper](https://github.com/benjamhooper/)

### Design by Ali Caice
