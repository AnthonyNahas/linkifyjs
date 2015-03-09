import jQuery from 'jquery';
import linkifyElement from './linkify-element';

let doc;

try {
	doc = document;
} catch (e) {
	doc = null;
}

// Applies the plugin to jQuery
function apply($, doc=null) {

	$.fn = $.fn || {};

	try {
		doc = doc || window && window.document || global && global.document;
	} catch (e) { /* do nothing for now */ }

	if (!doc) {
		throw new Error(
			'Cannot find document implementation. ' +
			'If you are in a non-browser environment like Node.js, ' +
			'pass the document implementation as the third argument to linkifyElement.'
		);
	}

	if (typeof $.fn.linkify === 'function') {
		// Already applied
		return;
	}

	function jqLinkify(opts) {
		opts = linkifyElement.normalize(opts);
		return this.each(function () {
			linkifyElement.helper(this, opts, doc);
		});
	}

	$.fn.linkify = jqLinkify;

	$(doc).ready(function () {
		$('[data-linkify]').each(function () {
			let
			$this = $(this),
			data = $this.data(),
			target = data.linkify,
			options = {
				linkAttributes:		data.linkifyAttributes,
				defaultProtocol: 	data.linkifyDefaultProtocol,
				format:				data.linkifyFormat,
				formatHref:			data.linkifyFormatHref,
				newLine:			data.linkifyNewline, // deprecated
				nl2br:				data.linkifyNl2br,
				tagName:			data.linkifyTagname,
				target:				data.linkifyTarget,
				linkClass:			data.linkifyLinkclass,
			};

			let $target = target === 'this' ? $this : $this.find(target);
			$target.linkify(options);

		});
	});
}

// Apply it right away if possible
if (typeof jQuery !== 'undefined' && doc) {
	apply(jQuery, doc);
}

export default apply;
