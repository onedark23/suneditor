(function (global, factory) {
	if (typeof module === 'object' && typeof module.exports === 'object') {
		module.exports = global.document
			? factory(global, true)
			: function (w) {
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
		code: 'es',
		align: 'Alinear',
		alignCenter: 'Alinear al centro',
		alignJustify: 'Justificar',
		alignLeft: 'Alinear a la izquierda',
		alignRight: 'Alinear a la derecha',
		audio: 'Audio',
		audio_modal_file: 'Seleccionar desde los archivos',
		audio_modal_title: 'Insertar Audio',
		audio_modal_url: 'URL de la audio',
		autoSize: 'Tamaño automático',
		backgroundColor: 'Color de resaltado',
		basic: 'Basico',
		bold: 'Negrita',
		caption: 'Insertar descripción',
		center: 'Centro',
		close: 'Cerrar',
		codeView: 'Ver código fuente',
		default: 'Valor por defecto',
		deleteColumn: 'Eliminar columna',
		deleteRow: 'Eliminar fila',
		dir_ltr: 'De izquierda a derecha',
		dir_rtl: 'De derecha a izquierda',
		edit: 'Editar',
		fixedColumnWidth: 'Ancho de columna fijo',
		font: 'Fuente',
		fontColor: 'Color de fuente',
		fontSize: 'Tamaño de fuente',
		formats: 'Formato',
		fullScreen: 'Pantalla completa',
		height: 'Alto',
		horizontalLine: 'Línea horizontal',
		horizontalSplit: 'División horizontal',
		hr_dashed: 'Línea horizontal discontinua',
		hr_dotted: 'Línea horizontal punteada',
		hr_solid: 'Línea horizontal sólida',
		image: 'Imagen',
		imageGallery: 'Galería de imágenes',
		image_modal_altText: 'Texto alternativo',
		image_modal_file: 'Seleccionar desde los archivos',
		image_modal_title: 'Insertar Imagen',
		image_modal_url: 'URL de la imagen',
		indent: 'Más tabulación',
		insertColumnAfter: 'Insertar columna después',
		insertColumnBefore: 'Insertar columna antes',
		insertRowAbove: 'Insertar fila arriba',
		insertRowBelow: 'Insertar fila debajo',
		italic: 'Cursiva',
		layout: 'Layout',
		left: 'Izquierda',
		lineHeight: 'Altura de la línea',
		link: 'Link',
		link_modal_bookmark: 'Marcador',
		link_modal_downloadLinkCheck: 'Enlace de descarga',
		link_modal_newWindowCheck: 'Abrir en nueva ventana',
		link_modal_text: 'Texto para mostrar',
		link_modal_title: 'Insertar Link',
		link_modal_url: 'URL del link',
		list: 'Lista',
		math: 'Matemáticas',
		math_modal_fontSizeLabel: 'Tamaño de fuente',
		math_modal_inputLabel: 'Notación Matemática',
		math_modal_previewLabel: 'Vista previa',
		math_modal_title: 'Matemáticas',
		maxSize: 'Tamaño máximo',
		mention: 'Mencionar',
		menu_bordered: 'Bordeado',
		menu_code: 'Código'
		menu_neon: 'Neón',
		menu_shadow: 'Sombreado',
		menu_spaced: 'Espaciado',
		menu_translucent: 'Translúcido',
		mergeCells: 'Combinar celdas',
		minSize: 'Tamaño minímo',
		mirrorHorizontal: 'Espejo, Horizontal',
		mirrorVertical: 'Espejo, Vertical',
		orderList: 'Lista ordenada',
		outdent: 'Menos tabulación',
		paragraphStyle: 'Estilo del párrafo',
		preview: 'Vista previa',
		print: 'Imprimir',
		proportion: 'Restringir las proporciones',
		ratio: 'Proporción',
		redo: 'Rehacer última acción',
		remove: 'Eliminar',
		removeFormat: 'Eliminar formato',
		resize100: 'Redimensionar 100%',
		resize25: 'Redimensionar 25%',
		resize50: 'Redimensionar 50%',
		resize75: 'Redimensionar 75%',
		resize: 'Cambiar el tamaño',
		revertButton: 'Revertir',
		right: 'Derecha',
		rotateLeft: 'Girar a la izquierda',
		rotateRight: 'Girar a la derecha',
		save: 'Guardar',
		search: 'Buscar',
		showBlocks: 'Ver bloques',
		size: 'Tamaño',
		splitCells: 'Dividir celdas',
		strike: 'Tachado',
		submitButton: 'Enviar',
		subscript: 'Subíndice',
		superscript: 'Superíndice',
		table: 'Tabla',
		tableHeader: 'Encabezado de la tabla',
		tags: 'Etiquetas',
		tag_blockquote: 'Cita',
		tag_div: 'Normal (DIV)',
		tag_h: 'Título',
		tag_p: 'Párrafo',
		tag_pre: 'Código',
		template: 'Plantilla',
		textStyle: 'Estilo del texto',
		title: 'Título',
		underline: 'Subrayado',
		undo: 'Deshacer última acción',
		unlink: 'Desvincular',
		unorderList: 'Lista desordenada',
		verticalSplit: 'División vertical',
		video: 'Video',
		video_modal_file: 'Seleccionar desde los archivos',
		video_modal_title: 'Insertar Video',
		video_modal_url: 'URL del vídeo',
		width: 'Ancho',
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

		Object.defineProperty(window.SUNEDITOR_LANG, 'es', {
			enumerable: true,
			writable: true,
			configurable: true,
			value: lang
		});
	}

	return lang;
});
