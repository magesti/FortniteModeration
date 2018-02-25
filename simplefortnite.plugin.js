//META{"name":"simple_fortnite"}*//
//xd
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

var simple_fortnite =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

    module.exports = __webpack_require__(15);


/***/ }),
/* 1 */,
/* 2 */,
/* 3 */
/***/ (function(module, exports) {

    /**
     * BetterDiscord Plugin Base Class
     * Copyright (c) 2015-present Jiiks - https://jiiks.net
     * All rights reserved.
     * https://github.com/Jiiks/BetterDiscordApp - https://betterdiscord.net
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree.
    */
    'use strict';

    class Plugin {
        constructor(props) {
            this.props = props;
        }

        get authors() {
            return this.props.authors;
        }

        get version() {
            return this.props.version;
        }

        get name() {
            return this.props.name;
        }

        get description() {
            return this.props.description;
        }

        get reloadable() {
            return this.props.reloadable;
        }

        get permissions() {
            return this.props.permissions;
        }

        get storage() {
            return this.internal.storage;
        }

        get settings() {
            return this.storage.settings;
        }

        saveSettings() {
            this.storage.save();
            this.onSave(this.settings);
        }

        getSetting(id) {
            let setting = this.storage.settings.find(setting => { return setting.id === id; });
            if (setting && setting.value !== undefined) return setting.value;
        }

        get enabled() {
            return this.getSetting("enabled");
        }
    }

    module.exports = Plugin;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

    /**
     * BetterDiscord Plugin Api
     * Copyright (c) 2015-present Jiiks - https://jiiks.net
     * All rights reserved.
     * https://github.com/Jiiks/BetterDiscordApp - https://betterdiscord.net
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree.
    */
    'use strict';

    const Logger = __webpack_require__(5);
    const Api = __webpack_require__(6);

    class PluginApi {
        constructor(props) {
            this.props = props;
        }

        log(message, level) {
            Logger.log(this.props.name, message, level);
        }

        injectStyle(id, css) {
            Api.injectStyle(id, css);
        }

        removeStyle(id) {
            Api.removeStyle(id);
        }

        injectScript(id, script) {
            Api.injectScript(id, script);
        }

        removeScript(id) {
            Api.removeScript(id);
        }
    }

    module.exports = PluginApi;

/***/ }),
/* 5 */
/***/ (function(module, exports) {

    /**
     * BetterDiscord Logger Module
     * Copyright (c) 2015-present Jiiks - https://jiiks.net
     * All rights reserved.
     * https://github.com/Jiiks/BetterDiscordApp - https://betterdiscord.net
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree.
    */
    'use strict';

    class Logger {

        static log(moduleName, message, level = 'log') {
            level = this.parseLevel(level);
            console[level]('[%cBetter%cDiscord:%s] %s', 'color: #3E82E5', '', `${moduleName}${level === 'debug' ? '|DBG' : ''}`, message);
        }

        static logObject(moduleName, message, object, level) {
            if (message) this.log(moduleName, message, level);
            console.log(object);
        }

        static debug(moduleName, message, level, force) {
            if (!force) { if (!window.BetterDiscord || !window.BetterDiscord.debug) return; }
            this.log(moduleName, message, 'debug', true);
        }

        static debugObject(moduleName, message, object, level, force) {
            if (!force) { if (!window.BetterDiscord || !window.BetterDiscord.debug) return; }

            if (message) this.debug(moduleName, message, level, force);
            console.debug(object);
        }

        static parseLevel(level) {
            return {
                'log': 'log',
                'warn': 'warn',
                'err': 'error',
                'error': 'error',
                'debug': 'debug',
                'dbg': 'debug',
                'info': 'info'
            }[level];
        }

    }

    module.exports = Logger;

/***/ }),
/* 6 */
/***/ (function(module, exports) {

    module.exports = {};

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

    /**
     * BetterDiscord Plugin Storage
     * Copyright (c) 2015-present Jiiks - https://jiiks.net
     * All rights reserved.
     * https://github.com/Jiiks/BetterDiscordApp - https://betterdiscord.net
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree.
    */
    'use strict';

    const Utils = __webpack_require__(6);

    class PluginStorage {
        constructor(path, defaults) {
            this.path = `${path}/settings.json`;
            this.defaultConfig = defaults;
            this.load();
        }

        load() {
            this.settings = JSON.parse(JSON.stringify(this.defaultConfig));

            const loadSettings = Utils.tryParse(Utils.readFileSync(this.path));
            if (loadSettings) {
                Object.keys(loadSettings).map(key => {
                    this.setSetting(key, loadSettings[key]);
                });
            }

            if (!this.getSetting('enabled')) this.setSetting('enabled', false);
        }

        save() {
            const reduced = this.settings.reduce((result, item) => { result[item.id] = item.value; return result; }, {});
            Utils.writeFileSync(this.path, JSON.stringify(reduced));
        }

        getSetting(id) {
            const setting = this.settings.find(setting => setting.id === id);
            if (!setting) return null;
            return setting.value;
        }

        setSetting(id, value) {
            const setting = this.settings.find(setting => setting.id === id);
            if (!setting) {
                this.settings.push({ id, value });
            } else {
                setting.value = value;
            }
            this.save();
        }

        setSettings(settings) {
            this.settings = settings;
        }
    }

    module.exports = PluginStorage;

/***/ }),
/* 8 */,
/* 9 */,
/* 10 */,
/* 11 */,
/* 12 */,
/* 13 */,
/* 14 */,
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

    const v1transpile_version = 5;

    module.exports = class {
        constructor() {
            const config = __webpack_require__(16);
            if (!window.v1transpile || window.v1transpile.version < v1transpile_version) {
                window.v1transpile = window.v1transpile || {};
                window.v1transpile.version = v1transpile_version;
                window.v1transpile.Plugin = window.v1transpile.Plugin || __webpack_require__(3);
                window.v1transpile.PluginApi = window.v1transpile.PluginApi || __webpack_require__(4);
                window.v1transpile.PluginStorage = window.v1transpile.PluginStorage || __webpack_require__(7);
                window.v1transpile.Settings = window.v1transpile.Settings || {
                    /**
                     * Create and return a new top-level settings panel
                     * @author noodlebox
                     * @return {jQuery}
                     */
                    topPanel() {
                        return $("<form>").addClass("form").css("width", "100%");
                    },

                    /**
                     * Create and return a container for control groups
                     * @author noodlebox
                     * @return {jQuery}
                     */
                    controlGroups() {
                        return $("<div>").addClass("control-groups");
                    },

                    /**
                     * Create and return a flexible control group
                     * @author noodlebox
                     * @param {object} settings Settings object
                     * @param {Element|jQuery|string} settings.label an element or something JQuery-ish or, if string, use as plain text
                     * @return {jQuery}
                     */
                    controlGroup(settings) {
                        const group = $("<div>").addClass("control-group");

                        if (typeof settings.label === "string") {
                            group.append($("<label>").text(settings.label));
                        } else if (settings.label !== undefined) {
                            group.append($("<label>").append(settings.label));
                        }

                        return group;
                    },

                    /**
                     * Create and return a group of checkboxes
                     * @author noodlebox
                     * @param {object} settings Settings object
                     * @param {object[]} settings.items an array of settings objects to be passed to checkbox()
                     * @param {function(state)} settings.callback called with the current state, when it changes state is an array of boolean values
                     * @return {jQuery}
                     */
                    checkboxGroup(settings) {
                        settings = $.extend({
                            items: [],
                            callback: $.noop,
                        }, settings);

                        const state = settings.items.map(item => item.checked === true);

                        function onClick(i, itemState) {
                            if (settings.items[i].callback !== undefined) {
                                settings.items[i].callback(itemState);
                            }
                            state[i] = itemState;
                            settings.callback(state);
                        }

                        const group = $("<ul>").addClass("checkbox-group");

                        group.append(settings.items.map(function(item, i) {
                            return checkbox($.extend({}, item, {
                                callback: onClick.bind(undefined, i),
                            }));
                        }));

                        return group;
                    },

                    /**
                     * Create and return a checkbox
                     * @author noodlebox
                     * @param {object} settings Settings object
                     * @param {Element|jQuery|string} settings.label an element or something JQuery-ish or, if string, use as plain text
                     * @param {Element|jQuery|string} settings.help an element or something JQuery-ish or, if string, use as plain text
                     * @param {boolean} settings.checked
                     * @param {boolean} settings.disabled
                     * @param {function(state)} settings.callback called with the current state, when it changes state is a boolean
                     * @return {jQuery}
                     */
                    checkbox(settings) {
                        settings = $.extend({
                            checked: false,
                            disabled: false,
                            callback: $.noop,
                        }, settings);

                        const input = $("<input>").attr("type", "checkbox")
                            .prop("checked", settings.checked)
                            .prop("disabled", settings.disabled);

                        const inner = $("<div>").addClass("checkbox-inner")
                            .append(input)
                            .append($("<span>"));

                        const outer = $("<div>").addClass("checkbox").append(inner);

                        if (settings.disabled) {
                            outer.addClass("disabled");
                        }

                        if (typeof settings.label === "string") {
                            outer.append($("<span>").text(settings.label));
                        } else if (settings.label !== undefined) {
                            outer.append($("<span>").append(settings.label));
                        }

                        outer.on("click.kawaiiSettings", function() {
                            if (!input.prop("disabled")) {
                                const checked = !input.prop("checked");
                                input.prop("checked", checked);
                                settings.callback(checked);
                            }
                        });

                        const item = $("<li>").append(outer);

                        let help;
                        if (typeof settings.help === "string") {
                            help = $("<div>").text(settings.help);
                        } else if (settings.help !== undefined) {
                            help = $("<div>").append(settings.help);
                        }

                        if (help !== undefined) {
                            help.appendTo(item)
                                .addClass("help-text")
                                .css("margin-top", "-3px")
                                .css("margin-left", "27px");
                        }

                        return item;
                    },

                    /**
                     * Create and return an input
                     * @author samogot
                     * @param {object} settings Settings object
                     * @param {Element|jQuery|string} settings.label an element or something JQuery-ish or, if string, use as plain text
                     * @param {Element|jQuery|string} settings.help an element or something JQuery-ish or, if string, use as plain text
                     * @param {boolean} settings.value
                     * @param {boolean} settings.disabled
                     * @param {function(state)} settings.callback called with the current state, when it changes. state is a string
                     * @return {jQuery}
                     */
                    input(settings) {
                        settings = $.extend({
                            value: '',
                            disabled: false,
                            callback: $.noop,
                        }, settings);

                        const input = $("<input>").attr("type", "text")
                            .prop("value", settings.value)
                            .prop("disabled", settings.disabled);

                        const inner = $("<div>").addClass("input-inner")
                            .append(input)
                            .append($("<span>"));

                        const outer = $("<div>").addClass("input").append(inner);

                        if (settings.disabled) {
                            outer.addClass("disabled");
                        }

                        if (typeof settings.label === "string") {
                            outer.append($("<span>").text(settings.label));
                        } else if (settings.label !== undefined) {
                            outer.append($("<span>").append(settings.label));
                        }

                        input.on("change.kawaiiSettings", function() {
                            if (!input.prop("disabled")) {
                                const value = input.val();
                                settings.callback(value);
                            }
                        });

                        const item = $("<li>").append(outer);

                        let help;
                        if (typeof settings.help === "string") {
                            help = $("<div>").text(settings.help);
                        } else if (settings.help !== undefined) {
                            help = $("<div>").append(settings.help);
                        }

                        if (help !== undefined) {
                            help.appendTo(item)
                                .addClass("help-text")
                                .css("margin-top", "-3px")
                                .css("margin-left", "27px");
                        }

                        return item;
                    }
                };

                window.v1transpile.PluginApi.prototype.injectStyle = (id, css) => BdApi.injectCSS(id, css);
                window.v1transpile.PluginApi.prototype.removeStyle = (id) => BdApi.clearCSS(id);

                window.v1transpile.PluginStorage.prototype.load = function() {
                    this.settings = JSON.parse(JSON.stringify(this.defaultConfig));
                    this.path = this.path.replace('/settings.json', '');
                    if (!window.bdPluginStorage) {
                        return;
                    }
                    try {
                        const loadSettings = bdPluginStorage.get(this.path, "settings");
                        if (loadSettings) {
                            Object.keys(loadSettings).map(key => {
                                this.setSetting(key, loadSettings[key]);
                            });
                        }
                    } catch (err) {
                        console.warn(this.path, ":", "unable to load settings:", err);
                    }
                };

                window.v1transpile.PluginStorage.prototype.save = function() {
                    const reduced = this.settings.reduce((result, item) => {
                        result[item.id] = item.value;
                        return result;
                    }, {});
                    try {
                        bdPluginStorage.set(this.path, "settings", reduced);
                    } catch (err) {
                        console.warn(this.path, ":", "unable to save settings:", err);
                    }
                };

                window.v1transpile.Vendor = window.v1transpile.Vendor || {
                    get jQuery() {
                        return window.jQuery;
                    },
                    get $() {
                        return window.jQuery;
                    },
                    get React() {
                        return window.BDV2.react;
                    },
                    get ReactDOM() {
                        return window.BDV2.reactDom;
                    },
                    moment: {}
                };
            }

            const storage = new window.v1transpile.PluginStorage(config.info.name.replace(/\s+/g, '_').toLowerCase(), config.defaultSettings);
            const BD = {
                Api: new window.v1transpile.PluginApi(config.info),
                Storage: storage,
                Events: {},
                Renderer: {}
            };

            const plugin = __webpack_require__(17)(window.v1transpile.Plugin, BD, window.v1transpile.Vendor, true);
            this.pluginInstance = new plugin(config.info);

            this.pluginInstance.internal = {
                storage,
                path: ''
            };
        }

        start() {
            this.pluginInstance.onStart();
            this.pluginInstance.storage.load();
        }

        stop() {
            this.pluginInstance.onStop();
        }

        load() {
        }

        unload() {
        }

        getName() {
            return this.pluginInstance.name
        }

        getDescription() {
            return this.pluginInstance.description
        }

        getVersion() {
            return this.pluginInstance.version
        }

        getAuthor() {
            return this.pluginInstance.authors.join(', ')
        }

        getSettingsPanel() {
            if (this.pluginInstance.storage.settings.length === 0)
                return '';
            const Settings = window.v1transpile.Settings;

            const panel = Settings.topPanel();
            const filterControls = Settings.controlGroups().appendTo(panel);

            const Control = Settings.controlGroup({label: this.pluginInstance.name + " settings"})
                .appendTo(filterControls);
            const saveAndReload = () => {
                this.pluginInstance.storage.save();
                if (window.pluginCookie && window.pluginCookie[this.pluginInstance.name]) {
                    this.pluginInstance.onStop();
                    Promise.resolve().then(() => {
                    }).then(() => {
                        this.pluginInstance.onStart();
                    });
                }
            };
            for (let item of this.pluginInstance.storage.settings) {
                let input;
                switch (item.type) {
                    case 'bool':
                        input = Settings.checkbox({
                            label: item.text,
                            help: item.description,
                            checked: item.value,
                            callback: state => {
                                this.pluginInstance.storage.setSetting(item.id, state);
                                saveAndReload();
                            },
                        });
                        break;
                    case 'text':
                        input = Settings.input({
                            label: item.text,
                            help: item.description,
                            value: item.value,
                            callback: state => {
                                this.pluginInstance.storage.setSetting(item.id, state);
                                saveAndReload();
                            },
                        });
                        break;
                }
                if (input)
                    Control.append(input)
            }

            return panel[0];
        }
    };

/***/ }),
/* 16 */
/***/ (function(module, exports) {

    module.exports = {
        "info": {
            "name": "SimpleFornite",
            "authors": [
                "Simple#0001",
                "samogot",
                "square#3880"
            ],
            "version": "1.0.0",
            "description": "Enhances the moderation of the Fortnite Discord server.",
            "repository": "https://github.com/reecebenson/FortniteModeration",
            "homepage": "",
            "reloadable": true
        },
        "defaultSettings": [],
        "permissions": []
    };

/***/ }),
/* 17 */
/***/ (function(module, exports) {

    module.exports = (Plugin, BD) => {

        const {Api} = BD;

        const minDIVersion = '1.0';
        if (!window.DiscordInternals) {
            const message = `Lib Discord Internals v${minDIVersion} or higher not found! Please install or upgrade that utility plugin. See install instructions here https://goo.gl/kQ7UMV`;
            Api.log(message, 'warn');
            return (class EmptyStubPlugin extends Plugin {
                onStart() {
                    Api.log(message, 'warn');
                    alert(message);
                    return false;
                }

                onStop() {
                    return true;
                }
            });
        }

        const {monkeyPatch, WebpackModules, ReactComponents, getOwnerInstance, React, Renderer, Filters} = window.DiscordInternals;

        // Deffer module loading
        let moment, Constants, GuildsStore, UsersStore, MembersStore, SubMenuItem, UserSettingsStore, MessageActionsSend, MessageActions, MessageQueue, MessageParser, HistoryUtils, PermissionUtils, ContextMenuActions, ModalsStack, ContextMenuItemsGroup, ContextMenuItem, ExternalLink, ConfirmModal;
        function loadAllModules() {
            moment = WebpackModules.findByUniqueProperties(['parseZone']);

            Constants = WebpackModules.findByUniqueProperties(['Routes', 'ChannelTypes']);

            GuildsStore = WebpackModules.findByUniqueProperties(['getGuild']);
            UsersStore = WebpackModules.findByUniqueProperties(['getUser', 'getCurrentUser']);
            MembersStore = WebpackModules.findByUniqueProperties(['getNick']);
            UserSettingsStore = WebpackModules.findByUniqueProperties(['developerMode', 'locale']);

            MessageActionsSend = WebpackModules.findByUniqueProperties(["sendMessage"]);
            MessageActions = WebpackModules.findByUniqueProperties(['jumpToMessage', '_sendMessage']);
            MessageQueue = WebpackModules.findByUniqueProperties(['enqueue']);
            MessageParser = WebpackModules.findByUniqueProperties(['createMessage', 'parse', 'unparse']);
            HistoryUtils = WebpackModules.findByUniqueProperties(['transitionTo', 'replaceWith', 'getHistory']);
            PermissionUtils = WebpackModules.findByUniqueProperties(['getChannelPermissions', 'can']);
            ContextMenuActions = WebpackModules.find(Filters.byCode(/CONTEXT_MENU_CLOSE/, c => c.close));

            ModalsStack = WebpackModules.findByUniqueProperties(['push', 'update', 'pop', 'popWithKey']);

            ContextMenuItemsGroup = WebpackModules.find(Filters.byCode(/itemGroup/));
            ContextMenuItemsGroup.displayName = 'ContextMenuItemsGroup';
            ContextMenuItem = WebpackModules.find(Filters.byCode(/\.label\b.*\.hint\b.*\.action\b/));
            ContextMenuItem.displayName = 'ContextMenuItem';

            SubMenuItem = WebpackModules.findByDisplayName("SubMenuItem");

            ExternalLink = WebpackModules.find(Filters.byCode(/\.trusted\b/));
            ExternalLink.displayName = 'ExternalLink';
            ConfirmModal = WebpackModules.find(Filters.byPrototypeFields(['handleCancel', 'handleSubmit', 'handleMinorConfirm']));
            ConfirmModal.displayName = 'ConfirmModal';
            // const TooltipWrapper = WebpackModules.find(Filters.byPrototypeFields(['showDelayed']));
            // TooltipWrapper.displayName = 'TooltipWrapper';
        }

        // ReactComponents.setName('Message', Filters.byPrototypeFields(['renderOptionPopout', 'renderUserPopout', 'handleMessageContextMenu']));
        // ReactComponents.setName('ChannelTextAreaForm', Filters.byPrototypeFields(['handleTextareaChange', 'render']));
        // ReactComponents.setName('OptionPopout', Filters.byPrototypeFields(['handleCopyId', 'handleEdit', 'handleRetry', 'handleDelete', 'handleReactions', '', '', '', '']));
        ReactComponents.setName('Embed', Filters.byPrototypeFields(['isMaskedLinkTrusted', 'renderProvider', 'renderAuthor', 'renderFooter', 'renderTitle', 'renderDescription', 'renderFields', 'renderImage', 'renderVideo', 'renderGIFV', 'hasProvider', 'renderSpotify']));
        ReactComponents.setName('MessageContextMenu', Filters.byCode(/\.ContextMenuTypes\.MESSAGE_MAIN\b[\s\S]*\.ContextMenuTypes\.MESSAGE_SYSTEM\b/, c => c.prototype && c.prototype.render));
        ReactComponents.setName('MessageResendItem', Filters.byPrototypeFields(['handleResendMessage', 'render']));
        ReactComponents.setName('MessageGroup', Filters.byCode(/"message-group"[\s\S]*"has-divider"[\s\S]*"hide-overflow"[\s\S]*"is-local-bot-message"/, c => c.prototype && c.prototype.render));

        const BASE_JUMP_URL = 'https://github.com/samogot/betterdiscord-plugins/blob/master/v2/Quoter/link-stub.md';


        class SimpleFortnite extends Plugin {
            constructor(props) {
                super(props);
                this.cancelPatches = [];
                this.options = null;
                this.optionsLink = "https://raw.githubusercontent.com/reecebenson/FortniteModeration/master/options.json";
            }

            onStart() {
                /** Load Modules */
                loadAllModules();

                /** Grab Menu Items */
                this.doUpdate(null, null, null);

                /** Generate Menu */
                this.generateContextMenu();

                return true;
            }

            sendMessage(channel, text) {
                // Process text
                console.log(text);
                text = text.replace("%weatherman%", this.options["identifiers"]["weatherman"]);             // Weatherman
                text = text.replace("%br_squaduos_pc%", this.options["identifiers"]["br_squaduos_pc"]);     // BR PC
                text = text.replace("%br_squaduos_ps4%", this.options["identifiers"]["br_squaduos_ps4"]);   // BR PS4
                text = text.replace("%br_squaduos_xb1%", this.options["identifiers"]["br_squaduos_xb1"]);   // BR XB1
                text = text.replace("%stw_squaduos_pc%", this.options["identifiers"]["stw_squaduos_pc"]);   // STW PC
                text = text.replace("%stw_squaduos_ps4%", this.options["identifiers"]["stw_squaduos_ps4"]); // STW PS4
                text = text.replace("%stw_squaduos_xb1%", this.options["identifiers"]["stw_squaduos_xb1"]); // STW XB1

                // Send our message
                MessageActions.sendMessage(channel.id, {content: text, invalidEmojis: [], tts: false});
            }

            /**
             * MENU BUILDER
             */
            generateContextMenu() {
                ReactComponents.get("MessageContextMenu", MessageContextMenu => {
                    const cancel = Renderer.patchRender(MessageContextMenu, [
                        {
                            selector: { type: ContextMenuItemsGroup },
                            method: "prepend",
                            content: (menu) => React.createElement(SubMenuItem, {
                                label: "Fortnite",
                                render: this.generateMenu(menu, null, null),
                                invertChildY: true
                            })
                        }
                    ]);
                    this.cancelPatches.push(cancel);
                });
            }

            generateMenu({props: {message, channel}}, parent, category) {
                var elements = (() => { 
                    if(parent == null && category == null) {
                        return (() => {
                            let es = [];

                            for(let key in this.options["menu"]) {
                                let val = this.options["menu"][key];
                                let ele = { label: key };

                                if(val._subMenu)
                                    ele.render = () => this.generateMenu(arguments[0], key, val._menuRef);
                                else if(val._doUpdate)
                                    ele.action = this.doUpdate.bind(this, channel, message);
                                else
                                    ele.action = this.runResponse.bind(this, channel, message, val.response ? val.response : null, val.mention ? val.mention : null, val.exec ? val.exec : null);

                                // Danger
                                if(val._danger)
                                    ele.danger = true;

                                // Flip Y
                                if(val._flipY)
                                    ele.invertChildY = true;
                                
                                es.push(ele);
                            }

                            return es;
                        })();
                    } else {
                        return (() => {
                            let es = [];
                            for(let key in this.options["menu"][parent]["inner"]) {
                                let val = this.options["menu"][parent]["inner"][key];
                                let ele = { label: val.label };

                                // Set Action
                                if(val._subMenu)
                                    ele.render = () => this.generateMenu(arguments[0], parent, val._menuRef);
                                else if(val._doUpdate)
                                    ele.action = this.doUpdate.bind(this, channel, message);
                                else
                                    ele.action = this.runResponse.bind(this, channel, message, val.response ? val.response : null, val.mention ? val.mention : null, val.exec ? val.exec : null);
                                        
                                // Danger
                                if(val._danger)
                                    ele.danger = true;

                                // Flip Y
                                if(val._flipY)
                                    ele.invertChildY = true;

                                es.push(ele);
                            }
                            return es;
                        })();
                    }
                })();

                return elements.map(e => React.createElement(e.render ? SubMenuItem : ContextMenuItem, e));
            }

            runResponse(channel, message, response, mention, exec, element) {
                // Close Menu
                this.closeMenu(element);

                // Are we executing a command?
                if(exec) this.processCommand(channel, exec);

                // Are we sending a response?
                if(response) {
                    let authorId = message.author.id;
                    this.sendMessage(channel, `${(mention?"<@!"+authorId+">, ":"")}${response}`);
                }
            }
            /**
             * ***********************************
             * MENU FUNCTIONALITY
             * ***********************************
             */

            closeMenu(menu) {
                menu.preventDefault();
                menu.stopPropagation();
                ContextMenuActions.close();
            }

            async processCommand(channel, cmd) {
                await this.sendMessage(channel, cmd);
            }

            doUpdate(c, m, e) {
                if(e != null)
                    this.closeMenu(e);

                // Update
                this.getFileAsJson(this.optionsLink, (resp) => {
                    // Set our Options
                    this.options = resp;
                    
                    // Version Control
                    let optsVersion = this.options["info"]["version"];
                    let thisVersion = this.version;
                    if(thisVersion != optsVersion) {
                        ModalsStack.push(function(props) { // Can't use arrow function here
                            return React.createElement(ConfirmModal, Object.assign({
                                title: "Updating SimpleFortnite",
                                body: "Hey!\n\nYou tried updating SimpleFortnite, but it seems we have incompatible versions.\nIt isn't that much of an issue, but some things in your version may not function correctly.\n\nPlease ask Simplе#0001 for the latest version! :)",
                                // confirmText: Constants.Messages.OKAY
                            }, props));
                        })
                    }
                });
            }

            cancelAllPatches() {
                for (let cancel of this.cancelPatches)
                    cancel();
            }

            onStop() {
		        this.cancelAllPatches();
                return true;
            }

            getFileAsJson(fileLink, callback) {
                let request = require("request");
                request(fileLink, function(err, resp, body) {
                    callback(JSON.parse(body));
                });
            }
        }

        return SimpleFortnite;
    };

/***/ })
/******/ ]);

/*@end @*/
