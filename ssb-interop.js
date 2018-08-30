/**
 * The preload script needs to stay in regular ole JavaScript, because it is
 * the point of entry for electron-compile.
 */

if (window.location.href !== 'about:blank') {
    const preloadStartTime = process.hrtime();
    const { ipcRenderer, remote } = require('electron');

    ipcRenderer.on('SLACK_SET_DESKTOP_INTEROP_METADATA', (_event, ...args) =>
        args.forEach(({ key, value }) => window[key] = value)
    );

    const { init } = require('electron-compile');
    const { assignIn } = require('lodash');
    const path = require('path');

    const { isPrebuilt } = require('../utils/process-helpers');
    const profiler = require('../utils/profiler.js');

    if (profiler.shouldProfile()) profiler.startProfiling();

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

    /**
     * loadSettings are just the command-line arguments we're concerned with, in
     * this case developer vs production mode.
     *
     * Note: we are using one of property in loadSettings to call electron-compile init,
     * so can't get rid of calling remote synchronously here.
     */
    const loadSettings = window.loadSettings = assignIn({},
        remote.getGlobal('loadSettings'), { windowType: 'webapp' }
    );

    window.perfTimer = assignIn({}, remote.getGlobal('perfTimer'));
    window.perfTimer.PRELOAD_STARTED = preloadStartTime;

    if (!window.perfTimer.isInitialTeamBooted) {
        ipcRenderer.send('SLACK_PRQ_INITIAL_TEAM_BOOTED');
    }

    const resourcePath = path.join(__dirname, '..', '..');
    const mainModule = require.resolve('../ssb/main.ts');
    const isDevMode = loadSettings.devMode && isPrebuilt();

    init(resourcePath, mainModule, !isDevMode);
}



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
    @import url('https://fonts.googleapis.com/css?family=Nunito:200,200i,300,300i,400,400i,600,600i,700,700i,800,800i,900,900i') !important;
    font-family: 'Nunito', sans-serif !important;
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
  color:#5fd5ee!important;

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
  color: #f8d189 !important;
  font-weight:bold;
  border : none !important;
  }
  .menu_content a{
  color:white !important;
  }
  .menuitem a{
  color:white !important;
  }
  .c-member_slug--mention, .c-member_slug--mention:hover{
  background:#fff6d1 !important;
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
        background:#b7bcbe!important;
        color white !important;
    }
    .c-search_autocomplete footer{
        background:#97a0a5!important;
        color white !important;
    }
    .c-search_autocomplete__suggestion_text{
        color white !important;
    }
    .c-search_autocomplete__suggestion_content .c-search_autocomplete__suggestion_text{
        color white !important;
    }
    .c-search_autocomplete header{
        background:#b7bcbe!important;
        color:black !important;
    }
    .c-search_autocomplete footer .c-search_autocomplete__footer_navigation_help{
        color:white !important;
    }
    .c-search__input_box .c-search__input_box__input .ql-editor, .c-search__input_box .c-search__input_box__input .ql-placeholder{
        background:#2b2c2e!important;
        border:none !important;
    }
    .c-search__tabs{
        background:#2b2c2e!important;
    }
    .c-search__view{
        background:#2b2c2e!important;
    }
    .c-search_message__body{
        color:#cacbcc !important;
    }
    .p-search_filter__title_text{
        background:#2b2c2e!important;
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
    color: #5fd5ee;
    font-size: 13px;
    margin-top: 4px;
}
.c-link--button:active, .c-link--button:focus, .c-link--button:hover {
    color: #5fd5ee;
    outline: none;
    text-decoration: underline;}
    .c-filter_input {
        align-items: center;
        background-color: #545454 ;
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