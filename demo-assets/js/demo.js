$(function() {
	var codeMirrorSettings = {
		lineNumbers: true,
		//readOnly: true,
		mode: {
			name: 'xml',
			htmlMode: true
		}
	};

	$('textarea').each(function() {
		var qsTarget = this.dataset.target;

		if (document.querySelector(qsTarget)) {
			var codeMirror = CodeMirror.fromTextArea(this, codeMirrorSettings);

			codeMirror.on('change', function(codeMirror) {
				document.querySelector(qsTarget).innerHTML =  codeMirror.getValue();
			});
		}
	});
});
