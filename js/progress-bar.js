// Progress Bar
XProgress = document.registerElement(prefix + '-progress', {
	prototype: Object.create(HTMLElement.prototype, {
		createdCallback: {
			value: function() {
				var template = importDoc.querySelector('#x-progress');
				this.appendChild(template.content.cloneNode(true));

				var attrs = this.attributes;
				for (var i = 0; i < attrs.length; i++) {
					this.attributeChangedCallback(attrs[i].name.toLowerCase(), null, attrs[i].value);
				}

				this.classList.add('progress');
			}
		},
		attributeChangedCallback: {
			value: function(name, oldValue, value) {
				var action;
				var elmProgressbar = this.querySelector('[role=progressbar]');

				if (name === 'value') {
					elmProgressbar.setAttribute('aria-valuenow', value);
					elmProgressbar.style.width = value + '%';

				} else if (name === 'type') {
					elmProgressbar.classList.add('progress-bar-' + value);
					if (oldValue) {
						elmProgressbar.classList.remove('progress-bar-' + oldValue);
					}
				} else if (name === 'striped') {
					action = (value === 'false' || value === null) ? 'remove' : 'add';
					this.classList[action]('progress-striped');

				} else if (/animated|active/i.test(name)) {
					action = (value === 'false' || value === null) ? 'remove' : 'add';
					this.classList[action]('active');
				}
			}
		}
	})
});