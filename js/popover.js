// Popover
XPopover = document.register(prefix + '-popover', {
	prototype: Object.create(XTooltip.prototype, {
		plugin: {
			value: {
				namespace: 'bs.popover',
				name: 'popover'
			}
		}
	})
});