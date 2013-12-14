// Tooltip
XTooltip = document.register(prefix + '-tooltip', {
	prototype: Object.create(HTMLElement.prototype, {
		plugin: {
			value: {
				namespace: 'bs.tooltip',
				name: 'tooltip'
			}
		},
		createdCallback: {
			value: function() {
				var attrFor = this.getAttribute('for');
				var id = attrFor ? '#' + attrFor : null;
				var $elm = $(id || this);
				var attrs = this.attributes;
				var defaults = $.fn[this.plugin.name].Constructor.DEFAULTS;
				var options = {};

				for (var i = 0; i < attrs.length; i++) {
					var name = attrs[i].name.toLowerCase();
					var value = attrs[i].value;

					if (name === 'for') {
						this.classList.add('hide');

						if (('content' in defaults) && !('content' in attrs)) {
							options.content = this.innerHTML;
						} else if (!('title' in attrs)) {
							options.title = this.innerHTML;
						}
					} else if (/^[delay]/i.test(name)) {
						var delays = name.split('-');

						if (delays.length === 1) {
							options.delay = {
								show: value,
								hide: value
							};
						} else {
							options.delay = options.delay || {};
							options.delay[delays[1]] = value;
						}
					} else if (name in defaults) {
						if (/true|false/i.test(value)) {
							value = (value === 'true');
						}

						options[name] = value;
					}
				}

				$elm[this.plugin.name](options);
			}
		},
		attributeChangedCallback: {
			value: function(name, oldValue, value) {
				var defaults = $.fn[this.plugin.name].Constructor.DEFAULTS;
				name = name.toLowerCase();

				if (name === 'for' || name in defaults) {
					var attrFor = this.getAttribute('for');
					var id = attrFor ? '#' + attrFor : null;
					var $elm = $(id || this);
					var bsInstance = $elm.data(this.plugin.namespace) || $('#' + oldValue).data(this.plugin.namespace);
					var option = {};

					if (/^delay/i.test(name)) {
						var delays = name.split('-');

						if (delays.length === 1) {
							option.delay = {
								show: value,
								hide: value
							};
						} else {
							option.delay = option.delay || {};
							option.delay[delays[1]] = value;
						}
					} else if (name === 'title') {
						if (value) {
							this.setAttribute('data-original-title', value);
							this.setAttribute('title', '');
						}
					} else if (name === 'for') {
						// Create new tooltip
						$elm[this.plugin.name](bsInstance.options);
						bsInstance.destroy();
					} else {
						if (/true|false/i.test(value)) {
							value = (value === 'true');
						}

						option[name] = value;
					}

					if (!$.isEmptyObject(option)) {
						$elm[this.plugin.name]($.extend(bsInstance.options, option));
					}
				}
			}
		}
	})
});