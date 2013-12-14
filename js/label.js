// Label
XLabel = document.register(prefix + '-label', {
	prototype: Object.create(HTMLElement.prototype, {
		createdCallback: {
			value: function() {
				this.attributeChangedCallback('type', '', this.getAttribute('type'));
				this.classList.add('label');
			}
		},
		attributeChangedCallback: {
			value: function(name, oldValue, value) {
				if (name === 'type') {
					this.classList.add('label-' + (value || 'default'));
					if (oldValue) {
						this.classList.remove('label-' + oldValue);

					} else if (oldValue === null) {
						this.classList.remove('label-default');
					}
				}
			}
		}
	})
});