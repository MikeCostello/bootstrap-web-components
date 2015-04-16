// Popover
XPopover = document.registerElement(prefix + '-popover', {
	prototype: Object.create(XTooltip.prototype, {
		plugin: {
			value: {
				namespace: 'bs.popover',
				name: 'popover'
			}
		}
	})
});