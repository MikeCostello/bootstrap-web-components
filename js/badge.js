// Badge
XBadge = document.register(prefix + '-badge', {
	prototype: Object.create(HTMLElement.prototype, {
		createdCallback: {
			value: function() {
				this.classList.add('badge');
			}
		}
	})
});