import { env, converter, domUtils, numbers } from '../helper';
import Constructor, { InitOptions, UpdateButton, CreateShortcuts, CreateStatusbar, RO_UNAVAILABD } from './section/constructor';
import { UpdateStatusbarContext } from './section/context';
import { BASIC_COMMANDS, ACTIVE_EVENT_COMMANDS, SELECT_ALL, DIR_BTN_ACTIVE, SAVE, FONT_STYLE } from './section/actives';
import History from './base/history';
import EventManager from './base/eventManager';
import Events from './base/events';

// class injector
import ClassInjector from '../editorInjector/_classes';

// classes
import Char from './class/char';
import Component from './class/component';
import Format from './class/format';
import HTML from './class/html';
import Menu from './class/menu';
import Node_ from './class/node';
import Notice from './class/notice';
import Offset from './class/offset';
import Selection from './class/selection';
import Shortcuts from './class/shortcuts';
import Toolbar from './class/toolbar';
import Viewer from './class/viewer';

/**
 * @description SunEditor constructor function.
 * @param {Array.<Element>} multiTargets Target textarea
 * @param {Object} options options
 * @returns {Object}
 */
const Editor = function (multiTargets, options) {
	const _d = multiTargets[0].target.ownerDocument || env._d;
	const _w = _d.defaultView || env._w;
	const product = Constructor(multiTargets, options);

	// properties
	this.rootKeys = product.rootKeys;
	this.rootTargets = product.rootTargets;
	this.context = product.context;
	this.frameContext = new _w.Map();
	this.frameOptions = new _w.Map();

	/**
	 * @description Document object
	 * @type {Document}
	 */
	this._d = _d;

	/**
	 * @description Window object
	 * @type {Window}
	 */
	this._w = _w;

	/**
	 * @description Controllers carrier
	 */
	this._carrierWrapper = product.carrierWrapper;
	this._loadingBox = product.carrierWrapper.querySelector('.se-loading-box');
	this._resizeBackground = product.carrierWrapper.querySelector('.se-resizing-back');

	/**
	 * @description Editor options
	 * @type {Object.<string, any>}
	 */
	this.options = product.options;

	/**
	 * @description Plugins
	 * @type {Object.<string, any>}
	 */
	this.plugins = product.plugins || {};

	/**
	 * @description Default icons object
	 * @type {Object.<string, string>}
	 */
	this.icons = product.icons;

	/**
	 * @description loaded language
	 * @type {Object.<string, any>}
	 */
	this.lang = product.lang;

	/**
	 * @description Variables used internally in editor operation
	 * @property {boolean} hasFocus Boolean value of whether the editor has focus
	 * @property {boolean} isDisabled Boolean value of whether the editor is disabled
	 * @property {boolean} isReadOnly Boolean value of whether the editor is readOnly
	 * @property {boolean} isFullScreen State of full screen
	 * @property {number} tabSize Indent size of tab (4)
	 * @property {number} indentSize Indent size (25)px
	 * @property {number} codeIndentSize Indent size of Code view mode (2)
	 * @property {Array} currentNodes  An element array of the current cursor's node structure
	 * @property {Array} currentNodesMap  An element name array of the current cursor's node structure
	 * @property {number} rootKey Current root key
	 */
	this.status = {
		hasFocus: false,
		isDisabled: false,
		isReadOnly: false,
		isChanged: false,
		isFullScreen: false,
		tabSize: 4,
		indentSize: 25,
		codeIndentSize: 2,
		currentNodes: [],
		currentNodesMap: [],
		rootKey: product.rootId,
		_range: null
	};

	/**
	 * @description Is inline mode?
	 */
	this.isInline = null;

	/**
	 * @description Is balloon|balloon-always mode?
	 */
	this.isBalloon = null;

	/**
	 * @description Is balloon-always mode?
	 */
	this.isBalloonAlways = null;

	/**
	 * @description Is subToolbar balloon|balloon-always mode?
	 */
	this.isSubBalloon = null;

	/**
	 * @description Is subToolbar balloon-always mode?
	 */
	this.isSubBalloonAlways = null;

	// ----- Properties not shared with _core -----
	/**
	 * @description All command buttons map
	 */
	this.allCommandButtons = new _w.Map();
	this.subAllCommandButtons = new _w.Map();

	/**
	 * @description Shoutcuts key map
	 */
	this.shortcutsKeyMap = new _w.Map();
	this.reverseKeys = [];

	/**
	 * @description A map with the plugin's buttons having an "active" method and the default command buttons with an "active" action.
	 * Each button is contained in an array.
	 */
	this.commandTargets = new _w.Map();

	/**
	 * @description Plugins array with "active" method.
	 * "activeCommands" runs the "add" method when creating the editor.
	 */
	this.activeCommands = null;

	/**
	 * @description The selection node (selection.getNode()) to which the effect was last applied
	 */
	this.effectNode = null;

	// ----- private properties -----
	/**
	 * @description Closest ShadowRoot to editor if found
	 * @type {ShadowRoot}
	 * @private
	 */
	this._shadowRoot = null;

	/**
	 * @description Plugin call
	 * @private
	 */
	this._onMousedownPlugins = [];
	this._onKeyDownPlugins = [];

	/**
	 * @description Controller, modal relative
	 * @private
	 */
	this.opendModal = null;
	this.opendControllers = [];
	this.currentControllerName = '';
	this._controllerOnDisabledButtons = [];
	this._codeViewDisabledButtons = [];
	this._controllerTargetContext = null;

	/**
	 * @description Button List in Responsive Toolbar.
	 * @private
	 */
	this._pluginCallButtons = product.pluginCallButtons;
	this._pluginCallButtons_sub = product.pluginCallButtons_sub;
	this._responsiveButtons = product.responsiveButtons;
	this._responsiveButtons_sub = product.responsiveButtons_sub;

	/**
	 * @description Variable that controls the "blur" event in the editor of inline or balloon mode when the focus is moved to dropdown
	 * @private
	 */
	this._notHideToolbar = false;

	/**
	 * @description Variables for controlling focus and blur events
	 * @private
	 */
	this._antiBlur = false;

	/**
	 * @description If true, (initialize, reset) all indexes of image, video information
	 * @private
	 */
	this._componentsInfoInit = true;
	this._componentsInfoReset = false;

	/**
	 * @description Information of tags that should maintain HTML structure, style, class name, etc. (In use by "math" plugin)
	 * When inserting "html" such as paste, it is executed on the "html" to be inserted. (html.clean)
	 * Basic Editor Actions:
	 * 1. All classes not starting with "__se__" or "se-" in the editor are removed.
	 * 2. The style of all tags except the "span" tag is removed from the editor.
	 * "_MELInfo" structure ex:
	 * _MELInfo: {
	 *   query: ".__se__xxx, se-xxx"
	 *   map: {
	 *     "__se__xxx": method.bind(core),
	 *     "se-xxx": method.bind(core),
	 *   }
	 * }
	 * @example
	 * Define in the following return format in the "_MELInfo" function of the plugin.
	 * _MELInfo() => {
	 *  return {
	 *    className: "string", // Class name to identify the tag. ("__se__xxx", "se-xxx")
	 *    // Change the html of the "element". ("element" is the element found with "className".)
	 *    // "method" is executed by binding "core".
	 *    method: function (element) {
	 *      // this === core
	 *      element.innerHTML = // (rendered html);
	 *    }
	 *  }
	 * }
	 * @private
	 */
	this._MELInfo = null;

	/**
	 * @description Properties for managing files in the "FileManager" module
	 * @private
	 */
	this._fileInfoPluginsCheck = null;

	/**
	 * @description Properties for managing files in the "FileManager" module
	 * @private
	 */
	this._fileInfoPluginsReset = null;

	/**
	 * @description Variables for file component management
	 * @private
	 */
	this._fileManager = {
		tags: null,
		regExp: null,
		queryString: null,
		pluginRegExp: null,
		pluginMap: null
	};

	/**
	 * @description Current Figure container.
	 * @private
	 */
	this._figureContainer = null;

	/**
	 * @description Origin options
	 * @private
	 */
	this._originOptions = options;

	/** ----- Create editor ------------------------------------------------------------ */
	this.__Create(options);
};

Editor.prototype = {
	/**
	 * @description If the plugin is not added, add the plugin and call the 'add' function.
	 * If the plugin is added call callBack function.
	 * @param {string} pluginName The name of the plugin to call
	 * @param {Array.<Element>|null} targets Plugin target button (This is not necessary if you have a button list when creating the editor)
	 * @param {object|null} pluginOptions Plugin's options
	 */
	registerPlugin: function (pluginName, targets, pluginOptions) {
		let plugin = this.plugins[pluginName];
		if (!plugin) {
			throw Error('[SUNEDITOR.registerPlugin.fail] The called plugin does not exist or is in an invalid format. (pluginName: "' + pluginName + '")');
		} else if (typeof this.plugins[pluginName] === 'function') {
			plugin = this.plugins[pluginName] = new this.plugins[pluginName](this, pluginOptions || {});
			if (typeof plugin.init === 'function') plugin.init();
		}

		if (targets) {
			for (let i = 0, len = targets.length; i < len; i++) {
				UpdateButton(targets[i], plugin, this.icons, this.lang);
			}

			if (this.activeCommands.indexOf(pluginName) === -1 && typeof this.plugins[pluginName].active === 'function') {
				this.activeCommands.push(pluginName);
			}
		}
	},

	/**
	 * @description Run plugin calls and basic commands.
	 * @param {string} command Command string
	 * @param {string} type Display type string ('command', 'dropdown', 'modal', 'container')
	 * @param {Element|null} target The element of command button
	 */
	run: function (command, type, target) {
		if (type) {
			if (/more/i.test(type)) {
				const toolbar = domUtils.getParentElement(target, '.se-toolbar');
				const toolInst = domUtils.hasClass(toolbar, 'se-toolbar-sub') ? this.subToolbar : this.toolbar;
				if (target !== toolInst.currentMoreLayerActiveButton) {
					const layer = toolbar.querySelector('.' + command);
					if (layer) {
						toolInst._moreLayerOn(target, layer);
						toolInst._showBalloon();
						toolInst._showInline();
					}
					domUtils.addClass(target, 'on');
				} else if (toolInst.currentMoreLayerActiveButton) {
					toolInst._moreLayerOff();
					toolInst._showBalloon();
					toolInst._showInline();
				}
				return;
			}

			if (/container/.test(type) && (this.menu.targetMap[command] === null || target !== this.menu.currentContainerActiveButton)) {
				this.menu.containerOn(target);
				return;
			}

			if (this.isReadOnly && domUtils.arrayIncludes(this._controllerOnDisabledButtons, target)) return;
			if (/dropdown/.test(type) && (this.menu.targetMap[command] === null || target !== this.menu.currentDropdownActiveButton)) {
				this.menu.dropdownOn(target);
				return;
			} else if (/modal/.test(type)) {
				this.plugins[command].open();
				return;
			} else if (/command/.test(type)) {
				this.plugins[command].action();
			} else if (/fileBrowser/.test(type)) {
				this.plugins[command].open(null);
			}
		} else if (command) {
			this.commandHandler(command);
		}

		if (/dropdown/.test(type)) {
			this.menu.dropdownOff();
		} else if (!/command/.test(type)) {
			this.menu.dropdownOff();
			this.menu.containerOff();
		}
	},

	/**
	 * @description Execute default command of command button
	 * (selectAll, codeView, fullScreen, indent, outdent, undo, redo, removeFormat, print, preview, showBlocks, save, bold, underline, italic, strike, subscript, superscript, copy, cut, paste)
	 * @param {string} command Property of command button (data-value)
	 */
	commandHandler: function (command) {
		if (this.status.isReadOnly && !/copy|cut|selectAll|codeView|fullScreen|print|preview|showBlocks/.test(command)) return;

		switch (command) {
			case 'copy':
			case 'cut':
				this.execCommand(command);
				break;
			case 'paste':
				// @todo
				break;
			case 'selectAll':
				SELECT_ALL(this);
				break;
			case 'codeView':
				this.viewer.codeView(!this.frameContext.get('isCodeView'));
				break;
			case 'fullScreen':
				this.viewer.fullScreen(!this.frameContext.get('isFullScreen'));
				break;
			case 'indent':
				this.format.indent();
				break;
			case 'outdent':
				this.format.outdent();
				break;
			case 'undo':
				this.history.undo();
				break;
			case 'redo':
				this.history.redo();
				break;
			case 'removeFormat':
				this.format.removeTextStyle();
				this.focus();
				break;
			case 'print':
				this.viewer.print();
				break;
			case 'preview':
				this.viewer.preview();
				break;
			case 'showBlocks':
				this.viewer.showBlocks(!this.frameContext.get('isShowBlocks'));
				break;
			case 'dir':
				this.setDir(this.options.get('_rtl') ? 'ltr' : 'rtl');
				break;
			case 'dir_ltr':
				this.setDir('ltr');
				break;
			case 'dir_rtl':
				this.setDir('rtl');
				break;
			case 'save':
				SAVE(this);
				break;
			default:
				FONT_STYLE(this, command);
		}
	},

	/**
	 * @description Execute "editor.run" with command button.
	 * @param {Element} target Command button
	 */
	runFromTarget: function (target) {
		if (!(target = domUtils.getCommandTarget(target))) return;

		const command = target.getAttribute('data-command');
		const type = target.getAttribute('data-type');

		if (!command && !type) return;
		if (target.disabled) return;

		this.run(command, type, target);
	},

	/**
	 * @description It is executed by inserting the button of commandTargets as the argument value of the "f" function.
	 * "f" is called as long as the button array's length.
	 * @param {string} cmd data-command
	 * @param {Function} f Function.
	 */
	applyCommandTargets: function (cmd, f) {
		if (this.commandTargets.has(cmd)) {
			this.commandTargets.get(cmd).forEach(f);
		}
	},

	/**
	 * @description Executes a function by traversing all root targets.
	 * @param {Function} f Function
	 */
	applyRootTargets: function (f) {
		this.rootTargets.forEach(f);
	},

	/**
	 * @description Checks if the content of the editor is empty.
	 * Display criteria for "placeholder".
	 * @param {frameContext|null} fc Frame context, if not present, currently selected frame context.
	 * @returns {boolean}
	 */
	isEmpty: function (fc) {
		fc = fc || this.frameContext;
		const wysiwyg = fc.get('wysiwyg');
		return domUtils.isZeroWith(wysiwyg.textContent) && !wysiwyg.querySelector(env._allowedEmptyNodeList) && (wysiwyg.innerText.match(/\n/g) || '').length <= 1;
	},

	/**
	 * @description Set direction to "rtl" or "ltr".
	 * @param {string} dir "rtl" or "ltr"
	 */
	setDir: function (dir) {
		const rtl = dir === 'rtl';
		if (this.options.get('_rtl') === rtl) return;

		const fc = this.frameContext;
		this.options.set('_rtl', rtl);

		const plugins = this.plugins;
		for (let k in plugins) {
			if (typeof plugins[k].setDir === 'function') plugins[k].setDir(dir);
		}

		const toolbarWrapper = this.context.get('toolbar._wrapper');
		const statusbarWrapper = this.context.get('statusbar._wrapper');
		if (rtl) {
			this.applyRootTargets(function (e) {
				domUtils.addClass([e.get('topArea'), e.get('wysiwygFrame')], 'se-rtl');
			});
			domUtils.addClass([this._carrierWrapper, toolbarWrapper, statusbarWrapper], 'se-rtl');
		} else {
			this.applyRootTargets(function (e) {
				domUtils.removeClass([e.get('topArea'), e.get('wysiwygFrame')], 'se-rtl');
			});
			domUtils.removeClass([this._carrierWrapper, toolbarWrapper, statusbarWrapper], 'se-rtl');
		}

		const lineNodes = domUtils.getListChildren(
			fc.wysiwyg,
			function (current) {
				return this.format.isLine(current) && (current.style.marginRight || current.style.marginLeft || current.style.textAlign);
			}.bind(this)
		);

		for (let i = 0, len = lineNodes.length, n, l, r; i < len; i++) {
			n = lineNodes[i];
			// indent margin
			r = n.style.marginRight;
			l = n.style.marginLeft;
			if (r || l) {
				n.style.marginRight = l;
				n.style.marginLeft = r;
			}
			// text align
			r = n.style.textAlign;
			if (r === 'left') n.style.textAlign = 'right';
			else if (r === 'right') n.style.textAlign = 'left';
		}

		DIR_BTN_ACTIVE(this, rtl);

		if (this.isBalloon) this.toolbar._showBalloon();
		else if (this.isSubBalloon) this.subToolbar._showBalloon();

		this.effectNode = null;
		this.eventManager.applyTagEffect();
	},

	/**
	 * @description Add or reset option property (Editor is reloaded)
	 * @param {Object} newOptions Options
	 */
	resetOptions: function (newOptions) {
		const _keys = this._w.Object.keys;
		this.viewer.codeView(false);
		this.viewer.showBlocks(false);

		const newKeys = _keys(newOptions);
		CheckResetKeys(newKeys, this.plugins, '');
		if (newKeys.length === 0) return;

		// option merge
		const rootDiff = {};
		const rootKeys = this.rootKeys;
		const rootTargets = this.rootTargets;
		const newRoots = [];
		const newRootKeys = {};
		this._originOptions = [newOptions, this._originOptions].reduce(function (init, option) {
			for (let key in option) {
				if (rootKeys.indexOf(key) > -1 && option[key]) {
					const nro = option[key];
					const newKeys = _keys(nro);
					CheckResetKeys(newKeys, null, key + '.');
					if (newKeys.length === 0) continue;

					rootDiff[key] = new env._w.Map();
					const o = rootTargets.get(key).get('options').get('_origin');
					for (let rk in nro) {
						const roV = nro[rk];
						if (newKeys.indexOf(rk) === -1 || o[rk] === roV) continue;
						rootDiff[key].set(GetResetDiffKey(rk), true);
						o[rk] = roV;
					}
					newRoots.push((newRootKeys[key] = { options: o }));
				} else {
					init[key] = option[key];
				}
			}
			return init;
		}, {});

		// init options
		const options = this.options;
		const newMap = InitOptions(this._originOptions, newRoots).o;
		for (let i = 0, len = newKeys.length, k; i < len; i++) {
			k = newKeys[i];

			/** --------- root start --------- */
			if (newRootKeys[k]) {
				const diff = rootDiff[k];
				const fc = rootTargets.get(k);
				const originOptions = fc.get('options');
				const newOptions = newRootKeys[k].options;

				// statusbar
				if (diff.has('statusbar')) {
					domUtils.removeItem(fc.get('statusbar'));
					if (newOptions.get('statusbar')) {
						const statusbar = CreateStatusbar(newOptions, null).statusbar;
						fc.get('container').appendChild(statusbar);
						UpdateStatusbarContext(statusbar, fc);
						this.eventManager.__addStatusbarEvent(fc, newOptions);
					} else {
						this.eventManager.removeEvent(originOptions.get('__statusbarEvent'));
						newOptions.set('__statusbarEvent', null);
						UpdateStatusbarContext(null, fc);
					}
				}

				// iframe's options
				if (diff.has('iframe_attributes')) {
					const frame = fc.get('wysiwygFrame');
					const originAttr = originOptions.get('iframe_attributes');
					const newAttr = newOptions.get('iframe_attributes');
					for (let k in originAttr) frame.removeAttribute(k, originAttr[k]);
					for (let k in newAttr) frame.setAttribute(k, newAttr[k]);
				}
				if (diff.has('iframe_cssFileName')) {
					const docHead = fc.get('_wd').head;
					const links = docHead.getElementsByTagName('link');
					while (links[0]) docHead.removeChild(links[0]);
					const parseDocument = new this._w.DOMParser().parseFromString(converter._setIframeStyleLinks(newOptions.get('iframe_cssFileName')), 'text/html');
					const newLinks = parseDocument.head.children;
					const sTag = docHead.querySelector('style');
					while (newLinks[0]) docHead.insertBefore(newLinks[0], sTag);
				}

				// --- options set ---
				fc.set('options', newOptions);

				// frame styles
				this.setEditorStyle(newOptions.get('_defaultStyles'), fc);

				// frame attributes
				const frame = fc.get('wysiwyg');
				const originAttr = originOptions.get('editableFrameAttributes');
				const newAttr = newOptions.get('editableFrameAttributes');
				for (let k in originAttr) frame.removeAttribute(k, originAttr[k]);
				for (let k in newAttr) frame.setAttribute(k, newAttr[k]);

				continue;
			}
			/** --------- root end --------- */

			options.set(k, newMap.get(k));

			/** apply option */
			// history delay time
			if (k === 'historyStackDelayTime') {
				this.history.resetDelayTime(options.get('historyStackDelayTime'));
				continue;
			}
			// set dir
			if (k === 'textDirection') {
				this.setDir(options.get('_rtl') ? 'ltr' : 'rtl');
				continue;
			}
		}

		/** apply options */
		// toolbar
		const toolbar = this.context.get('toolbar.main');
		// width
		if (/inline|balloon/i.test(options.get('mode')) && newKeys.indexOf('toolbar_width') > -1) {
			toolbar.style.width = options.get('toolbar_width');
		}
		// hide
		if (options.get('toolbar_hide')) {
			toolbar.style.display = 'none';
		}
		// shortcuts hint
		if (options.get('shortcutsHint')) {
			domUtils.removeClass(toolbar, 'se-shortcut-hide');
		} else {
			domUtils.addClass(toolbar, 'se-shortcut-hide');
		}

		this.effectNode = null;
		this._setFrameInfo(this.rootTargets.get(this.status.rootKey));
	},

	/**
	 * @description Change the current root index.
	 * @param {number} rootKey
	 */
	changeFrameContext: function (rootKey) {
		if (rootKey === this.status.rootKey) return;

		this.status.rootKey = rootKey;
		this._setFrameInfo(this.rootTargets.get(rootKey));
		this.toolbar._resetSticky();
	},

	/**
	 * @description javascript execCommand
	 * @param {string} command javascript execCommand function property
	 * @param {Boolean|undefined} showDefaultUI javascript execCommand function property
	 * @param {string|undefined} value javascript execCommand function property
	 */
	execCommand: function (command, showDefaultUI, value) {
		this.frameContext.get('_wd').execCommand(command, showDefaultUI, command === 'formatBlock' ? '<' + value + '>' : value);
		this.history.push(true);
	},

	/**
	 * @description Focus to wysiwyg area
	 * @param {number|undefined} rootKey Root index
	 */
	focus: function (rootKey) {
		if (rootKey) this.changeFrameContext(rootKey);
		if (this.frameContext.get('wysiwygFrame').style.display === 'none') return;

		if (this.frameOptions.get('iframe') || !this.frameContext.get('wysiwyg').contains(this.selection.getNode())) {
			this._nativeFocus();
		} else {
			try {
				const range = this.selection.getRange();
				if (range.startContainer === range.endContainer && domUtils.isWysiwygFrame(range.startContainer)) {
					const currentNode = range.commonAncestorContainer.children[range.startOffset];
					if (!this.format.isLine(currentNode) && !this.component.is(currentNode)) {
						const br = domUtils.createElement('BR');
						const format = domUtils.createElement(this.options.get('defaultLine'), null, br);
						this.frameContext.get('wysiwyg').insertBefore(format, currentNode);
						this.selection.setRange(br, 0, br, 0);
						return;
					}
				}
				this.selection.setRange(range.startContainer, range.startOffset, range.endContainer, range.endOffset);
			} catch (e) {
				console.warn('[SUNEDITOR.focus.warn] ' + e);
				this._nativeFocus();
			}
		}

		this.eventManager.applyTagEffect();
		if (this.isBalloon) this.eventManager._toggleToolbarBalloon();
	},

	/**
	 * @description If "focusEl" is a component, then that component is selected; if it is a format element, the last text is selected
	 * If "focusEdge" is null, then selected last element
	 * @param {Element|null} focusEl Focus element
	 */
	focusEdge: function (focusEl) {
		if (!focusEl) focusEl = this.frameContext.get('wysiwyg').lastElementChild;

		const fileComponentInfo = this.component.get(focusEl);
		if (fileComponentInfo) {
			this.component.select(fileComponentInfo.target, fileComponentInfo.pluginName);
		} else if (focusEl) {
			focusEl = domUtils.getEdgeChild(
				focusEl,
				function (current) {
					return current.childNodes.length === 0 || current.nodeType === 3;
				},
				true
			);
			if (!focusEl) this._nativeFocus();
			else this.selection.setRange(focusEl, focusEl.textContent.length, focusEl, focusEl.textContent.length);
		} else {
			this.focus();
		}
	},

	/**
	 * @description Focusout to wysiwyg area (.blur())
	 */
	blur: function () {
		if (this.frameOptions.get('iframe')) {
			this.frameContext.get('wysiwygFrame').blur();
		} else {
			this.frameContext.get('wysiwyg').blur();
		}
	},

	/**
	 * @description Set "options.get('editorStyle')" style.
	 * Define the style of the edit area
	 * It can also be defined with the "setOptions" method, but the "setEditorStyle" method does not render the editor again.
	 * @param {string} style Style string
	 * @param {FrameContext|null} fc Frame context
	 */
	setEditorStyle: function (style, fc) {
		fc = fc || this.frameContext;
		const fo = fc.get('options');

		const newStyles = converter._setDefaultOptionStyle(fo, style);
		fo.set('_defaultStyles', newStyles);

		// top area
		fc.get('topArea').style.cssText = newStyles.top;

		// code view
		const code = fc.get('code');
		code.style.cssText = fo.get('_defaultStyles').frame;
		code.style.display = 'none';
		if (fo.get('height') === 'auto') {
			code.style.overflow = 'hidden';
		} else {
			code.style.overflow = '';
		}

		// wysiwyg frame
		if (!fo.get('iframe')) {
			fc.get('wysiwygFrame').style.cssText = newStyles.frame + newStyles.editor;
		} else {
			fc.get('wysiwygFrame').style.cssText = newStyles.frame;
			fc.get('wysiwyg').style.cssText = newStyles.editor;
		}
	},

	/**
	 * @description Switch to or off "ReadOnly" mode.
	 * @param {boolean} value "readOnly" boolean value.
	 * @param {string|undefined} rootKey Root key
	 */
	readOnly: function (value, rootKey) {
		const fc = rootKey ? this.rootTargets.get(rootKey) : this.frameContext;

		this.status.isReadOnly = value;
		domUtils.setDisabled(this._controllerOnDisabledButtons, !!value);

		if (value) {
			this._offCurrentController();
			this._offCurrentModal();

			if (this.toolbar.currentMoreLayerActiveButton && this.toolbar.currentMoreLayerActiveButton.disabled) this.toolbar.moreLayerOff();
			if (this.subToolbar && this.subToolbar.currentMoreLayerActiveButton && this.subToolbar.currentMoreLayerActiveButton.disabled) this.subToolbar.moreLayerOff();
			if (this.menu.currentDropdownActiveButton && this.menu.currentDropdownActiveButton.disabled) this.menu.dropdownOff();
			if (this.menu.currentContainerActiveButton && this.menu.currentContainerActiveButton.disabled) this.menu.containerOff();
			if (this.modalForm) this.plugins.modal.close.call(this);

			fc.get('code').setAttribute('readOnly', 'true');
			domUtils.addClass(fc.get('wysiwygFrame'), 'se-read-only');
		} else {
			fc.get('code').removeAttribute('readOnly');
			domUtils.removeClass(fc.get('wysiwygFrame'), 'se-read-only');
		}

		if (this.options.get('hasCodeMirror')) {
			this.viewer._codeMirrorEditor('readonly', !!value, rootKey);
		}
	},

	/**
	 * @description Disable the suneditor
	 * @param {string|undefined} rootKey Root key
	 */
	disable: function (rootKey) {
		const fc = rootKey ? this.rootTargets.get(rootKey) : this.frameContext;

		this.toolbar.disable();
		this._offCurrentController();
		this._offCurrentModal();

		if (this.modalForm) this.plugins.modal.close.call(this);

		fc.get('wysiwyg').setAttribute('contenteditable', false);
		this.isDisabled = true;

		if (this.options.get('hasCodeMirror')) {
			this.viewer._codeMirrorEditor('readonly', true, rootKey);
		} else {
			fc.get('code').setAttribute('disabled', 'disabled');
		}
	},

	/**
	 * @description Enable the suneditor
	 * @param {string|undefined} rootKey Root key
	 */
	enable: function (rootKey) {
		const fc = rootKey ? this.rootTargets.get(rootKey) : this.frameContext;

		this.toolbar.enable();
		fc.get('wysiwyg').setAttribute('contenteditable', true);
		this.isDisabled = false;

		if (this.options.get('hasCodeMirror')) {
			this.viewer._codeMirrorEditor('readonly', false, rootKey);
		} else {
			fc.get('code').removeAttribute('disabled');
		}
	},

	/**
	 * @description Show the suneditor
	 * @param {string|undefined} rootKey Root key
	 */
	show: function (rootKey) {
		const fc = rootKey ? this.rootTargets.get(rootKey) : this.frameContext;
		const topAreaStyle = fc.get('topArea').style;
		if (topAreaStyle.display === 'none') topAreaStyle.display = 'block';
	},

	/**
	 * @description Hide the suneditor
	 * @param {string|undefined} rootKey Root key
	 */
	hide: function (rootKey) {
		const fc = rootKey ? this.rootTargets.get(rootKey) : this.frameContext;
		fc.get('topArea').style.display = 'none';
	},

	/**
	 * @description Destroy the suneditor
	 */
	destroy: function () {
		/** remove history */
		this.history.destroy();

		/** remove event listeners */
		this.eventManager._removeAllEvents();

		/** destroy external library */
		if (this.options.get('codeMirror6Editor')) {
			this.options.get('codeMirror6Editor').destroy();
		}

		/** remove element */
		domUtils.removeItem(this._carrierWrapper);
		domUtils.removeItem(this.context.get('toolbar._wrapper'));
		domUtils.removeItem(this.context.get('toolbar.sub._wrapper'));
		domUtils.removeItem(this.context.get('statusbar._wrapper'));
		this.applyRootTargets(function (e) {
			domUtils.removeItem(e.get('topArea'));
			e.get('options').clear();
			e.clear();
		});

		/** remove object reference */
		this.options.clear();
		this.context.clear();

		let obj = this.plugins;
		for (let k in obj) {
			const p = obj[k];
			if (typeof p._destroy === 'function') p._destroy();
			for (let pk in p) {
				delete p[pk];
			}
			delete obj[k];
		}
		obj = this.events;
		for (let k in obj) {
			delete obj[k];
		}

		obj = ['eventManager', 'char', 'component', 'format', 'html', 'menu', 'node', 'notice', 'offset', 'selection', 'shortcuts', 'toolbar', 'viewer'];
		for (let i = 0, len = obj.length, c; i < len; i++) {
			c = this[obj[i]];
			for (let k in c) {
				delete c[k];
			}
		}
		obj = this.subToolbar;
		if (obj) {
			for (let k in obj) {
				delete obj[k];
			}
		}

		obj = null;
		for (let k in this) {
			delete this[k];
		}

		return null;
	},

	/** ----- private methods ----------------------------------------------------------------------------------------------------------------------------- */
	/**
	 * @description Set frameContext, frameOptions
	 * @param {rootTarget} rt Root target
	 */
	_setFrameInfo: function (rt) {
		this.frameContext = rt;
		this.frameOptions = rt.get('options');
		rt.set('_editorHeight', rt.get('wysiwygFrame').offsetHeight);
		this._lineBreakerButton = rt.get('lineBreaker').querySelector('button');
		this._lineBreaker_t = rt.get('lineBreaker_t');
		this._lineBreaker_b = rt.get('lineBreaker_b');
	},

	/**
	 * @description Off current controllers
	 * @private
	 */
	_offCurrentController: function () {
		const cont = this.opendControllers;
		const fixedCont = [];
		for (let i = 0; i < cont.length; i++) {
			if (cont[i].fixed) {
				fixedCont.push(cont[i]);
				continue;
			}
			if (typeof cont[i].inst.close === 'function') cont[i].inst.close();
			else if (cont[i].form) cont[i].form.style.display = 'none';
		}
		this.opendControllers = fixedCont;
	},

	/**
	 * @description Off current modal
	 * @private
	 */
	_offCurrentModal: function () {
		if (this.opendModal) {
			this.opendModal.close();
		}
	},

	/**
	 * @description Show loading box
	 * @private
	 */
	_openLoading: function () {
		this._loadingBox.style.display = 'block';
	},

	/**
	 * @description Close loading box
	 * @private
	 */
	_closeLoading: function () {
		this._loadingBox.style.display = 'none';
	},

	/**
	 * @description Focus to wysiwyg area using "native focus function"
	 * @private
	 */
	_nativeFocus: function () {
		this.selection.__focus();
		this.selection._init();
	},

	/**
	 * @description Check the components such as image and video and modify them according to the format.
	 * @private
	 */
	_checkComponents: function () {
		for (let i = 0, len = this._fileInfoPluginsCheck.length; i < len; i++) {
			this._fileInfoPluginsCheck[i]();
		}
	},

	/**
	 * @description Initialize the information of the components.
	 * @private
	 */
	_resetComponents: function () {
		for (let i = 0, len = this._fileInfoPluginsReset.length; i < len; i++) {
			this._fileInfoPluginsReset[i]();
		}
	},

	/**
	 * @description Recover the current buttons states from "allCommandButtons" map
	 * @private
	 */
	_recoverButtonStates: function (isSub) {
		const currentButtons = this.context.get(isSub ? 'toolbar.sub.buttonTray' : 'toolbar.buttonTray').querySelectorAll('.se-menu-list button[data-command]');
		const btns = isSub ? this.subAllCommandButtons : this.allCommandButtons;
		for (let i = 0, button, oldButton; i < currentButtons.length; i++) {
			button = currentButtons[i];
			oldButton = btns.get(button.getAttribute('data-command'));
			if (oldButton) {
				button.parentElement.replaceChild(oldButton, button);
			}
		}
	},

	/**
	 * @description Initializ wysiwyg area (Only called from core._init)
	 * @param {Map} e frameContext
	 * @param {string} value initial html string
	 * @private
	 */
	_initWysiwygArea: function (e, value) {
		e.get('wysiwyg').innerHTML =
			this.html.clean(
				typeof value === 'string' ? value : (/^TEXTAREA$/i.test(e.get('originElement').nodeName) ? e.get('originElement').value : e.get('originElement').innerHTML) || '',
				true,
				null,
				null
			) || '<' + this.options.get('defaultLine') + '><br></' + this.options.get('defaultLine') + '>';

		if (e.has('charCounter')) e.get('charCounter').textContent = this.char.getLength();
	},

	/**
	 * @description Called when there are changes to tags in the wysiwyg region.
	 * @private
	 */
	_resourcesStateChange: function (fc) {
		this._iframeAutoHeight(fc);
		this._checkPlaceholder(fc);
	},

	/**
	 * @description Modify the height value of the iframe when the height of the iframe is automatic.
	 * @private
	 */
	_iframeAutoHeight: function (fc) {
		const autoFrame = fc.get('_iframeAuto');
		if (autoFrame) {
			this._w.setTimeout(
				function () {
					fc.get('wysiwygFrame').style.height = autoFrame.offsetHeight + 'px';
				}.bind(this)
			);
		}

		if (autoFrame) {
			this._w.setTimeout(
				function () {
					const h = autoFrame.offsetHeight;
					fc.get('wysiwygFrame').style.height = h + 'px';
					if (!env.isResizeObserverSupported) this.__callResizeFunction(fc, h, null);
				}.bind(this)
			);
		} else if (!env.isResizeObserverSupported) {
			this.__callResizeFunction(fc, fc.get('wysiwygFrame').offsetHeight, null);
		}
	},

	__callResizeFunction: function (fc, h, resizeObserverEntry) {
		h =
			h === -1
				? resizeObserverEntry && resizeObserverEntry.borderBoxSize && resizeObserverEntry.borderBoxSize[0]
					? resizeObserverEntry.borderBoxSize[0].blockSize
					: resizeObserverEntry.contentRect.height +
					  numbers.get(fc.get('wwComputedStyle').getPropertyValue('padding-left')) +
					  numbers.get(fc.get('wwComputedStyle').getPropertyValue('padding-right'))
				: h;
		if (fc.get('_editorHeight') !== h) {
			if (typeof this.events.onResizeEditor === 'function') this.events.onResizeEditor(h, fc.get('_editorHeight'), resizeObserverEntry);
			fc.set('_editorHeight', h);
		}
	},

	/**
	 * @description Set display property when there is placeholder.
	 * @private
	 */
	_checkPlaceholder: function (fc) {
		fc = fc || this.frameContext;
		const placeholder = fc.get('placeholder');

		if (placeholder) {
			if (fc.get('isCodeView')) {
				placeholder.style.display = 'none';
				return;
			}

			if (this.isEmpty(fc)) {
				placeholder.style.display = 'block';
			} else {
				placeholder.style.display = 'none';
			}
		}
	},

	/**
	 * @description Called when after execute "history.push"
	 * @private
	 */
	_onChange_historyStack: function () {
		if (this.status.hasFocus) this.eventManager.applyTagEffect();
		this.status.isChanged = true;
		this.applyCommandTargets('save', function (e) {
			e.removeAttribute('disabled');
		});
		// user event
		if (this.events.onChange) this.events.onChange(this.html.get());
		if (this.context.get('toolbar.main').style.display === 'block') this.toolbar._showBalloon();
		else if (this.context.get('toolbar.sub.main').style.display === 'block') this.subToolbar._showBalloon();
	},

	_codeViewAutoHeight: function () {
		if (this.frameContext.get('isFullScreen')) return;
		this.frameContext.get('code').style.height = this.frameContext.get('code').scrollHeight + 'px';
	},

	/**
	 * @description Initializ editor
	 * @private
	 */
	__editorInit: function (options) {
		this.applyRootTargets(
			function (e) {
				this.__setEditorParams(e);
				this._initWysiwygArea(e, e.get('options').get('value'));
				this.eventManager._addFrameEvents(e);
			}.bind(this)
		);

		// initialize core and add event listeners
		this._setFrameInfo(this.rootTargets.get(this.status.rootKey));
		this.__init(options);

		this._componentsInfoInit = false;
		this._componentsInfoReset = false;
		this._checkComponents();

		this.eventManager._addCommonEvents();

		this._w.setTimeout(
			function () {
				// toolbar visibility
				this.context.get('toolbar.main').style.visibility = '';
				// roots
				this.applyRootTargets(
					function (e) {
						if (typeof this._resourcesStateChange !== 'function') return;
						// observer
						if (this.eventManager._resizeObserver) this.eventManager._resizeObserver.observe(e.get('wysiwygFrame'));
						if (this.eventManager._toolbarObserver) this.eventManager._toolbarObserver.observe(e.get('_toolbarShadow'));
						// resource state
						this._resourcesStateChange(e);
					}.bind(this)
				);
				// history reset
				this.history.reset();
				// user event
				if (typeof this.events.onload === 'function') this.events.onload();
			}.bind(this)
		);
	},

	/**
	 * @description Initializ core variable
	 * @private
	 */
	__init: function (options) {
		this.__cachingButtons();

		// file components
		this._fileInfoPluginsCheck = [];
		this._fileInfoPluginsReset = [];

		// text components
		this._MELInfo = {
			query: '',
			map: {}
		};

		// Command and file plugins registration
		this.activeCommands = ACTIVE_EVENT_COMMANDS;
		this._onMousedownPlugins = [];
		this._onKeyDownPlugins = [];
		this._fileManager.tags = [];
		this._fileManager.pluginMap = {};

		const plugins = this.plugins;
		const isArray = this._w.Array.isArray;
		const managedClass = [];
		let filePluginRegExp = [];
		let plugin;
		for (let key in plugins) {
			this.registerPlugin(key, this._pluginCallButtons[key], options[key]);
			this.registerPlugin(key, this._pluginCallButtons_sub[key], options[key]);
			plugin = this.plugins[key];

			// Filemanager
			if (typeof plugin.__fileManagement === 'object') {
				const fm = plugin.__fileManagement;
				this._fileInfoPluginsCheck.push(fm._checkInfo.bind(fm));
				this._fileInfoPluginsReset.push(fm._resetInfo.bind(fm));
				if (isArray(fm.tagNames)) {
					const tagNames = fm.tagNames;
					this._fileManager.tags = this._fileManager.tags.concat(tagNames);
					filePluginRegExp.push(key);
					for (let tag = 0, tLen = tagNames.length; tag < tLen; tag++) {
						this._fileManager.pluginMap[tagNames[tag].toLowerCase()] = key;
					}
				}
			}

			if (typeof plugin.onPluginMousedown === 'function') {
				this._onMousedownPlugins.push(plugin.onPluginMousedown.bind(plugin));
			}

			if (typeof plugin.onPluginKeyDown === 'function') {
				this._onKeyDownPlugins.push(plugin.onPluginKeyDown.bind(plugin));
			}

			if (plugin.preservedClass) {
				const info = plugin.preservedClass();
				managedClass.push('.' + info.className);
				this._MELInfo.map[info.className] = info.method;
			}
		}

		this._MELInfo.query = managedClass.toString();
		this._fileManager.queryString = this._fileManager.tags.join(',');
		this._fileManager.regExp = new this._w.RegExp('^(' + (this._fileManager.tags.join('|') || '\\^') + ')$', 'i');
		this._fileManager.pluginRegExp = new this._w.RegExp('^(' + (filePluginRegExp.length === 0 ? '\\^' : filePluginRegExp.join('|')) + ')$', 'i');

		delete this._pluginCallButtons;
		delete this._pluginCallButtons_sub;
	},

	/**
	 * @description Caching basic buttons to use
	 * @private
	 */
	__cachingButtons: function () {
		const ctx = this.context;
		const codeDisabledQuery = '.se-menu-list button[data-command]:not([class~="se-code-view-enabled"]):not([data-type="MORE"])';
		const controllerDisabledQuery = '.se-menu-list button[data-command]:not([class~="se-resizing-enabled"]):not([data-type="MORE"])';

		this._codeViewDisabledButtons = converter.nodeListToArray(ctx.get('toolbar.buttonTray').querySelectorAll(codeDisabledQuery));
		this._controllerOnDisabledButtons = converter.nodeListToArray(ctx.get('toolbar.buttonTray').querySelectorAll(controllerDisabledQuery));

		if (this.options.has('_subMode')) {
			this._codeViewDisabledButtons = this._codeViewDisabledButtons.concat(converter.nodeListToArray(ctx.get('toolbar.sub.buttonTray').querySelectorAll(codeDisabledQuery)));
			this._controllerOnDisabledButtons = this._controllerOnDisabledButtons.concat(
				converter.nodeListToArray(ctx.get('toolbar.sub.buttonTray').querySelectorAll(controllerDisabledQuery))
			);
		}

		this.__saveCommandButtons();
	},

	/**
	 * @description Save the current buttons states to "allCommandButtons" map
	 * @private
	 */
	__saveCommandButtons: function (isSub) {
		const currentButtons = this.context.get(isSub ? 'toolbar.sub.buttonTray' : 'toolbar.buttonTray').querySelectorAll('.se-menu-list button[data-command]');
		const cmdButtons = isSub ? this.subAllCommandButtons : this.allCommandButtons;
		const shortcuts = this.options.get('shortcuts');
		const reverseCommandArray = this.options.get('_reverseCommandArray');
		const keyMap = this.shortcutsKeyMap;
		const reverseKeys = this.reverseKeys;

		for (let i = 0, e, c; i < currentButtons.length; i++) {
			e = currentButtons[i];
			c = e.getAttribute('data-command');
			// command set
			cmdButtons.set(c, e);
			this.__setCommandTargets(c, e);
			// shortcuts
			CreateShortcuts(c, e, shortcuts[c], keyMap, reverseCommandArray, reverseKeys);
		}

		if (!isSub && this.options.has('_subMode')) {
			this.__saveCommandButtons(true);
		}
	},

	__setCommandTargets: function (cmd, target) {
		if (!cmd || !target) return;

		const isBasicCmd = BASIC_COMMANDS.indexOf(cmd) > -1;
		if (!isBasicCmd && !this.plugins[cmd]) return;

		if (!this.commandTargets.get(cmd)) {
			this.commandTargets.set(cmd, [target]);
		} else if (this.commandTargets.get(cmd).indexOf(target) < 0) {
			this.commandTargets.get(cmd).push(target);
		}
	},

	__setIframeDocument(frame, originOptions, targetOptions) {
		frame.setAttribute('scrolling', 'auto');
		frame.contentDocument.head.innerHTML =
			'<meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">' +
			converter._setIframeStyleLinks(targetOptions.get('iframe_cssFileName')) +
			converter._setAutoHeightStyle(targetOptions.get('height'));
		frame.contentDocument.body.className = originOptions.get('_editableClass');
		frame.contentDocument.body.setAttribute('contenteditable', true);
	},

	__setEditorParams: function (e) {
		const frameOptions = e.get('options');
		const _w = this._w;

		e.set('wwComputedStyle', _w.getComputedStyle(e.get('wysiwyg')));

		if (!frameOptions.get('iframe') && typeof _w.ShadowRoot === 'function') {
			let child = e.get('wysiwygFrame');
			while (child) {
				if (child.shadowRoot) {
					this._shadowRoot = child.shadowRoot;
					break;
				} else if (child instanceof _w.ShadowRoot) {
					this._shadowRoot = child;
					break;
				}
				child = child.parentNode;
			}
		}

		// wisywig attributes
		const attr = frameOptions.get('editableFrameAttributes');
		for (let k in attr) {
			e.get('wysiwyg').setAttribute(k, attr[k]);
		}

		// init, validate
		if (frameOptions.get('iframe')) {
			e.set('_ww', e.get('wysiwygFrame').contentWindow);
			e.set('_wd', e.get('wysiwygFrame').contentDocument);
			e.set('wysiwyg', e.get('_wd').body);
			// e.get('wysiwyg').className += ' ' + options.get('_editableClass');
			if (frameOptions.get('_defaultStyles').editor) e.get('wysiwyg').style.cssText = frameOptions.get('_defaultStyles').editor;
			if (frameOptions.get('height') === 'auto') e.set('_iframeAuto', e.get('_wd').body);
		} else {
			e.set('_ww', _w);
			e.set('_wd', this._d);
		}
	},

	__registerClass: function () {
		// use events, history function
		this.events = Events();
		this.history = History(this, this._onChange_historyStack.bind(this));

		// eventManager
		this.eventManager = new EventManager(this);

		// util classes
		this.offset = new Offset(this);
		this.shortcuts = new Shortcuts(this);
		this.notice = new Notice(this);
		// main classes
		this.toolbar = new Toolbar(this, { keyName: 'toolbar', balloon: this.isBalloon, balloonAlways: this.isBalloonAlways, inline: this.isInline, res: this._responsiveButtons });
		if (this.options.has('_subMode'))
			this.subToolbar = new Toolbar(this, {
				keyName: 'toolbar.sub',
				balloon: this.isSubBalloon,
				balloonAlways: this.isSubBalloonAlways,
				inline: false,
				res: this._responsiveButtons_sub
			});
		this.selection = new Selection(this);
		this.html = new HTML(this);
		this.node = new Node_(this);
		this.component = new Component(this);
		this.format = new Format(this);
		this.menu = new Menu(this);
		this.char = new Char(this);
		this.viewer = new Viewer(this);

		// register classes to the eventManager
		ClassInjector.call(this.eventManager, this);
		// register main classes
		ClassInjector.call(this.char, this);
		ClassInjector.call(this.component, this);
		ClassInjector.call(this.format, this);
		ClassInjector.call(this.html, this);
		ClassInjector.call(this.menu, this);
		ClassInjector.call(this.node, this);
		ClassInjector.call(this.selection, this);
		ClassInjector.call(this.toolbar, this);
		ClassInjector.call(this.viewer, this);
		if (this.options.has('_subMode')) ClassInjector.call(this.subToolbar, this);

		// delete self reference
		delete this.char.char;
		delete this.component.component;
		delete this.format.format;
		delete this.html.html;
		delete this.menu.menu;
		delete this.node.node;
		delete this.selection.selection;
		delete this.toolbar.toolbar;
		delete this.viewer.viewer;
		if (this.subToolbar) delete this.subToolbar.subToolbar;

		this._responsiveButtons = this._responsiveButtons_res = null;
	},

	__Create: function (originOptions) {
		// set modes
		this.isInline = /inline/i.test(this.options.get('mode'));
		this.isBalloon = /balloon/i.test(this.options.get('mode'));
		this.isBalloonAlways = /balloon-always/i.test(this.options.get('mode'));
		// set subToolbar modes
		this.isSubBalloon = /balloon/i.test(this.options.get('_subMode'));
		this.isSubBalloonAlways = /balloon-always/i.test(this.options.get('_subMode'));

		// register class
		this.__registerClass();

		// init
		const inst = this;
		let iframeRootSize = 0;
		let iframeIndex = 0;
		this.applyRootTargets(function (e) {
			const o = e.get('originElement');
			const t = e.get('topArea');
			o.style.display = 'none';
			t.style.display = 'block';
			o.parentNode.insertBefore(t, o.nextElementSibling);

			if (e.get('options').get('iframe')) {
				iframeRootSize++;
				e.get('wysiwygFrame').addEventListener('load', function () {
					inst.__setIframeDocument(this, inst.options, e.get('options'));
					if (iframeRootSize === ++iframeIndex) inst.__editorInit(originOptions);
				});
			}

			e.get('editorArea').appendChild(e.get('wysiwygFrame'));
		});

		if (!iframeRootSize) {
			this.__editorInit(originOptions);
		}
	},

	Constructor: Editor
};

function GetResetDiffKey(key) {
	if (/^statusbar/i.test(key)) return 'statusbar';
	return key;
}

function CheckResetKeys(keys, plugins, root) {
	for (let i = 0, len = keys.length, k; i < len; i++) {
		k = keys[i];
		if (RO_UNAVAILABD.indexOf(k) > -1 || (plugins && plugins[k])) {
			console.warn('[SUNEDITOR.warn.resetOptions] "[' + root + k + ']" options not available in resetOptions have no effect.');
			keys.splice(i--, 1);
			len--;
		}
	}
}

export default Editor;
