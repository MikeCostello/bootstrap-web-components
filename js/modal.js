// Modal
XModal = document.register(prefix + '-modal', {
	prototype: Object.create(HTMLElement.prototype, {
		createdCallback: {
			value: function() {
				// jQuery creates an extra looking for CSS display value
				if (!this.parentNode) {
					return false;
				}

				var template = importDoc.querySelector('#x-modal');
				var modal = template.content.cloneNode(true);
				var elmHeader = modal.querySelector('.modal-header');
				var attrs = this.attributes;
				var options = {};

				this.classList.add('modal');
				this.setAttribute('role', 'modal');

				for (var i = 0; i < attrs.length; i++) {
					var name = attrs[i].name.toLowerCase();
					var value = attrs[i].value;

					if (name === 'title') {
						var elmTitle = modal.querySelector('.modal-title');
						elmTitle.textContent = value;
						elmHeader.classList.remove('x-modal-no-title');

					} else if (name === 'close' && value === 'false') {
						elmHeader.querySelector('.close').classList.add('hide');

					} else if (/backdrop|keyboard|show/i.test(name)) {
						if (/true|false/i.test(value)) {
							value = (value === 'true');
						}

						options[name] = value;
					}
				}

				// Content
				modal.querySelector('.modal-body').innerHTML = this.innerHTML;
				this.innerHTML = '';

				this.appendChild(modal);
				$(this).modal(options);
			}
		},
		attributeChangedCallback: {
			value: function(name, oldValue, value) {
				var $elm = $(this);
				var bsModal = $elm.data('bs.modal');
				var option= {};
				var action;

				if (name === 'title') {
					this.querySelector('.modal-title').textContent = value;

					action = (value === null) ? 'add' : 'remove';
					this.querySelector('.modal-header').classList[action]('x-modal-no-title');

				} else if (name === 'close') {
					action = (value === 'false') ? 'add' : 'remove';
					this.querySelector('.close').classList[action]('hide');

				} else if (/backdrop|keyboard|show/i.test(name)) {
					if (/true|false/i.test(value)) {
						value = (value === 'true');
					}

					option[name] = value;
					$elm.modal($.extend(bsModal.options, option));
				}
			}
		}
	})
});