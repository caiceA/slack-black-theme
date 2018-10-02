# Slack Black Theme Night Mood - Mac Only
## The Black Theme you'll fall in love with 😍
```
28 September 2018 Update:
- Resolved many cosmetic issues, download latest zip file from below
```
# Theme Preview
<img width="1920" alt="screen shot 2018-09-09 at 22 27 00" src="https://user-images.githubusercontent.com/16766231/45268625-9052ec80-b47f-11e8-98d5-70c9fb188ea1.png">




## First:

**Download and INSTALL this font family**
https://www.fontsquirrel.com/fonts/lato



## Second:

Go to Application  and right click on Slack  > Show Package Content
Contents > Resources > app.asar.unpacked > src > static >  ssb-interop.js

Replace your CURRENT **ssb-interop.js** File

#### With this

https://foxshift.com/slack-lato-font/ssb-interop.js.zip
OR
[View file on GitHub](https://github.com/caiceA/slack-black-theme/blob/master/ssb-interop.js)

## Third

Restart Slack & ENJOY !!! 🙌🏻

## Other

Updating Slack will not cause this theme to reset! 🦁

### Tips
#### Fix for hard to see unread channels
Add the following code to the end of the CSS section on your ssb-interop.js file:
```
.p-channel_sidebar__channel--unread:not(.p-channel_sidebar__channel--muted):not(.p-channel_sidebar__channel--selected) .p-channel_sidebar__name, .p-channel_sidebar__link--unread .p-channel_sidebar__name, .p-channel_sidebar__link--invites:not(.p-channel_sidebar__link--dim) .p-channel_sidebar__name{
border-left: 2px solid #ff5656;
padding-left: 6px;
height: 20px;
overflow: hidden;
line-height: 16px;
font-size: 17px;
}
```

---

_PS this is my own customization of [original theme](https://github.com/widget-/slack-black-theme)_
