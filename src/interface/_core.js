function CoreInterface(core) {
	this.editor = core;
	this._w = core._w;
	this._d = core._d;
	this._ww = core._ww;
	this._wd = core._wd;
	this._shadowRoot = core._shadowRoot;
	this.plugins = core.plugins;
	this.icons = core.icons;
	this.status = core.status;
	this.options = core.options;
	this.context = core.context;
	this.history = core.history;
	this.lang = core.lang;
	this.helpers = core.helpers;
}

export default CoreInterface;