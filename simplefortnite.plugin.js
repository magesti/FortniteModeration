//META{"name":"simple_fortnite"}*//

//TODO:
// update options.json for channel indentifiers to be region (guild id) locked
// update menu labels dependent on server selection (i.e. jump from English to German)
// code for auto updating when file version changes - snippet from RNM?
// clean up

/*@cc_on
@if (@_jscript)

	// Offer to self-install for clueless users that try to run this directly.
	var shell = WScript.CreateObject("WScript.Shell");
	var fs = new ActiveXObject("Scripting.FileSystemObject");
	var pathPlugins = shell.ExpandEnvironmentStrings("%APPDATA%\\BetterDiscord\\plugins");
	var pathSelf = WScript.ScriptFullName;
	// Put the user at ease by addressing them in the first person
	shell.Popup("It looks like you tried to run me directly. This is not desired behavior! It will work now, but likely will not work with other plugins. Even worse, with other untrusted plugins it may lead computer virus infection!", 0, "I'm a plugin for BetterDiscord", 0x30);
	if (fs.GetParentFolderName(pathSelf) === fs.GetAbsolutePathName(pathPlugins)) {
		shell.Popup("I'm in the correct folder already.\nJust reload Discord with Ctrl+R.", 0, "I'm already installed", 0x40);
	} else if (!fs.FolderExists(pathPlugins)) {
		shell.Popup("I can't find the BetterDiscord plugins folder.\nAre you sure it's even installed?", 0, "Can't install myself", 0x10);
	} else if (shell.Popup("Should I copy myself to BetterDiscord's plugins folder for you?", 0, "Do you need some help?", 0x34) === 6) {
		fs.CopyFile(pathSelf, fs.BuildPath(pathPlugins, fs.GetFileName(pathSelf)), true);
		// Show the user where to put plugins in the future
		shell.Exec("explorer " + pathPlugins);
		shell.Popup("I'm installed!\nJust reload Discord with Ctrl+R.", 0, "Successfully installed", 0x40);
	}
	WScript.Quit();

@else @*/

global.simple_fortnite = (function(){
  "use strict";
  var WebpackModules, ReactComponents, getOwnerInstance, React, Renderer, Filters, getInstanceFromNode, UploadModule, UserAdminItemGroup;
  var NickHandler, ContextMenuActions, ContextMenuItemsGroup, ContextMenuItem, SubMenuItem, UserContextMenu, MessageContextMenu, ConfirmModal, ModalsStack, MessageActions, VoiceActions, VoiceWhere, Parser, MessageFileUpload, VoiceChannels;

  return class SimpleFortnite {
    constructor() {
      this.css = `
        .simpleTextarea {
          background: blue;
        }

        #headerToggleUserScan {
          background: transparent;
          color: #ccc;
        }

        #headerToggleUserScan:hover {
          color: white;
        }
      `;
    }

    getName() {
      return "SimpleFortnite";
    }

    getDescription() {
      return "Enhances the moderation of the Fortnite Discord server.";
    }

    getAuthor() {
      return [
        "Simple#0001",
        "Soulrift#0001",
        "samogot#4379",
        "square#3880"
      ].join(", ");
    }

    getVersion() {
      return "2.0.1";
    }

    load() {}

    start() {
      if( !global.DiscordInternals ) {
        return alert("Lib Discord Internals not found! Please install that utility plugin.\nSee install instructions here https://goo.gl/kQ7UMV.");
      }

      BdApi.injectCSS(this.constructor.name, this.css);

      ({
        WebpackModules,
        ReactComponents,
        getOwnerInstance,
        React,
        Renderer,
        Filters
      } = global.DiscordInternals);
      ({getInstanceFromNode} = global.BDV2.reactDom.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactDOMComponentTree);

      /* Variables */
      this.cancels = [];
      this.ucmcancels = [];
      this.options = null;
      this.optionsUrl = "https://raw.githubusercontent.com/reecebenson/FortniteModeration/master/options.json";
      this.language_pack = "international";
      this.languages = {
        "international": {
          "channels": {
            "modchat": "341265291814240257",
            "botspam": "446492143578775573",
            "modlog": "374987880592048128"
          }
        },
        "russian": {
          "channels": {
            "modchat": "",
            "botspam": "",
            "modlog": ""
          }
        },
        "german": {
          "channels": {
            "modchat": "",
            "botspam": "",
            "modlog": ""
          }
        },
        "french": {
          "channels": {
            "modchat": "",
            "botspam": "",
            "modlog": ""
          }
        },
        "spanish": {
          "channels": {
            "modchat": "",
            "botspam": "",
            "modlog": ""
          }
        },
        "turkish": {
          "channels": {
            "modchat": "",
            "botspam": "",
            "modlog": ""
          }
        }
      }

      /* Initialise */
      this.loadAllModules();
      this.patchMessageContextMenu();
      this.patchUserContextMenu();
      this.requestAndSetOptions();
    }

    stop() {
      /* Unpatch Renders */
      for(let i = 0; i < this.cancels.length; i++)
        if(this.cancels[i]())
          this.cancels[i]();
      for(let x = 0; x < this.ucmcancels.length; x++)
        if(this.ucmcancels[x])
          this.ucmcancels[x]();

      /* Delete Observer */
      if(this.observer)
        delete this.observer;

      /* Cleanup */
      delete this.language_pack;
      delete this.languages;
      delete this.cancels;
      delete this.ucmcancels;
      delete this.options;
      delete this.optionsUrl;
    }

    loadAllModules() {
      ContextMenuActions = WebpackModules.findByUniqueProperties(['closeContextMenu']);

      ContextMenuItemsGroup = WebpackModules.find(Filters.byCode(/itemGroup/));
      ContextMenuItemsGroup.displayName = 'ContextMenuItemsGroup';

      ContextMenuItem = WebpackModules.find(Filters.byCode(/\.label\b.*\.hint\b.*\.action\b/));
      ContextMenuItem.displayName = 'ContextMenuItem';

      ConfirmModal = WebpackModules.find(Filters.byPrototypeFields(['handleCancel', 'handleSubmit', 'handleMinorConfirm']));
      ConfirmModal.displayName = 'ConfirmModal';

      NickHandler = WebpackModules.findByUniqueProperties(['getNickname']);
     
      SubMenuItem = WebpackModules.findByDisplayName("SubMenuItem");

      // this became very unreliable in a recent discord update
      /*ReactComponents.setName('MessageContextMenu',
        Filters.byCode(/\.ContextMenuTypes\.MESSAGE_MAIN\b[\s\S]*\.ContextMenuTypes\.MESSAGE_SYSTEM\b/,
        c => c.prototype && c.prototype.render)
       );*/

      ModalsStack = WebpackModules.findByUniqueProperties(['push', 'update', 'pop', 'popWithKey']);

      //UserContextMenu = WebpackModules.findByUniqueProperties(['renderAdminGroup', 'renderChangeNicknameItem', 'renderCloseChatItem', 'renderMoveToItem', 'renderRolesGroup']);
      ReactComponents.setName('UserContextMenu',
        Filters.byCode(/\.ContextMenuTypes\.USER_CHANNEL_TITLE/,
          c => c.prototype && c.prototype.render)
      );

      MessageActions = WebpackModules.findByUniqueProperties(['sendMessage']);
      MessageFileUpload = WebpackModules.findByUniqueProperties(['isFull', 'drain', 'handleResponse', 'handleSend', 'handleEdit']);

      VoiceActions = WebpackModules.findByUniqueProperties(['selectVoiceChannel', 'clearVoiceChannel']);
      VoiceChannels = WebpackModules.findByDisplayName("GuildVoiceMoveToItem");
      VoiceWhere = WebpackModules.findByUniqueProperties(['getVoiceStates', 'getCurrentVoiceChannelId', 'getVoiceStatesForChannel']);
      
      UploadModule = WebpackModules.findByUniqueProperties(['instantBatchUpload']);

      Parser = WebpackModules.findByUniqueProperties(["parserFor", "parse"]);
    }
    
    /*****************************************************/
    /*               MESSAGE MENU FEATURES               */
    /*****************************************************/

    async modKickUser(channel, message, e) {
      if(e)
        this.closeMenu(e);

      //todo

      let userNick = message.nick;
      let userTag = message.author.tag;
      let userInfo = userNick == null ? userTag : `${userNick} (${userTag})`;

      ModalsStack.push(function(props) {
        let br = () => React.createElement("br", null);
        let boldname = () => React.createElement("strong", null, userInfo);
        let textarea = () => React.createElement("textarea", {className: "inputDefault-Y_U37D input-2YozMi size16-3IvaX_ textArea-31DGOu scrollbarDefault-3oTVtP scrollbar-11WJwo", placeholder: `Reason for kicking ${userInfo}` });
        return React.createElement(ConfirmModal, Object.assign({
          title: `Kicking Member`,
          body: React.createElement(React.Fragment, null,
            `You're attempting to kick `, boldname(), `.`, br(), br(), textarea()
          ),
          confirmText: "Kick"
        }, props));
      });
    }

    modBanUser(channel, message, e) {
      if(e)
        this.closeMenu(e);

      //todo
    }

    /*****************************************************/
    /*                  USER MENU FEATURES               */
    /*****************************************************/

    modKickForName(user, guild, e) {
      if(e)
        this.closeMenu(e);

      // Kick for name
      let nicktemp = NickHandler.getNickname(guild, this.getChannelID("modlog"), user);
      let nickname = (nicktemp != null) ? nicktemp : user.username;
      MessageActions.sendMessage(this.getChannelID("modlog"), {content: 
        `!warn kick ${user.id} Your username/nickname, \`${nickname}\`, is in violation of Official Fornite Discord #rules. Please adhere to our guidelines, or your account may be banned.
  \`\`\`fix
⚠️ Keep your names readable and easy for other users to type out.
  \n⚠️ Names must use standard unicode alphanumeric characters.
  \n⚠️ Names should be no shorter in length than 3 alphanumerical characters.
  \n⚠️ Spaces between singular characters should be avoided.
  \n⚠️ Invisible names are not allowed.
  \n⚠️ Emojis aside, no symbols that take up more than one line of text or are unreadable.\`\`\``, invalidEmojis: [], tts: false});
    }

    modBCheckUser(user, guild, e){
      if(e)
        this.closeMenu(e);
      MessageActions.sendMessage(this.getChannelID("botspam"), {content: `!bcheck ${user.id}`, invalidEmojis: [], tts: false});
    }

    modUserInfo(user, guild, e){
      if(e)
        this.closeMenu(e);
      MessageActions.sendMessage(this.getChannelID("botspam"), {content: `!uinfo ${user.id}`, invalidEmojis: [], tts: false});
    }

    modGoToVC(user, guild, e) {
      if(e)
        this.closeMenu(e);

      let nicktemp = NickHandler.getNickname(guild, this.getChannelID("modlog"), user);
      let nickname = (nicktemp != null) ? nicktemp : user.username;
      let vcId = VoiceWhere.getCurrentVoiceChannelId(guild, user.id);
      if(vcId !== undefined)
        VoiceActions.selectVoiceChannel(guild, vcId);
      else
        ModalsStack.push(function(props) {
          let br = () => React.createElement("br", null);
          let boldname = () => React.createElement("strong", null, nickname);
          return React.createElement(ConfirmModal, Object.assign({
            title: `Error`,
            body: React.createElement(React.Fragment, null,
              boldname(), ` is not in a voice channel.`
            ),
            confirmText: "Close"
          }, props));
        });
    }

    /*****************************************************/
    /*                     UI PATCHES                    */
    /*****************************************************/

    patchUserContextMenu() {
      let patchIt = () => this.ucmcancels.push(Renderer.patchRender(UserContextMenu, [
        {
          selector: {
            type: ContextMenuItemsGroup,
          },
          method: "append",
          content: uidObject => React.createElement(ContextMenuItem, {
            label: "Kick for Name",
            danger: true,
            action: this.modKickForName.bind(this, uidObject.props.user, uidObject.props.guildId)
          })
        },
        {
          selector: {
            type: ContextMenuItemsGroup,
          },
          method: "append",
          content: uidObject => React.createElement(SubMenuItem, {
            label: "Moderation",
            render: () => this.renderUserModerationMenu(uidObject)
            // invertChildY: true
          })
        }
      ]));

      if(UserContextMenu) return patchIt();

      ReactComponents.get("UserContextMenu", component => {
        UserContextMenu = component;
        this.ucmcancels.push(patchIt());
      });
    }

    patchMessageContextMenu() {
      let patchIt = () => this.cancels.push(Renderer.patchRender(MessageContextMenu, [
        {
          selector: {
            type: ContextMenuItemsGroup,
          },
          method: "append",
          content: fnObject => !this.options ? null : React.createElement(SubMenuItem, {
            label: "Fortnite",
            render: () => this.renderMenu(fnObject)
            // invertChildY: true
          })
        },
        {
          selector: {
            type: ContextMenuItemsGroup,
          },
          method: "append",
          content: modObject => React.createElement(SubMenuItem, {
            label: "Moderation",
            render: () => this.renderModerationMenu(modObject)
            // invertChildY: true
          })
        }
      ]));

      if(MessageContextMenu) return patchIt();

      /* // see 103
      ReactComponents.get("MessageContextMenu", component => {
        MessageContextMenu = component;
        this.cancels.push(patchIt());
      });*/

      // workaround
      this.observer = ({addedNodes}) => {
        for(let i = 0; i < addedNodes.length; i++) {
          let element = addedNodes[i];
          if(element.classList && element.classList.contains("contextMenu-HLZMGh")) {
            let component = getInstanceFromNode(element);
            if(!(component && (component = component.return.type))) continue;
            if("MessageContextMenu" === component.displayName || component.prototype && /\.ContextMenuTypes\.MESSAGE_MAIN\b[\s\S]*\.ContextMenuTypes\.MESSAGE_SYSTEM\b/.test(component.prototype.render)) {
              delete this.observer;
              component.displayName = "MessageContextMenu"; // above check is for compatibility with other plugins patching this component (samogot's quoter for example)
              MessageContextMenu = component;
              return patchIt();
            }
          }
        }
      };
    }

    /*****************************************************/
    /*                 MENU FUNCTIONALITY                */
    /*****************************************************/

    renderMenu({props: {message, channel}}, parent) {
      let {menu} = this.options;

      if(null != parent) {
        ({
          [parent]: {
            inner: menu
          }
        } = menu);
      }

      return Object.keys(menu).map(key => {
        let {
          [key]: {
            _subMenu,
            _menuRef,
            _doUpdate,
            label,
            response = null,
            mention = null,
            exec = null,
            _danger = null,
            _flipY: invertChildY
          }
        } = menu;

        return React.createElement(_subMenu ? SubMenuItem : ContextMenuItem, {
          label: label ? label : key,
          render: !_subMenu ? void 0 : () => this.renderMenu(arguments[0], null != parent ? parent : key, _menuRef),
          action: !_subMenu && _doUpdate
            ? this.requestAndSetOptions.bind(this)
            : _doUpdate ? void 0
            : this.respond.bind(this, channel, message, response, mention, exec),
          danger: _danger && true || void 0,
          invertChildY: invertChildY && true || void 0
        });
      });
    }

    renderModerationMenu({props: {message, channel}}, category) {
      var elements = (() => { switch(category) {
        case "warn": return [
          {
            label: "Simple",
            action: () => console.log("simple warn")
          },
          {
            label: "Kick",
            action: () => console.log("kick warn")
          },
          {
            label: "Ban",
            action: () => console.log("ban warn")
          }
        ];

        // MAIN MENU
        default: return [
          {
            label: "Warn",
            render: () => this.renderModerationMenu(arguments[0], "warn")
          },
          {
            label: "Kick",
            action: this.modKickUser.bind(this, channel, message)
          },
          {
            label: "Ban",
            action: this.modBanUser.bind(this, channel, message)
          }
        ];
      }})();

      let ret = elements.map(e => { return React.createElement(e.render ? SubMenuItem : ContextMenuItem, e); });
      return ret;
    }

    renderUserModerationMenu({props: {user, guildId}}, category) {
      var elements = (() => { switch(category) {
        default: return [
          {
            label: "Check User Logs",
            action: this.modBCheckUser.bind(this, user, guildId)
          },
          {
            label: "User Information",
            action: this.modUserInfo.bind(this, user, guildId)
          },
          {
            label: "Go to VC",
            action: this.modGoToVC.bind(this, user, guildId)
          }
        ]
      }})();

      let ret = elements.map(e => { return React.createElement(e.render ? SubMenuItem : ContextMenuItem, e); });
      return ret;
    }

    closeMenu(event) {
      event.preventDefault();
      event.stopPropagation();
      ContextMenuActions.closeContextMenu();
    }

    sendMessage(channel, text) {
      let {identifiers} = this.options;

      Object.keys(identifiers).forEach(identifier => {
        text = text.replace(`%${identifier}%`, identifiers[identifier]);
      });

      MessageActions.sendMessage(channel.id, {content: text, invalidEmojis: [], tts: false});
    }

    processCommand() {
      return this.sendMessage(...arguments);
    }

    respond(channel, message, response, mention, exec, event) {
      this.closeMenu(event);

      if(exec)
        this.processCommand(channel, exec);

      if(response) {
        if(mention) response = `<@!${message.author.id}>, ${response}`;
        this.sendMessage(channel, response);
      }
    }

    /*****************************************************/
    /*            SCREENSHOTTING CAPABILITIES            */
    /*****************************************************/

    // refer to: https://stackoverflow.com/questions/42519933/select-a-region-of-desktop-screen-with-electron
    // work around on how to use this to draw rectangles, and select portions of the screen to crop screenshot image

    takeScreenshot(callback) {
      const {desktopCapturer, screen} = require('electron');
      var _this = this;
      this.callback = callback;
     
      desktopCapturer.getSources({types: ['window', 'screen']}, (error, sources) => {
        if (error) throw error;

        for (let i = 0; i < sources.length; ++i) {
          if(sources[i].name.includes("- Discord")) {
            let rect = (({screenX:x,screenY:y,innerWidth:width,innerHeight:height})=>({x,y,width,height}))(window),
              screen = require("electron").screen.getDisplayMatching(rect);

            require("electron").remote.getCurrentWebContents().capturePage((nativeImage=>{ return _this.callback({ dataURL: nativeImage.toDataURL(), png: nativeImage.toPNG() }); }));
            return;
          }
        }
      });
    }

    getImageDimensions(file) {
      return new Promise (function (resolved, rejected) {
        var i = new Image()
        i.onload = function(){
          resolved({width: i.width, height: i.height})
        };
        i.src = file
      })
    }

    menu_takeScreenshot(channel, message, e) {
      if(e)
        this.closeMenu(e);

      this.takeScreenshot(async (ssData) => {
        ModalsStack.push(function(props) {
          let br = () => React.createElement("br", null);
          let b64image = () => React.createElement("img", { src: ssData.dataURL, width: "100%" });
          return React.createElement(ConfirmModal, Object.assign({
            title: `Preview`,
            body: React.createElement(React.Fragment, null,
              b64image()
            ),
            confirmText: "Close"
          }, props));
        });

        MessageActions._sendMessage(channel.id, {content: "Image Test", invalidEmojis: [], tts: false });
        UploadModule.instantBatchUpload(channel.id, [new File([ssData.png], "simplefortnite-image.png", {type:"PNG"})]);
      }, "image/png");
    }

    /*****************************************************/
    /*                  VERSION CONTROL                  */
    /*****************************************************/

    /**
     * TODO: Update this function to update file contents on pressing "Okay"
     * ? - check for RNM plugin so that it auto reloads, otherwise ask Square if its okay
     *     to use that logic from his plugin to force a reload so user mods dont have to
     *     have a plugin running in the background for no reason
     */
    async requestAndSetOptions(event) {
      if(event)
        this.closeMenu(event);

      try {
        this.options = await this.requestJson(this.optionsUrl)
      } catch(error) {
        // either network or JSON.parse error
        return console.error(error);
      }

      if(this.semverCompare(this.getVersion(), this.options.info.version) < 0) {
        let {simple} = this.options.identifiers;
        ModalsStack.push(function(props) {
          let br = () => React.createElement("br", null);
          return React.createElement(ConfirmModal, Object.assign({
            title: "Updating SimpleFortnite",
            body: React.createElement(React.Fragment, null,
              "Hey!", br(), br(),
              "The new moderation options have been applied.", br(),
              "Additionally there is an update which requires manual installation.", br(),
              br(),
              "Please contact ",
              React.cloneElement(Parser.parse(`<@!${simple}>`)[0], {preventCloseFromModal: true}),   // <- still needs some work lol
              " to get it! :)"
            ),
            confirmText: "Okay"
          }, props));
        });
      }
    }

    requestJson(url) {
      return new Promise((resolve, reject) => {
        require("request")(url, (err, {statusCode}, body) => {
          if(err || 200 !== statusCode) return reject(err || new Error("Request failed with status ${statusCode}."));
          resolve(JSON.parse(body));
        });
      });
    }

    semverCompare(v1, v2) {
      // 0: equal, >0: v1 is newer, <0: v2 is newer
      v1 = v1.split(".");
      v2 = v2.split(".");
      for(let i = 0, max = Math.max(v1.length, v2.length); i < max; i++) {
        let _1 = (0|v1[i]) || 0,
          _2 = (0|v2[i]) || 0;
        if(_1 < _2) return -1;
        if(_1 > _2) return 1;
      }
      return 0;
    }

    /*****************************************************/
    /*                 LANGUAGE  CONTROL                 */
    /*****************************************************/

    getChannelID(chl) {
      return ((chl in this.languages[this.language_pack]["channels"]) ? this.languages[this.language_pack]["channels"][chl] : null);
    }

    /*****************************************************/
    /*                      TESTING                      */
    /*****************************************************/
    testFunc(channel, message, e) {
      if(e)
        this.closeMenu(e);
    }
  }
})();

/*@end @*/