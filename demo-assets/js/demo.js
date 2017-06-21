document.addEventListener('DOMContentLoaded', function() {
	var codeMirrorSettings = {
		lineNumbers: true,
		mode: {
			name: 'xml',
			htmlMode: true
		}
	};

	var textareas = document.querySelectorAll('textarea');

	function changeHandler(codeMirror) {
		var dataTarget = codeMirror.getTextArea().dataset.target;
		var target = document.querySelector(dataTarget);

		target.innerHTML =  codeMirror.getValue();

		if (/carousel/.test(dataTarget)) {
			Holder.run();
		}
	}

	for (var i = 0; i < textareas.length; i++) {
		var textarea = textareas[i];

		if (textarea.dataset.target) {
			var codeMirror = CodeMirror.fromTextArea(textarea, codeMirrorSettings);

			codeMirror.on('change', changeHandler);
		}
	}
});

(function () {
    function onWebComponentsReady() {
        // imports are loaded and elements have been registered
        console.log('Components are ready');
        document.body.classList.remove("transparent");
    }
    if (window.WebComponents && window.WebComponents.ready) {
        onWebComponentsReady();
    } else {
        window.addEventListener("WebComponentsReady", function () {
            onWebComponentsReady();
        });
    }
})();
