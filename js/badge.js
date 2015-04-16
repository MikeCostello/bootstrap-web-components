// Badge
XBadge = document.registerElement(prefix + '-badge', {
	prototype: Object.create(HTMLElement.prototype, {
		createdCallback: {
			value: function() {
				this.classList.add('badge');
			}
		}
	})
});