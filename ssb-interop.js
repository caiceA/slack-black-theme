/**
 * The preload script needs to stay in regular ole JavaScript, because it is
 * the point of entry for electron-compile.
 */

const allowedChildWindowEventMethod = [
    'windowWithTokenBeganLoading',
    'windowWithTokenFinishedLoading',
    'windowWithTokenCrashed',
    'windowWithTokenDidChangeGeometry',
    'windowWithTokenBecameKey',
    'windowWithTokenResignedKey',
    'windowWithTokenWillClose'
];

if (window.location.href !== 'about:blank') {
    const preloadStartTime = process.hrtime();

    require('./assign-metadata').assignMetadata();
    if (window.parentWebContentsId) {
        //tslint:disable-next-line:no-console max-line-length
        const warn = () => console.warn(`Deprecated: direct access to global object 'parentInfo' will be disallowed. 'parentWebContentsId' will be available until new interface is ready.`);
        Object.defineProperty(window, 'parentInfo', {
            get: () => {
                warn();
                return {
                    get webContentsId() {
                        warn();
                        return parentWebContentsId;
                    }
                };
            }
        });
    }

    const { ipcRenderer, remote } = require('electron');

    ipcRenderer
        .on('SLACK_NOTIFY_CHILD_WINDOW_EVENT', (event, method, ...args) => {
            try {
                if (!TSSSB || !TSSSB[method]) throw new Error('Webapp is not fully loaded to execute method');
                if (!allowedChildWindowEventMethod.includes(method)) {
                    throw new Error('Unsupported method');
                }

                TSSSB[method](...args);
            } catch (error) {
                console.error(`Cannot execute method`, { error, method }); //tslint:disable-line:no-console
            }
        });

    ipcRenderer
        .on('SLACK_REMOTE_DISPATCH_EVENT', (event, data, origin, browserWindowId) => {
            const evt = new Event('message');
            evt.data = JSON.parse(data);
            evt.origin = origin;
            evt.source = {
                postMessage: (message) => {
                    if (!desktop || !desktop.window || !desktop.window.postMessage) throw new Error('desktop not ready');
                    return desktop.window.postMessage(message, browserWindowId);
                }
            };

            window.dispatchEvent(evt);
            event.sender.send('SLACK_REMOTE_DISPATCH_EVENT');
        });

    const { init } = require('electron-compile');
    const { assignIn } = require('lodash');
    const path = require('path');

    const { isPrebuilt } = require('../utils/process-helpers');

    //tslint:disable-next-line:no-console
    process.on('uncaughtException', (e) => console.error(e));

    /**
     * Patch Node.js globals back in, refer to
     * https://electron.atom.io/docs/api/process/#event-loaded.
     */
    const processRef = window.process;
    process.once('loaded', () => {
        window.process = processRef;
    });

    window.perfTimer.PRELOAD_STARTED = preloadStartTime;

    // Consider "initial team booted" as whether the workspace is the first loaded after Slack launches
    ipcRenderer.once('SLACK_PRQ_TEAM_BOOT_ORDER', (_event, order) => {
        window.perfTimer.isInitialTeamBooted = order === 1;
    });
    ipcRenderer.send('SLACK_PRQ_TEAM_BOOTED'); // Main process will respond SLACK_PRQ_TEAM_BOOT_ORDER

    const resourcePath = path.join(__dirname, '..', '..');
    const mainModule = require.resolve('../ssb/main.ts');
    const isDevMode = loadSettings.devMode && isPrebuilt();

    init(resourcePath, mainModule, !isDevMode);
}




// Slack Night Mood theme


document.addEventListener("DOMContentLoaded", function() {

    // Then get its webviews
    let webviews = document.querySelectorAll(".TeamView webview");

    // Fetch our CSS in parallel ahead of time
    const cssPath = 'https://cdn.rawgit.com/laCour/slack-night-mode/master/css/raw/black.css';
    let cssPromise = fetch(cssPath).then(response => response.text());

    let customCustomCSS = `
:root {
/* Modify these to change your theme colors: */
--primary: #61AFEF;
--text: white;
}
body{
  font-family: 'Nunito', sans-serif !important;
  src: url('https://fonts.googleapis.com/css?family=Nunito:200,200i,300,300i,400,400i,600,600i,700,700i,800,800i,900,900i');
  text-rendering: optimizeLegibility important;
  font-weight:500 !important;
  word-spacing: -1px;
}
div.c-message.c-message--light.c-message--hover
{
color: grey !important;
}
.c-message__sender a{
font-weight:600;
text-transform: capitalize;
color:white !important;
font-size:15px !important;
}
span.c-message__body,
a.c-message__sender_link,
span.c-message_attachment__media_trigger.c-message_attachment__media_trigger--caption,
div.p-message_pane__foreword__description span
{
color: white; !important;
font-family: 'Nunito', sans-serif;
font-size: 16px;
letter-spacing: 0.3px !important;
}
div.c-virtual_list__scroll_container {
background-color: #222222 !important;
}
.p-message_pane .c-message_list:not(.c-virtual_list--scrollbar), .p-message_pane .c-message_list.c-virtual_list--scrollbar > .c-scrollbar__hider {
z-index: 0;
}
div.c-message__content:hover {
background-color: #222222 !important;
}
.c-team__display-name, .c-unified_member__display-name, .c-usergroup__handle{
color:white !important;
}
.c-dialog__content{
background:#333539!important;
}
.c-dialog__header{
background:#333539!important;
color:white;
}
.c-dialog__footer{
background:#333539!important;
}
div.c-message:hover {
background-color: #222222 !important;
}
.c-dialog__title{
color:white !important;
}
a{
color:#36D4F6!important;
}
.comment .app_preview_link_slug, .comment .internal_member_link, .comment .internal_user_group_link, .comment .mention, .ql-editor .app_preview_link_slug, .ql-editor .internal_member_link, .ql-editor .internal_user_group_link, .ql-editor .mention, ts-message .app_preview_link_slug, ts-message .internal_member_link, ts-message .internal_user_group_link, ts-message .mention{
background:#fff6d1 !important;
color:black !important;
}
.btn {
background: #008952;
color: #fff;
line-height: 1.2rem;
font-weight: 900;
-webkit-user-select: none;
-moz-user-select: none;
-ms-user-select: none;
user-select: none;
text-decoration: none;
cursor: pointer;
text-shadow: 0 1px 1px rgba(0,0,0,.1);
border: none;
border-radius: .25rem;
box-shadow: none;
position: relative;
display: inline-block;
vertical-align: bottom;
text-align: center;
white-space: nowrap;
margin: 0;
-webkit-appearance: none;
-webkit-tap-highlight-color: transparent;
}
.btn_outline.hover, .btn_outline:focus, .btn_outline:hover{
background: #fff;
}
.btn_outline {
background: #f9f9f9;
color: #2c2d30!important;
font-weight: 700;
text-shadow: none;
}
.c-member_slug--link {
background: none !important;
color: #F8D188!important;
font-weight:700 !important;
border : none !important;
}
.menu_content a{
color:white !important;
}
.menuitem a{
color:white !important;
}
.c-member_slug--mention, .c-member_slug--mention:hover{
background:#FFF6D1 !important;
color:black !important;
}
#convo_tab .message_input, #convo_tab textarea#msg_text {
  width: 100%;
  background: #31353d !important;
  border:1px solid #31353d !important;
  color:  white !important;
}
.upload_in_threads .inline_message_input_container:hover .inline_file_upload, .upload_in_threads.has_focus .inline_message_input_container .inline_file_upload{
background: #008952 !important;
border: 2px solid #008952 !important;
color:white !important;
  }
  #primary_file_button:hover { border: 2px solid #006039 !important; background: #006039 !important; }
  #primary_file_button {
    position: absolute;
    bottom: 1.375rem;
    top: 0;
    left: 0;
    width: 44px;
    padding: 0;
    border: 2px solid #008952 !important;
    background: #008952 !important;
    color: white !important;
    line-height: 42px;
    text-shadow: none;
    text-align: center;
    -webkit-transition: background 50ms,color 50ms;
    -moz-transition: background 50ms,color 50ms;
    transition: background 50ms,color 50ms;
    border-radius: 6px 0 0 6px;
  }
  .inline_file_upload{
      background: #008952 !important;
      color:white !important;
  }
  .p-share_dialog_message_input{
      background:black !important;
      color:white !important;
  }
  .p-file_upload_dialog__preview{
      background: transparent !important;
  }
  .c-input_select{
      background:transparent !important;
      color:white !important;
  }
  .c-label--inline .c-label__text{
      color:white !important;
  }
  .c-input_select_options_list_container:not(.c-input_select_options_list_container--always-open){
      background:#292d32!important;
      color:white !important;
      border: none !important;
      border :0 !important;
  }
  .c-input_select_options_list__option{
      color:white !important;
  }
  .c-input_select__secondary_member_name{
      color:white !important;
  }
  .c-search__input_and_close{
      background:#292d32!important;
      color white !important;
  }
  .c-search__input_box{
      background:#292d32!important;
      color white !important;
  }
  .c-search__input_and_close{
      background:#292d32!important;
      color white !important;
  }
  .c-search_autocomplete{
      background:#232323!important;
      color white !important;
  }
  .c-search_autocomplete footer{
      background:#3B3B3B!important;
      color white !important;
  }
  .c-search_autocomplete__suggestion_text{
      color white !important;
  }
  .c-search_autocomplete__suggestion_content .c-search_autocomplete__suggestion_text{
      color white !important;
  }
  .c-search_autocomplete header{
    background:#232323!important;
      color:white !important;
  }
  .c-search_autocomplete footer .c-search_autocomplete__footer_navigation_help{
      color:white !important;
  }
  .c-search__input_box .c-search__input_box__input .ql-editor, .c-search__input_box .c-search__input_box__input .ql-placeholder{
      background:#2b2c2e !important;
      border:none !important;
  }
  .c-search__tabs{
      background:#2b2c2e !important;
  }
  .c-search__view{
      background:#2b2c2e !important;
  }
  .c-search_message__body{
      color:#cacbcc !important;
  }
  .p-search_filter__title_text{
      background:#2b2c2e !important;
      color:white !important;
  }
  .p-search_filter__title:before{
      color:grey !important;
  }
  .p-search_filter__dates{
      background:#1f2021!important;
      border: none !important;
      color:#cacbcc !important;
  }
  .p-search_filter__datepicker_trigger:hover{
      color:white !important;
  }
  .c-calendar_month{
      color:black !important
  }
  .c-pillow_file_container{
      background:#1f2021!important;
      color:white !important;
  }
  .c-pillow_file__title{
      color:white !important;
  }
  .c-pillow_file__description{
      color:#cacbcc !important;
  }
  .c-mrkdwn__broadcast--mention, .c-mrkdwn__broadcast--mention:hover, .c-mrkdwn__highlight, .c-mrkdwn__mention, .c-mrkdwn__mention:hover, .c-mrkdwn__user_group--mention, .c-mrkdwn__user_group--mention:hover{
      color:black !important
  }
  #threads_msgs .inline_message_input_container.with_file_upload{
      border: 2px solid #545454!important;
  }
  ts-message.active:not(.standalone):not(.multi_delete_mode):not(.highlight):not(.new_reply):not(.show_broadcast_indicator), ts-message.message--focus:not(.standalone):not(.multi_delete_mode):not(.highlight):not(.new_reply):not(.show_broadcast_indicator), ts-message:hover:not(.standalone):not(.multi_delete_mode):not(.highlight):not(.new_reply):not(.show_broadcast_indicator){
      background:#1f2021!important;
  }
  #threads_msgs .inline_message_input_container.with_file_upload .inline_file_upload{
      background: #545454 !important;
      border:0px !important;
  }
  .p-flexpane_header{
      background:#1f2021!important;
  }
  .p-file_list__filters{
      background:#1f2021!important;
  }
  .p-file_list__file_type_select .c-input_select__selected_value--placeholder{
      color:#cacbcc !important;
  }
  .input.c-input_select__filter_input{
      background:transparent;
  }
  .p-file_list__file.c-pillow_file_container--full_width{
border-bottom:1px solid #383838
  }
.c-search{
  background: #2c2c2e !important;
}
.p-search_filter__title:before {
  border-bottom: 1px solid #5F5F5F !important;
}
.c-search__input_and_close {
  border-bottom: 1px solid #5F5F5F !important;
}
p-search_filter__date:first-child {
  border-bottom: 1px solid #5F5F5F !important;
}
.p-search_filter__more_link {
  color: #36D4F6;
  font-size: 13px;
  margin-top: 4px;
}
.c-link--button:active, .c-link--button:focus, .c-link--button:hover {
  color: #36D4F6;
  outline: none;
  text-decoration: underline;}
  .c-filter_input {
      align-items: center;
      background-color: #545454 ;
    }
    .c-member_slug--link, .c-member_slug--mention{
        padding:0!important;
    }
.p-channel_insights__message ts-message.standalone:not(.for_mention_display):not(.for_search_display):not(.for_top_results_search_display):not(.for_star_display){
  background-color: black !important;
  border: 1px solid  #545454 !important;
}
.p-channel_insights__date_heading span {
  position: relative;
  z-index: 1;
  padding: 0 .5rem;
  background-color: #545454 ;
  color: white;
  font-size: 15px;
}
.p-channel_insights__date_heading::before {
  display: block;
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background-color:  #545454;}
  #client_body:not(.onboarding):not(.feature_global_nav_layout):before{
      background:#222222;
  }
  .p-channel_insights__message--truncate::before {
      background: linear-gradient(180deg,transparent,#232323 90%);
  }
.c-button--outline {
  background: #2C2F33;
  color:white;
  border:1px solid #6A6C6E;
}
.c-button--outline a{
  color:white;
}
.c-message--light .c-message__sender .c-message__sender_link{
    color:#9FE19D !important;
    font-weight:600 !important;
}
.c-message__body {
    margin: 4px 0 -4px; !important}
.p-file_list a{
    color:green !important;
}
.p-downloads_flexpane--list {
    color:green !important;

}
.c-file__meta{
    background:blue !important;
}
.p-file_details__name{
    color:white !important;
}
.p-file_details__share_channel{
    color: #36D4F6;
}
.p-file_details__share_divider hr{
    border-color:#4B4B4B;
}
.p-flexpane_header{
    border-bottom:1px solid #4B4B4B;
}
.p-file_details__header_back:hover{
    color: #36D4F6;
}
.p-file_list__file.c-pillow_file_container--full_width:hover{
    border-bottom:1px solid #4B4B4B;
    border-color:#4B4B4B;
}
.p-file_list__filters{
    border-bottom:1px solid #4B4B4B;
}
.p-file_list__filters{
    padding-top:10px;
}
input.c-input_select__filter_input{
    background:transparent !important;
}
.c-search_autocomplete__suggestion_item:hover{
    background: #2D9EE0;
    color:white;
}
.texty_legacy.texty_single_line_input.focus, .texty_legacy.texty_single_line_input:hover{
    border-color:transparent;
}
.c-search__input_box__input:focus{
    outline:none;
}
#search_container .search_input.focus, #search_container .search_input:focus, #search_container .search_input:hover{
    color:white !important;
    background:transparent !important;
}
#search_container .search_input{
    color:white;
    background:transparent !important;
    border: 0px solid transparent !important;
}
.c-react_search_input:active .icon_search_wrapper *, .c-react_search_input:active .search_input_wrapper *, .c-react_search_input:focus .icon_search_wrapper *, .c-react_search_input:focus .search_input_wrapper *, .c-react_search_input:hover .icon_search_wrapper *, .c-react_search_input:hover .search_input_wrapper *{
    color:white !important;
    background:transparent !important;
    border: 0px solid transparent !important;
}
.texty_legacy.texty_single_line_input{
    background:transparent !important;
    border: 0px solid transparent !important;
}

.texty_legacy.texty_single_line_input.focus, .texty_legacy.texty_single_line_input:hover{
    border: 0px solid transparent !important;
    background:transparent !important;
}
.c-link--button:active, .c-link--button:focus, .c-link--button:hover{
    color: #36D4F6 !important;
    border:none !important;
}
.c-message_group .c-message_group__header:focus .c-channel_name, .c-message_group .c-message_group__header:focus .c-channel_name__team_name, .c-message_group .c-message_group__header:focus .c-message_group__header_date, .c-message_group:hover .c-message_group__header .c-channel_name, .c-message_group:hover .c-message_group__header .c-channel_name__team_name, .c-message_group:hover .c-message_group__header .c-message_group__header_date{
    color: #36D4F6 !important;
    border:none !important;
}
.p-search_filter__date:first-child{
    border-bottom:1px solid #4B4B4B;
}

a:hover{
    border-bottom:none !important;
    text-decoration:none !important;
}
.c-menu_item__button, .c-menu_item__button:link, .c-menu_item__button:visited{
    color:#252525 !important;
}
.c-menu_item__button:hover,  .c-menu_item__button:hover{
    color:white !important;
}
.c-message_group__header:active, .c-message_group__header:hover{
    text-decoration:none !important;
}
.c-search__input_box__clear{
    color: #36D4F6 !important;
}
.c-search_modal .c-search__input_box__clear{
    border-right: 1px solid #4B4B4B !important;
}
.c-file__meta{
    background: transparent !important
}
.c-file__slide--meta{
background-color: #4B4B4B!important;
width:110px;
color:white !important;
}
#msg_input{
    background:#424242!important;
}
.p-file_list__empty{
    color:white !important;
}
.searchable_member_list_filter .faux_input{
    color:white !important;
}
.p-channel_sidebar__badge, .p-channel_sidebar__banner--mentions{
    /* Permalink - use to edit and share this gradient: http://colorzilla.com/gradient-editor/#ff9908+0,db3009+100 */
    background: #ff9908 !important; /* Old browsers */
    background: -moz-linear-gradient(top, #ff9908 0%, #db3009 100%) !important; /* FF3.6-15 */
    background: -webkit-linear-gradient(top, #ff9908 0%,#db3009 100%)!important;/* Chrome10-25,Safari5.1-6 */
    background: linear-gradient(to bottom, #ff9908 0%,#db3009 100%)!important; /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#ff9908', endColorstr='#db3009',GradientType=0 )!important; /* IE6-9 */
box-shadow:1px 3px 3px rgba(0,0,0,0.5) !important;

}
.c-file_container{
background: #393939 !important;
max-width: 600px;
}
.p-file_list__empty{
    background #222222 !important;
    height:100vh !important

}
.searchable_member_list_filter{
    border-bottom:1px solid  #4B4B4B !important;
}
#client-ui #team_list_container .searchable_member_list_search{
    border-bottom:1px solid  #4B4B4B !important;
}
.tab_container .star_item .message .star_jump.msg_right_link, .tab_container .star_item ts-message .star_jump.msg_right_link{
    color:white !important;
}
#flex_contents .heading_text{
    color:white !important;
}
a.file_download_link { color: white !important }

a.file_download_link:hover { color: white !important }
.slack_menu_download {  color: white !important }

.slack_menu_download ts-icon {  color: white !important }
.filetype_button:hover .file_download_label { background: #545454; color: #e6e6e6; }

.filetype_button .file_title { color: #e6e6e6; }

.filetype_button .file_download_label { background: #828282; border-top: 1px solid #545454; }
    `

    // Insert a style tag into the wrapper view
    cssPromise.then(css => {
        let s = document.createElement('style');
        s.type = 'text/css';
        s.innerHTML = css + customCustomCSS;
        document.head.appendChild(s);
    });

    // Wait for each webview to load
    webviews.forEach(webview => {
        webview.addEventListener('ipc-message', message => {
            if (message.channel == 'didFinishLoading')
            // Finally add the CSS into the webview
                cssPromise.then(css => {
                let script = `
let s = document.createElement('style');
s.type = 'text/css';
s.id = 'slack-custom-css';
s.innerHTML = \`${css + customCustomCSS}\`;
document.head.appendChild(s);
`
                webview.executeJavaScript(script);
            })
        });
    });
});