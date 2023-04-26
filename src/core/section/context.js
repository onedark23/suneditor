import { _w } from '../../helper/env';
import { get as getNumber } from '../../helper/numbers';

/**
 * @description Elements and variables you should have
 * @param {Element} editorTargets Target textarea
 * @param {Element} top Editor top area
 * @param {Element} wwFrame Editor wysiwyg frame
 * @param {Element} codeFrame Editor code view frame
 * @param {Element|null} statusbar Editor statusbar
 * @param {any} key root key
 * @returns {Map}
 */
export const CreateFrameContext = function (editorTarget, top, wwFrame, codeFrame, statusbar, key) {
	const m = new _w.Map([
		['key', key],
		['options', editorTarget.options],
		['originElement', editorTarget.target],
		['topArea', top],
		['container', top.querySelector('.se-container')],
		['editorArea', top.querySelector('.se-wrapper')],
		['wysiwygFrame', wwFrame],
		['wysiwyg', wwFrame], // options.iframe ? wwFrame.contentDocument.body : wwFrame
		['code', codeFrame],
		['lineBreaker', top.querySelector('.se-line-breaker')],
		['lineBreaker_t', top.querySelector('.se-line-breaker-component-t')],
		['lineBreaker_b', top.querySelector('.se-line-breaker-component-b')],
		['_stickyDummy', top.querySelector('.se-toolbar-sticky-dummy')],
		['_toolbarShadow', top.querySelector('.se-toolbar-shadow')],
		['_minHeight', getNumber(wwFrame.style.minHeight || '65', 0)]
	]);

	if (statusbar) {
		m.set('statusbar', statusbar);
		const navigation = statusbar.querySelector('.se-navigation');
		const charWrapper = statusbar.querySelector('.se-char-counter-wrapper');
		const charCounter = statusbar.querySelector('.se-char-counter-wrapper .se-char-counter');
		if (navigation) m.set('navigation', navigation);
		if (charWrapper) m.set('charWrapper', charWrapper);
		if (charCounter) m.set('charCounter', charCounter);
	}

	const placeholder = top.querySelector('.se-placeholder');
	if (placeholder) m.set('placeholder', placeholder);

	return m;
};

/**
 * @description Common elements and variables you should have
 * @param {Element} toolbar Toolbar frame
 * @param {Element|null} toolbarContainer Toolbar container
 * @param {Element} menuTray menu tray
 * @param {Element|null} subbar sub toolbar
 * @returns {Map}
 */
export const CreateContext = function (toolbar, toolbarContainer, menuTray, subbar, statusbarContainer) {
	const m = new _w.Map([
		['menuTray', menuTray],
		['toolbar.main', toolbar],
		['toolbar.buttonTray', toolbar.querySelector('.se-btn-tray')],
		['toolbar._arrow', toolbar.querySelector('.se-arrow')],
		['toolbar._wrapper', toolbar.parentElement.parentElement],
		['_stickyDummy', toolbarContainer ? toolbarContainer.querySelector('.se-toolbar-sticky-dummy') : null]
	]);

	if (subbar) {
		m.set('toolbar.sub.main', subbar);
		m.set('toolbar.sub.buttonTray', subbar.querySelector('.se-btn-tray'));
		m.set('toolbar.sub._arrow', subbar.querySelector('.se-arrow'));
		m.set('toolbar.sub._wrapper', subbar.parentElement.parentElement);
	}

	if (statusbarContainer) {
		m.set('statusbar._wrapper', statusbarContainer);
	}

	return m;
};
