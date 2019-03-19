#!/bin/bash
MYPWD=${PWD}
curl -o ssb-interop.js https://raw.githubusercontent.com/caiceA/slack-black-theme/master/ssb-interop.js
sed "s/background: linear-gradient(0deg,#192a38,hsla(0,0%,100%,0) 40px) !important;/background: linear-gradient(0deg,#363636,hsla(0,0%,100%,0) 40px) !important;/g" ssb-interop.js >> ssb-interop
mv ssb-interop ssb-interop.js
sed '/.c-dialog__footer .c-button/i \
\
.c-pillow_file__email__meta td{color: white !important} \
.c-pillow_file__email__sender__address{color: #6ed2f2 !important} \
.c-pillow_file__email--collapsed{color: white !important} \
\
' ssb-interop.js >> ssb-interop
mv ssb-interop ssb-interop.js
cp $MYPWD/ssb-interop.js /Applications/Slack.app/Contents/Resources/app.asar.unpacked/src/static/ssb-interop.js
rm -f $MYPWD/ssb-interop.js
echo "restart slack to see changes take effect" 


