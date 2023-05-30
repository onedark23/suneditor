(function (global, factory) {
	if (typeof module === 'object' && typeof module.exports === 'object') {
		module.exports = global.document ?
			factory(global, true) :
			function (w) {
				if (!w.document) {
					throw new Error('SUNEDITOR_LANG a window with a document');
				}
				return factory(w);
			};
	} else {
		factory(global);
	}
})(typeof window !== 'undefined' ? window : this, function (window, noGlobal) {
	const lang = {
		code: 'ur',
		align: 'رخ',
		alignCenter: 'مرکز میں طرف',
		alignJustify: 'ہر طرف برابر',
		alignLeft: 'بائیں طرف',
		alignRight: 'دائیں طرف',
		audio: 'آواز',
		audio_modal_file: 'فائلوں سے منتخب کریں',
		audio_modal_title: 'آواز داخل کریں',
		audio_modal_url: 'آواز URL',
		autoSize: 'ازخود حجم',
		backgroundColor: 'Highlight Color',	 
		basic: 'بنیادی',
		bold: 'بولڈ',
		caption: 'عنوان',
		center: 'مرکز',
		close: 'بند کریں',
		codeView: 'کوڈ کا نظارہ',
		default: 'طے شدہ',
		deleteColumn: 'ستون حذف کریں',
		deleteRow: 'قطار کو حذف کریں',
		dir_ltr: 'بائیں سے دائیں',
		dir_rtl: 'دائیں سے بائیں',
		edit: 'ترمیم',
		fixedColumnWidth: 'مقررہ ستون کی چوڑائی',
		font: 'فونٹ',
		fontColor: 'لکھائی کا رنگ',
		fontSize: 'سائز',
		formats: 'فارمیٹس',
		fullScreen: 'پوری اسکرین',
		height: 'اونچائی',
		horizontalRule: 'لکیر',
		HorizontalSplit: 'افقی تقسیم',
		hr_dashed: 'ڈیشڈ',
		hr_dotted: 'نقطے دار',
		hr_solid: 'ٹھوس',
		image: 'تصویر',
		imageGallery: 'تصویری نگارخانہ',
		image_modal_altText: 'متبادل متن',
		image_modal_file: 'فائلوں سے منتخب کریں',
		image_modal_title: 'تصویر داخل کریں',
		image_modal_url: 'تصویری URL',
		indent: 'حاشیہ',
		insertColumnAfter: 'اس کے بعد ستون شامل کریں',
		insertColumnBefore: 'پہلے ستون شامل کریں',
		insertRowAbove: 'اوپر قطار شامل کریں',
		insertRowBelow: 'نیچے قطار شامل کریں',
		italic: 'ترچھا',
		layout: 'Layout',
		left: 'بائیں',
		lineHeight: 'لکیر کی اونچائی',
		link: 'لنک',
		link_modal_bookmark: 'بک مارک',
		link_modal_downloadLinkCheck: 'ڈاؤن لوڈ لنک',
		link_modal_newWindowCheck: 'نئی ونڈو میں کھولیں',
		link_modal_text: 'ظاہر کرنے کے لیے متن',
		link_modal_title: 'لنک داخل کریں',
		link_modal_url: 'لنک کرنے کے لیے URL',
		list: 'فہرست',
		math: 'ریاضی',
		math_modal_fontSizeLabel: 'حرف کا سائز',
		math_modal_inputLabel: 'ریاضیاتی اشارے',
		math_modal_previewLabel: 'پیش نظارہ',
		math_modal_title: 'ریاضی',
		maxSize: 'زیادہ سے زیادہ سائز',
		mention: 'تذکرہ',
		menu_bordered: 'سرحدی',
		menu_code: 'کوڈ'
		menu_neon: 'نیین',
		menu_shadow: 'سایہ',
		menu_spaced: 'فاصلہ',
		menu_translucent: 'پارباسی',
		mergeCells: 'حجروں کو ضم کریں',
		minSize: 'کم از کم سائز',
		mirrorHorizontal: 'آئینہ، افقی',
		mirrorVertical: 'آئینہ، عمودی',
		orderList: 'ترتیب شدہ فہرست',
		outdent: 'ہاشیہ واپس',
		paragraphStyle: 'عبارت کا انداز',
		preview: 'پیشنظر',
		print: 'پرنٹ کریں',
		proportion: 'تناسب کو محدود کریں',
		ratio: 'تناسب',
		redo: 'دوبارہ کریں',
		remove: 'حذف',
		removeFormat: 'فارمیٹ کو حذف دیں',
		resize100: '100% کا حجم تبدیل کریں',
		resize25: '25% کا حجم تبدیل کریں',
		resize50: '50% کا حجم تبدیل کریں',
		resize75: '75% کا حجم تبدیل کریں',
		resize: 'Resize',
		revertButton: 'واپس',
		right: 'دائیں',
		rotateLeft: 'بائیں گھومو',
		rotateRight: 'دائیں گھمائیں',
		save: 'محفوظ کریں',
		search: 'تلاش کریں',
		showBlocks: 'ڈبے دکھائیں',
		size: 'حجم',
		splitCells: 'حجروں کو علیدہ کرو',
		strike: 'لکیرہ کردہ',
		submitButton: 'بھیجیں',
		subscript: 'ذیلی',
		superscript: 'انتہائی',
		table: 'میز',
		tableHeader: 'میز کی سرخی',
		tags: 'ٹیگز',
		tag_blockquote: 'اقتباس',
		tag_div: 'عام (div)',
		tag_h: 'ہیڈر',
		tag_p: 'پیراگراف',
		tag_pre: 'کوڈ',
		template: 'سانچہ',
		textStyle: 'متن کا انداز',
		title: 'Title',
		underline: 'انڈر لائن',
		undo: 'واپس کریں',
		unlink: 'لنک ختم کریں',
		unorderList: 'غیر ترتیب شدہ فہرست',
		VerticalSplit: 'عمودی تقسیم',
		video: 'ویڈیو',
		video_modal_file: 'فائلوں سے منتخب کریں',
		video_modal_title: 'ویڈیو داخل کریں',
		video_modal_url: 'ذرائع ابلاغ کا یو آر ایل، یوٹیوب/ویمیو',
		width: 'چوڑائی',
	};

	if (typeof noGlobal === typeof undefined) {
		if (!window.SUNEDITOR_LANG) {
			Object.defineProperty(window, 'SUNEDITOR_LANG', {
				enumerable: true,
				writable: false,
				configurable: false,
				value: {}
			});
		}

		Object.defineProperty(window.SUNEDITOR_LANG, 'ua', {
			enumerable: true,
			writable: true,
			configurable: true,
			value: lang
		});
	}

	return lang;
});